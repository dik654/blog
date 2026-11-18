import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 주문 100건×2KB = 200KB, 사진 1,000장×2MB = 2GB.
 * 2GB ÷ 200KB = 10,000이므로 넓이를 같은 축척으로 그리면 한 변의 비는 100:1입니다.
 * 큰 정사각형 한 변 180 → 주문 정사각형 한 변 1.8.
 */
const SIDE = 180;
const ORDER_SIDE = SIDE / 100;

const SCENES = [
  {
    label: "한 데이터베이스에 넣으면",
    summary: "2GB + 200KB",
    note: "사진 1,000장(2GB)을 주문 행 안에 넣으면 데이터베이스가 담는 양은 약 2GB가 되고, 주문 100건(200KB)은 그중 1만분의 1입니다. 넓이를 같은 축척으로 그려서 주문은 왼쪽 위의 작은 점으로만 보입니다. 본문은 이때 백업과 질의가 무거워진다고 봅니다.",
  },
  {
    label: "둘로 나누면",
    summary: "DB 200KB · 객체 2GB",
    note: "주문은 거래와 인덱스가 필요한 데이터베이스에, 사진은 객체 저장소에 둡니다. 축척은 앞 장면과 같아서 데이터베이스는 작은 점만큼만 남고, 주문 행에는 사진 주소와 버전만 적어 객체를 가리킵니다.",
  },
] as const;

export default function StorageSplitViz() {
  return (
    <SceneShell
      eyebrow="같은 축척의 넓이"
      title="주문 200KB와 사진 2GB를 한곳에 두면 주문이 보이지 않습니다"
      description="넓이가 저장량입니다. 3절의 가정(주문 한 건 2KB, 사진 한 장 2MB)을 그대로 씁니다."
      ariaLabel="주문 200킬로바이트와 사진 2기가바이트를 한 데이터베이스에 넣을 때와 나눌 때의 넓이 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 ? (
            <g>
              <rect x={14} y={22} width={SIDE} height={SIDE} rx={4} fill="#94a3b8" fillOpacity={0.35} stroke="#64748b" strokeWidth={1} />
              <text x={14} y={14} fontSize={11} fontWeight={700} fill="#475569">데이터베이스 ≈ 2GB</text>
              <text x={14 + SIDE / 2} y={22 + SIDE / 2 + 4} textAnchor="middle" fontSize={11} fill="#475569">사진 바이트 2GB</text>
              <rect x={14} y={22} width={ORDER_SIDE} height={ORDER_SIDE} fill="#2563eb" />
              <circle cx={14 + ORDER_SIDE / 2} cy={22 + ORDER_SIDE / 2} r={6} fill="none" stroke="#2563eb" strokeWidth={1} />
              <line x1={20} y1={24} x2={214} y2={46} stroke="#2563eb" strokeWidth={1} />
              <text x={218} y={44} fontSize={11} fontWeight={700} fill="#2563eb">주문 100건 200KB</text>
              <text x={218} y={60} fontSize={11} fill="#64748b">전체의 1만분의 1</text>
              <text x={218} y={110} fontSize={11} fill="#64748b">백업과 질의가</text>
              <text x={218} y={126} fontSize={11} fill="#64748b">무거워짐</text>
            </g>
          ) : (
            <g>
              <rect x={166} y={22} width={SIDE} height={SIDE} rx={4} fill="#94a3b8" fillOpacity={0.35} stroke="#64748b" strokeWidth={1} />
              <text x={166} y={14} fontSize={11} fontWeight={700} fill="#475569">객체 저장소 2GB</text>
              <text x={166 + SIDE / 2} y={22 + SIDE / 2 - 4} textAnchor="middle" fontSize={11} fill="#475569">사진 1,000장</text>
              <text x={166 + SIDE / 2} y={22 + SIDE / 2 + 12} textAnchor="middle" fontSize={11} fill="#475569">키로 객체 전체</text>
              <rect x={14} y={22} width={ORDER_SIDE} height={ORDER_SIDE} fill="#2563eb" />
              <circle cx={14 + ORDER_SIDE / 2} cy={22 + ORDER_SIDE / 2} r={6} fill="none" stroke="#2563eb" strokeWidth={1} />
              <text x={26} y={26} fontSize={11} fontWeight={700} fill="#2563eb">DB 200KB</text>
              <line x1={15} y1={28} x2={15} y2={58} stroke="#2563eb" strokeWidth={1} strokeDasharray="2 2" />
              <rect x={10} y={58} width={136} height={112} rx={6} fill="none" stroke="#2563eb" strokeWidth={1} />
              <text x={18} y={74} fontSize={10} fill="#64748b">확대: 주문 행</text>
              {[0, 1, 2].map((row) => (
                <g key={row}>
                  <rect x={18} y={82 + row * 28} width={120} height={22} rx={3} fill="#2563eb" fillOpacity={0.08} stroke="#2563eb" strokeWidth={1} />
                  <text x={24} y={97 + row * 28} fontSize={10} fill="#1e3a8a">{`주문 ${row + 1} · 주소+버전`}</text>
                  <line x1={138} y1={93 + row * 28} x2={176} y2={60 + row * 30} stroke="#2563eb" strokeWidth={1} />
                  <circle cx={176} cy={60 + row * 30} r={2.5} fill="#2563eb" />
                </g>
              ))}
              <text x={10} y={190} fontSize={10} fill="#64748b">행 세 개만 그림 · 주문은 100건</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
