import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, RoundedBox } from '@react-three/drei'
import './styles.css'
import './enhancements.css'
import './modal.css'
import './release.css'
import './dashboard.css'

const teacherPages = [['dashboard', '教学驾驶舱'], ['release', '病例发布'], ['teacher', '教师干预']]
const studentPages = [['student', '学生成长桌面'], ['vsp', '虚拟急诊 VSP'], ['decision', '决策与转归']]
const pages = [...teacherPages, ...studentPages]

const initialAgents = [
  ['教学编排 Agent', '汇总课程目标与班级画像', 'done'],
  ['知识图谱 Agent', '更新 AMI 跨学科节点', 'done'],
  ['预警 Agent', '发现 3 条待教师处理事项', 'wait'],
]

function Joint({ position, size = .13 }) {
  return <mesh position={position}><sphereGeometry args={[size, 28, 28]} /><meshStandardMaterial color="#94704a" roughness={.8} /></mesh>
}

function Limb({ position, length, rotation = [0, 0, 0], radius = .14 }) {
  return <RoundedBox args={[radius * 2, length, radius * 2]} radius={radius} smoothness={5} position={position} rotation={rotation}>
    <meshStandardMaterial color="#d7b98a" roughness={.72} />
  </RoundedBox>
}

const patientFocusPoints = {
  '心前区听诊':[-.14,.5,.39], '双肺听诊':[.3,.68,.38], '脉搏触诊':[-.83,-.92,.16], '皮肤与意识':[0,1.56,.38],
  '12导联心电图':[-.12,.46,.4], '高敏肌钙蛋白':[-.83,-.92,.16], '床旁超声':[-.12,.46,.4], '血常规/凝血':[-.83,-.92,.16],
  '阿司匹林 300mg':[-.12,.46,.4], '吸氧':[0,1.48,.4], '硝酸甘油':[-.12,.46,.4], '启动再灌注流程':[-.12,.46,.4],
}

function Patient3D({ treated, pose = 'pain', focus }) {
  const checking = pose === 'exam'
  const leftArm = checking ? -.72 : -.34
  const rightArm = pose === 'ecg' ? .62 : .18
  const focusPoint = patientFocusPoints[focus] || [-.12,.46,.4]
  return <Canvas camera={{ position: [0, 0.2, 5.6], fov: 38 }}>
    <color attach="background" args={['#102f40']} />
    <ambientLight intensity={1.5} />
    <directionalLight position={[4, 6, 5]} intensity={2.8} color="#d9f4ff" />
    <pointLight position={[-3, 1, 3]} intensity={treated ? 7 : 3} color={treated ? '#58d7ad' : '#d94a4a'} />
    <group position={[0, -0.26, 0]} rotation={[0, -0.12, 0]}>
      <mesh position={[0, 1.54, 0]} scale={[.82, 1, .78]}><sphereGeometry args={[0.4, 40, 40]} /><meshStandardMaterial color="#d7b98a" roughness={.72} /></mesh>
      <Joint position={[0, 1.12, 0]} size={.16} />
      <RoundedBox args={[1.04, 1.18, .55]} radius={.28} smoothness={6} position={[0, .48, 0]}><meshStandardMaterial color="#d7b98a" roughness={.72} /></RoundedBox>
      <Joint position={[0, -.18, 0]} size={.2} />
      <RoundedBox args={[.82, .55, .52]} radius={.22} position={[0, -.47, 0]}><meshStandardMaterial color="#cfae7c" roughness={.76} /></RoundedBox>
      <Joint position={[-.61, .82, 0]} /><Joint position={[.61, .82, 0]} />
      <group rotation={[0, 0, leftArm]}><Limb position={[-.78, .38, 0]} length={.8} rotation={[0, 0, -.2]} /><Joint position={[-.87, -.05, 0]} /><Limb position={[-.86, -.48, 0]} length={.72} rotation={[0, 0, .08]} radius={.12} /><RoundedBox args={[.2, .34, .16]} radius={.09} position={[-.83, -.98, 0]}><meshStandardMaterial color="#d7b98a" /></RoundedBox></group>
      <group rotation={[0, 0, rightArm]}><Limb position={[.78, .38, 0]} length={.8} rotation={[0, 0, .2]} /><Joint position={[.87, -.05, 0]} /><Limb position={[.84, -.48, 0]} length={.72} rotation={[0, 0, -.08]} radius={.12} /><RoundedBox args={[.2, .34, .16]} radius={.09} position={[.8, -.98, 0]}><meshStandardMaterial color="#d7b98a" /></RoundedBox></group>
      <Joint position={[-.3, -.72, 0]} size={.16} /><Joint position={[.3, -.72, 0]} size={.16} />
      <Limb position={[-.3, -1.14, 0]} length={.72} radius={.17} /><Limb position={[.3, -1.14, 0]} length={.72} radius={.17} />
      <Joint position={[-.3, -1.55, 0]} size={.14} /><Joint position={[.3, -1.55, 0]} size={.14} />
      <Limb position={[-.3, -1.96, 0]} length={.7} radius={.14} /><Limb position={[.3, -1.96, 0]} length={.7} radius={.14} />
      <RoundedBox args={[.3, .18, .58]} radius={.08} position={[-.3, -2.39, .12]}><meshStandardMaterial color="#cfae7c" /></RoundedBox><RoundedBox args={[.3, .18, .58]} radius={.08} position={[.3, -2.39, .12]}><meshStandardMaterial color="#cfae7c" /></RoundedBox>
      <mesh position={focusPoint} scale={treated ? 0.75 : 1}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial color={treated ? '#df6969' : '#ff4f4f'} emissive={treated ? '#7f2222' : '#d94a4a'} emissiveIntensity={treated ? 0.5 : 1.8} />
      </mesh>
      {!treated && <mesh position={[focusPoint[0],focusPoint[1],focusPoint[2]-.02]}><torusGeometry args={[0.17, 0.012, 12, 40]} /><meshBasicMaterial color="#ff7770" transparent opacity={0.62} /></mesh>}
    </group>
    <OrbitControls enablePan={false} minDistance={4.5} maxDistance={7} autoRotate autoRotateSpeed={0.55} />
  </Canvas>
}

function Card({ children, className = '' }) { return <section className={`card ${className}`}>{children}</section> }
function Progress({ label, value }) { return <div className="progress"><span>{label}</span><i><b style={{ width: `${value}%` }} /></i><strong>{value}%</strong></div> }
function Stat({ label, value, note, warn }) { return <Card className="stat"><span>{label}</span><b>{value}</b><small className={warn ? 'warn' : ''}>{note}</small></Card> }
function Button({ children, secondary, danger, ...props }) { return <button className={`btn ${secondary ? 'secondary' : ''} ${danger ? 'danger' : ''}`} {...props}>{children}</button> }

function AgentChat({ name, subtitle, welcome, prompts, answers, modal=false, externalOpen, onClose, hideTrigger=false }) {
  const [open,setOpen]=useState(false); const [messages,setMessages]=useState([['agent',welcome]]); const [typing,setTyping]=useState(false)
  const isOpen=externalOpen===undefined?open:externalOpen; const changeOpen=value=>{if(externalOpen===undefined)setOpen(value);if(!value)onClose?.()}
  const ask=prompt=>{if(typing)return;changeOpen(true);setMessages(v=>[...v,['user',prompt]]);setTyping(true);setTimeout(()=>{setMessages(v=>[...v,['agent',answers[prompt]]]);setTyping(false)},520)}
  const panel=<div className={`inline-agent ${isOpen?'open':''}`}>{!hideTrigger&&<button className="agent-head" onClick={()=>changeOpen(!isOpen)}><i>AI</i><span><b>{name}</b><small>{subtitle}</small></span><em>{isOpen?'收起':'开始对话'}</em></button>}{isOpen&&<div className="agent-body"><div className="agent-messages">{messages.map((m,i)=><div className={`agent-message ${m[0]}`} key={`${m[1]}-${i}`}>{m[1]}</div>)}{typing&&<div className="agent-message agent typing"><i/><i/><i/></div>}</div><div className="agent-prompts">{prompts.map(p=><button key={p} onClick={()=>ask(p)}>{p}</button>)}</div></div>}</div>
  if(modal&&isOpen)return <div className="agent-modal" onMouseDown={()=>changeOpen(false)}><div className="agent-modal-card" onMouseDown={e=>e.stopPropagation()}><div className="agent-modal-title"><div><i>AI</i><span><b>{name}</b><small>{subtitle}</small></span></div><button onClick={()=>changeOpen(false)}>×</button></div>{panel}</div></div>
  return panel
}

const learningPrompts=['本周哪些学生需要重点关注？','班级最薄弱的知识点是什么？','给我一个干预建议']
const learningAnswers={'本周哪些学生需要重点关注？':'建议优先关注林晓宇、陈晨、王浩。三人在再灌注时间窗判断上连续两次低于标准，其中林晓宇的决策延迟为 4分18秒。','班级最薄弱的知识点是什么？':'当前最薄弱节点是 ST 段定位，班级掌握度 62%；其次是再灌注时间窗，掌握度 68%。','给我一个干预建议':'建议插入 12 分钟心电图定位微课，并为 8 名学生开放一次引导式补充训练。方案需由教师批准后生效。'}
const patientPrompts=['生成一个更焦虑的患者','增加并发症分支','让回答更符合三年级难度']
const patientAnswers={'生成一个更焦虑的患者':'已调整沟通特征：患者会反复询问是否危及生命、语速加快，但仍能配合完成病史采集。','增加并发症分支':'已加入室性心律失常分支：若 30 分钟内未启动再灌注，患者将出现频发室早及血压下降。','让回答更符合三年级难度':'已减少直接诊断线索，保留胸骨后压榨痛、左肩放射和湿冷等可推理信息。'}
const tutorPrompts=['不要直接告诉我答案','连续追问我的判断依据','根据薄弱点向我提问']
const tutorAnswers={'不要直接告诉我答案':'好的。我会使用苏格拉底式引导：你认为胸痛伴低血压时，哪些常用药物需要谨慎？为什么？','连续追问我的判断依据':'先说说你判断前壁 STEMI 的两个证据；然后我会继续追问定位、时间窗和禁忌证。','根据薄弱点向我提问':'你的薄弱点是 ST 段定位。若 V1–V4 导联出现弓背向上抬高，你首先考虑哪个部位受累？'}

const studentHistory=[
  {name:'林晓宇',id:'20260118',cases:12,average:82,trend:'+6',last:'急性心肌梗死',status:'建议复盘',scores:[72,76,78,79,82]},
  {name:'陈晨',id:'20260107',cases:11,average:76,trend:'+2',last:'过敏性休克',status:'重点关注',scores:[74,73,75,74,76]},
  {name:'王浩',id:'20260126',cases:10,average:69,trend:'-3',last:'急性脑卒中',status:'教师复核',scores:[78,76,74,72,69]},
  {name:'周雨欣',id:'20260131',cases:13,average:91,trend:'+8',last:'急性心肌梗死',status:'表现优秀',scores:[79,83,86,89,91]},
  {name:'赵一诺',id:'20260135',cases:12,average:85,trend:'+4',last:'过敏性休克',status:'稳定提升',scores:[76,79,81,83,85]},
]

function StudentHistoryDetail({ student, onClose }) { return <div className="agent-modal" onMouseDown={onClose}><div className="student-detail-modal" onMouseDown={e=>e.stopPropagation()}><div className="answer-modal-head"><div><small>LEARNING HISTORY</small><h2>{student.name} · {student.id}</h2><span>已完成 {student.cases} 个临床实训案例</span></div><button onClick={onClose}>×</button></div><div className="stats three"><Stat label="历史平均分" value={student.average} note={`近5次变化 ${student.trend}`}/><Stat label="临床思维" value="74" note="班级平均 72"/><Stat label="操作熟练" value="68" note="建议继续强化" warn/></div><Card><h3>近五次实训成绩</h3><div className="score-history">{student.scores.map((score,i)=><div key={i}><b style={{height:`${score}%`}}/><span>{score}</span><small>第{i+1}次</small></div>)}</div></Card><div className="two"><Card><h3>近期学习记录</h3><Timeline title="急性心肌梗死 · 82分" text="完成诊断与初始治疗，再灌注决策延迟3分20秒。"/><Timeline title="过敏性休克 · 78分" text="正确使用肾上腺素，补液速度需要提升。"/><Timeline title="急性脑卒中 · 75分" text="完成FAST评估，溶栓禁忌证采集不完整。"/></Card><Card><h3>个性化建议</h3><AgentEvent name="学习评价 Agent" text="优先强化ST段定位与再灌注时间窗判断" wait/><Progress label="知识掌握" value={82}/><Progress label="临床思维" value={74}/><Progress label="操作熟练" value={68}/></Card></div></div></div> }

function Dashboard({ go }) { const [learningOpen,setLearningOpen]=useState(false); const [studentDetail,setStudentDetail]=useState(null); return <Page eyebrow="TEACHER COMMAND CENTER" title="全班教学态势" lead="教师决策在前，Agent 持续汇总过程数据并提出可解释建议。">
  <div className="app-section teacher-apps"><h3>教师应用</h3><div className="apps three-apps"><button onClick={()=>go('teacher')}><b>⌁</b><span>教师干预方案</span><small>复核并批准教学行动</small></button><button onClick={()=>setLearningOpen(true)}><b>◎</b><span>学情问答 Agent</span><small>询问班级学情与薄弱点</small></button><button onClick={()=>go('release')}><b>＋</b><span>配置并发布案例</span><small>创建急诊实训任务</small></button></div></div>
  <div className="two"><Card><h3>班级能力概览</h3><Progress label="知识掌握" value={82} /><Progress label="临床思维" value={74} /><Progress label="操作熟练" value={68} /></Card><Card><h3>高频薄弱点</h3><Alert title="ST段抬高判读" meta="8名学生 · 连续2次低于标准" high /><Alert title="再灌注时间窗" meta="6名学生 · 决策平均延迟4.2分钟" /></Card></div>
  <div className="dashboard-insights"><Card className="history-card"><div className="card-title-row"><div><h3>学生历史学习数据</h3><small>点击学生查看完整学习档案</small></div><Tag>32 名学生</Tag></div><div className="history-header"><span>学生</span><span>完成案例</span><span>平均分</span><span>近5次趋势</span><span>最近学习</span><span>状态</span></div>{studentHistory.map(student=><button className="history-row" key={student.id} onClick={()=>setStudentDetail(student)}><span><b>{student.name}</b><small>{student.id}</small></span><span>{student.cases}</span><span><b>{student.average}</b></span><span className={student.trend.startsWith('-')?'trend-down':'trend-up'}>{student.trend}</span><span>{student.last}</span><em>{student.status}</em></button>)}</Card><Card className="frequent-questions"><div className="card-title-row"><div><h3>高频问题</h3><small>学生向 Agent 提问的每日总结</small></div><Tag>每日更新</Tag></div><div className="question-update"><i/><span>今日 08:00 已更新</span><b>共分析 126 次提问</b></div>{[['ST段抬高如何定位梗死部位？','28次','心电图判读'],['低血压时为什么不能使用硝酸甘油？','21次','用药安全'],['再灌注治疗的时间窗如何判断？','18次','临床决策'],['肌钙蛋白升高就一定是心梗吗？','14次','鉴别诊断']].map(([q,count,tag],i)=><div className="frequent-question" key={q}><b>0{i+1}</b><div><strong>{q}</strong><small>{tag}</small></div><span>{count}</span></div>)}<Button secondary onClick={()=>setLearningOpen(true)}>询问学情问答 Agent</Button></Card></div>
  <AgentChat modal hideTrigger externalOpen={learningOpen} onClose={()=>setLearningOpen(false)} name="学情问答 Agent" subtitle="基于全班学习过程数据回答教学问题" welcome="周老师好，我已汇总本周 32 名学生的实训、测验和决策证据。您想先了解什么？" prompts={learningPrompts} answers={learningAnswers}/>
  {studentDetail&&<StudentHistoryDetail student={studentDetail} onClose={()=>setStudentDetail(null)}/>} 
</Page> }

const mockReleases=[
  {title:'急性脑卒中 · 绿色通道',time:'07月20日 08:00 — 07月25日 22:00',done:'32/32',score:'81',status:'expired'},
  {title:'过敏性休克 · 首诊处置',time:'07月27日 08:00 — 07月31日 22:00',done:'30/32',score:'76',status:'expired'},
  {title:'急性心肌梗死 · 黄金30分钟',time:'08月04日 08:00 — 08月08日 22:00',done:'0/32',score:'—',status:'draft'},
]

function ClassAnswers({ record, onClose }) { return <div className="agent-modal" onMouseDown={onClose}><div className="answer-modal" onMouseDown={e=>e.stopPropagation()}><div className="answer-modal-head"><div><small>CLASS RESPONSE OVERVIEW</small><h2>{record.title}</h2><span>{record.time}</span></div><button onClick={onClose}>×</button></div><div className="stats three"><Stat label="已提交" value={record.done} note="班级完成情况"/><Stat label="平均得分" value={record.score} note="过程证据评分"/><Stat label="需重点复核" value="03" note="低于合格标准" warn/></div><div className="two"><Card><h3>全班作答分布</h3><Progress label="诊断正确" value={84}/><Progress label="检查合理" value={72}/><Progress label="医嘱安全" value={78}/></Card><Card><h3>高频错误</h3><Alert title="未优先识别时间窗" meta="6人 · 平均延误4.2分钟" high/><Alert title="高风险药物选择" meta="3人 · 需要教师复核"/></Card></div><div className="student-answer-list"><div><b>林晓宇</b><span>82分 · 已完成</span><Tag>建议复盘</Tag></div><div><b>陈晨</b><span>76分 · 已完成</span><Tag>重点关注</Tag></div><div><b>王浩</b><span>69分 · 已完成</span><Tag>教师复核</Tag></div></div></div></div> }

function Release({ publish, setPublish, setAgents }) {
  const [speed,setSpeed]=useState(10); const [startTime,setStartTime]=useState('2026-08-04T08:00'); const [endTime,setEndTime]=useState('2026-08-08T22:00'); const [generation,setGeneration]=useState('idle'); const [version,setVersion]=useState(0); const [records,setRecords]=useState(mockReleases); const [answerRecord,setAnswerRecord]=useState(null)
  const generate=()=>{setGeneration('loading');setTimeout(()=>{setVersion(v=>v+1);setGeneration('ready')},900)}
  const displayTime=value=>{const match=value.match(/\d{4}-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);return match?`${match[1]}月${match[2]}日 ${match[3]}:${match[4]}`:value}
  const release=()=>{setPublish(true);setRecords(v=>v.map((r,i)=>i===2?{...r,status:'active',time:`${displayTime(startTime)} — ${displayTime(endTime)}`}:r));setAgents([['病例生成 Agent','完成6阶段病例装配','done'],['知识图谱 Agent','关联47个跨学科节点','done'],['评价 Agent','生成12项过程指标','done'],['教师确认','案例已批准发布','done']])}
  return <Page eyebrow="CASE ORCHESTRATION" title="急诊黄金30分钟" lead="先设置教学约束与开放时间，再由 AI 生成病例；教师确认后发布。"><div className="two release"><Card><h3>案例设置</h3><div className="form"><label>核心疾病<select><option>急性ST段抬高型心肌梗死</option></select></label><label>教学班<select><option>2026级临床医学1班 · 32人</option></select></label><label>案例难度<select><option>标准 · 三年级</option><option>进阶 · 并发症分支</option></select></label><label>允许提示等级<select><option>引导式 · 不直接给答案</option></select></label><label>开放时间<input type="datetime-local" value={startTime} onChange={e=>setStartTime(e.target.value)}/></label><label>截止时间<input type="datetime-local" value={endTime} onChange={e=>setEndTime(e.target.value)}/></label></div><label className="range">病情进展速度 <b>{(speed/10).toFixed(1)}×</b><input type="range" min="5" max="15" value={speed} onChange={e=>setSpeed(+e.target.value)} /></label><AgentChips /><Button onClick={generate}>{generation==='idle'?'确认设置并生成案例':'重新确认设置'}</Button></Card><Card className="generation-card"><h3>案例实时预览</h3>{generation==='idle'&&<div className="generation-empty"><i>AI</i><h3>等待确认案例设置</h3><p>确认后，病例生成 Agent 将装配病史、生命体征、检查结果和病情分支。</p></div>}{generation==='loading'&&<div className="generation-loading"><div className="ai-orbit"><i>AI</i></div><h3>多 Agent 正在生成案例</h3><p>正在匹配教学目标、知识节点与生理演变模型…</p><div><span>生成患者画像</span><span>装配临床分支</span><span>校验评价指标</span></div></div>}{generation==='ready'&&<><div className="preview-version">AI GENERATED · V{version}</div><div className="case-preview"><em>黄金30分钟</em><h2>男性，56岁，持续胸痛40分钟</h2><p>HR 112 · BP 92/60 · SpO₂ 93%<br/>焦虑、表达清晰、疼痛 8/10</p></div><Progress label="基础医学" value={84} /><Progress label="临床医学" value={100} /><Progress label="药理学" value={72} /><AgentChat name="模拟病患生成 Agent" subtitle="用自然语言调整患者表现与病情分支" welcome="病例基础画像已生成。您可以直接描述希望调整的患者表现、难度或病情分支。" prompts={patientPrompts} answers={patientAnswers}/><div className="release-actions"><Button secondary onClick={generate}>根据对话重新生成</Button><Button onClick={release}>{publish?'已发布给全班':'批准并发布给全班'}</Button></div></>}</Card></div><section className="release-history"><div className="section-title"><div><em className="eyebrow">PUBLISH HISTORY</em><h2>发布记录</h2></div><Tag>3 个案例</Tag></div><div className="release-table">{records.map((record,i)=><div className="release-row" key={record.title}><div className="release-index">0{i+1}</div><div><b>{record.title}</b><small>{record.time}</small></div><div><small>完成情况</small><b>{record.done}</b></div><div><small>平均分</small><b>{record.score}</b></div><em className={`release-status ${record.status}`}>{record.status==='expired'?'已截止':record.status==='active'?'进行中':'待发布'}</em>{record.status==='expired'?<Button secondary onClick={()=>setAnswerRecord(record)}>查看全班回答</Button>:<Button secondary disabled>{record.status==='active'?'等待学生提交':'尚未发布'}</Button>}</div>)}</div></section>{answerRecord&&<ClassAnswers record={answerRecord} onClose={()=>setAnswerRecord(null)}/>}</Page>
}

function Student({ go, openAgents }) {
  const [tutorOpen,setTutorOpen]=useState(false)
  const learningApps=[['🩺','虚拟病房'],['⎈','知识图谱'],['◎','智能导师'],['✓','考试中心'],['⌁','成长档案']]
  return <Page eyebrow="STUDENT LEARNING OS" title="下午好，林晓宇" lead="伴随学习 Agent 已根据你的能力画像生成今日学习处方。">
    <div className="app-section"><h3>学习应用</h3><div className="apps">{learningApps.map(([icon,name],i)=><button key={name} onClick={()=>i===0?go('vsp'):i===2?setTutorOpen(v=>!v):openAgents()}><b>{icon}</b><span>{name}</span><small>{i===2?'设置追问风格':'点击进入'}</small></button>)}</div></div>
    <AgentChat modal hideTrigger externalOpen={tutorOpen} onClose={()=>setTutorOpen(false)} name="智能导师 · 追问风格 Agent" subtitle="由你决定导师如何引导与追问" welcome="你好，林晓宇。请选择你希望的追问方式，我会根据你的回答继续追问判断依据。" prompts={tutorPrompts} answers={tutorAnswers}/><div className="two student"><Card><h3>今日学习处方 <Tag>动态生成</Tag></h3><Step n="1" title="完成心电图快速判读微课" text="依据：ST段定位正确率 62%"/><Step n="2" title="进入急性心肌梗死虚拟急诊" text="目标：30分钟内完成诊断与初始治疗"/><Step n="3" title="复盘决策证据链" text="重点：再灌注时间窗与抗栓禁忌"/><Button onClick={() => go('vsp')}>进入虚拟急诊</Button> <Button secondary onClick={openAgents}>为什么这样推荐？</Button></Card><Card><h3>能力画像</h3><div className="radar">82</div><p className="center muted">知识82 · 思维74 · 操作68</p></Card></div><section className="embedded-section student-report"><div className="section-title"><div><em className="eyebrow">LEARNING REPORT</em><h2>学习报告</h2></div><Tag>过程证据可追溯</Tag></div><div className="report"><Card><div className="score">82<small>分</small></div><Progress label="知识掌握" value={82}/><Progress label="临床思维" value={74}/><Progress label="操作熟练" value={68}/></Card><Card><h3>证据链评分</h3><Timeline title="问诊完整 · +18" text="覆盖起病时间、性质、放射部位与伴随症状。"/><Timeline title="确诊及时 · +24" text="11分03秒完成心电图并识别前壁 STEMI。"/><Timeline title="药物选择正确 · +21" text="给予阿司匹林，识别低血压风险。"/><Timeline title="再灌注决策偏慢 · -8" text="绿色通道启动较优秀标准晚3分20秒。"/></Card></div><Card><h3>下一步学习路径 <Tag>Agent 推荐</Tag></h3><h2>先强化心电图判读，再进入并发症处理</h2><p className="muted">依据：ST段定位正确率62%，病史采集完整度91%。</p></Card></section>
  </Page>
}

const vspFeedback = {
  '心前区听诊':['查体完成','心音有力，未闻及明显杂音','exam'], '双肺听诊':['查体完成','双肺呼吸音清，未闻及湿啰音','exam'],
  '脉搏触诊':['查体完成','桡动脉搏动快、节律规则，末梢稍凉','exam'], '皮肤与意识':['查体完成','意识清醒、焦虑、皮肤湿冷','exam'],
  '12导联心电图':['检查回报','V1–V4 导联 ST 段弓背向上抬高','ecg'], '高敏肌钙蛋白':['检查回报','hs-cTnI 0.84 ng/mL ↑','exam'],
  '床旁超声':['检查回报','前壁节段性运动减弱，LVEF 46%','exam'], '血常规/凝血':['检查回报','血小板及凝血功能未见明显禁忌','exam'],
}

const examReports = {
  '12导联心电图':{code:'ECG 12-LEAD',title:'十二导联心电图报告',summary:'窦性心动过速，V1–V4 导联 ST 段弓背向上抬高',values:[['心率','112 bpm'],['PR间期','148 ms'],['QRS','92 ms']],conclusion:'提示急性前壁 ST 段抬高型心肌梗死'},
  '高敏肌钙蛋白':{code:'LAB · hs-cTnI',title:'高敏肌钙蛋白报告',summary:'心肌损伤标志物显著升高',values:[['hs-cTnI','0.84 ng/mL ↑'],['参考值','< 0.04 ng/mL'],['采样时间','10:42']],conclusion:'结果支持急性心肌损伤，需结合心电图立即评估再灌注'},
  '床旁超声':{code:'POCUS',title:'床旁心脏超声报告',summary:'左室前壁节段性运动减弱',values:[['LVEF','46% ↓'],['心包积液','未见'],['主动脉根部','未见异常']],conclusion:'超声表现支持前壁心肌缺血，暂未发现机械并发症'},
  '血常规/凝血':{code:'CBC · COAG',title:'血常规与凝血报告',summary:'血小板及凝血功能未见明显禁忌',values:[['PLT','218×10⁹/L'],['INR','1.02'],['Hb','142 g/L']],conclusion:'当前化验未提示抗栓及介入治疗的明显血液学禁忌'},
}

function ExamReport({ name, loading }) {
  const report=examReports[name]; if(!report)return null
  return <div className={`exam-report ${loading?'loading':''}`}><div className="exam-report-head"><span>{report.code}</span><b>{loading?'检查 Agent 正在生成…':report.title}</b><em>{loading?'分析中':'已回报'}</em></div>{loading?<div className="report-skeleton"><i/><i/><i/></div>:<><p>{report.summary}</p>{name==='12导联心电图'&&<div className="report-ecg"><i/><i/><i/><i/><i/></div>}<div className="report-values">{report.values.map(([label,value])=><div key={label}><small>{label}</small><b>{value}</b></div>)}</div><div className="report-conclusion"><small>检查结论</small><strong>{report.conclusion}</strong></div></>}</div>
}

function VSP({ go, setAgents }) {
  const [tab,setTab]=useState('问诊'); const [messages,setMessages]=useState([['agent','VSP已就绪。患者表现为持续性胸痛，请开始开放式问诊。']]);
  const [orders,setOrders]=useState([]); const [treated,setTreated]=useState(false); const [feedback,setFeedback]=useState(null); const [loading,setLoading]=useState(false); const [activeFocus,setActiveFocus]=useState(null); const [diagnosis,setDiagnosis]=useState(''); const [diagnosisText,setDiagnosisText]=useState(''); const [diagnosisLoading,setDiagnosisLoading]=useState(false); const [diagnosisFeedback,setDiagnosisFeedback]=useState(null)
  const ask=(q)=>{setMessages(v=>[...v,['user',q],['agent','大概四十分钟前突然开始，胸口像被石头压住一样，还往左肩放。']]);setAgents([['VSP 对话 Agent','生成符合病情与性格的回答','done'],['症状抽取 Agent','胸骨后压榨痛 · 左肩放射','done'],['知识图谱 Agent','关联 ACS → STEMI 路径','done'],['苏格拉底导师','你还需排除哪种致命胸痛？','wait']])}
  const choose=x=>{setActiveFocus(x);setOrders(v=>v.includes(x)?v.filter(y=>y!==x):[...v,x]); if(vspFeedback[x]){setLoading(true);setFeedback(null);setTimeout(()=>{setFeedback({name:x,data:vspFeedback[x]});setLoading(false)},420)}}
  const changeTab=x=>{setTab(x);setFeedback(null);setActiveFocus(null);setLoading(false)}
  const submitDiagnosis=()=>{if(!diagnosis&&!diagnosisText.trim())return;setDiagnosisLoading(true);setDiagnosisFeedback(null);setTimeout(()=>{const answer=`${diagnosis} ${diagnosisText}`;const correct=/STEMI|心肌梗死|急性前壁/.test(answer);setDiagnosisFeedback(correct?{good:true,title:'诊断方向正确',text:'症状、V1–V4 ST段抬高与肌钙蛋白升高形成一致证据链。建议进一步写明“急性前壁ST段抬高型心肌梗死”，并立即启动再灌注流程。'}:{good:false,title:'诊断证据不足',text:'当前判断未能解释持续压榨性胸痛、左肩放射、V1–V4 ST段抬高和肌钙蛋白升高。请优先考虑急性冠脉综合征，并重新判断梗死部位。'});setDiagnosisLoading(false)},650)}
  const submit=()=>{if(!orders.includes('阿司匹林 300mg'))return;setTreated(true);setFeedback({name:'治疗反应',data:['病情更新','胸痛下降，血流动力学逐步稳定','treated']});setTimeout(()=>go('decision'),1100)}
  const pose=treated?'treated':feedback?.data[2] || 'pain'
  return <div className="vsp-page"><section className={`patient pose-${pose}`}><div className="monitor"><Vital label="HR" value={treated?96:112} alert={!treated}/><Vital label="BP" value={treated?'104/68':'92/60'}/><Vital label="SpO₂" value={treated?'96%':'93%'}/><div className="ecg"/></div><div className="timer">{treated?'21:42':'27:18'}</div><div className="pose-label">{activeFocus || '胸痛体位'}</div><Patient3D treated={treated} pose={pose} focus={activeFocus}/><ExamReport name={activeFocus} loading={loading}/><div className="patient-foot"><b>虚拟标准化病人 · 周志强</b><span>意识清醒，焦虑，胸痛 {treated?'4':'8'}/10 · 操作选项会驱动人偶与病情反馈</span></div></section><Card className="vsp-control"><div className="tabs">{['问诊','查体','检查','诊断','医嘱'].map(x=><button className={tab===x?'active':''} onClick={()=>changeTab(x)} key={x}>{x}</button>)}</div><div className="tab-panel" key={tab}>{tab==='问诊'&&<><div className="chat">{messages.map((m,i)=><div key={i} className={`bubble ${m[0]}`}>{m[1]}</div>)}</div><div className="quick"><button onClick={()=>ask('胸痛是什么时候开始的？')}>胸痛何时开始？</button><button onClick={()=>ask('疼痛向哪里放射？')}>有放射痛吗？</button></div></>}{tab==='查体'&&<ActionGrid items={['心前区听诊','双肺听诊','脉搏触诊','皮肤与意识']} selected={orders} toggle={choose} />}{tab==='检查'&&<><ActionGrid items={['12导联心电图','高敏肌钙蛋白','床旁超声','血常规/凝血','D-二聚体','急诊胃镜']} selected={orders} toggle={choose}/><p className="hint">包含必要检查与干扰选项，请根据诊断价值选择。</p></>}{tab==='诊断'&&<div className="diagnosis-panel"><h3>提交你的初步诊断</h3><p className="hint">可选择诊断，也可以用自己的语言描述诊断与判断依据。</p><div className="diagnosis-options">{['急性前壁 STEMI','主动脉夹层','急性肺栓塞','胃食管反流'].map(x=><button key={x} className={diagnosis===x?'selected':''} onClick={()=>setDiagnosis(x)}>{x}</button>)}</div><label>诊断与依据<textarea value={diagnosisText} onChange={e=>setDiagnosisText(e.target.value)} placeholder="例如：考虑急性前壁心肌梗死，因为……" rows="4"/></label><Button onClick={submitDiagnosis} disabled={diagnosisLoading||(!diagnosis&&!diagnosisText.trim())}>{diagnosisLoading?'诊断 Agent 评估中…':'提交诊断'}</Button>{diagnosisLoading&&<div className="diagnosis-agent loading"><i/><span>正在比对症状、检查结果与临床路径…</span></div>}{diagnosisFeedback&&<div className={`diagnosis-agent ${diagnosisFeedback.good?'good':'bad'}`}><i>{diagnosisFeedback.good?'✓':'!'}</i><div><b>{diagnosisFeedback.title}</b><p>{diagnosisFeedback.text}</p></div></div>}</div>}{tab==='医嘱'&&<><ActionGrid items={['阿司匹林 300mg','吸氧','立即舌下含服硝酸甘油','启动再灌注流程','静推美托洛尔','仅留观等待复查']} selected={orders} toggle={choose}/><Button danger onClick={submit}>安全校验并提交医嘱</Button>{!orders.includes('阿司匹林 300mg')&&<p className="hint warn">请选择关键初始治疗后提交。</p>}</>}</div>{loading&&<div className="vsp-feedback loading"><i/><div><b>Agent 正在分析</b><span>同步生理模型与知识图谱…</span></div></div>}{feedback&&!loading&&<div className="vsp-feedback ready" key={feedback.name}><i>✓</i><div><small>{feedback.data[0]}</small><b>{feedback.name}</b><span>{feedback.data[1]}</span></div></div>}</Card></div>
}

function Decision({ go }) { return <Page eyebrow="CLINICAL BRANCHING" title="每一次决策都会改变患者" lead="生理模拟 Agent 根据时间、检查与干预演算转归。"><div className="two"><Card><h3>当前决策路径 <Tag>患者好转</Tag></h3><div className="branch">{['开放式问诊','心电图+肌钙蛋白','阿司匹林','再灌注流程'].map((x,i)=><React.Fragment key={x}><span>{x}<b>{["6′12″","11′03″","14′28″","21′42″"][i]}</b></span>{i<3&&'→'}</React.Fragment>)}</div><div className="outcome"><h3>生理模拟结果</h3><Metric a="心率" b="112 → 96 bpm"/><Metric a="血压" b="92/60 → 104/68"/><Metric a="胸痛评分" b="8 → 4"/></div></Card><Card><h3>Agent 解释</h3><AgentEvent name="诊疗推演 Agent" text="病情模型进入早期再灌注分支"/><AgentEvent name="药理 Agent" text="阿司匹林剂量符合初始治疗"/><AgentEvent name="安全监督 Agent" text="低血压下不建议立即使用硝酸甘油" wait/><Button onClick={()=>go('student')}>返回成长桌面查看报告</Button></Card></div><div className="compare"><Card><Tag>本次路径</Tag><h3>21分42秒启动再灌注</h3><p>血流动力学趋于稳定，未出现严重并发症。</p></Card><Card className="bad"><Tag>延误路径</Tag><h3>36分钟仍未识别 STEMI</h3><p>胸痛加重并出现室性心律失常。</p></Card></div></Page> }

function Report({ go }) { return <Page eyebrow="EVIDENCE-BASED ASSESSMENT" title="从结果分数回到每一次决策" lead="评价 Agent 只依据可追溯过程证据评分。"><div className="report"><Card><div className="score">82<small>分</small></div><Progress label="知识掌握" value={82}/><Progress label="临床思维" value={74}/><Progress label="操作熟练" value={68}/></Card><Card><h3>证据链评分</h3><Timeline title="问诊完整 · +18" text="覆盖起病时间、性质、放射部位与伴随症状。"/><Timeline title="确诊及时 · +24" text="11分03秒完成心电图并识别前壁 STEMI。"/><Timeline title="药物选择正确 · +21" text="给予阿司匹林，识别低血压风险。"/><Timeline title="再灌注决策偏慢 · -8" text="绿色通道启动较优秀标准晚3分20秒。"/></Card></div><div className="two"><Card><h3>下一步学习路径 <Tag>Agent 推荐</Tag></h3><h2>先强化心电图判读，再进入并发症处理</h2><p className="muted">依据：ST段定位正确率62%，病史采集完整度91%。</p></Card><Card><h3>教师可复核</h3><p className="muted">评分依据、指南节点和决策回放均可查看；教师拥有最终评价权。</p><Button onClick={()=>go('teacher')}>进入教师干预</Button></Card></div></Page> }

function Teacher({ intervened,setIntervened }) { return <Page eyebrow="HUMAN–AGENT COLLABORATION" title="教师干预" lead="Agent 持续发现学情变化，教师复核证据并决定教学方向。"><div className="stats"><Stat label="在学学生" value="32" note="全员已登录"/><Stat label="本周实训完成率" value="78%" note="较上周 +12%"/><Stat label="预警学生" value="03" note="需教师重点复核" warn/><Stat label="共性薄弱节点" value="08" note="已关联教学大纲"/></div><div className="two"><Card><h3>班级薄弱点知识图谱</h3><Progress label="ST段定位" value={62}/><Progress label="再灌注时间窗" value={68}/><Progress label="抗凝禁忌" value={71}/><AgentEvent name="建议干预" text="插入12分钟心电图微课，并降低第一阶段提示门槛" wait/></Card><Card><h3>教师干预方案 <Tag>{intervened?'已批准':'待批准'}</Tag></h3><label>插入学习资源<select><option>微课：从导联定位梗死部位（12分钟）</option></select></label><label>下一案例难度<select><option>进阶：加入心律失常分支</option></select></label><Button onClick={()=>setIntervened(true)}>{intervened?'已批准并同步':'教师批准干预方案'}</Button></Card></div><Card><h3>平台能力全景</h3><AgentChips /></Card></Page> }

function App(){
  const [role,setRole]=useState('teacher'); const [roleOpen,setRoleOpen]=useState(false); const [page,setPage]=useState('dashboard'); const [published,setPublished]=useState(false); const [intervened,setIntervened]=useState(false); const [agents,setAgents]=useState(initialAgents); const [agentOpen,setAgentOpen]=useState(false)
  const title=pages.find(x=>x[0]===page)?.[1]; const rolePages=role==='teacher'?teacherPages:studentPages
  const switchRole=next=>{setRole(next);setPage(next==='teacher'?'dashboard':'student');setRoleOpen(false)}
  const go=id=>{setPage(id);if(studentPages.some(x=>x[0]===id))setRole('student');if(teacherPages.some(x=>x[0]===id))setRole('teacher')}
  const content=useMemo(()=>({dashboard:<Dashboard go={go}/>,release:<Release go={go} publish={published} setPublish={setPublished} setAgents={setAgents}/>,teacher:<Teacher intervened={intervened} setIntervened={setIntervened}/>,student:<Student go={go} openAgents={()=>setAgentOpen(true)}/>,vsp:<VSP go={go} setAgents={setAgents}/>,decision:<Decision go={go}/>}[page]),[page,published,intervened])
  return <div className="app"><aside><div className="brand"><i>+</i><div><b>川北医学院</b><small>智能医学教学平台</small></div></div><div className="role-badge">{role==='teacher'?'教师工作台':'学生学习端'}</div><nav>{rolePages.map(([id,name])=><button key={id} className={page===id?'active':''} onClick={()=>go(id)}><i/>{name}</button>)}</nav><div className="demo"><b>演示环境 · DEMO</b><span>全部数据为 Mock 数据<br/>教师拥有最终控制权</span></div></aside><section className="workspace"><header><div><small>{role==='teacher'?'临床教学中心 / 2026级临床医学1班':'2026级临床医学1班 / 学号 20260118'}</small><b>{title}</b></div><button className="agent-live" onClick={()=>setAgentOpen(v=>!v)}><i/>{agents.length} 个 Agent 正在协作</button><div className="profile"><button className="avatar" onClick={()=>setRoleOpen(v=>!v)} aria-label="切换身份">{role==='teacher'?'周':'林'}<small>⌄</small></button>{roleOpen&&<div className="role-menu"><b>切换使用端</b><button className={role==='teacher'?'active':''} onClick={()=>switchRole('teacher')}><span>周老师</span><small>教师端 · 教学管理</small></button><button className={role==='student'?'active':''} onClick={()=>switchRole('student')}><span>林晓宇</span><small>学生端 · 临床实训</small></button></div>}</div></header><main>{content}</main></section><div className={`agent-drawer ${agentOpen?'open':''}`}><div><b>Agent 协作过程</b><button onClick={()=>setAgentOpen(false)}>关闭</button></div>{agents.map(([n,t,s])=><AgentEvent key={n} name={n} text={t} wait={s==='wait'}/>)}</div></div>
}

function Page({eyebrow,title,lead,children}){return <div className="page"><em className="eyebrow">{eyebrow}</em><h1>{title}</h1><p className="lead">{lead}</p>{children}</div>}
function Alert({title,meta,high}){return <div className="alert"><i className={high?'high':''}/><div><b>{title}</b><small>{meta}</small></div><Tag>{high?'高':'中'}</Tag></div>}
function Tag({children}){return <em className="tag">{children}</em>}
function Step({n,title,text}){return <div className="step"><b>{n}</b><div><strong>{title}</strong><small>{text}</small></div></div>}
function AgentChips(){return <div className="agent-chips">{[['知识底座','动态图谱 · 语义推理'],['虚拟病人','问诊查体 · 生理引擎'],['学习评价','画像路径 · 智能预警'],['平台集成','认证 · 档案同步']].map(x=><div key={x[0]}><b>{x[0]}</b><small>{x[1]}</small></div>)}</div>}
function Vital({label,value,alert}){return <div className={`vital ${alert?'alert':''}`}><span>{label}</span><b>{value}</b></div>}
function ActionGrid({items,selected,toggle}){return <div className="actions">{items.map(x=><button key={x} className={selected.includes(x)?'selected':''} onClick={()=>toggle(x)}><b>{x}</b><small>点击选择 / 查看反馈</small></button>)}</div>}
function AgentEvent({name,text,wait}){return <div className={`agent-event ${wait?'wait':''}`}><b>{name}</b><span>{text}</span></div>}
function Metric({a,b}){return <div className="metric"><span>{a}</span><b>{b}</b></div>}
function Timeline({title,text}){return <div className="timeline"><i/><div><b>{title}</b><p>{text}</p></div></div>}

createRoot(document.getElementById('root')).render(<App />)
