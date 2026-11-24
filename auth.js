/* Login, register, lupa password + captcha hitung sederhana.
   CATATAN: tanpa backend, akun disimpan di localStorage peramban (cocok untuk demo/prototipe).
   Untuk produksi, verifikasi akun dan captcha harus dilakukan di server. */
var auth = {
    required: false,          // true = semua halaman selain auth hanya bisa dibuka setelah login
    MAX_TRY: 5,               // gagal login berturut-turut sebelum dikunci sementara
    LOCK_MS: 30000,
    RESET_MS: 10 * 60 * 1000, // masa berlaku kode reset
    cap: null,
    flash: '',

    /* ---------- penyimpanan ---------- */
    db: {
        get: function(k, def) { try { var v = window.localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
        set: function(k, v) { try { window.localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
        del: function(k) { try { window.localStorage.removeItem(k); } catch (e) {} }
    },
    users: function() { return auth.db.get('auth_users', []); },
    session: function() { return auth.db.get('auth_session', null); },
    esc: function(v) { return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); },

    /* ---------- kripto sederhana ---------- */
    rand: function(n) {
        var a = new Uint8Array(n);
        if (window.crypto && crypto.getRandomValues) { crypto.getRandomValues(a); } else { for (var i = 0; i < n; i++) a[i] = Math.floor(Math.random() * 256); }
        return Array.prototype.map.call(a, function(b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    },
    hash: async function(pw, salt) {
        var s = salt + ':' + pw;
        if (window.crypto && crypto.subtle) {
            var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
            return Array.prototype.map.call(new Uint8Array(buf), function(b) { return ('0' + b.toString(16)).slice(-2); }).join('');
        }
        var h = 5381; for (var i = 0; i < s.length; i++) { h = ((h << 5) + h) ^ s.charCodeAt(i); }
        return 'f' + (h >>> 0).toString(16);
    },

    /* ---------- captcha: soal hitung ---------- */
    newCap: function() {
        var r = function(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; };
        var op = ['+', '-', '×'][r(0, 2)], x = r(1, 9), y = r(1, 9);
        if (op === '-' && y > x) { var t = x; x = y; y = t; }
        auth.cap = { q: x + ' ' + op + ' ' + y + ' = ?', a: op === '+' ? x + y : op === '-' ? x - y : x * y };
        return auth.cap.q;
    },
    refreshCap: function() {
        var q = d.gebi('au-cap-q'), i = d.gebi('au-cap');
        if (q) q.textContent = auth.newCap();
        if (i) { i.value = ''; }
    },
    checkCap: function() {
        var v = (d.gebi('au-cap').value || '').trim();
        var ok = /^-?\d+$/.test(v) && auth.cap && Number(v) === auth.cap.a;
        if (!ok) { auth.refreshCap(); auth.msg('Jawaban verifikasi salah. Coba soal yang baru.'); d.gebi('au-cap').focus(); }
        return ok;
    },

    /* ---------- tampilan ---------- */
    msg: function(text, type) {
        var el = d.gebi('au-msg'); if (!el) return;
        el.className = 'au-msg' + (text ? ' show ' + (type || 'err') : '');
        el.textContent = text || '';
    },
    field: function(id, label, type, ac, extra) {
        return '<div class="au-field"><label for="' + id + '">' + label + '</label>' +
            '<input class="input" id="' + id + '" name="' + id + '" type="' + type + '" autocomplete="' + ac + '" ' + (extra || '') + ' required></div>';
    },
    capField: function() {
        return '<div class="au-field"><label for="au-cap">Verifikasi: berapa <b id="au-cap-q">' + auth.newCap() + '</b></label>' +
            '<div class="au-cap"><input class="input" id="au-cap" inputmode="numeric" autocomplete="off" placeholder="Jawaban" required>' +
            '<button type="button" class="au-refresh" aria-label="Ganti soal" title="Ganti soal" onclick="auth.refreshCap()">&#8635;</button></div></div>';
    },
    showPw: function() {
        return '<label class="au-check"><input type="checkbox" onchange="auth.togglePw(this.checked)"> Tampilkan password</label>';
    },
    togglePw: function(on) {
        document.querySelectorAll('.au-form input[data-pw]').forEach(function(i) { i.type = on ? 'text' : 'password'; });
    },
    shell: function(title, sub, body) {
        d.gebi('content').innerHTML =
            '<div class="au-wrap"><div class="au-card">' +
            '<a class="au-back" href="javascript:void(0)" onclick="navigate(\'home/home/1\')">&#8249; Beranda</a>' +
            '<div class="au-logo"><img data-src="?donat/48x48" width="48" height="48" alt=""></div>' +
            '<h1>' + title + '</h1><p class="au-sub">' + sub + '</p>' +
            '<div id="au-msg" class="au-msg" role="alert" aria-live="polite"></div>' + body + '</div></div>';
        if (typeof d.renderImage === 'function') d.renderImage();
        if (auth.flash) { auth.msg(auth.flash, 'ok'); auth.flash = ''; }
    },

    renderBox: function() {
        var box = d.gebi('auth-box'); if (!box) return;
        var s = auth.session();
        box.innerHTML = s
            ? '<div class="au-user"><span class="au-ava">' + auth.esc((s.name || '?').charAt(0).toUpperCase()) + '</span><span class="au-name">' + auth.esc(s.name) + '</span></div><button onclick="auth.logout()">Keluar</button>'
            : '<button onclick="navigate(\'auth/login/1\')">Masuk / Daftar</button>';
    },
    logout: function() {
        auth.db.del('auth_session');
        if (typeof d.info === 'function') { d.info('Anda sudah keluar'); }
        navigate('home/home/1');
    },

    /* ---------- aksi ---------- */
    lockLeft: function() {
        var f = auth.db.get('auth_fail', { n: 0, until: 0 });
        return Math.max(0, Math.ceil((f.until - Date.now()) / 1000));
    },
    login: async function(ev) {
        ev.preventDefault();
        var left = auth.lockLeft();
        if (left > 0) { auth.msg('Terlalu banyak percobaan. Coba lagi dalam ' + left + ' detik.'); return false; }
        if (!auth.checkCap()) return false;
        var email = d.gebi('au-email').value.trim().toLowerCase(), pw = d.gebi('au-pw').value;
        var u = auth.users().filter(function(x) { return x.email === email; })[0];
        var ok = u && (await auth.hash(pw, u.salt)) === u.hash;
        if (!ok) {
            var f = auth.db.get('auth_fail', { n: 0, until: 0 });
            f.n++;
            if (f.n >= auth.MAX_TRY) { f = { n: 0, until: Date.now() + auth.LOCK_MS }; auth.msg('Terlalu banyak percobaan. Akun dikunci ' + (auth.LOCK_MS / 1000) + ' detik.'); }
            else { auth.msg('Email atau password salah. Sisa percobaan: ' + (auth.MAX_TRY - f.n) + '.'); }
            auth.db.set('auth_fail', f); auth.refreshCap();
            return false;
        }
        auth.db.del('auth_fail');
        auth.db.set('auth_session', { email: u.email, name: u.name, at: Date.now() });
        navigate('dashboard/dashboard/1');
        return false;
    },
    register: async function(ev) {
        ev.preventDefault();
        var name = d.gebi('au-name').value.trim(), email = d.gebi('au-email').value.trim().toLowerCase();
        var pw = d.gebi('au-pw').value, pw2 = d.gebi('au-pw2').value;
        if (name.length < 2) { auth.msg('Nama minimal 2 karakter.'); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { auth.msg('Format email tidak valid.'); return false; }
        if (pw.length < 8 || !/[A-Za-z]/.test(pw) || !/\d/.test(pw)) { auth.msg('Password minimal 8 karakter, berisi huruf dan angka.'); return false; }
        if (pw !== pw2) { auth.msg('Konfirmasi password tidak sama.'); return false; }
        if (!auth.checkCap()) return false;
        var users = auth.users();
        if (users.some(function(x) { return x.email === email; })) { auth.msg('Email sudah terdaftar. Silakan masuk.'); auth.refreshCap(); return false; }
        var salt = auth.rand(16);
        users.push({ name: name, email: email, salt: salt, hash: await auth.hash(pw, salt), at: Date.now() });
        if (!auth.db.set('auth_users', users)) { auth.msg('Penyimpanan penuh, akun gagal dibuat.'); return false; }
        auth.flash = 'Akun berhasil dibuat. Silakan masuk.';
        navigate('auth/login/1');
        return false;
    },
    forgot: async function(ev) {
        ev.preventDefault();
        if (!auth.checkCap()) return false;
        var email = d.gebi('au-email').value.trim().toLowerCase();
        var u = auth.users().filter(function(x) { return x.email === email; })[0];
        if (u) {
            var code = String(100000 + (parseInt(auth.rand(4), 16) % 900000));
            auth.db.set('auth_reset', { email: email, code: code, exp: Date.now() + auth.RESET_MS });
            auth.controller.reset(email, code);
        } else {
            auth.msg('Jika email terdaftar, kode reset akan dikirim.', 'ok');
            auth.refreshCap();
        }
        return false;
    },
    doReset: async function(ev) {
        ev.preventDefault();
        var r = auth.db.get('auth_reset', null);
        var code = d.gebi('au-code').value.trim(), pw = d.gebi('au-pw').value, pw2 = d.gebi('au-pw2').value;
        if (!r || Date.now() > r.exp) { auth.msg('Kode reset kedaluwarsa. Minta kode baru.'); return false; }
        if (pw.length < 8 || !/[A-Za-z]/.test(pw) || !/\d/.test(pw)) { auth.msg('Password minimal 8 karakter, berisi huruf dan angka.'); return false; }
        if (pw !== pw2) { auth.msg('Konfirmasi password tidak sama.'); return false; }
        if (!auth.checkCap()) return false;
        if (code !== r.code) { auth.msg('Kode reset salah.'); auth.refreshCap(); return false; }
        var users = auth.users();
        users.forEach(function(x) { if (x.email === r.email) { x.salt = auth.rand(16); } });
        for (var i = 0; i < users.length; i++) { if (users[i].email === r.email) { users[i].hash = await auth.hash(pw, users[i].salt); } }
        auth.db.set('auth_users', users); auth.db.del('auth_reset'); auth.db.del('auth_fail');
        auth.flash = 'Password berhasil diubah. Silakan masuk.';
        navigate('auth/login/1');
        return false;
    },

    controller: {
        login: function() {
            auth.shell('Masuk', 'Masuk untuk melanjutkan ke dashboard Anda.',
                '<form class="au-form" novalidate onsubmit="return auth.login(event)">' +
                auth.field('au-email', 'Email', 'email', 'username') +
                auth.field('au-pw', 'Password', 'password', 'current-password', 'data-pw="1"') +
                auth.showPw() + auth.capField() +
                '<button class="au-btn" type="submit">Masuk</button></form>' +
                '<p class="au-links"><a href="javascript:void(0)" onclick="navigate(\'auth/forgot/1\')">Lupa password?</a>' +
                '<span>Belum punya akun? <a href="javascript:void(0)" onclick="navigate(\'auth/register/1\')">Daftar</a></span></p>');
        },
        register: function() {
            auth.shell('Buat akun', 'Daftar gratis, hanya butuh satu menit.',
                '<form class="au-form" novalidate onsubmit="return auth.register(event)">' +
                auth.field('au-name', 'Nama lengkap', 'text', 'name') +
                auth.field('au-email', 'Email', 'email', 'username') +
                auth.field('au-pw', 'Password', 'password', 'new-password', 'data-pw="1" minlength="8"') +
                '<small class="au-hint">Minimal 8 karakter, berisi huruf dan angka.</small>' +
                auth.field('au-pw2', 'Ulangi password', 'password', 'new-password', 'data-pw="1"') +
                auth.showPw() + auth.capField() +
                '<button class="au-btn" type="submit">Daftar</button></form>' +
                '<p class="au-links"><span>Sudah punya akun? <a href="javascript:void(0)" onclick="navigate(\'auth/login/1\')">Masuk</a></span></p>');
        },
        forgot: function() {
            auth.shell('Lupa password', 'Masukkan email akun Anda untuk mendapatkan kode reset.',
                '<form class="au-form" novalidate onsubmit="return auth.forgot(event)">' +
                auth.field('au-email', 'Email', 'email', 'username') + auth.capField() +
                '<button class="au-btn" type="submit">Kirim kode reset</button></form>' +
                '<p class="au-links"><a href="javascript:void(0)" onclick="navigate(\'auth/login/1\')">Kembali ke halaman masuk</a></p>');
        },
        reset: function(email, code) {
            auth.shell('Atur password baru', 'Masukkan kode reset dan password baru Anda.',
                '<div class="au-demo"><b>Mode demo:</b> aplikasi ini belum terhubung ke email, jadi kode ditampilkan di sini: <strong>' + auth.esc(code) + '</strong>. Berlaku 10 menit.</div>' +
                '<form class="au-form" novalidate onsubmit="return auth.doReset(event)">' +
                auth.field('au-code', 'Kode reset (6 angka)', 'text', 'one-time-code', 'inputmode="numeric" maxlength="6"') +
                auth.field('au-pw', 'Password baru', 'password', 'new-password', 'data-pw="1" minlength="8"') +
                auth.field('au-pw2', 'Ulangi password baru', 'password', 'new-password', 'data-pw="1"') +
                auth.showPw() + auth.capField() +
                '<button class="au-btn" type="submit">Simpan password</button></form>' +
                '<p class="au-links"><a href="javascript:void(0)" onclick="navigate(\'auth/login/1\')">Batal</a></p>');
        }
    }
};
