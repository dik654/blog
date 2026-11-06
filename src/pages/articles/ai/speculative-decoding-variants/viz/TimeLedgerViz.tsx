import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cost, #mtp-cost — 평균 1.85개 확정, 후보 비용 .016, 기록 정리 0(모두 가정).
 * v=1 → 1.85/1.016≈1.8209, v=1.5 → ≈1.2203, v=1.834 → 1, v=2 → ≈.9177.
 */
const SCENES = [
  { label: "검증 비용 1", v: 1, summary: "1.85 / 1.016 ≈ 1.82배", note: "회차 시간이 1.016이면 같은 1.85개를 평소대로 만드는 시간 1.85보다 짧아 약 1.82배입니다." },
  { label: "검증 비용 1.5", v: 1.5, summary: "1.85 / 1.516 ≈ 1.22배", note: "같은 후보와 수락률이어도 검증이 비싸지면 이득이 줄어듭니다. 막대의 끝이 점선에 다가갑니다." },
  { label: "검증 비용 1.834", v: 1.834, summary: "1.85 / 1.85 = 1배", note: "1.85 − .016 = 1.834가 경계입니다. 막대 끝이 점선과 만나 같은 시간이고, 검증 비용이 이보다 작을 때만 이득입니다." },
  { label: "검증 비용 2", v: 2, summary: "1.85 / 2.016 ≈ 0.92배", note: "검증이 단독 생성의 두 배면 막대가 점선을 넘어 약 0.92배입니다. 수락률이 높다는 사실만으로 빠르다고 결론낼 수 없습니다." },
] as const;

const USUAL = 1.85;
const DRAFT = 0.016;
const LEFT = 70;
const AXIS_W = 280;
const MAX = 2.2;
const x = (value: number) => LEFT + (value / MAX) * AXIS_W;

export default function TimeLedgerViz() {
  return (
    <SceneShell
      eyebrow="한 회차의 시간 장부"
      title="같은 1.85개를 만드는 시간과 회차 시간을 한 축에 놓습니다"
      description="평소 한 토큰 시간을 1로 둔 상대 시간이며, 막대 길이는 시간에 비례합니다. 아주 얇은 주황 칸이 후보 준비 .016입니다. 수치는 모두 설명을 위한 가정이고 기록 정리 시간은 0으로 둡니다."
      ariaLabel="검증 비용에 따른 회차 시간과 평소 생성 시간 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 356 132" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={2} y={38} fontSize={13} fontWeight={700} className="fill-foreground">평소대로</text>
            <rect x={LEFT} y={22} width={x(USUAL) - LEFT} height={24} rx={3} fill="#64748b" />
            <text x={x(USUAL) - 6} y={39} textAnchor="end" fontSize={13} fontWeight={700} fill="#ffffff">1.85개 = 1.85</text>
            <text x={2} y={84} fontSize={13} fontWeight={700} className="fill-foreground">새 방식</text>
            <rect x={LEFT} y={68} width={x(DRAFT) - LEFT} height={24} fill="#d97706" />
            <rect x={x(DRAFT)} y={68} width={x(DRAFT + scene.v) - x(DRAFT)} height={24} rx={3} fill="#2563eb" />
            <text x={x(DRAFT + scene.v) - 6} y={85} textAnchor="end" fontSize={13} fontWeight={700} fill="#ffffff">{`.016 + ${scene.v}`}</text>
            <line x1={x(USUAL)} x2={x(USUAL)} y1={14} y2={102} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" />
            <line x1={LEFT} x2={x(MAX)} y1={102} y2={102} stroke="#94a3b8" strokeWidth={1} />
            {[0, 1, 2].map((tick) => (
              <text key={tick} x={x(tick)} y={120} textAnchor="middle" fontSize={12} className="fill-muted-foreground">{tick}</text>
            ))}
            <text x={x(USUAL)} y={10} textAnchor="middle" fontSize={12} className="fill-muted-foreground">이득 경계</text>
          </svg>
        );
      }}
    />
  );
}
