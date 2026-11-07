import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 첫 문단 — CCTP의 출발지 소각, 발행자 인증, 도착지 발행, HyperCore 반영을 구별한다.
 * 1,000 USDC는 글의 사례 금액이며 전송 수수료는 넣지 않은 가정입니다.
 */
const STATIONS = [
  { name: "출발 체인", done: "1,000 소각됨", idle: "1,000 보유" },
  { name: "발행자", done: "인증 완료", idle: "인증 전" },
  { name: "도착 체인", done: "1,000 발행됨", idle: "발행 전" },
  { name: "HyperCore", done: "담보 구역 반영", idle: "반영 전" },
] as const;

const SCENES = [
  { label: "출발지 소각", summary: "출발 체인 1,000 → 0", note: "소각은 그 체인의 토큰을 없애는 일입니다. 출발 체인의 전송 기록이 있어도 아직 거래할 계정의 잔액은 아닙니다." },
  { label: "발행자 인증", summary: "소각 사실을 인증", note: "발행자가 소각 사실을 인증하는 단계입니다. 소각과 도착지 발행 사이의 별도 단계로 구별합니다." },
  { label: "도착지 발행", summary: "도착 체인 0 → 1,000", note: "발행은 도착 체인에서 토큰을 새로 만드는 일입니다. 이것과 HyperCore 반영은 별개이므로 여기서 끝났다고 세지 않습니다." },
  { label: "HyperCore 반영", summary: "담보 구역 반영 확인", note: "거래할 계정과 담보 구역에 1,000 USDC가 실제로 반영됐는지 확인한 뒤에야 주문의 담보로 셉니다." },
] as const;

export default function CctpDepositViz() {
  return (
    <SceneShell
      eyebrow="(가정) 담보 1,000 USDC의 이동"
      title="1,000 USDC는 어떤 네 단계를 지나야 담보가 될까요"
      description="CCTP는 공식 USDC 문서가 권장하는 경로입니다(2026-10-18 확인). 전송 수수료는 넣지 않았습니다(가정)."
      note="기존 Arbitrum Bridge2는 공식 문서에서 deprecated로 표시됩니다. 예전 bridge의 입금 시간과 최소액을 CCTP에 적용하지 않습니다."
      ariaLabel="출발지 소각, 발행자 인증, 도착지 발행, HyperCore 반영의 네 단계"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {STATIONS.map((station, index) => {
              const done = index <= active;
              const current = index === active;
              return (
                <li
                  key={station.name}
                  className={`rounded-lg border p-3 text-center text-xs ${current ? "border-primary bg-primary/5" : "border-border"} ${done ? "" : "border-dashed"}`}
                >
                  <span className="block font-bold">{index + 1}. {station.name}</span>
                  <span className={`mt-1 block leading-5 ${done ? "font-semibold" : "text-muted-foreground"}`}>{done ? station.done : station.idle}</span>
                </li>
              );
            })}
          </ol>
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm">
            <span className="font-semibold">주문의 담보로 세나요?</span>
            <span className="font-mono font-bold" style={{ color: active === 3 ? "#16a34a" : "#94a3b8" }}>{active === 3 ? "확인 후 예" : "아직 아니오"}</span>
          </div>
        </div>
      )}
    />
  );
}
