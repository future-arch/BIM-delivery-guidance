# BIM 交付指南 · 写作工作台

> 这是供作者目视检查的本地写作站点。所有内容直接渲染自仓库 `docs/` 下的 Markdown 源文件，左侧导航按"主线 / 对照 / 支撑"分组。

## 项目目标

编制一部约 **30 万字** 的中文《建筑信息模型（BIM）交付指南》——指南体例（非标准体例），最终交付 PDF。

- **双重定位**：面向中国工程实践（设计 / 施工 / 竣工 / 运维），同时与 ISO 19650、buildingSMART 等国际体系建立映射。
- **双重受众**：工程建设人员 + 软件开发者。
- **核心来源**：用户旧版草稿 [`sources/older-version-guidance/`](https://github.com/) 是核心内容来源（不仅是参考），必须沿用其理论框架（范式转变、B-I-M 解构、信息三维论等）。

## 当前写作进度

<div class="dashboard-section" markdown="0">

<div class="stat-cards" id="stat-cards"></div>

<div class="progress-shell" id="progress-shell"></div>

<div class="chart-row">
  <div class="chart-card">
    <h3>各章字符数（含 Markdown 标记）</h3>
    <div class="chart-sub">
      横轴为字符数；颜色按四大部分分组；虚线为建议章均字数（30K）。
    </div>
    <div id="chapter-chart" class="chart-canvas"></div>
  </div>
  <div class="chart-card">
    <h3>四大部分构成</h3>
    <div class="chart-sub">
      按写作框架的四大部分汇总各章字符数占比。
    </div>
    <div id="section-pie" class="chart-canvas"></div>
  </div>
</div>

</div>

> **数据来源**：直接来自 `docs/GEMINI/*.md` 的 `wc -m` 字符数（包含 Markdown 语法标记，约相当于 0.85 倍中文净字数）。  
> **数据更新日期**：2026-05-02（更新数据需修改 `docs/javascripts/dashboard.js` 顶部 `CHAPTERS` 常量）。

### 支撑材料

- **证据台账**：24 条证据，覆盖 ISO 19650 全系 / 12006 / 23387 / 29481 等
- **术语表**：25 行，待大幅扩充
- **章节双版本对照**：第 3、4、5 章均有"最新版"与"旧版"双轨，新版命名为 03X / 04X / 05X

## 待决断的关键问题

1. **章节体系最终确定**：GEMINI 9 章为主线写作体系，原 19 章字数规划仅作参考。是否正式宣告主线选定？
2. **旧版章节归档**：03 / 04 / 05 旧版可在 03X / 04X / 05X 稳定后移入 `older-version/`。
3. **支撑材料补全**：术语表与参考文献尚未达到出版标准，需要专项推进。
4. **AGENTS.md 第 16 节"当前启动任务"已与实际进度不符**，建议同步更新。

## 使用指引

- 顶部搜索框支持中英文全文检索（jieba 分词）。
- 每页右侧显示**最近修改时间**（基于 git，方便追踪写作节奏）。
- 右上角太阳/月亮图标可切换深色模式。
- 左侧导航分组的顺序就是建议的阅读顺序：先看大纲规划，再看 GEMINI 主线，对照旧版与支撑材料。

## 本站如何运行

```bash
# 启动本地服务器（已在后台运行）
~/devs-local/venvs/bim-guidance/bin/mkdocs serve -f mkdocs.yml

# 导出静态站点到 outputs/site/
~/devs-local/venvs/bim-guidance/bin/mkdocs build -f mkdocs.yml
```

服务器开启后实时热加载，**编辑任意 `.md` 文件后浏览器会自动刷新**。

