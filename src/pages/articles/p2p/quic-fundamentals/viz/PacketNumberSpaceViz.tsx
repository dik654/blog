import SceneShell from "./SceneShell";

/**
 * 본문 대응: #handshake "Packet-number space를 나누는 이유".
 * Initial · Handshake · Application Data가 서로 다른 번호 장부를 가진다.
 * Initial packet 2와 Handshake packet 2는 같은 숫자지만 다른 항목.
 * 0-RTT와 1-RTT는 Application Data 장부를 공유한다.
 * 장부마다 PN 0–2를 적은 것은 예시(가정)다.
 */
const LEDGERS = [
  { name: "Initial", key: "Initial key", detail: "공개 salt + client DCID" },
  { name: "Handshake", key: "Handshake key", detail: "TLS handshake secret" },
  { name: "Application Data", key: "0‑RTT · 1‑RTT key", detail: "0‑RTT는 재연결 때만" },
] as const;

const NUMBERS = [0, 1, 2] as const;

const SCENES = [
  {
    label: "Initial 장부부터 씁니다",
    summary: "Initial key만 있음",
    note: "ClientHello와 ServerHello가 실리는 Initial packet은 Initial 장부에 번호를 매깁니다. 이 단계에는 아직 Handshake key가 없고, Initial key는 공개 salt와 client가 고른 destination connection ID에서 누구나 계산할 수 있습니다.",
  },
  {
    label: "Handshake 장부는 따로 셉니다",
    summary: "Initial 2 ≠ Handshake 2",
    note: "인증서와 Finished가 실리는 Handshake packet은 별도 장부에 번호를 매깁니다. 그래서 Initial packet 2와 Handshake packet 2는 같은 숫자여도 다른 장부의 항목입니다. 숫자 2만으로는 어느 packet인지 정해지지 않고, 장부와 함께 읽어야 한 항목이 됩니다.",
  },
  {
    label: "0‑RTT와 1‑RTT는 한 장부를 나눕니다",
    summary: "Application Data 장부 1개",
    note: "1‑RTT packet은 Application Data 장부를 씁니다. 재연결 변형에서 보내는 0‑RTT packet도 같은 장부를 공유합니다. 이 글의 사례는 0‑RTT를 쓰지 않는 새 연결이므로 1‑RTT packet만 이 장부에 들어갑니다.",
  },
] as const;

const COLOR = ["#64748b", "#d97706", "#059669"] as const;

export default function PacketNumberSpaceViz() {
  return (
    <SceneShell
      eyebrow="Packet-number space"
      title="번호 장부 세 권이 따로 셉니다"
      description="세로 칸 하나가 packet-number space 하나, 즉 독립된 번호 장부입니다. 칸마다 적은 PN 0·1·2(packet number)는 같은 숫자가 장부마다 다시 나올 수 있음을 보이려는 예시입니다(가정)."
      ariaLabel="Initial, Handshake, Application Data 세 packet-number space와 같은 번호 2의 구분"
      scenes={SCENES}
      render={(active) => (
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {LEDGERS.map((ledger, index) => {
            const on = index === active;
            const color = COLOR[index];
            const markTwo = active === 1 && index <= 1;
            return (
              <div
                key={ledger.name}
                className={`min-w-0 rounded-lg border px-2 py-3 transition-opacity duration-200 motion-reduce:transition-none sm:px-3 ${on || markTwo ? "opacity-100" : "opacity-35"}`}
                style={{ borderColor: color }}
              >
                <p className="text-xs font-bold leading-5 sm:text-sm" style={{ color }}>
                  {ledger.name}
                </p>
                <p className="mt-1 text-[11px] font-semibold leading-4 sm:text-xs">{ledger.key}</p>
                <p className="text-[11px] leading-4 text-muted-foreground sm:text-xs">{ledger.detail}</p>
                <div className="mt-3 space-y-1.5">
                  {NUMBERS.map((pn) => {
                    const highlight = markTwo && pn === 2;
                    return (
                      <div
                        key={pn}
                        className={`rounded-md border px-2 py-1 font-mono text-xs ${highlight ? "font-bold" : "border-border/70"}`}
                        style={highlight ? { borderColor: color, color } : undefined}
                      >
                        PN {pn}
                        {highlight ? " ←" : ""}
                      </div>
                    );
                  })}
                </div>
                {index === 2 && (
                  <div className="mt-3 grid grid-cols-1 gap-1 text-center text-[11px] leading-4 sm:grid-cols-2">
                    <span className={`rounded border border-dashed px-1 py-0.5 ${active === 2 ? "border-[#059669]" : "border-border/60"}`}>0‑RTT</span>
                    <span className={`rounded border px-1 py-0.5 ${active === 2 ? "border-[#059669] font-bold" : "border-border/60"}`}>1‑RTT</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
