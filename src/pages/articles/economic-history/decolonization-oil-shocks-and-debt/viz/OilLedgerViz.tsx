import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 수출 100, 석유 40, 다른 물품 50(가정).
 * 처음 100-(40+50)=+10, 석유 두 배 100-(80+50)=-30. 부족 30을 다루는 네 갈래는 본문 그대로입니다.
 * 두 막대가 같은 눈금이라 수입 막대가 수출 선을 넘는 길이가 곧 부족분입니다.
 */
const SCENES = [
  { label: "처음 장부", summary: "무역수지 +10", oil: 40, note: "수입 막대가 수출 선 안에서 끝납니다. 선까지 남은 10이 처음의 흑자입니다." },
  { label: "석유 가격 두 배", summary: "무역수지 −30", oil: 80, note: "같은 양의 석유에 80을 냅니다. 수출과 다른 물품은 그대로인데 수입 막대가 40만큼 길어져 선을 30 넘어갑니다." },
  { label: "넘어간 30을 어떻게 할까", summary: "네 갈래 모두 단기 비용", oil: 80, note: "정부는 이 네 가지 가운데서 골라야 하고, 어느 선택도 단기 비용 없이 끝나지 않습니다. 비용의 크기는 글에 없어 그리지 않았습니다." },
] as const;

const S = 2.35;
const X0 = 8;
const OTHER = 50;
const EXPORT = 100;
const LINE_X = X0 + EXPORT * S;
const OPTIONS = ["석유 사용 줄이기", "수입 줄이기", "환율 바꾸기", "30 빌리기"];

export default function OilLedgerViz() {
  return (
    <SceneShell
      eyebrow="외화 장부"
      title="석유 한 칸이 두 배가 되면 수입 막대가 수출 선을 넘습니다"
      description="두 막대는 같은 눈금입니다. 무역수지는 수출로 번 외화에서 수입에 쓴 외화를 뺀 값입니다. 숫자는 모두 작동 원리를 위한 가정입니다."
      ariaLabel="수출 100과 수입을 같은 눈금에 놓아 석유 가격 두 배가 흑자 10을 적자 30으로 바꾸는 과정"
      scenes={SCENES}
      render={(active) => {
        const { oil } = SCENES[active];
        const importEnd = X0 + (oil + OTHER) * S;
        const over = oil + OTHER > EXPORT;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 330 160" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <text x={X0} y={15} fontSize={13} fontWeight={700} fill="#64748b">수출로 버는 외화</text>
              <rect x={X0} y={22} width={EXPORT * S} height={34} rx={3} fill="#64748b" />
              <text x={X0 + (EXPORT * S) / 2} y={44} textAnchor="middle" fontSize={14} fontWeight={700} fill="#ffffff">100</text>

              <text x={X0} y={81} fontSize={13} fontWeight={700} fill="#64748b">수입에 쓰는 외화</text>
              <rect x={X0} y={88} width={oil * S} height={34} rx={3} fill="#b45309" />
              <text x={X0 + (oil * S) / 2} y={110} textAnchor="middle" fontSize={14} fontWeight={700} fill="#ffffff">석유 {oil}</text>
              <rect x={X0 + oil * S} y={88} width={OTHER * S} height={34} rx={3} fill="#cbd5e1" />
              <text x={X0 + (oil + OTHER / 2) * S} y={138} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">다른 물품 50</text>

              <line x1={LINE_X} x2={LINE_X} y1={18} y2={126} stroke="#0f172a" strokeWidth={1} strokeDasharray="3 3" className="dark:stroke-[#e2e8f0]" />
              {over ? (
                <>
                  <rect x={LINE_X} y={85} width={importEnd - LINE_X} height={40} fill="none" stroke="#dc2626" strokeWidth={1.25} />
                  <text x={(LINE_X + importEnd) / 2} y={155} textAnchor="middle" fontSize={13} fontWeight={700} fill="#dc2626">넘어간 30</text>
                </>
              ) : (
                <>
                  <rect x={importEnd} y={88} width={LINE_X - importEnd} height={34} fill="none" stroke="#16a34a" strokeWidth={1.25} strokeDasharray="3 2" />
                  <text x={(LINE_X + importEnd) / 2} y={155} textAnchor="middle" fontSize={13} fontWeight={700} fill="#16a34a">남는 10</text>
                </>
              )}
            </svg>
            <StableSceneStack
              active={active}
              className="mt-3"
              scenes={[
                <p key="a" className="text-center font-mono text-sm font-bold">100 − (40 + 50) = +10</p>,
                <p key="b" className="text-center font-mono text-sm font-bold">100 − (80 + 50) = −30</p>,
                <div key="c" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {OPTIONS.map((option) => (
                    <span key={option} className="rounded-lg border border-border bg-background px-2 py-2 text-center text-xs font-semibold leading-5">{option}</span>
                  ))}
                </div>,
              ]}
            />
          </div>
        );
      }}
    />
  );
}
