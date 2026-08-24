import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

type Shape = "document" | "clock" | "target" | "noise" | "gate" | "stack" | "compare" | "seal";
type Item = { label: string; note: string; shape: Shape; accent?: boolean };
type Scene = { label: string; title: string; note: string; items: Item[] };

function Glyph({ item, x }: { item: Item; x: number }) {
  const stroke = item.accent ? "var(--primary)" : "var(--border)";
  const fill = item.accent ? "var(--primary)" : "var(--muted-foreground)";
  return <motion.g initial={{opacity:0,scale:.93}} animate={{opacity:1,scale:1}} transition={{duration:.3}}>
    {item.shape === "document" && <g><path d={`M${x-30} 68 H${x+18} L${x+31} 81 V132 H${x-30} Z`} fill="var(--background)" stroke={stroke} strokeWidth="1.25"/><path d={`M${x+18} 68 V81 H${x+31}`} fill="none" stroke={stroke}/><path d={`M${x-20} 91 H${x+20} M${x-20} 103 H${x+20} M${x-20} 115 H${x+8}`} stroke={stroke}/></g>}
    {item.shape === "clock" && <g><circle cx={x} cy="100" r="31" fill="var(--background)" stroke={stroke} strokeWidth="1.25"/><path d={`M${x} 100 V80 M${x} 100 L${x+15} 109`} stroke={stroke} strokeWidth="1.25" strokeLinecap="round"/></g>}
    {item.shape === "target" && <g><circle cx={x} cy="100" r="31" fill={fill} fillOpacity=".07" stroke={stroke} strokeWidth="1.25"/><circle cx={x} cy="100" r="15" fill="none" stroke={stroke}/><circle cx={x} cy="100" r="3" fill={fill}/></g>}
    {item.shape === "noise" && <g>{[-21,-8,7,21].map((dx,i)=><circle key={dx} cx={x+dx} cy={92+(i%2)*17} r={7+i} fill={fill} fillOpacity={.06+i*.03} stroke={stroke}/>)}</g>}
    {item.shape === "gate" && <path d={`M${x} 66 L${x+36} 100 L${x} 134 L${x-36} 100 Z`} fill={fill} fillOpacity=".07" stroke={stroke} strokeWidth="1.25"/>}
    {item.shape === "stack" && <g>{[0,1,2].map(i=><rect key={i} x={x-31+i*4} y={72+i*10} width="62" height="36" rx="3" fill="var(--background)" stroke={i===2?stroke:"var(--border)"}/>)}</g>}
    {item.shape === "compare" && <g><path d={`M${x-31} 79 H${x+7} V96 H${x-31} Z`} fill={fill} fillOpacity=".1" stroke={stroke}/><path d={`M${x-18} 106 H${x+31} V123 H${x-18} Z`} fill={fill} fillOpacity=".18" stroke={stroke}/></g>}
    {item.shape === "seal" && <g><circle cx={x} cy="100" r="31" fill="var(--background)" stroke={stroke} strokeWidth="1.25"/><path d={`M${x-14} 100 L${x-3} 112 L${x+18} 85`} fill="none" stroke={fill} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></g>}
    <text x={x} y="97" textAnchor="middle" className="fill-foreground text-[10px] font-bold">{item.label}</text>
    <text x={x} y="112" textAnchor="middle" className="fill-muted-foreground text-[8px]">{item.note}</text>
  </motion.g>;
}

function CompetitionSceneViz({id,eyebrow,title,description,scenes}:{id:string;eyebrow:string;title:string;description:string;scenes:Scene[]}) {
  const controls=useAnimatedScenes(scenes.length,2700); const scene=scenes[controls.active]; const gap=270/Math.max(scene.items.length-1,1);
  return <VizFrame title={title} description={description} className="my-8"><div id={id} data-viz tabIndex={0} onKeyDown={controls.onKeyDown} className="min-w-0 overflow-hidden border-y border-border/70 bg-background px-4 py-6 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6">
    <p className="text-[11px] font-black uppercase tracking-[.16em] text-primary">{eyebrow} · {String(controls.active+1).padStart(2,"0")}</p>
    <h3 className="mt-2 text-lg font-bold leading-7">{scene.title}</h3>
    <div data-viz-canvas className="min-w-0"><svg viewBox="0 0 360 198" role="img" aria-label={`${scene.label}: ${scene.title}`} className="mx-auto mt-5 block h-auto w-full max-w-[560px] overflow-visible"><defs><marker id={`${id}-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="var(--muted-foreground)"/></marker></defs>
      {scene.items.slice(0,-1).map((_,i)=><motion.line key={i} x1={45+i*gap+36} y1="100" x2={45+(i+1)*gap-36} y2="100" stroke="var(--muted-foreground)" strokeWidth="1.25" markerEnd={`url(#${id}-arrow)`} initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:.35,delay:i*.1}}/>)}
      {scene.items.map((item,i)=><Glyph key={`${scene.label}-${i}`} item={item} x={45+i*gap}/>)}
      <path d="M45 160 H315" stroke="var(--border)"/><circle cx={45+controls.active*(270/Math.max(scenes.length-1,1))} cy="160" r="5" fill="var(--primary)"/>
    </svg></div>
    <p className="border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{scene.note}</p>
    <AnimatedSceneControls labels={scenes.map(s=>s.label)} {...controls}/>
  </div></VizFrame>;
}

const v=(id:string,eyebrow:string,title:string,description:string,scenes:Scene[])=><CompetitionSceneViz id={id} eyebrow={eyebrow} title={title} description={description} scenes={scenes}/>;

export const EvaluationContractViz=()=>v("evaluation-contract-modern","Evaluation contract","Prediction 한 행이 평가를 통과하는 경계를 먼저 고정합니다","Row→cutoff→target→metric→evaluation role을 장면별로 봅니다",[
  {label:"Row",title:"Prediction 한 번의 identity를 고정합니다",note:"Patient visit인지 image인지부터 정해야 target과 metric denominator가 안정됩니다.",items:[{label:"row",note:"entity·ID",shape:"document",accent:true},{label:"question",note:"one output",shape:"target"}]},
  {label:"Cutoff",title:"Model이 볼 수 있는 마지막 시각을 세웁니다",note:"Cutoff 뒤 도착한 feature와 label은 input에 들어갈 수 없습니다.",items:[{label:"row",note:"identity",shape:"document"},{label:"cutoff",note:"available by",shape:"clock",accent:true}]},
  {label:"Target",title:"무엇을 언제까지 예측하는지 target horizon을 붙입니다",note:"같은 row도 24시간 재입원과 30일 재입원은 다른 prediction task입니다.",items:[{label:"cutoff",note:"now",shape:"clock"},{label:"target",note:"future event",shape:"target",accent:true}]},
  {label:"Roles",title:"Local은 선택, public은 제한된 feedback, private는 최종 보고입니다",note:"한 평가 결과가 어느 결정을 바꿀 수 있는지 역할을 미리 제한합니다.",items:[{label:"local",note:"select",shape:"compare"},{label:"public",note:"feedback",shape:"gate"},{label:"private",note:"final",shape:"seal",accent:true}]},
]);

export const SelectionBiasViz=()=>v("selection-bias-modern","Noisy maximum","후보가 늘면 우연히 높은 noise까지 함께 고를 기회가 늘어납니다","True mean·noise·argmax·fresh evaluation을 분리합니다",[
  {label:"Truth",title:"각 candidate에는 보이지 않는 true score가 있습니다",note:"같은 true score를 가진 후보도 finite validation에서는 다르게 관측됩니다.",items:[{label:"μ",note:"true score",shape:"target",accent:true},{label:"ε",note:"noise",shape:"noise"}]},
  {label:"Observe",title:"Observed score는 true score와 validation noise의 합입니다",note:"Noise는 model quality가 아니지만 selection criterion 안에는 함께 들어옵니다.",items:[{label:"μ",note:"quality",shape:"target"},{label:"+ ε",note:"sample noise",shape:"noise",accent:true},{label:"X",note:"observed",shape:"compare"}]},
  {label:"Select",title:"Argmax는 큰 true score와 양의 noise를 함께 선호합니다",note:"후보 수·search adaptivity·validation noise가 커질수록 위험이 커집니다.",items:[{label:"scores",note:"many X",shape:"stack"},{label:"argmax",note:"choose peak",shape:"gate",accent:true}]},
  {label:"Verify",title:"선택에 쓰지 않은 data에서 frozen candidate를 다시 봅니다",note:"Fresh score는 selection noise와 분리된 마지막 일반화 근거입니다.",items:[{label:"chosen",note:"frozen",shape:"document"},{label:"fresh",note:"new noise",shape:"seal",accent:true}]},
]);

export const FeatureAvailabilityViz=()=>v("feature-availability-modern","Point in time","과거에 발생한 record와 당시에 사용할 수 있던 record를 구분합니다","Event→arrival→cutoff→feature admission 흐름입니다",[
  {label:"Event",title:"현실에서 사건이 발생한 시각을 기록합니다",note:"검사 채취·결제·센서 측정 시각은 아직 feature availability가 아닐 수 있습니다.",items:[{label:"event",note:"occurred",shape:"clock",accent:true},{label:"record",note:"raw source",shape:"document"}]},
  {label:"Arrive",title:"Source가 prediction system에 도착한 시각을 따로 기록합니다",note:"Batch sync·승인·집계 지연 때문에 available time은 event time보다 늦을 수 있습니다.",items:[{label:"event",note:"09:50",shape:"clock"},{label:"arrive",note:"10:20",shape:"clock",accent:true}]},
  {label:"Compare",title:"Available time을 prediction cutoff와 비교합니다",note:"10:00 cutoff 뒤 10:20에 도착한 값은 사건이 과거여도 거부합니다.",items:[{label:"available",note:"10:20",shape:"clock"},{label:"cutoff",note:"10:00",shape:"gate",accent:true}]},
  {label:"Trace",title:"허용된 feature에서 source record까지 lineage를 남깁니다",note:"Join key·window·fallback·revision을 거꾸로 따라가며 future record가 없는지 검사합니다.",items:[{label:"feature",note:"value",shape:"document"},{label:"lineage",note:"source IDs",shape:"stack",accent:true}]},
]);

export const BaselineArtifactViz=()=>v("baseline-artifact-modern","First complete system","작은 model보다 먼저 완결된 artifact chain을 만듭니다","Data→OOF→metric→test→submission을 끊김 없이 연결합니다",[
  {label:"Input",title:"Data snapshot과 split manifest를 고정합니다",note:"Row·group·time identity가 재현되지 않으면 뒤의 score도 같은 실험이 아닙니다.",items:[{label:"data",note:"snapshot",shape:"stack"},{label:"split",note:"manifest",shape:"document",accent:true}]},
  {label:"OOF",title:"모든 training row에 unseen prediction 하나를 만듭니다",note:"Coverage 0은 누락, 2는 duplicate이므로 metric 전에 중단합니다.",items:[{label:"folds",note:"train→valid",shape:"compare"},{label:"OOF",note:"coverage=1",shape:"target",accent:true}]},
  {label:"Measure",title:"OOF prediction에서 metric·fold·slice report를 만듭니다",note:"Notebook 숫자가 아니라 input hashes와 연결된 machine-readable report를 저장합니다.",items:[{label:"OOF",note:"rows",shape:"document"},{label:"metric",note:"global·slice",shape:"compare",accent:true}]},
  {label:"Submit",title:"Test prediction의 row order와 checksum까지 봉인합니다",note:"같은 명령이 OOF·test·metric·submission을 다시 만들 수 있어야 baseline입니다.",items:[{label:"test",note:"prediction",shape:"document"},{label:"file",note:"checksum",shape:"seal",accent:true}]},
]);

export const PairedExperimentViz=()=>v("paired-experiment-modern","One hypothesis","Failure slice에서 한 변경과 paired evidence까지 한 receipt로 묶습니다","관찰→가설→한 축→같은 fold 비교→gate 순서입니다",[
  {label:"Observe",title:"Global score가 아니라 구체적인 failure slice에서 시작합니다",note:"Group C recall·긴 sequence latency처럼 관찰 가능한 failure를 먼저 고릅니다.",items:[{label:"report",note:"slice",shape:"document"},{label:"failure",note:"observed",shape:"target",accent:true}]},
  {label:"Hypothesis",title:"Failure를 만들었다고 의심하는 원인을 한 문장으로 씁니다",note:"설명 가능한 예상 결과가 없으면 변경은 탐색이 아니라 묶음 실험이 됩니다.",items:[{label:"failure",note:"evidence",shape:"target"},{label:"cause?",note:"testable",shape:"gate",accent:true}]},
  {label:"Pair",title:"같은 fold에서 candidate와 baseline을 빼 차이를 만듭니다",note:"서로 다른 fold score를 빼면 data difficulty가 model change와 섞입니다.",items:[{label:"baseline",note:"same fold",shape:"compare"},{label:"candidate",note:"one change",shape:"compare",accent:true}]},
  {label:"Gate",title:"Quality·slice·latency·memory gate로 채택을 결정합니다",note:"Reject도 다음 질문을 좁히는 artifact이며 결과를 보고 gate를 바꾸면 adaptation입니다.",items:[{label:"delta",note:"fold·slice",shape:"document"},{label:"decision",note:"accept/reject",shape:"seal",accent:true}]},
]);

export const SubmissionControlViz=()=>v("submission-control-modern","External feedback","제출 파일과 decision-changing feedback을 서로 다른 ledger로 셉니다","Submit→observe→adapt count→freeze→manifest 흐름입니다",[
  {label:"Submit",title:"모든 upload가 adaptive feedback인 것은 아닙니다",note:"Schema 수정·동일 candidate 재실행과 score를 보고 다음 선택을 바꾼 사건을 구분합니다.",items:[{label:"file",note:"upload",shape:"document"},{label:"score",note:"observed",shape:"target",accent:true}]},
  {label:"Count",title:"External score가 후속 결정을 바꾼 횟수만 budget에 더합니다",note:"20 uploads 중 decision-changing feedback이 6회면 B_used=6입니다.",items:[{label:"feedback",note:"changed choice",shape:"noise"},{label:"budget",note:"used 6",shape:"gate",accent:true}]},
  {label:"Freeze",title:"Budget과 종료 조건에서 candidate·recipe를 동결합니다",note:"동결 뒤 새로운 external score로 다시 고치면 현재 holdout은 selection data가 됩니다.",items:[{label:"candidate",note:"frozen",shape:"document"},{label:"gate",note:"stop",shape:"seal",accent:true}]},
  {label:"Manifest",title:"Run부터 row order·checksum·rollback까지 제출과 연결합니다",note:"Manifest는 선택을 고치지는 않지만 결과를 재생하고 이전 artifact로 돌아가게 합니다.",items:[{label:"artifacts",note:"lineage",shape:"stack"},{label:"manifest",note:"sealed",shape:"seal",accent:true}]},
]);
