import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 다섯째 문단 — 평균 왕복 500ns(가정) 동안 1TB/s를 지속하려면
 * 10¹² B/s × 500×10⁻⁹ s = 500,000B(500KB)가 처리 중이어야 한다. 768B는 그중 0.1536%.
 * 통로의 길이는 왕복 시간, 칠해진 길이는 처리 중인 바이트다.
 */
const LATENCY_NS = 500;
const BW_BYTES_PER_NS = 1000; // 1TB/s = 1000 B/ns
const NEEDED = LATENCY_NS * BW_BYTES_PER_NS; // 500,000
const CASE_BYTES = 768;
const CASE_SHARE = (CASE_BYTES / NEEDED) * 100; // 0.1536

const W = 400;
const H = 150;
const PX = 16;
const PW = W - 2 * PX;
const PY = 50;
const PH = 30;

const PIPE = "#94a3b8";
const FILL = "#2563eb";
const CASE = "#d97706";
const TEXT = "#64748b";

const SCENES = [
  { label: "한 요청의 왕복", summary: "평균 500ns (가정)", note: "요청을 보내고 값이 돌아오기까지 평균 500ns가 걸린다고 놓습니다. 통로의 왼쪽 끝에서 보낸 요청은 오른쪽 끝에 닿아야 끝납니다." },
  { label: "1TB/s를 지속하려면", summary: "1TB/s × 500ns = 500KB", note: "매 순간 1TB/s로 값이 돌아오려면 500ns 동안 보낸 요청이 모두 통로 안에 있어야 합니다. 처리량 × 평균 대기 시간 = 평균 500,000바이트가 처리 중이어야 합니다." },
  { label: "64개 예의 768바이트", summary: "768 ÷ 500,000 ≈ 0.15%", note: "64개 덧셈의 768바이트를 한꺼번에 보내도 통로의 약 0.15%만 찹니다. 이 정상 상태를 채울 수 없으므로, 독립 요청을 늘리지 못하면 대역폭보다 지연이 성능을 제한합니다." },
] as const;

export default function BytesInFlightViz() {
  return (
    <SceneShell
      eyebrow="처리 중인 데이터량"
      title="1TB/s를 유지하려면 왕복 500ns 동안 500KB가 통로에 있어야 합니다"
      description="가로 막대는 요청이 갔다 돌아오는 통로이고, 길이는 평균 왕복 시간입니다. 칠해진 부분은 그 순간 처리 중인 바이트입니다."
      note="500ns와 1TB/s는 이 글의 연습용 가정입니다. 평균값으로 계산한 정상 상태이며, 실제 요청 하나하나의 지연은 다를 수 있습니다. 768B의 실제 폭(0.15%)은 1px보다 좁아 눈에 보이도록 최소 폭으로 그렸습니다."
      ariaLabel="평균 왕복 500나노초 동안 1테라바이트 매초를 지속하는 데 필요한 처리 중 데이터량과 768바이트의 비교"
      scenes={SCENES}
      render={(active) => {
        const fillW = active === 1 ? PW : active === 2 ? Math.max(2, (PW * CASE_SHARE) / 100) : 0;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={PX} y={PY - 14} fontSize={12.5} fill={TEXT}>요청 보냄</text>
            <text x={PX + PW} y={PY - 14} textAnchor="end" fontSize={12.5} fill={TEXT}>값 돌아옴</text>
            <rect x={PX} y={PY} width={PW} height={PH} rx={4} fill="#f1f5f9" stroke={PIPE} strokeWidth={1} />
            {fillW > 0 && (
              <rect x={PX} y={PY} width={fillW} height={PH} rx={active === 1 ? 4 : 1} fill={active === 1 ? FILL : CASE} opacity={active === 1 ? 0.35 : 0.9} />
            )}
            {active === 1 && (
              <text x={PX + PW / 2} y={PY + PH / 2 + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill={FILL}>처리 중 500,000B = 500KB</text>
            )}
            {active === 2 && (
              <>
                <line x1={PX + fillW / 2} x2={PX + fillW / 2} y1={PY + PH} y2={PY + PH + 18} stroke={CASE} strokeWidth={1} />
                <text x={PX} y={PY + PH + 32} fontSize={13} fontWeight={700} fill={CASE}>768B · 약 0.15%</text>
                <text x={PX + PW} y={PY + PH / 2 + 4} textAnchor="end" fontSize={12.5} fill={TEXT}>나머지는 비어 있음</text>
              </>
            )}
            <line x1={PX} x2={PX + PW} y1={H - 22} y2={H - 22} stroke={PIPE} strokeWidth={1} />
            <line x1={PX} x2={PX} y1={H - 26} y2={H - 18} stroke={PIPE} strokeWidth={1} />
            <line x1={PX + PW} x2={PX + PW} y1={H - 26} y2={H - 18} stroke={PIPE} strokeWidth={1} />
            <text x={PX + PW / 2} y={H - 6} textAnchor="middle" fontSize={12.5} fill={TEXT}>평균 왕복 {LATENCY_NS}ns (가정)</text>
          </svg>
        );
      }}
    />
  );
}
