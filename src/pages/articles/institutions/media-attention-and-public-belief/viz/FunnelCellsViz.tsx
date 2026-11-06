import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 노출 1,000 → 클릭 20(20÷1,000=2%) → 구매 2(2÷20=10%), 광고비 1만 원. 모두 가정.
 * 클릭 칸의 자리는 세기 위한 임의 배치다.
 */
const CLICKS = new Set(Array.from({ length: 20 }, (_, index) => (index * 389 + 17) % 1000));

const SCENES = [
  { label: "노출 1천 회", summary: "1,000칸", note: "칸 하나가 광고 노출 1회입니다. 같은 사람에게 여러 번 나갔을 수 있으므로 1천 명이라는 뜻은 아닙니다." },
  { label: "그중 클릭 20번", summary: "20 ÷ 1,000 = 2%", note: "진한 칸이 기록된 클릭입니다. 자리는 임의로 놓았습니다. 이 비율의 분모는 노출 1,000입니다." },
  { label: "분모를 바꿔 구매 2건", summary: "2 ÷ 20 = 10%", note: "이번 분모는 클릭 20입니다. 같은 2건을 노출 1,000으로 나누면 0.2%이므로, 10%를 노출 기준으로 읽으면 안 됩니다. 클릭 칸만 크게 옮겨 그렸습니다." },
  { label: "돈과 결과의 방향", summary: "플랫폼 1만 원 · 광고주 판매 2건", note: "플랫폼은 약정대로 노출을 제공해 1만 원을 받고, 광고주는 상품 판매의 결과를 봅니다." },
  { label: "아직 모르는 것", summary: "이익과 추가 효과", note: "추가 효과는 광고가 없었으면 일어나지 않았을 구매입니다. 매출을 알아도 원가와 광고비를 빼야 이익이 나오고, 2건이 추가 효과인지는 이 숫자만으로 알 수 없습니다." },
] as const;

function Box({ x, y, w, label }: { x: number; y: number; w: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={36} rx={8} fill="none" stroke="#64748b" strokeWidth={1} />
      <text x={x + w / 2} y={y + 23} textAnchor="middle" fontSize={13} fontWeight={700} fill="#64748b">{label}</text>
    </g>
  );
}

const CHIPS = [
  { x: 6, w: 70, label: "매출 ?", op: "−" },
  { x: 92, w: 70, label: "원가 ?", op: "−" },
  { x: 178, w: 92, label: "광고비 1만 원", op: "=" },
  { x: 286, w: 68, label: "이익 ?", op: "" },
] as const;

export default function FunnelCellsViz() {
  return (
    <SceneShell
      eyebrow="분모 구별"
      title="1천 회에서 20번, 20번에서 2건으로 분모가 바뀝니다"
      description="광고 1천 회, 클릭 20번, 구매 2건, 광고비 1만 원은 모두 가정입니다."
      ariaLabel="광고 노출, 클릭, 구매를 칸으로 세고 돈의 방향과 남은 질문을 확인"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 176" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active <= 1 &&
            Array.from({ length: 1000 }, (_, index) => {
              const on = active === 1 && CLICKS.has(index);
              return <rect key={index} x={15 + (index % 50) * 6.6} y={16 + Math.floor(index / 50) * 7.2} width={5.4} height={5.8} fill={on ? "#2563eb" : "#94a3b8"} opacity={on ? 1 : active === 1 ? 0.28 : 0.6} />;
            })}
          {active === 2 && (
            <>
              <text x={30} y={22} fontSize={13} fontWeight={700} fill="#64748b">클릭 20번 (새 분모)</text>
              {Array.from({ length: 20 }, (_, index) => (
                <rect key={index} x={30 + (index % 10) * 30} y={34 + Math.floor(index / 10) * 34} width={26} height={30} rx={3} fill={index < 2 ? "#d97706" : "#2563eb"} opacity={index < 2 ? 1 : 0.35} />
              ))}
              <rect x={30} y={120} width={12} height={12} rx={2} fill="#d97706" />
              <text x={48} y={131} fontSize={13} fontWeight={700} fill="#d97706">기록된 구매 2건</text>
            </>
          )}
          {active === 3 && (
            <>
              <Box x={12} y={22} w={92} label="광고주" />
              <Box x={256} y={22} w={92} label="플랫폼" />
              <Box x={12} y={124} w={92} label="구매 기록" />
              <line x1={104} x2={250} y1={32} y2={32} stroke="#16a34a" strokeWidth={1} />
              <path d="M256 32 l-7 -4 v8 z" fill="#16a34a" />
              <text x={180} y={25} textAnchor="middle" fontSize={13} fontWeight={700} fill="#16a34a">1만 원</text>
              <line x1={110} x2={256} y1={50} y2={50} stroke="#2563eb" strokeWidth={1} />
              <path d="M104 50 l7 -4 v8 z" fill="#2563eb" />
              <text x={180} y={67} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">노출 1천 회 제공</text>
              <line x1={58} x2={58} y1={124} y2={64} stroke="#d97706" strokeWidth={1} />
              <path d="M58 58 l-4 7 h8 z" fill="#d97706" />
              <text x={68} y={97} fontSize={13} fontWeight={700} fill="#d97706">2건 · 상품 판매 결과</text>
            </>
          )}
          {active === 4 && (
            <>
              {CHIPS.map((chip) => (
                <g key={chip.label}>
                  <rect x={chip.x} y={20} width={chip.w} height={34} rx={8} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray={chip.label.includes("?") ? "3 3" : undefined} />
                  <text x={chip.x + chip.w / 2} y={42} textAnchor="middle" fontSize={13} fontWeight={700} fill="#64748b">{chip.label}</text>
                  {chip.op && <text x={chip.x + chip.w + 8} y={42} textAnchor="middle" fontSize={14} fill="#64748b">{chip.op}</text>}
                </g>
              ))}
              {[0, 1].map((slot) => (
                <g key={slot}>
                  <rect x={40 + slot * 44} y={84} width={36} height={44} rx={3} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
                  <text x={58 + slot * 44} y={112} textAnchor="middle" fontSize={16} fontWeight={700} fill="#d97706">?</text>
                </g>
              ))}
              <text x={140} y={102} fontSize={13} fontWeight={700} fill="#64748b">구매 2건은 전부</text>
              <text x={140} y={120} fontSize={13} fontWeight={700} fill="#64748b">광고 때문에 생겼을까요?</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
