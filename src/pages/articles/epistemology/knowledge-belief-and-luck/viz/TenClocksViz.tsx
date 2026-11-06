import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case·#black-box — 1~10시 정각에 멈춘 시계 열 개와 민아의 선택(4시), 실제 시각 4시.
 * 다른 시계를 골랐거나 1분 뒤에 봤다면 틀린다. 1분 뒤에는 정각 표시뿐인 열 개 모두 틀린다(개수는 본문 설정에서 계산).
 */
const SCENES = [
  { label: "벽의 시계 열 개", summary: "1~10시 정각에 하나씩 멈춤", now: "4:00", state: "idle", note: "겉모양이 같은 시계가 모두 멈췄습니다. 민아는 지금이 몇 시인지 모릅니다." },
  { label: "민아가 고른 하나", summary: "표시 4:00 = 실제 4:00", now: "4:00", state: "pick", note: "민아는 “지금 4시다”라고 믿고, 눈앞의 시곗바늘이라는 평소 좋은 근거가 있으며, 문장도 참입니다." },
  { label: "다른 시계였다면", summary: "맞는 시계 1개, 틀린 시계 9개", now: "4:00", state: "others", note: "다른 아홉 개 중 하나를 골랐다면 틀렸습니다. 고장이 다른 시각에 났어도 표시가 달라져 같은 결과입니다." },
  { label: "1분 뒤에 봤다면", summary: "맞는 시계 0개", now: "4:01", state: "later", note: "바늘은 그대로이고 실제 시각만 4:01로 갔습니다. 정각만 가리키는 열 개 중 맞는 것이 없습니다." },
] as const;

const CORRECT = "#2563eb";
const WRONG = "#dc2626";
const INK = "#64748b";

function ClockFace({ hour, color }: { hour: number; color: string }) {
  const angle = (hour * 30 - 90) * (Math.PI / 180);
  return (
    <svg viewBox="0 0 48 48" className="mx-auto block h-auto w-full max-w-[64px]" aria-hidden="true">
      <circle cx={24} cy={24} r={21} fill="none" stroke={color} strokeWidth={1.25} />
      <line x1={24} y1={24} x2={24} y2={8} stroke={color} strokeWidth={1.25} />
      <line x1={24} y1={24} x2={24 + Math.cos(angle) * 12} y2={24 + Math.sin(angle) * 12} stroke={color} strokeWidth={1.25} />
    </svg>
  );
}

export default function TenClocksViz() {
  return (
    <SceneShell
      eyebrow="시계 열 개"
      title="민아의 정답은 열 칸 중 한 칸, 그것도 그 순간에만 맞습니다"
      description="시계 하나가 한 칸이고 아래 글자는 멈춘 시각입니다. 숫자는 판단 구조를 보기 위한 가정입니다."
      ariaLabel="멈춘 시계 열 개 중 민아가 고른 시계와 실제 시각을 비교하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="mx-auto max-w-[520px]">
            <p className="mb-3 text-center text-sm font-bold">
              실제 시각 <span className="font-mono text-primary">{scene.now}</span>
            </p>
            <div className="grid grid-cols-5 gap-x-2 gap-y-3">
              {Array.from({ length: 10 }, (_, index) => {
                const hour = index + 1;
                const picked = hour === 4;
                const right = picked && scene.state !== "later";
                const wrong = scene.state === "later" || (scene.state === "others" && !picked);
                const shown = scene.state === "idle" ? false : scene.state === "pick" ? picked : true;
                const color = !shown ? INK : right ? CORRECT : wrong ? WRONG : INK;
                return (
                  <div key={hour} className={`rounded-lg border px-1 py-1.5 text-center ${shown && picked ? "border-primary" : "border-transparent"}`}>
                    <ClockFace hour={hour} color={color} />
                    <p className="mt-1 font-mono text-xs font-semibold">{hour}:00</p>
                    <p className="text-xs font-bold leading-5" style={{ color: shown ? (right ? CORRECT : WRONG) : "transparent" }}>{right ? "맞음" : "틀림"}</p>
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
