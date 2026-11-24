log=console.log.bind(window.console);
log('donat');

url=function(id){
var slug = window.location.search.replace("?", "").toLowerCase();
if(!slug) slug = "home/home/1"; // Default route
let [app, func, param] = slug.split("/");
if (window.auth && auth.required && !auth.session() && app !== 'auth') { app = 'auth'; func = 'login'; param = '1'; }
document.body.classList.toggle('auth-mode', app === 'auth');
if (window.auth) auth.renderBox();

try { if(window[app] && window[app].controller[func]) {
        window[app].controller[func](param)
        ActiveMenu(app)
    } else {
        d.gebi('content').innerHTML = "404 Not Found";
    }
} catch (e) {
    console.error("Routing Error:", e);
}

};

navigate=function(path) {
    window.history.pushState({}, "", "?" + path);
    url();
}

async function ActiveMenu(targetMenu) {
      const currentActive = document.querySelector('#leftmenu li.active');
      if (currentActive) currentActive.classList.remove('active');
      const target = document.querySelector(`#leftmenu li[data-info="${targetMenu}"]`);
      if (target) target.classList.add('active');
}



window.onpopstate = () => url();
window.onload = () => url();
