import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — status()는 send root 미확정이면 UNCONFIRMED, 실행했으면 EXECUTED, 그 외 CONFIRMED.
 * execute()는 CONFIRMED를 검사한 뒤 proof·메시지 위치·수신처·금액을 L1 outbox로 보낸다.
 * B의 5는 L1 거래가 성공한 뒤에야 인출 중에서 B L1으로 옮긴다.
 */
const W = 360;
const H = 138;
const SLATE = "#64748b";
const BLUE = "#2563eb";
const GREEN = "#16a34a";

const SCENES = [
  { label: "send root 미확정", summary: "UNCONFIRMED", hot: "unconfirmed", path: "M73 46V82", place: "pending", note: "send root는 L2의 인출 메시지들을 요약해 L1에 올리는 값입니다. 이 값이 아직 확정되지 않았으면 status()는 UNCONFIRMED를 돌려줍니다." },
  { label: "CONFIRMED", summary: "실행 가능 · 5는 아직 인출 중", hot: "confirmed", path: "M140 28H200M240 46L210 82", place: "pending", note: "확정됐지만 아직 실행하지 않았으면 CONFIRMED입니다. 이름과 달리 지급 완료가 아닙니다. B의 5는 여전히 표의 인출 중 칸에 있습니다." },
  { label: "execute()", summary: "proof를 붙여 L1 outbox로", hot: "execute", path: "M250 100H278", place: "pending", note: "execute()는 상태가 CONFIRMED인지 검사한 뒤 proof·메시지 위치·수신처·금액 등을 L1 outbox로 보냅니다. 이 L1 거래가 성공해야 지급이 끝납니다." },
  { label: "EXECUTED", summary: "B L1 수령 5", hot: "executed", path: "M140 28H200M280 46L316 82", place: "paid", note: "L1 거래가 성공하면 메시지는 이미 실행한 상태가 되어 status()가 EXECUTED를 돌려줍니다. 이제 5를 B L1 칸으로 옮겨 적습니다." },
] as const;

function Box({ x, y, w, label, on, mono = false }: { x: number; y: number; w: number; label: string; on: boolean; mono?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={36} rx={6} fill="none" stroke={on ? BLUE : "#94a3b8"} strokeWidth={on ? 1.25 : 1} />
      <text x={x + w / 2} y={y + 22} textAnchor="middle" fontSize={mono ? 10 : 11.5} fontWeight={700} fontFamily={mono ? "ui-monospace, monospace" : undefined} fill={on ? BLUE : SLATE}>{label}</text>
    </g>
  );
}

export default function SdkStatusViz() {
  return (
    <SceneShell
      eyebrow="status()의 갈림"
      title="CONFIRMED와 EXECUTED 사이에 지급 거래가 있습니다"
      description="공개 Arbitrum SDK의 status()가 값을 고르는 순서입니다. 아래 두 칸은 4절 표의 인출 중과 B L1입니다. 라이브 Robinhood 계약과 동일함을 검증한 그림은 아닙니다."
      ariaLabel="status 함수의 분기와 B의 5개가 놓인 위치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <g stroke="#94a3b8" strokeWidth={1} fill="none">
                <path d="M73 46V82M140 28H200M240 46L210 82M280 46L316 82M250 100H278" />
              </g>
              <path d={scene.path} stroke={scene.hot === "execute" ? GREEN : BLUE} strokeWidth={1.25} fill="none" />
              <Box x={6} y={10} w={134} label="send root 확정?" on={false} />
              <Box x={200} y={10} w={120} label="이미 실행?" on={false} />
              <Box x={6} y={82} w={134} label="UNCONFIRMED" mono on={scene.hot === "unconfirmed"} />
              <Box x={170} y={82} w={80} label="CONFIRMED" mono on={scene.hot === "confirmed" || scene.hot === "execute"} />
              <Box x={278} y={82} w={76} label="EXECUTED" mono on={scene.hot === "executed"} />
              <text x={79} y={68} fontSize={10.5} fill={SLATE}>아니오</text>
              <text x={170} y={22} textAnchor="middle" fontSize={10.5} fill={SLATE}>예</text>
              <text x={208} y={68} textAnchor="end" fontSize={10.5} fill={SLATE}>아니오</text>
              <text x={305} y={68} fontSize={10.5} fill={SLATE}>예</text>
              <text x={264} y={132} textAnchor="middle" fontSize={10.5} fontWeight={700} fontFamily="ui-monospace, monospace" fill={scene.hot === "execute" ? GREEN : SLATE}>execute()</text>
            </svg>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              {[{ name: "인출 중", on: scene.place === "pending" }, { name: "B L1", on: scene.place === "paid" }].map((slot) => (
                <div key={slot.name} className={`rounded-lg border px-2 py-2 ${slot.on ? "border-primary" : "border-border"} bg-background`}>
                  <span className="block text-xs text-muted-foreground">{slot.name}</span>
                  <span className={`block font-mono text-base ${slot.on ? "font-bold text-primary" : "font-semibold"}`}>{slot.on ? 5 : 0}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
