(function ($) {
  'use strict';

  function pad(n) { return String(n).padStart(2, '0'); }
  function nowText() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }
  function timeOnly() {
    var d = new Date();
    return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  var checks = {
    ln: {
      state: 'failed', kicker: '关键异常', title: 'Infor LN 服务连接失败', badge: '失败',
      sub: '当前工位无法建立到 Infor LN 服务端口的 TCP 连接。', target: '10.209.37.61', port: '8312', latency: '6 ms',
      code: 'TCP_CONNECT_FAILED', reason: '向一个无法连接的网络尝试了一个套接字操作。',
      explain: '连接在 TCP 建连阶段失败，尚未进入 Infor LN 业务接口。优先检查目标服务监听、Windows 防火墙、网络 ACL 与服务器可达性。',
      impact: 'LN 相关报工 / 订单校验 / 报表查询', scope: 'PCS 服务当前正常，故障范围暂时集中在 LN 链路。',
      priority: '优先处理 · P1',
      steps: [
        ['验证端口', '执行 Test-NetConnection 10.209.37.61 -Port 8312'],
        ['检查服务监听', '确认目标服务器 8312 端口处于 LISTENING 状态'],
        ['复核网络策略', '检查防火墙、ACL 与跨网段路由后重新执行 检查清单']
      ],
      assistantContext: '包装台 · Infor LN 连通性失败'
    },
    pcs: {
      state: 'passed', kicker: '运行正常', title: 'PCS 服务连通性正常', badge: '通过',
      sub: 'PCS API 服务可达，端口响应和基础健康检查均正常。', target: '10.209.37.189', port: '5080', latency: '12 ms',
      code: 'CHECK_PASSED', reason: '未发现异常。',
      explain: '当前检查已成功建立连接并完成基础服务响应验证，不需要人工处理。',
      impact: 'PCS 相关业务保持可用', scope: '当前状态稳定，可继续按周期自动巡检。',
      priority: '无需处理',
      steps: [
        ['保持监控', '继续执行既定周期检查'],
        ['观察趋势', '出现连续延迟升高时再进入主动诊断'],
        ['无需变更', '当前不建议调整服务或网络配置']
      ],
      assistantContext: 'PackingTable · PCS 服务连通性正常'
    },
    sql: {
      state: 'passed', kicker: '运行正常', title: '数据库服务 连通性正常', badge: '通过',
      sub: '工位到 PESDB 的数据库端口可达，当前未发现连接异常。', target: 'PESDB', port: '1433', latency: '9 ms',
      code: 'CHECK_PASSED', reason: '数据库网络连接正常。',
      explain: 'TCP 1433 可达，数据库基础连接条件满足。正式运行仍由业务 API 的实际查询结果进一步验证。',
      impact: '数据查询与运维日志链路正常', scope: '暂无数据库网络层故障迹象。',
      priority: '无需处理',
      steps: [
        ['保持监控', '按 检查清单 周期执行端口与查询健康检查'],
        ['关注错误率', '若业务 API 出现数据库异常，再联动查看 数据库服务'],
        ['无需变更', '当前不需要人工干预']
      ],
      assistantContext: 'PackingTable · 数据库服务 连通性正常'
    },
    agent: {
      state: 'passed', kicker: '运行正常', title: 'Agent 运行环境正常', badge: '通过',
      sub: '配置缓存、Named Pipe 通信和本地磁盘空间均满足运行要求。', target: 'LOCALHOST', port: 'LOCAL', latency: '3 ms',
      code: 'CHECK_PASSED', reason: '本机 Agent 环境未发现异常。',
      explain: 'Agent 已成功加载当前 检查清单 v3，并可与 WPF 助手进行本地状态通信。',
      impact: '本地巡检与状态上报正常', scope: '无需重启 Agent 或 WPF。',
      priority: '无需处理',
      steps: [
        ['持续运行', '保持 Agent 服务和 WPF 助手在线'],
        ['配置热更新', '新版本分配后由 Agent 自动安全切换'],
        ['无需重启', '正常版本切换无需用户关闭程序']
      ],
      assistantContext: 'PackingTable · Agent 运行环境正常'
    }
  };

  var localeOverrides = {
    'en-US': {
      ln:{kicker:'Critical Issue',title:'Infor LN service connection failed',badge:'Failed',sub:'This workstation cannot establish a TCP connection to the Infor LN service port.',reason:'A socket operation was attempted to an unreachable network.',explain:'The failure occurs during TCP connection setup before the Infor LN business interface. Check service listening, Windows Firewall, network ACLs and server reachability first.',impact:'LN reporting / order validation / production reporting',scope:'PCS is healthy; the current fault domain is concentrated on the LN path.',priority:'Priority · P1',steps:[['Validate port','Run Test-NetConnection 10.209.37.61 -Port 8312'],['Check listener','Confirm port 8312 is LISTENING on the target server'],['Review network policy','Check firewall, ACL and routing, then rerun the 检查清单']]},
      pcs:{kicker:'Healthy',title:'PCS service connectivity is healthy',badge:'Passed',sub:'PCS API is reachable and the service responds normally.',reason:'No issue detected.',explain:'The connection and basic health response completed successfully.',impact:'PCS-dependent functions remain available',scope:'Continue scheduled monitoring.',priority:'No action required'},
      sql:{kicker:'Healthy',title:'数据库服务 connectivity is healthy',badge:'Passed',sub:'The workstation can reach the PESDB database port.',reason:'Database network connectivity is normal.',explain:'TCP 1433 is reachable and basic database connectivity prerequisites are satisfied.',impact:'Data query and operation logging remain available',scope:'No database network issue detected.',priority:'No action required'},
      agent:{kicker:'Healthy',title:'Agent runtime environment is healthy',badge:'Passed',sub:'Configuration cache, Named Pipe and local disk meet runtime requirements.',reason:'No local Agent issue detected.',explain:'The Agent loaded 检查清单 v3 and can communicate with the WPF assistant.',impact:'Local checks and status reporting are normal',scope:'No restart is required.',priority:'No action required'}
    },
    'es-MX': {
      ln:{kicker:'Incidente Crítico',title:'Falló la conexión al servicio Infor LN',badge:'Falló',sub:'La estación no puede establecer una conexión TCP con el puerto de Infor LN.',reason:'Se intentó una operación de socket hacia una red no accesible.',explain:'La falla ocurre durante el establecimiento TCP, antes de entrar a la interfaz de negocio de LN. Primero revise el servicio, Firewall de Windows, ACL y alcance del servidor.',impact:'Reportes LN / validación de órdenes / reporte de producción',scope:'PCS está normal; el problema está concentrado en la ruta hacia LN.',priority:'Prioridad · P1',steps:[['Validar puerto','Ejecute Test-NetConnection 10.209.37.61 -Port 8312'],['Revisar escucha','Confirme que el puerto 8312 esté LISTENING'],['Revisar red','Verifique firewall, ACL y ruteo; después vuelva a ejecutar el 检查清单']]},
      pcs:{kicker:'Normal',title:'Conectividad de PCS normal',badge:'Correcto',sub:'PCS API es accesible y responde normalmente.',reason:'No se detectaron anomalías.',explain:'La conexión y la respuesta básica se completaron correctamente.',impact:'Las funciones de PCS continúan disponibles',scope:'Continuar monitoreo programado.',priority:'Sin acción'},
      sql:{kicker:'Normal',title:'Conectividad de 数据库服务 normal',badge:'Correcto',sub:'La estación puede acceder al puerto de PESDB.',reason:'La conectividad de red de la base es normal.',explain:'TCP 1433 es accesible.',impact:'Consultas y registros operativos normales',scope:'No hay evidencia de falla de red de base de datos.',priority:'Sin acción'},
      agent:{kicker:'Normal',title:'Entorno de Agent normal',badge:'Correcto',sub:'Caché, Named Pipe y disco local cumplen los requisitos.',reason:'No se detectaron anomalías locales del Agent.',explain:'El Agent cargó 检查清单 v3 y se comunica con WPF.',impact:'Revisión local y reporte de estado normales',scope:'No es necesario reiniciar.',priority:'Sin acción'}
    },
    'th-TH': {
      ln:{kicker:'ปัญหาสำคัญ',title:'เชื่อมต่อบริการ Infor LN ไม่สำเร็จ',badge:'ล้มเหลว',sub:'เวิร์กสเตชันนี้ไม่สามารถสร้างการเชื่อมต่อ TCP ไปยังพอร์ตของ Infor LN ได้',reason:'มีการพยายามเชื่อมต่อ socket ไปยังเครือข่ายที่ไม่สามารถเข้าถึงได้',explain:'ปัญหาเกิดในขั้นตอน TCP ก่อนเข้าสู่ business interface ของ LN ควรตรวจสอบ service listener, Windows Firewall, ACL และการเข้าถึงเซิร์ฟเวอร์ก่อน',impact:'รายงาน LN / ตรวจสอบคำสั่ง / รายงานการผลิต',scope:'PCS ยังปกติ ขอบเขตปัญหาจึงอยู่ที่เส้นทาง LN เป็นหลัก',priority:'เร่งด่วน · P1',steps:[['ตรวจสอบพอร์ต','รัน Test-NetConnection 10.209.37.61 -Port 8312'],['ตรวจ listener','ยืนยันว่าพอร์ต 8312 อยู่สถานะ LISTENING'],['ตรวจเครือข่าย','ตรวจ Firewall, ACL และ routing แล้วรัน 检查清单 อีกครั้ง']]},
      pcs:{kicker:'ปกติ',title:'การเชื่อมต่อ PCS ปกติ',badge:'ผ่าน',sub:'PCS API เข้าถึงได้และตอบสนองปกติ',reason:'ไม่พบความผิดปกติ',explain:'การเชื่อมต่อและ health response สำเร็จ',impact:'ฟังก์ชันที่เกี่ยวข้องกับ PCS ยังใช้งานได้',scope:'ให้ระบบตรวจตามรอบต่อไป',priority:'ไม่ต้องดำเนินการ'},
      sql:{kicker:'ปกติ',title:'การเชื่อมต่อ 数据库服务 ปกติ',badge:'ผ่าน',sub:'เวิร์กสเตชันเข้าถึงพอร์ต PESDB ได้',reason:'เครือข่ายฐานข้อมูลปกติ',explain:'TCP 1433 เข้าถึงได้',impact:'การค้นข้อมูลและ log ปกติ',scope:'ไม่พบปัญหาเครือข่ายฐานข้อมูล',priority:'ไม่ต้องดำเนินการ'},
      agent:{kicker:'ปกติ',title:'สภาพแวดล้อม Agent ปกติ',badge:'ผ่าน',sub:'cache, Named Pipe และพื้นที่ดิสก์พร้อมใช้งาน',reason:'ไม่พบปัญหา Agent ในเครื่อง',explain:'Agent โหลด 检查清单 v3 และสื่อสารกับ WPF ได้',impact:'การตรวจและรายงานสถานะทำงานปกติ',scope:'ไม่ต้องรีสตาร์ต',priority:'ไม่ต้องดำเนินการ'}
    }
  };

  var navLocales = {
    'zh-CN': {ln:['Infor LN 连通性','失败'],pcs:['PCS 服务连通性','通过'],sql:['数据库服务 连通性','通过'],agent:['Agent 运行环境','通过']},
    'en-US': {ln:['Infor LN Connectivity','Failed'],pcs:['PCS Connectivity','Passed'],sql:['数据库服务 Connectivity','Passed'],agent:['Agent Runtime','Passed']},
    'es-MX': {ln:['Conectividad Infor LN','Falló'],pcs:['Conectividad PCS','Correcto'],sql:['Conectividad 数据库服务','Correcto'],agent:['Entorno de Agent','Correcto']},
    'th-TH': {ln:['การเชื่อมต่อ Infor LN','ล้มเหลว'],pcs:['การเชื่อมต่อ PCS','ผ่าน'],sql:['การเชื่อมต่อ 数据库服务','ผ่าน'],agent:['สภาพแวดล้อม Agent','ผ่าน']}
  };

  var currentKey = 'ln';

  function renderSteps(steps) {
    var html = '';
    $.each(steps, function (i, step) {
      html += '<div class="action-step"><span>' + String(i + 1).padStart(2, '0') + '</span><div><b>' + step[0] + '</b><small>' + step[1] + '</small></div></div>';
    });
    $('#detailSteps').html(html);
  }

  function selectCheck(key) {
    var data = $.extend(true, {}, checks[key], (localeOverrides[OpsUI.language] || {})[key] || {});
    if (!data) return;
    currentKey = key;
    $('.check-nav-item').removeClass('active');
    $('.check-nav-item[data-key="' + key + '"]').addClass('active');

    $('#detailKicker').text(data.kicker).css('color', data.state === 'failed' ? '#ff8b94' : '#58dcb0');
    $('#detailTitle').text(data.title);
    $('#detailSub').text(data.sub);
    $('#detailTarget').text(data.target);
    $('#detailPort').text(data.port);
    $('#detailLatency').text(data.latency);
    $('#detailTime').text(timeOnly());
    $('#detailCode').text(data.code);
    $('#detailReason').text(data.reason);
    $('#detailExplain').text(data.explain);
    $('#detailImpact').text(data.impact);
    $('#detailScope').text(data.scope);
    $('.action-priority').text(data.priority);
    $('#assistantContext').text(data.assistantContext);

    $('#detailDot').removeClass('red green').addClass(data.state === 'failed' ? 'red' : 'green');
    $('#detailBadge').removeClass('failed passed').addClass(data.state === 'failed' ? 'failed' : 'passed').text(data.badge);
    $('#reasonCard').removeClass('failed passed').addClass(data.state === 'failed' ? 'failed' : 'passed');
    renderSteps(data.steps);
  }

  var replies = {
    '帮我分析当前异常': '<strong>初步判断：</strong>当前失败发生在 TCP 建连阶段，耗时仅 6 ms，说明尚未进入业务接口，更像是目标端口未监听、服务未启动、防火墙策略或网络路径问题。<br><br>建议先确认 <strong>10.209.37.61:8312</strong> 的端口监听状态。',
    '给我排查步骤': '建议按影响最小的顺序处理：<br>1. 执行 <strong>Test-NetConnection 10.209.37.61 -Port 8312</strong>；<br>2. 在 LN 服务器确认 8312 端口监听；<br>3. 检查 Windows 防火墙与网络 ACL；<br>4. 服务恢复后点击“重新检查”验证。',
    '这个异常影响什么业务': '该异常属于 <strong>Infor LN 连通性</strong>。持续失败时可能影响需要访问 LN 的报工、订单校验或报表查询。PCS 和 数据库服务 当前正常，因此故障范围暂时集中在 LN 链路。',
    '为什么 LN 连不上？': '从当前 检查清单 证据看，TCP 连接在建立阶段失败。最常见原因是 <strong>目标服务未监听、端口被防火墙拦截或服务器不可达</strong>。建议先进行端口连通测试，再决定是否需要服务端处理。'
  };

  function scrollMessages() {
    var el = document.getElementById('assistantMessages');
    if (el) el.scrollTop = el.scrollHeight;
  }
  function appendUser(text) {
    $('#assistantMessages').append('<div class="msg user"><div class="msg-avatar">我</div><div class="bubble"></div></div>');
    $('#assistantMessages .msg.user:last .bubble').text(text);
    scrollMessages();
  }
  function appendBot(html) {
    $('#assistantMessages').append('<div class="msg bot"><div class="msg-avatar">AI</div><div class="bubble">' + html + '</div></div>');
    scrollMessages();
  }
  function ask(text) {
    text = $.trim(text || '');
    if (!text) return;
    appendUser(text);
    $('#assistantInput').val('');
    var $typing = $('<div class="msg bot typing-row"><div class="msg-avatar">AI</div><div class="bubble"><span class="typing"><i></i><i></i><i></i></span></div></div>');
    $('#assistantMessages').append($typing);
    scrollMessages();
    setTimeout(function () {
      $typing.remove();
      var answer = replies[text];
      if (!answer) {
        if (currentKey === 'ln') answer = replies['为什么 LN 连不上？'];
        else answer = '当前选中的 检查清单 项状态正常。正式接入 Dify 后，我可以继续结合历史趋势、知识库 SOP、日志和中央 API 状态进行分析。';
      }
      appendBot(answer);
    }, 560);
  }
  function openAssistant() {
    $('#assistantPanel').addClass('open');
    $('.pet-notify').fadeOut(120);
    setTimeout(scrollMessages, 20);
  }

  function applyWpfLanguage() {
    var labels = navLocales[OpsUI.language] || navLocales['zh-CN'];
    $.each(labels, function (key, parts) {
      var $item = $('.check-nav-item[data-key="' + key + '"]');
      $item.find('.nav-main b').text(parts[0]);
      $item.find('.nav-state').text(parts[1]);
    });
    selectCheck(currentKey);
  }

  $(function () {
    selectCheck('ln');
    applyWpfLanguage();
    $(document).on('ops:languageChanged', applyWpfLanguage);

    $(document).on('click', '.check-nav-item', function () { selectCheck($(this).data('key')); });

    $('#detailRecheck').on('click', function () {
      var $btn = $(this), data = checks[currentKey];
      $btn.text('检查中…').prop('disabled', true);
      $('#runningText').text('正在执行 ' + data.title);
      setTimeout(function () {
        $btn.text('↻ 重新检查').prop('disabled', false);
        $('#detailTime').text(timeOnly());
        $('#lastUpdated').text(nowText());
        $('#runningText').text('最近完成 ' + timeOnly());
        if (data.state === 'failed') OpsUI.toast('复检完成：仍然失败', '故障原因已刷新，可继续让 AI 分析或按建议步骤处理。');
        else OpsUI.toast('复检完成：通过', data.title + ' 当前状态正常。');
      }, 800);
    });

    $('#runAllBtn').on('click', function () {
      var $btn = $(this);
      $btn.find('b').text('检查执行中…');
      $('#runningText').text('4 个分组正在执行');
      $btn.prop('disabled', true);
      setTimeout(function () {
        $btn.find('b').text('立即检查全部');
        $('#runningText').text('最近完成 ' + timeOnly());
        $('#lastUpdated').text(nowText());
        $btn.prop('disabled', false);
        OpsUI.toast('全部检查完成', '4 个分组：3 个通过，1 个关键异常需要处理。');
      }, 1100);
    });

    if (window.location.search.indexOf('assistant=1') >= 0) openAssistant();
    $('#petBtn,#detailAi').on('click', openAssistant);
    $('#assistantClose').on('click', function () { $('#assistantPanel').removeClass('open'); });
    $('#assistantMin').on('click', function () { $('#assistantPanel').removeClass('open'); OpsUI.toast('智能助手已最小化', '点击右下角小助手可继续对话。'); });
    $(document).on('click', '.quick-chip', function () { ask($(this).data('prompt')); });
    $('#assistantSend').on('click', function () { ask($('#assistantInput').val()); });
    $('#assistantInput').on('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask($(this).val()); } });

    $('#copyAgentId').on('click', function () {
      var text = '5252c7fe-c001-4cb7-a7e5-5f7a8941b9af';
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(function () {});
      OpsUI.toast('AgentId 已复制', text);
    });

    var maximized = false;
    $('#mockMax').on('click', function () {
      maximized = !maximized;
      $('#wpfWindow').css(maximized ? { width: '100vw', height: '100vh', borderRadius: 0 } : { width: '', height: '', borderRadius: '' });
      $('.wpf-body').css('padding', maximized ? 0 : '12px');
      $(this).text(maximized ? '❐' : '□');
    });
    $('#mockMin').on('click', function () { OpsUI.toast('窗口状态', '浏览器环境不执行系统级最小化操作。'); });
    $('#mockClose').on('click', function () { OpsUI.toast('窗口状态', '桌面客户端关闭按钮将窗口隐藏到系统托盘。'); });
  });
})(jQuery);
