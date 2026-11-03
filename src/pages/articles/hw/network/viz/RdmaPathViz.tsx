import StepViz, { type StepDef } from "@/components/ui/step-viz";

const STEPS: readonly StepDef[] = [
  {
    label: "Link가 켜진 것과 payload가 도착한 것을 구분한다",
    tabLabel: "출발 사건",
    body: "두 HCA가 400Gb/s ACTIVE여도 잘못된 GID를 고르면 첫 연결 전에 실패해 application payload는 0Gb/s입니다. Nominal link rate는 전송 성공의 증거가 아닙니다.",
  },
  {
    label: "CPU가 NIC가 접근할 memory 범위와 권한을 등록한다",
    tabLabel: "memory 등록",
    body: "설명용 4KiB buffer 0x1000–0x1fff를 등록해 local key L17과 remote-write key R42를 얻습니다. CPU는 key와 buffer lifetime을 관리하고 NIC는 승인된 범위만 DMA합니다.",
  },
  {
    label: "Remote와 같은 subnet의 RoCE v2 GID를 고른다",
    tabLabel: "GID와 route",
    body: "Remote 10.20.30.2/30의 network는 10.20.30.0입니다. Local 10.20.30.1/30은 같은 network이고, 10.20.31.1/30은 다르므로 첫 주소를 source GID로 선택합니다.",
  },
  {
    label: "Work request를 queue에 넣고 completion을 읽는다",
    tabLabel: "QP와 CQ",
    body: "Host는 RDMA WRITE의 remote address·length·rkey를 work queue에 넣습니다. NIC가 packet과 DMA를 처리한 뒤 completion queue에 성공 또는 오류를 남깁니다. CPU control 책임은 사라지지 않습니다.",
  },
  {
    label: "Congestion 신호와 pause를 서로 다른 도구로 본다",
    tabLabel: "ECN과 PFC",
    body: "Queue가 차면 switch가 ECN을 표시하고 receiver가 CNP를 보내 sender rate를 낮출 수 있습니다. PFC는 해당 priority를 잠시 멈추지만 head-of-line blocking과 pause propagation을 만들 수 있습니다.",
  },
  {
    label: "GPU memory 직결 여부는 PCIe topology가 결정한다",
    tabLabel: "GPUDirect",
    body: "GPU와 NIC가 지원되는 가까운 PCIe path를 공유하면 NIC가 GPU memory로 직접 DMA할 수 있습니다. 그렇지 않으면 host staging을 거칠 수 있습니다. NVLink가 있다는 사실만으로 node 밖 RDMA가 보장되지는 않습니다.",
  },
  {
    label: "Verbs·counter·application이 같은 경로를 썼을 때 승인한다",
    tabLabel: "release receipt",
    body: "설명용 결과가 ib_write_bw 380Gb/s, completion failure 0, drop·retry delta 0이고 NCCL log도 같은 HCA의 RDMA transport를 골랐다면 다음 단계로 올립니다. Port ACTIVE 하나만으로 승인하지 않습니다.",
  },
] as const;

function DownArrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-1 text-primary">
      {label ? <span className="text-[10px] font-semibold">{label}</span> : null}
      <span aria-hidden className="text-xl">↓</span>
    </div>
  );
}

function Scene({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-950/30">
          <p className="text-xs font-bold">물리 링크</p>
          <strong className="mt-2 block text-2xl">400Gb/s</strong>
          <span className="text-xs text-muted-foreground">ACTIVE</span>
        </div>
        <span aria-hidden className="text-center text-xl text-primary">≠</span>
        <div className="rounded-xl border-2 border-rose-300 bg-rose-50 p-4 text-center dark:border-rose-800 dark:bg-rose-950/30">
          <p className="text-xs font-bold">Application payload</p>
          <strong className="mt-2 block text-2xl">0Gb/s</strong>
          <span className="text-xs text-muted-foreground">GID mismatch</span>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="w-full max-w-xl space-y-3 text-center">
        <p className="text-xs font-semibold text-primary">설명용 host buffer</p>
        <div className="grid grid-cols-4 overflow-hidden rounded-xl border-2 border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/30">
          {["0x1000", "…", "4KiB", "0x1fff"].map((value) => <span key={value} className="grid h-14 min-w-0 place-items-center border-r border-current/15 text-[11px] font-bold last:border-r-0">{value}</span>)}
        </div>
        <DownArrow label="CPU가 range·access·lifetime 등록" />
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-violet-300 bg-violet-50 p-3 dark:border-violet-800 dark:bg-violet-950/30"><span className="text-[10px] text-muted-foreground">local access</span><strong className="block text-lg">lkey L17</strong></div>
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30"><span className="text-[10px] text-muted-foreground">remote write</span><strong className="block text-lg">rkey R42</strong></div>
        </div>
        <p className="text-xs text-muted-foreground">Key가 맞아도 해제된 buffer라면 접근을 거부해야 합니다.</p>
      </div>
    );
  }

  if (step === 2) {
    const candidates = [
      ["10.20.30.1/30", "10.20.30.0", "선택", true],
      ["10.20.31.1/30", "10.20.31.0", "제외", false],
    ] as const;
    return (
      <div className="w-full max-w-2xl space-y-3">
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-center dark:border-amber-800 dark:bg-amber-950/30">
          <span className="text-xs text-muted-foreground">remote GID</span>
          <strong className="ml-2">10.20.30.2/30 → network 10.20.30.0</strong>
        </div>
        {candidates.map(([address, network, result, selected]) => (
          <div key={address} className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-3 ${selected ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30" : "border-border bg-muted/15"}`}>
            <div className="min-w-0">
              <strong className="block text-sm">{address}</strong>
              <span className="text-xs text-muted-foreground">& 255.255.255.252 = {network}</span>
            </div>
            <span className="rounded-full border border-current/25 px-3 py-1 text-xs font-bold">{result}</span>
          </div>
        ))}
        <p className="text-center text-xs text-muted-foreground">같은 prefix는 후보 조건입니다. 실제 device·port·VLAN·route도 이어서 확인합니다.</p>
      </div>
    );
  }

  if (step === 3) {
    const stages = [
      ["Host", "RDMA WRITE", "addr 0x2000 · 4KiB · R42"],
      ["NIC A", "packet + DMA", "QP가 transport 실행"],
      ["NIC B", "remote write", "등록된 range만 접근"],
      ["CQ", "completion", "success 또는 typed error"],
    ] as const;
    return (
      <div className="flex w-full max-w-3xl flex-col gap-2 sm:flex-row sm:items-center">
        {stages.map(([owner, title, detail], index) => (
          <div key={owner} className="contents">
            <div className="min-w-0 flex-1 rounded-xl border border-border bg-muted/15 p-3 text-center">
              <span className="text-[10px] font-bold text-primary">{owner}</span>
              <strong className="mt-1 block text-sm">{title}</strong>
              <span className="mt-1 block break-words text-[10px] leading-4 text-muted-foreground">{detail}</span>
            </div>
            {index < stages.length - 1 ? <><span aria-hidden className="text-center text-primary sm:hidden">↓</span><span aria-hidden className="hidden text-primary sm:inline">→</span></> : null}
          </div>
        ))}
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        <div className="rounded-xl border-2 border-sky-300 bg-sky-50 p-4 dark:border-sky-800 dark:bg-sky-950/30">
          <p className="text-xs font-bold text-sky-700 dark:text-sky-200">ECN · CNP</p>
          <ol className="mt-3 space-y-2 text-sm"><li>1. Queue threshold 초과</li><li>2. Switch가 packet에 mark</li><li>3. Receiver가 CNP 전송</li><li>4. Sender가 rate 조절</li></ol>
        </div>
        <div className="rounded-xl border-2 border-violet-300 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950/30">
          <p className="text-xs font-bold text-violet-700 dark:text-violet-200">PFC pause</p>
          <p className="mt-3 text-sm leading-6">특정 priority의 송신을 잠시 멈춥니다.</p>
          <div className="mt-3 rounded-lg border border-rose-300 bg-rose-50 p-2 text-xs dark:border-rose-800 dark:bg-rose-950/30">과도하면 pause propagation·head-of-line blocking</div>
        </div>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          {[
            ["GPU 0 VRAM", "source buffer"],
            ["PCIe path", "switch · root · ACS/IOMMU"],
            ["NIC 0", "GPUDirect DMA"],
            ["RoCE fabric", "remote node"],
            ["NIC 1 → GPU 1", "destination"],
          ].map(([title, detail], index, all) => (
            <div key={title} className="contents">
              <div className="min-w-0 flex-1 rounded-xl border border-border bg-muted/15 p-3 text-center"><strong className="block text-xs">{title}</strong><span className="mt-1 block text-[10px] leading-4 text-muted-foreground">{detail}</span></div>
              {index < all.length - 1 ? <><span aria-hidden className="text-center text-primary sm:hidden">↓</span><span aria-hidden className="hidden text-primary sm:inline">→</span></> : null}
            </div>
          ))}
        </div>
        <div className="grid gap-2 text-xs sm:grid-cols-2">
          <p className="rounded-lg border border-emerald-300 p-3"><strong>직결 후보</strong><span className="mt-1 block text-muted-foreground">지원되는 가까운 PCIe path</span></p>
          <p className="rounded-lg border border-amber-300 p-3"><strong>Fallback</strong><span className="mt-1 block text-muted-foreground">host staging·다른 NIC</span></p>
        </div>
        <p className="text-center text-xs text-muted-foreground">NVLink는 node 안 GPU 경로이며 이 remote RoCE 구간을 대신하지 않습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[["verbs goodput", "380Gb/s"], ["CQ failure", "0"], ["drop·retry Δ", "0"], ["NCCL HCA", "NIC 0"]].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-muted/15 p-3 text-center"><strong className="block text-base">{value}</strong><span className="text-[10px] text-muted-foreground">{label}</span></div>
        ))}
      </div>
      <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-950/30"><strong>verbs 승인 → NCCL transport 확인 → application 측정</strong></div>
      <div className="grid gap-2 text-xs sm:grid-cols-3">
        {["device·GID receipt", "fabric counters", "payload p50·p99"].map((item) => <p key={item} className="rounded-lg border border-border p-3 text-center font-semibold">{item}</p>)}
      </div>
    </div>
  );
}

export default function RdmaPathViz() {
  return <StepViz steps={STEPS}>{(step) => <Scene step={step} />}</StepViz>;
}
