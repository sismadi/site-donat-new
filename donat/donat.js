log=console.log.bind(window.console);


let modul='donat';
let public=false;

var table={id:'master',rpp:5,page:1,fld:'id,nama',data:[
{id:1,nama:"satu",isi:250,icon:"bayam",url:"d.controller.view()"},
{id:2,nama:"dua",isi:75,icon:"person",url:"d.controller.view()"},
{id:3,nama:"tiga",isi:250,icon:"geo",url:"d.controller.view()"},
{id:3,nama:"tiga",isi:250,icon:"geo",url:"d.controller.view()"},
{id:3,nama:"tiga",isi:250,icon:"geo",url:"d.controller.view()"},
{id:3,nama:"tiga",isi:250,icon:"geo",url:"d.controller.view()"},
{id:3,nama:"tiga",isi:250,icon:"geo",url:"d.controller.view()"},
{id:3,nama:"tiga",isi:250,icon:"geo",url:"d.controller.view()"},
],
tipe:[
// {id:"id",nama:"option",arr:'1,2,5',info:'abaikan',perlu:'0'},
{id:"id",nama:"text",arr:'1,2,5',info:'abaikan',perlu:'0'},
{id:"nama",nama:"text",arr:'1,2,5',info:'wajib diisi',perlu:'0'},
{id:"isi",nama:"textarea",arr:'1,2',info:'isi apa ajah',perlu:'0'},
],
};

table.rst= table.data;

const db = {}, donat = function(x='donat'){ db[x]=window[x]; return db[x];}

d={
mod:'master',
callback:function(){log('callback')},

goto:function(id){ donat(id);
window.location.href = id
},


url:function(id){ donat(id);

modul=id;

// kursus.controller.view()
// table.id=id;
// table.data=db[id].model.table.data;
// table.tipe=db[id].model.tipe;
// d.controller.view();  log(table.id);

// d.modal(id)

window[id].controller.view()
},
setcss:function(id,str){return document.documentElement.style.setProperty(id, str);},
gebi:function(str){return document.getElementById(str);},
gebc:function(str){return document.getElementsByClassName(str);},
qs:function(str){return document.querySelector(str);},
getf:function(id){var item = d.model.set.filter(el => el.nama==id); if(item.length>0){controller[item[0].isi]();}},
ce:function(str) {return document.createElement(str);},
setls:function(nama,arr) {return window.localStorage.setItem(nama, JSON.stringify(arr));},
getls:function(nama) {return window.localStorage.getItem(nama);},
remls:function(nama) {return window.localStorage.removeItem(nama);},

color :function(step) { // Ubah parameter dari 'factor' menjadi 'step'
    var pStyle = getComputedStyle(document.body);
    var hex1 = pStyle.getPropertyValue('--pColor').trim() || '#d6ce93';
    var hex2 = pStyle.getPropertyValue('--pDarkColor').trim() || '#a3a380';

    const interpolate = (hexStart, hexEnd, factor) => {
        const r1 = parseInt(hexStart.slice(1, 3), 16);
        const g1 = parseInt(hexStart.slice(3, 5), 16);
        const b1 = parseInt(hexStart.slice(5, 7), 16);
        const r2 = parseInt(hexEnd.slice(1, 3), 16);
        const g2 = parseInt(hexEnd.slice(3, 5), 16);
        const b2 = parseInt(hexEnd.slice(5, 7), 16);
        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };

    var arrColor = [];
    // Jika step 1 atau kurang, kembalikan warna utama saja
    if (step <= 1) return [hex1];

    for (var i = 0; i < step; i++) {
        var f = i / (step - 1); // f adalah factor interpolasi (0 sampai 1)
        var dynamicHex = interpolate(hex1, hex2, f);
        arrColor.push(dynamicHex);
    }
    return arrColor;
},

sidePanel: function(title, content) {
let container = this.gebi('panel-container');
let panel = this.gebi('panel'), overlay = this.gebi('overlay');
const ada = !!(panel && panel.classList.contains('active'));

// Rangka panel dibuat sekali; selanjutnya hanya judul & isi yang diganti
// (ikon header/close tidak dirender ulang tiap pindah baris).
if (!panel || !overlay) {
container.innerHTML = `
<div id="overlay" class="panel-overlay"></div>
<div id="panel" class="side-panel">
<div class="panel-header">
<h3 id="panel-title" style="margin:0; font-size:1.2rem;"></h3>
<button id="panel-close" ><img data-src="?x/32x32" alt="Donat"> </button>
</div>
<div id="panel-body" class="panel-body"></div>
</div>
`;
document.body.appendChild(container);
overlay = this.gebi('overlay');
panel = this.gebi('panel');
}

this.gebi('panel-title').innerText = title;
this.gebi('panel-body').innerHTML = content;

overlay.classList.add('show-flex');
document.body.classList.add('drawer-open');
if(ada){panel.classList.add('active');} else {setTimeout(() => panel.classList.add('active'), 10);}

const closeAction = () => {
panel.classList.remove('active');
document.body.classList.remove('drawer-open');
d.controller.unselect();
setTimeout(() => {
if(!panel.classList.contains('active')) overlay.classList.remove('show-flex');
}, 300);
};

const btnCancel = document.querySelector('#panel [data-action="Cancel"]');
if(btnCancel) btnCancel.onclick = closeAction;
tutup = closeAction;
d.closePanel = closeAction;

this.gebi('panel-close').onclick = closeAction;
overlay.onclick = closeAction;
},

modal:function(id) { // modal kini tampil di drawer
d.sidePanel("Info", id);
},

info:function(msg){d.gebi('bawah').innerHTML=msg;
d.open('bawah');
setTimeout(function(){d.close('bawah');}, 3000);
},

closePanel:function(){},
close:function(id){var z=this.gebi(id); z.className=z.className.replace('show', 'hide');},
open:function(id) {var z=this.gebi(id); z.className=z.className.replace('hide', 'show');},
events:function(id,method){d.gebi(id).addEventListener("click", method);},
selectElement:function(id, valueToSelect) {d.gebi(id).value = valueToSelect;},

model:{
id:'',
nama:'donat',
datatable:table,
table:table,
tmp:{},
color:{id:'color',data:[{id:'--pColor-h',isi:'213'},{id:'--pColor-s',isi:'100%'},{id:'--pColor-l',isi:'22.5%'}]}, // end color
data:[{id:1,nama:"satu"},{id:2,nama:"dua"},], // end data

css:{
ul:'ul', li:'li', a:'a',search:'search',page:'shadow row',
table:'table',
form:'form row',
gInput:'gInput', input:'input', label:'label',
gButton:"gButton", button:'button',
gIcons:"gIcons", icons:'icons',
}, //end css

page:{id:'page',data:['input','table','button'],}, //end page

input:{id:'input',data:table.data,tipe:table.tipe}, //end input

button:{id:'button',data:table.data,}, //end button
block:{id:'block',data:[],}, //end block
card:{id:'card',data:table.data}, //end card

view:{id:'view',
datatable:table,
button:{data:[
{id:1,nama:"Add",icon:"plus",url:"d.controller.add()"},
// {id:2,nama:"Print",icon:"printer",url:"d.controller.print()"},
// {id:3,nama:"Upload",icon:"upload",url:"d.controller.upload()"},
// {id:4,nama:"Download",icon:"download",url:"d.controller.download()"},
// {id:4,nama:"Delete",icon:"x",url:"d.service.delete()"},
]},
}, //end view

add:{
id:'add',
input:{data:[],tipe:table.tipe},
button:{data:[
{id:1,nama:"Cancel",icon:"x",url:"tutup()"},
{id:2,nama:"Insert",icon:"plus",url:"d.service.create()"},
]},
}, //end add

edit:{
id:'edit',
induk:1,
input:{data:[],tipe:table.tipe},
button:{data:[
// {id:1,nama:"Delete",icon:"trush",url:"d.service.delete()"},
{id:2,nama:"Cancel",icon:"x",url:"tutup()"},
{id:1,nama:"Update",icon:"pen",url:"d.service.update()"},
]},
}, //end edit



}, //end model

view:{
modal:function(arr){

out=`<div class="modal">
<div class="row modalbar">
<span class="kiri" >Modal</span>
<button class="merah " onclick="tutup()">x</button>
</div>

<div class="row modalcontent">${arr}</div>
</div>`;

return out;
},

page:function(arr){out=``;
for(i in arr){out+=`<div id="${arr[i].nama}" class="${arr[i].css} ">${arr[i].isi} </div>`;}
return out;
},

grid:function(arr){var {data}=arr;
out=`<div class="gGrid">`;
for(i in data){var {css,nama,isi}=data[i];
out+=`<div class="${css}"> <span> ${isi}</span> </div>`;}
out+=`</div>`;
return out;
var {css,nama,isi}=arr;
out=`<div id="${arr.nama}" class="${arr.css} ">${arr.isi} </div>`;
return out;
},

div:function(arr){
const node = arr.filter(e => e.induk === id);
out=``;
for (i in node) {nod=node[i];
if(nod.induk!=nod.nama){
out+=`<div id="${nod.nama}" class="${nod.css}"> ${nod.isi} ${this.div(nod.nama)}</div>`;}
inc.push(nod.nama);
}
log(inc)
return out;
},

menu:function(arr){
var{data}=arr;
out=`<ul class="${css.ul}">`;
for(i in data){
out+=`<li class="${css.li}">
<a class="${css.a}" onclick="d.service.read('${data[i].url}')"> <img data-src="?${data[i].icon}/32x32" alt="Donat">  ${data[i].nama}</a>
</li>`;}
out+=`</ul>`;
return out;
},

datatable:function(arr){

out=`<div class="${css.search}">
<select class="input" onChange="d.controller.rpp(this.value);"><option ${arr.rpp==5?'selected':''}>5</option><option ${arr.rpp==10?'selected':''}>10</option> <option ${arr.rpp==50?'selected':''}>50</option></select>
<input id="search" class="input" type="text" value="${arr.q||''}" onkeyup="d.controller.search()">

<div class="kebab-container">
<button onclick="toggleMenu(this)"><img data-src="?kebab/32x32"></button>

<div class="kebab-menu">
<a href="#" class="menu-item" onclick="d.controller.print();return false;">Print</a>
<a href="#" class="menu-item">Download</a>
<a href="#" class="menu-item">Upload</a>
<a href="#" class="menu-item delete-action" onclick="d.service.delete();return false;">Delete</a>
</div>
</div>
</div>
<div id="table" class="gTable">${this.table(d.controller.filtered())}</div>
<div id="paging" class="gpaging">${this.paging(d.controller.filtered())}</div>
`;
return out;
},

table:function(arr){
var{page,rpp,data}=arr;
var al=data.length;
var np=Math.ceil(al / rpp);
out=`<table class="${css.table}">`;


// <input type="checkbox" onclick=d.service.CheckAll(this) >
out+=`<thead><tr><th>
${public ? '' :`<input type="checkbox" onclick="d.service.CheckAll(this)">` }
</th>`;
for(i in (data[0]||table.data[0])){out+=`<th scope="col">${i}</th>`;}

out+=`</tr></thead>
<tbody>`;

for (var key=(page-1) * rpp; key < (page * rpp) && key < al; key++) {col=data[key];


var sel=(table.sel!=null && table.sel==col.id)?'selected':'';
out+=`<tr data-id="${col.id}" class="${sel}" onclick="d.controller.edit('${col.id}')">`;

// <input type="checkbox" name="cb[]" value="${table.data[key].id}">
out+=`<td onclick="event.stopPropagation()">
${public ? '' :`<input type="checkbox" name="cb[]" value="${col.id}" onchange="this.closest('tr').classList.toggle('checked',this.checked)">`}

</td>`;

for(i in col){str=col[i];
if(str && str.length>12){str=str.substring(0, 12) + ' ...'}
out+=`<td data-title="${i}">&nbsp; ${str} </td>`;}

out+=`</tr>`;
}
if(al==0){out+=`<tr><td colspan="9">Data tidak ditemukan</td></tr>`;}
out+=`</tbody>
</table>`;
return out;
},

aksi:function(i){
return `
<button data-action="Edit" class="${css.button}" onclick="d.controller.edit(${i})"> <img data-src="?pen/32x32" alt="Donat"> <span>Edit</span></button>
`;
},

input:function(arr){var {data,tipe}=arr;


function input(tipe,data,id) {
var inp=``, hide=``, label=``,bintang ='',info ='';
if(tipe.length>0) {
const nod = tipe.find(e => e.id === id);
if (nod && nod.nama === "hidden") {hide =`hide`;}
if (nod && nod.nama === "label") {label =`label`;}
if (nod && nod.info !== "" && typeof nod.info !== "undefined") { info=nod.info;}
if (nod && nod.perlu === "1") { bintang ='*'; }
inp = `<input id="${id}" class="${css.input} ${hide}" type="text" aria-label="${id}" value="${data[id]}" placeholder="" name="${id}" >`;
if (nod && nod.nama === "password") {
inp = `<input id="${id}" class="${css.input}" type="password" aria-label="${id}" value="${data[id]}" placeholder="" name="${id}" >`;
}

else if (nod && nod.nama === "textarea") {
inp = `<textarea class="${css.input}" onInput="this.parentNode.dataset.replicatedValue = this.value" class="did-floating-input" aria-label="${i}" name="${i}" id="${i}" placeholder=" ">${data[i]}</textarea>`;
}

else if (nod && nod.nama === "option") {
text=nod.arr;
arr=text.split(",");
inp = `<select class="${css.input}" data-nama="${nod.nama}" class="did-floating-select" id="${id}" name="${id}" onchange="this.setAttribute('value', this.value);" onclick="this.setAttribute('value', this.value);">`;
inp += `<option value="" ></option>`;
for (let i in arr) {
if(data[id]==arr[i]){sel='selected';} else{sel='';}
inp += `<option value="${arr[i]}" ${sel} >${arr[i]}</option>`;
}
inp += `</select>`;
}

}

else {inp = `<input id="${id}" class="${css.input} ${hide}" type="text" aria-label="${id}" value="${data[id]}" placeholder="" name="${id}" >`;}

tooltip=function(id){
nod = tipe.find(e => e.id === id);
if (nod && nod.info) {d.info(nod.info)}
}

out=`<div class="col-1-1 ${hide} ${label}">
<div class="${css.gInput}" onClick="tooltip('${id}')" >
${inp}
<label class="${css.label}">${i} ${bintang} </label>
${info ? `<label class="${css.label} hint" title="${String(info).replace(/"/g,'&quot;')}">${info}</label>` : ''}

</div></div>`;
return out;
}

out=`<form id="form" class="${css.form}">`;
for(i in data){out+=input(tipe,data,i);}
out+=`</form>`;
return out;
},



button:function(arr){ var {data}=arr;

out=`<div class="${css.gButton} kanan">`;
for(i in data){var {icon,url,nama}=data[i];

out+=`<button data-action="${nama}" class="${css.button}  ${getWarna(nama)}" onclick="${url}"> <img data-src="?${icon}/32x32" alt="Donat"> ${nama}</button>`;}
out+=`</div>`;
return out;
},

paging:function(arr){var {data,page}=arr;
rpp=d.model.table.rpp;
al=data.length;
np=Math.ceil(al / rpp);

if (page < 1) page=1;
if (page > np) page=np;
p='show';n='show';
if (page==1) {p='hide';n='show';}
if (page==np) {p='show';n='hide';}
if (al < rpp) {p='hide'; n='hide';}

out=`<div class="gPaging">
<button class="button ${p} " onclick="d.controller.paging(-1)" ><img data-src="?prev/32x32"> Prev </button>
<button class="button ${n}" onclick="d.controller.paging(1)" > <img data-src="?next/32x32"> Next </button>
<span>page: ${page}/${np} data:${al} row(s) </span></div>
`;
return out;
},

pie:function(arr){var {data}=arr;
step=data.length;
color=d.color(step);
sdo=25;
s0=0;
s1=step*100;
out=`
<svg class="pie img" width="100" height="100%" viewBox="0 0 42 42">
<circle class="pie-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>`;
for(i in data){val=data[i].isi;
val1=parseInt(100-val);
s0+=val;
out+=`
<circle id="" cx="21" cy="21" r="15.91549430918954"
fill="transparent"
stroke="${color[i]}"
stroke-width="3"
stroke-dasharray="${val} ${val1}"
stroke-dashoffset="${sdo}">
</circle>`;
sdo+=parseInt(-val);
}

s2=parseInt((s0/s1)*100);
out+=`<g class="chart-text">
<text x="50%" y="50%" class="chart-number" id="totalValue">${s2}%</text>
<text x="50%" y="50%" class="chart-label">Total</text></g>
</svg>
`;
return out;
},

progress:function(arr){var {data}=arr;
let step=data.length;
color=d.color(step);
out=``;
for(i in data){val=data[i].isi;nama=data[i].nama;
out+=`<div class="progress-bar-linear">
<p class="progress-bar-text">${nama}
<span class="float_right">${val}% </span>
</p>
<div class="progress-bar">
<span data-percent="80" style="background:${color[i]}; width:${val}%;"></span>
</div>
</div>`;
}
return out;
},

icons:function(arr){var {data}=arr;
out=`<div class="${css.gIcons}">`;
for(i in data){nama=data[i]
out+=`<div class="${css.icons}"> <img data-src="?${nama}/32x32" alt="Donat"> <span>${nama}</span> </div>`;}
out+=`</div>`;
return out;
},

card:function(arr){var {data}=arr;
step=data.length;
out=`<div class="row card-container">`;
if (step>4){step=4;}
for(i in data){var {nama,isi,icon,url}=data[i];
  out+=`
<div class="col-1-${step}"  onClick="navigate('${url}')">
  <div class="card shadow">
  <img data-src="?${icon}/250x250" alt="${nama}">
    <div class="artikel">${nama}<br/>${isi}
    </div>
  </div>
</div>`;
}
out+=`</div>`;

return out;
},

view:function(arr){
out=`

<div class="row shadow cardtabs">
<div class="tabs-wrapper">
<ul class="tabs" id="tabsBar"></ul>
<button id="moreBtn">☰</button>
<div id="moreMenu"></div>
</div>

<div id="contentBox">${this.viewBody(arr)}</div>
</div>

`;
return out;
},

// isi contentBox saja (tanpa tab bar)
viewBody:function(arr){
return `<div class="row"> ${this.button(arr.button)} </div>
<div class="row"> ${this.datatable(arr.datatable)} </div>`;
},

add:function(arr){
log(arr)
out=`<div class=""> ${this.input(arr.input)} </div>
<div class=""> ${this.button(arr.button)} </div>`;
return out;
},

edit:function(arr){ //view.edit
// log(arr)
// d.modal(JSON.stringify(arr))
out=`
<div id="ext"></div>
<div class=""> ${this.input(arr.input)} </div>
<div class=""> ${this.button(arr.button)} </div>
`;
return out;
},

// delete:function(arr){
//
// log(arr);
// return `<div class="info">Are you sure you want to delete the data?
// </div >
// <div class="btns tengah">
// <button onClick="ya();" >${svg.icon('check')} Yes</button>
// <button onClick="tutup();" >${svg.icon('x')} No</button> </div>
// `;
//
// },



}, //end view

controller:{
menu:function(){var {menu}=d.model; d.gebi('menu-left').innerHTML=d.view.menu(menu);},
page:function(){var {page}=d.model; d.gebi('content').innerHTML=d.view.page(page);},
datatable:function(){var {datatable}=d.model; d.gebi('datatable').innerHTML=d.view.datatable(datatable);},
input:function(){var {input}=d.model; d.gebi('input').innerHTML=d.view.input(input);},
button:function(){var {button}=d.model; d.gebi('button').innerHTML=d.view.button(button);},
table:function(){var {table}=d.model; d.gebi('table').innerHTML=d.view.table(table);},
open:function(){},
filtered:function(){return {data:(table.q?d.controller.partsearch(table.data,table.q):table.data),page:table.page,rpp:table.rpp};},
refresh:function(){var arr=d.controller.filtered();
d.gebi('table').innerHTML=d.view.table(arr);
d.gebi('paging').innerHTML=d.view.paging(arr);
},
unselect:function(){table.sel=null; var r=d.qs('.table tr.selected'); if(r){r.classList.remove('selected');}},
close:function(){d.controller.mod(d.model.page.nama);},
el:function(id){frm=d.gebi(id); obj={};
for (var i=0; i < frm.elements.length; i++) {e=frm.elements[i]; obj[e['name']]=e['value'];}
return obj;
},

paging:function(i){
table.page=parseInt(table.page)+i;
d.controller.refresh();
},

rpp:function(i){
table.rpp=parseInt(i);
table.page=1;
d.controller.refresh();
},

view:function(){
// Jika rangka tab sudah ada (pindah tab di Master), ganti isi contentBox saja.
// Tab bar & ikonnya tidak dibuat ulang -> tidak ada render ulang ikon.
var box=d.gebi('contentBox');
if(d.gebi('tabsBar') && box && d.gebi('content').contains(box)){
box.innerHTML=d.view.viewBody(d.model.view);
syncTabs();
return;
}
d.gebi('content').innerHTML=d.view.view(d.model.view);
d.controller.tabs();
},

tabs:function(){
// dipanggil hanya saat rangka tab baru dibuat; listener global didaftarkan sekali
initTabs();
},

add:function(){
var kosong={}; for(var k in table.tipe){kosong[table.tipe[k].id]='';}
d.model.add.input.data=kosong;
// d.modal(d.view.edit(d.model['add']));
d.sidePanel("Tambah", d.view.edit(d.model['add']));
},

edit:function(i){ //controller.edit (i = id baris, tahan terhadap hasil search)
i=table.data.findIndex(function(e){return e.id==i;});
if(i<0){return;}
d.controller.unselect(); table.sel=table.data[i].id;
var rs=d.qs('.table tr[data-id="'+table.sel+'"]'); if(rs){rs.classList.add('selected');}
induk=table.data[i].id; // dev
d.model.edit.induk=induk; // dev
d.setls('induk',induk)
d.model.edit.input.data=table.data[i];
// d.modal(d.view.edit(d.model['edit']));
d.sidePanel("Edit", d.view.edit(d.model['edit']));
},


// delete:function(){
// d.modal(d.view.delete('delete'));
// ya=function(){
// d.service.param.mod="delete";d.service.get(callback); function callback(json){d.service.read()}
// tutup();
// }
// },

print:function(){window.print();},
color:function(){arr=d.model.color.data; for (i in arr){d.setcss(arr[i].id, arr[i].isi);}},
callback:function(arr){d.modal(arr)},

search:function(){
table.q=d.gebi('search').value;
table.page=1;
d.controller.refresh();
},

// d.controller.table();
partsearch:function(arr, y) {
return arr.filter(function (item) {
return Object.values(item).map(function (value) {
return String(value).toLowerCase();
}).find(function (value) { var r=y.toLowerCase();
return value.includes(r);
});
});
},

}, //end controller

service:{
host:'http://localhost/donat/api/index.php',
param:{t:'master_users', mod:'login',nama:'users'},
callback:function(json){},

offline:true, // true = pakai dataset.js (tanpa server), false = pakai API host
loaded:false,
init:function(){
if(d.service.loaded){return;}
var s=d.getls('dataset');
if(s){var old=JSON.parse(s); for(var k in dataset){if(!old[k]){old[k]=dataset[k];}} dataset=old;}
d.service.loaded=true;
},
local:function(param){
d.service.init();
var {t,mod,nama,data,id}=param;
var tb=(mod=='table')?nama:t;
var tbl=dataset[tb];
if(!tbl){return JSON.stringify({status:false,msg:'tabel tidak ada',tb:tb,data:[]});}
function cast(row){var s0=tbl.data[0]||{};
for(var k in row){if(typeof s0[k]==='number' && row[k]!=='' && !isNaN(row[k])){row[k]=Number(row[k]);}}
return row;}
if(mod=='create'){var max=0; tbl.data.forEach(function(e){if(e.id>max){max=e.id;}});
data=cast(data); data.id=max+1; tbl.data.push(data);}
if(mod=='update'){for(var n=0;n<tbl.data.length;n++){
if(String(tbl.data[n].id)==String(id)){data=cast(data); data.id=tbl.data[n].id; tbl.data[n]=data;}}}
if(mod=='delete'){var ids=String(id).split(',');
tbl.data=tbl.data.filter(function(e){return ids.indexOf(String(e.id))<0;});}
if(mod!='table'){d.setls('dataset',dataset);}
return JSON.stringify({status:true,tb:tb,tipe:tbl.tipe,data:tbl.data});
},

req:function(param,callback){
if(d.service.offline){var out=d.service.local(param); setTimeout(function(){callback(out);},0); return;}
var {host}=d.service;
// alert(host)
apiKey='bismillah';
var req=new XMLHttpRequest();
req.open("POST", host, true);
req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
// req.setRequestHeader('Authorization', `Bearer ${apiKey}`);
req.onreadystatechange=function(){
if(req.readyState==4 && req.status==200){callback(req.responseText);}}
req.responseType="text";
req.onprogress=function(e){if(e.lengthComputable){}};
req.onloadstart=function(e){};
req.onloadend=function(e){};
req.send(JSON.stringify(param));
}, //end reg

get:function(callback){var {t,mod,nama}=this.param;
param={t:t,mod:mod,nama:nama};
// if(mod!=='table'){
// frm=d.controller.el('form'); id=frm.id;

if(mod=='create'){
frm=d.controller.el('form');
delete frm['id'];
param={t:t,mod:mod,data:frm,id:0};
}

if(mod=='update'){
frm=d.controller.el('form');
id=frm.id;
param={t:t,mod:mod,data:frm,id:id};
}

if(mod=='delete'){
// frm=d.controller.el('form'); id=frm.id;
// param={t:t,mod:mod,data:frm,id:id};
id=d.model.id;
param={t:t,mod:mod,id:id};
}

this.req(param,callback1);
function callback1(json){callback(json);}
}, // end get

set:function(callback){var {t,mod,nama}=this.param;
param={t:t,mod:mod,nama:nama};

if(mod=='create'){delete frm['id'];}
param={t:t,mod:mod,data:frm,id:id};

this.req(param,callback1);
function callback1(json){callback(json);}
}, // end get

menu:function(id){p=id.split('/');
this.param.nama=p[0];
this.read();
},

create:function(){
this.param.mod="create";
this.get(callback);function callback(json){
d.closePanel();
d.info('Tersimpan');
d.url(modul);
}
},

read:function(){
this.param.mod="table";
this.get(callback);
function callback(json){
res=JSON.parse(json);
data=res.data;
d.service.param.t=res.tb;
d.model.datatable.data=res.data;
if(res.tipe){table.tipe=res.tipe; d.model.add.input.tipe=res.tipe; d.model.edit.input.tipe=res.tipe;}
if(table.tb!=res.tb){table.tb=res.tb; table.page=1; table.q=''; table.sel=null;}
var np=Math.ceil(table.data.length/table.rpp)||1; if(table.page>np){table.page=np;}
d.controller.view();

}
},

update:function(){
this.param.mod="update";
this.get(callback);
function callback(json){
res=JSON.parse(json)
log(res)
d.closePanel();
d.info('Tersimpan');
d.url(modul);

}
},


CheckAll:function(el) {
var c=document.getElementsByName('cb[]');
for (var i=0;i<c.length;i++) {c[i].checked = el.checked? true:false ; c[i].closest('tr').classList.toggle('checked',c[i].checked);}
},


cobadelete:function(i){
log('coba delete')

var c = document.getElementsByName('cb[]'); // ← perbaiki di sini
var data = [];
for (var i = 0; i < c.length; i++) {
if (c[i].checked) data.push(c[i].value);
}
var joined = data.join(',');
console.log('terpilih:', joined);
return joined;

},

delete:function(i){

var c = document.getElementsByName('cb[]');
var data = [];
for (var i = 0; i < c.length; i++) { if (c[i].checked) data.push(c[i].value); }
var joined = data.join(',');


if(joined==''){d.info('Pilih data dulu'); return;}
out=`<div class="info">Are you sure you want to delete the data? ${joined}
</div >
<div class="btns tengah">
<button onClick="ya();" ><img data-src="?check/32x32" alt="Donat"> Oke</button>
<button onClick="tutup();" ><img data-src="?x/32x32" alt="Donat"> Cancel</button> </div>
`;

d.sidePanel("Delete", out);
ya=function(){

d.service.param.mod="delete";
// d.service.param.id=joined;
d.model.id=joined;


d.service.get(callback);
function callback(json){
// d.service.read()
res=JSON.parse(json);
log(res)
d.url(modul);


}
tutup();

}

// d.service.param.mod="delete";
// d.service.get(callback);
// function callback(json){
//   d.close('modal');
//   d.url(modul);
// }

},
}, //end service

};

var {css}=d.model;

document.addEventListener('keydown', function(e){ if(e.key==='Escape' && d.qs('#panel.active')){d.closePanel();} });

function getWarna(act) {
const daftarWarna = {
"Add": "green",
"Cancel": "grey",
"Delete": "red",
"Update": "#007bff", // Tambahan untuk tombol utama
"Default": "#f8f9fa",
"Signup": "green",
"Signin": "blue",
"Signout": "red",

};

// Mengambil warna berdasarkan input, jika tidak ada gunakan default
let clr = daftarWarna[act] || daftarWarna["default"];
return clr;
}
