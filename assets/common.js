(function ($) {
  'use strict';

  var dictionaries = {
    'zh-CN': {
      'lang.name':'中文','theme.dark':'深色','theme.light':'浅色','status.central':'中央服务正常','top.title':'数采智能运维中心',
      'nav.overview':'运行总览','nav.factory':'工厂与产线','nav.agents':'Agent 管理','nav.checklist':'Checklist 配置','nav.alerts':'告警中心','nav.language':'语言管理','nav.settings':'系统设置','profile.admin':'管理员',
      'overview.title':'运行总览','overview.desc':'用一张图掌握现场工位、Agent、Checklist 与告警状态，把异常定位时间从“小时级”压缩到“分钟级”。','overview.refresh':'↻ 刷新状态','overview.timestamp':'数据时间 · 2026-08-07 11:15',
      'kpi.stations':'纳管工位','kpi.stationsTrend':'39 正常 · 3 异常','kpi.agents':'在线 Agent','kpi.agentsTrend':'在线率 95.2%','kpi.checks':'今日自动检查','kpi.checksTrend':'98.7% 自动完成','kpi.alerts':'待处理异常','kpi.alertsTrend':'其中 2 项为 Critical',
      'map.title':'工位数字孪生状态场','map.subtitle':'以工厂拓扑视角实时呈现工位健康、Agent、Checklist 与版本切换状态；点击任意工位进入诊断详情。','map.all':'全部','map.failed':'异常','map.switching':'切换中','map.healthy':'健康','map.legendHealthy':'健康','map.legendWarning':'切换中','map.legendFailed':'异常 / 离线','map.live':'LIVE · 5s 自动刷新','map.health':'健康分','map.agent':'Agent','map.version':'Checklist','map.last':'最近检查','map.open':'查看详情','map.online':'在线','map.offline':'离线','map.passed':'健康','map.failure':'1 项失败','map.switch':'切换准备','map.waiting':'等待任务结束',
      'alerts.title':'实时告警','alerts.subtitle':'按影响等级排序，快速判断是否需要人工介入。','alerts.pending':'5 待处理',
      'checklist.title':'Checklist 版本管理','checklist.subtitle':'每个工位独立维护版本：草稿可编辑、已发布版本永久只读，发布后由管理员手动分配。','checklist.newDraft':'＋ 新建草稿','checklist.versions':'版本库','checklist.assignment':'分配与同步','checklist.audit':'变更记录',
      'agents.title':'Agent 实时状态','agents.subtitle':'现场 Agent 主动上报心跳、当前版本和正在运行的检查任务。','value.title':'管理价值','value.subtitle':'把现场经验沉淀为可版本化、可审计、可自动执行的标准诊断能力。',
      'drawer.badge.failed':'异常工位','drawer.badge.healthy':'健康工位','drawer.badge.switching':'切换中','drawer.health':'健康分','drawer.version':'当前版本','drawer.agent':'Agent','drawer.last':'最后检查','drawer.checks':'Checklist 检查','drawer.logs':'查看完整日志','drawer.recheck':'立即检查','drawer.connected':'已连接','drawer.problem':'异常检查','drawer.normal':'正常检查',
      'wpf.title':'数采运维助手','wpf.agentOnline':'Agent 在线','wpf.apiConnected':'中央 API 已连接','wpf.summaryCopy':'检测到 1 项关键异常；PCS、SQL Server 与 Agent 运行环境正常。','wpf.anomaly':'异常','wpf.requiresReview':'需人工确认','wpf.passedCount':'通过','wpf.coreNormal':'核心项正常','wpf.runningTasks':'运行任务','wpf.idle':'当前空闲','wpf.versionState':'版本状态','wpf.v3Active':'v3 已生效','wpf.checkHint':'点击检查项查看当前结果与处置建议。','wpf.needsAction':'需要处理','wpf.normal':'运行正常','wpf.scope':'影响范围：Infor LN 链路','wpf.copy':'复制','wpf.language':'语言','wpf.health':'工作站健康状态','wpf.problem':'存在异常','wpf.runall':'立即检查全部','wpf.checklist':'检查项目','wpf.groups':'4 个分组','wpf.recheck':'↻ 重新检查','wpf.ai':'✦ 让 AI 分析','wpf.target':'目标地址','wpf.port':'端口','wpf.latency':'执行耗时','wpf.last':'最近执行','wpf.reason':'失败原因','wpf.impact':'可能影响','wpf.actions':'建议排查顺序','wpf.agentid':'AgentId','wpf.current':'当前版本','wpf.targetVersion':'目标版本','wpf.waitLimit':'等待上限','wpf.updated':'最后更新'
    },
    'en-US': {
      'lang.name':'English','theme.dark':'Dark','theme.light':'Light','status.central':'Central service healthy','top.title':'Data Collection Intelligent Operations Center',
      'nav.overview':'Operations Overview','nav.factory':'Plants & Lines','nav.agents':'Agent Management','nav.checklist':'Checklist Configuration','nav.alerts':'Alert Center','nav.language':'Language','nav.settings':'System Settings','profile.admin':'Administrator',
      'overview.title':'Operations Overview','overview.desc':'See station, Agent, Checklist and alert status at a glance and compress fault localization from hours to minutes.','overview.refresh':'↻ Refresh','overview.timestamp':'Data timestamp · 2026-08-07 11:15',
      'kpi.stations':'Managed Stations','kpi.stationsTrend':'39 healthy · 3 abnormal','kpi.agents':'Online Agents','kpi.agentsTrend':'95.2% online','kpi.checks':'Automated Checks Today','kpi.checksTrend':'98.7% auto-completed','kpi.alerts':'Open Incidents','kpi.alertsTrend':'2 Critical',
      'map.title':'3D Station Digital Twin','map.subtitle':'A topology view of station health, Agents, Checklists and version switching. Click any station for diagnostic details.','map.all':'All','map.failed':'Abnormal','map.switching':'Switching','map.healthy':'Healthy','map.legendHealthy':'Healthy','map.legendWarning':'Switching','map.legendFailed':'Abnormal / Offline','map.live':'LIVE · auto refresh 5s','map.health':'Health','map.agent':'Agent','map.version':'Checklist','map.last':'Last check','map.open':'Open details','map.online':'Online','map.offline':'Offline','map.passed':'Healthy','map.failure':'1 failed check','map.switch':'Preparing switch','map.waiting':'Waiting for running task',
      'alerts.title':'Live Alerts','alerts.subtitle':'Sorted by impact so operators can judge whether manual intervention is required.','alerts.pending':'5 open',
      'checklist.title':'Checklist Version Management','checklist.subtitle':'Each station owns an independent version chain: drafts are editable, released versions are immutable and assignment is explicit.','checklist.newDraft':'＋ New Draft','checklist.versions':'Versions','checklist.assignment':'Assignment & Sync','checklist.audit':'Audit Log',
      'agents.title':'Agent Live Status','agents.subtitle':'Field Agents report heartbeat, active version and running check tasks.','value.title':'Management Value','value.subtitle':'Turn field expertise into versioned, auditable and automated diagnostic capability.',
      'drawer.badge.failed':'Abnormal Station','drawer.badge.healthy':'Healthy Station','drawer.badge.switching':'Switching','drawer.health':'Health score','drawer.version':'Active version','drawer.agent':'Agent','drawer.last':'Last check','drawer.checks':'Checklist checks','drawer.logs':'Full logs','drawer.recheck':'Run check','drawer.connected':'Connected','drawer.problem':'Failed check','drawer.normal':'Normal check',
      'wpf.title':'Data Collection Operations Assistant','wpf.agentOnline':'Agent Online','wpf.apiConnected':'Central API Connected','wpf.summaryCopy':'1 critical issue detected; PCS, SQL Server and Agent runtime are healthy.','wpf.anomaly':'Issues','wpf.requiresReview':'Review required','wpf.passedCount':'Passed','wpf.coreNormal':'Core checks healthy','wpf.runningTasks':'Running Tasks','wpf.idle':'Idle','wpf.versionState':'Version State','wpf.v3Active':'v3 active','wpf.checkHint':'Select a check to review its result and recommended actions.','wpf.needsAction':'Needs Action','wpf.normal':'Healthy','wpf.scope':'Scope: Infor LN connection path','wpf.copy':'Copy','wpf.language':'Language','wpf.health':'Workstation Health','wpf.problem':'Issue Detected','wpf.runall':'Run All Checks','wpf.checklist':'Checklist','wpf.groups':'4 groups','wpf.recheck':'↻ Recheck','wpf.ai':'✦ Ask AI','wpf.target':'Target','wpf.port':'Port','wpf.latency':'Latency','wpf.last':'Last run','wpf.reason':'Failure Reason','wpf.impact':'Potential Impact','wpf.actions':'Recommended Actions','wpf.agentid':'AgentId','wpf.current':'Active Version','wpf.targetVersion':'Target Version','wpf.waitLimit':'Switch Wait Limit','wpf.updated':'Last Updated'
    },
    'es-MX': {
      'lang.name':'Español','theme.dark':'Oscuro','theme.light':'Claro','status.central':'Servicio central normal','top.title':'Centro de Operaciones Inteligentes de Captura de Datos',
      'nav.overview':'Resumen Operativo','nav.factory':'Plantas y Líneas','nav.agents':'Gestión de Agent','nav.checklist':'Configuración Checklist','nav.alerts':'Centro de Alertas','nav.language':'Idiomas','nav.settings':'Configuración','profile.admin':'Administrador',
      'overview.title':'Resumen Operativo','overview.desc':'Visualiza estaciones, Agent, Checklist y alertas en una sola pantalla y reduce el diagnóstico de horas a minutos.','overview.refresh':'↻ Actualizar','overview.timestamp':'Hora de datos · 2026-08-07 11:15',
      'kpi.stations':'Estaciones Gestionadas','kpi.stationsTrend':'39 normales · 3 con anomalía','kpi.agents':'Agents en Línea','kpi.agentsTrend':'95.2% en línea','kpi.checks':'Revisiones Automáticas Hoy','kpi.checksTrend':'98.7% automáticas','kpi.alerts':'Incidentes Pendientes','kpi.alertsTrend':'2 Critical',
      'map.title':'Gemelo Digital 3D de Estaciones','map.subtitle':'Vista topológica del estado de estaciones, Agents, Checklists y cambios de versión. Haz clic en una estación para ver el diagnóstico.','map.all':'Todas','map.failed':'Anomalías','map.switching':'Cambiando','map.healthy':'Normal','map.legendHealthy':'Normal','map.legendWarning':'Cambio de versión','map.legendFailed':'Anomalía / Offline','map.live':'LIVE · actualización 5s','map.health':'Salud','map.agent':'Agent','map.version':'Checklist','map.last':'Última revisión','map.open':'Ver detalle','map.online':'En línea','map.offline':'Offline','map.passed':'Normal','map.failure':'1 revisión falló','map.switch':'Preparando cambio','map.waiting':'Esperando tarea activa',
      'alerts.title':'Alertas en Tiempo Real','alerts.subtitle':'Ordenadas por impacto para decidir rápidamente si se requiere intervención manual.','alerts.pending':'5 pendientes',
      'checklist.title':'Gestión de Versiones Checklist','checklist.subtitle':'Cada estación mantiene versiones independientes: borradores editables, versiones publicadas inmutables y asignación manual.','checklist.newDraft':'＋ Nuevo Borrador','checklist.versions':'Versiones','checklist.assignment':'Asignación y Sync','checklist.audit':'Historial',
      'agents.title':'Estado de Agents','agents.subtitle':'Los Agents reportan heartbeat, versión activa y tareas de revisión en ejecución.','value.title':'Valor de Gestión','value.subtitle':'Convierte la experiencia de campo en capacidad de diagnóstico versionada, auditable y automática.',
      'drawer.badge.failed':'Estación con Anomalía','drawer.badge.healthy':'Estación Normal','drawer.badge.switching':'Cambiando','drawer.health':'Puntuación de salud','drawer.version':'Versión activa','drawer.agent':'Agent','drawer.last':'Última revisión','drawer.checks':'Revisiones Checklist','drawer.logs':'Ver logs','drawer.recheck':'Revisar ahora','drawer.connected':'Conectado','drawer.problem':'Revisión fallida','drawer.normal':'Revisión normal',
      'wpf.title':'Asistente de Operaciones de Captura de Datos','wpf.agentOnline':'Agent en línea','wpf.apiConnected':'API central conectada','wpf.summaryCopy':'Se detectó 1 incidencia crítica; PCS, SQL Server y el entorno de Agent están normales.','wpf.anomaly':'Incidencias','wpf.requiresReview':'Requiere revisión','wpf.passedCount':'Correctas','wpf.coreNormal':'Revisiones principales normales','wpf.runningTasks':'Tareas activas','wpf.idle':'Disponible','wpf.versionState':'Estado de versión','wpf.v3Active':'v3 activa','wpf.checkHint':'Selecciona una revisión para ver el resultado y las acciones recomendadas.','wpf.needsAction':'Requiere atención','wpf.normal':'Normal','wpf.scope':'Alcance: conexión de Infor LN','wpf.copy':'Copiar','wpf.language':'Idioma','wpf.health':'Salud de la Estación','wpf.problem':'Anomalía Detectada','wpf.runall':'Ejecutar Todo','wpf.checklist':'Checklist','wpf.groups':'4 grupos','wpf.recheck':'↻ Revisar','wpf.ai':'✦ Analizar con IA','wpf.target':'Destino','wpf.port':'Puerto','wpf.latency':'Duración','wpf.last':'Última ejecución','wpf.reason':'Causa del Fallo','wpf.impact':'Impacto Potencial','wpf.actions':'Acciones Recomendadas','wpf.agentid':'AgentId','wpf.current':'Versión Activa','wpf.targetVersion':'Versión Objetivo','wpf.waitLimit':'Límite de Espera','wpf.updated':'Última Actualización'
    },
    'th-TH': {
      'lang.name':'ไทย','theme.dark':'โหมดมืด','theme.light':'โหมดสว่าง','status.central':'บริการส่วนกลางปกติ','top.title':'ศูนย์ปฏิบัติการอัจฉริยะสำหรับการเก็บข้อมูล',
      'nav.overview':'ภาพรวมการทำงาน','nav.factory':'โรงงานและไลน์','nav.agents':'จัดการ Agent','nav.checklist':'ตั้งค่า Checklist','nav.alerts':'ศูนย์แจ้งเตือน','nav.language':'ภาษา','nav.settings':'ตั้งค่าระบบ','profile.admin':'ผู้ดูแลระบบ',
      'overview.title':'ภาพรวมการทำงาน','overview.desc':'ดูสถานี Agent Checklist และการแจ้งเตือนในหน้าจอเดียว เพื่อลดเวลาค้นหาปัญหาจากชั่วโมงเหลือเพียงไม่กี่นาที','overview.refresh':'↻ รีเฟรช','overview.timestamp':'เวลาข้อมูล · 2026-08-07 11:15',
      'kpi.stations':'สถานีที่ดูแล','kpi.stationsTrend':'39 ปกติ · 3 ผิดปกติ','kpi.agents':'Agent ออนไลน์','kpi.agentsTrend':'ออนไลน์ 95.2%','kpi.checks':'ตรวจอัตโนมัติวันนี้','kpi.checksTrend':'98.7% อัตโนมัติ','kpi.alerts':'เหตุขัดข้องค้าง','kpi.alertsTrend':'2 รายการ Critical',
      'map.title':'Digital Twin 3D ของสถานี','map.subtitle':'มุมมองโทโพโลยีของสุขภาพสถานี Agent Checklist และการสลับเวอร์ชัน คลิกสถานีเพื่อดูรายละเอียดวิเคราะห์','map.all':'ทั้งหมด','map.failed':'ผิดปกติ','map.switching':'กำลังสลับ','map.healthy':'ปกติ','map.legendHealthy':'ปกติ','map.legendWarning':'กำลังสลับ','map.legendFailed':'ผิดปกติ / Offline','map.live':'LIVE · รีเฟรชทุก 5 วินาที','map.health':'สุขภาพ','map.agent':'Agent','map.version':'Checklist','map.last':'ตรวจล่าสุด','map.open':'ดูรายละเอียด','map.online':'ออนไลน์','map.offline':'ออฟไลน์','map.passed':'ปกติ','map.failure':'ล้มเหลว 1 รายการ','map.switch':'เตรียมสลับ','map.waiting':'รอให้งานปัจจุบันเสร็จ',
      'alerts.title':'แจ้งเตือนแบบเรียลไทม์','alerts.subtitle':'เรียงตามผลกระทบ เพื่อให้ตัดสินใจได้รวดเร็วว่าต้องดำเนินการด้วยตนเองหรือไม่','alerts.pending':'ค้าง 5 รายการ',
      'checklist.title':'จัดการเวอร์ชัน Checklist','checklist.subtitle':'แต่ละสถานีมีเวอร์ชันของตนเอง: draft แก้ไขได้ เวอร์ชันที่ publish แล้วแก้ไขไม่ได้ และต้อง assign ด้วยตนเอง','checklist.newDraft':'＋ สร้าง Draft','checklist.versions':'เวอร์ชัน','checklist.assignment':'Assign และ Sync','checklist.audit':'ประวัติการเปลี่ยนแปลง',
      'agents.title':'สถานะ Agent แบบเรียลไทม์','agents.subtitle':'Agent หน้างานรายงาน heartbeat เวอร์ชันที่ใช้งาน และงานตรวจที่กำลังทำ','value.title':'คุณค่าด้านการจัดการ','value.subtitle':'เปลี่ยนประสบการณ์หน้างานให้เป็นความสามารถในการวิเคราะห์ที่มีเวอร์ชัน ตรวจสอบย้อนหลังได้ และทำงานอัตโนมัติ',
      'drawer.badge.failed':'สถานีผิดปกติ','drawer.badge.healthy':'สถานีปกติ','drawer.badge.switching':'กำลังสลับ','drawer.health':'คะแนนสุขภาพ','drawer.version':'เวอร์ชันปัจจุบัน','drawer.agent':'Agent','drawer.last':'ตรวจล่าสุด','drawer.checks':'รายการ Checklist','drawer.logs':'ดู Log','drawer.recheck':'ตรวจทันที','drawer.connected':'เชื่อมต่อแล้ว','drawer.problem':'รายการล้มเหลว','drawer.normal':'รายการปกติ',
      'wpf.title':'ผู้ช่วยปฏิบัติการเก็บข้อมูล','wpf.agentOnline':'Agent ออนไลน์','wpf.apiConnected':'เชื่อมต่อ Central API แล้ว','wpf.summaryCopy':'พบปัญหาสำคัญ 1 รายการ; PCS, SQL Server และสภาพแวดล้อม Agent ปกติ','wpf.anomaly':'ผิดปกติ','wpf.requiresReview':'ต้องตรวจสอบ','wpf.passedCount':'ผ่าน','wpf.coreNormal':'รายการหลักปกติ','wpf.runningTasks':'งานที่กำลังรัน','wpf.idle':'ว่าง','wpf.versionState':'สถานะเวอร์ชัน','wpf.v3Active':'v3 มีผลแล้ว','wpf.checkHint':'เลือกรายการตรวจเพื่อดูผลและขั้นตอนที่แนะนำ','wpf.needsAction':'ต้องดำเนินการ','wpf.normal':'ปกติ','wpf.scope':'ขอบเขต: เส้นทางเชื่อมต่อ Infor LN','wpf.copy':'คัดลอก','wpf.language':'ภาษา','wpf.health':'สุขภาพเวิร์กสเตชัน','wpf.problem':'พบความผิดปกติ','wpf.runall':'ตรวจทั้งหมด','wpf.checklist':'Checklist','wpf.groups':'4 กลุ่ม','wpf.recheck':'↻ ตรวจอีกครั้ง','wpf.ai':'✦ ให้ AI วิเคราะห์','wpf.target':'ปลายทาง','wpf.port':'พอร์ต','wpf.latency':'ระยะเวลา','wpf.last':'รันล่าสุด','wpf.reason':'สาเหตุที่ล้มเหลว','wpf.impact':'ผลกระทบที่เป็นไปได้','wpf.actions':'ขั้นตอนที่แนะนำ','wpf.agentid':'AgentId','wpf.current':'เวอร์ชันปัจจุบัน','wpf.targetVersion':'เวอร์ชันเป้าหมาย','wpf.waitLimit':'เวลารอสูงสุด','wpf.updated':'อัปเดตล่าสุด'
    }
  };

  window.OpsUI = {
    language: 'zh-CN',
    setTheme: function (theme) {
      document.documentElement.setAttribute('data-theme', theme);
      try { localStorage.setItem('dcops-ui-theme', theme); } catch (e) {}
      $('.theme-switch button').removeClass('active');
      $('.theme-switch button[data-theme="' + theme + '"]').addClass('active');
    },
    initTheme: function () {
      var saved = 'light';
      try { saved = localStorage.getItem('dcops-ui-theme') || 'light'; } catch (e) {}
      this.setTheme(saved);
      $(document).on('click', '.theme-switch button', function () { OpsUI.setTheme($(this).data('theme')); });
    },
    t: function (key) {
      var dict = dictionaries[this.language] || dictionaries['zh-CN'];
      return dict[key] || dictionaries['zh-CN'][key] || key;
    },
    setLanguage: function (language) {
      if (!dictionaries[language]) language = 'zh-CN';
      this.language = language;
      document.documentElement.setAttribute('lang', language);
      try { localStorage.setItem('dcops-ui-language', language); } catch (e) {}
      $('.ops-language').val(language);
      $('[data-i18n]').each(function () {
        var key = $(this).data('i18n');
        var value = OpsUI.t(key);
        if ($(this).is('input,textarea')) $(this).val(value); else $(this).text(value);
      });
      $(document).trigger('ops:languageChanged', [language]);
    },
    initLanguage: function () {
      var saved = 'zh-CN';
      try { saved = localStorage.getItem('dcops-ui-language') || 'zh-CN'; } catch (e) {}
      $(document).on('change', '.ops-language', function () { OpsUI.setLanguage($(this).val()); });
      this.setLanguage(saved);
    },
    toast: function (title, message) {
      var $toast = $('.toast');
      if (!$toast.length) return;
      $toast.stop(true, true).html('<strong>' + title + '</strong><p>' + message + '</p>').fadeIn(160);
      clearTimeout(window.__opsToastTimer);
      window.__opsToastTimer = setTimeout(function () { $toast.fadeOut(220); }, 2600);
    }
  };

  $(function () { OpsUI.initTheme(); OpsUI.initLanguage(); });
})(jQuery);
