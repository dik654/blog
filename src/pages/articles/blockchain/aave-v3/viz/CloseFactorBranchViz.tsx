import SceneShell from "./SceneShell";

/**
 * 본문 대응: #close-factor (와 #liquidation의 HF 값).
 * HF: 10000×80%/7000 ≈ 1.143, 8000×80%/7000 ≈ 0.914, 1000 상환·보상 5% 후 6950×80%/6000 ≈ 0.927.
 * 분기: 선택 담보·부채가 각각 기준 가치 2000 이상이고 HF > 0.95 → 계정 총부채의 50%(C는 7000 → 3500).
 * 그 밖(HF ≤ 0.95 등) → 선택 부채 전액(7000)이 우선 후보. 실제 양은 debtToCover·가용 담보·보상·수수료 등으로 더 줄 수 있습니다.
 */
const HF_LO = 0.85;
const HF_HI = 1.2;
const X0 = 30;
const X1 = 330;
const hx = (hf: number) => X0 + ((hf - HF_LO) / (HF_HI - HF_LO)) * (X1 - X0);
const DEBT = 7000;
const DX = 300 / DEBT;

type Scene = {
  label: string;
  summary: string;
  hf: number | null;
  zone: "none" | "half";
  candidate: number;
  repaid: number;
  candidateText: string;
  note: string;
};

const SCENES: readonly Scene[] = [
  { label: "가격 100", summary: "HF ≈ 1.143", hf: 10000 * 0.8 / 7000, zone: "none", candidate: 0, repaid: 0, candidateText: "HF ≥ 1 · 청산 후보 없음", note: "담보 10000의 80%인 8000이 부채 7000보다 커서 HF는 약 1.143입니다. 1 이상이면 청산 가능한 위험 상태가 아닙니다." },
  { label: "가격 80", summary: "HF ≈ 0.914 ≤ 0.95", hf: 8000 * 0.8 / 7000, zone: "none", candidate: 7000, repaid: 0, candidateText: "선택 부채 전액 7000이 우선 후보", note: "HF가 1 아래라 청산 가능한 위험 상태입니다. 50% 한도 분기는 HF가 0.95보다 높아야 하므로 0.914는 해당하지 않고, 선택 부채 전액 7000이 우선 후보가 됩니다." },
  { label: "비교 · 0.95 < HF < 1", summary: "총부채 50% = 3500", hf: null, zone: "half", candidate: 3500, repaid: 0, candidateText: "50% 한도 · 7000의 절반 3500", note: "HF가 이 구간이고 선택한 담보·부채가 각각 기준 가치 2000 이상이면 계정 총부채의 50% 한도를 씁니다. C의 부채는 7000 하나뿐이라 3500입니다. C의 실제 HF 0.914와 다른 가상 비교입니다." },
  { label: "1000 상환 후", summary: "HF ≈ 0.927 < 1", hf: 6950 * 0.8 / 6000, zone: "none", candidate: 0, repaid: 1000, candidateText: "1000 상환 · 부채 6000 남음", note: "청산자가 1000을 갚고 보상 5%를 포함해 담보 1050을 가져가면 담보 6950, 부채 6000입니다. HF는 6950×80%/6000≈0.927로 여전히 1 아래입니다. 일부 상환이 곧 정상 복구는 아닙니다. (가정)" },
];

export default function CloseFactorBranchViz() {
  return (
    <SceneShell
      eyebrow="청산 후보량"
      title="HF가 1 아래여도 0.95를 기준으로 갚을 수 있는 후보량이 갈립니다"
      description="위 눈금은 health factor(HF, 청산 기준 담보 가치 ÷ 총부채), 아래 막대는 C의 부채 7000입니다. 담보 100개·청산 비율 80%·보상 5%는 본문의 가정입니다."
      note="막대의 후보량은 첫 한도입니다. 실제 양은 요청한 debtToCover·가용 담보·보상·수수료·남겨 둘 작은 잔액 규칙으로 더 줄 수 있습니다."
      ariaLabel="C의 HF 위치와 0.95 분기에 따른 청산 후보 부채량"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
          <svg viewBox="0 0 360 134" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0} y={14} fontSize={10.5} fontWeight={700} fill="#334155">HF</text>
            <rect x={hx(HF_LO)} y={30} width={hx(1) - hx(HF_LO)} height={14} fill="#dc2626" fillOpacity={0.08} />
            {scene.zone === "half" && <rect x={hx(0.95)} y={30} width={hx(1) - hx(0.95)} height={14} fill="#d97706" fillOpacity={0.45} stroke="#d97706" strokeWidth={1} />}
            <line x1={X0} x2={X1} y1={44} y2={44} stroke="#94a3b8" strokeWidth={1} />
            {[0.95, 1].map((t) => (
              <g key={t}>
                <line x1={hx(t)} x2={hx(t)} y1={24} y2={50} stroke={t === 1 ? "#dc2626" : "#d97706"} strokeWidth={1.25} strokeDasharray={t === 1 ? undefined : "3 2"} />
                <text x={hx(t) + (t === 1 ? 4 : -4)} y={62} textAnchor={t === 1 ? "start" : "end"} fontSize={10} fontWeight={700} fill={t === 1 ? "#dc2626" : "#b45309"}>{t === 1 ? "1 · 청산 가능 경계" : "0.95"}</text>
              </g>
            ))}
            {[0.9, 1.2].map((t) => (
              <text key={t} x={hx(t)} y={62} textAnchor="middle" fontSize={9.5} fill="#64748b">{t}</text>
            ))}
            {scene.hf !== null && (
              <g>
                <circle cx={hx(scene.hf)} cy={37} r={5} fill="#2563eb" />
                <text x={hx(scene.hf)} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">C {scene.hf.toFixed(3)}</text>
              </g>
            )}
            <text x={X0} y={96} fontSize={10.5} fontWeight={700} fill="#334155">C의 부채 (처음 7000)</text>
            <rect x={X0} y={104} width={DEBT * DX} height={22} rx={2} fill="none" stroke="#64748b" strokeWidth={1} />
            {scene.repaid > 0 && (
              <>
                <rect x={X0} y={104} width={scene.repaid * DX} height={22} fill="#16a34a" fillOpacity={0.4} stroke="#16a34a" strokeWidth={1} />
                <text x={X0 + 4} y={119} fontSize={10} fontWeight={700} fill="#15803d">1000</text>
                <text x={X0 + scene.repaid * DX + 6} y={119} fontSize={10} fill="#334155">← 상환 · 남은 부채 6000</text>
              </>
            )}
            {scene.candidate > 0 && (
              <>
                <rect x={X0} y={104} width={scene.candidate * DX} height={22} fill="#d97706" fillOpacity={0.3} stroke="#d97706" strokeWidth={1} />
                <text x={X0 + 6} y={119} fontSize={10.5} fontWeight={700} fill="#b45309">후보 {scene.candidate}</text>
              </>
            )}
          </svg>
          <p className="mx-auto mt-2 max-w-[560px] text-sm font-bold">{scene.candidateText}</p>
          </div>
        );
      }}
    />
  );
}
