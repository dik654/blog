import SceneShell from "./SceneShell";

/**
 * 본문 대응: #rlcd — rlcd_loss 작은 예. logit (no 0.0, yes 0.4), σ=0.4, 표본 2개 a=±0.3.
 * 가로축 d = yes logit − no logit. 현재 0.4, 표본1 0.7−(−0.3)=1.0, 표본2 0.1−0.3=−0.2.
 * yes 확률 σ(d): 0.599, 0.731, 0.450. 보상 0.391, −0.323, 평균 0.034, advantage ±0.707.
 */
const SCENES = [
  { label: "현재 logit", summary: "yes − no = 0.4 → yes 0.599", note: "가로축은 yes logit에서 no logit을 뺀 값 d입니다. 오른쪽일수록 yes 확률이 큽니다. 현재 logit (no 0.0, yes 0.4)은 d=0.4, yes 확률 0.599입니다." },
  { label: "평균 0 noise로 표본 2개", summary: "d = 1.0 · d = −0.2", note: "선택지 두 개에 (−a, +a)를 더합니다. 표본1은 a=+0.3이라 d가 0.6 늘어 1.0(yes 0.731), 표본2는 a=−0.3이라 0.6 줄어 −0.2(yes 0.450)입니다." },
  { label: "표본마다 보상", summary: "0.391 · −0.323 (평균 0.034)", note: "정답이 yes이므로 log + 0.75·구면 보상은 yes 확률이 큰 표본1에서 0.391, 표본2에서 −0.323입니다." },
  { label: "평균과 비교", summary: "advantage +0.707 · −0.707", note: "advantage는 표본 보상에서 평균 0.034를 빼고 표준편차로 나눈 값으로, 평균보다 얼마나 나은지를 뜻합니다. 표본1은 +, 표본2는 −입니다." },
  { label: "logit을 옮기는 방향", summary: "둘 다 yes 쪽(오른쪽)", note: "손실은 + 표본 쪽으로 끌고 − 표본의 반대쪽으로 밉니다. 표본1은 오른쪽에, 표본2는 왼쪽에 있으므로 두 힘이 모두 d를 오른쪽, 곧 yes logit을 올리는 쪽으로 향합니다. 얼마나 옮기는지는 그리지 않았습니다." },
] as const;

const W = 360;
const L = 30;
const R = 330;
const AXIS_Y = 110;
const dx = (d: number) => L + ((d + 0.6) / 2) * (R - L);
const SAMPLES = [
  { name: "표본1", d: 1.0, p: "0.731", reward: "0.391", adv: "+0.707", color: "#16a34a" },
  { name: "표본2", d: -0.2, p: "0.450", reward: "−0.323", adv: "−0.707", color: "#dc2626" },
] as const;

export default function RlcdSampleViz() {
  return (
    <SceneShell
      eyebrow="표본 2개짜리 작은 예 (코드 기본값은 4개)"
      title="좋은 표본 쪽으로 끌고 나쁜 표본에서 밀면 둘 다 yes logit을 올립니다"
      description="아래 절차의 note에 있는 숫자를 수직선 하나에 올렸습니다. 정답은 yes이고 noise 크기 σ=0.4, 표본 noise ±0.3은 그 예의 값입니다."
      ariaLabel="RLCD 한 batch에서 표본 두 개의 위치, 보상, advantage와 logit 이동 방향"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} 210`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={L} x2={R} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
          {[-0.5, 0, 0.5, 1].map((t) => (
            <g key={t}>
              <line x1={dx(t)} x2={dx(t)} y1={AXIS_Y - 3} y2={AXIS_Y + 3} stroke="#94a3b8" strokeWidth={1} />
              <text x={dx(t)} y={AXIS_Y + 15} textAnchor="middle" fontSize={9} fill="#94a3b8">{t}</text>
            </g>
          ))}
          <text x={L} y={14} fontSize={10} fill="#64748b">가로축 d = yes logit − no logit (오른쪽일수록 yes)</text>
          {SAMPLES.map((s) => {
            const on = active >= 1;
            return (
              <g key={s.name} opacity={on ? 1 : 0}>
                <path d={`M${dx(0.4)} ${AXIS_Y}Q${(dx(0.4) + dx(s.d)) / 2} ${AXIS_Y - 22} ${dx(s.d)} ${AXIS_Y}`} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={dx(s.d)} cy={AXIS_Y} r={5} fill={active >= 3 ? s.color : "#ffffff"} stroke={active >= 3 ? s.color : "#475569"} strokeWidth={1} />
                <text x={dx(s.d)} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill="#334155">{s.name} d={s.d.toFixed(1)}</text>
                <text x={dx(s.d)} y={54} textAnchor="middle" fontSize={10} fill="#475569">yes {s.p}</text>
                <text x={dx(s.d)} y={160} textAnchor="middle" fontSize={10} fill="#475569" opacity={active >= 2 ? 1 : 0}>보상 {s.reward}</text>
                <text x={dx(s.d)} y={176} textAnchor="middle" fontSize={10} fontWeight={700} fill={s.color} opacity={active >= 3 ? 1 : 0}>adv {s.adv}</text>
              </g>
            );
          })}
          <circle cx={dx(0.4)} cy={AXIS_Y} r={5} fill="#2563eb" />
          <text x={dx(0.4)} y={150} textAnchor="middle" fontSize={10} fontWeight={700} fill="#2563eb" opacity={active >= 2 ? 0 : 1}>현재 d=0.4</text>
          <text x={dx(0.4)} y={164} textAnchor="middle" fontSize={10} fill="#2563eb" opacity={active >= 2 ? 0 : 1}>yes 0.599</text>
          <text x={dx(0.4)} y={160} textAnchor="middle" fontSize={10} fill="#64748b" opacity={active >= 2 ? 1 : 0}>보상 평균 0.034</text>
          <g opacity={active === 4 ? 1 : 0}>
            <line x1={dx(0.4) + 6} x2={dx(0.4) + 40} y1={AXIS_Y - 34} y2={AXIS_Y - 34} stroke="#16a34a" strokeWidth={1.25} />
            <path d={`M${dx(0.4) + 40} ${AXIS_Y - 38}L${dx(0.4) + 47} ${AXIS_Y - 34}L${dx(0.4) + 40} ${AXIS_Y - 30}Z`} fill="#16a34a" />
            <text x={dx(0.4) + 50} y={AXIS_Y - 31} fontSize={9} fill="#16a34a">표본1 쪽으로</text>
            <line x1={dx(0.4) + 6} x2={dx(0.4) + 40} y1={AXIS_Y + 34} y2={AXIS_Y + 34} stroke="#dc2626" strokeWidth={1.25} />
            <path d={`M${dx(0.4) + 40} ${AXIS_Y + 30}L${dx(0.4) + 47} ${AXIS_Y + 34}L${dx(0.4) + 40} ${AXIS_Y + 38}Z`} fill="#dc2626" />
            <text x={dx(0.4) + 50} y={AXIS_Y + 37} fontSize={9} fill="#dc2626">표본2 반대쪽으로</text>
          </g>
          <text x={W / 2} y={200} textAnchor="middle" fontSize={10} fill="#475569" opacity={active === 4 ? 1 : 0}>두 화살표 모두 오른쪽: yes logit이 오릅니다</text>
        </svg>
      )}
    />
  );
}
