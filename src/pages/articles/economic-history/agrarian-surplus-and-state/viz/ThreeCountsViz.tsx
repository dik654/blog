import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 창고 1180(실물), 장부 1200(기록), 약속 100+50+1000(미래 몫)은 같은 종류의 대상이 아니다.
 * 1200 − 1150 = 50(장부 잔량), 1180 − 1150 = 30(실물 잔량), 1200 − 1180 = 20(차이). 모두 이 글의 가정 사례.
 * 축척: 1자루 = 340/1200 SVG 단위.
 */
const X0 = 10;
const FULL = 340;
const sx = (value: number) => (value / 1200) * FULL;

const SCENES = [
  { label: "창고 안의 곡물", summary: "실물 1180자루", focus: 0, note: "손으로 세어 나오는 물리적인 재고입니다. 썩으면 줄어들고, 장부에 무엇이 적혔는지와 상관없이 그만큼만 있습니다." },
  { label: "장부 위의 숫자", summary: "기록 1200자루", focus: 1, note: "과거에 100가구가 낸 거래를 적은 숫자입니다. 곡물이 줄어도 누가 고쳐 쓰지 않으면 이 숫자는 그대로입니다." },
  { label: "앞으로 받을 약속", summary: "종자 100 + 비상 50 + 지급 1000", focus: 2, note: "종자 100자루와 노동 대가 1000자루를 받을 권리는 미래 배분에 대한 사회적 약속입니다. 배정한 1150 뒤의 빈칸은 아직 어떤 항목에도 배정하지 않은 장부 잔량 50입니다." },
  { label: "세 줄을 맞대 봅니다", summary: "장부 잔량 50 · 실물 잔량 30 · 차이 20", focus: 3, note: "세로 점선이 배정 합계 1150입니다. 실물 끝이 장부 끝보다 20자루 짧습니다. 창고·장부·약속 세 줄이 서로 맞아야 하지만 같은 종류의 대상은 아니고, 차이가 생겼을 때 누구의 몫부터 줄이는지는 이 그림이 답하지 않는 권력의 문제입니다." },
] as const;

const ROWS = [
  { y: 26, label: "창고 · 실물 재고" },
  { y: 84, label: "장부 · 과거 기록" },
  { y: 142, label: "약속 · 미래의 몫" },
] as const;
const BAR_H = 22;

export default function ThreeCountsViz() {
  return (
    <SceneShell
      eyebrow="세 층의 숫자"
      title="창고·장부·약속을 같은 자로 잽니다"
      description="막대 길이는 자루 수에 비례합니다. 1200자루 사례는 유물의 번역이 아니라 이 글의 가정입니다."
      ariaLabel="창고 1180자루, 장부 1200자루, 약속 1150자루와 잔량 50을 같은 축척으로 비교"
      scenes={SCENES}
      render={(active) => {
        const focus = SCENES[active].focus;
        const on = (row: number) => focus === 3 || focus === row;
        const compare = focus === 3;
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {ROWS.map((row, index) => (
              <text key={row.label} x={X0} y={row.y - 7} fontSize={12} fontWeight={700} fill="currentColor" opacity={on(index) ? 1 : 0.35}>{row.label}</text>
            ))}
            <g opacity={on(0) ? 1 : 0.25}>
              <rect x={X0} y={ROWS[0].y} width={sx(1180)} height={BAR_H} fill="#64748b" />
              {compare && <rect x={X0 + sx(1180)} y={ROWS[0].y} width={sx(20)} height={BAR_H} fill="none" stroke="#dc2626" strokeDasharray="2 2" />}
              <text x={X0 + 8} y={ROWS[0].y + 16} fontSize={12} fontWeight={700} fill="#ffffff">1180</text>
            </g>
            <g opacity={on(1) ? 1 : 0.25}>
              <rect x={X0} y={ROWS[1].y} width={sx(1200)} height={BAR_H} fill="#2563eb" />
              <text x={X0 + 8} y={ROWS[1].y + 16} fontSize={12} fontWeight={700} fill="#ffffff">1200</text>
            </g>
            <g opacity={on(2) ? 1 : 0.25}>
              <rect x={X0} y={ROWS[2].y} width={sx(100)} height={BAR_H} fill="#16a34a" />
              <rect x={X0 + sx(100)} y={ROWS[2].y} width={sx(50)} height={BAR_H} fill="#d97706" />
              <rect x={X0 + sx(150)} y={ROWS[2].y} width={sx(1000)} height={BAR_H} fill="#475569" />
              <rect x={X0 + sx(1150)} y={ROWS[2].y} width={sx(50)} height={BAR_H} fill="none" stroke="#94a3b8" strokeDasharray="2 2" />
              <text x={X0 + sx(150) + 8} y={ROWS[2].y + 16} fontSize={12} fontWeight={700} fill="#ffffff">지급 1000</text>
              <text x={X0} y={ROWS[2].y + BAR_H + 15} fontSize={11} fill="#64748b">앞부터 종자 100 · 비상 50 · 지급 1000 · 빈칸 50</text>
            </g>
            {compare && (
              <>
                <line x1={X0 + sx(1150)} x2={X0 + sx(1150)} y1={ROWS[0].y - 4} y2={ROWS[2].y + BAR_H} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
                <text x={X0 + sx(1150) - 4} y={ROWS[0].y + BAR_H + 14} textAnchor="end" fontSize={11} fontWeight={700} fill="#dc2626">점선 1150 뒤 실물 30 · 점선칸이 차이 20</text>
                <text x={X0 + sx(1150) - 4} y={ROWS[1].y + BAR_H + 14} textAnchor="end" fontSize={11} fontWeight={700} fill="#dc2626">점선 1150 뒤 장부 잔량 50</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
