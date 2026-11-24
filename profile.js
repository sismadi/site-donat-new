var profile = {
    tmp: null,

    model: {
        load: function() {
            var s = d.getls('profile');
            var saved = {};
            try { saved = s ? JSON.parse(s) : {}; } catch (e) { saved = {}; }
            return Object.assign({}, profileData.user, saved);
        },
        store: function(user) {
            try { d.setls('profile', user); return true; }
            catch (e) { d.info('Penyimpanan penuh, foto terlalu besar'); return false; }
        },
        esc: function(v) {
            return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        },
        progress: function(user) {
            var label = { name: 'Nama', role: 'Peran', bio: 'Bio', location: 'Lokasi', email: 'Email', phone: 'Telepon', website: 'Website' };
            var missing = [];
            var filled = 0;
            Object.keys(label).forEach(function(k) {
                if (user[k] && String(user[k]).trim() !== '') { filled++; } else { missing.push(label[k]); }
            });
            var total = Object.keys(label).length + 1;
            if (user.avatar && user.avatar !== profileData.user.avatar) { filled++; } else { missing.push('Foto profil'); }
            return { filled: filled, total: total, percent: Math.round(filled / total * 100), missing: missing };
        }
    },

    view: {
        side: function(user, pg) {
            var e = profile.model.esc;
            var name = e(user.name || '');
            var handle = user.email ? '@' + e(String(user.email).split('@')[0]) : '';
            var rows = [
                { icon: 'envelope', text: user.email, href: user.email ? 'mailto:' + user.email : '' },
                { icon: 'mobile', text: user.phone, href: user.phone ? 'tel:' + String(user.phone).replace(/[^0-9+]/g, '') : '' },
                { icon: 'connector', text: user.website, href: user.website },
                { icon: 'geo', text: user.location }
            ].filter(function(r) { return r.text && String(r.text).trim() !== ''; }).map(function(r) {
                var t = r.href ? '<a href="' + e(r.href) + '"' + (/^https?:/.test(r.href) ? ' target="_blank" rel="noopener"' : '') + '>' + e(r.text) + '</a>' : '<span>' + e(r.text) + '</span>';
                return '<li><img data-src="?' + r.icon + '/26x26" width="26" height="26" alt="">' + t + '</li>';
            }).join('');
            var social = (user.media || []).map(function(m) {
                return '<a class="pf-social" href="' + e(m.link) + '" target="_blank" rel="noopener" title="' + e(m.text) + '"><img data-src="' + e(m.icon) + '" width="24" height="24" alt="' + e(m.text) + '"></a>';
            }).join('');
            return '<div class="pf-avatar"><img id="avatar" class="img" src="' + e(user.avatar) + '" alt="' + name + '" onerror="this.onerror=null;this.src=ui.initial(this.alt)"></div>' +
                '<h1>' + name + '</h1>' +
                (user.role ? '<span class="pf-badge">' + e(user.role) + '</span>' : '') +
                (handle ? '<p class="pf-handle">' + handle + '</p>' : '') +
                '<ul class="pf-info">' + rows + '</ul>' +
                (user.bio ? '<p class="pf-bio">' + e(user.bio) + '</p>' : '') +
                '<div class="pf-progress"><span>Kelengkapan profil</span><b>' + pg.percent + '%</b></div>' +
                '<div class="progress-bar"><span style="background:' + d.color(1)[0] + ';width:' + pg.percent + '%"></span></div>' +
                (pg.missing.length ? '<small class="pf-missing">Belum diisi: ' + e(pg.missing.join(', ')) + '</small>' : '') +
                '<div class="pf-btns"><button class="pf-primary" onclick="profile.controller.edit()"><img data-src="?pen/32x32/white" alt=""> Edit Profil</button>' +
                '<button onclick="profile.controller.photo()"><img data-src="?camera/32x32" alt=""> Ubah Foto</button></div>' +
                (social ? '<div class="pf-socials">' + social + '</div>' : '');
        },
        tiles: function(items) {
            var cols = d.color(items.length);
            return items.map(function(it, i) {
                var nm = String(it.icon || '').replace('?', '').split('/')[0];
                return '<div class="pf-tile" style="background:' + cols[i] + '"><div class="pf-tile-top"><img data-src="?' + nm + '/36x36" width="36" height="36" alt=""><b>' + it.isi + '</b></div><span>' + it.nama + '</span></div>';
            }).join('');
        }
    },

    controller: {
        profile: async function() {
            const container = d.gebi('content');
            const data = profileData;
            const user = profile.model.load();
            const pg = profile.model.progress(user);

            container.innerHTML = `
                <div class="pf-layout">
                    <aside id="pf-side" class="shadow pf-side"></aside>
                    <div class="pf-body">
                        <div id="profile-stats" class="pf-tiles"></div>
                        <div class="shadow"><h3>Tentang</h3><p>${data.about}</p></div>
                        <div class="shadow"><h3>Kemampuan Teknis</h3><div id="skills-bars"></div></div>
                        <div class="shadow"><h3>Sertifikasi</h3><div id="achievement-table"></div></div>
                    </div>
                </div>`;

            d.gebi('pf-side').innerHTML = profile.view.side(user, pg);
            d.gebi('profile-stats').innerHTML = profile.view.tiles(data.stats);
            d.gebi('skills-bars').innerHTML = ui.renderProgress(data.skills.map(function(s) { return { label: s.nama, value: s.isi, percent: s.level }; }), d.color(data.skills.length));
            d.gebi('achievement-table').innerHTML = ui.renderTable(data.achievements.map(function(a) { return { Sertifikat: a.title, Penerbit: a.issued_by, Tahun: a.year }; }));

            var av = d.gebi('avatar');
            if (av) { av.style.cursor = 'pointer'; av.title = 'Ubah foto'; av.onclick = function() { profile.controller.photo(); }; }

            if(typeof d.renderImage === 'function') d.renderImage();
        },

        edit: function() {
            var user = profile.model.load();
            var e = profile.model.esc;
            var model = {
                input: {
                    data: { name: e(user.name), role: e(user.role), bio: e(user.bio), location: e(user.location), email: e(user.email), phone: e(user.phone), website: e(user.website) },
                    tipe: [
                        { id: "name", nama: "text", arr: '', info: 'wajib diisi', perlu: '1' },
                        { id: "role", nama: "text", arr: '', info: 'jabatan / profesi', perlu: '0' },
                        { id: "bio", nama: "textarea", arr: '', info: 'deskripsi singkat', perlu: '0' },
                        { id: "location", nama: "text", arr: '', info: 'kota, negara', perlu: '0' },
                        { id: "email", nama: "text", arr: '', info: 'wajib, format email', perlu: '1' },
                        { id: "phone", nama: "text", arr: '', info: '', perlu: '0' },
                        { id: "website", nama: "text", arr: '', info: 'https://...', perlu: '0' }
                    ]
                },
                button: { data: [
                    { id: 1, nama: "Cancel", icon: "x", url: "tutup()" },
                    { id: 2, nama: "Update", icon: "pen", url: "profile.controller.save()" }
                ] }
            };
            d.sidePanel("Edit Profil", d.view.edit(model));
        },

        save: function() {
            var frm = d.controller.el('form');
            if (!frm.name || !frm.name.trim()) { d.info('Nama wajib diisi'); return; }
            if (!frm.email || !/^\S+@\S+\.\S+$/.test(frm.email.trim())) { d.info('Format email tidak valid'); return; }
            var user = Object.assign(profile.model.load(), frm);
            if (!profile.model.store(user)) { return; }
            d.closePanel();
            profile.controller.profile();
            d.info('Profil diperbarui');
        },

        photo: function() {
            profile.tmp = null;
            var user = profile.model.load();
            var buttons = { data: [
                { id: 1, nama: "Cancel", icon: "x", url: "tutup()" },
                { id: 2, nama: "Delete", icon: "trush", url: "profile.controller.removePhoto()" },
                { id: 3, nama: "Update", icon: "check", url: "profile.controller.savePhoto()" }
            ] };
            var html = `
                <div class="user-avatar">
                    <img id="foto-preview" class="img" src="${user.avatar}" alt="${profile.model.esc(user.name)}" onerror="this.onerror=null;this.src=ui.initial(this.alt)">
                </div>
                <div class="gInput"><input id="foto-file" type="file" accept="image/*" onchange="profile.controller.preview(this)"></div>
                <div class="info">JPG, PNG, atau WebP maks. 5 MB. Foto dipotong persegi dan diperkecil otomatis.</div>
                <div> ${d.view.button(buttons)} </div>`;
            d.sidePanel("Ubah Foto", html);
        },

        preview: function(el) {
            var file = el.files && el.files[0];
            if (!file) { return; }
            if (file.type.indexOf('image/') !== 0) { d.info('File harus berupa gambar'); el.value = ''; return; }
            if (file.size > 5 * 1024 * 1024) { d.info('Ukuran maksimal 5 MB'); el.value = ''; return; }
            var reader = new FileReader();
            reader.onload = function(ev) {
                var img = new Image();
                img.onload = function() {
                    var s = Math.min(img.width, img.height), sz = 300;
                    var cv = document.createElement('canvas');
                    cv.width = sz; cv.height = sz;
                    cv.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, sz, sz);
                    profile.tmp = cv.toDataURL('image/jpeg', 0.85);
                    d.gebi('foto-preview').src = profile.tmp;
                };
                img.onerror = function() { d.info('Gambar tidak dapat dibaca'); };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        },

        savePhoto: function() {
            if (!profile.tmp) { d.info('Pilih foto dulu'); return; }
            var user = profile.model.load();
            user.avatar = profile.tmp;
            if (!profile.model.store(user)) { return; }
            profile.tmp = null;
            d.closePanel();
            profile.controller.profile();
            d.info('Foto diperbarui');
        },

        removePhoto: function() {
            var user = profile.model.load();
            user.avatar = profileData.user.avatar;
            profile.model.store(user);
            profile.tmp = null;
            d.closePanel();
            profile.controller.profile();
            d.info('Foto dihapus');
        }
    }
};
