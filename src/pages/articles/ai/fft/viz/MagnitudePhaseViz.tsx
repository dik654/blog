import SceneShell from "./SceneShell";
import { Arrow } from "./VectorPath";

/**
 * 본문 대응: #phase — [1,2,3,4]와 [1,4,3,2]의 출력은 길이 10, √8, 2, √8로 같고 방향만 다릅니다.
 * 막대 높이는 길이에 비례합니다. 화살표는 위쪽이 세로 양수입니다.
 */
const A: [number, number][] = [[10, 0], [-2, 2], [-2, 0], [-2, -2]];
const B: [number, number][] = [[10, 0], [-2, -2], [-2, 0], [-2, 2]];
const LENGTH_LABEL = ["10", "√8", "2", "√8"];

const SCENES: { label: string; summary: string; note: string; input: string[]; out: [number, number][] | null; outLabel: string[] }[] = [
  { label: "입력 1, 2, 3, 4", summary: "출력 둘째 −2+2i · 넷째 −2−2i", input: ["1", "2", "3", "4"], out: A, outLabel: ["10", "−2+2i", "−2", "−2−2i"], note: "계수의 화살표 길이가 magnitude(진폭 크기), 방향이 phase(위상)입니다. 둘째와 넷째는 길이가 √8로 같고 방향만 다릅니다." },
  { label: "입력 1, 4, 3, 2", summary: "출력 둘째 −2−2i · 넷째 −2+2i", input: ["1", "4", "3", "2"], out: B, outLabel: ["10", "−2−2i", "−2", "−2+2i"], note: "2와 4의 자리를 맞바꾸었습니다. 둘째와 넷째 화살표의 방향이 서로 뒤바뀌었고 길이는 그대로입니다." },
  { label: "길이만 남기면", summary: "10, √8, 2, √8 → 입력은?", input: ["?", "?", "?", "?"], out: null, outLabel: ["방향 버림", "방향 버림", "방향 버림", "방향 버림"], note: "막대만 보면 두 입력을 구별할 수 없습니다. 제곱한 길이인 power 100, 8, 4, 8도 같습니다. 유용한 요약이어도 일반적인 입력 복원에는 충분하지 않습니다." },
];

const COL = [50, 136, 222, 308];
const DIAL_Y = 100;
const DIAL_R = 36;
const UNIT = 3.2;
const BAR_BASE = 222;
const BAR_UNIT = 6;

export default function MagnitudePhaseViz() {
  return (
    <SceneShell
      eyebrow="크기와 위상"
      title="막대 높이가 같아도 입력의 순서는 다를 수 있습니다"
      description="위 칸은 입력, 가운데 원은 계수의 방향과 길이, 아래 막대는 길이만 남긴 값입니다."
      ariaLabel="두 입력의 계수 방향과 같은 크기 막대 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const lengths = [10, Math.SQRT2 * 2, 2, Math.SQRT2 * 2];
        return (
          <svg viewBox="0 0 360 244" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {COL.map((x, i) => {
              const way = scene.out ? scene.out[i] : null;
              return (
                <g key={i}>
                  <rect x={x - 26} y={8} width={52} height={32} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
                  <text x={x} y={29} textAnchor="middle" fontSize={15} fontWeight={700} fill={scene.input[i] === "?" ? "#d97706" : "#2563eb"}>{scene.input[i]}</text>
                  <circle cx={x} cy={DIAL_Y} r={DIAL_R} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray={way ? undefined : "3 3"} />
                  {way && <Arrow x1={x} y1={DIAL_Y} x2={x + way[0] * UNIT} y2={DIAL_Y - way[1] * UNIT} color="#2563eb" />}
                  <text x={x} y={DIAL_Y + DIAL_R + 15} textAnchor="middle" fontSize={11} fill="#64748b">{scene.outLabel[i]}</text>
                  <rect x={x - 12} y={BAR_BASE - lengths[i] * BAR_UNIT} width={24} height={lengths[i] * BAR_UNIT} rx={2} fill="#64748b" opacity={0.75} />
                  <text x={x + 16} y={BAR_BASE - 3} fontSize={11} fontWeight={700} fill="#64748b">{LENGTH_LABEL[i]}</text>
                </g>
              );
            })}
            <line x1={14} x2={346} y1={BAR_BASE} y2={BAR_BASE} stroke="#94a3b8" strokeWidth={1} />
            <text x={180} y={BAR_BASE + 17} textAnchor="middle" fontSize={11} fill="#64748b">길이만 남긴 막대 (네 자리 모두 두 입력에서 같음)</text>
          </svg>
        );
      }}
    />
  );
}
