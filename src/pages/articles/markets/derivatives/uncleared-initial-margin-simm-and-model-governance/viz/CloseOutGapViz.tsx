import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview — 오늘 평가손실 2.5는 변동증거금이 따라가고,
 * 상대방이 부도난 뒤 계약을 닫고 새 거래로 바꾸는 동안 더 생길 수 있는 손실은 개시증거금이 맡는다.
 * 숫자는 2.5 하나뿐이라 세로 높이는 금액 축척이 아니며, 추가 손실의 폭은 본문에 없어 "크기 미정"으로 둔다.
 */
const SCENES = [
  { label: "오늘: 평가손실 2.5", summary: "현재 노출 2.5", note: "비청산 스왑의 오늘 평가손실이 2.5입니다. 지금 계약을 닫으면 메워야 할 금액이 현재 노출입니다." },
  { label: "변동증거금이 따라갑니다", summary: "VM 2.5 → 현재 노출을 메움", note: "변동증거금은 이 현재 노출을 따라 움직입니다. 오늘 시장가치의 차이만큼 담보가 오가므로 오늘까지의 손실은 메워집니다." },
  { label: "내일 상대방이 부도나면", summary: "닫고 바꾸는 동안 시장이 더 움직임", note: "상대방이 내일 부도나면 계약을 닫고 새 거래로 바꾸는 데 시간이 걸립니다. 그 사이 시장이 더 불리하게 움직일 수 있고, 이 몫은 오늘의 변동증거금에 들어 있지 않습니다. 이 폭은 본문에 숫자가 없어 크기를 적지 않았습니다." },
  { label: "개시증거금은 미리 떼어 둡니다", summary: "IM = 잠재 미래 노출의 담보", note: "개시증거금은 계약금이나 예상 최대손실이 아니라, 정해진 신뢰수준·기간·스트레스 자료로 계산한 잠재 미래 노출을 부도 전에 담보로 떼어 두는 장치입니다. 8절의 국제 기준은 매일 변동증거금을 주고받는 경우 이 노출을 한쪽 꼬리 99%·10일로 잡는 것을 출발점으로 둡니다." },
] as const;

const BASE = 168;
const DEFAULT_X = 168;

export default function CloseOutGapViz() {
  return (
    <SceneShell
      eyebrow="두 증거금의 시간"
      title="변동증거금은 오늘까지, 개시증거금은 부도 뒤의 빈 시간을 맡습니다"
      description="가로는 사건의 순서이고 칸 너비는 실제 기간이 아닙니다. 세로 높이도 금액 축척이 아닙니다(가정). 변동증거금(VM)은 오늘 시장가치 차이를 메우는 담보, 개시증거금(IM)은 앞으로 생길 수 있는 손실에 대비해 먼저 떼어 두는 담보입니다."
      ariaLabel="오늘 평가손실 2.5를 변동증거금이 메우고, 부도 뒤 계약 종료와 대체 기간의 추가 손실을 개시증거금이 맡는 순서"
      scenes={SCENES}
      render={(active) => {
        const vmPaid = active >= 1;
        const gap = active >= 2;
        const im = active >= 3;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={66} y={18} textAnchor="middle" fontSize={11} fill="#64748b">오늘</text>
            <text x={DEFAULT_X} y={18} textAnchor="middle" fontSize={11} fontWeight={gap ? 700 : 400} fill={gap ? "#b91c1c" : "#94a3b8"}>내일 부도</text>
            <text x={262} y={18} textAnchor="middle" fontSize={11} fill={gap ? "#64748b" : "#cbd5e1"}>닫고 새 거래로 바꾸는 동안</text>
            <line x1={DEFAULT_X} x2={DEFAULT_X} y1={26} y2={BASE} stroke={gap ? "#b91c1c" : "#cbd5e1"} strokeWidth={1} strokeDasharray="3 3" />
            <line x1={340} x2={340} y1={26} y2={BASE} stroke={gap ? "#94a3b8" : "#e2e8f0"} strokeWidth={1} strokeDasharray="3 3" />

            <rect x={44} y={118} width={44} height={BASE - 118} rx={2} fill={vmPaid ? "#2563eb" : "#dc2626"} fillOpacity={vmPaid ? 0.75 : 0.22} stroke={vmPaid ? "#2563eb" : "#dc2626"} strokeWidth={1} />
            <text x={66} y={110} textAnchor="middle" fontSize={11} fontWeight={700} fill={vmPaid ? "#1d4ed8" : "#b91c1c"}>{vmPaid ? "VM 2.5로 메움" : "평가손실 2.5"}</text>

            {im && (
              <g>
                <rect x={104} y={92} width={44} height={BASE - 92} rx={2} fill="#d97706" fillOpacity={0.25} stroke="#d97706" strokeWidth={1} />
                <text x={126} y={84} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">IM</text>
                <text x={126} y={135} textAnchor="middle" fontSize={10} fill="#92400e">미리</text>
                <text x={126} y={148} textAnchor="middle" fontSize={10} fill="#92400e">떼어 둠</text>
                <path d={`M148 112 C 190 112, 210 120, 236 128`} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
              </g>
            )}

            {gap && (
              <g>
                <polygon points={`${DEFAULT_X},${BASE} 336,62 336,${BASE}`} fill="#dc2626" fillOpacity={im ? 0.1 : 0.16} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
                <text x={300} y={150} textAnchor="middle" fontSize={10} fill="#b91c1c">더 생길 수 있는</text>
                <text x={300} y={162} textAnchor="middle" fontSize={10} fill="#b91c1c">손실 (크기 미정)</text>
              </g>
            )}

            <line x1={20} x2={348} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <text x={20} y={188} fontSize={10} fill="#64748b">현재 노출</text>
            <text x={348} y={188} textAnchor="end" fontSize={10} fill={gap ? "#64748b" : "#cbd5e1"}>잠재 미래 노출</text>
          </svg>
        );
      }}
    />
  );
}
