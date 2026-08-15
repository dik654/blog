import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  AnimatedSceneControls,
  useAnimatedScenes,
} from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";

const accent = "var(--primary)";
const border = "var(--border)";
const muted = "var(--muted-foreground)";

function Arrow({ x1, y1, x2, y2, id, active }: { x1: number; y1: number; x2: number; y2: number; id: string; active: boolean }) {
  return <g><defs><marker id={id} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={active ? accent : muted} /></marker></defs><motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={active ? accent : muted} strokeWidth="1.25" markerEnd={`url(#${id})`} initial={false} animate={{ opacity: active ? 1 : 0.3, pathLength: active ? 1 : 0.75 }} /></g>;
}

function Box({ x, y, w, h, label, detail, active, dashed = false }: { x: number; y: number; w: number; h: number; label: string; detail?: string; active: boolean; dashed?: boolean }) {
  return <motion.g initial={false} animate={{ opacity: active ? 1 : 0.5, scale: active ? 1.025 : 1 }} style={{ transformOrigin: `${x + w / 2}px ${y + h / 2}px` }}><rect x={x} y={y} width={w} height={h} rx="7" fill={active ? "color-mix(in srgb, var(--primary) 10%, transparent)" : "var(--background)"} stroke={active ? accent : border} strokeWidth="1.25" strokeDasharray={dashed ? "5 4" : undefined} /><text x={x + w / 2} y={y + h / 2 - (detail ? 4 : -3)} textAnchor="middle" className="fill-foreground text-[11px] font-bold sm:text-[9px]">{label}</text>{detail ? <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" className="fill-muted-foreground text-[9px] sm:text-[7px]">{detail}</text> : null}</motion.g>;
}

function Scene({ id, eyebrow, title, description, labels, notes, children }: { id: string; eyebrow: string; title: string; description: string; labels: readonly string[]; notes: readonly string[]; children: (active: number) => ReactNode }) {
  const controls = useAnimatedScenes(labels.length, 3200);
  return <VizFrame title={title} description={description} className="my-8"><div id={id} data-viz tabIndex={0} onKeyDown={controls.onKeyDown} className="min-w-0 overflow-hidden border-y border-border/70 bg-background px-4 py-6 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6"><p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">{eyebrow} · {String(controls.active + 1).padStart(2, "0")}</p><h3 className="mt-2 text-lg font-bold leading-7">{labels[controls.active]}</h3><div data-viz-canvas className="mt-5 min-w-0 overflow-hidden">{children(controls.active)}</div><p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{notes[controls.active]}</p><AnimatedSceneControls labels={[...labels]} {...controls} /></div></VizFrame>;
}

export function DomainDecisionViz() {
  const labels = ["관찰한 실패", "부족한 능력 이름 붙이기", "가장 작은 후보", "같은 시험으로 release"] as const;
  const notes = [
    "정답률이 낮다는 결과만으로 학습 방법을 고르지 않고 실패 sample과 system trace를 모읍니다.",
    "낯선 문체·최신 사실·출력 행동·자원 제약을 분리해야 서로 다른 처방이 보입니다.",
    "Prompt·RAG·continued pretraining·SFT·PEFT를 작은 개입부터 올려 같은 validation에서 비교합니다.",
    "Target gain뿐 아니라 general regression·latency·memory·rollback 조건을 함께 통과해야 합니다.",
  ] as const;
  return <Scene id="domain-decision-viz" eyebrow="Diagnose before training" title="실패 sample이 개입 선택표가 되는 흐름" description="관찰→진단→후보→release를 방향키 또는 재생으로 따라갑니다." labels={labels} notes={notes}>{active => <svg viewBox="0 0 360 220" role="img" aria-label={labels[active]} className="block h-auto w-full"><Box x={8} y={76} w={68} h={68} label="failed cases" detail="samples·trace" active={active === 0}/><Arrow x1={77} y1={110} x2={101} y2={110} id="domain-choice-a" active={active >= 1}/><g>{[[105,35,"language","DAPT"],[105,100,"fresh fact","RAG"],[105,165,"behavior","SFT"]].map(([x,y,l,d]) => <Box key={String(l)} x={Number(x)} y={Number(y)} w={72} h={44} label={String(l)} detail={String(d)} active={active === 1}/>)}</g><Arrow x1={178} y1={110} x2={205} y2={110} id="domain-choice-b" active={active >= 2}/><Box x={209} y={55} w={66} h={44} label="smallest" detail="eligible" active={active === 2}/><Box x={209} y={121} w={66} h={44} label="fallback" detail="next" active={active === 2} dashed/><Arrow x1={276} y1={110} x2={301} y2={110} id="domain-choice-c" active={active === 3}/><Box x={305} y={72} w={47} h={76} label="gate" detail="ship" active={active === 3}/></svg>}</Scene>;
}

export function ContinuedPretrainingViz() {
  const labels = ["Corpus manifest", "Domain·general mixture", "Checkpoint trail", "Gain·forgetting 선택"] as const;
  const notes = [
    "Source·license·date·dedup·evaluation overlap을 먼저 고정해 어떤 token을 다시 보여 줄지 정합니다.",
    "Domain token과 general replay token을 λ와 1−λ 비율로 sampling합니다.",
    "같은 run 안에서도 step마다 domain fit과 general capability가 다르므로 checkpoint를 남깁니다.",
    "Domain gain이 거의 같다면 forgetting budget과 cost가 작은 checkpoint를 선택합니다.",
  ] as const;
  return <Scene id="continued-pretraining-viz" eyebrow="Corpus to checkpoint" title="Continued pretraining은 corpus와 checkpoint의 두 장부를 잇습니다" description="Token이 들어오는 경로와 model이 나오는 경로를 한눈에 봅니다." labels={labels} notes={notes}>{active => <svg viewBox="0 0 360 220" role="img" aria-label={labels[active]} className="block h-auto w-full"><Box x={8} y={44} w={72} h={52} label="domain" detail="licensed·dedup" active={active === 0}/><Box x={8} y={126} w={72} h={52} label="general" detail="replay" active={active <= 1}/><Arrow x1={81} y1={70} x2={113} y2={101} id="dapt-a" active={active >= 1}/><Arrow x1={81} y1={152} x2={113} y2={119} id="dapt-b" active={active >= 1}/><Box x={118} y={74} w={72} h={72} label="λ mixture" detail="token stream" active={active === 1}/><Arrow x1={191} y1={110} x2={216} y2={110} id="dapt-c" active={active >= 2}/>{[0,1,2].map(i => <motion.circle key={i} cx={232+i*31} cy={110} r="13" fill={active >= 2 ? "color-mix(in srgb, var(--primary) 10%, transparent)" : "var(--background)"} stroke={active >= 2 ? accent : border} strokeWidth="1.25" animate={{ scale: active === 2 && i === 2 ? 1.12 : 1 }} />)}<text x="263" y="143" textAnchor="middle" className="fill-muted-foreground text-[9px] sm:text-[7px]">10k · 20k · 30k</text><Arrow x1={309} y1={110} x2={328} y2={110} id="dapt-d" active={active === 3}/><Box x={332} y={75} w={20} h={70} label="✓" detail="" active={active === 3}/></svg>}</Scene>;
}

export function DomainTaskFinetuningViz() {
  const labels = ["Demonstration 한 건", "Response-only loss", "업데이트 범위", "행동 release gate"] as const;
  const notes = [
    "Role·context·target schema·abstention을 한 example의 형태로 고정합니다.",
    "Prompt는 읽되 assistant response token만 채점한다는 mask를 별도 계약으로 둡니다.",
    "Full·LoRA·frozen head는 같은 data·step·seed에서 바뀌는 parameter 범위만 다르게 비교합니다.",
    "Format·factuality·abstention·general regression은 평균 하나로 상쇄하지 않는 별도 gate입니다.",
  ] as const;
  return <Scene id="domain-task-finetuning-viz" eyebrow="Example to behavior" title="Demonstration이 model update와 release evidence가 되는 과정" description="Input과 target부터 배포 판정까지 한 단계씩 엽니다." labels={labels} notes={notes}>{active => <svg viewBox="0 0 360 220" role="img" aria-label={labels[active]} className="block h-auto w-full"><Box x={8} y={42} w={78} h={46} label="system·user" detail="context" active={active === 0}/><Box x={8} y={132} w={78} h={46} label="assistant" detail="target" active={active <= 1}/><Arrow x1={87} y1={110} x2={111} y2={110} id="sft-a" active={active >= 1}/><g>{[0,1,2,3,4,5].map(i => <rect key={i} x={116+i*16} y="94" width="12" height="32" rx="3" fill={i < 3 ? "var(--background)" : "color-mix(in srgb, var(--primary) 14%, transparent)"} stroke={active === 1 && i >= 3 ? accent : border} strokeWidth="1.25" />)}</g><text x="160" y="148" textAnchor="middle" className="fill-muted-foreground text-[9px] sm:text-[7px]">0 0 0 · 1 1 1</text><Arrow x1={213} y1={110} x2={235} y2={110} id="sft-b" active={active >= 2}/><Box x={239} y={36} w={68} h={42} label="full" detail="all weights" active={active === 2}/><Box x={239} y={90} w={68} h={42} label="LoRA" detail="adapters" active={active === 2}/><Box x={239} y={144} w={68} h={42} label="head" detail="frozen base" active={active === 2}/><Arrow x1={308} y1={110} x2={329} y2={110} id="sft-c" active={active === 3}/><Box x={333} y={75} w={19} h={70} label="✓" active={active === 3}/></svg>}</Scene>;
}

export function DomainDataGovernanceViz() {
  const labels = ["Row 뒤의 공유 원인", "Group·time split", "Rights lineage", "근거가 있는 범위만 주장"] as const;
  const notes = [
    "환자 visit·gene sequence·machine row는 파일이 달라도 같은 entity·family·lot에서 나왔을 수 있습니다.",
    "공유 원인 group을 한 split에 묶고 미래 배포라면 train 시각이 test보다 앞서게 합니다.",
    "Source의 license·consent·retention·deletion을 derivative·shard·run까지 연결합니다.",
    "독립 group이 충분한 slice만 성능 주장 범위에 넣고 빈 cell은 숨기지 않습니다.",
  ] as const;
  return <Scene id="domain-data-governance-viz" eyebrow="Rows are not independent" title="한 row에서 배포 주장 경계까지" description="공유 원인·split·권리·evidence의 네 층을 연결합니다." labels={labels} notes={notes}>{active => <svg viewBox="0 0 360 220" role="img" aria-label={labels[active]} className="block h-auto w-full"><g>{[0,1,2].map(i => <motion.circle key={i} cx={30+i*24} cy={82+i*22} r="13" fill="var(--background)" stroke={active === 0 ? accent : border} strokeWidth="1.25" />)}<path d="M18 68C52 40 96 64 89 126" fill="none" stroke={active === 0 ? accent : border} strokeWidth="1.25" strokeDasharray="4 4" /></g><Arrow x1={94} y1={110} x2={116} y2={110} id="gov-a" active={active >= 1}/><Box x={120} y={38} w={62} h={48} label="train" detail="groups A·B" active={active === 1}/><Box x={120} y={133} w={62} h={48} label="test" detail="groups C·D" active={active === 1}/><Arrow x1={183} y1={110} x2={207} y2={110} id="gov-b" active={active >= 2}/><Box x={211} y={40} w={64} h={42} label="source" detail="rights" active={active === 2}/><Box x={211} y={90} w={64} h={42} label="shard" detail="derivative" active={active === 2}/><Box x={211} y={140} w={64} h={42} label="run" detail="delete path" active={active === 2}/><Arrow x1={276} y1={110} x2={299} y2={110} id="gov-c" active={active === 3}/><g>{[0,1,2,3].map(i => <rect key={i} x={304+(i%2)*23} y={76+Math.floor(i/2)*36} width="18" height="28" rx="3" fill={i < 3 && active === 3 ? "color-mix(in srgb, var(--primary) 15%, transparent)" : "var(--background)"} stroke={i < 3 && active === 3 ? accent : border} strokeWidth="1.25" />)}</g></svg>}</Scene>;
}
