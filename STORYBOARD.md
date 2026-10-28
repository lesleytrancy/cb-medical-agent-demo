---
format: 1440x900
message: 教师引导下，多智能体能够把医学知识、临床实训与个性化评价连接成可控、可量化的教学闭环
arc: 教师统筹 → 发布病例 → 学生接诊 → Agent协作 → 决策与转归 → 个性评价 → 教师干预 → 改革全景
audience: 校领导与评审专家
mode: collaborative
interaction: full-spa-demo
plan_status: approved
---

## Frame 1 — 临床教学驾驶舱

- status: outline
- src: compositions/frames/01-command-center.html
- duration: interactive
- poster: 2s
- scene: 全班态势、今日实训、能力分布与教师待干预事项汇聚在一个决策首页
- blueprint: dataviz-countup + grid-card-assemble
- sustained_motion: sequenced-ui-life

开场先回答评审最关心的问题：这不是孤立的 AI 工具，而是一套由教师掌舵的教学运行系统。首页显示“2026级临床医学1班”、32名学生、急性心肌梗死实训和3条待干预预警；主按钮进入“发布病例”。

Agent 触点：教学编排 Agent 汇总课程目标、班级画像和本周教学任务，但所有发布动作均标明“等待教师确认”。

## Frame 2 — 教师发布黄金30分钟案例

- status: outline
- src: compositions/frames/02-case-release.html
- duration: interactive
- poster: 2s
- scene: 教师选择病例、教学目标、难度和Agent角色，一键发布给指定班级
- blueprint: panel-edit-live-sync
- sustained_motion: cursor-led-action

左侧是案例参数与特殊约束，中央是“急性心肌梗死·急诊黄金30分钟”任务卡，右侧实时显示知识图谱覆盖节点和评价指标。教师调整“病情进展速度”或“允许提示等级”时，病例预览同步改变。

Agent 触点：病例生成 Agent、知识图谱 Agent、评价 Agent 分别展示自己的输入与拟执行任务；教师点击“批准并发布”才正式下发。

## Frame 3 — 医学生成长操作系统

- status: outline
- src: compositions/frames/03-student-os.html
- duration: interactive
- poster: 2s
- scene: 学生登录后获得今日学习处方，并从桌面式应用进入虚拟急诊
- blueprint: cursor-ui-demo
- sustained_motion: sequenced-ui-life

桌面包含虚拟病房、知识图谱、智能导师、考试中心、成长档案五个应用。中央“今日学习处方”提示该生先完成心电图判读，再进入并发症处理；右上角展示教师已发布的新任务。

Agent 触点：伴随学习 Agent 解释推荐依据，列出来自画像的薄弱节点，并提供“为什么推荐”可展开证据，不直接替学生作答。

## Frame 4 — 虚拟急诊：高仿真VSP

- status: outline
- src: compositions/frames/04-vsp-emergency.html
- duration: interactive
- poster: 2s
- scene: 3D患者、生命体征、急诊倒计时、问诊对话与操作台同屏协作
- blueprint: device-surface-showcase + camera-journey
- sustained_motion: sequenced-ui-life

这是 Demo 的英雄页面。中央为可旋转的程序化 3D 患者与心脏冠脉示意；顶部倒计时从30:00开始，监护区显示 HR 112、BP 92/60、SpO₂ 93% 和动态心电。学生可选择问诊、查体、检查、医嘱四类操作。

Agent 触点：VSP 对话 Agent 以患者口吻回答；生理模拟 Agent 在后台依据时间和操作更新体征；安全监督 Agent 只在高风险操作前提示确认，不替学生诊断。

## Frame 5 — 多智能体协作问诊与知识溯源

- status: outline
- src: compositions/frames/05-agent-workbench.html
- duration: interactive
- poster: 2s
- scene: 一次开放式问诊触发患者回应、信息抽取、知识图谱和苏格拉底式导师协作
- blueprint: prompt-type-submit-generate + agent-progress-theater
- sustained_motion: staged-reveals

学生输入“疼痛是什么时候开始的？有没有向其他部位放射？”后，页面按因果顺序展示：VSP 回答 → 症状结构化 → 图谱关联“胸痛—左肩放射—ACS” → 导师反问“你还需要排除哪一种致命性胸痛？”右侧证据抽屉标注指南来源与节点路径。

Agent 触点：每个 Agent 都显示输入、工作中状态、输出和置信度；界面明确区分“建议”与“学生已采纳”。

## Frame 6 — 临床决策分支与病情转归

- status: outline
- src: compositions/frames/06-decision-branch.html
- duration: interactive
- poster: 2s
- scene: 学生下达检查和用药医嘱，3D患者与生命体征随决策进入不同分支
- blueprint: agent-progress-theater + comparison-split
- sustained_motion: animated-sequences

学生先选择“12导联心电图 + 肌钙蛋白”，再提交“阿司匹林300mg嚼服”。模拟引擎显示诊断证据增加、心率回落和胸痛评分下降。点击“查看另一分支”可对比延误再灌注导致的室性心律失常，突出错误选择的临床后果。

Agent 触点：诊疗推演 Agent 给出变化原因，药理 Agent 检查禁忌与剂量，安全 Agent 对潜在冲突进行拦截；学生或教师拥有最终提交权。

## Frame 7 — 个性化学习报告

- status: outline
- src: compositions/frames/07-learning-report.html
- duration: interactive
- poster: 2s
- scene: 将全过程转化为能力雷达、决策路径、证据链评分和下一步学习建议
- blueprint: dataviz-countup + transcript-scroll-artifact-reveal
- sustained_motion: staged-reveals

报告给出知识掌握度82、临床思维74、操作熟练度68，以及“问诊完整、确诊及时、再灌注策略选择偏慢”的可解释评分。点击任一分数可回放对应决策节点，并对照指南依据和参考答案。

Agent 触点：评价 Agent 展示评分维度、证据与权重；路径规划 Agent 推荐“先强化心电图判读，再进入并发症处理”，教师可修改推荐路径。

## Frame 8 — 教师干预与教学改革全景

- status: outline
- src: compositions/frames/08-teacher-intervention.html
- duration: interactive
- poster: 2s
- scene: 教师查看班级共性薄弱点、处理预警并将过程数据同步到成长档案
- blueprint: zoom-out-workspace-reveal + constellation-hub
- sustained_motion: camera-with-intent

从单个学生报告拉远到班级教学驾驶舱：高频易错节点聚焦“ST段判读、再灌注时间窗、抗凝禁忌”。教师打开预警，插入一节心电图微课并调整下一轮案例难度；底部以15项能力地图说明其余模块已在同一平台中可达。

Agent 触点：预警 Agent 负责发现异常，教学编排 Agent 提出干预建议，档案同步 Agent 生成待同步数据摘要；最后一步仍需教师批准。收束语为“Agent负责持续陪伴，教师决定教学方向”。
