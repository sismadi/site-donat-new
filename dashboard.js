var dashboard = {
    controller: {
        dashboard: async function() {
            const data = dashboardData;
            const cs = getComputedStyle(document.body);
            const pal = d.color(4);
            const dist = data.distribusi;
            const colors = pal.slice(0, dist.data.length);

            d.gebi('content').innerHTML = `
                <div class="dash">
                    <div class="dash-head"><div><h2>Dashboard</h2><small>${data.subtitle}</small></div>${window.notif ? notif.bell() : ''}</div>
                    <div id="stat-cards" class="row card-container"></div>
                    <div class="row">
                        <div class="col-2-3"><div class="shadow"><h3>${data.mingguan.judul}</h3><div id="bar-chart"></div></div></div>
                        <div class="col-1-3"><div class="shadow"><h3>${dist.judul}</h3><div id="pie-chart"></div><div id="pie-legend"></div></div></div>
                    </div>
                    <div class="row">
                        <div class="col-1-2"><div class="shadow"><h3>Progres Capaian</h3><div id="progress-bars"></div></div></div>
                        <div class="col-1-2"><div class="shadow"><h3>Timeline Belajar</h3><div id="table-container" style="overflow-x:auto"></div></div></div>
                    </div>
                </div>`;

            d.gebi('stat-cards').innerHTML = ui.renderKpi(data.stats);
            d.gebi('bar-chart').innerHTML = ui.renderBars(data.mingguan.data, data.mingguan.satuan);
            d.gebi('pie-chart').innerHTML = d.view.pie({ data: dist.data, colors: colors, center: dist.total, caption: dist.satuan });
            d.gebi('pie-legend').innerHTML = ui.renderLegend(dist.data, colors);
            d.gebi('progress-bars').innerHTML = ui.renderProgress(data.progress_capaian, d.color(data.progress_capaian.length));
            d.gebi('table-container').innerHTML = ui.renderTable(data.learning_path_timeline);

            if(typeof d.renderImage === 'function') d.renderImage();
        }
    }
};
