(function ($) {
  'use strict';

  var stationData = {
    'PackingTable': {
      code: 'PackingTable', host: 'LAP-MX3-IT-217', plant: 'Plant D', agentId: 'AGENT-5252C7FEC0014CB7', health: 82, status: 'failed', version: 'v3', last: '11:12:26',
      names: {'zh-CN':'包装台','en-US':'Packing Station','es-MX':'Estación de Empaque','th-TH':'สถานีแพ็กกิ้ง'},
      checks: [
        {state:'failed', title:'Infor LN Service', desc:'TCP 10.209.37.61:8312 · CONNECT FAILED', level:'Critical'},
        {state:'healthy', title:'PCS API', desc:'10.209.37.189:5080 · 12 ms', level:'Passed'},
        {state:'healthy', title:'SQL Server', desc:'PESDB:1433 · 9 ms', level:'Passed'}
      ]
    },
    'GTC-Upload': {
      code:'GTC-Upload', host:'MXGTC-OP-09', plant:'Plant G', agentId:'AGENT-GTC09', health:91, status:'switching', version:'v6 → v7', last:'11:11:48',
      names:{'zh-CN':'文件上传工位','en-US':'File Upload Station','es-MX':'Estación de Carga','th-TH':'สถานีอัปโหลดไฟล์'},
      checks:[{state:'healthy',title:'File Watcher',desc:'Folder watcher · Healthy',level:'Passed'},{state:'switching',title:'Checklist Deployment',desc:'v7 downloaded · waiting for 1 running task',level:'Switching'}]
    },
    'TXV-V3': {
      code:'TXV-V3',host:'TXV-MX-V3-03',plant:'Plant B',agentId:'AGENT-TXV-V3',health:100,status:'healthy',version:'v4',last:'11:10:31',
      names:{'zh-CN':'自动报工','en-US':'Auto Reporting','es-MX':'Reporte Automático','th-TH':'รายงานอัตโนมัติ'},
      checks:[{state:'healthy',title:'PCS API',desc:'Healthy · 8 ms',level:'Passed'},{state:'healthy',title:'Infor LN',desc:'Healthy · 14 ms',level:'Passed'},{state:'healthy',title:'Local Agent',desc:'Heartbeat · Healthy',level:'Passed'}]
    },
    'PD20-Line': {
      code:'PD20-Line',host:'PD20-MX-B-12',plant:'Plant B',agentId:'AGENT-PD20-12',health:98,status:'healthy',version:'v5',last:'11:09:44',
      names:{'zh-CN':'PD20生产线','en-US':'PD20 Production Line','es-MX':'Línea PD20','th-TH':'ไลน์ PD20'},
      checks:[{state:'healthy',title:'PCS',desc:'Service healthy',level:'Passed'},{state:'healthy',title:'Network',desc:'Gateway latency 4 ms',level:'Passed'}]
    },
    'GP12': {
      code:'GP12',host:'GP12-MX-D-02',plant:'Plant D',agentId:'AGENT-GP12-02',health:100,status:'healthy',version:'v3',last:'11:08:39',
      names:{'zh-CN':'GP12质量工位','en-US':'GP12 Quality Station','es-MX':'Estación de Calidad GP12','th-TH':'สถานีคุณภาพ GP12'},
      checks:[{state:'healthy',title:'Quality API',desc:'Healthy · 11 ms',level:'Passed'},{state:'healthy',title:'Printer',desc:'Ready',level:'Passed'}]
    },
    'EWP-80W': {
      code:'EWP-80W',host:'EWP-MX-G-08',plant:'Plant G',agentId:'AGENT-EWP-08',health:99,status:'healthy',version:'v6',last:'11:07:21',
      names:{'zh-CN':'EWP追溯工位','en-US':'EWP Traceability','es-MX':'Trazabilidad EWP','th-TH':'สถานี Traceability EWP'},
      checks:[{state:'healthy',title:'Traceability API',desc:'Healthy · 10 ms',level:'Passed'},{state:'healthy',title:'Local Disk',desc:'Free 126 GB',level:'Passed'}]
    },
    'LN-Report': {
      code:'LN-Report',host:'LN-MX-RPT-05',plant:'Plant H',agentId:'AGENT-LN-RPT05',health:74,status:'failed',version:'v2',last:'10:54:12',
      names:{'zh-CN':'Infor LN 报表机','en-US':'Infor LN Report Station','es-MX':'Estación de Reportes LN','th-TH':'สถานีรายงาน Infor LN'},
      checks:[{state:'failed',title:'Agent Heartbeat',desc:'No heartbeat for 21 min',level:'Critical'},{state:'failed',title:'Infor LN',desc:'No recent execution result',level:'Blocked'}]
    },
    '6PV': {
      code:'6PV-Line',host:'6PV-MX-H-03',plant:'Plant H',agentId:'AGENT-6PV-03',health:97,status:'healthy',version:'v4',last:'11:05:57',
      names:{'zh-CN':'6PV生产工位','en-US':'6PV Production Station','es-MX':'Estación de Producción 6PV','th-TH':'สถานีผลิต 6PV'},
      checks:[{state:'healthy',title:'PCS',desc:'Healthy · 13 ms',level:'Passed'},{state:'healthy',title:'Barcode Reader',desc:'Ready',level:'Passed'}]
    }
  };

  var currentStation = 'PackingTable';

  function localizedName(data) {
    var lang = OpsUI.language || 'zh-CN';
    return data.names[lang] || data.names['zh-CN'];
  }

  function statusLabel(status) {
    if (status === 'healthy') return OpsUI.t('map.passed');
    if (status === 'switching') return OpsUI.t('map.switch');
    return OpsUI.t('map.failure');
  }

  function renderChecks(data) {
    var html = '';
    $.each(data.checks, function (_, check) {
      var cls = check.state === 'healthy' ? 'green' : check.state === 'switching' ? 'yellow' : 'red';
      html += '<div class="check-line"><span class="dot ' + cls + '" style="margin-top:5px"></span>' +
        '<div><strong>' + check.title + '</strong><div class="alert-desc">' + check.desc + '</div></div>' +
        '<span class="status-pill ' + cls + '">' + check.level + '</span></div>';
    });
    $('#drawerChecks').html(html);
  }

  function openStation(key) {
    var data = stationData[key];
    if (!data) return;
    currentStation = key;
    var statusClass = data.status === 'healthy' ? 'green' : data.status === 'switching' ? 'yellow' : 'red';
    var badgeKey = data.status === 'healthy' ? 'drawer.badge.healthy' : data.status === 'switching' ? 'drawer.badge.switching' : 'drawer.badge.failed';
    $('#drawerStatusBadge').removeClass('green yellow red').addClass(statusClass).find('.dot').removeClass('green yellow red').addClass(statusClass);
    $('#drawerBadgeText').attr('data-i18n', badgeKey).text(OpsUI.t(badgeKey));
    $('#drawerStationName').text(data.code + ' · ' + localizedName(data));
    $('#drawerStationMeta').text(data.host + ' · ' + data.plant + ' · ' + data.agentId);
    $('#drawerHealthScore').text(data.health);
    $('#drawerHealthText').removeClass('text-red text-green text-yellow').addClass(data.status === 'healthy' ? 'text-green' : data.status === 'switching' ? 'text-yellow' : 'text-red').text(data.health + ' / 100');
    $('#drawerVersion').text(data.version);
    $('#drawerAgent').removeClass('text-red text-green text-yellow').addClass(data.status === 'failed' && key === 'LN-Report' ? 'text-red' : 'text-green').text(key === 'LN-Report' ? OpsUI.t('map.offline') : OpsUI.t('drawer.connected'));
    $('#drawerLast').text(data.last);
    $('#drawerTrend').text(Math.max(70, data.health - 5) + ' → ' + data.health);
    $('#drawerHealthOrb').css('background','conic-gradient(var(--' + (data.status === 'healthy' ? 'green' : data.status === 'switching' ? 'yellow' : 'red') + ') 0 ' + data.health + '%, rgba(90,110,135,.15) ' + data.health + '%)');
    renderChecks(data);
    $('#stationDrawer').fadeIn(140);
  }

  function applyFilter(filter) {
    $('.station-node').each(function () {
      var show = filter === 'all' || $(this).data('status') === filter;
      $(this).toggleClass('filtered-out', !show);
    });
  }

  $(function () {
    $('.nav-item[data-target]').on('click', function () {
      $('.nav-item').removeClass('active');
      $(this).addClass('active');
      var target = document.getElementById($(this).data('target'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    $('#stationFilter button').on('click', function () {
      $('#stationFilter button').removeClass('active');
      $(this).addClass('active');
      applyFilter($(this).data('filter'));
    });

    $('.station-node').on('click', function () { openStation($(this).data('station')); });
    $('.drawer-close,#stationDrawer').on('click', function (e) {
      if (e.target === this || $(this).hasClass('drawer-close')) $('#stationDrawer').fadeOut(140);
    });
    $('.drawer').on('click', function (e) { e.stopPropagation(); });

    $('.tab').on('click', function () {
      $('.tab').removeClass('active');
      $(this).addClass('active');
      $('.tab-panel').hide();
      $('#' + $(this).data('tab') + 'Panel').fadeIn(120);
    });

    $('.assign-version').on('click', function () { $('#targetVersion').val($(this).data('version')); $('#assignModal').addClass('open'); });
    $('.modal-close').on('click', function () { $('#assignModal').removeClass('open'); });
    $('#assignModal').on('click', function (e) { if (e.target === this) $(this).removeClass('open'); });
    $('.modal').on('click', function (e) { e.stopPropagation(); });
    $('#confirmAssign').on('click', function () {
      var version = $('#targetVersion').val();
      $('#assignModal').removeClass('open');
      OpsUI.toast('Checklist', 'PackingTable → ' + version + ' · Pending activation');
      $('.tab[data-tab="assignment"]').trigger('click');
    });

    $('#newDraftBtn').on('click', function () { OpsUI.toast('Checklist', 'Draft v5 already exists for PackingTable.'); });
    $('#refreshDashboard').on('click', function () {
      var $btn = $(this), $label = $btn.find('[data-i18n]');
      $btn.prop('disabled', true); $label.text('↻ ...');
      $('.station-node').addClass('refreshing');
      setTimeout(function () {
        $btn.prop('disabled', false); $label.text(OpsUI.t('overview.refresh')); $('.station-node').removeClass('refreshing');
        OpsUI.toast('OPS', '42 stations · 40 Agents synchronized.');
      }, 720);
    });
    $('#drawerCheckBtn').on('click', function () {
      var data = stationData[currentStation];
      OpsUI.toast('Checklist', data.code + ' · ' + statusLabel(data.status));
    });

    $(document).on('ops:languageChanged', function () {
      if ($('#stationDrawer').is(':visible')) openStation(currentStation);
    });
  });
})(jQuery);
