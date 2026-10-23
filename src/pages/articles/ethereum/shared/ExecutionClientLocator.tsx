import { Link } from "react-router-dom";

export type ExecutionRegion =
  | "p2p"
  | "sync"
  | "txpool"
  | "execution"
  | "engine-api"
  | "provider"
  | "json-rpc"
  | "execution-store";

type Props = {
  path: readonly ExecutionRegion[];
  current: ExecutionRegion;
  question: string;
};

const regions: ReadonlyArray<{
  id: ExecutionRegion;
  label: string;
  detail: string;
  href: string;
}> = [
  {
    id: "p2p",
    label: "실행 P2P",
    detail: "피어를 검증하고 거래·블록 자료를 주고받습니다.",
    href: "/cs/blockchain/reth-net",
  },
  {
    id: "sync",
    label: "동기화",
    detail: "빠진 블록과 상태를 확보해 live 실행 경로로 넘깁니다.",
    href: "/cs/blockchain/reth-sync",
  },
  {
    id: "txpool",
    label: "거래 대기열",
    detail: "아직 블록에 들지 않은 거래를 검증하고 보관합니다.",
    href: "/cs/blockchain/reth-txpool",
  },
  {
    id: "execution",
    label: "EVM 실행",
    detail: "부모 상태에 거래를 적용해 새 상태와 영수증을 계산합니다.",
    href: "/cs/blockchain/reth-block-execution",
  },
  {
    id: "engine-api",
    label: "Engine API",
    detail: "CL이 보낸 후보를 검증하고 선택된 기록을 반영합니다.",
    href: "/cs/blockchain/node-architecture#payload-state",
  },
  {
    id: "provider",
    label: "Provider",
    detail: "DB와 메모리 상태를 한 시점의 읽기 결과로 묶습니다.",
    href: "/cs/blockchain/reth-provider",
  },
  {
    id: "json-rpc",
    label: "JSON-RPC",
    detail: "지갑과 애플리케이션의 제출·조회 요청을 받습니다.",
    href: "/cs/blockchain/reth-rpc",
  },
  {
    id: "execution-store",
    label: "실행 저장소",
    detail: "블록·계정 상태·영수증과 인덱스를 남깁니다.",
    href: "/cs/blockchain/reth-db",
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
  id: ExecutionRegion;
  label: string;
  detail: string;
  href: string;
  path: readonly ExecutionRegion[];
  current: ExecutionRegion;
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
      data-execution-region={id}
      data-active="true"
      aria-current="location"
      className="min-w-0 border-l-4 border-primary bg-primary/[0.08] px-3 py-2.5"
    >
      {body}
    </div>
  ) : (
    <Link
      to={href}
      data-execution-region={id}
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

export default function ExecutionClientLocator({ path, current, question }: Props) {
  const byId = new Map(regions.map((region) => [region.id, region]));
  const render = (id: ExecutionRegion) => {
    const region = byId.get(id);
    if (!region) return null;
    return <Region key={id} {...region} path={path} current={current} />;
  };

  return (
    <aside
      className="not-prose mb-8 border border-border bg-muted/[0.09] p-3 sm:p-4"
      aria-label="실행 클라이언트 내부에서 현재 글의 위치"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold text-primary">
            이더리움 노드 → 실행 클라이언트 → 현재 메커니즘
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
          {render("p2p")}
          {render("json-rpc")}
        </div>
        <div className="hidden items-center justify-center text-muted-foreground lg:flex" aria-hidden="true">→</div>
        <div className="grid gap-2">
          {render("sync")}
          {render("txpool")}
          {render("engine-api")}
        </div>
        <div className="hidden items-center justify-center text-muted-foreground lg:flex" aria-hidden="true">→</div>
        <div className="grid gap-2">
          {render("execution")}
          {render("provider")}
        </div>
      </div>

      <div className="mt-2 border-t border-border pt-2">
        {render("execution-store")}
      </div>

      <p className="mt-3 text-[10px] leading-4 text-muted-foreground sm:text-[11px] sm:leading-5">
        굵은 선은 지금 읽는 영역, 옅은 배경은 같은 요청이 지나는 경로입니다. 실제 crate·service·task 경계는 구현과 버전에 따라 달라질 수 있습니다.
      </p>
    </aside>
  );
}
