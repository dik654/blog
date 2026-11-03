import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "70B BF16 weight부터 130.4GiB를 차지합니다",
    body: "70×10⁹개 weight에 2 byte를 곱하고 2³⁰으로 나눕니다. 이 값만 보고 192GB급 장치가 충분하다고 결론내리면 요청 상태를 빠뜨립니다.",
  },
  {
    label: "32K 문맥 여덟 개의 KV cache가 80GiB를 더 씁니다",
    body: "가정한 80-layer·8 KV-head 구조는 token당 0.3125MiB입니다. 32,768 token과 요청 8개를 곱하면 80GiB입니다.",
  },
  {
    label: "최소 210.4GiB가 되어 192GiB 이하는 한 장 경로에서 탈락합니다",
    body: "130.4+80=210.4GiB에는 allocator·workspace·fragmentation 여유가 아직 없습니다. 288GB급도 실제 load 시험 전에는 합격이 아닙니다.",
  },
  {
    label: "대역폭은 요청별 token 간격과 batch 전체 처리량을 다르게 제한합니다",
    body: "140GB weight와 8TB/s 예시는 step당 최소 17.5ms입니다. Batch 8의 요청별 바닥은 그대로지만 전체 상한은 약 457 token/s로 늘어납니다.",
  },
] as const;

const C = { weight: "#4f46e5", kv: "#059669", warn: "#dc2626", pass: "#0284c7", muted: "#64748b" };

function DesktopScene({ step }: { step: number }) {
  return (
    <svg className="!hidden sm:!block" viewBox="0 0 700 280" role="img" aria-label="70B 모델의 weight KV cache와 대역폭 계산 과정">
      {step <= 2 ? (
        <>
          <text x="42" y="34" fontSize="10" fontWeight="700" fill={C.muted}>같은 HBM 장부에 고정 weight와 요청별 KV cache를 더합니다</text>
          <rect x="42" y="56" width="326" height="56" rx="10" fill={`${C.weight}14`} stroke={C.weight} strokeWidth={step === 0 ? 1.25 : 1} />
          <text x="62" y="80" fontSize="10.5" fontWeight="700" fill={C.weight}>BF16 weight</text>
          <text x="62" y="100" fontSize="9.2" fill="currentColor">70×10⁹ × 2 byte = 130.4GiB</text>
          {step >= 1 && (
            <>
              <line x1="368" y1="84" x2="390" y2="84" stroke={C.kv} strokeWidth="1.2" />
              <circle cx="390" cy="84" r="2.4" fill={C.kv} />
              <rect x="396" y="56" width="262" height="56" rx="10" fill={`${C.kv}14`} stroke={C.kv} strokeWidth={step === 1 ? 1.25 : 1} />
              <text x="416" y="80" fontSize="10.5" fontWeight="700" fill={C.kv}>KV cache 8개</text>
              <text x="416" y="100" fontSize="9.2" fill="currentColor">0.3125MiB/token × 32K × 8 = 80GiB</text>
            </>
          )}
          <rect x="42" y="146" width="616" height="46" rx="10" fill={step === 2 ? `${C.warn}12` : "#94a3b80a"} stroke={step === 2 ? C.warn : "#cbd5e1"} strokeWidth={step === 2 ? 1.25 : 1} />
          <text x="350" y="166" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={step === 2 ? C.warn : C.muted}>{step === 0 ? "아직 KV cache가 빠진 장부" : step === 1 ? "두 항을 더해야 한 장 적합성을 알 수 있음" : "130.4 + 80 = 최소 210.4GiB"}</text>
          <text x="350" y="183" textAnchor="middle" fontSize="8.9" fill={C.muted}>{step === 2 ? "Runtime 여유 전 · 192GiB 이하는 탈락 · 288GB급은 실행 확인" : "Allocator · workspace · fragmentation은 아직 미포함"}</text>
          <text x="64" y="232" fontSize="9.5" fontWeight="700" fill={step === 2 ? C.warn : C.muted}>128GB</text>
          <text x="190" y="232" fontSize="9.5" fontWeight="700" fill={step === 2 ? C.warn : C.muted}>144GB</text>
          <text x="316" y="232" fontSize="9.5" fontWeight="700" fill={step === 2 ? C.warn : C.muted}>192GiB</text>
          <text x="470" y="232" fontSize="9.5" fontWeight="700" fill={step === 2 ? C.pass : C.muted}>288GB</text>
          <text x="588" y="232" fontSize="9.5" fontWeight="700" fill={step === 2 ? C.pass : C.muted}>432GB</text>
          <line x1="64" y1="246" x2="612" y2="246" stroke="#cbd5e1" strokeWidth="1.2" />
          {step === 2 && <circle cx="424" cy="246" r="4" fill={C.warn} />}
          <text x="424" y="267" textAnchor="middle" fontSize="8.8" fill={step === 2 ? C.warn : C.muted}>최소선 210.4GiB</text>
        </>
      ) : (
        <>
          <rect x="42" y="52" width="188" height="62" rx="11" fill={`${C.weight}12`} stroke={C.weight} strokeWidth="1.2" />
          <text x="136" y="77" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.weight}>Weight 140GB</text>
          <text x="136" y="98" textAnchor="middle" fontSize="9" fill="currentColor">한 batch step에서 한 번 읽기</text>
          <line x1="236" y1="83" x2="262" y2="83" stroke={C.pass} strokeWidth="1.2" />
          <circle cx="262" cy="83" r="2.4" fill={C.pass} />
          <rect x="268" y="52" width="164" height="62" rx="11" fill={`${C.pass}12`} stroke={C.pass} strokeWidth="1.2" />
          <text x="350" y="77" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.pass}>8TB/s</text>
          <text x="350" y="98" textAnchor="middle" fontSize="9" fill="currentColor">140GB ÷ 8TB/s = 17.5ms</text>
          <line x1="438" y1="83" x2="464" y2="83" stroke={C.kv} strokeWidth="1.2" />
          <circle cx="464" cy="83" r="2.4" fill={C.kv} />
          <rect x="470" y="52" width="188" height="62" rx="11" fill={`${C.kv}12`} stroke={C.kv} strokeWidth="1.2" />
          <text x="564" y="77" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.kv}>Step당 최대 8 token</text>
          <text x="564" y="98" textAnchor="middle" fontSize="9" fill="currentColor">동시 요청마다 다음 한 칸</text>
          <rect x="66" y="154" width="254" height="74" rx="11" fill="#fff" fillOpacity="0.01" stroke={C.warn} strokeWidth="1.2" />
          <text x="193" y="180" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.warn}>요청 한 개의 낙관적 바닥</text>
          <text x="193" y="203" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">17.5ms/token · 57.1 token/s</text>
          <rect x="380" y="154" width="254" height="74" rx="11" fill="#fff" fillOpacity="0.01" stroke={C.pass} strokeWidth="1.2" />
          <text x="507" y="180" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.pass}>Batch 전체 낙관적 상한</text>
          <text x="507" y="203" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">8 ÷ 0.0175 ≈ 457 token/s</text>
          <text x="350" y="261" textAnchor="middle" fontSize="8.8" fill={C.muted}>실제 결과에는 KV 읽기 · compute · 통신 · scheduler · kernel 효율이 더해집니다</text>
        </>
      )}
    </svg>
  );
}

function MobileScene({ step }: { step: number }) {
  return (
    <svg className="block sm:!hidden" viewBox="0 0 300 350" role="img" aria-label="모바일용 70B 모델 메모리 계산 과정">
      {step <= 2 ? (
        <>
          <rect x="24" y="18" width="252" height="58" rx="10" fill={`${C.weight}14`} stroke={C.weight} strokeWidth={step === 0 ? 1.25 : 1} />
          <text x="42" y="42" fontSize="10.5" fontWeight="700" fill={C.weight}>BF16 weight · 130.4GiB</text>
          <text x="42" y="61" fontSize="9" fill="currentColor">70×10⁹ × 2 byte ÷ 2³⁰</text>
          {step >= 1 && (
            <>
              <line x1="150" y1="80" x2="150" y2="94" stroke={C.kv} strokeWidth="1.2" />
              <circle cx="150" cy="94" r="2.4" fill={C.kv} />
              <rect x="24" y="100" width="252" height="58" rx="10" fill={`${C.kv}14`} stroke={C.kv} strokeWidth={step === 1 ? 1.25 : 1} />
              <text x="42" y="124" fontSize="10.5" fontWeight="700" fill={C.kv}>KV cache 8개 · 80GiB</text>
              <text x="42" y="143" fontSize="9" fill="currentColor">0.3125MiB/token × 32K × 8</text>
            </>
          )}
          <rect x="24" y="184" width="252" height="58" rx="10" fill={step === 2 ? `${C.warn}12` : "#94a3b80a"} stroke={step === 2 ? C.warn : "#cbd5e1"} strokeWidth={step === 2 ? 1.25 : 1} />
          <text x="150" y="208" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={step === 2 ? C.warn : C.muted}>{step === 2 ? "최소 210.4GiB" : "두 항을 같은 장부에 더함"}</text>
          <text x="150" y="227" textAnchor="middle" fontSize="8.9" fill={C.muted}>Runtime 여유는 아직 미포함</text>
          <text x="28" y="284" fontSize="8.8" fill={step === 2 ? C.warn : C.muted}>128</text>
          <text x="83" y="284" fontSize="8.8" fill={step === 2 ? C.warn : C.muted}>144</text>
          <text x="138" y="284" fontSize="8.8" fill={step === 2 ? C.warn : C.muted}>192</text>
          <text x="206" y="284" fontSize="8.8" fill={step === 2 ? C.pass : C.muted}>288</text>
          <text x="254" y="284" fontSize="8.8" fill={step === 2 ? C.pass : C.muted}>432</text>
          <line x1="30" y1="298" x2="270" y2="298" stroke="#cbd5e1" strokeWidth="1.2" />
          {step === 2 && <circle cx="175" cy="298" r="4" fill={C.warn} />}
          <text x="150" y="326" textAnchor="middle" fontSize="9" fontWeight="700" fill={step === 2 ? C.warn : C.muted}>{step === 2 ? "192GiB 이하는 한 장 경로 탈락" : "표기 단위 GB·GiB를 먼저 통일"}</text>
        </>
      ) : (
        <>
          <rect x="24" y="18" width="252" height="54" rx="10" fill={`${C.weight}12`} stroke={C.weight} strokeWidth="1.2" />
          <text x="150" y="42" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.weight}>140GB weight ÷ 8TB/s</text>
          <text x="150" y="60" textAnchor="middle" fontSize="9" fill="currentColor">Decode step의 낙관적 바닥 17.5ms</text>
          <line x1="150" y1="76" x2="150" y2="92" stroke={C.pass} strokeWidth="1.2" />
          <circle cx="150" cy="92" r="2.4" fill={C.pass} />
          <rect x="24" y="98" width="252" height="54" rx="10" fill={`${C.pass}12`} stroke={C.pass} strokeWidth="1.2" />
          <text x="150" y="122" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.pass}>Batch 8 · step당 최대 8 token</text>
          <text x="150" y="140" textAnchor="middle" fontSize="9" fill="currentColor">각 요청은 다음 token 한 칸씩 생성</text>
          <rect x="24" y="184" width="252" height="58" rx="10" fill={`${C.warn}0d`} stroke={C.warn} strokeWidth="1.2" />
          <text x="150" y="208" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.warn}>요청별 · 17.5ms/token</text>
          <text x="150" y="228" textAnchor="middle" fontSize="9" fill="currentColor">Batch 8이라고 8분의 1이 되지 않음</text>
          <rect x="24" y="254" width="252" height="58" rx="10" fill={`${C.kv}0d`} stroke={C.kv} strokeWidth="1.2" />
          <text x="150" y="278" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.kv}>전체 · 최대 약 457 token/s</text>
          <text x="150" y="298" textAnchor="middle" fontSize="9" fill="currentColor">8 token ÷ 0.0175s</text>
          <text x="150" y="338" textAnchor="middle" fontSize="8.8" fill={C.muted}>실제는 KV · compute · 통신 때문에 더 느립니다</text>
        </>
      )}
    </svg>
  );
}

export default function MemoryViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <>
          <MobileScene step={step} />
          <DesktopScene step={step} />
        </>
      )}
    </StepViz>
  );
}
