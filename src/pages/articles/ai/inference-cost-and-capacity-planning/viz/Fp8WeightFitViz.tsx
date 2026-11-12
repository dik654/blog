import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tier-mix — Llama 3 405B weight가 H100 8장(640GB)에 들어가는지 직접 센 계산.
 * layer마다 attention ≈ 5.7억, FFN ≈ 26.2억(82%). 전부 BF16이면 ≈ 812GB,
 * 124층 FFN만 1byte로 두면 ≈ 487GB. 812 − 487 = 325GB가 줄었으므로
 * 124층 FFN은 BF16에서 650GB, 1byte에서 325GB이고 나머지는 162GB입니다(본문 숫자로 역산).
 */
const ATTN = 5.7; // 억 개
const FFN = 26.2; // 억 개
const FFN_SHARE = FFN / (ATTN + FFN);
const BF16_TOTAL = 812;
const MIXED_TOTAL = 487;
const NODE = 640; // H100 8장 × 80GB
const SAVED = BF16_TOTAL - MIXED_TOTAL; // 325
const FFN_BF16 = SAVED * 2; // 650
const REST = BF16_TOTAL - FFN_BF16; // 162

const SCENES = [
  {
    label: "한 layer 안에서 FFN이 대부분입니다",
    summary: "FFN ≈ 26.2억 · " + Math.round(FFN_SHARE * 100) + "%",
    note: "Table 3의 숫자(model dimension 16,384, head 128, KV head 8, FFN dimension 53,248)로 세면 layer마다 attention 매개변수가 약 5.7억 개, FFN이 약 26.2억 개입니다. FFN만 줄여도 전체가 크게 줄어드는 이유입니다.",
  },
  {
    label: "전부 BF16이면 서버 한 대를 넘습니다",
    summary: BF16_TOTAL + "GB > " + NODE + "GB",
    note: "BF16은 매개변수 하나를 2byte로 적습니다. 전부 BF16이면 약 812GB라 H100 8장의 640GB를 172GB 넘습니다. 그래서 논문은 두 서버 16장에 나눠 올렸습니다.",
  },
  {
    label: "124층 FFN만 1byte로 둡니다",
    summary: MIXED_TOTAL + "GB < " + NODE + "GB",
    note: "FP8은 매개변수 하나를 1byte로 적습니다. 첫·마지막을 뺀 124층의 FFN만 FP8로 두면 그 몫이 절반이 되어 약 487GB입니다. 640GB 안에 들어가고 남는 약 153GB가 KV cache 자리입니다. 이 GB는 논문 값이 아니라 본문이 직접 센 값입니다.",
  },
] as const;

const X0 = 16;
const X1 = 344;
const MAX_GB = 900;
const gx = (gb: number) => X0 + (gb / MAX_GB) * (X1 - X0);
const FFN_C = "#2563eb";
const ATTN_C = "#64748b";
const OVER_C = "#dc2626";
const FREE_C = "#16a34a";
const MUTED = "#64748b";
const LINE = "#94a3b8";

export default function Fp8WeightFitViz() {
  return (
    <SceneShell
      eyebrow="혼합 정밀도 weight"
      title="FFN만 1byte로 줄이면 405B weight가 서버 한 대에 들어갑니다"
      description="위 막대는 layer 하나의 매개변수 수, 아래 막대는 126층 전체 weight의 GB입니다. 세로 점선이 H100 8장의 640GB입니다."
      note="GB 숫자는 본문이 Llama 3 논문 Table 3로 직접 센 값이고, 650GB·162GB 구분은 812와 487의 차이에서 역산한 것입니다."
      ariaLabel="405B weight를 BF16과 혼합 정밀도로 셌을 때 640GB와의 비교"
      scenes={SCENES}
      render={(active) => {
        const ffnGb = active === 2 ? SAVED : FFN_BF16;
        const total = REST + ffnGb;
        const layerW = X1 - X0;
        const attnW = (ATTN / (ATTN + FFN)) * layerW;
        return (
          <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={SCENES[active].label + ": " + SCENES[active].summary}>
            <text x={X0} y={14} fontSize={11} fontWeight={700} fill={MUTED}>
              layer 하나의 매개변수
            </text>
            <g opacity={active === 0 ? 1 : 0.4}>
              <rect x={X0} y={22} width={attnW} height={20} fill={ATTN_C} />
              <rect x={X0 + attnW} y={22} width={layerW - attnW} height={20} fill={FFN_C} />
              <text x={X0} y={56} fontSize={10} fill={ATTN_C}>
                attention ≈ 5.7억
              </text>
              <text x={X1} y={56} fontSize={10} fontWeight={700} fill={FFN_C} textAnchor="end">
                FFN ≈ 26.2억 ({Math.round(FFN_SHARE * 100)}%)
              </text>
            </g>

            <text x={X0} y={84} fontSize={11} fontWeight={700} fill={MUTED}>
              126층 weight 전체 (GB)
            </text>
            <rect x={X0} y={92} width={X1 - X0} height={24} rx={2} fill="none" stroke={LINE} strokeWidth={1} />
            {active >= 1 && (
              <g>
                <rect x={gx(0)} y={92} width={gx(REST) - gx(0)} height={24} fill={ATTN_C} opacity={0.8} />
                <rect x={gx(REST)} y={92} width={gx(total) - gx(REST)} height={24} fill={FFN_C} opacity={active === 2 ? 0.95 : 0.8} />
                <text x={(gx(0) + gx(REST)) / 2} y={108} fontSize={10} fontWeight={700} fill="#ffffff" textAnchor="middle">
                  나머지 {REST}
                </text>
                <text x={(gx(REST) + gx(total)) / 2} y={108} fontSize={10} fontWeight={700} fill="#ffffff" textAnchor="middle">
                  124층 FFN {ffnGb}
                </text>
                {active === 1 && <rect x={gx(NODE)} y={92} width={gx(BF16_TOTAL) - gx(NODE)} height={24} fill="none" stroke={OVER_C} strokeWidth={1.25} />}
                {active === 2 && <rect x={gx(MIXED_TOTAL)} y={92} width={gx(NODE) - gx(MIXED_TOTAL)} height={24} fill={FREE_C} opacity={0.25} />}
              </g>
            )}
            {active === 0 && (
              <text x={X0 + 8} y={108} fontSize={10} fill={MUTED}>
                다음 장면에서 126층을 모두 셉니다
              </text>
            )}
            <line x1={gx(NODE)} x2={gx(NODE)} y1={86} y2={122} stroke="#0f172a" strokeWidth={1.25} strokeDasharray="3 2" />
            <text x={gx(NODE)} y={136} fontSize={10} fontWeight={700} fill={MUTED} textAnchor="middle">
              H100 8장 640GB
            </text>
            <text x={X0} y={160} fontSize={10.5} fontWeight={700} fill={active === 1 ? OVER_C : active === 2 ? FREE_C : MUTED}>
              {active === 0
                ? "FFN이 layer의 " + Math.round(FFN_SHARE * 100) + "%를 차지합니다"
                : active === 1
                  ? "전부 2byte면 " + BF16_TOTAL + "GB · 640GB를 " + (BF16_TOTAL - NODE) + "GB 넘습니다"
                  : "합 " + MIXED_TOTAL + "GB · 남는 " + (NODE - MIXED_TOTAL) + "GB가 KV cache 자리입니다"}
            </text>
          </svg>
        );
      }}
    />
  );
}
