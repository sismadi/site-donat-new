var home = {
  timer: null,
  idx: 0,

  art: function(type, accent) {
    var a = accent || getComputedStyle(document.body).getPropertyValue('--pLightColor').trim() || '#ebf2fa';
    var arts = {
      code: "<rect x='60' y='50' width='360' height='230' rx='14' fill='#00000055'/><rect x='60' y='50' width='360' height='34' rx='14' fill='#ffffff22'/><circle cx='84' cy='67' r='6' fill='#ff6b6b'/><circle cx='104' cy='67' r='6' fill='" + a + "'/><circle cx='124' cy='67' r='6' fill='#6bd36b'/><rect x='84' y='110' width='120' height='10' rx='5' fill='" + a + "'/><rect x='84' y='136' width='220' height='10' rx='5' fill='#ffffff88'/><rect x='108' y='162' width='180' height='10' rx='5' fill='#ffffff66'/><rect x='108' y='188' width='140' height='10' rx='5' fill='#ffffff66'/><rect x='84' y='214' width='90' height='10' rx='5' fill='" + a + "'/><rect x='84' y='240' width='200' height='10' rx='5' fill='#ffffff44'/>",
      chart: "<rect x='60' y='50' width='360' height='230' rx='14' fill='#00000055'/><rect x='100' y='190' width='34' height='70' rx='6' fill='#ffffff88'/><rect x='156' y='150' width='34' height='110' rx='6' fill='#ffffff88'/><rect x='212' y='110' width='34' height='150' rx='6' fill='" + a + "'/><rect x='268' y='140' width='34' height='120' rx='6' fill='#ffffff88'/><rect x='324' y='90' width='34' height='170' rx='6' fill='#ffffff88'/><polyline points='117,170 173,130 229,95 285,120 341,72' fill='none' stroke='" + a + "' stroke-width='4' stroke-linecap='round'/>",
      mobile: "<rect x='150' y='30' width='180' height='270' rx='26' fill='#00000066' stroke='#ffffff55' stroke-width='3'/><rect x='168' y='64' width='144' height='72' rx='10' fill='" + a + "'/><rect x='168' y='150' width='144' height='14' rx='7' fill='#ffffff88'/><rect x='168' y='176' width='100' height='14' rx='7' fill='#ffffff55'/><rect x='168' y='214' width='64' height='56' rx='10' fill='#ffffff33'/><rect x='248' y='214' width='64' height='56' rx='10' fill='#ffffff33'/><circle cx='240' cy='46' r='5' fill='#ffffff66'/>"
    };
    return "data:image/svg+xml;utf8," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 330'>" + (arts[type] || arts.code) + "</svg>");
  },

  renderSlides: function(slides) {
    return slides.map(function(s, i) {
      return "<div class='lp-slide v" + (i % 3) + (i === 0 ? " active" : "") + "' aria-hidden='" + (i !== 0) + "'>" +
        "<div class='lp-slide-text'><span class='lp-pill'>" + s.tag + "</span>" +
        "<h1>" + s.title + "</h1><p>" + s.desc + "</p>" +
        "<button class='lp-btn lp-btn-accent' onclick=\"home.scroll('" + s.cta.target + "')\">" + s.cta.text + "</button></div>" +
        "<div class='lp-slide-art'><img src=\"" + home.art(s.art) + "\" alt=''></div></div>";
    }).join('');
  },

  go: function(n) {
    var slides = document.querySelectorAll('.lp-slide');
    var dots = document.querySelectorAll('.lp-dot');
    if (!slides.length) return;
    home.idx = (n + slides.length) % slides.length;
    slides.forEach(function(s, i) { s.classList.toggle('active', i === home.idx); s.setAttribute('aria-hidden', i !== home.idx); });
    dots.forEach(function(d, i) { d.classList.toggle('active', i === home.idx); });
  },

  auto: function() {
    clearInterval(home.timer);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    home.timer = setInterval(function() {
      if (!document.querySelector('.lp-slider')) { clearInterval(home.timer); return; }
      home.go(home.idx + 1);
    }, 5000);
  },

  authLink: function() {
    if (!window.auth) return '';
    return auth.session()
      ? "<a class='lp-login' href='javascript:void(0)' onclick='auth.logout()'>Keluar</a>"
      : "<a class='lp-login' href='javascript:void(0)' onclick=\"navigate('auth/login/1')\">Masuk</a>";
  },

  scroll: function(id) {
    var el = document.getElementById('lp-' + id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  toggleFaq: function(btn) {
    var item = btn.parentNode;
    var open = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  },

  controller: {
    home: async function() {
      var data = homeData;
      home.idx = 0;

      d.gebi('content').innerHTML =
        "<div class='lp'>" +

        "<nav class='lp-nav'><strong>" + data.brand + "</strong><div>" +
        data.nav.map(function(n) { return "<a href='javascript:void(0)' onclick=\"home.scroll('" + n.target + "')\">" + n.text + "</a>"; }).join('') +
        "</div>" + home.authLink() + "<button class='lp-btn lp-btn-solid' onclick=\"home.scroll('kontak')\">Konsultasi</button></nav>" +

        "<section class='lp-slider' aria-label='Sorotan program'>" +
        home.renderSlides(data.slides) +
        "<button class='lp-arrow lp-prev' aria-label='Slide sebelumnya' onclick='home.go(home.idx-1);home.auto()'>&#8249;</button>" +
        "<button class='lp-arrow lp-next' aria-label='Slide berikutnya' onclick='home.go(home.idx+1);home.auto()'>&#8250;</button>" +
        "<div class='lp-dots'>" + data.slides.map(function(s, i) { return "<button class='lp-dot" + (i === 0 ? " active" : "") + "' aria-label='Slide " + (i + 1) + "' onclick='home.go(" + i + ");home.auto()'></button>"; }).join('') + "</div>" +
        "</section>" +

        "<section class='lp-stats'>" + data.stats.map(function(s) { return "<div><b>" + s.value + "</b><span>" + s.label + "</span></div>"; }).join('') + "</section>" +

        "<section class='lp-section' id='lp-layanan'><h2>Pilih jalur belajar Anda</h2><p class='lp-sub'>Empat bidang yang paling dicari industri, masing-masing dengan jalur belajar bertahap.</p>" +
        "<div class='lp-grid lp-grid-4'>" + data.services.map(function(s, i) {
          return "<article class='lp-card'><div class='lp-ico t" + (i % 2) + "'><img data-src=\"" + s.icon + "\" alt=''></div><h3>" + s.title + "</h3><p>" + s.desc + "</p></article>";
        }).join('') + "</div></section>" +

        "<section class='lp-section lp-about'><div><h2>" + data.about.title + "</h2><p>" + data.about.text + "</p></div>" +
        "<ul>" + data.about.points.map(function(p) { return "<li>" + p + "</li>"; }).join('') + "</ul></section>" +

        "<section class='lp-section' id='lp-program'><h2>Program populer</h2><p class='lp-sub'>Mulai dari kursus gratis, lanjut ke program lengkap saat Anda siap.</p>" +
        "<div class='lp-grid lp-grid-4'>" + data.programs.map(function(p, i) {
          return "<article class='lp-card lp-course'><div class='lp-thumb t" + (i % 2) + "'><span>" + p.level + "</span></div><h3>" + p.title + "</h3><p>" + p.meta + "</p><div class='lp-price'><b>" + p.price + "</b><button class='lp-btn lp-btn-outline' onclick=\"navigate('dashboard/dashboard/1')\">Detail</button></div></article>";
        }).join('') + "</div></section>" +

        "<section class='lp-section' id='lp-testimoni'><h2>Kata alumni</h2>" +
        "<div class='lp-grid lp-grid-3'>" + data.testimonials.map(function(t) {
          return "<figure class='lp-card lp-quote'><blockquote>" + t.text + "</blockquote><figcaption><img src=\"" + ui.initial(t.name) + "\" alt=''><div><b>" + t.name + "</b><small>" + t.role + "</small></div></figcaption></figure>";
        }).join('') + "</div></section>" +

        "<section class='lp-section lp-faq' id='lp-faq'><h2>Pertanyaan yang sering diajukan</h2>" +
        data.faq.map(function(f) {
          return "<div class='lp-faq-item'><button aria-expanded='false' onclick='home.toggleFaq(this)'>" + f.q + "<i></i></button><p>" + f.a + "</p></div>";
        }).join('') + "</section>" +

        "<section class='lp-cta' id='lp-kontak'><h2>" + data.cta.title + "</h2><p>" + data.cta.desc + "</p><div>" +
        "<button class='lp-btn lp-btn-accent' onclick=\"navigate('dashboard/dashboard/1')\">" + data.cta.primary + "</button>" +
        "<a class='lp-btn lp-btn-ghost' href='" + data.cta.link + "' target='_blank' rel='noopener'>" + data.cta.secondary + "</a></div></section>" +

        "</div>";

      home.auto();
      if (typeof d.renderImage === 'function') d.renderImage();
    }
  }
};
