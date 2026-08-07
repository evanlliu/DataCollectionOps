(function ($) {
  'use strict';

  var stationData = {
    'PackingTable': {
      code: 'PackingTable', host: 'LAP-MX3-IT-217', plant: 'D工厂', agentId: 'AGENT-5252C7FEC0014CB7', health: 82, status: 'failed', version: 'v3', last: '11:12:26',
      names: {'zh-CN':'包装台','en-US':'Packing Station','es-MX':'Estación de Empaque','th-TH':'สถานีแพ็กกิ้ง'},
      checks: [
        {state:'failed', title:'Infor LN 服务', desc:'TCP 10.209.37.61:8312 · 连接失败', level:'严重'},
        {state:'healthy', title:'PCS API', desc:'10.209.37.189:5080 · 12 ms', level:'通过'},
        {state:'healthy', title:'SQL Server', desc:'PESDB:1433 · 9 ms', level:'通过'}
      ]
    },
    'GTC-Upload': {
      code:'GTC-Upload', host:'MXGTC-OP-09', plant:'G工厂', agentId:'AGENT-GTC09', health:91, status:'switching', version:'v6 → v7', last:'11:11:48',
      names:{'zh-CN':'文件上传工位','en-US':'File Upload Station','es-MX':'Estación de Carga','th-TH':'สถานีอัปโหลดไฟล์'},
      checks:[{state:'healthy',title:'文件监视器',desc:'目录监视 · 正常',level:'通过'},{state:'switching',title:'检查清单下发',desc:'v7 已下载 · 等待 1 个运行任务',level:'切换中'}]
    },
    'TXV-V3': {
      code:'TXV-V3',host:'TXV-MX-V3-03',plant:'B工厂',agentId:'AGENT-TXV-V3',health:100,status:'healthy',version:'v4',last:'11:10:31',
      names:{'zh-CN':'自动报工','en-US':'Auto Reporting','es-MX':'Reporte Automático','th-TH':'รายงานอัตโนมัติ'},
      checks:[{state:'healthy',title:'PCS API',desc:'正常 · 8 毫秒',level:'通过'},{state:'healthy',title:'Infor LN',desc:'正常 · 14 毫秒',level:'通过'},{state:'healthy',title:'本地采集代理',desc:'心跳 · 正常',level:'通过'}]
    },
    'PD20-Line': {
      code:'PD20-Line',host:'PD20-MX-B-12',plant:'B工厂',agentId:'AGENT-PD20-12',health:98,status:'healthy',version:'v5',last:'11:09:44',
      names:{'zh-CN':'PD20生产线','en-US':'PD20 Production Line','es-MX':'Línea PD20','th-TH':'ไลน์ PD20'},
      checks:[{state:'healthy',title:'PCS',desc:'Service healthy',level:'通过'},{state:'healthy',title:'Network',desc:'Gateway latency 4 ms',level:'通过'}]
    },
    'GP12': {
      code:'GP12',host:'GP12-MX-D-02',plant:'Plant D',agentId:'AGENT-GP12-02',health:100,status:'healthy',version:'v3',last:'11:08:39',
      names:{'zh-CN':'GP12质量工位','en-US':'GP12 Quality Station','es-MX':'Estación de Calidad GP12','th-TH':'สถานีคุณภาพ GP12'},
      checks:[{state:'healthy',title:'质量接口',desc:'正常 · 11 毫秒',level:'通过'},{state:'healthy',title:'打印机',desc:'就绪',level:'通过'}]
    },
    'EWP-80W': {
      code:'EWP-80W',host:'EWP-MX-G-08',plant:'G工厂',agentId:'AGENT-EWP-08',health:99,status:'healthy',version:'v6',last:'11:07:21',
      names:{'zh-CN':'EWP追溯工位','en-US':'EWP Traceability','es-MX':'Trazabilidad EWP','th-TH':'สถานี Traceability EWP'},
      checks:[{state:'healthy',title:'追溯接口',desc:'正常 · 10 毫秒',level:'通过'},{state:'healthy',title:'本地磁盘',desc:'剩余 126 GB',level:'通过'}]
    },
    'LN-Report': {
      code:'LN-Report',host:'LN-MX-RPT-05',plant:'H工厂',agentId:'AGENT-LN-RPT05',health:74,status:'failed',version:'v2',last:'10:54:12',
      names:{'zh-CN':'Infor LN 报表机','en-US':'Infor LN Report Station','es-MX':'Estación de Reportes LN','th-TH':'สถานีรายงาน Infor LN'},
      checks:[{state:'failed',title:'采集代理心跳',desc:'21 分钟未收到心跳',level:'严重'},{state:'failed',title:'Infor LN',desc:'暂无最近执行结果',level:'阻塞'}]
    },
    '6PV': {
      code:'6PV-Line',host:'6PV-MX-H-03',plant:'H工厂',agentId:'AGENT-6PV-03',health:97,status:'healthy',version:'v4',last:'11:05:57',
      names:{'zh-CN':'6PV生产工位','en-US':'6PV Production Station','es-MX':'Estación de Producción 6PV','th-TH':'สถานีผลิต 6PV'},
      checks:[{state:'healthy',title:'PCS',desc:'正常 · 13 毫秒',level:'通过'},{state:'healthy',title:'条码读取器',desc:'就绪',level:'通过'}]
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

    $('.station-node,.station-open').on('click', function () { openStation($(this).data('station')); });

    $('.org-jump-station').on('click', function () { openStation('PackingTable'); });
    $('.demo-action').on('click', function () {
      OpsUI.toast('数采运维', $(this).data('toast') + ' · 操作流程已就绪');
    });
    $('.nav-item[data-action="language"]').on('click', function () {
      $('.ops-language').first().trigger('focus');
      OpsUI.toast(OpsUI.t('nav.language'), '当前演示固定使用简体中文');
    });
    $('.nav-item[data-action="settings"]').on('click', function () {
      OpsUI.toast(OpsUI.t('nav.settings'), '主题 · 刷新周期 · 采集代理策略 · 审计');
    });
    $('.station-search').on('input', function () {
      var key = String($(this).val() || '').toLowerCase();
      $('.station-admin-table tbody tr').each(function () {
        $(this).toggle(String($(this).data('search') || '').toLowerCase().indexOf(key) >= 0);
      });
    });
    $('.master-tabs button').on('click', function () {
      $('.master-tabs button').removeClass('active'); $(this).addClass('active');
      OpsUI.toast('基础数据', $(this).contents().first().text().trim() + ' · 数据视图已切换');
    });
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
      OpsUI.toast('检查清单', '包装台 → ' + version + ' · 等待生效');
      $('.tab[data-tab="assignment"]').trigger('click');
    });

    $('#newDraftBtn').on('click', function () { OpsUI.toast('检查清单', '包装台已存在草稿 v5。'); });
    $('#refreshDashboard').on('click', function () {
      var $btn = $(this), $label = $btn.find('[data-i18n]');
      $btn.prop('disabled', true); $label.text('↻ ...');
      $('.station-node').addClass('refreshing');
      setTimeout(function () {
        $btn.prop('disabled', false); $label.text(OpsUI.t('overview.refresh')); $('.station-node').removeClass('refreshing');
        OpsUI.toast('运行总览', '42 个工位 · 40 个采集代理已同步。');
      }, 720);
    });
    $('#drawerCheckBtn').on('click', function () {
      var data = stationData[currentStation];
      OpsUI.toast('检查清单', localizedName(data) + ' · ' + statusLabel(data.status));
    });

    $(document).on('ops:languageChanged', function () {
      if ($('#stationDrawer').is(':visible')) openStation(currentStation);
    });
  });
})(jQuery);
