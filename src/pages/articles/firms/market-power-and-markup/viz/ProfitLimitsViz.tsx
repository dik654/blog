import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 한도 2: 수량 2·가격 11·MR 9·MC 7, 후보 3은 선택 불가.
 * 피할 수 있는 고정비 10: 9−10=−1 < 0 이므로 생산하지 않음.
 * 이미 쓴 10: 계속 영업에서 추가로 얻는 9와 이후 달라지는 비용을 비교합니다.
 */
const SCENES = [
  { label: "생산 한도 2", summary: "수량 2 · 가격 11 · 이익 8", note: "수량 3은 선택할 수 없습니다. 0부터 2까지 이익이 늘어나므로 2개를 만들고 가격 11을 받습니다. 그때 한계수입 9와 한계비용 7은 서로 다르며, 여기에 MR = MC를 요구하면 답을 잃습니다." },
  { label: "피할 수 있는 고정비 10", summary: "9 − 10 = −1 < 0", note: "영업을 시작할 때만 10이 들고 생산하지 않으면 내지 않습니다. 영업할 때의 이익 곡선이 10 내려가 꼭대기가 −1이 되고, 아무것도 하지 않는 0이 더 큽니다." },
  { label: "이미 써 버린 고정비 10", summary: "계속하면 추가로 9", note: "회수할 수 없는 10은 어느 쪽을 골라도 돌아오지 않아 곡선을 내리지 않습니다. 계속 영업할 때 추가로 얻는 9와 이후 달라지는 비용을 비교합니다. 그림에는 이후 달라지는 다른 비용을 넣지 않았습니다 (가정)." },
] as const;

const W = 360;
const H = 240;
const L = 34;
const R = 14;
const T = 12;
const B = 28;
const px = (q: number) => L + (q / 6) * (W - L - R);
const py = (value: number) => T + ((11 - value) / 23) * (H - T - B);
const profit = (q: number) => 6 * q - q * q;
const curve = (from: number, to: number, shift = 0) =>
  Array.from({ length: 41 }, (_, index) => {
    const q = from + (index / 40) * (to - from);
    return `${px(q)},${py(profit(q) + shift)}`;
  }).join(" ");

export default function ProfitLimitsViz() {
  return (
    <SceneShell
      eyebrow="곡선의 꼭대기만으로는 모자랄 때"
      title="한도와 고정비를 넣으면 고를 수 있는 점이 바뀝니다"
      description="가로는 수량, 세로는 기본 수요·한계비용 7의 이익입니다. 생산 한도와 고정비는 이 글의 (가정)입니다."
      ariaLabel="생산 한도, 피할 수 있는 고정비, 이미 쓴 고정비에서 이익 곡선과 선택 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[470px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && <rect x={px(2)} y={T} width={px(6) - px(2)} height={H - T - B} fill="#94a3b8" fillOpacity={0.14} />}
          <line x1={L} x2={L} y1={T} y2={H - B} stroke="#94a3b8" strokeWidth={1} />
          <line x1={L} x2={W - R} y1={py(0)} y2={py(0)} stroke="#94a3b8" strokeWidth={1} />
          {[-10, 0, 9].map((tick) => <text key={tick} x={L - 5} y={py(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick < 0 ? `−${-tick}` : tick}</text>)}
          {[0, 1, 2, 3, 4, 5, 6].map((tick) => <text key={tick} x={px(tick)} y={H - 10} textAnchor="middle" fontSize={11} fill="#64748b">{tick}</text>)}

          {active === 0 && (
            <>
              <polyline points={curve(0, 2)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              <polyline points={curve(2, 6)} fill="none" stroke="#2563eb" strokeWidth={1} strokeDasharray="4 3" opacity={0.6} />
              <line x1={px(2)} x2={px(2)} y1={T} y2={H - B} stroke="#d97706" strokeWidth={1.25} />
              <text x={px(2) + 6} y={py(-6)} fontSize={12} fill="#64748b">한도 2를 넘어 만들 수 없음</text>
              <circle cx={px(3)} cy={py(9)} r={4} fill="none" stroke="#2563eb" strokeWidth={1} />
              <text x={px(3) + 8} y={py(9) - 4} fontSize={12} fill="#64748b">후보 3 · 이익 9</text>
              <circle cx={px(2)} cy={py(8)} r={4.5} fill="#d97706" />
              <text x={px(2) - 8} y={py(8) - 8} textAnchor="end" fontSize={12} fontWeight={700} fill="#d97706">수량 2 · 이익 8</text>
            </>
          )}
          {active === 1 && (
            <>
              <polyline points={curve(0, 6)} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
              <text x={px(3)} y={py(9) - 5} textAnchor="middle" fontSize={11} fill="#64748b">고정비 없을 때 9</text>
              <polyline points={curve(0.02, 6, -10)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              <circle cx={px(0)} cy={py(-10)} r={4} fill="#ffffff" stroke="#2563eb" strokeWidth={1} />
              <circle cx={px(3)} cy={py(-1)} r={4} fill="#2563eb" />
              <text x={px(3)} y={py(-1) + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">영업 최대 −1</text>
              <circle cx={px(0)} cy={py(0)} r={4.5} fill="#d97706" />
              <text x={px(0) + 8} y={py(0) - 7} fontSize={12} fontWeight={700} fill="#d97706">생산 안 함 0</text>
            </>
          )}
          {active === 2 && (
            <>
              <polyline points={curve(0, 6)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              <circle cx={px(3)} cy={py(9)} r={4.5} fill="#d97706" />
              <text x={px(3) + 8} y={py(9) - 4} fontSize={12} fontWeight={700} fill="#d97706">계속 영업: 추가로 9</text>
              <circle cx={px(0)} cy={py(0)} r={4} fill="#2563eb" />
              <text x={px(0) + 8} y={py(0) + 16} fontSize={12} fontWeight={700} fill="#2563eb">멈추면 추가로 0</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
