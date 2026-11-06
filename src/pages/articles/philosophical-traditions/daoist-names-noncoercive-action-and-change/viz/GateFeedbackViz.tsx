import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 40·30·30을 보내는 동안 관찰이 다음 결정을 바꾸는 경로.
 * 저수지 높이와 40·30·30 막대는 글의 숫자(남은 물 100→60→30→0)이고,
 * 수문 폭의 크기, 논 세 개, 어느 논이 덜 받았는지는 그림을 위한 가정입니다.
 */
const SCENES = [
  { label: "첫 40", summary: "남은 물 100 → 60", note: "먼저 40을 보내고 흙의 침식과 논의 흡수를 봅니다. 결과를 보고 다음 행동을 고치는 이 경로를 되먹임이라고 부릅니다.", remaining: 60, gap: 44, sent: "40", feedback: "본 것: 흙의 침식 · 논의 흡수" },
  { label: "다음 30", summary: "남은 물 60 → 30", note: "앞에서 본 것에 따라 수문 폭을 줄이고 30을 보냅니다. 계획은 있지만 관찰이 다음 결정을 바꿉니다.", remaining: 30, gap: 20, sent: "30", feedback: "바꾼 것: 수문 폭을 줄임" },
  { label: "마지막 30", summary: "남은 물 30 → 0", note: "마지막 30은 물이 덜 간 논으로 보냅니다. 논이 셋이고 그중 논 3이 덜 받았다는 것은 그림을 위한 가정입니다.", remaining: 0, gap: 20, sent: "30", feedback: "바꾼 것: 덜 간 논으로 보냄" },
  { label: "세 번을 마치고", summary: "도달 85 · 손실 15", note: "합치면 85가 닿고 15를 잃습니다(3절의 가정). 글은 어느 번에 얼마가 닿았는지 나누지 않으므로 막대도 합계만 그렸습니다.", remaining: 0, gap: 20, sent: "", feedback: "각 단계의 관찰이 다음 결정을 바꿈" },
] as const;

const RES_TOP = 40;
const RES_H = 110;
const MID = RES_TOP + RES_H / 2;
const FIELDS = [
  { name: "논 1", y: 36 },
  { name: "논 2", y: 78 },
  { name: "논 3", y: 120 },
] as const;
const FIELD_H = 34;

function BatchBar({ active }: { active: number }) {
  const batches = [40, 30, 30];
  return (
    <div className="flex h-6 w-full gap-0.5" aria-hidden="true">
      {batches.map((value, index) => (
        <div
          key={index}
          style={{ width: `${value}%` }}
          className={`flex items-center justify-center rounded-sm border text-xs font-bold ${index <= active ? "border-[#2563eb] bg-[#2563eb] text-white" : "border-border text-muted-foreground"}`}
        >
          {value}
        </div>
      ))}
    </div>
  );
}

export default function GateFeedbackViz() {
  return (
    <SceneShell
      eyebrow="되먹임"
      title="관찰이 다음 수문을 바꾸는 세 번의 방류"
      description="저수지 높이와 40·30·30은 글의 숫자입니다. 수문 폭의 크기와 논 세 개는 재어 본 값이 아니라 그림을 위한 가정입니다."
      ariaLabel="물 40, 30, 30을 보내며 관찰이 수문 폭과 보낼 논을 바꾸는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const flowing = scene.sent !== "";
        const onlyLast = active === 2;
        const waterH = (scene.remaining / 100) * RES_H;
        return (
          <div className="mx-auto max-w-[560px]">
            <svg viewBox="0 0 340 176" className="h-auto w-full" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <text x={44} y={32} textAnchor="middle" fontSize={12} fill="#64748b">저수지</text>
              <rect x={6.5} y={RES_TOP + 0.5} width={75} height={RES_H - 1} rx={3} fill="none" stroke="#94a3b8" strokeWidth={1} />
              {waterH > 0 && <rect x={7} y={RES_TOP + RES_H - waterH} width={74} height={waterH} rx={2} fill="#2563eb" opacity={0.35} />}
              <text x={44} y={168} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">남은 물 {scene.remaining}</text>

              <rect x={90} y={RES_TOP} width={6} height={RES_H / 2 - scene.gap / 2} fill="#475569" />
              <rect x={90} y={MID + scene.gap / 2} width={6} height={RES_H / 2 - scene.gap / 2} fill="#475569" />
              <text x={108} y={168} textAnchor="middle" fontSize={12} fill="#64748b">수문</text>

              {flowing && <rect x={96} y={MID - scene.gap / 2} width={84} height={scene.gap} fill="#2563eb" opacity={0.2} />}
              {flowing && <text x={138} y={MID + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill="#2563eb">{scene.sent}</text>}

              {FIELDS.map((field, index) => {
                const lit = flowing && (!onlyLast || index === 2);
                const endY = field.y + FIELD_H / 2;
                return (
                  <g key={field.name}>
                    {lit && (
                      <>
                        <line x1={180} y1={MID} x2={234} y2={endY} stroke="#2563eb" strokeWidth={1} />
                        <circle cx={235} cy={endY} r={2.5} fill="#2563eb" />
                      </>
                    )}
                    <rect x={240.5} y={field.y + 0.5} width={93} height={FIELD_H - 1} rx={3} fill={lit ? "#2563eb" : "none"} fillOpacity={lit ? 0.14 : 0} stroke="#94a3b8" strokeWidth={1} />
                    <text x={287} y={onlyLast && index === 2 ? field.y + 15 : field.y + 21} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">{field.name}</text>
                    {onlyLast && index === 2 && <text x={287} y={field.y + 28} textAnchor="middle" fontSize={11} fill="#64748b">덜 간 논(가정)</text>}
                  </g>
                );
              })}

              <path d={`M287 36V24H93V${RES_TOP + 4}`} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
              <path d={`M89 ${RES_TOP - 2}L93 ${RES_TOP + 5}L97 ${RES_TOP - 2}`} fill="none" stroke="#d97706" strokeWidth={1} />
              <text x={190} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">{scene.feedback}</text>
            </svg>
            <div className="mt-3 space-y-2">
              <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-2 text-xs">
                <span className="text-muted-foreground">보낸 물</span>
                <BatchBar active={active} />
              </div>
              <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-2 text-xs">
                <span className="text-muted-foreground">결과</span>
                {active === 3 ? (
                  <div className="flex h-6 w-full gap-0.5 font-bold">
                    <div style={{ width: "85%" }} className="flex items-center justify-center rounded-sm bg-[#2563eb] text-white">도달 85</div>
                    <div style={{ width: "15%" }} className="flex items-center justify-center rounded-sm border border-[#64748b] text-muted-foreground">15</div>
                  </div>
                ) : (
                  <div className="flex h-6 items-center text-muted-foreground">세 번을 마친 뒤에 셉니다</div>
                )}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
