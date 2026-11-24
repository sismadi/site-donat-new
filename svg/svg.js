(function() {
    let cachedData = null;
    let isFetching = false;

const getCSSVarValues = (varName) => {
        if (!varName || !varName.startsWith('var(')) return varName;
        const temp = document.createElement('div');
        temp.style.color = varName;
        document.body.appendChild(temp);
        const style = getComputedStyle(temp).color;
        document.body.removeChild(temp);
        return style || "#47B4ED";
    };

const getCSSVarValue = (varName) => {
    if (!varName || !varName.startsWith('var(')) return varName;
    const cleanVarName = varName.match(/\(([^)]+)\)/)[1].trim();
    const value = getComputedStyle(document.body).getPropertyValue(cleanVarName).trim();
    return value || (cleanVarName === '--pColor' ? '#0C5175' : '#47B4ED');
};


    const generateSVGElement = (id, config, size = "24x24", colorParam = "", opacityParam = "", animation = null) => {
        let svgContent = '';
        let viewBox = config.viewBox || "0 0 24 24";
        const gradId = `g-${id}-${Math.random().toString(36).substr(2, 4)}`;

        const defaultColor = getCSSVarValue('var(--pColor)');
        const defaultColorEnd = getCSSVarValue('var(--pLightColor)');

        // Warna aktif untuk layer 'main'
        const activeColor = colorParam || defaultColor;

        const isGradient = activeColor.includes('-') && !activeColor.startsWith('var(--');
        const fillValue = isGradient ? `url('#${gradId}')` : activeColor;

        const [width, height] = String(size).includes('x') ? size.split('x') : [size, size];

        let defs = "";
        if (isGradient) {
            const [c1, c2] = activeColor.split('-');
            defs = `<defs>
                <linearGradient id="${gradId}" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stop-color="${getCSSVarValue(c1) || defaultColor}"/>
                    <stop offset="100%" stop-color="${getCSSVarValue(c2) || defaultColorEnd}"/>
                </linearGradient>
            </defs>`;
        }

        if (typeof config === 'string') {
            const finalOpacity = opacityParam || "1";
            svgContent = `<path class="svg-p layer-main" d="${config}" fill="${fillValue}" opacity="${finalOpacity}" />`;
        } else if (config.layers) {
            const layers = Array.isArray(config.layers) ? config.layers : Object.values(config.layers);
            layers.forEach((l, index) => {
                const d = (l.ref && cachedData[l.ref]) ? cachedData[l.ref] : l.path;
                const tr = `translate(${l.pos || '0 0'}) scale(${l.scale || 1})`;
                const isMain = l.main === true || index === 1;
                const layerClass = isMain ? 'svg-p layer-main' : 'svg-p';

                const finalFill = isMain ? fillValue : (l.fill || "#ccc");

                let finalOpacity;
                if (index === 0) {
                    finalOpacity = opacityParam || l.opacity || "1";
                } else {
                    finalOpacity = l.opacity || "1";
                }

                if (d) {
                    svgContent += `
                    <g transform="${tr}" opacity="${finalOpacity}">
                        <path class="${layerClass}" d="${d}" fill="${finalFill}" />
                    </g>`;
                }
            });
        }

        const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${width}" height="${height}" class="di-svg">
            ${defs}<g class="${animation || ''}">${svgContent}</g></svg>`;

        return new DOMParser().parseFromString(svgStr, 'image/svg+xml').documentElement;
    };

    // Cache elemen SVG hasil render (key = id|size|warna|opacity|anim|warna tema).
    // Render ulang cukup cloneNode -> tidak parse ulang, tidak ada jeda tampil.
    const svgCache = new Map();
    let themeKey = null;
    const currentTheme = () => {
        if (themeKey === null) {
            themeKey = getCSSVarValue('var(--pColor)') + '|' + getCSSVarValue('var(--pLightColor)');
            // tema bisa berubah (d.controller.color) -> reset key di microtask berikutnya
            Promise.resolve().then(() => { themeKey = null; });
        }
        return themeKey;
    };

    const processImage = (img) => {
        if (!img.parentNode || img.getAttribute('data-loaded')) return;
        const raw = img.getAttribute('data-src');
        if (!raw) return;
        const q = raw.includes('?') ? raw.split('?')[1] : raw;
        const [id, szRaw, col, opa, anim] = q.split('/');
        if (!cachedData || !cachedData[id]) return;

        const key = [id, szRaw, col, opa, anim, currentTheme()].join('|');
        let tpl = svgCache.get(key);
        if (!tpl) {
            tpl = generateSVGElement(id, cachedData[id], szRaw, col, opa, anim);
            svgCache.set(key, tpl);
        }
        const svg = tpl.cloneNode(true);

        // gradient id harus unik per instance
        const grad = svg.querySelector('linearGradient');
        if (grad) {
            const oldId = grad.id, newId = oldId + '-' + Math.random().toString(36).substr(2, 4);
            grad.id = newId;
            svg.querySelectorAll('[fill="url(\'#' + oldId + '\')"]').forEach(el => el.setAttribute('fill', "url('#" + newId + "')"));
        }

        if (img.id) svg.id = img.id;
        svg.setAttribute('class', (img.className ? img.className + ' ' : '') + 'di-svg loaded');
        img.setAttribute('data-loaded', 'true');
        img.parentNode.replaceChild(svg, img);
    };

    const scan = (root) => {
        if (!root || root.nodeType !== 1) return;
        if (root.matches('img[data-src]')) processImage(root);
        else root.querySelectorAll('img[data-src]:not([data-loaded])').forEach(processImage);
    };

    const ensureData = () => {
        if (!cachedData) cachedData = (typeof svgData !== 'undefined') ? svgData : {};
    };

    window.addSVGLibrary = (id, config) => {
        if (!cachedData) cachedData = {};
        cachedData[id] = config;
        // hapus cache lama untuk id ini
        Array.from(svgCache.keys()).forEach(k => { if (k.split('|')[0] === id) svgCache.delete(k); });
        document.querySelectorAll('img[data-src]:not([data-loaded])').forEach(processImage);
    };

    // MutationObserver dipanggil sebagai microtask, SEBELUM browser melukis.
    // Jadi <img data-src> diganti <svg> sebelum sempat terlihat (tanpa kedip).
    const domObserver = new MutationObserver((records) => {
        ensureData();
        for (const r of records) r.addedNodes.forEach(scan);
    });
    domObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('DOMContentLoaded', () => { ensureData(); scan(document.body); });
})();
