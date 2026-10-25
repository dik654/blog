import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import { PROJECTION_FIXTURE } from "../calculations";

type SceneProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  labels: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
};

function Scene({ id, eyebrow, title, description, labels, notes, children }: SceneProps) {
  const controls = useAnimatedScenes(labels.length, 6200, {
    loop: false,
    autoPlay: false,
  });
  const active = controls.reducedMotion ? labels.length - 1 : controls.active;

  return (
    <VizFrame
      eyebrow={eyebrow}
      title={title}
      description={description}
      className="my-8 !block !h-auto !max-h-none !overflow-visible [&>figcaption]:mb-3 [&>figcaption>h3]:mt-1 [&>figcaption>h3]:text-base [&>figcaption>h3]:leading-6 [&>figcaption>p:last-child]:hidden sm:[&>figcaption]:mb-5 sm:[&>figcaption>h3]:mt-2 sm:[&>figcaption>h3]:text-lg sm:[&>figcaption>h3]:leading-7 sm:[&>figcaption>p:last-child]:mt-2 sm:[&>figcaption>p:last-child]:block sm:[&>figcaption>p:last-child]:text-sm sm:[&>figcaption>p:last-child]:leading-6"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-4 sm:!p-7"
    >
      <div
        id={controls.playbackId}
        data-viz-id={id}
        tabIndex={0}
        role="group"
        aria-label={`${title}의 ${labels.length}단계 설명`}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-0 flex-col justify-center sm:min-h-[22rem]">
          <p className="text-[11px] font-black text-primary">
            장면 {String(active + 1).padStart(2, "0")} / {String(labels.length).padStart(2, "0")}
          </p>
          <h4 className="mt-1 break-keep text-sm font-bold leading-6 sm:mt-2 sm:text-base sm:leading-7">
            {labels[active]}
          </h4>
          <div className="mt-3 min-w-0 sm:mt-5">{children(active)}</div>
          <p className="mt-3 border-l border-primary/50 pl-3 text-xs leading-6 text-muted-foreground sm:mt-5 sm:pl-4 sm:text-sm sm:leading-7">
            {notes[active]}
          </p>
        </div>
        <AnimatedSceneControls
          labels={labels}
          active={active}
          playing={controls.playing}
          reducedMotion={controls.reducedMotion}
          setActive={controls.setActive}
          setPlaying={controls.setPlaying}
        />
        <ol className="static-reading-only mt-4 divide-y divide-border border-y border-border text-sm leading-6">
          {labels.map((label, index) => (
            <li key={label} className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
              <strong>{index + 1}. {label}</strong>
              <span className="text-muted-foreground">{notes[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}

function RelationRow({ sample, relation, reason, active }: {
  sample: string;
  relation: "positive" | "negative" | "unknown";
  reason: string;
  active: boolean;
}) {
  const relationLabel = {
    positive: "가깝게",
    negative: "멀게",
    unknown: "학습 제외",
  }[relation];

  return (
    <div className={`grid min-w-0 grid-cols-[minmax(0,1fr)_5.5rem] gap-3 border-y px-3 py-3 transition-colors sm:grid-cols-[10rem_6rem_minmax(0,1fr)] ${active ? "border-primary/70 bg-primary/10" : "border-border bg-background"}`}>
      <strong className="break-keep text-xs leading-5">{sample}</strong>
      <span className="text-right font-mono text-[10px] font-bold text-primary sm:text-left">{relationLabel}</span>
      <span className="col-span-2 break-keep text-[11px] leading-5 text-muted-foreground sm:col-span-1">{reason}</span>
    </div>
  );
}

export function PairMeaningOverviewViz() {
  const labels = [
    "기준 상품을 한 장 고릅니다",
    "같은 SKU의 밝기 변화는 positive입니다",
    "다른 SKU는 negative입니다",
    "근거가 부족한 후보는 unknown입니다",
  ] as const;
  const notes = [
    "SKU-42 정면 사진을 anchor로 둡니다. 파일 이름이 아니라 상품 식별이 이 task의 기준입니다.",
    "SKU-42의 다른 crop은 조명과 구도가 달라도 같은 상품이라는 의미를 보존하므로 가까워지게 합니다.",
    "SKU-77은 검색 결과에서 구분해야 할 다른 상품이므로 멀어지게 합니다.",
    "판매자 이미지가 SKU-42의 중복 등록인지 확인되지 않았다면 억지 negative로 만들지 않고 loss에서 제외합니다.",
  ] as const;

  return (
    <Scene id="contrastive-pair-overview" eyebrow="하나의 상품 검색 사례" title="파일이 아니라 업무상 관계가 embedding 방향을 정합니다" description="같은 anchor에 세 후보를 붙여 relation이 학습 신호로 바뀌는 순간을 봅니다." labels={labels} notes={notes}>
      {(active) => (
        <div className="grid gap-4 lg:grid-cols-[11rem_minmax(0,1fr)] lg:items-center" role="img" aria-label={notes[active]}>
          <div className="border-y border-primary/60 bg-primary/5 px-4 py-5 text-center">
            <span className="text-[10px] font-bold text-muted-foreground">ANCHOR</span>
            <div className="mx-auto mt-3 grid h-20 w-20 grid-cols-2 gap-1 border border-primary/40 p-2" aria-hidden="true">
              <span className="bg-primary/15" /><span className="bg-primary/30" />
              <span className="bg-primary/30" /><span className="bg-primary/15" />
            </div>
            <strong className="mt-3 block font-mono text-sm">SKU-42 · front</strong>
            <span className="mt-1 block text-[10px] text-muted-foreground">보존할 의미 · 상품 식별</span>
          </div>
          <div className="space-y-2">
            <RelationRow sample="SKU-42 · 밝은 crop" relation="positive" reason="상품 식별은 같고 조명·구도만 다릅니다." active={active === 1 || active === 0} />
            <RelationRow sample="SKU-77 · 다른 상품" relation="negative" reason="검색 결과에서 반드시 구분해야 합니다." active={active === 2} />
            <RelationRow sample="판매자 미확인 사진" relation="unknown" reason="같은 상품인지 판단할 근거가 없습니다." active={active === 3} />
          </div>
        </div>
      )}
    </Scene>
  );
}

export function PairContractViz() {
  const labels = [
    "관계 근거를 receipt에 적습니다",
    "같은 색 변화를 두 task에 적용합니다",
    "상품 식별에서는 positive로 채택합니다",
    "병변 분류에서는 반례가 되어 거절합니다",
  ] as const;
  const notes = [
    "두 sample ID뿐 아니라 relation source·target·transformation revision을 함께 기록해야 잘못된 pair를 되돌릴 수 있습니다.",
    "밝기와 색을 바꾸는 같은 transformation도 무엇을 예측하려는지에 따라 의미가 달라집니다.",
    "색이 달라도 SKU가 유지된다면 상품 검색에서는 positive transformation으로 쓸 수 있습니다.",
    "색 변화가 진단 단서를 지우면 피부 병변 분류에서는 label preservation이 깨집니다. Transformation 이름만 보고 positive를 정할 수 없습니다.",
  ] as const;

  return (
    <Scene id="contrastive-pair-contract" eyebrow="Pair contract" title="같은 변환도 task가 바뀌면 relation이 달라집니다" description="Receipt에 남길 정보와 augmentation 반례를 한 흐름으로 확인합니다." labels={labels} notes={notes}>
      {(active) => (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]" role="img" aria-label={notes[active]}>
          <div className={`border-y px-4 py-4 transition-colors ${active === 0 ? "border-primary/70 bg-primary/10" : "border-border"}`}>
            <span className="text-[10px] font-bold text-primary">PAIR RECEIPT</span>
            <dl className="mt-3 grid grid-cols-[6rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-[11px] leading-5">
              <dt className="text-muted-foreground">left / right</dt><dd className="font-mono">SKU42/front · SKU42/crop</dd>
              <dt className="text-muted-foreground">relation</dt><dd className="font-mono">positive</dd>
              <dt className="text-muted-foreground">source</dt><dd>같은 상품 ID</dd>
              <dt className="text-muted-foreground">target</dt><dd>상품 식별</dd>
              <dt className="text-muted-foreground">transform</dt><dd className="font-mono">color-v3</dd>
            </dl>
          </div>
          <div className="space-y-2">
            <div className={`grid grid-cols-[6.5rem_minmax(0,1fr)_4.5rem] items-center gap-2 border-y px-3 py-4 transition-colors ${active === 1 || active === 2 ? "border-primary/70 bg-primary/10" : "border-border"}`}>
              <strong className="text-xs">상품 검색</strong>
              <span className="break-keep text-[11px] leading-5 text-muted-foreground">색 변화 뒤에도 SKU-42</span>
              <span className="text-right text-[10px] font-bold text-primary">채택</span>
            </div>
            <div className={`grid grid-cols-[6.5rem_minmax(0,1fr)_4.5rem] items-center gap-2 border-y px-3 py-4 transition-colors ${active === 1 || active === 3 ? "border-primary/70 bg-primary/10" : "border-border"}`}>
              <strong className="text-xs">병변 분류</strong>
              <span className="break-keep text-[11px] leading-5 text-muted-foreground">색 변화가 진단 단서를 제거</span>
              <span className="text-right text-[10px] font-bold text-primary">거절</span>
            </div>
          </div>
        </div>
      )}
    </Scene>
  );
}

function Stage({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={`min-w-0 border-y px-2 py-3 text-center transition-colors sm:px-3 ${active ? "border-primary/70 bg-primary/10" : "border-border bg-background"}`}>
      <span className="block break-keep text-[9px] font-bold text-muted-foreground">{label}</span>
      <strong className="mt-1 block break-words font-mono text-xs text-foreground sm:text-sm">{value}</strong>
    </div>
  );
}

export function ProjectionHandoffViz() {
  const labels = [
    "Positive view 두 장을 같은 encoder에 넣습니다",
    "Encoder가 재사용할 표현 h를 만듭니다",
    "Projection head가 loss 공간 z̃를 만듭니다",
    "Norm으로 나눠 unit vector z를 만듭니다",
    "Unit vector의 내적으로 cosine을 계산합니다",
  ] as const;
  const notes = [
    "SKU-42의 원본과 밝은 crop은 positive pair이므로 같은 encoder fθ를 공유합니다.",
    "h는 분류·검색 같은 downstream task가 재사용할 encoder representation입니다.",
    "gφ는 contrastive objective가 직접 작용할 projection 공간을 만듭니다. SimCLR은 학습 뒤 이 head를 버리고 h를 평가했습니다.",
    "설명용 z̃=(3,4)의 L2 norm은 5이고, z=(0.6,0.8)입니다. 이제 vector 길이가 아니라 방향을 비교합니다.",
    "Reference r=(1,0)도 unit vector이므로 dot product는 0.6입니다. 이 값은 설명용 fixture이며 모델 품질 측정값이 아닙니다.",
  ] as const;
  const { norm, unit, cosine } = PROJECTION_FIXTURE;

  return (
    <Scene id="contrastive-projection-handoff" eyebrow="Representation handoff" title="입력 두 장이 h와 z를 거쳐 cosine 0.6이 됩니다" description="업무용 표현과 loss용 표현을 분리한 뒤 실제 숫자를 계산합니다." labels={labels} notes={notes}>
      {(active) => (
        <div role="img" aria-label={notes[active]}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1.15fr_auto_0.8fr_auto_0.9fr_auto_1fr] sm:items-center">
            <Stage label="positive views" value="xᵢ · xⱼ" active={active === 0} />
            <span className="hidden text-center text-muted-foreground sm:block" aria-hidden="true">→</span>
            <Stage label="encoder fθ" value="hᵢ · hⱼ" active={active === 1} />
            <span className="hidden text-center text-muted-foreground sm:block" aria-hidden="true">→</span>
            <Stage label="projection gφ" value="z̃=(3,4)" active={active === 2} />
            <span className="hidden text-center text-muted-foreground sm:block" aria-hidden="true">→</span>
            <Stage label="normalize" value={`z=(${unit[0]},${unit[1]})`} active={active === 3} />
          </div>
          <div className={`mt-4 grid gap-px bg-border p-px transition-colors sm:grid-cols-3 ${active >= 3 ? "ring-1 ring-primary/50" : ""}`}>
            <div className="bg-background px-3 py-3">
              <span className="text-[9px] font-bold text-muted-foreground">L2 NORM</span>
              <strong className="mt-1 block font-mono text-sm">√(3²+4²) = {norm}</strong>
            </div>
            <div className="bg-background px-3 py-3">
              <span className="text-[9px] font-bold text-muted-foreground">UNIT VECTOR</span>
              <strong className="mt-1 block font-mono text-sm">(3/5,4/5) = ({unit[0]},{unit[1]})</strong>
            </div>
            <div className={`bg-background px-3 py-3 ${active === 4 ? "bg-primary/10" : ""}`}>
              <span className="text-[9px] font-bold text-muted-foreground">COSINE WITH (1,0)</span>
              <strong className="mt-1 block font-mono text-sm text-primary">{unit[0]}×1 + {unit[1]}×0 = {cosine}</strong>
            </div>
          </div>
        </div>
      )}
    </Scene>
  );
}

const legacyBorder = "var(--border)";
const legacyMuted = "var(--muted-foreground)";
const legacyAccent = "var(--primary)";

function LegacyArrow({ x1, y1, x2, y2, id, active = false }: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  id: string;
  active?: boolean;
}) {
  return (
    <g>
      <defs>
        <marker id={id} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0L7 3.5L0 7Z" fill={active ? legacyAccent : legacyMuted} />
        </marker>
      </defs>
      <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={active ? legacyAccent : legacyMuted} strokeWidth="1.25" markerEnd={`url(#${id})`} initial={false} animate={{ pathLength: active ? 1 : 0.84 }} />
    </g>
  );
}

function LegacyBox({ x, y, w, h, label, detail, active = false, shape = "rect" }: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  detail?: string;
  active?: boolean;
  shape?: "rect" | "diamond" | "circle";
}) {
  const common = {
    fill: active ? "color-mix(in srgb, var(--primary) 10%, transparent)" : "var(--background)",
    stroke: active ? legacyAccent : legacyBorder,
    strokeWidth: 1.25,
  };
  return (
    <motion.g initial={false} animate={{ opacity: active ? 1 : 0.64, scale: active ? 1.02 : 1 }} style={{ transformOrigin: `${x + w / 2}px ${y + h / 2}px` }}>
      {shape === "diamond" ? (
        <path d={`M${x + w / 2} ${y}L${x + w} ${y + h / 2}L${x + w / 2} ${y + h}L${x} ${y + h / 2}Z`} {...common} />
      ) : shape === "circle" ? (
        <circle cx={x + w / 2} cy={y + h / 2} r={Math.min(w, h) / 2} {...common} />
      ) : (
        <rect x={x} y={y} width={w} height={h} rx="7" {...common} />
      )}
      <text x={x + w / 2} y={y + h / 2 - (detail ? 4 : -3)} textAnchor="middle" className="fill-foreground text-[12px] font-bold sm:text-[10px]">{label}</text>
      {detail ? <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" className="fill-muted-foreground text-[10px] sm:text-[8px]">{detail}</text> : null}
    </motion.g>
  );
}

/** 다음 네 export는 이웃 글이 재작성될 때 각 글 전용 파일로 이동합니다. */
export function SimCLRObjectiveViz() {
  const labels = ["원본에서 두 view", "2N view batch", "Positive 확률", "Temperature lens"] as const;
  const notes = [
    "Augmentation 두 번이 같은 원본의 positive pair를 만듭니다.",
    "Anchor 자신을 빼면 후보는 2N−1개이고 그중 positive는 하나입니다.",
    "Positive score를 모든 후보 score 합으로 나누어 in-batch 분류 문제를 만듭니다.",
    "작은 temperature는 가까운 후보 차이를 확대하므로 false negative도 더 세게 반영합니다.",
  ] as const;
  return (
    <Scene id="simclr-objective-viz" eyebrow="SimCLR batch" title="Augmentation pair가 NT-Xent 분류 문제로 바뀝니다" description="View·candidate·probability·temperature를 순서대로 봅니다." labels={labels} notes={notes}>
      {(active) => (
        <svg viewBox="0 0 360 210" role="img" aria-label={labels[active]} className="block h-auto w-full">
          <LegacyBox x={14} y={76} w={54} h={48} label="x" detail="source" active={active === 0} />
          <LegacyArrow x1={69} y1={100} x2={98} y2={63} id="sim-a" active={active === 0} />
          <LegacyArrow x1={69} y1={100} x2={98} y2={139} id="sim-b" active={active === 0} />
          <LegacyBox x={102} y={38} w={62} h={44} label="view i" detail="augment A" active={active === 0} />
          <LegacyBox x={102} y={118} w={62} h={44} label="view j" detail="augment B" active={active === 0} />
          <LegacyArrow x1={165} y1={100} x2={190} y2={100} id="sim-c" active={active === 1} />
          <g>
            {[0, 1, 2, 3, 4].map((index) => (
              <circle key={index} cx={215 + (index % 2) * 34} cy={54 + Math.floor(index / 2) * 48} r="15" fill={index === 0 ? legacyAccent : "var(--background)"} fillOpacity={index === 0 ? 0.16 : 1} stroke={active >= 1 ? (index === 0 ? legacyAccent : legacyBorder) : legacyBorder} strokeWidth="1.25" />
            ))}
            <text x="232" y="190" textAnchor="middle" className="fill-muted-foreground text-[10px] sm:text-[8px]">2N−1 candidates</text>
          </g>
          <LegacyArrow x1={270} y1={100} x2={300} y2={100} id="sim-d" active={active === 2} />
          <LegacyBox x={304} y={71} w={46} h={58} label="−log" detail="p(j|i)" active={active === 2} shape="diamond" />
          <motion.circle cx="232" cy="54" r="25" fill="none" stroke={legacyAccent} strokeWidth="1.25" strokeDasharray="4 4" animate={{ opacity: active === 3 ? 1 : 0, scale: active === 3 ? 1.08 : 0.9 }} style={{ transformOrigin: "232px 54px" }} />
          <text x="232" y="22" textAnchor="middle" className="fill-foreground text-[11px] font-bold sm:text-[9px]" opacity={active === 3 ? 1 : 0.42}>τ lens</text>
        </svg>
      )}
    </Scene>
  );
}

export function TripletMiningViz() {
  const labels = ["Unit-vector geometry", "Anchor·positive·negative", "Margin gate", "Versioned miner"] as const;
  const notes = [
    "Unit vector에서는 cosine이 커질수록 squared Euclidean distance가 작아집니다.",
    "Anchor를 기준으로 positive와 negative 거리를 따로 잽니다.",
    "Negative가 positive보다 margin만큼 멀지 않을 때만 hinge loss가 남습니다.",
    "가까운 후보는 label 누락일 수 있으므로 miner·index·filter revision을 함께 저장합니다.",
  ] as const;
  return (
    <Scene id="triplet-mining-viz" eyebrow="Relative geometry" title="거리 조건과 negative mining을 같은 입력 계약으로 봅니다" description="Geometry→triplet→margin→snapshot 흐름입니다." labels={labels} notes={notes}>
      {(active) => (
        <svg viewBox="0 0 360 210" role="img" aria-label={labels[active]} className="block h-auto w-full">
          <circle cx="74" cy="101" r="43" fill="none" stroke={active === 0 ? legacyAccent : legacyBorder} strokeWidth="1.25" />
          <line x1="74" y1="101" x2="105" y2="72" stroke={legacyAccent} strokeWidth="1.25" />
          <line x1="74" y1="101" x2="39" y2="79" stroke={legacyMuted} strokeWidth="1.25" />
          <text x="74" y="163" textAnchor="middle" className="fill-muted-foreground text-[10px] sm:text-[8px]">||z||₂=1</text>
          <LegacyBox x={135} y={78} w={42} h={42} label="a" active={active === 1} shape="circle" />
          <LegacyBox x={205} y={38} w={42} h={42} label="p" active={active === 1} shape="circle" />
          <LegacyBox x={205} y={125} w={42} h={42} label="n" active={active === 1} shape="circle" />
          <line x1="177" y1="91" x2="205" y2="68" stroke={active >= 1 ? legacyAccent : legacyMuted} strokeWidth="1.25" />
          <line x1="177" y1="108" x2="205" y2="138" stroke={active >= 1 ? legacyAccent : legacyMuted} strokeWidth="1.25" />
          <LegacyBox x={268} y={76} w={80} h={50} label="margin" detail="dₙ ≥ dₚ+m" active={active === 2} shape="diamond" />
          <motion.g animate={{ opacity: active === 3 ? 1 : 0.48 }}>
            <rect x="258" y="144" width="94" height="46" rx="5" fill="var(--background)" stroke={active === 3 ? legacyAccent : legacyBorder} strokeWidth="1.25" />
            <text x="305" y="162" textAnchor="middle" className="fill-foreground text-[10px] font-bold sm:text-[8px]">miner receipt</text>
            <text x="305" y="177" textAnchor="middle" className="fill-muted-foreground text-[9px] sm:text-[7px]">encoder·index·filter</text>
          </motion.g>
        </svg>
      )}
    </Scene>
  );
}

export function SupervisedPositiveViz() {
  const labels = ["원본 3개를 view 6개로 펼치기", "Positive set P(A₁)", "여러 log-prob 평균", "One-view 변형의 빈 집합 경계"] as const;
  const notes = [
    "신발 원본 A·B와 가방 원본 C에서 view를 두 개씩 만들면 paired view가 항상 하나 남습니다.",
    "A₁을 빼고 같은 신발 label인 A₂·B₁·B₂를 P(A₁)에 넣습니다.",
    "공통 후보 분모에서 각 positive의 log-probability를 구하고 |P(A₁)|=3으로 나눕니다.",
    "논문의 two-view batch에서는 P(i)가 비지 않습니다. One-view 변형에서만 빈 집합을 검사하고 해당 anchor를 제외합니다.",
  ] as const;
  const points = [[44, 62, "A₁"], [94, 42, "A₂"], [98, 101, "B₁"], [148, 75, "B₂"], [213, 48, "C₁"], [221, 111, "C₂"]] as const;
  return (
    <Scene id="supervised-positive-viz" eyebrow="Multi-positive" title="Class label을 anchor별 positive 집합으로 바꿉니다" description="Two-view batch→P(A₁)→평균→변형의 경계를 봅니다." labels={labels} notes={notes}>
      {(active) => (
        <svg viewBox="0 0 360 210" role="img" aria-label={labels[active]} className="block h-auto w-full">
          <g>
            {points.map(([x, y, text], index) => (
              <g key={text}>
                <circle cx={x} cy={y} r="18" fill={index < 4 ? legacyAccent : "var(--background)"} fillOpacity={index < 4 ? 0.13 : 1} stroke={active === 1 && index > 0 && index < 4 ? legacyAccent : legacyBorder} strokeWidth="1.25" />
                <text x={x} y={y + 4} textAnchor="middle" className="fill-foreground text-[11px] font-bold sm:text-[9px]">{text}</text>
                {active === 1 && index > 0 && index < 4 ? <line x1="44" y1="62" x2={x} y2={y} stroke={legacyAccent} strokeWidth="1.25" strokeDasharray="4 3" /> : null}
              </g>
            ))}
          </g>
          <LegacyArrow x1={247} y1={98} x2={271} y2={98} id="sup-a" active={active === 2} />
          <LegacyBox x={276} y={54} w={72} h={88} label="mean" detail="Σ log p / |P|" active={active === 2} shape="diamond" />
          <motion.g animate={{ opacity: active === 3 ? 1 : 0 }}>
            <rect x="48" y="151" width="208" height="38" fill="var(--background)" stroke={legacyAccent} strokeWidth="1.25" />
            <text x="152" y="166" textAnchor="middle" className="fill-foreground text-[10px] font-bold sm:text-[8px]">one-view custom batch</text>
            <text x="152" y="181" textAnchor="middle" className="fill-muted-foreground text-[9px] sm:text-[7px]">P(i)=∅이면 valid anchor에서 제외</text>
          </motion.g>
        </svg>
      )}
    </Scene>
  );
}

export function ContrastiveEvaluationViz() {
  const labels = ["Miner candidate receipt", "Stratified pair audit", "Paired downstream test", "Revision decision"] as const;
  const notes = [
    "Similarity·domain bucket과 miner revision이 있어야 어떤 negative를 검토했는지 재현됩니다.",
    "각 bucket에서 무작위 표본을 뽑아 hidden positive 비율과 agreement를 계산합니다.",
    "같은 split·seed에서 baseline과 후보 embedding의 실제 task metric을 짝지어 비교합니다.",
    "Pair·augmentation·miner 중 무엇을 고칠지 receipt로 남기고 독립 test를 다시 열지 않습니다.",
  ] as const;
  return (
    <Scene id="contrastive-evaluation-viz" eyebrow="Evidence loop" title="Loss가 아니라 pair 품질과 downstream gain으로 release합니다" description="Candidate→audit→paired test→revision을 연결합니다." labels={labels} notes={notes}>
      {(active) => (
        <svg viewBox="0 0 360 210" role="img" aria-label={labels[active]} className="block h-auto w-full">
          <LegacyBox x={8} y={72} w={74} h={58} label="candidate" detail="bucket·revision" active={active === 0} />
          <LegacyArrow x1={83} y1={101} x2={106} y2={101} id="eval-a" active={active === 1} />
          <LegacyBox x={110} y={66} w={72} h={70} label="pair audit" detail="FN rate" active={active === 1} />
          <LegacyArrow x1={183} y1={101} x2={206} y2={101} id="eval-b" active={active === 2} />
          <LegacyBox x={210} y={66} w={72} h={70} label="paired test" detail="same seed" active={active === 2} />
          <LegacyArrow x1={283} y1={101} x2={304} y2={101} id="eval-c" active={active === 3} />
          <LegacyBox x={308} y={72} w={44} h={58} label="gate" detail="revise" active={active === 3} shape="diamond" />
          <motion.path d="M330 144C280 193 91 193 44 143" fill="none" stroke={legacyAccent} strokeWidth="1.25" strokeDasharray="5 4" initial={false} animate={{ pathLength: active === 3 ? 1 : 0, opacity: active === 3 ? 1 : 0 }} />
          <text x="186" y="188" textAnchor="middle" className="fill-muted-foreground text-[10px] sm:text-[8px]">failure pair → next data revision</text>
        </svg>
      )}
    </Scene>
  );
}
