import { Link } from "react-router-dom";

export type ConsensusRegion =
  | "gossip"
  | "sync"
  | "transition"
  | "fork-choice"
  | "finality"
  | "engine-api"
  | "consensus-store";

type Props = {
  path: readonly ConsensusRegion[];
  current: ConsensusRegion;
  question: string;
};

const regions: ReadonlyArray<{
  id: ConsensusRegion;
  label: string;
  detail: string;
  href: string;
}> = [
  {
    id: "gossip",
    label: "합의 P2P 입력",
    detail: "블록 후보와 투표를 받고 기본 검사를 합니다.",
    href: "/cs/blockchain/prysm-gossipsub",
  },
  {
    id: "sync",
    label: "동기화",
    detail: "빠진 블록과 상태를 찾아 검증 순서에 맞춥니다.",
    href: "/cs/blockchain/prysm-sync",
  },
  {
    id: "transition",
    label: "상태 전이",
    detail: "블록을 적용해 다음 합의 상태를 계산합니다.",
    href: "/cs/blockchain/prysm-block-processing",
  },
  {
    id: "fork-choice",
    label: "가지 선택",
    detail: "유효한 후보 가운데 지금 따를 head를 고릅니다.",
    href: "/cs/blockchain/prysm-forkchoice",
  },
  {
    id: "finality",
    label: "최종성",
    detail: "투표를 모아 justified·finalized 지점을 갱신합니다.",
    href: "/cs/blockchain/prysm-finality",
  },
  {
    id: "engine-api",
    label: "Engine API",
    detail: "EL에 실행 검증을 맡기고 선택한 기록을 전달합니다.",
    href: "/cs/blockchain/prysm-engine-api",
  },
  {
    id: "consensus-store",
    label: "합의 저장소",
    detail: "블록·상태·투표와 선택 결과를 복구 가능하게 남깁니다.",
    href: "/cs/blockchain/prysm-beacon-db",
  },
];

function Region({
  id,
  label,
  detail,
  href,
  path,
  current,
}: {
  id: ConsensusRegion;
  label: string;
  detail: string;
  href: string;
  path: readonly ConsensusRegion[];
  current: ConsensusRegion;
}) {
  const selected = path.includes(id);
  const isCurrent = current === id;
  const body = (
    <>
      <p className="text-xs font-bold leading-5 text-foreground">
        {label}{isCurrent ? <span className="ml-1 text-[9px] text-primary">현재</span> : null}
      </p>
      <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground sm:text-[11px] sm:leading-5">{detail}</p>
    </>
  );

  return isCurrent ? (
    <div
      data-consensus-region={id}
      data-active="true"
      aria-current="location"
      className="min-w-0 border-l-4 border-primary bg-primary/[0.08] px-3 py-2.5"
    >
      {body}
    </div>
  ) : (
    <Link
      to={href}
      data-consensus-region={id}
      data-active={selected ? "true" : "false"}
      className={`min-w-0 border-l-2 px-3 py-2.5 ${
        selected
          ? "border-primary bg-primary/[0.055]"
          : "border-border bg-background"
      }`}
    >
      {body}
    </Link>
  );
}

export default function ConsensusClientLocator({ path, current, question }: Props) {
  const byId = new Map(regions.map((region) => [region.id, region]));
  const render = (id: ConsensusRegion) => {
    const region = byId.get(id);
    if (!region) return null;
    return <Region key={id} {...region} path={path} current={current} />;
  };

  return (
    <aside
      className="not-prose mb-8 border border-border bg-muted/[0.09] p-3 sm:p-4"
      aria-label="합의 클라이언트 내부에서 현재 글의 위치"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold text-primary">
            이더리움 노드 → 합의 클라이언트 → 현재 메커니즘
          </p>
          <p className="mt-1 text-sm font-bold leading-6">{question}</p>
        </div>
        <Link
          to="/cs/blockchain/node-architecture#deeper"
          className="inline-flex min-h-11 items-center border-b border-border px-2 text-[11px] font-semibold hover:border-primary hover:text-primary"
        >
          한 단계 위로 <span className="ml-1" aria-hidden="true">↑</span>
        </Link>
      </div>

      <div className="mt-4 grid gap-2 lg:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)] lg:items-stretch">
        <div className="grid gap-2">
          {render("gossip")}
          {render("sync")}
        </div>
        <div className="hidden items-center justify-center text-muted-foreground lg:flex" aria-hidden="true">→</div>
        <div className="grid gap-2">
          {render("transition")}
          {render("engine-api")}
        </div>
        <div className="hidden items-center justify-center text-muted-foreground lg:flex" aria-hidden="true">→</div>
        <div className="grid gap-2">
          {render("fork-choice")}
          {render("finality")}
        </div>
      </div>

      <div className="mt-2 border-t border-border pt-2">
        {render("consensus-store")}
      </div>

      <p className="mt-3 text-[10px] leading-4 text-muted-foreground sm:text-[11px] sm:leading-5">
        굵은 선은 지금 읽는 영역, 옅은 배경은 같은 요청이 지나는 경로입니다. 실제 패키지와 프로세스 경계는 클라이언트와 버전에 따라 달라질 수 있습니다.
      </p>
    </aside>
  );
}
