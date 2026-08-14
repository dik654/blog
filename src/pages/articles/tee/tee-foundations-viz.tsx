type Step = readonly [string, string, string];

function FlatFlow({
  id,
  title,
  description,
  steps,
}: {
  id: string;
  title: string;
  description: string;
  steps: readonly Step[];
}) {
  return (
    <figure
      data-viz={id}
      data-viz-canvas
      className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card"
    >
      <figcaption className="border-b border-border/70 p-4 sm:p-6">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
      </figcaption>
      <div className="grid min-w-0 gap-px bg-border/70 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(([eyebrow, heading, body]) => (
          <div key={eyebrow} className="min-w-0 bg-background p-4 sm:p-5">
            <p className="text-[11px] font-bold tracking-[0.12em] text-primary">{eyebrow}</p>
            <p className="mt-2 break-keep text-sm font-semibold text-foreground">{heading}</p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

export function HardwareBoundaryViz() {
  return (
    <FlatFlow
      id="hardware-security-boundary"
      title="Payroll key를 내주기 전에 네 질문을 따로 답한다"
      description="암호화 하나로 기밀성·무결성·freshness·복구가 모두 해결된다고 보지 않습니다."
      steps={[
        ["THREAT", "누구를 불신하는가", "Host OS·VMM·DRAM 관찰자는 불신하지만 workload 자체 버그와 side channel은 별도 위험입니다."],
        ["PROTECT", "무엇을 막는가", "서명된 boot, 접근 제어, memory encryption처럼 보호할 property를 명시합니다."],
        ["DETECT", "무엇을 관측하는가", "Measurement·event log·attestation evidence로 실제 상태를 판정합니다."],
        ["RECOVER", "실패 뒤 무엇을 하는가", "Secret 미지급, firmware rollback 방지, known-good image 복구와 audit receipt를 준비합니다."],
      ]}
    />
  );
}

export function MeasuredBootViz() {
  return (
    <FlatFlow
      id="measured-boot-pcr"
      title="Event log는 설명서이고 PCR은 순서가 접힌 요약값이다"
      description="Verifier는 quote의 PCR만 보지 않고 같은 순서로 log를 replay해 reference value와 비교합니다."
      steps={[
        ["EVENT 1", "Firmware", "Firmware bytes의 digest와 event 설명을 log에 남기고 PCR에 extend합니다."],
        ["EVENT 2", "Bootloader", "이전 PCR과 새 digest를 함께 hash하므로 순서를 바꾸면 최종 PCR도 달라집니다."],
        ["EVENT 3", "Kernel", "Secure Boot의 서명 허용과 별개로 실제 선택된 component를 측정합니다."],
        ["APPRAISE", "Replay + policy", "Quote 서명·nonce·log replay·reference value·TCB status를 함께 판정합니다."],
      ]}
    />
  );
}

export function TeeMemoryViz() {
  return (
    <FlatFlow
      id="tee-memory-boundary"
      title="Private page와 shared page는 같은 보안 의미를 갖지 않는다"
      description="Host와 I/O를 하려면 명시적인 shared buffer가 필요하며, 그 경계에서 다시 검증·암호화해야 합니다."
      steps={[
        ["PRIVATE", "TEE private memory", "CPU package 밖에서는 암호화되고 ownership·translation policy로 host 접근을 제한합니다."],
        ["CACHE", "CPU 내부 평문", "실행하려면 cache/register에서 평문이 되므로 microarchitecture·side channel 위험은 남습니다."],
        ["SHARED", "Host-visible buffer", "Network·disk I/O를 위해 공유한 bytes는 untrusted input/output으로 취급합니다."],
        ["VERIFY", "Copy·validate·commit", "Length·schema·counter를 검증하고 private state는 성공 뒤 한 번만 갱신합니다."],
      ]}
    />
  );
}

export function AttestationViz() {
  return (
    <FlatFlow
      id="rats-attestation-flow"
      title="Evidence를 검증한 뒤에도 relying party의 authorization이 한 단계 더 남는다"
      description="RATS의 Attester·Verifier·Relying Party를 분리하면 ‘서명이 맞다’와 ‘secret을 줘도 된다’를 혼동하지 않습니다."
      steps={[
        ["CHALLENGE", "Relying Party", "예측하기 어려운 nonce와 요청 context를 보냅니다."],
        ["EVIDENCE", "Attester", "Measurement·TCB claim·nonce binding을 attestation key로 보호합니다."],
        ["APPRAISE", "Verifier", "Signature·endorsement·reference value·freshness 정책으로 attestation result를 만듭니다."],
        ["AUTHORIZE", "Relying Party", "Result와 업무 정책을 함께 적용해 payroll key release·deny·review를 결정합니다."],
      ]}
    />
  );
}
