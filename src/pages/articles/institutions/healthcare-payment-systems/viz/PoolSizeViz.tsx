import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 첫 문단 — 어떤 범위에서 묶는지가 한 사람의 몫을 바꾼다.
 * 사례의 공동 재원 몫 8만 원을 쓴 단순 나눗셈이다(가정).
 * 1명 8 ÷ 1 = 8, 4명 8 ÷ 4 = 2, 8명 8 ÷ 8 = 1, 4명 모두 아픔 (4 × 8) ÷ 4 = 8.
 */
const SICK = "#d97706";
const WELL = "#2563eb";
const SLOTS = [0, 1, 2, 3, 4, 5, 6, 7];

const SCENES = [
  { label: "혼자 감당하면", summary: "8 ÷ 1 = 8만 원", members: 1, sick: 1, share: 8, note: "공동 재원이 맡던 8만 원을 아픈 사람 혼자 냅니다. 창구에서 따로 내는 2만 원은 이 계산 밖입니다. 아플 때는 일을 못 해 소득도 줄 수 있는 바로 그 시점입니다." },
  { label: "넷이 묶이면", summary: "8 ÷ 4 = 2만 원", members: 4, sick: 1, share: 2, note: "건강한 세 사람과 함께 나누면 한 사람 몫은 2만 원입니다. 건강한 사람도 미리 내므로 아픈 사람의 부담이 나뉩니다." },
  { label: "여덟이 묶이면", summary: "8 ÷ 8 = 1만 원", members: 8, sick: 1, share: 1, note: "같은 8만 원이라도 함께 묶는 범위가 넓으면 한 사람 몫이 작아집니다." },
  { label: "아픈 사람끼리만 묶이면", summary: "(4 × 8) ÷ 4 = 8만 원", members: 4, sick: 4, share: 8, note: "넷 모두 8만 원씩 쓰면 총 32만 원이고, 넷이 나눠도 한 사람 몫은 혼자일 때와 같은 8만 원입니다. 그래서 건강한 사람과 아픈 사람을 어떤 범위에서 함께 묶는지가 보호의 크기를 바꿉니다." },
] as const;

export default function PoolSizeViz() {
  return (
    <SceneShell
      eyebrow="함께 묶는 범위"
      title="누구와 묶이느냐에 따라 한 사람 몫이 달라집니다"
      description="사례의 공동 재원 몫 8만 원을 똑같이 나눈 단순 계산이며 인원은 가정입니다. 실제 보험료 산정 방식이 아닙니다."
      ariaLabel="함께 묶는 인원과 구성에 따라 달라지는 한 사람의 부담"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 100" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {SLOTS.map((slot) => {
                const member = slot < scene.members;
                const sick = slot < scene.sick;
                const x = 6 + slot * 44;
                const color = member ? (sick ? SICK : WELL) : "#94a3b8";
                return (
                  <g key={slot} opacity={member ? 1 : 0.45}>
                    <rect x={x} y={8} width={40} height={52} rx={6} fill={color} fillOpacity={member ? 0.16 : 0} stroke={color} strokeWidth={1} strokeDasharray={member ? undefined : "3 2"} />
                    {member && <text x={x + 20} y={39} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="currentColor">{sick ? "아픔" : "건강"}</text>}
                  </g>
                );
              })}
              <text x={6} y={84} fontSize={11.5} fill="currentColor">점선 칸은 묶음 밖입니다</text>
              <text x={354} y={84} textAnchor="end" fontSize={11.5} fontWeight={700} fill="currentColor">묶인 사람 {scene.members}명</text>
            </svg>
            <div className="mt-3 grid grid-cols-[5.5rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs sm:text-sm">
              <span className="font-bold">한 사람 몫</span>
              <div className="h-4 min-w-0 rounded-sm bg-muted/40">
                <div className="h-full rounded-sm bg-[#2563eb]" style={{ width: `${(scene.share / 8) * 100}%` }} />
              </div>
              <span className="text-right font-mono font-bold">{scene.share}만</span>
            </div>
          </div>
        );
      }}
    />
  );
}
