import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 입금 시스템에는 1,000 송금만, 거래 시스템에는 두 계약과 손실 20만, 출금 시스템에는 980만 보인다.
 * 고객과 실소유자 식별자로 세 기록을 연결해야 한 사건이 된다(1,000 − 20 = 980).
 * 담당자가 보는 것: 송금인·수취인 관계, 거래상대·기초자산, 포지션 보유 시간, 가격의 공정성과 수수료.
 * 사건의 시각은 본문에 없으므로 순서 칸만 쓰고 시각이나 간격을 적지 않습니다.
 */
const LANES = [
  { key: "in", name: "입금 시스템", slot: 0, event: "1,000 송금 들어옴", check: "송금인은 누구인가", color: "#2563eb" },
  { key: "trade", name: "거래 시스템", slot: 1, event: "반대 방향 계약 2건 · 손실 20", check: "거래상대·기초자산·보유 시간·가격 공정성·수수료", color: "#d97706" },
  { key: "out", name: "출금 시스템", slot: 2, event: "980 다른 나라 계좌로", check: "수취인은 누구이며 송금인과 어떤 관계인가", color: "#7c3aed" },
] as const;

const SCENES = [
  { label: "입금 시스템만 보면", summary: "1,000 송금 하나", visible: [true, false, false], linked: false, checks: false, note: "입금 시스템에는 1,000의 송금만 보입니다. 이 화면만으로는 이 돈이 파생상품 거래를 거쳐 다시 나갔는지 알 수 없습니다." },
  { label: "거래 시스템만 보면", summary: "두 계약과 손실 20", visible: [false, true, false], linked: false, checks: false, note: "거래 시스템에는 서로 반대인 두 계약과 손실 20만 보입니다. 시장위험으로만 보면 손실 20 하나입니다." },
  { label: "출금 시스템만 보면", summary: "980 출금 하나", visible: [false, false, true], linked: false, checks: false, note: "출금 시스템에는 다른 나라 계좌로 나간 980만 보입니다. 이 돈이 어디서 들어왔는지는 이 화면에 없습니다." },
  { label: "식별자로 연결하면", summary: "1,000 − 20 = 980 · 한 사건", visible: [true, true, true], linked: true, checks: false, note: "고객과 실소유자 식별자로 세 기록을 이으면 1,000이 들어와 20을 잃고 980이 나간 한 사건이 됩니다. 이렇게 묶여야 고객확인 때의 예상 거래 규모와도 비교할 수 있습니다." },
  { label: "담당자가 확인할 것", summary: "칸마다 질문이 붙음", visible: [true, true, true], linked: true, checks: true, note: "담당자는 송금인과 수취인 관계, 거래상대와 기초자산, 포지션 보유 시간, 가격의 공정성과 수수료를 봅니다. 필요한 경우 고객에게 상업 계약과 자금 원천 자료를 요청합니다." },
] as const;

export default function CaseTimelineViz() {
  return (
    <SceneShell
      eyebrow="세 시스템 · 한 시간줄"
      title="따로 보면 평범한 세 기록이 식별자로 이어지면 한 사건이 됩니다"
      description="시스템마다 한 줄이고, 순서 ①②③은 일이 일어난 차례입니다. 사건의 실제 시각은 본문에 없어 차례만 나눴습니다."
      ariaLabel="입금·거래·출금 시스템의 기록을 고객과 실소유자 식별자로 연결해 한 사건으로 만드는 과정"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const visible = scene.visible as readonly boolean[];
        return (
          <div className="min-w-0">
            <ol className="space-y-2 text-xs sm:hidden">
              {LANES.map((lane, n) => (
                <li
                  key={lane.key}
                  className={`min-w-0 rounded-lg border px-3 py-2 leading-5 ${visible[n] ? "bg-background" : "border-dashed border-border/60 text-muted-foreground/50"}`}
                  style={{ borderColor: visible[n] ? lane.color : undefined }}
                >
                  <span className="block font-semibold" style={{ color: visible[n] ? lane.color : undefined }}>
                    순서 {["①", "②", "③"][n]} · {lane.name}
                  </span>
                  <span className={`block ${visible[n] ? "font-semibold" : ""}`}>{visible[n] ? lane.event : "이 화면에선 안 보임"}</span>
                  {visible[n] && scene.checks ? <span className="block text-muted-foreground">확인: {lane.check}</span> : null}
                </li>
              ))}
            </ol>
            <div className="hidden grid-cols-[6rem_repeat(3,minmax(0,1fr))] gap-x-2 gap-y-2 text-xs sm:grid">
              <span />
              {["①", "②", "③"].map((order) => (
                <span key={order} className="text-center text-muted-foreground">순서 {order}</span>
              ))}
              {LANES.map((lane, n) => (
                <div key={lane.key} className="contents">
                  <span className="self-center font-semibold" style={{ color: lane.color }}>{lane.name}</span>
                  {[0, 1, 2].map((slot) => {
                    const here = slot === lane.slot;
                    const show = here && visible[n];
                    return (
                      <div
                        key={slot}
                        className={`flex min-h-[4.25rem] min-w-0 flex-col justify-center rounded-lg border px-1.5 py-1 text-center leading-4 ${
                          show ? "bg-background" : here ? "border-dashed border-border/60 text-muted-foreground/50" : "border-transparent bg-muted/30"
                        }`}
                        style={{ borderColor: show ? lane.color : undefined }}
                      >
                        {here ? (
                          <>
                            <span className={show ? "font-semibold" : ""}>{show ? lane.event : "이 화면에선 안 보임"}</span>
                            {show && scene.checks ? <span className="mt-1 block text-[11px] text-muted-foreground">{lane.check}</span> : null}
                          </>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className={`mt-3 rounded-lg border px-3 py-2 text-center text-xs leading-6 sm:text-sm ${scene.linked ? "border-[#16a34a]" : "border-dashed border-border/60 text-muted-foreground/60"}`}>
              {scene.linked ? (
                <span><strong>고객 · 실소유자 식별자</strong>로 묶음 → 1,000 들어옴 − 20 잃음 = 980 나감</span>
              ) : (
                <span>세 기록을 잇는 식별자가 아직 없음 → 사건이 아니라 따로 떨어진 기록</span>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
