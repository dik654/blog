import { useState } from "react";
import { HardwareArrow, HardwareNode, HardwareViz } from "@/components/viz/hardware-flow";

type PathKey = "nvlink" | "pcie" | "remote";

type Path = {
  label: string;
  shortLabel: string;
  question: string;
  answer: string;
  floor: string;
  stages: Array<{
    title: string;
    detail: string;
    metric?: string;
    tone: "violet" | "blue" | "emerald" | "amber";
    link?: string;
  }>;
};

const PATHS: Record<PathKey, Path> = {
  nvlink: {
    label: "같은 NVLink domain",
    shortLabel: "NVLink 내부",
    question: "두 GPU가 같은 NVLink·NVSwitch domain에 있고 peer access도 켜졌다면?",
    answer: "GPU memory 사이 전용 scale-up path를 쓸 수 있습니다. 다만 제품의 GPU당 aggregate 사양은 이 한 복사의 편도 goodput이 아닙니다.",
    floor: "전송 시간은 이 GPU pair의 실제 P2P bandwidth로 계산",
    stages: [
      { title: "Source GPU", detail: "1 GiB buffer · stream ready", tone: "violet", link: "NVLink" },
      { title: "NVLink fabric", detail: "지원 peer · switch path · active link", tone: "blue", link: "peer access" },
      { title: "Peer GPU", detail: "copy completion을 기다림", tone: "amber" },
    ],
  },
  pcie: {
    label: "같은 host의 PCIe pair",
    shortLabel: "PCIe 내부",
    question: "두 GPU가 PCIe 5.0 x16으로 협상됐지만 NVLink가 없다면?",
    answer: "같은 switch인지 CPU host bridge를 지나는지에 따라 경로가 달라집니다. x16 표시는 연결 폭일 뿐 P2P 허용과 실측값을 보장하지 않습니다.",
    floor: "이상적 하한 약 17.0 ms · 1 GiB ÷ 63.0 GB/s",
    stages: [
      { title: "Source GPU", detail: "1 GiB buffer · P2P 요청", tone: "violet", link: "PCIe x16" },
      { title: "Switch · root", detail: "PIX·PXB·PHB·SYS 경로 확인", metric: "raw ceiling ≤ 63.0 GB/s", tone: "blue", link: "PCIe x16" },
      { title: "Peer GPU", detail: "protocol·queue를 뺀 뒤 완료", tone: "amber" },
    ],
  },
  remote: {
    label: "다른 host의 remote GPU",
    shortLabel: "원격 GPU",
    question: "GPU는 PCIe 5.0 x16, 두 host 사이는 400 Gb/s network라면?",
    answer: "Source GPU에서 HCA로 나간 뒤 network와 remote HCA를 지나야 합니다. 이 예에서는 50 GB/s인 network 선로가 63 GB/s PCIe보다 먼저 상한을 만듭니다.",
    floor: "이상적 하한 약 21.5 ms · 1 GiB ÷ 50 GB/s",
    stages: [
      { title: "Source GPU", detail: "1 GiB buffer · GDR 가능성 확인", tone: "violet", link: "PCIe" },
      { title: "Local HCA", detail: "GPU–NIC locality · DMA queue", metric: "raw ceiling ≤ 63.0 GB/s", tone: "emerald", link: "400 Gb/s" },
      { title: "Network fabric", detail: "shared port · route · congestion", metric: "raw ceiling = 50 GB/s", tone: "blue", link: "400 Gb/s" },
      { title: "Remote HCA · GPU", detail: "remote PCIe path · completion", metric: "raw ceiling ≤ 63.0 GB/s", tone: "amber" },
    ],
  },
};

const ORDER: PathKey[] = ["nvlink", "pcie", "remote"];

export default function InterconnectPathViz() {
  const [selected, setSelected] = useState<PathKey>("remote");
  const path = PATHS[selected];

  return (
    <HardwareViz
      eyebrow="1 GiB BUFFER TRACE"
      title="도착지를 고르면 실제 병목 구간이 보입니다"
      description="같은 1 GiB도 상대가 어디에 있느냐에 따라 통과하는 경계가 달라집니다. 숫자는 비교용 raw 상한이며 실측 goodput이 아닙니다."
      note={<><strong>읽는 법:</strong> 큰 전송의 이상적 하한은 가장 좁은 구간으로 계산합니다. 작은 전송은 각 구간의 고정 latency가 더 중요하고, host staging이 생기면 별도 복사 시간도 더해집니다.</>}
    >
      <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="GPU buffer 경로 선택">
        {ORDER.map((key) => {
          const item = PATHS[key];
          const active = selected === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelected(key)}
              className={`min-w-0 rounded-xl border px-2 py-3 text-center text-[11px] font-bold leading-4 sm:px-4 sm:text-sm ${active ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground"}`}
            >
              <span className="sm:hidden">{item.shortLabel}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-border bg-background/70 p-4 sm:p-5">
        <p className="text-sm font-bold leading-6">{path.question}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{path.answer}</p>
      </div>

      <div className={`mt-4 grid min-w-0 items-stretch gap-2 ${path.stages.length === 4 ? "md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]" : "md:grid-cols-[1fr_auto_1fr_auto_1fr]"}`}>
        {path.stages.map((stage, index) => (
          <div className="contents" key={stage.title}>
            <HardwareNode title={stage.title} detail={stage.detail} metric={stage.metric} tone={stage.tone} />
            {index < path.stages.length - 1 ? <HardwareArrow label={stage.link} /> : null}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-1 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs font-black tracking-wide text-primary">IDEAL FLOOR</span>
        <strong className="text-sm leading-6">{path.floor}</strong>
      </div>
    </HardwareViz>
  );
}
