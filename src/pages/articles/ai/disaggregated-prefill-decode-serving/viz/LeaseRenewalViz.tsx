import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-finish — 새 기한 = max(기존 기한, 현재+20초).
 * 기한 30: 현재 5 → max(30,25)=30, 현재 25 → max(30,45)=45.
 */
const X0 = 14;
const SCALE = 6.6;
const x = (sec: number) => X0 + sec * SCALE;

const SCENES = [
  { label: "처음 기한", summary: "기본 lease 30초", deadline: 30, now: null, candidate: null, note: "요청 계산이 끝나도 P는 원본을 이 기한까지 보관합니다. 읽기 완료를 먼저 확인하면 그때 반환합니다." },
  { label: "5초에 신호가 오면", summary: "max(30, 5+20) = 30", deadline: 30, now: 5, candidate: 25, note: "현재+20초인 25초가 기존 기한보다 짧습니다. 큰 값을 쓰므로 기존 기한을 줄이지 않고 30초에 둡니다." },
  { label: "25초에 신호가 오면", summary: "max(30, 25+20) = 45", deadline: 45, now: 25, candidate: 45, note: "현재+20초인 45초가 더 길어 기한이 45초로 늘어납니다. 신호를 받으면 항상 20초 늘어나는 것이 아닙니다." },
  { label: "기한을 넘기면", summary: "원본이 회수될 수 있음", deadline: 30, now: null, candidate: null, note: "heartbeat는 전송 성공을 뜻하지 않습니다. 엔진의 긴 실행 때문에 신호 처리가 늦을 수 있고, 기한이 지나면 원본이 회수될 수 있습니다." },
] as const;

export default function LeaseRenewalViz() {
  return (
    <SceneShell
      eyebrow="(가정) 보관 기한 lease"
      title="heartbeat 신호는 기한을 늘릴 수는 있어도 줄이지는 않습니다"
      description="가로축은 초입니다. 30초와 +20초는 고정한 버전의 값이고, 신호를 하나씩 떼어 본 예입니다. heartbeat는 기다리는 쪽이 보내는 연장 신호입니다."
      ariaLabel="기존 기한과 현재 시각 더하기 20초 중 큰 값으로 정해지는 새 기한"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const extended = scene.deadline > 30;
        return (
          <svg key={scene.label} viewBox="0 0 360 126" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0} y={14} fontSize={12} fill="currentColor">보관 기한</text>
            <rect x={x(0)} y={20} width={x(30) - x(0)} height={24} rx={3} fill="#d97706" />
            {extended && <rect x={x(30)} y={20} width={x(45) - x(30)} height={24} rx={3} fill="#16a34a" />}
            <text x={x(scene.deadline) - 6} y={36} textAnchor="end" fontSize={12} fontWeight={700} fill="#ffffff">{scene.deadline}초까지</text>
            {active === 3 && (
              <>
                <rect x={x(30)} y={20} width={x(50) - x(30)} height={24} rx={3} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
                <text x={x(40)} y={36} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">기한 이후</text>
              </>
            )}
            {scene.now !== null && scene.candidate !== null && (
              <>
                <text x={scene.now < 10 ? x(scene.candidate) + 6 : x(scene.now) - 6} y={83} textAnchor={scene.now < 10 ? "start" : "end"} fontSize={12} fill="currentColor">현재 + 20초</text>
                <rect x={x(scene.now)} y={68} width={x(scene.candidate) - x(scene.now)} height={22} rx={3} fill="none" stroke="#2563eb" strokeWidth={1} strokeDasharray="4 3" />
                <text x={(x(scene.now) + x(scene.candidate)) / 2} y={83} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">{scene.now}+20 = {scene.candidate}</text>
                <line x1={x(scene.now)} x2={x(scene.now)} y1={46} y2={92} stroke="#2563eb" strokeWidth={1.25} />
              </>
            )}
            <line x1={x(0)} x2={x(50)} y1={96} y2={96} stroke="#94a3b8" strokeWidth={1} />
            {[0, 10, 20, 30, 40, 50].map((sec) => (
              <g key={sec}>
                <line x1={x(sec)} x2={x(sec)} y1={96} y2={100} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(sec)} y={113} textAnchor="middle" fontSize={11.5} fill="#64748b">{sec}초</text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
