import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import {
  TRIPLET_MARGIN_FIXTURE,
  UNIT_GEOMETRY_FIXTURE,
} from "./calculations";

type SceneProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  labels: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
};

function Scene({
  id,
  eyebrow,
  title,
  description,
  labels,
  notes,
  children,
}: SceneProps) {
  const controls = useAnimatedScenes(labels.length, 6800, {
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
            <li
              key={label}
              className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)]"
            >
              <strong>{index + 1}. {label}</strong>
              <span className="text-muted-foreground">{notes[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}

function RoleNode({
  code,
  role,
  detail,
  active,
}: {
  code: string;
  role: string;
  detail: string;
  active: boolean;
}) {
  return (
    <div
      className={`min-w-0 border-y px-3 py-4 transition-colors sm:px-4 ${
        active
          ? "border-primary/70 bg-primary/10"
          : "border-border bg-background"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <strong className="font-mono text-base">{code}</strong>
        <span className="text-[9px] font-black text-primary">{role}</span>
      </div>
      <span className="mt-2 block break-keep text-xs leading-5 text-muted-foreground">
        {detail}
      </span>
    </div>
  );
}

export function TripletRoleViz() {
  const labels = [
    "A₁을 비교의 기준으로 둡니다",
    "같은 상품 A₂의 거리를 잽니다",
    "다른 상품 D₁의 거리를 잽니다",
    "두 거리의 차이가 margin을 넘는지 봅니다",
  ] as const;
  const notes = [
    "Anchor는 두 관계가 만나는 기준입니다. Positive와 negative 사이의 거리를 직접 비교하는 식이 아닙니다.",
    "A₁과 A₂는 같은 SKU-42이므로 가까워져야 하는 positive pair입니다. 설명용 squared distance는 0.4입니다.",
    "D₁은 다른 상품으로 확인된 negative입니다. Anchor A₁까지의 설명용 squared distance는 0.5입니다.",
    "Negative 거리 0.5는 positive 거리 0.4보다 크지만, 필요한 margin 0.2를 모두 확보하지 못했습니다. 부족한 0.1이 loss로 남습니다.",
  ] as const;

  return (
    <Scene
      id="triplet-roles"
      eyebrow="One triplet"
      title="세 sample을 놓고 anchor에서 출발한 두 거리만 비교합니다"
      description="A₁→A₂와 A₁→D₁을 차례로 따라가면 triplet의 세 자리가 보입니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div role="img" aria-label={notes[active]}>
          <RoleNode
            code="A₁"
            role="ANCHOR"
            detail="SKU-42 정면 사진 · 거리 비교의 기준"
            active={active === 0 || active === 3}
          />
          <div className="grid gap-3 py-3 sm:grid-cols-2">
            <div className="min-w-0">
              <div className={`flex items-center gap-2 py-2 text-[10px] ${active >= 1 ? "font-bold text-primary" : "text-muted-foreground"}`}>
                <span className={`h-px flex-1 ${active >= 1 ? "bg-primary" : "bg-border"}`} />
                d² = 0.4
              </div>
              <RoleNode
                code="A₂"
                role="POSITIVE"
                detail="같은 SKU-42 측면 사진 · 가까워질 대상"
                active={active === 1 || active === 3}
              />
            </div>
            <div className="min-w-0">
              <div className={`flex items-center gap-2 py-2 text-[10px] ${active >= 2 ? "font-bold text-primary" : "text-muted-foreground"}`}>
                <span className={`h-px flex-1 ${active >= 2 ? "bg-primary" : "bg-border"}`} />
                d² = 0.5
              </div>
              <RoleNode
                code="D₁"
                role="NEGATIVE"
                detail="다른 상품 사진 · 멀어질 대상"
                active={active === 2 || active === 3}
              />
            </div>
          </div>
          <div className={`grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-y px-3 py-3 text-center text-xs transition-colors ${active === 3 ? "border-primary/70 bg-primary/10" : "border-border"}`}>
            <span className="font-mono">0.4</span>
            <strong className="break-keep">+ margin 0.2 ≤</strong>
            <span className="font-mono">0.5 · 위반 0.1</span>
          </div>
        </div>
      )}
    </Scene>
  );
}

export function UnitGeometryViz() {
  const labels = [
    "두 embedding의 길이를 1로 맞춥니다",
    "방향의 cosine을 0.8로 둡니다",
    "차이 제곱을 norm과 내적으로 펼칩니다",
    "1+1−2×0.8을 계산합니다",
  ] as const;
  const notes = [
    "L2 정규화한 anchor와 positive는 원점에서 unit circle 위의 점으로 끝납니다.",
    "Anchor (1,0)과 positive (0.8,0.6)의 내적은 0.8입니다. 둘 다 unit vector이므로 이 내적이 cosine similarity입니다.",
    "||a−p||²를 전개하면 ||a||²+||p||²−2aᵀp가 됩니다. 길이를 1로 고정했기 때문에 앞의 두 항은 1+1입니다.",
    "Squared distance는 2−2×0.8=0.4입니다. 정규화하지 않으면 norm 항이 1이 아니므로 이 축약은 성립하지 않습니다.",
  ] as const;

  return (
    <Scene
      id="triplet-unit-geometry"
      eyebrow="Unit geometry"
      title="Cosine 0.8을 squared distance 0.4로 바꿉니다"
      description="같은 두 unit vector를 방향과 끝점 거리로 한 번씩 읽습니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div role="img" aria-label={notes[active]} className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-center">
          <svg viewBox="0 0 330 220" className="block h-auto w-full" aria-hidden="true">
            <circle cx="120" cy="116" r="76" fill="none" stroke="var(--border)" strokeWidth="1.25" />
            <line x1="38" y1="116" x2="208" y2="116" stroke="var(--border)" strokeWidth="1" />
            <line x1="120" y1="198" x2="120" y2="30" stroke="var(--border)" strokeWidth="1" />
            <line x1="120" y1="116" x2="196" y2="116" stroke="var(--primary)" strokeWidth="1.25" />
            <line x1="120" y1="116" x2="181" y2="70" stroke={active >= 1 ? "var(--primary)" : "var(--muted-foreground)"} strokeWidth="1.25" />
            <line x1="196" y1="116" x2="181" y2="70" stroke={active >= 2 ? "var(--primary)" : "var(--border)"} strokeWidth="1.25" strokeDasharray="5 4" />
            <circle cx="196" cy="116" r="5" fill="var(--primary)" />
            <circle cx="181" cy="70" r="5" fill="var(--primary)" />
            <text x="204" y="134" className="fill-foreground text-[12px] font-bold">a=(1,0)</text>
            <text x="188" y="55" className="fill-foreground text-[12px] font-bold">p=(0.8,0.6)</text>
            <path d="M151 116 A31 31 0 0 0 145 97" fill="none" stroke="var(--muted-foreground)" strokeWidth="1.25" />
            <text x="154" y="94" className={`text-[11px] font-bold ${active >= 1 ? "fill-primary" : "fill-muted-foreground"}`}>cos=0.8</text>
            <text x="199" y="91" className={`text-[11px] font-bold ${active >= 2 ? "fill-primary" : "fill-muted-foreground"}`}>d²=0.4</text>
          </svg>
          <div className="border-y border-border py-3 font-mono text-xs leading-7 sm:text-sm">
            <div className={active >= 2 ? "font-bold text-primary" : "text-muted-foreground"}>||a−p||²</div>
            <div className={active >= 2 ? "font-bold text-primary" : "text-muted-foreground"}>= ||a||² + ||p||² − 2aᵀp</div>
            <div className={active === 3 ? "font-bold text-primary" : "text-muted-foreground"}>= 1 + 1 − 2×{UNIT_GEOMETRY_FIXTURE.cosine}</div>
            <div className={active === 3 ? "font-bold text-primary" : "text-muted-foreground"}>= {UNIT_GEOMETRY_FIXTURE.squaredDistance}</div>
          </div>
        </div>
      )}
    </Scene>
  );
}

export function TripletMarginViz() {
  const labels = [
    "Positive 거리와 margin 경계를 고정합니다",
    "C₁은 positive보다 가까운 hard negative입니다",
    "D₁은 margin 안의 semi-hard negative입니다",
    "E₁은 margin 밖이라 loss가 0입니다",
  ] as const;
  const notes = [
    "Positive squared distance는 0.4이고 margin은 0.2입니다. Negative가 0.6 이상이면 이 triplet의 loss는 0입니다.",
    "C₁의 squared distance 0.3은 positive 0.4보다도 작습니다. Loss는 0.3이지만 FaceNet의 semi-hard 조건은 만족하지 않습니다.",
    "D₁의 0.5는 0.4보다 크고 0.6보다 작습니다. Positive보다 멀지만 margin을 다 채우지 못해 loss 0.1을 남깁니다.",
    "E₁의 0.9는 0.6을 넘습니다. 이미 요구한 순서를 만족하므로 hinge가 음수를 0으로 잘라 loss를 남기지 않습니다.",
  ] as const;
  const visibleCandidates = TRIPLET_MARGIN_FIXTURE.candidates.filter(
    (candidate) => candidate.legalNegative,
  );

  return (
    <Scene
      id="triplet-margin"
      eyebrow="Margin gate"
      title="0.4와 0.6 사이의 D₁만 semi-hard 조건을 만족합니다"
      description="한 distance convention 안에서 hard·semi-hard·easy를 비교합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div role="img" aria-label={notes[active]}>
          <div className="grid grid-cols-[3.2rem_minmax(0,1fr)_3.4rem] items-center gap-x-2 gap-y-3 text-xs">
            <span />
            <div className="relative h-8 border-y border-border">
              <div className="absolute inset-y-0 left-0 w-[40%] bg-destructive/10" />
              <div className="absolute inset-y-0 left-[40%] w-[20%] bg-primary/10" />
              <div className="absolute inset-y-0 left-[60%] right-0 bg-muted/35" />
              <span className="absolute left-[40%] top-full mt-1 -translate-x-1/2 font-mono text-[9px] text-muted-foreground">d²p 0.4</span>
              <span className="absolute left-[60%] top-full mt-1 -translate-x-1/2 font-mono text-[9px] text-muted-foreground">0.6</span>
            </div>
            <span className="text-right text-[9px] text-muted-foreground">loss</span>
            {visibleCandidates.map((candidate, index) => {
              const isActive = active === index + 1;
              return (
                <div key={candidate.id} className="contents">
                  <strong className={`font-mono ${isActive ? "text-primary" : ""}`}>{candidate.id}</strong>
                  <div className="relative h-7 border-y border-border bg-background">
                    <div
                      className={`absolute inset-y-1 left-0 transition-colors ${isActive ? "bg-primary" : "bg-muted-foreground/35"}`}
                      style={{ width: `${candidate.squaredDistance * 100}%` }}
                    />
                    <span
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] font-bold text-background"
                      style={{ left: `${Math.min(candidate.squaredDistance * 100, 95)}%` }}
                    >
                      {candidate.squaredDistance}
                    </span>
                  </div>
                  <span className={`text-right font-mono ${isActive ? "font-bold text-primary" : "text-muted-foreground"}`}>{candidate.loss}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-8 grid grid-cols-3 gap-px bg-border p-px text-center text-[10px] sm:text-xs">
            <div className={`bg-background px-2 py-3 ${active === 1 ? "text-primary" : "text-muted-foreground"}`}><strong className="block">hard</strong><span>d²n ≤ 0.4</span></div>
            <div className={`bg-background px-2 py-3 ${active === 2 ? "text-primary" : "text-muted-foreground"}`}><strong className="block">semi-hard</strong><span>0.4 &lt; d²n &lt; 0.6</span></div>
            <div className={`bg-background px-2 py-3 ${active === 3 ? "text-primary" : "text-muted-foreground"}`}><strong className="block">easy</strong><span>d²n ≥ 0.6</span></div>
          </div>
        </div>
      )}
    </Scene>
  );
}

export function MiningFunnelViz() {
  const labels = [
    "후보 네 개를 같은 anchor에 붙입니다",
    "실제 positive B₁을 관계 필터로 뺍니다",
    "남은 negative를 거리 구간으로 나눕니다",
    "Semi-hard D₁과 선택 조건을 함께 남깁니다",
  ] as const;
  const notes = [
    "Candidate pool에서 B₁·C₁·D₁·E₁ 네 개를 찾았습니다. 가까운 순서만으로는 아직 negative를 고를 수 없습니다.",
    "B₁은 catalog ID가 달라도 같은 SKU-42입니다. 거리가 0.35로 가깝다는 이유로 negative로 쓰면 정답을 밀어내므로 먼저 제외합니다.",
    "합법적인 negative 세 개를 positive 거리 0.4와 margin 경계 0.6으로 분류하면 hard 1개, semi-hard 1개, easy 1개가 됩니다.",
    "FaceNet의 설명용 semi-hard 규칙에서는 D₁을 고릅니다. 같은 결과를 재현하려면 선택 당시 encoder, candidate pool, 관계 필터와 margin을 함께 알아야 합니다.",
  ] as const;

  return (
    <Scene
      id="triplet-mining-funnel"
      eyebrow="Candidate funnel"
      title="네 후보를 만들고, 관계를 확인한 뒤, 난이도로 하나를 고릅니다"
      description="생성→관계 필터→난이도 판정→선택은 서로 다른 일입니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div role="img" aria-label={notes[active]}>
          <div className="grid grid-cols-4 gap-px bg-border p-px text-center text-[9px] sm:text-[11px]">
            {[
              ["생성", String(TRIPLET_MARGIN_FIXTURE.generatedCount)],
              ["관계 통과", active >= 1 ? String(TRIPLET_MARGIN_FIXTURE.legalCount) : "—"],
              ["semi-hard", active >= 2 ? String(TRIPLET_MARGIN_FIXTURE.semiHardCount) : "—"],
              ["선택", active >= 3 ? "D₁" : "—"],
            ].map(([label, value], index) => (
              <div key={label} className={`min-w-0 bg-background px-1 py-3 sm:px-3 ${active === index ? "text-primary" : ""}`}>
                <span className="block break-keep text-muted-foreground">{label}</span>
                <strong className="mt-1 block font-mono text-sm sm:text-base">{value}</strong>
              </div>
            ))}
          </div>
          <div className="mt-4 divide-y divide-border border-y border-border">
            {TRIPLET_MARGIN_FIXTURE.candidates.map((candidate) => {
              const filtered = active >= 1 && !candidate.legalNegative;
              const selected = active >= 3 && candidate.id === TRIPLET_MARGIN_FIXTURE.selected;
              return (
                <div
                  key={candidate.id}
                  className={`grid grid-cols-[2.5rem_minmax(0,1fr)_4.5rem] items-center gap-2 px-2 py-3 text-xs transition-colors sm:grid-cols-[3rem_minmax(0,1fr)_6rem] sm:px-3 ${selected ? "bg-primary/10" : ""} ${filtered ? "opacity-45" : ""}`}
                >
                  <strong className={selected ? "font-mono text-primary" : "font-mono"}>{candidate.id}</strong>
                  <span className="min-w-0 break-keep text-muted-foreground">
                    d²={candidate.squaredDistance} · {active >= 2 && candidate.legalNegative ? candidate.difficulty : candidate.relation === "hidden-positive" ? "같은 SKU-42" : "다른 상품"}
                  </span>
                  <span className={`text-right text-[9px] font-bold sm:text-[10px] ${selected ? "text-primary" : "text-muted-foreground"}`}>
                    {filtered ? "제외" : selected ? "선택" : active >= 2 ? candidate.difficulty : "후보"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className={`mt-4 border-y px-3 py-3 text-[10px] leading-5 transition-colors sm:text-xs ${active === 3 ? "border-primary/70 bg-primary/10" : "border-border text-muted-foreground"}`}>
            <strong className="mr-2 text-foreground">선택 기록</strong>
            encoder snapshot · candidate pool snapshot · relation filter · squared distance · margin 0.2 · selected D₁
          </div>
        </div>
      )}
    </Scene>
  );
}
