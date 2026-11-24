var ui = {
initial: function(name) {
var t = String(name || '?').split(' ').slice(0, 2).map(w => w.charAt(0)).join('').toUpperCase();
var bg = (getComputedStyle(document.body).getPropertyValue('--pColor') || '#427aa1').trim();
var svg = `<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'><rect width='150' height='150' fill='${bg}'/><text x='50%' y='50%' dy='.35em' text-anchor='middle' font-size='56' font-family='sans-serif' fill='#fff'>${t}</text></svg>`;
return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
},

renderHeader: function(user) {
const ctas = user.cta || user.media || [];
return `
<div class="row shadow">
<div class="col-1-4">
${user.avatar ? `<div class="user-avatar">
<img id="avatar" class="img" style="max-width:150px;" src="${user.avatar}" alt="${user.name || user.nama}" onerror="this.onerror=null;this.src=ui.initial(this.alt)" ></div>
${user.media ? `<div class="user-avatar"><p>
${(user.media || []).map(item => `<img data-src="${item.icon}" alt="Donat">`).join('')}
</p></div>` : ''}` : `<img class="img" style="max-width:150px;" data-src="${user.avatar || user.icon}">`}
</div>

<div class="col-3-4">
<div class="artikel">
<h1>${user.name || user.nama}</h1>
<p><strong>${user.role || user.tagline}</strong></p>
<p>
${user.bio || user.deskripsi}</p>
${user.location ? `<small>${user.location} | ${user.email}</small>` : ''}
</div>
${user.cta ? `<div class="artikel">
${ctas.map(item => `<button ${item.onclick ? `onclick="${item.onclick}"` : ''}> <img data-src="${item.icon}" alt="Donat"> ${item.text}</button> `).join('')}
</div>` : ''}
</div>
</div>`;
},

renderKpi: function(items) {
return items.map(item => {
const nm = String(item.icon || '').replace('?', '').split('/')[0];
return `
<div class="col-1-4">
<div class="card shadow">
<img data-src="?${nm}/150x150" alt="">
<strong>${item.nama || item.title}</strong>
<div class="artikel"><span class="kpi-val">${item.isi}</span>${item.info ? `<small class="kpi-trend">${item.info}</small>` : ''}</div>
</div>
</div>`;
}).join('');
},

renderBars: function(items, satuan) {
const max = Math.max.apply(null, items.map(i => i.value)) || 1;
return `<div class="bars">` + items.map(i => `
<div class="bar-col" title="${i.label}: ${i.value} ${satuan || ''}">
<div class="bar-plot"><div class="bar ${i.value === max ? 'top' : ''}" style="height:calc((100% - 22px) * ${i.value / max})"><span class="bar-val">${i.value}</span></div></div>
<span class="bar-label">${i.label}</span>
</div>`).join('') + `</div>`;
},

renderLegend: function(items, colors) {
return `<ul class="legend">` + items.map((it, i) => `<li><i style="background:${colors[i]}"></i><span>${it.nama}</span><b>${it.isi}%</b></li>`).join('') + `</ul>`;
},

renderStats: function(items) {
return items.map(item => `
<div class="col-1-4">
<div class="card shadow">
<img data-src="${item.icon}">
<strong>${item.nama || item.title || item.name}</strong>
<div class="artikel">${item.isi || item.desc || ''}<br/></div>
</div>
</div>`).join('');
},

renderTable: function(data) {
if (!data || data.length === 0) return "<p>Data tidak tersedia.</p>";
const headers = Object.keys(data[0]);
let html = `<table class="table"><thead><tr>`;
headers.forEach(h => html += `<th>${h.toUpperCase()}</th>`);
html += `</tr></thead><tbody>`;
data.forEach(row => {
html += `<tr>`;
headers.forEach(h => html += `<td>${row[h]}</td>`);
html += `</tr>`;
});
return html + `</tbody></table>`;
},

// Render Progress Bars
renderProgress: function(progressData, colors) {
return progressData.map((p, i) => `
<div class="progress-bar-linear"><p class="progress-bar-text"><span>${p.label}</span><span>${p.value} (${p.percent}%)</span></p>
<div class="progress-bar">
<span data-percent="${p.percent}" style="background:${colors[i]}; width:${p.percent}%;"> </span>
</div>
</div>`).join('');
}
};
