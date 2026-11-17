import SceneShell from "./SceneShell";

/**
 * 본문 대응: #streams flow-control 식.
 * stream credit M_s − o_s = 1,000 B, connection credit M_conn − D_conn = 300 B
 * → sendable = min(1,000, 300) = 300 B (본문 interpretation의 숫자).
 * 마지막 장면: packet 25가 다시 싣는 stream 0 offset 100–199(100 B)는
 * 새 application byte로 다시 세지 않는다(본문 assumptions).
 */
const STREAM_CREDIT = 1000;
const CONN_CREDIT = 300;
const SENDABLE = Math.min(STREAM_CREDIT, CONN_CREDIT);
const RESENT = 199 - 100 + 1;

const SCENES = [
  {
    label: "Stream credit",
    summary: "stream 한도까지 1,000 B",
    note: "Receiver가 이 stream에 허용한 최대 offset(MAX_STREAM_DATA)에서 지금 보낼 위치를 빼면, 이 stream 하나만 볼 때 새로 보낼 수 있는 양이 1,000 byte 남았습니다.",
  },
  {
    label: "Connection credit",
    summary: "연결 한도까지 300 B",
    note: "Connection 전체 한도(MAX_DATA)는 stream 0과 stream 4가 함께 씁니다. 이미 쓴 새 byte를 빼면 연결 전체에 남은 양은 300 byte입니다.",
  },
  {
    label: "작은 쪽까지만",
    summary: "min(1,000, 300) = 300 B",
    note: "두 제한을 동시에 지켜야 하므로 이번에 보낼 새 data는 300 byte까지입니다. Congestion window와 pacing은 이 식 밖의 별도 제한이라 실제 전송량은 더 작을 수 있습니다.",
  },
  {
    label: "재전송은 다시 세지 않음",
    summary: "offset 100–199 → 새 byte 0",
    note: "Packet 25가 stream 0의 offset 100–199를 다시 실어도 이 100 byte는 새 application byte가 아니므로 connection credit을 다시 깎지 않습니다. 다만 구현은 겹친 구간과 final size가 맞는지 검증해야 합니다. 이 장면은 앞 장면의 숫자를 사례의 재전송과 겹쳐 본 예시입니다(가정).",
  },
] as const;

function Bar({
  label,
  value,
  color,
  on,
  strong = false,
}: {
  label: string;
  value: number;
  color: string;
  on: boolean;
  strong?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[7rem_minmax(0,1fr)_4.25rem] items-center gap-2 text-xs transition-opacity duration-200 motion-reduce:transition-none sm:grid-cols-[9rem_minmax(0,1fr)_4.5rem] sm:text-sm ${on ? "opacity-100" : "opacity-35"}`}
    >
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${(value / STREAM_CREDIT) * 100}%`, backgroundColor: color }} />
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{value.toLocaleString("en-US")} B</span>
    </div>
  );
}

export default function FlowCreditViz() {
  return (
    <SceneShell
      eyebrow="Flow control"
      title="두 credit 중 작은 쪽이 이번 전송량입니다"
      description="막대 길이는 남은 byte 수이며 1,000 byte를 막대 전체 폭으로 그렸습니다. Stream credit은 stream 하나의 한도, connection credit은 모든 stream이 함께 쓰는 한도입니다. 숫자는 아래 식의 해석에 나오는 예입니다."
      ariaLabel="stream credit 1000 byte와 connection credit 300 byte 중 작은 300 byte만 새로 보낼 수 있음"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <Bar label="Stream credit" value={STREAM_CREDIT} color="#2563eb" on={active === 0 || active === 2} />
          <Bar label="Connection credit" value={CONN_CREDIT} color="#d97706" on={active >= 1} />
          <div className="ml-[7.5rem] flex flex-wrap gap-1.5 text-[11px] leading-4 sm:ml-[9.5rem]">
            <span
              className={`rounded border px-1.5 py-0.5 transition-opacity duration-200 motion-reduce:transition-none ${active === 1 ? "border-[#d97706] opacity-100" : "border-border/60 opacity-35"}`}
            >
              stream 0 · stream 4 공유
            </span>
          </div>
          <Bar label="새로 보낼 수 있음" value={SENDABLE} color="#059669" on={active === 2} strong />
          <div
            className={`grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-2 text-xs transition-opacity duration-200 motion-reduce:transition-none sm:grid-cols-[9rem_minmax(0,1fr)] sm:text-sm ${active === 3 ? "opacity-100" : "opacity-35"}`}
          >
            <span className="text-muted-foreground">Packet 25 재전송</span>
            <span className="rounded-md border border-dashed border-[#7c3aed] px-2 py-1 font-mono text-xs">
              stream 0 · {RESENT} B · credit 차감 0
            </span>
          </div>
        </div>
      )}
    />
  );
}
