import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — Z=2ᵏ, 확률 2⁻ᵏ. 기여는 항마다 1, 확률 누적은 1에 다가가고 기여 누적은 k.
 * ±2ᵏ에 각각 2⁻⁽ᵏ⁺¹⁾: 양·음의 기여가 항마다 1/2씩 쌓이고, k까지 양음을 함께 자른 합은 0이다.
 */
const INK = "#64748b";
const ACCENT = "#2563eb";
const WARM = "#d97706";
const KS = [1, 2, 3, 4, 5, 6];
const colX = (index: number) => 44 + index * 46;
const BAR = 30;
const VALUES = KS.map((k) => 2 ** k);
const PROB_TEXT = KS.map((k) => `1/${2 ** k}`);
const PROBS = KS.map((k) => 2 ** -k);
const PROB_SUM_TEXT = KS.map((k) => `${2 ** k - 1}/${2 ** k}`);

const SCENES = [
  { label: "값은 커지고 확률은 작아진다", summary: "2ᵏ ↑ · 2⁻ᵏ ↓", note: "k=1,2,…에서 값 Z=2ᵏ에 확률 2⁻ᵏ를 준다고 합시다(가정). 나오는 값은 매번 유한한 숫자입니다. 그림은 k=6까지만 그렸습니다." },
  { label: "곱은 항마다 1이다", summary: "2ᵏ × 2⁻ᵏ = 1", note: "확률이 작아진다는 사실만으로 충분하지 않습니다. 값이 그만큼 커지면 각 값의 평균 기여는 줄지 않고 1로 남습니다." },
  { label: "확률은 1로 닫히고 기여는 쌓인다", summary: "확률 합 1 · 기여 합 +∞", note: "확률의 합은 1/2+1/4+…=1입니다. 하지만 기여를 모두 더하면 +∞이므로 유한한 평균은 없습니다." },
  { label: "양쪽 다 무한하면", summary: "자른 합 0 ≠ 기댓값", note: "이번에는 +2ᵏ와 −2ᵏ에 각각 확률 2⁻⁽ᵏ⁺¹⁾를 줍니다(가정). 양의 기여 합과 음의 크기 합이 각각 무한합니다. 양음 한 쌍씩 지운 대칭 절단값 0은 기댓값을 정의하지 못합니다." },
] as const;

function Tier({ title, values, labels, base, height, max, color }: { title: string; values: readonly number[]; labels: readonly string[]; base: number; height: number; max: number; color: string }) {
  return (
    <>
      <text x={0} y={base - height - 18} fontSize={12} fontWeight={700} fill={color}>{title}</text>
      {values.map((value, index) => {
        const h = (value / max) * height;
        return (
          <g key={index}>
            <rect x={colX(index)} y={base - h} width={BAR} height={h} rx={1} fill={color} opacity={0.8} />
            <text x={colX(index) + BAR / 2} y={base - h - 4} textAnchor="middle" fontSize={11} fill={INK}>{labels[index]}</text>
          </g>
        );
      })}
      <line x1={colX(0) - 6} x2={colX(5) + BAR + 6} y1={base} y2={base} stroke={INK} strokeWidth={1} />
    </>
  );
}

export default function DivergentSumViz() {
  return (
    <SceneShell
      eyebrow="유한한 평균이 없는 분포"
      title="확률 합이 1이어도 기여는 끝없이 쌓일 수 있습니다"
      description="아래 펼침 글의 두 가정 분포입니다. 막대 하나가 k 하나입니다. 값과 확률, 확률 합과 기여 합의 위아래 묶음은 축척이 서로 다르고, 양음을 마주 놓은 마지막 장면만 같은 축척입니다."
      ariaLabel="값과 확률의 곱이 쌓여 평균이 무한하거나 정의되지 않는 두 예"
      scenes={SCENES}
      render={(index) => (
        <svg viewBox="0 0 360 240" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
          {index === 0 && (
            <>
              <Tier title="값 2ᵏ" values={VALUES} labels={VALUES.map(String)} base={104} height={70} max={64} color={ACCENT} />
              <Tier title="확률 2⁻ᵏ" values={PROBS} labels={PROB_TEXT} base={208} height={56} max={0.5} color={WARM} />
            </>
          )}
          {index === 1 && (
            <>
              <Tier title="평균 기여 = 값 × 확률" values={KS.map(() => 1)} labels={KS.map(() => "1")} base={150} height={90} max={1} color={ACCENT} />
              {KS.map((k, column) => (
                <text key={k} x={colX(column) + BAR / 2} y={172} textAnchor="middle" fontSize={10} fill={INK}>{2 ** k}×</text>
              ))}
              {KS.map((k, column) => (
                <text key={k} x={colX(column) + BAR / 2} y={186} textAnchor="middle" fontSize={10} fill={INK}>1/{2 ** k}</text>
              ))}
            </>
          )}
          {index === 2 && (
            <>
              <Tier title="k까지의 확률 합" values={PROBS.map((_, i) => 1 - 2 ** -(i + 1))} labels={PROB_SUM_TEXT} base={92} height={52} max={1} color={WARM} />
              <text x={colX(6)} y={70} fontSize={12} fontWeight={700} fill={WARM}>→ 1</text>
              <Tier title="k까지의 기여 합" values={KS} labels={KS.map(String)} base={208} height={66} max={6} color={ACCENT} />
              <text x={colX(6)} y={200} fontSize={12} fontWeight={700} fill={ACCENT}>→ ∞</text>
            </>
          )}
          {index === 3 && (
            <>
              <text x={0} y={14} fontSize={12} fontWeight={700} fill={ACCENT}>양의 기여 합 (항마다 +1/2)</text>
              <text x={0} y={204} fontSize={12} fontWeight={700} fill={WARM}>음의 크기 합 (항마다 −1/2)</text>
              {KS.map((k, column) => (
                <g key={k}>
                  <rect x={colX(column)} y={110 - k * 13} width={BAR} height={k * 13} fill={ACCENT} opacity={0.8} />
                  <rect x={colX(column)} y={110} width={BAR} height={k * 13} fill={WARM} opacity={0.8} />
                  <text x={colX(column) + BAR / 2} y={110 - k * 13 - 4} textAnchor="middle" fontSize={11} fill={INK}>+{k / 2}</text>
                  <text x={colX(column) + BAR / 2} y={110 + k * 13 + 13} textAnchor="middle" fontSize={11} fill={INK}>−{k / 2}</text>
                </g>
              ))}
              <line x1={colX(0) - 6} x2={colX(5) + BAR + 6} y1={110} y2={110} stroke={INK} strokeWidth={1} />
              <text x={314} y={114} fontSize={11} fontWeight={700} fill={INK}>각 k까지</text>
              <text x={314} y={128} fontSize={11} fontWeight={700} fill={INK}>합 0</text>
            </>
          )}
          {KS.map((k, column) => (
            <text key={k} x={colX(column) + BAR / 2} y={232} textAnchor="middle" fontSize={11} fill={INK}>k={k}</text>
          ))}
        </svg>
      )}
    />
  );
}
