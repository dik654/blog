import { Link } from "react-router-dom";

const MODEL_CASES = [
  {
    id: "motif",
    label: "Motif 3",
    detail: "저장·선택·전달·전문가 계산을 한 모델에서 조립",
    href: "/cs/ai/motif-3-architecture",
    parentHref: "/cs/ai/transformer-architecture",
    parentLabel: "Transformer의 attention·residual·MLP 뼈대",
    question: "여러 구조 변경이 한 모델에 함께 들어갔을 때 각 장치의 역할과 근거를 어떻게 분리해 읽을까요?",
    closure: "Motif 3는 GDLA·modified mHC·PolyNorm·MOPD를 서로 다른 병목의 해법으로 나눠 본 뒤, 통합 모델의 결과와 다시 구분해 읽어야 합니다.",
  },
  {
    id: "kimi",
    label: "Kimi K3",
    detail: "sequence·depth·width 세 축으로 전체 구조를 분해",
    href: "/cs/ai/kimi-k3-architecture",
    parentHref: "/cs/ai/transformer-architecture",
    parentLabel: "Transformer의 attention·residual·MLP 뼈대",
    question: "2.8T라는 크기보다 먼저, token의 정보가 이동하는 세 방향을 어떻게 나눠 볼까요?",
    closure: "Kimi K3는 과거 token을 읽는 sequence, 이전 layer를 읽는 depth, expert를 고르는 width를 별도 축으로 나눠야 전체 구조가 보입니다.",
  },
  {
    id: "sequence",
    label: "Sequence",
    detail: "KDA state와 MLA token memory",
    href: "/cs/ai/kimi-k3-sequence-mixer",
    parentHref: "/cs/ai/kimi-k3-architecture#axes",
    parentLabel: "Kimi K3의 세 정보 이동 축",
    question: "과거 token 전체를 저장하는 대신 고정 크기 state를 고쳐 쓰면 무엇을 얻고 무엇을 잃을까요?",
    closure: "KDA는 예측 오차만 state에 고쳐 쓰고, 주기적인 MLA가 직접 token 조회를 보강합니다. 고정 state의 충돌과 MLA cache 비용은 함께 남습니다.",
  },
  {
    id: "depth",
    label: "Depth",
    detail: "이전 block 가운데 현재 layer가 읽을 source 선택",
    href: "/cs/ai/kimi-k3-depth-routing",
    parentHref: "/cs/ai/kimi-k3-architecture#axes",
    parentLabel: "Kimi K3의 세 정보 이동 축",
    question: "현재 layer가 직전 state만 받지 않고 앞선 depth 표현을 골라 읽으려면 어떤 상태와 비용이 추가될까요?",
    closure: "Depth attention은 이전 표현에 key와 value를 붙여 가중합하고, Block AttnRes는 오래 보관할 source 수를 제한합니다.",
  },
  {
    id: "width",
    label: "Width",
    detail: "선택된 expert만 latent 폭에서 계산",
    href: "/cs/ai/kimi-k3-latent-moe",
    parentHref: "/cs/ai/kimi-k3-architecture#axes",
    parentLabel: "Kimi K3의 세 정보 이동 축",
    question: "Expert 수를 늘리면서 token당 계산 폭과 activation·부하 불균형을 어떻게 따로 관리할까요?",
    closure: "LatentMoE는 routed path의 폭을 줄이고, SiTU·RMSNorm·Quantile Balancing이 activation 크기와 expert 부하를 별도로 다룹니다.",
  },
] as const;

type ModelCaseId = (typeof MODEL_CASES)[number]["id"];

const PREREQUISITES = {
  motif: [
    ["KV 압축", "/cs/ai/multi-head-latent-attention-mechanics"],
    ["차분 attention", "/cs/ai/differential-attention"],
    ["Residual 확장", "/cs/ai/hyper-connections-residual-streams"],
    ["MoE routing", "/cs/ai/moe-routing-and-load-balancing"],
  ],
  kimi: [
    ["고정 state", "/cs/ai/fast-weight-memory-and-chunkwise-recurrence"],
    ["Residual 확장", "/cs/ai/hyper-connections-residual-streams"],
    ["MoE routing", "/cs/ai/moe-routing-and-load-balancing"],
  ],
  sequence: [["고정 state", "/cs/ai/fast-weight-memory-and-chunkwise-recurrence"]],
  depth: [["Residual 확장", "/cs/ai/hyper-connections-residual-streams"]],
  width: [["MoE routing", "/cs/ai/moe-routing-and-load-balancing"]],
} as const satisfies Record<ModelCaseId, readonly (readonly [string, string])[]>;

function CaseLink({ id, current }: { id: ModelCaseId; current: ModelCaseId }) {
  const node = MODEL_CASES.find((candidate) => candidate.id === id)!;
  return (
    <Link
      to={node.href}
      aria-current={id === current ? "step" : undefined}
      className={`block min-w-0 border-l-2 py-2 pl-3 pr-2 ${
        id === current
          ? "border-primary text-foreground"
          : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
      }`}
    >
      <strong className="block break-keep text-xs leading-5">{node.label}</strong>
      <span className="mt-0.5 block text-[10px] leading-4">{node.detail}</span>
    </Link>
  );
}

export function ModelArchitectureCaseLocator({ current }: { current: ModelCaseId }) {
  const node = MODEL_CASES.find((candidate) => candidate.id === current)!;
  const currentIndex = MODEL_CASES.findIndex((candidate) => candidate.id === current);

  return (
    <aside className="not-prose mb-8 border-y border-border py-4 sm:py-5" aria-label="LLM 모델 구조 사례 지도에서 현재 글의 위치">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai/transformer-architecture" className="hover:text-primary">Transformer</Link>
        <span aria-hidden>›</span>
        <span>모델별 조립</span>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">{node.label}</strong>
      </nav>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
        <div className="min-w-0">
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span>
          <p className="mt-2 max-w-3xl break-keep text-sm font-bold leading-6 sm:text-base sm:leading-7">{node.question}</p>
          <p className="mt-1 max-w-3xl text-[11px] leading-5 text-muted-foreground sm:text-xs sm:leading-6">{node.closure}</p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모</p>
          <Link to={node.parentHref} className="mt-0.5 block break-keep text-xs font-bold leading-5 hover:text-primary sm:text-sm sm:leading-6">{node.parentLabel} ↗</Link>
        </div>
      </div>

      <div className="mt-3 border-t border-border pt-3" aria-label="모델 구조 사례의 분기">
        <p className="mb-1 text-[9px] font-bold text-muted-foreground">같은 Transformer 뼈대에서 갈라지는 두 조립 사례</p>
        <div className="grid grid-cols-2 gap-3">
          <CaseLink id="motif" current={current} />
          <div>
            <CaseLink id="kimi" current={current} />
            <div className="ml-3 mt-1 grid grid-cols-1 gap-1 border-l border-border pl-3 sm:grid-cols-3">
              <CaseLink id="sequence" current={current} />
              <CaseLink id="depth" current={current} />
              <CaseLink id="width" current={current} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 border-t border-border pt-3">
        <p className="text-[9px] font-bold text-muted-foreground">먼저 연결할 메커니즘</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] leading-5">
          {PREREQUISITES[current].map(([label, href]) => (
            <Link key={href} to={href} className="border-b border-border hover:border-primary hover:text-primary">{label} ↗</Link>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-1 text-[11px] leading-4 sm:text-xs sm:leading-5">
        {currentIndex > 0 ? (
          <Link to={MODEL_CASES[currentIndex - 1].href} className="border-b border-border py-2 hover:border-primary hover:text-primary">
            <span className="block text-[10px] text-muted-foreground">← 이전</span>
            <strong>{MODEL_CASES[currentIndex - 1].label}</strong>
          </Link>
        ) : <span aria-hidden />}
        {currentIndex < MODEL_CASES.length - 1 ? (
          <Link to={MODEL_CASES[currentIndex + 1].href} className="border-b border-border py-2 text-right hover:border-primary hover:text-primary">
            <span className="block text-[10px] text-muted-foreground">다음 →</span>
            <strong>{MODEL_CASES[currentIndex + 1].label}</strong>
          </Link>
        ) : <span aria-hidden />}
      </div>
    </aside>
  );
}

export function ModelArchitectureCaseMapReturn({ current }: { current: ModelCaseId }) {
  const node = MODEL_CASES.find((candidate) => candidate.id === current)!;
  const currentIndex = MODEL_CASES.findIndex((candidate) => candidate.id === current);
  const next = MODEL_CASES[currentIndex + 1];
  return (
    <aside className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 LLM 모델 구조 사례 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{node.closure}</p>
      <Link to={next?.href ?? "/cs/ai/kimi-k3-architecture"} className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">
        {next ? `${next.label}로 이어가기` : "Kimi K3 전체 지도에서 세 축 다시 보기"} →
      </Link>
    </aside>
  );
}
