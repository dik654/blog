import SceneShell from "./SceneShell";

/**
 * 본문 대응: #window — Hann 곱은 입력을 [0,1,3,2]로 바꾸고 출력 합을 10→6으로 바꿉니다.
 * 0 네 개를 붙인 길이 8 DFT의 길이: 10, 7.25, 2.83, 2.72, 2, 2.72, 2.83, 7.25 (직접 계산, 소수 둘째 자리 반올림).
 * 짝수 자리 값은 원래 길이 4의 10, √8, 2, √8과 같습니다.
 */
const PAD = [10, 7.25, 2.83, 2.72, 2, 2.72, 2.83, 7.25];
const SQRT8 = 2.83;
const SQRT10 = 3.16;
const SCENES: { label: string; summary: string; note: string; input: number[]; weights: string[] | null; out: (number | null)[]; outText: string[]; spacing: string }[] = [
  { label: "원래 네 값", summary: "합 10 · 간격 2 Hz", input: [1, 2, 3, 4], weights: null, out: [10, null, SQRT8, null, 2, null, SQRT8, null], outText: ["10", "", "√8", "", "2", "", "√8", ""], spacing: "출력 길이 · 자리 간격 2 Hz", note: "입력 네 칸과 출력 네 칸입니다. 아래 막대는 각 계수의 길이이고, 실제 계수는 가로와 세로 두 성분을 모두 보관합니다." },
  { label: "Hann 창 곱하기", summary: "[0, 1, 3, 2] · 합 6", input: [0, 1, 3, 2], weights: ["1×0", "2×½", "3×1", "4×½"], out: [6, null, SQRT10, null, 0, null, SQRT10, null], outText: ["6", "", "√10", "", "0", "", "√10", ""], spacing: "출력 길이 · 자리 간격 2 Hz", note: "주기형 Hann 가중치 0, ½, 1, ½를 곱하면 입력 자체가 달라집니다. 출력은 [6, −3+i, 0, −3−i]로 원래 계수와 다릅니다. 원래 입력의 무손실 표현을 계산한 것이 아닙니다." },
  { label: "0 네 개 붙이기", summary: "간격 1 Hz · 관측 폭은 0.5초", input: [1, 2, 3, 4, 0, 0, 0, 0], weights: null, out: PAD, outText: ["10", "7.3", "2.8", "2.7", "2", "2.7", "2.8", "7.3"], spacing: "출력 길이 · 자리 간격 1 Hz", note: "회색 막대는 첫 장면(원래 네 값)과 같은 값이고 주황 막대가 새로 평가한 자리입니다. 같은 유한 기록의 스펙트럼을 더 촘촘히 읽었을 뿐 새로 측정한 값은 없습니다. 관측창은 여전히 0.5초입니다." },
];

const SLOT = 38;
const X0 = 28;
const cx = (slot: number) => X0 + slot * SLOT;
const INPUT_BASE = 76;
const OUT_BASE = 208;

export default function WindowZeroPadViz() {
  return (
    <SceneShell
      eyebrow="창과 0 채우기"
      title="창은 입력을 바꾸고, 0 채우기는 읽는 자리만 늘립니다"
      description="초당 8번 기록한 1, 2, 3, 4의 가정입니다. 위는 입력 값, 아래는 출력 계수의 길이이며 7.3·2.7 등은 직접 계산해 반올림했습니다."
      ariaLabel="원래 입력, Hann 창을 곱한 입력, 0을 붙인 입력의 출력 길이 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const padded = scene.input.length === 8;
        const inputSlot = (i: number) => (padded ? i : i * 2);
        return (
          <svg viewBox="0 0 360 236" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0 - 12} y={12} fontSize={11} fontWeight={700} fill="#64748b">입력</text>
            {scene.input.map((value, i) => (
              <g key={i}>
                <rect x={cx(inputSlot(i)) - 10} y={INPUT_BASE - value * 11} width={20} height={value * 11} rx={2} fill={i >= 4 ? "#94a3b8" : "#2563eb"} opacity={0.75} />
                <text x={cx(inputSlot(i))} y={INPUT_BASE - value * 11 - 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={i >= 4 ? "#64748b" : "#2563eb"}>{value}</text>
                {scene.weights && <text x={cx(inputSlot(i))} y={INPUT_BASE + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#d97706">{scene.weights[i]}</text>}
              </g>
            ))}
            <line x1={X0 - 16} x2={X0 + 7 * SLOT + 16} y1={INPUT_BASE} y2={INPUT_BASE} stroke="#94a3b8" strokeWidth={1} />
            {padded && <text x={cx(5.5)} y={INPUT_BASE + 14} textAnchor="middle" fontSize={11} fill="#64748b">붙인 0 · 측정값 아님</text>}
            {padded && <text x={cx(1.5)} y={INPUT_BASE + 14} textAnchor="middle" fontSize={11} fill="#2563eb">관측 폭 0.5초</text>}
            <text x={X0 - 12} y={110} fontSize={11} fontWeight={700} fill="#64748b">{scene.spacing}</text>
            {scene.out.map((value, slot) =>
              value === null ? null : (
                <g key={slot}>
                  <rect x={cx(slot) - 10} y={OUT_BASE - value * 7.5} width={20} height={Math.max(value * 7.5, 0.5)} rx={2} fill={slot % 2 === 1 ? "#d97706" : "#64748b"} opacity={0.8} />
                  <text x={cx(slot)} y={OUT_BASE - value * 7.5 - 3} textAnchor="middle" fontSize={11} fontWeight={700} fill={slot % 2 === 1 ? "#d97706" : "#64748b"}>{scene.outText[slot]}</text>
                  <text x={cx(slot)} y={OUT_BASE + 14} textAnchor="middle" fontSize={10} fill="#64748b">{padded ? `자리 ${slot}` : `자리 ${slot / 2}`}</text>
                </g>
              ),
            )}
            <line x1={X0 - 16} x2={X0 + 7 * SLOT + 16} y1={OUT_BASE} y2={OUT_BASE} stroke="#94a3b8" strokeWidth={1} />
          </svg>
        );
      }}
    />
  );
}
