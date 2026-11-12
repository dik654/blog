import SceneShell from "./SceneShell";

/**
 * 본문 대응: TaskMapping.tsx ProgressiveDetail — 두 벡터를 그냥 이어 붙이면 한쪽이 거리 계산을 지배한다.
 * 모든 숫자는 설명용 가정. 제곱 거리 = 부분별 차이 제곱의 합.
 * 이어 붙임: 3.0² + 0.4² = 9.00 + 0.16 = 9.16 (자기지도 쪽 ≈ 98%).
 * 정렬 쪽 차이 두 배: 9.00 + 0.64 = 9.64 → 9.16 대비 ≈ +5%.
 * 자기지도 쪽을 7.5로 나눔: 0.4² + 0.4² = 0.16 + 0.16 = 0.32 (각 50%).
 */
const SCENES = [
  {
    label: "벡터 두 개를 잇기",
    summary: "[ 자기지도 | 정렬 ] 한 줄",
    note: "두 상품 사진의 벡터를 자기지도 부분과 정렬 부분으로 이어 붙였다고 하겠습니다(가정). 두 사진의 차이가 자기지도 부분에서 3.0, 정렬 부분에서 0.4입니다. 값의 크기 단위가 두 부분에서 다르다고 둔 가정입니다.",
    ssl: 3.0,
    text: 0.4,
    scale: 1,
  },
  {
    label: "거리에 들어가는 몫",
    summary: "9.00 + 0.16 = 9.16",
    note: "제곱 거리는 부분별 차이를 제곱해 더한 값입니다. 9.16 가운데 9.00, 약 98%가 자기지도 부분에서 옵니다.",
    ssl: 3.0,
    text: 0.4,
    scale: 1,
  },
  {
    label: "정렬 쪽 차이가 두 배",
    summary: "9.00 + 0.64 = 9.64 · 약 +5%",
    note: "정렬 부분의 차이가 0.4에서 0.8로 두 배가 돼도 전체는 9.16에서 9.64로 약 5%만 늡니다. 이 가정에서는 값이 큰 쪽이 거리를 사실상 정합니다.",
    ssl: 3.0,
    text: 0.8,
    scale: 1,
  },
  {
    label: "스케일을 맞추면",
    summary: "0.16 + 0.16 = 0.32 · 배율 7.5",
    note: "자기지도 부분을 7.5로 나누면 두 몫이 0.16씩 같아집니다. 대신 7.5라는 배율이 새로 정해야 할 조정값이 됩니다. 본문이 그냥 이어 붙이는 방식을 피하는 편이 낫다고 하는 이유 중 하나입니다.",
    ssl: 3.0,
    text: 0.4,
    scale: 7.5,
  },
] as const;

const W = 360;
const H = 188;
const BAR_L = 92;
const BAR_R = 300;
const SSL_COLOR = "#2563eb";
const TEXT_COLOR = "#d97706";

export default function ConcatScaleViz() {
  return (
    <SceneShell
      eyebrow="벡터 이어 붙이기"
      title="이어 붙인 벡터에서는 값이 큰 쪽이 거리를 좌우하기 쉽습니다"
      description="두 사진 사이 제곱 거리가 두 부분에서 각각 얼마씩 오는지 봅니다. 막대는 합계를 100%로 둔 몫이고, 모든 숫자는 설명용 가정입니다."
      ariaLabel="자기지도와 정렬 벡터를 이어 붙였을 때 제곱 거리의 부분별 몫"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const sslDiff = scene.ssl / scene.scale;
        const sslSq = sslDiff ** 2;
        const textSq = scene.text ** 2;
        const total = sslSq + textSq;
        const showSq = active >= 1;
        const px = (value: number) => (value / total) * (BAR_R - BAR_L);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={8} y={18} fontSize={12} fontWeight={700} fill="#475569">이어 붙인 한 벡터</text>
            <rect x={8} y={28} width={200} height={26} rx={4} fill={SSL_COLOR} fillOpacity={0.14} stroke={SSL_COLOR} strokeWidth={1} />
            <text x={108} y={45} textAnchor="middle" fontSize={12} fill="#1d4ed8">
              {scene.scale === 1 ? "자기지도 부분" : "자기지도 부분 ÷ 7.5"}
            </text>
            <rect x={208} y={28} width={144} height={26} rx={4} fill={TEXT_COLOR} fillOpacity={0.14} stroke={TEXT_COLOR} strokeWidth={1} />
            <text x={280} y={45} textAnchor="middle" fontSize={12} fill="#b45309">정렬 부분</text>

            <text x={8} y={80} fontSize={12} fill="#475569">두 사진의 차이</text>
            <text x={108} y={80} textAnchor="middle" fontSize={13} fontWeight={700} fill="#1d4ed8">{sslDiff.toFixed(1)}</text>
            <text x={280} y={80} textAnchor="middle" fontSize={13} fontWeight={700} fill="#b45309">{scene.text.toFixed(1)}</text>

            <text x={8} y={114} fontSize={12} fill="#475569">거리 속 몫</text>
            {showSq ? (
              <>
                <rect x={BAR_L} y={102} width={px(sslSq)} height={16} fill={SSL_COLOR} fillOpacity={0.8} />
                <rect x={BAR_L + px(sslSq)} y={102} width={Math.max(px(textSq), 1)} height={16} fill={TEXT_COLOR} />
                <line x1={BAR_L} x2={BAR_L} y1={98} y2={122} stroke="#94a3b8" strokeWidth={1} />
                <text x={BAR_L} y={140} fontSize={12} fill="#1d4ed8">자기지도 {sslSq.toFixed(2)}</text>
                <text x={BAR_R} y={140} textAnchor="end" fontSize={12} fill="#b45309">정렬 {textSq.toFixed(2)}</text>
                <text x={8} y={170} fontSize={12} fontWeight={700} fill="#0f172a">
                  합계 {total.toFixed(2)} · 자기지도 몫 {Math.round((sslSq / total) * 100)}%
                </text>
              </>
            ) : (
              <text x={BAR_L} y={114} fontSize={12} fill="#94a3b8">다음 장면에서 제곱해 더합니다</text>
            )}
          </svg>
        );
      }}
    />
  );
}
