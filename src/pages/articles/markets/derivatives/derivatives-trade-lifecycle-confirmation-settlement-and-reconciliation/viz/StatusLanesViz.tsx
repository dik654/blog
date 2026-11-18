import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 확인된 조건으로 계산해도 계좌 정보가 틀리면 현금이 도착하지 않고,
 * 결제됐어도 거래저장소 보고가 틀리면 규제 장부와 회사 장부가 어긋난다.
 * #mechanism — 결제일에 입금, 실패 사유, 재시도, 최종 완료 시각을 거래 식별자에 연결한다.
 */
type Tone = "ok" | "wait" | "bad";

const LANES = ["체결", "확인", "평가", "담보", "결제", "보고"] as const;

const TONE: Record<Tone, { color: string; mark: string }> = {
  ok: { color: "#15803d", mark: "완료" },
  wait: { color: "#b45309", mark: "진행 중" },
  bad: { color: "#b91c1c", mark: "문제" },
};

const SCENES = [
  {
    label: "결제 지시를 보냈습니다",
    summary: "지시 ≠ 입금",
    lanes: [["ok", "합의값 3.00%"], ["ok", "같은 수정 버전 승인"], ["ok", "평가 다시 계산"], ["ok", "증거금 다시 계산"], ["wait", "지급액 3.00 지시 보냄"], ["wait", "아직 확인 전"]] as readonly (readonly [Tone, string])[],
    note: "확인된 조건으로 지급액 3.00을 계산해 결제 지시를 보냈습니다. 지시를 보낸 것과 정한 계좌에 현금이 실제로 들어간 것은 다른 상태입니다.",
  },
  {
    label: "계좌 정보가 틀리면",
    summary: "확인 완료 · 현금 미도착",
    lanes: [["ok", "합의값 3.00%"], ["ok", "같은 수정 버전 승인"], ["ok", "평가 다시 계산"], ["ok", "증거금 다시 계산"], ["bad", "실패 · 사유: 계좌 정보 오류"], ["wait", "아직 확인 전"]] as readonly (readonly [Tone, string])[],
    note: "조건은 맞아도 계좌 정보가 틀리거나 지급 은행이 막히면 현금이 도착하지 않습니다. 실패 사유를 거래 식별자에 연결해 남깁니다.",
  },
  {
    label: "재시도해 입금을 확인합니다",
    summary: "재시도 → 입금 · 완료 시각",
    lanes: [["ok", "합의값 3.00%"], ["ok", "같은 수정 버전 승인"], ["ok", "평가 다시 계산"], ["ok", "증거금 다시 계산"], ["ok", "재시도 → 입금 · 완료 시각 기록"], ["wait", "아직 확인 전"]] as readonly (readonly [Tone, string])[],
    note: "재시도와 최종 완료 시각까지 같은 거래 식별자에 이어 붙여야 ‘결제 완결’에 가까워졌다고 말할 수 있습니다.",
  },
  {
    label: "결제됐어도 보고가 틀리면",
    summary: "규제 장부 ≠ 회사 장부",
    lanes: [["ok", "합의값 3.00%"], ["ok", "같은 수정 버전 승인"], ["ok", "평가 다시 계산"], ["ok", "증거금 다시 계산"], ["ok", "재시도 → 입금 · 완료 시각 기록"], ["bad", "거래저장소 보고 오류"]] as readonly (readonly [Tone, string])[],
    note: "현금은 도착했어도 거래저장소 보고가 틀리면 규제 장부와 회사 장부가 어긋납니다. 그래서 여섯 상태와 담당 시간을 따로 관리합니다.",
  },
] as const;

export default function StatusLanesViz() {
  return (
    <SceneShell
      eyebrow="완료 표시 나누기"
      title="‘확인 완료’ 하나로는 결제 실패와 보고 오류가 보이지 않습니다"
      description="위 칸은 확인 단계의 완료 표시 하나만 볼 때, 아래 줄은 체결·확인·평가·담보·결제·보고 상태를 따로 볼 때입니다. 3.00과 5bp 수정은 글의 설명용 숫자입니다."
      ariaLabel="확인 완료 표시는 그대로인데 결제가 실패했다가 재시도로 완료되고, 이후 보고 오류가 생기는 과정을 여섯 상태 줄로 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs">
              <span className="font-semibold">확인 완료 표시 하나만 보면</span>
              <span className="font-mono font-bold" style={{ color: TONE.ok.color }}>완료</span>
            </div>
            <div className="mt-3 space-y-1.5">
              {LANES.map((lane, index) => {
                const [tone, text] = scene.lanes[index];
                const style = TONE[tone];
                return (
                  <div key={lane} className="grid grid-cols-[3rem_minmax(0,1fr)_3.5rem] items-center gap-2 rounded-md border border-border px-2 py-1.5 text-xs">
                    <span className="font-semibold">{lane}</span>
                    <span className="min-w-0 break-keep leading-4 text-muted-foreground">{text}</span>
                    <span className="text-right font-bold" style={{ color: style.color }}>{style.mark}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
