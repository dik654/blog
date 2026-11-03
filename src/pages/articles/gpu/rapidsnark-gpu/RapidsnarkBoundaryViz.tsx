import StepViz, { type StepDef } from "@/components/ui/step-viz";

const STEPS: readonly StepDef[] = [
  {
    label: "현재 rapidsnark와 제안한 GPU adapter를 먼저 분리한다",
    tabLabel: "사실 경계",
    body: "공식 v0.0.8 source는 C++와 Intel/ARM assembly로 증명을 만듭니다. Repository tree에는 CUDA source가 없습니다. 오른쪽 GPU adapter는 기존 기능 설명이 아니라 새로 구현해야 할 제안입니다.",
  },
  {
    label: "WTNS와 zkey가 같은 증명 작업인지 입구에서 확인한다",
    tabLabel: "입력 승인",
    body: "설명용 요청에서 두 artifact는 BN254 scalar field와 변수 8개를 공유하고, zkey는 Groth16·public 2개·domain 8을 선언합니다. Header뿐 아니라 승인된 exact digest까지 맞아야 계산을 시작합니다.",
  },
  {
    label: "현재 CPU 경로가 proof를 만드는 순서를 따라간다",
    tabLabel: "CPU 경로",
    body: "Witness로 A/B1/B2/C MSM을 계산하고, sparse coefficients를 모아 FFT quotient를 만든 뒤 H MSM과 proof assembly로 끝납니다. 앞 단계의 output이 다음 단계의 input이므로 kernel 목록만 나열하면 안 됩니다.",
  },
  {
    label: "NTT와 MSM을 옮기려면 별도 계약이 필요하다",
    tabLabel: "GPU 경계",
    body: "GPU 후보는 large-domain NTT와 MSM입니다. 하지만 field encoding·NTT order·point layout·buffer owner·completion event가 일치해야 합니다. Parser와 최종 proof assembly는 이 제안에서 CPU에 남습니다.",
  },
  {
    label: "Kernel 시간이 아니라 왕복 시간을 비교해 경로를 고른다",
    tabLabel: "경로 선택",
    body: "CPU 18ms에 비해 GPU upload 3+queue 4+kernel 5+download 1+sync 1=14ms이면 4ms를 절약합니다. Queue가 10ms로 늘면 GPU 전체가 20ms가 되어 같은 요청도 CPU가 낫습니다.",
  },
  {
    label: "최종 검증과 실제 선택 경로를 따로 보고한다",
    tabLabel: "release receipt",
    body: "100건 중 GPU 90건, CPU fallback 10건, 실패 0건이 모두 verifier를 통과했다면 서비스 성공은 100건입니다. 그러나 GPU가 전체 100건을 성공시켰다고 말할 수는 없습니다.",
  },
] as const;

function Arrow() {
  return (
    <>
      <span aria-hidden className="text-primary sm:hidden">↓</span>
      <span aria-hidden className="hidden text-primary sm:inline">→</span>
    </>
  );
}

function Scene({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-200">현재 공식 v0.0.8</p>
          <strong className="mt-2 block text-lg">CPU prover</strong>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {["C++", "Intel/ARM assembly", "thread pool", "CPU FFT·MSM"].map((item) => <span key={item} className="rounded-full border border-current/25 px-2.5 py-1">{item}</span>)}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Git tree: .cu / .cuh 없음</p>
        </div>
        <div className="rounded-xl border-2 border-dashed border-violet-300 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950/30">
          <p className="text-xs font-bold text-violet-700 dark:text-violet-200">별도 구현 제안</p>
          <strong className="mt-2 block text-lg">GPU adapter</strong>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {["NTT offload", "MSM offload", "buffer contract", "parity·fallback"].map((item) => <span key={item} className="rounded-full border border-current/25 px-2.5 py-1">{item}</span>)}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">현재 기능처럼 설명하면 안 됨</p>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="w-full max-w-2xl space-y-3">
        <p className="text-center text-xs font-semibold text-primary">설명용 proving request #42</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-sky-300 bg-sky-50 p-4 dark:border-sky-800 dark:bg-sky-950/30">
            <strong className="block">circuit.zkey</strong>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs"><dt>protocol</dt><dd className="font-bold">Groth16</dd><dt>field</dt><dd className="font-bold">BN254 Fr</dd><dt>nVars</dt><dd className="font-bold">8</dd><dt>nPublic</dt><dd className="font-bold">2</dd><dt>domain</dt><dd className="font-bold">8</dd><dt>digest</dt><dd className="font-bold">z-7a…</dd></dl>
          </div>
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
            <strong className="block">witness.wtns</strong>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs"><dt>field</dt><dd className="font-bold">BN254 Fr</dd><dt>nVars</dt><dd className="font-bold">8</dd><dt>digest</dt><dd className="font-bold">w-3c…</dd></dl>
          </div>
        </div>
        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-3 text-center text-sm font-black text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">field·count·protocol·domain·digest 일치 → 승인</div>
      </div>
    );
  }

  if (step === 2) {
    const stages = [
      ["1", "MSM A·B1·B2·C", "witness × query points"],
      ["2", "계수 누적", "sparse records → a,b,c"],
      ["3", "FFT quotient", "IFFT→coset→FFT"],
      ["4", "MSM H", "quotient × H query"],
      ["5", "proof assembly", "A∈G1 · B∈G2 · C∈G1"],
    ] as const;
    return (
      <div className="flex w-full max-w-3xl flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        {stages.map(([number, title, detail], index) => (
          <div key={number} className="contents">
            <div className="min-w-0 flex-1 rounded-xl border border-border bg-muted/15 p-3 text-center">
              <span className="text-[10px] font-bold text-primary">{number}</span>
              <strong className="mt-1 block text-xs sm:text-sm">{title}</strong>
              <span className="mt-1 block break-words text-[10px] leading-4 text-muted-foreground">{detail}</span>
            </div>
            {index < stages.length - 1 ? <Arrow /> : null}
          </div>
        ))}
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="w-full max-w-2xl space-y-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-950/30">
            <p className="text-xs font-bold">CPU가 계속 맡음</p>
            <p className="mt-2 text-sm">parse · admission<br />coefficients · proof assembly</p>
          </div>
          <Arrow />
          <div className="rounded-xl border-2 border-dashed border-violet-300 bg-violet-50 p-4 text-center dark:border-violet-800 dark:bg-violet-950/30">
            <p className="text-xs font-bold">새 GPU adapter 후보</p>
            <p className="mt-2 text-sm">large NTT · large MSM</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          {["field encoding", "NTT order", "point layout", "device owner", "stream·event", "typed fallback"].map((item) => <span key={item} className="rounded-full border border-border bg-muted/20 px-3 py-1.5 font-semibold">{item}</span>)}
        </div>
        <p className="text-center text-xs text-muted-foreground">하나라도 모르면 함수 이름만 바꿔 끼울 수 없습니다.</p>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-200">Queue 4ms일 때</p>
          <p className="mt-3 text-sm font-semibold">GPU = 3 + 4 + 5 + 1 + 1</p>
          <strong className="mt-1 block text-2xl">14ms</strong>
          <p className="mt-2 text-xs text-muted-foreground">CPU 18ms − GPU 14ms = 4ms 절약</p>
          <p className="mt-3 rounded-lg border border-emerald-400 p-2 text-center text-sm font-black">GPU 선택</p>
        </div>
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-200">Queue 10ms일 때</p>
          <p className="mt-3 text-sm font-semibold">GPU = 3 + 10 + 5 + 1 + 1</p>
          <strong className="mt-1 block text-2xl">20ms</strong>
          <p className="mt-2 text-xs text-muted-foreground">CPU 18ms − GPU 20ms = −2ms</p>
          <p className="mt-3 rounded-lg border border-amber-400 p-2 text-center text-sm font-black">CPU 유지</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="grid grid-cols-3 gap-2 text-center">
        {[["GPU", "90"], ["CPU fallback", "10"], ["failed", "0"]].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-muted/15 p-3">
            <strong className="block text-xl">{value}</strong>
            <span className="text-[10px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-950/30">
        <p className="text-xs text-muted-foreground">독립 verifier 승인</p>
        <strong className="text-xl">100 / 100 proofs</strong>
      </div>
      <div className="grid gap-2 text-xs sm:grid-cols-2">
        <p className="rounded-lg border border-emerald-300 p-3"><strong>서비스 성공</strong><span className="mt-1 block text-muted-foreground">100건 검증 완료</span></p>
        <p className="rounded-lg border border-rose-300 p-3"><strong>금지할 표현</strong><span className="mt-1 block text-muted-foreground">“GPU가 100건 모두 성공”</span></p>
      </div>
    </div>
  );
}

export function RapidsnarkBoundaryViz() {
  return <StepViz steps={STEPS}>{(step) => <Scene step={step} />}</StepViz>;
}
