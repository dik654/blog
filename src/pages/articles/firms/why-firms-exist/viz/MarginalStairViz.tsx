import { INSIDE, choices } from "../model";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #what-moves — 안쪽 비용 1·2·3·4·5·6은 그대로 두고 밖의 비용 b만 4→5→2→3.5로 바꾼다.
 * 합계 = 6b − (b보다 싼 일에서 아낀 값의 합). 4: 24−6=18, 5: 30−10=20, 2: 12−1=11, 3.5: 21−4.5=16.5.
 */
const UNIT = 20;
const BASE_Y = 136;
const COL_X = 52;
const COL_W = 40;
const COL_GAP = 8;
const colX = (i: number) => COL_X + i * (COL_W + COL_GAP);
const yOf = (v: number) => BASE_Y - v * UNIT;

const SCENES = [
  { b: 4, label: "밖의 비용 4", summary: "24 − (3+2+1) = 18", note: "24는 전부 밖일 때의 합계(4 × 6)입니다. 일 1~3은 안이 더 싸 옮길 때마다 합계가 줄고, 일 4는 4 − 4 = 0이어서 세 개와 네 개가 함께 최저 18입니다." },
  { b: 5, label: "밖의 비용 5", summary: "30 − (4+3+2+1) = 20", note: "막대는 그대로이고 선만 5로 올랐습니다. 일 5가 동률이 되어 네 개와 다섯 개가 함께 최저 20입니다. 안쪽을 개선하지 않아도 들일 수 있는 일이 늘었습니다." },
  { b: 2, label: "밖의 비용 2", summary: "12 − 1 = 11", note: "선을 2로 내리면 안이 더 싼 일은 일 1뿐이고 일 2가 동률입니다. 한 개와 두 개가 함께 최저 11입니다." },
  { b: 3.5, label: "밖의 비용 3.5", summary: "21 − (2.5+1.5+0.5) = 16.5", note: "안쪽 비용 중 3.5와 같은 값은 없습니다. 그래도 일 3까지는 합계가 줄고 일 4부터 늘어나므로 세 개에서만 최저 16.5입니다." },
] as const;

const signed = (v: number) => (v === 0 ? "0" : `${v > 0 ? "+" : "−"}${Math.abs(v)}`);

export default function MarginalStairViz() {
  return (
    <SceneShell
      eyebrow="막대와 선"
      title="막대는 그대로이고 밖의 비용 선만 움직입니다"
      description="막대는 그 일을 안으로 들일 때 더해지는 비용, 점선은 밖의 작업당 비용 b입니다. 초록은 옮겨서 아끼는 값, 주황은 더 드는 값입니다. 수는 본문의 (가정)이고 앞에서부터 들이며 설립·전환 비용은 0입니다."
      ariaLabel="안쪽 비용 막대와 밖의 비용 선을 겹쳐 최저 개수를 찾는 그림"
      scenes={SCENES}
      render={(active) => {
        const { b } = SCENES[active];
        const lowest = choices(b);
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 340 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: 최저 합계 ${lowest.minimum}, 최저인 안의 작업 수 ${lowest.minimizers.join("개와 ")}개`}>
              {INSIDE.map((a, i) => (
                <g key={i}>
                  <rect x={colX(i)} y={yOf(Math.min(a, b))} width={COL_W} height={Math.min(a, b) * UNIT} fill="#94a3b8" />
                  {a < b && <rect x={colX(i)} y={yOf(b)} width={COL_W} height={(b - a) * UNIT} fill="#16a34a" opacity={0.4} />}
                  {a > b && <rect x={colX(i)} y={yOf(a)} width={COL_W} height={(a - b) * UNIT} fill="#d97706" opacity={0.75} />}
                  <text x={colX(i) + COL_W / 2} y={BASE_Y - 5} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a">{a}</text>
                  <text x={colX(i) + COL_W / 2} y={BASE_Y + 16} textAnchor="middle" fontSize={11} fill="#64748b">일 {i + 1}</text>
                  <text x={colX(i) + COL_W / 2} y={BASE_Y + 34} textAnchor="middle" fontSize={12} fontWeight={700} fill={a < b ? "#16a34a" : a > b ? "#d97706" : "#64748b"}>{signed(a - b)}</text>
                  <text x={colX(i) + COL_W / 2} y={BASE_Y + 52} textAnchor="middle" fontSize={11} fontWeight={a === b ? 700 : 400} fill="#64748b">{a < b ? "안" : a > b ? "밖" : "동률"}</text>
                </g>
              ))}
              <line x1={46} x2={332} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
              <line x1={46} x2={332} y1={yOf(b)} y2={yOf(b)} stroke="#2563eb" strokeWidth={1.25} strokeDasharray="4 3" />
              <text x={COL_X} y={yOf(b) - 5} fontSize={12} fontWeight={700} fill="#2563eb">b = {b}</text>
              <text x={42} y={BASE_Y + 34} textAnchor="end" fontSize={11} fill="#64748b">안−밖</text>
              <text x={42} y={BASE_Y + 52} textAnchor="end" fontSize={11} fill="#64748b">선택</text>
            </svg>
          </div>
        );
      }}
    />
  );
}
