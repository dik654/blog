import SceneShell from "./SceneShell";

/**
 * 본문 대응: #underflow — 입력 [0,−1000]의 둘째 항. 비중을 먼저 만들면 0이 되어 로그를 못 구하고, 로그를 먼저 정리하면 −1000이 남는다.
 */
const BLUE = "#2563eb";
const RED = "#dc2626";
const GRAY = "#94a3b8";
const TEXT = "#64748b";
const W = 340;
const H = 190;
const BW = 96;
const XS = [6, 122, 238] as const;

function Lane({ y, title, boxes, shown, tone, last }: { y: number; title: string; boxes: readonly string[]; shown: number; tone: string; last: string }) {
  return (
    <g>
      <text x={XS[0]} y={y - 8} fontSize={12} fontWeight={700} fill={shown > 0 ? tone : TEXT}>{title}</text>
      {boxes.map((text, index) => {
        const on = index < shown;
        const color = on ? (index === boxes.length - 1 ? last : tone) : GRAY;
        return (
          <g key={text}>
            <rect x={XS[index]} y={y} width={BW} height={42} rx={4} fill="none" stroke={color} strokeWidth={on ? 1.25 : 1} strokeDasharray={on ? undefined : "3 3"} />
            <text x={XS[index] + BW / 2} y={y + 26} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 400} fill={on ? color : TEXT}>{text}</text>
            {index < boxes.length - 1 && <path d={`M ${XS[index] + BW + 1} ${y + 21} H ${XS[index + 1] - 1}`} fill="none" stroke={on ? tone : GRAY} strokeWidth={1} />}
          </g>
        );
      })}
    </g>
  );
}

const SCENES = [
  { label: "작은 항의 exp", summary: "exp(−1000) → 0", shownA: 1, shownB: 0, note: "입력 [0,−1000]은 이미 최댓값이 0이라 뺄 것이 없습니다. 실행 환경에서 exp(−1000)은 0으로 반올림됩니다." },
  { label: "비중 만들기", summary: "분모 1 · 둘째 비중 0", shownA: 2, shownB: 0, note: "분모에는 1이 남아 나눗셈은 문제없지만 둘째 비중이 0으로 저장됩니다." },
  { label: "그 뒤의 로그", summary: "log 0 → 원래 값 없음", shownA: 3, shownB: 0, note: "실수 로그는 0에서 정의되지 않습니다. 저장된 0에서는 원래 크기 −1000을 되살릴 수 없습니다." },
  { label: "로그를 먼저 정리", summary: "−1000 − 0 = −1000", shownA: 3, shownB: 3, note: "나눗셈의 로그를 차로 바꾸면 작은 비중을 저장하지 않습니다. 공통 보정 log(1+e⁻¹⁰⁰⁰)이 0으로 계산되어 −1000이 보존됩니다." },
] as const;

export default function LogSoftmaxPathViz() {
  return (
    <SceneShell
      eyebrow="계산 순서의 두 갈래"
      title="비중을 먼저 저장하면 로그로 가는 길이 막힙니다"
      description="입력 [0,−1000]의 둘째 항을 두 순서로 계산합니다. 왼쪽에서 오른쪽으로 진행합니다."
      note="입력은 본문의 가정입니다. 구현은 exp, 합산, log의 정확도와 누산 형식에 영향을 받습니다."
      ariaLabel="비중을 먼저 구할 때와 로그를 먼저 정리할 때의 계산 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <Lane y={26} title="비중 먼저" boxes={["exp(−1000)=0", "0÷(1+0)=0", "log 0 정의 없음"]} shown={scene.shownA} tone={RED} last={RED} />
            <Lane y={120} title="로그 먼저" boxes={["x−m=−1000", "log(1+0)=0", "−1000−0"]} shown={scene.shownB} tone={BLUE} last={BLUE} />
          </svg>
        );
      }}
    />
  );
}
