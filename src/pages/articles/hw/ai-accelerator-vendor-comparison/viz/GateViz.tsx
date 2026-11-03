import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "제품 목록을 자체 랙 기본 용량과 cloud burst 역할로 먼저 나눕니다",
    body: "B300·MI455X·Gaudi 3 계열은 실제 OEM·rack 조달을 확인하고, TPU7x·Trn3는 region·quota를 확인합니다. 서로 다른 역할의 후보를 한 구매 순위로 합치지 않습니다.",
  },
  {
    label: "한 장 최소 210.4GiB를 기준으로 실행 경로를 나눕니다",
    body: "B300 288GB와 MI455X 432GB는 한 장 실행 후보로 남지만 runtime 여유를 확인해야 합니다. 128GB·144GB·192GiB 후보는 여러 장 경로로 넘어갑니다.",
  },
  {
    label: "동일 artifact의 정확도와 필수 기능을 통과시킵니다",
    body: "Load 성공이 아니라 unsupported operator, CPU fallback, quantization, batching, cache와 관측 기능을 확인합니다. 하나라도 빠지면 성능 비교에서 분리합니다.",
  },
  {
    label: "같은 profile에서 p95 TTFT·TPOT와 처리량을 함께 잽니다",
    body: "32K·동시 8 요청의 warm·cold를 분리하고 error와 power도 같은 시간축에 기록합니다. Average나 peak tokens/s만으로 tail을 가리지 않습니다.",
  },
  {
    label: "기본 용량과 burst 역할에 맞는 조합을 선택합니다",
    body: "전력·냉각·cloud 요금·이식·cold start·장애 복구를 포함합니다. 결론은 전 세계 1등 한 제품이 아니라 역할별 승인 조합입니다.",
  },
] as const;

const C = { deploy: "#2563eb", memory: "#7c3aed", feature: "#0f766e", perf: "#c2410c", ops: "#be123c", muted: "#64748b" };
const ROWS = [
  { label: "배치", value: "자체 랙 base / cloud burst", color: C.deploy },
  { label: "HBM", value: "한 장 후보 / sharded 후보", color: C.memory },
  { label: "기능", value: "정확도 · fallback · serving", color: C.feature },
  { label: "성능", value: "p95 TTFT · TPOT · token/s", color: C.perf },
  { label: "운영", value: "전력 · 비용 · cold · 복구", color: C.ops },
] as const;

function DesktopGate({ step }: { step: number }) {
  return (
    <svg className="!hidden sm:!block" viewBox="0 0 720 310" role="img" aria-label="가속기 후보에 배치 메모리 기능 성능 운영 증거를 차례로 채우는 관문">
      <rect x="24" y="28" width="152" height="250" rx="14" fill="#2563eb0a" stroke="#94a3b8" strokeWidth="1.2" />
      <text x="100" y="56" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.deploy}>공식 문서의 후보</text>
      {[
        "HGX B300",
        "MI455X · Helios",
        "Gaudi 3",
        "TPU7x",
        "Trn3",
      ].map((name, index) => (
        <g key={name}>
          <rect x="42" y={74 + index * 36} width="116" height="26" rx="7" fill="#fff" fillOpacity="0.02" stroke="#cbd5e1" />
          <text x="100" y={91 + index * 36} textAnchor="middle" fontSize="9" fill="currentColor">{name}</text>
        </g>
      ))}
      <line x1="182" y1="153" x2="214" y2="153" stroke={ROWS[step].color} strokeWidth="1.2" />
      <circle cx="214" cy="153" r="3" fill={ROWS[step].color} />

      <rect x="224" y="28" width="472" height="250" rx="14" fill="#64748b08" stroke={ROWS[step].color} strokeWidth="1.25" />
      <text x="248" y="56" fontSize="10.5" fontWeight="700" fill={ROWS[step].color}>고정 workload의 승인 원장</text>
      <text x="676" y="56" textAnchor="end" fontSize="8.8" fill={C.muted}>70B · BF16 · 32K · 동시 8</text>
      {ROWS.map((row, index) => {
        const y = 76 + index * 37;
        const active = index <= step;
        return (
          <g key={row.label}>
            <rect x="246" y={y} width="428" height="29" rx="7" fill={active ? `${row.color}10` : "#94a3b808"} stroke={active ? row.color : "#cbd5e1"} strokeWidth={index === step ? 1.25 : 1} />
            <text x="262" y={y + 19} fontSize="9.5" fontWeight="700" fill={active ? row.color : C.muted}>{index + 1}. {row.label}</text>
            <text x="364" y={y + 19} fontSize="9" fill={active ? "currentColor" : C.muted}>{active ? row.value : "앞 관문을 통과한 뒤 측정"}</text>
            <text x="654" y={y + 19} textAnchor="end" fontSize="8.8" fontWeight="700" fill={index === step ? row.color : C.muted}>{index === step ? "지금 검증" : index < step ? "evidence 저장" : "대기"}</text>
          </g>
        );
      })}
      <text x="360" y="300" textAnchor="middle" fontSize="9" fontWeight="700" fill={step === 4 ? C.ops : C.muted}>{step === 4 ? "결론 · 자체 랙 base와 cloud burst의 역할별 승인 조합" : "한 관문의 문서값이 다음 관문의 실측값을 대신하지 않습니다"}</text>
    </svg>
  );
}

function MobileGate({ step }: { step: number }) {
  return (
    <svg className="block sm:!hidden" viewBox="0 0 300 390" role="img" aria-label="모바일용 가속기 후보 승인 원장">
      <rect x="22" y="16" width="256" height="52" rx="10" fill="#2563eb0d" stroke={C.deploy} strokeWidth="1.2" />
      <text x="150" y="38" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.deploy}>공식 문서의 다섯 대표 후보</text>
      <text x="150" y="56" textAnchor="middle" fontSize="8.8" fill="currentColor">B300 · MI455X · Gaudi 3 · TPU7x · Trn3</text>
      <line x1="150" y1="72" x2="150" y2="86" stroke={ROWS[step].color} strokeWidth="1.2" />
      <circle cx="150" cy="86" r="2.4" fill={ROWS[step].color} />
      {ROWS.map((row, index) => {
        const y = 92 + index * 52;
        const active = index <= step;
        return (
          <g key={row.label}>
            <rect x="22" y={y} width="256" height="40" rx="9" fill={active ? `${row.color}10` : "#94a3b808"} stroke={active ? row.color : "#cbd5e1"} strokeWidth={index === step ? 1.25 : 1} />
            <text x="38" y={y + 17} fontSize="10" fontWeight="700" fill={active ? row.color : C.muted}>{index + 1}. {row.label}</text>
            <text x="38" y={y + 31} fontSize="8.8" fill={active ? "currentColor" : C.muted}>{active ? row.value : "아직 측정하지 않음"}</text>
            <text x="264" y={y + 25} textAnchor="end" fontSize="8.8" fontWeight="700" fill={index === step ? row.color : C.muted}>{index === step ? "검증" : index < step ? "저장" : "대기"}</text>
          </g>
        );
      })}
      <text x="150" y="371" textAnchor="middle" fontSize="8.8" fontWeight="700" fill={step === 4 ? C.ops : C.muted}>{step === 4 ? "역할별 승인 조합을 선택" : "문서값 → 실행 evidence"}</text>
    </svg>
  );
}

export default function GateViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <>
          <MobileGate step={step} />
          <DesktopGate step={step} />
        </>
      )}
    </StepViz>
  );
}
