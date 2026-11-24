// dataset.js - data demo (client-side). Tiap tabel: tipe (definisi form) + data (isi)
var dataset = {

kategori:{
tipe:[
{id:"id",nama:"hidden",arr:'',info:'otomatis',perlu:'0'},
{id:"nama",nama:"text",arr:'',info:'wajib diisi',perlu:'1'},
{id:"keterangan",nama:"textarea",arr:'',info:'deskripsi singkat',perlu:'0'},
],
data:[
{id:1,nama:"Makanan",keterangan:"Makanan ringan dan berat"},
{id:2,nama:"Minuman",keterangan:"Minuman kemasan dan seduh"},
{id:3,nama:"Sembako",keterangan:"Kebutuhan pokok harian"},
{id:4,nama:"Rumah Tangga",keterangan:"Perlengkapan rumah"},
]},

produk:{
tipe:[
{id:"id",nama:"hidden",arr:'',info:'otomatis',perlu:'0'},
{id:"kode",nama:"text",arr:'',info:'kode unik produk',perlu:'1'},
{id:"nama",nama:"text",arr:'',info:'wajib diisi',perlu:'1'},
{id:"kategori_id",nama:"option",arr:'1,2,3,4',info:'1 Makanan, 2 Minuman, 3 Sembako, 4 Rumah Tangga',perlu:'1'},
{id:"harga",nama:"text",arr:'',info:'harga satuan (Rp)',perlu:'1'},
{id:"stok",nama:"text",arr:'',info:'jumlah stok',perlu:'0'},
{id:"satuan",nama:"option",arr:'pcs,kg,liter,pack',info:'',perlu:'0'},
],
data:[
{id:1,kode:"P001",nama:"Roti Tawar",kategori_id:1,harga:15000,stok:40,satuan:"pcs"},
{id:2,kode:"P002",nama:"Mie Instan Goreng",kategori_id:1,harga:3500,stok:200,satuan:"pcs"},
{id:3,kode:"P003",nama:"Air Mineral 600ml",kategori_id:2,harga:4000,stok:150,satuan:"pcs"},
{id:4,kode:"P004",nama:"Teh Botol",kategori_id:2,harga:5500,stok:90,satuan:"pcs"},
{id:5,kode:"P005",nama:"Beras Premium",kategori_id:3,harga:68000,stok:35,satuan:"pack"},
{id:6,kode:"P006",nama:"Minyak Goreng",kategori_id:3,harga:19000,stok:60,satuan:"liter"},
{id:7,kode:"P007",nama:"Gula Pasir",kategori_id:3,harga:17500,stok:55,satuan:"kg"},
{id:8,kode:"P008",nama:"Sabun Cuci Piring",kategori_id:4,harga:12000,stok:70,satuan:"pcs"},
]},

lokasi:{
tipe:[
{id:"id",nama:"hidden",arr:'',info:'otomatis',perlu:'0'},
{id:"nama",nama:"text",arr:'',info:'nama cabang',perlu:'1'},
{id:"kota",nama:"text",arr:'',info:'',perlu:'1'},
{id:"alamat",nama:"textarea",arr:'',info:'alamat lengkap',perlu:'0'},
{id:"telepon",nama:"text",arr:'',info:'',perlu:'0'},
],
data:[
{id:1,nama:"Cabang Pusat",kota:"Jakarta",alamat:"Jl. Merdeka No. 1",telepon:"021-555-0101"},
{id:2,nama:"Cabang Bandung",kota:"Bandung",alamat:"Jl. Asia Afrika No. 22",telepon:"022-555-0202"},
{id:3,nama:"Cabang Cianjur",kota:"Cianjur",alamat:"Jl. Raya Cianjur No. 8",telepon:"0263-555-03"},
{id:4,nama:"Cabang Surabaya",kota:"Surabaya",alamat:"Jl. Tunjungan No. 15",telepon:"031-555-0404"},
]},

users:{
tipe:[
{id:"id",nama:"hidden",arr:'',info:'otomatis',perlu:'0'},
{id:"nama",nama:"text",arr:'',info:'wajib diisi',perlu:'1'},
{id:"email",nama:"text",arr:'',info:'email aktif',perlu:'1'},
{id:"peran",nama:"option",arr:'admin,kasir,pelanggan',info:'',perlu:'1'},
{id:"lokasi_id",nama:"option",arr:'1,2,3,4',info:'cabang',perlu:'0'},
{id:"telepon",nama:"text",arr:'',info:'',perlu:'0'},
],
data:[
{id:1,nama:"Budi Santoso",email:"budi@demo.id",peran:"admin",lokasi_id:1,telepon:"0812-1000-001"},
{id:2,nama:"Siti Aminah",email:"siti@demo.id",peran:"kasir",lokasi_id:1,telepon:"0812-1000-002"},
{id:3,nama:"Agus Rahman",email:"agus@demo.id",peran:"kasir",lokasi_id:2,telepon:"0812-1000-003"},
{id:4,nama:"Dewi Lestari",email:"dewi@demo.id",peran:"pelanggan",lokasi_id:3,telepon:"0812-1000-004"},
{id:5,nama:"Rizky Pratama",email:"rizky@demo.id",peran:"pelanggan",lokasi_id:2,telepon:"0812-1000-005"},
{id:6,nama:"Nur Hidayah",email:"nur@demo.id",peran:"pelanggan",lokasi_id:4,telepon:"0812-1000-006"},
]},

kasir:{
tipe:[
{id:"id",nama:"hidden",arr:'',info:'otomatis',perlu:'0'},
{id:"nama",nama:"text",arr:'',info:'nama kasir',perlu:'1'},
{id:"lokasi_id",nama:"option",arr:'1,2,3,4',info:'cabang',perlu:'1'},
{id:"shift",nama:"option",arr:'pagi,siang,malam',info:'',perlu:'1'},
{id:"status",nama:"option",arr:'aktif,nonaktif',info:'',perlu:'0'},
{id:"kas_awal",nama:"text",arr:'',info:'modal kas awal (Rp)',perlu:'0'},
],
data:[
{id:1,nama:"Siti Aminah",lokasi_id:1,shift:"pagi",status:"aktif",kas_awal:500000},
{id:2,nama:"Agus Rahman",lokasi_id:2,shift:"pagi",status:"aktif",kas_awal:500000},
{id:3,nama:"Lina Marlina",lokasi_id:1,shift:"siang",status:"aktif",kas_awal:400000},
{id:4,nama:"Eko Wahyudi",lokasi_id:3,shift:"malam",status:"nonaktif",kas_awal:300000},
{id:5,nama:"Maya Sari",lokasi_id:4,shift:"pagi",status:"aktif",kas_awal:450000},
]},

keranjang:{
tipe:[
{id:"id",nama:"hidden",arr:'',info:'otomatis',perlu:'0'},
{id:"user_id",nama:"option",arr:'1,2,3,4,5,6',info:'pemilik keranjang',perlu:'1'},
{id:"produk_id",nama:"option",arr:'1,2,3,4,5,6,7,8',info:'produk',perlu:'1'},
{id:"qty",nama:"text",arr:'',info:'jumlah',perlu:'1'},
{id:"catatan",nama:"textarea",arr:'',info:'opsional',perlu:'0'},
],
data:[
{id:1,user_id:4,produk_id:5,qty:1,catatan:""},
{id:2,user_id:4,produk_id:6,qty:2,catatan:"Kemasan botol"},
{id:3,user_id:5,produk_id:2,qty:10,catatan:""},
{id:4,user_id:5,produk_id:3,qty:6,catatan:""},
{id:5,user_id:6,produk_id:1,qty:2,catatan:"Yang baru"},
{id:6,user_id:6,produk_id:4,qty:3,catatan:""},
]},

transaksi:{
tipe:[
{id:"id",nama:"hidden",arr:'',info:'otomatis',perlu:'0'},
{id:"kode",nama:"text",arr:'',info:'nomor struk',perlu:'1'},
{id:"tanggal",nama:"text",arr:'',info:'format YYYY-MM-DD',perlu:'1'},
{id:"kasir_id",nama:"option",arr:'1,2,3,4,5',info:'kasir',perlu:'1'},
{id:"total",nama:"text",arr:'',info:'total belanja (Rp)',perlu:'1'},
{id:"metode",nama:"option",arr:'tunai,qris,debit',info:'',perlu:'1'},
{id:"status",nama:"option",arr:'lunas,batal',info:'',perlu:'0'},
],
data:[
{id:1,kode:"TRX-0001",tanggal:"2026-11-20",kasir_id:1,total:56000,metode:"tunai",status:"lunas"},
{id:2,kode:"TRX-0002",tanggal:"2026-11-20",kasir_id:2,total:68000,metode:"qris",status:"lunas"},
{id:3,kode:"TRX-0003",tanggal:"2026-11-21",kasir_id:3,total:40500,metode:"debit",status:"lunas"},
{id:4,kode:"TRX-0004",tanggal:"2026-11-21",kasir_id:1,total:19000,metode:"tunai",status:"batal"},
{id:5,kode:"TRX-0005",tanggal:"2026-11-22",kasir_id:5,total:115000,metode:"qris",status:"lunas"},
{id:6,kode:"TRX-0006",tanggal:"2026-11-22",kasir_id:2,total:27000,metode:"tunai",status:"lunas"},
]},

detail:{
tipe:[
{id:"id",nama:"hidden",arr:'',info:'otomatis',perlu:'0'},
{id:"transaksi_id",nama:"option",arr:'1,2,3,4,5,6',info:'nomor transaksi',perlu:'1'},
{id:"produk_id",nama:"option",arr:'1,2,3,4,5,6,7,8',info:'produk',perlu:'1'},
{id:"qty",nama:"text",arr:'',info:'jumlah',perlu:'1'},
{id:"harga",nama:"text",arr:'',info:'harga satuan (Rp)',perlu:'1'},
],
data:[
{id:1,transaksi_id:1,produk_id:1,qty:2,harga:15000},
{id:2,transaksi_id:1,produk_id:6,qty:1,harga:19000},
{id:3,transaksi_id:1,produk_id:2,qty:2,harga:3500},
{id:4,transaksi_id:2,produk_id:5,qty:1,harga:68000},
{id:5,transaksi_id:3,produk_id:7,qty:1,harga:17500},
{id:6,transaksi_id:3,produk_id:4,qty:2,harga:5500},
{id:7,transaksi_id:3,produk_id:3,qty:3,harga:4000},
{id:8,transaksi_id:4,produk_id:6,qty:1,harga:19000},
{id:9,transaksi_id:5,produk_id:5,qty:1,harga:68000},
{id:10,transaksi_id:5,produk_id:7,qty:2,harga:17500},
{id:11,transaksi_id:5,produk_id:8,qty:1,harga:12000},
{id:12,transaksi_id:6,produk_id:1,qty:1,harga:15000},
{id:13,transaksi_id:6,produk_id:8,qty:1,harga:12000},
]},

};

// modul per tabel agar bisa dirouting: ?produk/view/1, ?users/view/1, dst.
Object.keys(dataset).forEach(function(k){
window[k]={controller:{view:function(){
modul=k;
if(typeof activeTab!=='undefined'){activeTab=k.charAt(0).toUpperCase()+k.slice(1);}
d.service.menu(k);
}}};
});
