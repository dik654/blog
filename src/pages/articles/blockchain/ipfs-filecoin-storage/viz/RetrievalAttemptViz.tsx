import SceneShell from "./SceneShell";

/**
 * 본문 대응: #retrieve-path 첫 두 문단 — 후보 목록은 보장이 아니고, router가 정해진 순서로
 * 경로를 시도하며, HTTP 200이어도 multihash가 CID와 다르면 실패로 기록한다.
 * 각 경로의 결과(없음 · CID 불일치 · 일치)는 장면을 보이려는 가정이다.
 */
type Status = "wait" | "try" | "miss" | "bad" | "ok";

const PATHS = [
  { name: "local blockstore", sub: "내 node 안" },
  { name: "IPFS peer · gateway", sub: "provider 후보에게 요청" },
  { name: "별도 retrieval path", sub: "다른 전송 경로" },
] as const;

const STATUS_TEXT: Record<Status, string> = {
  wait: "대기",
  try: "시도 중",
  miss: "block 없음 → 다음 경로",
  bad: "HTTP 200 · CID 불일치 → 실패",
  ok: "CID 일치 → 성공",
};

const STATUS_COLOR: Record<Status, string> = {
  wait: "#94a3b8",
  try: "#2563eb",
  miss: "#64748b",
  bad: "#dc2626",
  ok: "#16a34a",
};

const STATES: readonly (readonly Status[])[] = [
  ["wait", "wait", "wait"],
  ["miss", "wait", "wait"],
  ["miss", "bad", "wait"],
  ["miss", "bad", "ok"],
];

const SCENES = [
  {
    label: "후보 목록을 받습니다",
    summary: "filter 통과 ≠ 전송 보장",
    note: "Delegated routing이나 DHT는 이 CID를 제공한다고 광고한 peer 후보를 돌려줍니다. 주소·transfer protocol filter를 통과했어도 연결·전송·무결성은 아직 아무것도 확인되지 않았습니다.",
  },
  {
    label: "첫 경로: local blockstore",
    summary: "(가정) block 없음",
    note: "Router는 정해진 timeout 순서로 경로를 시도합니다. 이 예에서는 내 node에 block이 없다고 가정했습니다. 시도마다 route, 시간, byte 수와 실패 원인을 한 줄씩 남깁니다.",
  },
  {
    label: "둘째 경로: peer · gateway",
    summary: "(가정) 200 OK인데 CID 불일치",
    note: "Gateway가 HTTP 200과 byte를 돌려줬지만 받은 block의 multihash가 요청한 CID와 다릅니다(가정). 응답 코드가 성공이어도 이 시도는 실패로 기록하고 다음 경로로 넘어갑니다.",
  },
  {
    label: "셋째 경로: 별도 retrieval path",
    summary: "(가정) CID 재계산 일치",
    note: "받은 byte로 CID를 다시 계산해 요청한 CID와 같을 때만 성공으로 기록합니다. 기록에는 앞의 두 실패도 원인과 함께 남습니다.",
  },
] as const;

export default function RetrievalAttemptViz() {
  return (
    <SceneShell
      eyebrow="후보 탐색과 실제 수신"
      title="후보를 찾은 뒤에도 경로마다 따로 시도하고 검증합니다"
      description="한 줄이 retrieval 경로 하나입니다. 위에서 아래로 정해진 순서대로 시도한다고 둡니다(순서와 각 결과는 가정)."
      note="경로별 결과는 시도 기록이 어떻게 쌓이는지 보이려는 예시입니다. 실제 순서와 timeout은 router 설정이 정합니다."
      ariaLabel="provider 후보를 받은 뒤 local blockstore, peer·gateway, 별도 경로를 차례로 시도하고 CID로 검증하는 장면"
      scenes={SCENES}
      render={(active) => {
        const row = STATES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div
              className={`rounded-lg border px-3 py-2 text-xs leading-5 ${active === 0 ? "border-[#2563eb]" : "border-border"}`}
            >
              <span className="font-semibold">routing 응답</span>
              <span className="text-muted-foreground">
                {" "}
                · CID를 제공한다고 광고한 peer 후보 (주소·protocol filter 통과)
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_13rem]">
              <ol className="space-y-2">
                {PATHS.map((path, index) => {
                  const status = row[index];
                  const color = STATUS_COLOR[status];
                  return (
                    <li
                      key={path.name}
                      className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-start gap-2 rounded-lg border px-3 py-2"
                      style={{
                        borderColor: status === "wait" ? undefined : color,
                      }}
                    >
                      <span
                        className="mt-0.5 grid size-5 place-items-center rounded-full border font-mono text-[10px] font-bold"
                        style={{ borderColor: color, color }}
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                          <span className="text-sm font-semibold">
                            {path.name}
                          </span>
                          <span
                            className="text-xs font-semibold"
                            style={{ color }}
                          >
                            {STATUS_TEXT[status]}
                          </span>
                        </div>
                        <p className="text-[11px] leading-5 text-muted-foreground">
                          {path.sub}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <div className="rounded-lg border border-dashed border-border px-3 py-2 text-[11px] leading-5 text-muted-foreground">
                <p className="font-semibold text-foreground">
                  시도 기록 (route · 시간 · byte 수 · 결과)
                </p>
                {row.map((status, index) => (
                  <p key={PATHS[index].name} className="font-mono">
                    {index + 1}.{" "}
                    {index < active
                      ? status === "ok"
                        ? "성공 · CID 검증 통과"
                        : status === "bad"
                          ? "실패 · 원인: CID 불일치"
                          : "실패 · 원인: block 없음"
                      : "—"}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
