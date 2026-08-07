(function ($) {
  'use strict';
  var model = window.DatabaseSchemaModel || {summary:{schemas:[],organization_hierarchy:[]},tables:[],relationships:[]};
  var state = {schema:'all', query:'', active:'cfg.organization_unit'};

  var locale = {
    'zh-CN': {
      'nav.database':'数据库架构','top.database':'数据库架构','status.schemaReady':'结构模型已加载',
      'hero.title':'运维平台数据库架构','hero.desc':'从组织与配置、采集代理、执行监控、多语言到审计集成，完整展示系统数据模型与表间关系。','export.excel':'导出数据库表结构',
      'domain.title':'五大数据域','domain.subtitle':'配置驱动 · 代理执行 · 状态闭环','domain.flowNote':'核心链路：配置版本下发 → 采集代理执行 → 结果回传 → 当前状态 / 告警 → 审计追踪',
      'org.title':'组织与现场层级','explorer.tables':'全部数据表','search.placeholder':'搜索表名、字段或业务含义','detail.fields':'字段','detail.copy':'复制表名',
      'field.name':'字段','field.type':'类型','field.reference':'引用','field.meaning':'业务含义','relation.title':'表关系',
      'filter.all':'全部','kpi.schemas':'数据域','kpi.tables':'数据表','kpi.fields':'字段','kpi.relations':'外键关系','relation.none':'当前表没有外键关系','relation.out':'引用','relation.in':'被引用','toast.copy':'已复制','toast.export':'Excel 数据字典已准备下载'
    },
    'en-US': {
      'nav.database':'Database Blueprint','top.database':'Database Blueprint','status.schemaReady':'Schema model loaded',
      'hero.title':'Operations Database Blueprint','hero.desc':'Explore the complete data model across configuration, Agents, monitoring, localization and audit domains.','export.excel':'Export Database Dictionary Excel',
      'domain.title':'Five Data Domains','domain.subtitle':'Config-driven · Agent execution · Closed-loop status','domain.flowNote':'Core flow: version assignment → Agent execution → result upload → current status / alerts → audit trail',
      'org.title':'Organization & Shopfloor Hierarchy','explorer.tables':'All Tables','search.placeholder':'Search table, field or business meaning','detail.fields':'Fields','detail.copy':'Copy table name',
      'field.name':'Field','field.type':'Type','field.reference':'Reference','field.meaning':'Business Meaning','relation.title':'Relationships',
      'filter.all':'All','kpi.schemas':'Schemas','kpi.tables':'Tables','kpi.fields':'Fields','kpi.relations':'FK Relations','relation.none':'No foreign-key relationship for this table','relation.out':'References','relation.in':'Referenced by','toast.copy':'Copied','toast.export':'Excel data dictionary is ready'
    },
    'es-MX': {
      'nav.database':'Arquitectura de Datos','top.database':'Arquitectura de Datos','status.schemaReady':'Modelo cargado',
      'hero.title':'Arquitectura de Base de Datos','hero.desc':'Modelo completo de configuración, Agents, monitoreo, localización y auditoría.','export.excel':'Exportar Diccionario a Excel',
      'domain.title':'Cinco Dominios de Datos','domain.subtitle':'Configuración · Ejecución Agent · Ciclo cerrado','domain.flowNote':'Flujo: versión → ejecución Agent → resultado → estado / alertas → auditoría',
      'org.title':'Jerarquía Organizacional y de Planta','explorer.tables':'Todas las Tablas','search.placeholder':'Buscar tabla, campo o significado','detail.fields':'Campos','detail.copy':'Copiar tabla',
      'field.name':'Campo','field.type':'Tipo','field.reference':'Referencia','field.meaning':'Significado','relation.title':'Relaciones',
      'filter.all':'Todas','kpi.schemas':'Schemas','kpi.tables':'Tablas','kpi.fields':'Campos','kpi.relations':'Relaciones FK','relation.none':'Esta tabla no tiene relaciones FK','relation.out':'Referencia','relation.in':'Referenciada por','toast.copy':'Copiado','toast.export':'Diccionario Excel listo'
    },
    'th-TH': {
      'nav.database':'สถาปัตยกรรมฐานข้อมูล','top.database':'สถาปัตยกรรมฐานข้อมูล','status.schemaReady':'โหลด Schema แล้ว',
      'hero.title':'โครงสร้างฐานข้อมูลระบบปฏิบัติการ','hero.desc':'แสดงโมเดลข้อมูลครบทั้งการตั้งค่า Agent การตรวจสอบ ภาษา และ Audit','export.excel':'ส่งออกโครงสร้างฐานข้อมูล Excel',
      'domain.title':'5 โดเมนข้อมูล','domain.subtitle':'Config · Agent · Monitoring Loop','domain.flowNote':'เส้นทางหลัก: แจกเวอร์ชัน → Agent ทำงาน → ส่งผลลัพธ์ → สถานะ / Alert → Audit',
      'org.title':'ลำดับชั้นองค์กรและหน้างาน','explorer.tables':'ตารางทั้งหมด','search.placeholder':'ค้นหาตาราง ฟิลด์ หรือความหมาย','detail.fields':'ฟิลด์','detail.copy':'คัดลอกชื่อตาราง',
      'field.name':'ฟิลด์','field.type':'ชนิด','field.reference':'อ้างอิง','field.meaning':'ความหมาย','relation.title':'ความสัมพันธ์',
      'filter.all':'ทั้งหมด','kpi.schemas':'Schemas','kpi.tables':'ตาราง','kpi.fields':'ฟิลด์','kpi.relations':'FK','relation.none':'ตารางนี้ไม่มีความสัมพันธ์ FK','relation.out':'อ้างอิง','relation.in':'ถูกอ้างอิง','toast.copy':'คัดลอกแล้ว','toast.export':'ไฟล์ Excel พร้อมดาวน์โหลด'
    }
  };

  function tr(key) {
    var lang = (window.OpsUI && OpsUI.language) || 'zh-CN';
    var dict = locale[lang] || locale['zh-CN'];
    return dict[key] || locale['zh-CN'][key] || key;
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function schemaClass(code){ return 'db-schema-' + code.replace(/[^a-z0-9]/ig,'-'); }

  function renderKpis(){
    var items=[
      ['kpi.schemas', model.summary.schema_count, '5 个数据域'],
      ['kpi.tables', model.summary.table_count, '数据表模型'],
      ['kpi.fields', model.summary.field_count, '字段字典'],
      ['kpi.relations', model.summary.relationship_count, '关系图谱']
    ];
    $('#dbKpis').html(items.map(function(x){
      return '<article class="card db-kpi-card"><div class="db-kpi-top"><span>'+esc(tr(x[0]))+'</span><i></i></div><strong>'+esc(x[1])+'</strong><small>'+esc(x[2])+'</small></article>';
    }).join(''));
  }

  function renderDomains(){
    var arrows = {'cfg':'配置','agent':'运行','monitor':'监控','localization':'多语','audit':'审计'};
    $('#dbDomainFlow').html(model.summary.schemas.map(function(s,idx){
      var arrow=idx<model.summary.schemas.length-1?'<span class="db-domain-arrow">→</span>':'';
      return '<div class="db-domain-node '+schemaClass(s.code)+'" data-schema="'+esc(s.code)+'">'+
        '<div class="db-domain-icon">'+esc(s.code.toUpperCase().slice(0,3))+'</div><div class="db-domain-copy"><b>'+esc(s.name)+'</b><span>'+esc(s.code)+' · '+s.table_count+' TABLES</span><small>'+esc(s.description)+'</small></div><em>'+esc(arrows[s.code]||'DATA')+'</em></div>'+arrow;
    }).join(''));
  }

  function renderOrg(){
    $('#dbOrgChain').html(model.summary.organization_hierarchy.map(function(level,idx){
      var levelMap={'Group':'集团','BU':'事业部','Country':'国家','Company':'公司','Plant':'工厂','Workshop / Area':'车间/区域','Line':'产线','Station':'工位'}; var codeMap={'Group':'集团','BU':'事业部','Country':'国家','Company':'公司','Plant':'工厂','Workshop / Area':'区域','Line':'产线','Station':'工位'}; var label=levelMap[level]||level; var code=codeMap[level]||'';
      return '<div class="db-org-node"><span>'+String(idx+1).padStart(2,'0')+'</span><b>'+esc(label)+'</b><small>'+esc(code)+'</small></div>'+(idx<model.summary.organization_hierarchy.length-1?'<i>›</i>':'');
    }).join(''));
  }

  function renderFilters(){
    var html='<button class="active" data-schema="all">'+esc(tr('filter.all'))+' <span>'+model.summary.table_count+'</span></button>';
    model.summary.schemas.forEach(function(s){ html+='<button data-schema="'+esc(s.code)+'">'+esc(s.code)+' <span>'+s.table_count+'</span></button>'; });
    $('#dbSchemaFilter').html(html);
  }

  function tableMatches(t){
    if(state.schema!=='all' && t.schema!==state.schema) return false;
    var q=state.query.trim().toLowerCase(); if(!q) return true;
    if((t.full_name+' '+t.description+' '+t.domain_name).toLowerCase().indexOf(q)>=0) return true;
    return t.columns.some(function(c){ return (c.name+' '+c.type+' '+c.description+' '+c.reference).toLowerCase().indexOf(q)>=0; });
  }

  function renderTableList(){
    var visible=model.tables.filter(tableMatches);
    $('#dbTableCount').text(visible.length);
    var groups={}; visible.forEach(function(t){ (groups[t.schema]||(groups[t.schema]=[])).push(t); });
    var html='';
    model.summary.schemas.forEach(function(s){
      var list=groups[s.code]||[]; if(!list.length) return;
      html+='<div class="db-table-group"><div class="db-table-group-title"><span>'+esc(s.code)+'</span><small>'+list.length+'</small></div>';
      list.forEach(function(t){
        var out=model.relationships.filter(function(r){return r.source_table===t.full_name;}).length;
        html+='<button class="db-table-item '+(state.active===t.full_name?'active ':'')+schemaClass(t.schema)+'" data-table="'+esc(t.full_name)+'"><span class="db-table-glyph">▤</span><span class="db-table-copy"><b>'+esc(t.table)+'</b><small>'+t.columns.length+' fields · '+out+' FK</small></span><span class="db-table-chevron">›</span></button>';
      });
      html+='</div>';
    });
    if(!html) html='<div class="db-empty">没有匹配的数据表</div>';
    $('#dbTableList').html(html);
    if(visible.length && !visible.some(function(t){return t.full_name===state.active;})){
      state.active=visible[0].full_name; renderDetail(); $('#dbTableList .db-table-item').first().addClass('active');
    }
  }

  function findTable(name){ return model.tables.find(function(t){return t.full_name===name;}); }

  function renderDetail(){
    var t=findTable(state.active); if(!t) return;
    var out=model.relationships.filter(function(r){return r.source_table===t.full_name;});
    var incoming=model.relationships.filter(function(r){return r.target_table===t.full_name;});
    $('#dbActiveSchema').attr('class','db-schema-code '+schemaClass(t.schema)).text(t.schema);
    $('#dbActiveTable').text(t.table);
    $('#dbActivePurpose').text(t.description);
    $('#dbFieldCount').text(t.columns.length); $('#dbOutFkCount').text(out.length); $('#dbInFkCount').text(incoming.length);
    $('#dbFullTable').html('<b>'+esc(t.full_name)+'</b>');
    $('#dbSourceScript').text('建表脚本 · '+t.source);
    $('#dbFieldRows').html(t.columns.map(function(c){
      var key=c.pk?'<span class="db-key pk">PK</span>':(c.fk?'<span class="db-key fk">FK</span>':(c.unique?'<span class="db-key uq">UQ</span>':'<span class="db-key none">—</span>'));
      var ref=c.reference?'<button class="db-ref-link" data-ref-table="'+esc(c.fk.table)+'">'+esc(c.reference)+'</button>':'<span class="muted">—</span>';
      var nullable=c.nullable?'<span class="db-null yes">YES</span>':'<span class="db-null no">NO</span>';
      var def=c.default?'<div class="db-default">DEFAULT '+esc(c.default)+'</div>':'';
      return '<tr><td class="db-ordinal">'+c.ordinal+'</td><td><code>'+esc(c.name)+'</code>'+def+'</td><td><span class="db-type">'+esc(c.type)+'</span></td><td>'+nullable+'</td><td>'+key+'</td><td>'+ref+'</td><td class="db-meaning">'+esc(c.description)+'</td></tr>';
    }).join(''));

    var rels=[];
    out.forEach(function(r){rels.push('<button class="db-relation-item outgoing" data-ref-table="'+esc(r.target_table)+'"><span>↗</span><div><small>'+esc(tr('relation.out'))+'</small><b>'+esc(r.source_column)+' → '+esc(r.target_table)+'.'+esc(r.target_column)+'</b></div></button>');});
    incoming.forEach(function(r){rels.push('<button class="db-relation-item incoming" data-ref-table="'+esc(r.source_table)+'"><span>↙</span><div><small>'+esc(tr('relation.in'))+'</small><b>'+esc(r.source_table)+'.'+esc(r.source_column)+' → '+esc(r.target_column)+'</b></div></button>');});
    $('#dbRelationSummary').text(out.length+' OUT · '+incoming.length+' IN');
    $('#dbRelationList').html(rels.length?rels.join(''):'<div class="db-relation-empty">'+esc(tr('relation.none'))+'</div>');
  }

  function applyPageLocale(){
    $('[data-db-i18n]').each(function(){ $(this).text(tr($(this).attr('data-db-i18n'))); });
    $('[data-db-placeholder]').each(function(){ $(this).attr('placeholder',tr($(this).attr('data-db-placeholder'))); });
    renderKpis(); renderFilters(); renderDetail();
  }

  $(function(){
    renderKpis(); renderDomains(); renderOrg(); renderFilters(); renderTableList(); renderDetail(); applyPageLocale();

    $(document).on('ops:languageChanged', function(){ applyPageLocale(); });
    $('#dbSchemaFilter').on('click','button',function(){
      state.schema=$(this).data('schema'); $('#dbSchemaFilter button').removeClass('active'); $(this).addClass('active'); renderTableList();
    });
    $('#dbSearch').on('input',function(){ state.query=$(this).val()||''; renderTableList(); });
    $('#dbTableList').on('click','.db-table-item',function(){ state.active=$(this).data('table'); $('#dbTableList .db-table-item').removeClass('active'); $(this).addClass('active'); renderDetail(); });
    $(document).on('click','[data-ref-table]',function(){
      var name=$(this).data('ref-table'); if(!findTable(name)) return;
      state.active=name; state.schema='all'; state.query=''; $('#dbSearch').val(''); renderFilters(); renderTableList(); renderDetail();
      var el=document.querySelector('.db-table-detail'); if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    });
    $('#dbCopyName').on('click',function(){
      var text=state.active;
      if(navigator.clipboard && navigator.clipboard.writeText){navigator.clipboard.writeText(text);}
      OpsUI.toast(tr('toast.copy'), text);
    });
    $('.db-export-btn').on('click',function(){ OpsUI.toast('Excel',tr('toast.export')); });
    $('#dbDomainFlow').on('click','.db-domain-node',function(){
      state.schema=$(this).data('schema'); state.query=''; $('#dbSearch').val(''); renderFilters(); $('#dbSchemaFilter button[data-schema="'+state.schema+'"]').addClass('active').siblings().removeClass('active'); renderTableList();
      document.querySelector('.db-explorer').scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
})(jQuery);
