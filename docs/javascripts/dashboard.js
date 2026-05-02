/* =======================================================================
   项目仪表盘 · 字数可视化（基于 ECharts 5）
   数据更新日期：2026-05-02
   ======================================================================= */

(function () {
  // ---- 数据：当前各章节字符数 ----
  const CHAPTERS = [
    { id: '01',  name: '第 1 章 综述',                       count: 9774,   group: 'I.  背景与观念', status: 'draft' },
    { id: '02',  name: '第 2 章 技术基础',                   count: 36322,  group: 'I.  背景与观念', status: 'done' },
    { id: '03X', name: '第 3 章 信息组织 (03X)',             count: 142688, group: 'II. 方法主干',   status: 'done' },
    { id: '04X', name: '第 4 章 信息交付 (04X)',             count: 55411,  group: 'II. 方法主干',   status: 'done' },
    { id: '05X', name: '第 5 章 实施指南 (05X)',             count: 35456,  group: 'III.实施落地',   status: 'done' },
    { id: '06',  name: '第 6 章 施工图设计阶段',             count: 45055,  group: 'IV. 阶段实务',   status: 'done' },
    { id: '07',  name: '第 7 章 施工阶段',                   count: 42354,  group: 'IV. 阶段实务',   status: 'done' },
    { id: '08',  name: '第 8 章 竣工移交',                   count: 39602,  group: 'IV. 阶段实务',   status: 'done' },
    { id: '09',  name: '第 9 章 运营维护',                   count: 40063,  group: 'IV. 阶段实务',   status: 'done' },
  ];

  const TARGET_TOTAL  = 300000;       // 全书目标字符数（含 markdown 标记）
  const TARGET_PER_CH = 30000;        // 每章建议中位字符数（仅作参考线）

  // ---- 颜色（与站点主题一致）----
  const COLOR = {
    bg:        '#F5EFE3',
    bgAlt:     '#ECE3CF',
    fg:        '#26334A',
    fgLight:   '#6F7B90',
    grid:      'rgba(38, 51, 74, 0.08)',
    accent:    '#3F5878',
    accentHi:  '#5B7AA0',
    target:    '#A8553B',     // 暖锈红，用于参考线
    groupColors: {
      'I.  背景与观念': '#7B6B57',     // 暖棕
      'II. 方法主干':   '#3F5878',     // 海军蓝
      'III.实施落地':   '#6E8A6F',     // 灰绿
      'IV. 阶段实务':   '#A8553B',     // 暖锈红
    }
  };

  // ---- 工具函数 ----
  const fmtNum = n => n.toLocaleString('en-US');
  const fmtK   = n => (n / 1000).toFixed(n >= 100000 ? 0 : 1) + 'K';

  // ---- 计算汇总 ----
  const total      = CHAPTERS.reduce((s, c) => s + c.count, 0);
  const totalCh    = CHAPTERS.length;
  const doneCh     = CHAPTERS.filter(c => c.count >= TARGET_PER_CH * 0.7).length;
  const progress   = Math.min(100, (total / TARGET_TOTAL) * 100);

  // ---- 渲染统计卡片 ----
  function renderStatCards() {
    const host = document.querySelector('#stat-cards');
    if (!host) return;
    host.innerHTML = `
      <div class="stat-card" style="--accent:${COLOR.accent}">
        <div class="label">已写字符数</div>
        <div class="value">${fmtNum(total)}<span class="unit">字符</span></div>
        <div class="sub">含 Markdown 标记，约合 ${(total * 0.85 / 10000).toFixed(1)} 万纯中文字</div>
      </div>
      <div class="stat-card" style="--accent:${COLOR.target}">
        <div class="label">目标完成度</div>
        <div class="value">${progress.toFixed(0)}<span class="unit">%</span></div>
        <div class="sub">目标 ${fmtNum(TARGET_TOTAL)} 字符（30 万字）</div>
      </div>
      <div class="stat-card" style="--accent:${COLOR.groupColors['III.实施落地']}">
        <div class="label">已成稿章节</div>
        <div class="value">${doneCh}<span class="unit">/ ${totalCh} 章</span></div>
        <div class="sub">达到目标 70% 视为成稿</div>
      </div>
    `;
  }

  // ---- 渲染总进度条 ----
  function renderProgressBar() {
    const host = document.querySelector('#progress-shell');
    if (!host) return;
    host.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:baseline">
        <div style="font-size:0.95rem;font-weight:600;color:${COLOR.fg}">全书写作总进度</div>
        <div style="font-size:0.78rem;color:${COLOR.fgLight}">基于字符数（含标记）/ 目标 30 万字</div>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width:0%"></div>
      </div>
      <div class="progress-meta">
        <span>0</span>
        <span class="right">${fmtNum(total)} / ${fmtNum(TARGET_TOTAL)} (${progress.toFixed(1)}%)</span>
      </div>
    `;
    // 触发动画
    requestAnimationFrame(() => {
      const fill = host.querySelector('.progress-fill');
      if (fill) fill.style.width = progress.toFixed(2) + '%';
    });
  }

  // ---- 渲染章节横向柱状图 ----
  function renderChapterChart() {
    const dom = document.getElementById('chapter-chart');
    if (!dom || !window.echarts) return;

    const chart = echarts.init(dom, null, { renderer: 'svg' });

    // 倒序（图表下方为第 1 章）
    const sorted = [...CHAPTERS].reverse();
    const yLabels = sorted.map(c => c.name);
    const data    = sorted.map(c => ({
      value: c.count,
      itemStyle: { color: COLOR.groupColors[c.group] || COLOR.accent },
      group: c.group,
    }));

    chart.setOption({
      animationDuration: 900,
      animationEasing: 'cubicOut',
      grid: { left: 145, right: 70, top: 28, bottom: 28 },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#F5EFE3',
        borderColor: 'rgba(38, 51, 74, 0.15)',
        textStyle: { color: COLOR.fg, fontSize: 12 },
        formatter: (params) => {
          const p = params[0];
          const item = sorted[p.dataIndex];
          return `<div style="font-weight:600;margin-bottom:4px">${item.name}</div>
                  <div style="color:${COLOR.fgLight};font-size:11px">${item.group}</div>
                  <div style="margin-top:5px;font-size:13px">
                    <b>${fmtNum(item.count)}</b> 字符
                  </div>`;
        }
      },
      xAxis: {
        type: 'value',
        max: 150000,
        axisLine: { lineStyle: { color: COLOR.grid } },
        axisLabel: {
          color: COLOR.fgLight,
          fontSize: 10,
          formatter: v => v / 1000 + 'K',
        },
        splitLine: { lineStyle: { color: COLOR.grid, type: 'dashed' } },
      },
      yAxis: {
        type: 'category',
        data: yLabels,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: COLOR.fg,
          fontSize: 12,
          fontWeight: 500,
        },
      },
      series: [{
        name: '字符数',
        type: 'bar',
        data: data,
        barWidth: 18,
        itemStyle: { borderRadius: [0, 4, 4, 0] },
        label: {
          show: true,
          position: 'right',
          color: COLOR.fg,
          fontSize: 11,
          fontWeight: 600,
          formatter: p => fmtK(p.value),
        },
        markLine: {
          symbol: 'none',
          silent: true,
          lineStyle: { color: COLOR.target, type: 'dashed', width: 1 },
          data: [{
            xAxis: TARGET_PER_CH,
            label: {
              show: true,
              formatter: '建议章均 ' + fmtK(TARGET_PER_CH),
              color: COLOR.target,
              fontSize: 10,
              position: 'end',
            },
          }],
        },
      }],
    });

    window.addEventListener('resize', () => chart.resize());
  }

  // ---- 渲染部分构成（按 group 聚合）----
  function renderSectionPie() {
    const dom = document.getElementById('section-pie');
    if (!dom || !window.echarts) return;

    const chart = echarts.init(dom, null, { renderer: 'svg' });
    const groups = {};
    CHAPTERS.forEach(c => {
      groups[c.group] = (groups[c.group] || 0) + c.count;
    });
    const data = Object.keys(groups).map(g => ({
      name: g,
      value: groups[g],
      itemStyle: { color: COLOR.groupColors[g] || COLOR.accent },
    }));

    chart.setOption({
      animationDuration: 900,
      tooltip: {
        trigger: 'item',
        backgroundColor: '#F5EFE3',
        borderColor: 'rgba(38, 51, 74, 0.15)',
        textStyle: { color: COLOR.fg, fontSize: 12 },
        formatter: (p) => `<div style="font-weight:600">${p.name}</div>
                           <div style="margin-top:4px;font-size:13px">
                             <b>${fmtNum(p.value)}</b> 字符
                             <span style="color:${COLOR.fgLight};margin-left:6px">(${p.percent}%)</span>
                           </div>`,
      },
      legend: {
        bottom: 0,
        left: 'center',
        textStyle: { color: COLOR.fgLight, fontSize: 11 },
        itemWidth: 14,
        itemHeight: 8,
        itemGap: 14,
      },
      series: [{
        name: '部分构成',
        type: 'pie',
        radius: ['45%', '72%'],
        center: ['50%', '44%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: COLOR.bg,
          borderWidth: 3,
        },
        label: {
          show: true,
          formatter: '{d}%',
          color: '#FFFFFF',
          fontSize: 12,
          fontWeight: 600,
        },
        labelLine: { show: false },
        data: data,
      }],
    });

    window.addEventListener('resize', () => chart.resize());
  }

  // ---- 在 DOM 就绪 + ECharts 加载完成后初始化 ----
  function init() {
    if (!document.querySelector('#stat-cards')) return; // 不在仪表盘页面则跳过
    renderStatCards();
    renderProgressBar();
    if (window.echarts) {
      renderChapterChart();
      renderSectionPie();
    } else {
      // 兜底：等待 ECharts 加载
      let tries = 0;
      const t = setInterval(() => {
        tries++;
        if (window.echarts) {
          clearInterval(t);
          renderChapterChart();
          renderSectionPie();
        } else if (tries > 50) {
          clearInterval(t);
        }
      }, 100);
    }
  }

  // mkdocs Material 在切换页面时不重载 JS，需监听
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  // mkdocs material instant navigation
  if (window.document$) {
    window.document$.subscribe(() => init());
  }
})();
