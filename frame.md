---
colors:
  canvas: "#F3F7FA"
  surface: "#FFFFFF"
  ink: "#10273A"
  muted: "#61788A"
  primary: "#176B87"
  primary_dark: "#0E4359"
  signal: "#D94A4A"
  success: "#2E8B72"
  warning: "#D59135"
  line: "#C9D9E3"
typography:
  display: "Montserrat"
  display_weight: 900
  body: "Arial"
  body_weight: 400
  data: "IBM Plex Mono"
  data_weight: 700
spacing:
  canvas: "1440x900"
  outer_margin: "40px"
  grid: "8px"
components:
  radius_panel: "18px"
  radius_control: "10px"
  border: "2px solid #C9D9E3"
  shadow: "0 18px 50px rgba(16,39,58,0.12)"
---

## Overview

“医学教学指挥中心”：可信、克制、面向决策者。整体像一套真实可部署的教学操作系统，而不是概念海报。医学蓝表示系统与教学过程，生命体征红只用于风险、倒计时与病情恶化。

## Composition Rules

- 每屏只设一个主任务区，支持区域围绕它组织；领导在三秒内应知道当前教学环节。
- Agent 始终以带身份标签的过程轨呈现：输入依据 → 推理状态 → 建议 → 教师/学生决策。
- 关键数字使用 IBM Plex Mono 与等宽数字；标题使用 Montserrat 900；中文正文使用 Arial 映射的稳定无衬线字形。
- 卡片高度不求一致；禁止模板化等分卡片墙。使用边缘锚点、纵向状态轨和大幅 VSP 舞台建立层级。
- 3D VSP、心电曲线和知识图谱是功能画面，不作为无意义装饰。

## Motion Character

精确、因果清晰。点击触发 Agent 工作，Agent 结果触发生理变化或教学评价；不使用无因漂浮和无限循环。普通页面推进保持向左的视觉流，进入 VSP 与评价结论时才使用纵深推进。

## Avoid

- 不使用霓虹赛博医疗、紫蓝渐变、玻璃拟态堆叠。
- 不伪造校徽、官方标准色、科研成果或真实学生数据。
- 不让 Agent 建议看起来可以绕过教师确认。
