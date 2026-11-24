var pos = {
    q: '',
    kat: 0,
    last: null,

    model: {
        rp: function(n) { return 'Rp ' + Number(n || 0).toLocaleString('id-ID'); },
        data: function() { d.service.init(); return dataset; },
        icon: { 1: 'donat', 2: 'bayam', 3: 'cart', 4: 'house' },
        produk: function(id) { return pos.model.data().produk.data.find(function(p) { return p.id == id; }); },
        aktif: function() { return pos.model.data().kasir.data.filter(function(k) { return k.status == 'aktif'; }); },
        load: function() {
            var s = d.getls('pos');
            var st = {};
            try { st = s ? JSON.parse(s) : {}; } catch (e) { st = {}; }
            st = Object.assign({ cart: [], kasir_id: 0, metode: 'tunai', bayar: '', diskon: '' }, st);
            var aktif = pos.model.aktif();
            if (!aktif.some(function(k) { return k.id == st.kasir_id; })) { st.kasir_id = aktif.length ? aktif[0].id : 0; }
            st.cart = st.cart.filter(function(c) {
                var p = pos.model.produk(c.id);
                if (!p || p.stok < 1) { return false; }
                c.qty = Math.min(c.qty, p.stok);
                return c.qty > 0;
            });
            return st;
        },
        store: function(st) { d.setls('pos', st); },
        totals: function(st) {
            var sub = 0, n = 0;
            st.cart.forEach(function(c) { var p = pos.model.produk(c.id); sub += p.harga * c.qty; n += c.qty; });
            var diskon = Math.min(Math.max(parseInt(st.diskon) || 0, 0), sub);
            return { sub: sub, n: n, diskon: diskon, total: sub - diskon };
        },
        siap: function(st, t) {
            if (!st.cart.length || t.total <= 0 || !st.kasir_id) { return false; }
            return st.metode != 'tunai' || (parseInt(st.bayar) || 0) >= t.total;
        }
    },

    controller: {
        pos: function() {
            var ds = pos.model.data();
            d.gebi('content').innerHTML = `
                <div class="row shadow pos-top">
                    <div class="search">
                        <input id="pos-search" class="input" type="text" placeholder="Cari nama atau kode produk" value="${pos.q}" onkeyup="pos.controller.find(this.value)">
                        <button id="pos-badge" onclick="pos.controller.cart()"> <img data-src="?cart/32x32" alt="Donat"> <span id="pos-badge-text">Keranjang</span></button>
                    </div>
                    <div id="pos-chips" class="gButton"></div>
                </div>
                <div id="pos-grid" class="row card-container"></div>`;
            pos.controller.chips();
            pos.controller.grid();
        },

        chips: function() {
            var ds = pos.model.data();
            var list = [{ id: 0, nama: 'Semua' }].concat(ds.kategori.data);
            d.gebi('pos-chips').innerHTML = list.map(function(k) {
                return `<button class="${css.button} ${pos.kat == k.id ? 'aktif' : ''}" onclick="pos.controller.filter(${k.id})">${k.nama}</button>`;
            }).join('');
        },

        filter: function(id) { pos.kat = id; pos.controller.chips(); pos.controller.grid(); },
        find: function(v) { pos.q = v; pos.controller.grid(); },

        grid: function() {
            var ds = pos.model.data();
            var st = pos.model.load();
            var q = pos.q.toLowerCase();
            var list = ds.produk.data.filter(function(p) {
                return (!pos.kat || p.kategori_id == pos.kat) && (!q || (p.nama + ' ' + p.kode).toLowerCase().indexOf(q) >= 0);
            });
            var out = list.map(function(p) {
                var it = st.cart.find(function(c) { return c.id == p.id; });
                var habis = p.stok < 1;
                return `
<div class="col-1-4" onclick="pos.controller.add(${p.id})">
  <div class="card shadow ${habis ? 'habis' : ''}">
    <img data-src="?${pos.model.icon[p.kategori_id] || 'cart'}/150x150" alt="${p.nama}">
    <strong>${p.nama}</strong>
    <div class="artikel">${pos.model.rp(p.harga)}
      <small>${habis ? 'Stok habis' : 'Stok ' + p.stok + ' ' + p.satuan}${it ? ' <span class="badge">' + it.qty + '</span>' : ''}</small>
    </div>
  </div>
</div>`;
            }).join('');
            d.gebi('pos-grid').innerHTML = out || '<div class="artikel">Produk tidak ditemukan.</div>';
            var t = pos.model.totals(st);
            var el = d.gebi('pos-badge-text');
            if (el) { el.textContent = 'Keranjang (' + t.n + ') ' + (t.n ? pos.model.rp(t.total) : ''); }
        },

        add: function(id) {
            var p = pos.model.produk(id);
            var st = pos.model.load();
            var it = st.cart.find(function(c) { return c.id == id; });
            if (!p || p.stok < 1 || (it && it.qty >= p.stok)) { d.info('Stok ' + (p ? p.nama : '') + ' tidak mencukupi'); return; }
            if (it) { it.qty++; } else { st.cart.push({ id: p.id, qty: 1 }); }
            pos.model.store(st);
            pos.controller.grid();
            pos.controller.cart();
        },

        qty: function(id, delta) {
            var st = pos.model.load();
            var p = pos.model.produk(id);
            var it = st.cart.find(function(c) { return c.id == id; });
            if (!it) { return; }
            if (delta > 0 && it.qty >= p.stok) { d.info('Stok ' + p.nama + ' tidak mencukupi'); return; }
            it.qty += delta;
            if (it.qty < 1) { st.cart = st.cart.filter(function(c) { return c.id != id; }); }
            pos.model.store(st);
            pos.controller.grid();
            pos.controller.cart();
        },

        remove: function(id) {
            var st = pos.model.load();
            st.cart = st.cart.filter(function(c) { return c.id != id; });
            pos.model.store(st);
            pos.controller.grid();
            pos.controller.cart();
        },

        clear: function() {
            var st = pos.model.load();
            st.cart = []; st.bayar = ''; st.diskon = '';
            pos.model.store(st);
            pos.controller.grid();
            pos.controller.cart();
        },

        setKasir: function(el) { var st = pos.model.load(); st.kasir_id = parseInt(el.value); pos.model.store(st); pos.controller.refreshPay(); },
        setMetode: function(m) { var st = pos.model.load(); st.metode = m; st.bayar = ''; pos.model.store(st); pos.controller.cart(); },
        setBayar: function(el) { var st = pos.model.load(); st.bayar = el.value; pos.model.store(st); pos.controller.refreshPay(); },
        setDiskon: function(el) { var st = pos.model.load(); st.diskon = el.value; pos.model.store(st); pos.controller.refreshPay(); },
        uang: function(n) {
            var st = pos.model.load();
            st.bayar = n || pos.model.totals(st).total;
            pos.model.store(st);
            pos.controller.cart();
        },

        refreshPay: function() {
            var st = pos.model.load(), t = pos.model.totals(st), rp = pos.model.rp;
            var byr = parseInt(st.bayar) || 0;
            var set = function(id, v) { var el = d.gebi(id); if (el) { el.textContent = v; } };
            set('pos-sub', rp(t.sub));
            set('pos-diskon-val', '- ' + rp(t.diskon));
            set('pos-total', rp(t.total));
            set('pos-kembali', byr >= t.total ? rp(byr - t.total) : 'Kurang ' + rp(t.total - byr));
            var btn = d.gebi('pos-bayar-btn');
            if (btn) { btn.disabled = !pos.model.siap(st, t); }
            pos.controller.grid();
        },

        cart: function() {
            var ds = pos.model.data();
            var st = pos.model.load();
            var t = pos.model.totals(st);
            var rp = pos.model.rp;
            var byr = parseInt(st.bayar) || 0;

            var kasir = pos.model.aktif().map(function(k) {
                return `<option value="${k.id}" ${k.id == st.kasir_id ? 'selected' : ''}>${k.nama}</option>`;
            }).join('');

            var items = st.cart.length ? st.cart.map(function(c) {
                var p = pos.model.produk(c.id);
                return `
<div class="cart-item">
  <div class="cart-info"><strong>${p.nama}</strong><br><small>${rp(p.harga)}</small></div>
  <div class="cart-qty">
    <button onclick="pos.controller.qty(${c.id},-1)">-</button><span>${c.qty}</span><button onclick="pos.controller.qty(${c.id},1)">+</button>
  </div>
  <div class="cart-sub">${rp(p.harga * c.qty)}</div>
  <button class="cart-del" onclick="pos.controller.remove(${c.id})"> <img data-src="?x/32x32" alt="Hapus"></button>
</div>`;
            }).join('') : '<div class="info">Keranjang kosong. Klik produk untuk menambahkan.</div>';

            var metode = ['tunai', 'qris', 'debit'].map(function(m) {
                return `<button class="${css.button} ${st.metode == m ? 'aktif' : ''}" onclick="pos.controller.setMetode('${m}')">${m}</button>`;
            }).join('');

            var tunai = st.metode == 'tunai' ? `
<label class="cart-label">Uang diterima</label>
<input id="pos-bayar" class="input" type="number" min="0" value="${st.bayar}" onkeyup="pos.controller.setBayar(this)" onchange="pos.controller.setBayar(this)">
<div class="cart-pay" style="margin-top:8px">
  <button onclick="pos.controller.uang(0)">Uang pas</button>
  <button onclick="pos.controller.uang(50000)">50.000</button>
  <button onclick="pos.controller.uang(100000)">100.000</button>
</div>
<div class="cart-row"><span>Kembali</span><strong id="pos-kembali">${byr >= t.total ? rp(byr - t.total) : 'Kurang ' + rp(t.total - byr)}</strong></div>` :
                `<div class="info">Pembayaran ${st.metode} dikonfirmasi saat tombol Bayar ditekan.</div>`;

            var html = `
<label class="cart-label">Kasir</label>
<select id="pos-kasir" class="input" onchange="pos.controller.setKasir(this)">${kasir}</select>
<div>${items}</div>
<label class="cart-label">Diskon (Rp)</label>
<input id="pos-diskon" class="input" type="number" min="0" value="${st.diskon}" onkeyup="pos.controller.setDiskon(this)" onchange="pos.controller.setDiskon(this)">
<div class="cart-row" style="margin-top:12px"><span>Subtotal</span><span id="pos-sub">${rp(t.sub)}</span></div>
<div class="cart-row"><span>Diskon</span><span id="pos-diskon-val">- ${rp(t.diskon)}</span></div>
<div class="cart-row cart-total"><span>Total</span><span id="pos-total">${rp(t.total)}</span></div>
<label class="cart-label">Metode pembayaran</label>
<div class="cart-pay">${metode}</div>
${tunai}
<div class="cart-actions">
  <button data-action="Cancel" onclick="tutup()"> <img data-src="?x/32x32" alt="Donat"> Tutup</button>
  <button onclick="pos.controller.clear()"> <img data-src="?trush/32x32" alt="Donat"> Kosongkan</button>
  <button id="pos-bayar-btn" class="bayar" onclick="pos.controller.pay()" ${pos.model.siap(st, t) ? '' : 'disabled'}> <img data-src="?check/32x32/white" alt="Donat"> Bayar</button>
</div>`;
            d.sidePanel("Keranjang", html);
        },

        pay: function() {
            var ds = pos.model.data();
            var st = pos.model.load();
            var t = pos.model.totals(st);
            if (!pos.model.siap(st, t)) { d.info('Lengkapi pembayaran dulu'); return; }
            for (var n = 0; n < st.cart.length; n++) {
                var pr = pos.model.produk(st.cart[n].id);
                if (pr.stok < st.cart[n].qty) { d.info('Stok ' + pr.nama + ' tidak mencukupi'); return; }
            }
            var max = 0, dmax = 0;
            ds.transaksi.data.forEach(function(e) { if (e.id > max) { max = e.id; } });
            ds.detail.data.forEach(function(e) { if (e.id > dmax) { dmax = e.id; } });
            var id = max + 1;
            var kode = 'TRX-' + ('0000' + id).slice(-4);
            var tgl = new Date().toLocaleDateString('sv-SE');
            var items = [];
            st.cart.forEach(function(c) {
                var p = pos.model.produk(c.id);
                p.stok -= c.qty;
                dmax++;
                ds.detail.data.push({ id: dmax, transaksi_id: id, produk_id: p.id, qty: c.qty, harga: p.harga });
                items.push({ nama: p.nama, qty: c.qty, harga: p.harga });
            });
            var byr = st.metode == 'tunai' ? parseInt(st.bayar) : t.total;
            var kasir = ds.kasir.data.find(function(k) { return k.id == st.kasir_id; });
            ds.transaksi.data.push({ id: id, kode: kode, tanggal: tgl, kasir_id: st.kasir_id, total: t.total, metode: st.metode, status: 'lunas' });
            d.setls('dataset', ds);
            pos.last = { kode: kode, tgl: tgl, kasir: kasir ? kasir.nama : '-', metode: st.metode, items: items, sub: t.sub, diskon: t.diskon, total: t.total, bayar: byr, kembali: byr - t.total };
            st.cart = []; st.bayar = ''; st.diskon = '';
            pos.model.store(st);
            pos.controller.grid();
            pos.controller.receipt();
        },

        receipt: function() {
            var r = pos.last, rp = pos.model.rp;
            if (!r) { return; }
            var lines = r.items.map(function(i) {
                return `<div class="cart-row"><span>${i.nama} x${i.qty}</span><span>${rp(i.harga * i.qty)}</span></div>`;
            }).join('');
            var html = `
<div class="struk">
  <div class="info"><strong>Pembayaran berhasil</strong><br>${r.kode} | ${r.tgl}<br>Kasir: ${r.kasir}</div>
  ${lines}
  <div class="cart-row"><span>Subtotal</span><span>${rp(r.sub)}</span></div>
  <div class="cart-row"><span>Diskon</span><span>- ${rp(r.diskon)}</span></div>
  <div class="cart-row cart-total"><span>Total</span><span>${rp(r.total)}</span></div>
  <div class="cart-row"><span>Bayar (${r.metode})</span><span>${rp(r.bayar)}</span></div>
  <div class="cart-row"><span>Kembali</span><span>${rp(r.kembali)}</span></div>
</div>
<div class="cart-actions">
  <button class="bayar" data-action="Cancel" onclick="tutup()"> <img data-src="?check/32x32/white" alt="Donat"> Selesai</button>
</div>`;
            d.sidePanel("Struk", html);
        }
    }
};
