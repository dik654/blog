import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const accent = "var(--primary)";
const border = "var(--border)";
const muted = "var(--muted-foreground)";

function Arrow({ x1, y1, x2, y2, id, active }: { x1: number; y1: number; x2: number; y2: number; id: string; active: boolean }) {
  return <g><defs><marker id={id} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={active ? accent : muted} /></marker></defs><motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={active ? accent : muted} strokeWidth="1.25" markerEnd={`url(#${id})`} initial={false} animate={{ opacity: active ? 1 : 0.28, pathLength: active ? 1 : 0.7 }} /></g>;
}

function Box({ x, y, w, h, label, detail, active, dashed = false }: { x: number; y: number; w: number; h: number; label: string; detail?: string; active: boolean; dashed?: boolean }) {
  return <motion.g initial={false} animate={{ opacity: active ? 1 : 0.46, scale: active ? 1.025 : 1 }} style={{ transformOrigin: `${x + w / 2}px ${y + h / 2}px` }}><rect x={x} y={y} width={w} height={h} rx="7" fill={active ? "color-mix(in srgb, var(--primary) 10%, transparent)" : "var(--background)"} stroke={active ? accent : border} strokeWidth="1.25" strokeDasharray={dashed ? "5 4" : undefined} /><text x={x + w / 2} y={y + h / 2 - (detail ? 4 : -3)} textAnchor="middle" className="fill-foreground text-[10px] font-bold sm:text-[9px]">{label}</text>{detail ? <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" className="fill-muted-foreground text-[8px] sm:text-[7px]">{detail}</text> : null}</motion.g>;
}

function Scene({ id, eyebrow, title, description, labels, notes, children }: { id: string; eyebrow: string; title: string; description: string; labels: readonly string[]; notes: readonly string[]; children: (active: number) => ReactNode }) {
  const controls = useAnimatedScenes(labels.length, 3300);
  return <VizFrame title={title} description={description} className="my-8"><div id={id} data-viz tabIndex={0} onKeyDown={controls.onKeyDown} className="min-w-0 overflow-hidden border-y border-border/70 bg-background px-4 py-6 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6"><p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">{eyebrow} · {String(controls.active + 1).padStart(2, "0")}</p><h3 className="mt-2 text-lg font-bold leading-7">{labels[controls.active]}</h3><div data-viz-canvas className="mt-5 min-w-0 overflow-hidden">{children(controls.active)}</div><p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{notes[controls.active]}</p><AnimatedSceneControls labels={[...labels]} {...controls} /></div></VizFrame>;
}

export function SentenceVectorViz() {
  const labels = ["Token마다 문맥 state", "Padding을 mask로 제외", "한 vector로 pooling", "학습한 관계로 가까워짐"] as const;
  const notes = [
    "Encoder는 문장 전체를 읽지만 출력은 token마다 한 줄씩 남깁니다. 아직 sentence vector는 없습니다.",
    "Padding은 batch 길이를 맞추는 빈 칸이므로 평균의 분자와 분모에서 함께 제외합니다.",
    "Valid token state를 평균한 뒤 길이를 1로 맞추면 방향으로 두 문장을 비교할 수 있습니다.",
    "Pooling만으로 가까움의 뜻은 생기지 않습니다. Positive·negative pair objective가 공간의 관계를 정합니다.",
  ] as const;
  return <Scene id="sentence-vector-viz" eyebrow="Tokens to relation" title="문장이 검색 가능한 vector가 되는 네 단계" description="방향키 또는 재생 버튼으로 token→mask→pooling→relation을 따라갑니다." labels={labels} notes={notes}>{active => <svg viewBox="0 0 360 220" role="img" aria-label={labels[active]} className="block h-auto w-full"><g>{[0,1,2,3,4].map(i => <motion.rect key={i} x={10+i*38} y={42+(i%2)*16} width="29" height="42" rx="5" fill={i===4 ? "var(--muted)" : "var(--background)"} stroke={active===0 ? accent : border} strokeWidth="1.25" animate={{ y: active >= 1 && i===4 ? 126 : 42+(i%2)*16, opacity: active >= 1 && i===4 ? .25 : 1 }} />)}</g><text x="94" y="113" textAnchor="middle" className="fill-muted-foreground text-[9px]">h₁ · h₂ · h₃ · h₄ · PAD</text><Arrow x1={199} y1={82} x2={224} y2={82} id="sentence-pool-a" active={active >= 2}/><Box x={229} y={48} w={55} h={68} label="mean" detail="valid only" active={active === 2}/><Arrow x1={285} y1={82} x2={306} y2={82} id="sentence-pool-b" active={active >= 2}/><motion.circle cx="327" cy="82" r="18" fill="color-mix(in srgb, var(--primary) 10%, transparent)" stroke={active >= 2 ? accent : border} strokeWidth="1.25" animate={{ scale: active === 3 ? 1.12 : 1 }} /><text x="327" y="86" textAnchor="middle" className="fill-foreground text-[10px] font-bold">z</text>{active === 3 ? <g><circle cx="274" cy="172" r="14" fill="var(--background)" stroke={accent} strokeWidth="1.25"/><circle cx="307" cy="162" r="14" fill="var(--background)" stroke={accent} strokeWidth="1.25"/><circle cx="337" cy="188" r="14" fill="var(--background)" stroke={border} strokeWidth="1.25"/><text x="291" y="211" textAnchor="middle" className="fill-muted-foreground text-[9px]">positive는 가깝게</text></g> : null}</svg>}</Scene>;
}

export function BiEncoderFlowViz() {
  const labels = ["Cross-encoder의 pair 계산", "Document vector 사전 계산", "Query로 candidate 검색", "상위 candidate만 rerank"] as const;
  const notes = [
    "Cross-encoder는 query와 각 document를 함께 읽으므로 새 query마다 corpus 전체 pair 계산이 반복됩니다.",
    "Bi-encoder는 query와 독립적인 document vector를 corpus revision마다 한 번 만들어 index에 저장합니다.",
    "Online에서는 query vector 한 개로 ANN index를 탐색합니다. 이 단계가 놓친 정답은 candidate 밖에 남습니다.",
    "Cross-encoder는 작은 candidate set 안에서 token interaction을 복구하지만 새 문서를 가져오지는 않습니다.",
  ] as const;
  return <Scene id="bi-encoder-flow-viz" eyebrow="Retrieve then rerank" title="Pair 계산을 재사용 가능한 검색 pipeline으로 바꾸기" description="전체 pair scoring과 two-stage retrieval의 계산 경계를 비교합니다." labels={labels} notes={notes}>{active => <svg viewBox="0 0 360 220" role="img" aria-label={labels[active]} className="block h-auto w-full"><Box x={8} y={76} w={58} h={54} label="query" detail="online" active={active !== 1}/><Arrow x1={67} y1={103} x2={92} y2={103} id="bienc-a" active={active !== 1}/><Box x={97} y={35} w={78} h={50} label={active===0 ? "q+d₁" : "doc vectors"} detail={active===0 ? "pair forward" : "offline"} active={active <= 1}/><Box x={97} y={135} w={78} h={50} label={active===0 ? "q+d₂…M" : "ANN index"} detail={active===0 ? "repeat" : "generation g"} active={active <= 1}/><Arrow x1={176} y1={103} x2={202} y2={103} id="bienc-b" active={active >= 2}/><g>{[0,1,2,3].map(i => <motion.circle key={i} cx={220+i*27} cy={103+(i%2?15:-15)} r="11" fill={i<2 && active>=2 ? "color-mix(in srgb, var(--primary) 12%, transparent)" : "var(--background)"} stroke={i<2 && active>=2 ? accent : border} strokeWidth="1.25" />)}</g><Arrow x1={309} y1={103} x2={328} y2={103} id="bienc-c" active={active === 3}/><Box x={332} y={69} w={20} h={68} label="↕" detail="rank" active={active === 3}/></svg>}</Scene>;
}

export function EmbeddingArtifactViz() {
  const labels = ["Role이 있는 입력", "Tokenizer·truncation", "Embedding batch", "같은 generation으로 검색"] as const;
  const notes = [
    "Query와 passage는 학습 때 사용한 prefix·instruction·language를 그대로 포함한 서로 다른 입력 역할입니다.",
    "Tokenizer revision과 max length가 실제로 남는 content를 정합니다. 원문 길이만으로 보존량을 알 수 없습니다.",
    "Pooling·normalization·dimension·dtype까지 같아야 같은 embedding artifact라고 부를 수 있습니다.",
    "Index와 query encoder가 같은 generation receipt를 가리켜야 silent retrieval drift를 막을 수 있습니다.",
  ] as const;
  return <Scene id="embedding-artifact-viz" eyebrow="Checkpoint is not enough" title="한 문장이 production index에 들어갈 때 함께 고정할 것" description="Input serialization에서 compatible index generation까지의 artifact lineage입니다." labels={labels} notes={notes}>{active => <svg viewBox="0 0 360 220" role="img" aria-label={labels[active]} className="block h-auto w-full"><Box x={8} y={42} w={74} h={46} label="query:" detail="role prefix" active={active===0}/><Box x={8} y={132} w={74} h={46} label="passage:" detail="role prefix" active={active===0}/><Arrow x1={83} y1={110} x2={108} y2={110} id="artifact-a" active={active>=1}/><Box x={112} y={72} w={72} h={76} label="tokenizer" detail="limit·side" active={active===1}/><Arrow x1={185} y1={110} x2={210} y2={110} id="artifact-b" active={active>=2}/><Box x={214} y={54} w={68} h={48} label="encoder" detail="revision" active={active===2}/><Box x={214} y={119} w={68} h={48} label="pool·norm" detail="dim·dtype" active={active===2}/><Arrow x1={283} y1={110} x2={307} y2={110} id="artifact-c" active={active===3}/><Box x={311} y={67} w={41} h={86} label="g42" detail="index" active={active===3}/></svg>}</Scene>;
}

export function EmbeddingEvaluationViz() {
  const labels = ["Query별 정답 집합", "Candidate coverage", "순위 품질", "비용과 함께 release"] as const;
  const notes = [
    "정답은 한 문서가 아닐 수 있습니다. Corpus revision과 annotator rule을 묶은 label snapshot을 먼저 만듭니다.",
    "Recall@k는 정답 중 candidate 안에 들어온 비율을 봅니다. Reranker 전에 이 천장을 측정합니다.",
    "NDCG@k는 더 중요한 정답이 위에 왔는지 gain과 rank discount로 측정합니다.",
    "필수 language·length·domain slice를 통과한 후보만 p95·memory·index size와 함께 Pareto 비교합니다.",
  ] as const;
  return <Scene id="embedding-evaluation-viz" eyebrow="Labels before leaderboard" title="정답 정의에서 production release까지" description="정답 집합·coverage·ranking·운영 비용을 서로 다른 장부로 봅니다." labels={labels} notes={notes}>{active => <svg viewBox="0 0 360 220" role="img" aria-label={labels[active]} className="block h-auto w-full"><Box x={8} y={70} w={66} h={70} label="labels" detail="{A,B,C,D}" active={active===0}/><Arrow x1={75} y1={105} x2={99} y2={105} id="eval-a" active={active>=1}/><g>{[0,1,2,3].map(i => <motion.rect key={i} x={104+i*24} y={72+i*13} width="18" height="42" rx="4" fill={i<3 ? "color-mix(in srgb, var(--primary) 10%, transparent)" : "var(--background)"} stroke={active===1 && i<3 ? accent : border} strokeWidth="1.25" />)}</g><text x="139" y="160" textAnchor="middle" className="fill-muted-foreground text-[9px]">3 / 4 found</text><Arrow x1={197} y1={105} x2={219} y2={105} id="eval-b" active={active>=2}/><Box x={223} y={54} w={59} h={48} label="DCG" detail="gain÷rank" active={active===2}/><Box x={223} y={119} w={59} h={48} label="IDCG" detail="ideal" active={active===2}/><Arrow x1={283} y1={105} x2={305} y2={105} id="eval-c" active={active===3}/><Box x={309} y={35} w={43} h={38} label="quality" active={active===3}/><Box x={309} y={91} w={43} h={38} label="p95" active={active===3}/><Box x={309} y={147} w={43} h={38} label="GB" active={active===3}/></svg>}</Scene>;
}
