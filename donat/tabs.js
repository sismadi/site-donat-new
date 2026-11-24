log=console.log.bind(window.console);
log('donat');


const tabsIcon = {
    "Produk": "buku", "Users": "person", "Lokasi": "geo", "Kasir": "card",
    "Keranjang": "cart", "Kategori": "filter", "Transaksi": "process", "Detail": "file"
};
function tabLabel(tab) {
    const ic = tabsIcon[tab];
    return (ic ? '<img data-src="?' + ic + '/20x20" width="20" height="20" alt=""> ' : '') + '<span>' + tab + '</span>';
}

const tabsData = [
    "Produk","Users","Lokasi","Kasir","Keranjang","Kategori","Transaksi","Detail"
];

// const tabsBar = document.getElementById("tabsBar");
// const moreBtn = document.getElementById("moreBtn");
// const moreMenu = document.getElementById("moreMenu");
// const contentBox = document.getElementById("contentBox");

let visibleTabs = [];
let hiddenTabs = [];
let activeTab = tabsData[0];
let tabsKey = null;          // penanda isi tab bar yang sedang tampil
let tabsGlobalBound = false;

// Tandai tab aktif tanpa membangun ulang DOM (ikon tidak dirender ulang)
function syncTabs() {
    const bar = document.getElementById("tabsBar");
    if (!bar) return;
    Array.from(bar.children).forEach(li => li.classList.toggle("active", li.dataset.tab === activeTab));
}

function renderTabs() {
    const tabsBar = document.getElementById("tabsBar");
    const moreMenu = document.getElementById("moreMenu");
    const moreBtn = document.getElementById("moreBtn");
    if (!tabsBar) return;

    // DOM hanya dibangun ulang bila daftar tab terlihat/tersembunyi berubah
    const key = visibleTabs.join(",") + "|" + hiddenTabs.join(",");
    if (key !== tabsKey || !tabsBar.children.length && visibleTabs.length) {
        tabsKey = key;
        tabsBar.innerHTML = "";
        moreMenu.innerHTML = "";
        visibleTabs.forEach(tab => {
            const li = document.createElement("li");
            li.dataset.tab = tab;
            li.innerHTML = tabLabel(tab);
            li.onclick = () => activateTab(tab);
            tabsBar.appendChild(li);
        });
        hiddenTabs.forEach(tab => {
            const item = document.createElement("div");
            item.dataset.tab = tab;
            item.innerHTML = tabLabel(tab);
            item.onclick = () => activateTab(tab);
            moreMenu.appendChild(item);
        });
        moreBtn.style.display = hiddenTabs.length > 0 ? "block" : "none";
    }
    syncTabs();
}

function activateTab(tab) {
    if (tab === activeTab && document.querySelector("#tabsBar li.active")) {
        const mm = document.getElementById("moreMenu"); if (mm) mm.style.display = "none";
        return;
    }
    activeTab = tab;
    syncTabs();                    // hanya toggle class
    d.url(tab.toLowerCase());      // ganti isi contentBox saja
    const mm = document.getElementById("moreMenu"); if (mm) mm.style.display = "none";
}

function updateResponsiveTabs() {
    const wrapper = document.querySelector(".tabs-wrapper");
    const tabsBar = document.getElementById("tabsBar");
    if (!wrapper || !tabsBar) return;

    // ukur dengan semua tab terlihat, lalu tentukan yang disembunyikan
    visibleTabs = [...tabsData];
    hiddenTabs = [];
    renderTabs();

    const maxWidth = wrapper.clientWidth - 60;
    let totalWidth = 0;
    const items = Array.from(tabsBar.children);
    for (let i = 0; i < items.length; i++) {
        totalWidth += items[i].offsetWidth;
        if (totalWidth > maxWidth) {
            hiddenTabs = visibleTabs.splice(i);
            break;
        }
    }
    renderTabs();
}

// Dipanggil tiap rangka tab baru dibuat (masuk halaman Master)
function initTabs() {
    const moreBtn = document.getElementById("moreBtn");
    const moreMenu = document.getElementById("moreMenu");
    tabsKey = null;
    moreBtn.addEventListener("click", () => {
        moreMenu.style.display = moreMenu.style.display === "block" ? "none" : "block";
    });

    // listener global: sekali saja, bukan tiap view() dipanggil
    if (!tabsGlobalBound) {
        tabsGlobalBound = true;
        document.addEventListener("click", e => {
            const mb = document.getElementById("moreBtn"), mm = document.getElementById("moreMenu");
            if (mb && mm && !mb.contains(e.target) && !mm.contains(e.target)) mm.style.display = "none";
        });
        let raf = 0;
        window.addEventListener("resize", () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => { if (document.getElementById("tabsBar")) updateResponsiveTabs(); });
        });
    }
    updateResponsiveTabs();
}



function getUrlParam(name) {
const params = new URLSearchParams(window.location.search);
return params.has(name) ? params.get(name) : null;
}


const u = getUrlParam("u");
if (u) { console.log("Ada parameter u:", u);}
else { console.log("Tidak ada parameter u");}


function toggleMenu(buttonElement) {
    // Cari elemen menu terdekat (yang merupakan sibling dari button)
    const menu = buttonElement.nextElementSibling;

    // Periksa apakah menu ini sudah terlihat
    const isVisible = menu.classList.contains('active');

    // Tutup semua menu yang sedang terbuka terlebih dahulu (UX terbaik)
    document.querySelectorAll('.kebab-menu.active').forEach(openMenu => {
        openMenu.classList.remove('active');
    });

    // Jika menu belum terlihat, tampilkan.
    if (!isVisible) {
        menu.classList.add('active');
    }
}

// Tambahkan event listener untuk menutup menu jika mengklik di luar
document.addEventListener('click', function(event) {
    const isKebab = event.target.closest('.kebab-container');

    // Jika klik tidak berada di dalam area kebab, tutup semua menu
    if (!isKebab) {
        document.querySelectorAll('.kebab-menu.active').forEach(openMenu => {
            openMenu.classList.remove('active');
        });
    }
});
