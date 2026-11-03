import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "먼저 실제로 배치할 수 있는 후보만 남깁니다",
    body: "자체 데이터센터에는 OEM·rack system 후보를, cloud burst에는 region과 quota가 있는 service를 놓습니다. 제품 page의 존재만으로 capacity를 가정하지 않습니다.",
  },
  {
    label: "Weight·KV·workspace가 usable HBM에 들어가는지 계산합니다",
    body: "70B·32K·동시 8 요청은 runtime 여유 전부터 210.4GiB입니다. 192GiB 이하는 한 장 경로에서 탈락하고 더 큰 후보도 실제 load를 거칩니다.",
  },
  {
    label: "나눠야 하면 한 요청이 넘는 통신 domain을 확인합니다",
    body: "Tensor parallel collective가 scale-up 안에서 끝나는지, rack 사이 network를 건너는지에 따라 p95 TPOT가 달라집니다.",
  },
  {
    label: "동일 artifact의 기능과 정확도를 통과시킵니다",
    body: "Framework 지원 표시가 아니라 operator fallback, quantization, cache, batching과 관측 기능을 실제 runtime에서 확인합니다.",
  },
  {
    label: "같은 request profile과 운영 조건으로 최종 선택합니다",
    body: "p95 TTFT·TPOT·처리량·전력·cold start·복구를 한 원장에 놓습니다. Peak FLOPS는 이 단계의 실제 결과를 대신하지 않습니다.",
  },
] as const;

const GATES = [
  { name: "배치 경계", detail: "살 수 있나 · quota 있나", color: "#2563eb" },
  { name: "HBM 적합성", detail: "최소 210.4GiB + 여유", color: "#7c3aed" },
  { name: "통신 domain", detail: "한 요청의 collective 경로", color: "#0f766e" },
  { name: "Software", detail: "기능 · 정확도 · fallback", color: "#c2410c" },
  { name: "실측·운영", detail: "p95 · 전력 · 복구 · 비용", color: "#be123c" },
] as const;

function DesktopFlow({ step }: { step: number }) {
  return (
    <svg className="!hidden sm:!block" viewBox="0 0 760 190" role="img" aria-label="가속기 선택의 다섯 관문을 왼쪽부터 통과하는 흐름">
      {GATES.map((gate, index) => {
        const x = 10 + index * 150;
        const active = index <= step;
        return (
          <g key={gate.name}>
            {index > 0 && (
              <g>
                <line x1={x - 22} y1="88" x2={x - 6} y2="88" stroke={active ? gate.color : "#cbd5e1"} strokeWidth="1.2" />
                <circle cx={x - 6} cy="88" r="2.4" fill={active ? gate.color : "#cbd5e1"} />
              </g>
            )}
            <rect x={x} y="48" width="128" height="80" rx="12" fill={active ? `${gate.color}12` : "#94a3b80a"} stroke={active ? gate.color : "#cbd5e1"} strokeWidth={index === step ? 1.25 : 1} />
            <text x={x + 64} y="75" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={active ? gate.color : "#64748b"}>{index + 1}. {gate.name}</text>
            <text x={x + 64} y="98" textAnchor="middle" fontSize="8.8" fill="currentColor">{gate.detail}</text>
            <text x={x + 64} y="116" textAnchor="middle" fontSize="8.6" fill={index === step ? gate.color : "#64748b"}>{index === step ? "지금 확인" : index < step ? "통과" : "다음 관문"}</text>
          </g>
        );
      })}
      <text x="380" y="157" textAnchor="middle" fontSize="10" fontWeight="700" fill={GATES[step].color}>{STEPS[step].label}</text>
      <text x="380" y="177" textAnchor="middle" fontSize="8.8" fill="#64748b">고정 사례 · BF16 70B · 32K · 동시 요청 8 · 자체 랙 기본 + cloud burst</text>
    </svg>
  );
}

function MobileFlow({ step }: { step: number }) {
  return (
    <svg className="block sm:!hidden" viewBox="0 0 300 330" role="img" aria-label="모바일용 가속기 선택의 다섯 관문 흐름">
      {GATES.map((gate, index) => {
        const y = 8 + index * 58;
        const active = index <= step;
        return (
          <g key={gate.name}>
            {index > 0 && (
              <g>
                <line x1="150" y1={y - 16} x2="150" y2={y - 4} stroke={active ? gate.color : "#cbd5e1"} strokeWidth="1.2" />
                <circle cx="150" cy={y - 4} r="2.4" fill={active ? gate.color : "#cbd5e1"} />
              </g>
            )}
            <rect x="25" y={y} width="250" height="42" rx="10" fill={active ? `${gate.color}12` : "#94a3b80a"} stroke={active ? gate.color : "#cbd5e1"} strokeWidth={index === step ? 1.25 : 1} />
            <text x="42" y={y + 18} fontSize="10.5" fontWeight="700" fill={active ? gate.color : "#64748b"}>{index + 1}. {gate.name}</text>
            <text x="42" y={y + 33} fontSize="8.8" fill="currentColor">{gate.detail}</text>
            <text x="260" y={y + 26} textAnchor="end" fontSize="8.8" fontWeight="700" fill={index === step ? gate.color : "#64748b"}>{index === step ? "확인" : index < step ? "통과" : "대기"}</text>
          </g>
        );
      })}
      <text x="150" y="314" textAnchor="middle" fontSize="8.8" fill="#64748b">70B · 32K · 동시 8 · 자체 랙 + cloud burst</text>
    </svg>
  );
}

export default function AxesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <>
          <MobileFlow step={step} />
          <DesktopFlow step={step} />
        </>
      )}
    </StepViz>
  );
}
