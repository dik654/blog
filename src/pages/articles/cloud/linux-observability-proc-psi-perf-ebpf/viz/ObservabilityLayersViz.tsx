import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 커널 카운터 → 가상 파일 → (명령 | 수집기 → Prometheus → 대시보드).
 * 뺄셈이 일어나는 자리가 경로마다 다르고, perf·bpftrace는 카운터 파일을 읽지 않는다.
 */
const SCENES = [
  { label: "1층 · 커널이 파일로 내놓습니다", summary: "읽을 때마다 그 순간의 값", on: ["file"], note: "누적 카운터는 CPU가 사용자 모드에서 보낸 tick(보통 1/100초), 작업이 CPU를 기다린 나노초처럼 계속 쌓이는 수입니다. /proc와 /sys의 파일은 디스크에 없는 가상 파일입니다." },
  { label: "2층 · 명령이 두 번 읽어 뺍니다", summary: "(나중 값 − 처음 값) ÷ 간격", on: ["file", "cmd", "out"], note: "top·vmstat·mpstat·iostat는 파일을 읽고 간격만큼 기다렸다가 다시 읽어 뺀 뒤 간격으로 나눕니다. \"CPU 40%\"와 \"iostat %util\"이 이렇게 나온 비율이고, 뺄셈은 명령 안에서 끝납니다." },
  { label: "3·4층 · 수집기는 빼지 않고 넘깁니다", summary: "뺄셈은 PromQL의 rate()", on: ["file", "exporter", "prom", "dash"], note: "node_exporter도 같은 파일을 읽지만 카운터를 그대로 지표 저장소 Prometheus에 넘깁니다. 뺄셈은 그 질의 언어 PromQL의 rate()가 합니다." },
  { label: "결이 다른 둘 · perf와 bpftrace", summary: "카운터는 얼마나, 이 둘은 무엇이", on: ["inside", "perf", "bpf"], note: "perf는 일정 빈도로 \"지금 CPU에서 무엇이 실행 중인가\"를 표본화합니다. bpftrace는 시스템 콜 진입 같은 커널 안 지점에 작은 프로그램을 붙여 이벤트가 날 때마다 셉니다." },
] as const;

type NodeId = (typeof SCENES)[number]["on"][number];

function Box({ x, y, w, h, title, sub, lit, sum = false }: { x: number; y: number; w: number; h: number; title: string; sub: string; lit: boolean; sum?: boolean }) {
  return (
    <g opacity={lit ? 1 : 0.32} className="transition-opacity duration-300 motion-reduce:transition-none">
      <rect x={x} y={y} width={w} height={h} rx={6} fill={lit ? "#2563eb" : "none"} fillOpacity={lit ? 0.1 : 0} stroke={lit ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
      <text x={x + w / 2} y={y + 18} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-foreground">{title}</text>
      <text x={x + w / 2} y={y + 34} textAnchor="middle" fontSize={sum ? 10 : 9.5} fontWeight={sum ? 700 : 400} fill={sum ? "#b45309" : "#64748b"}>{sub}</text>
    </g>
  );
}

function Up({ x, y1, y2, lit, dashed = false }: { x: number; y1: number; y2: number; lit: boolean; dashed?: boolean }) {
  const color = lit ? "#2563eb" : "#94a3b8";
  return (
    <g opacity={lit ? 1 : 0.32}>
      <line x1={x} x2={x} y1={y1} y2={y2 + 5} stroke={color} strokeWidth={1} strokeDasharray={dashed ? "3 3" : undefined} />
      <path d={`M${x - 3.5},${y2 + 6} L${x},${y2} L${x + 3.5},${y2 + 6} Z`} fill={color} />
    </g>
  );
}

export default function ObservabilityLayersViz() {
  return (
    <SceneShell
      eyebrow="관측의 네 층"
      title="같은 카운터가 어느 길로 올라오는지, 뺄셈은 어디서 하는지"
      description="아래에서 위로 읽습니다. 주황 글자가 뺄셈이 일어나는 자리이고, 오른쪽 두 도구는 파일을 거치지 않습니다."
      ariaLabel="커널 카운터에서 명령, 수집기, 대시보드로 올라가는 경로와 perf, bpftrace의 별도 경로"
      scenes={SCENES}
      render={(active) => {
        const on = new Set<NodeId>(SCENES[active].on);
        const has = (id: NodeId) => on.has(id);
        return (
          <svg viewBox="0 0 360 262" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Box x={122} y={6} w={116} h={44} title="4층 대시보드" sub="그래프로 표시" lit={has("dash")} />
            <Box x={122} y={74} w={116} h={44} title="Prometheus" sub="rate()가 뺄셈" lit={has("prom")} sum />
            <Box x={122} y={142} w={116} h={44} title="3층 수집기" sub="node_exporter" lit={has("exporter")} />
            <Box x={6} y={74} w={104} h={44} title="CPU 40%" sub="명령이 낸 비율" lit={has("out")} />
            <Box x={6} y={142} w={104} h={44} title="2층 명령" sub="읽고 · 기다리고 · 뺌" lit={has("cmd")} sum />
            <Box x={6} y={210} w={232} h={46} title="1층 커널 누적 카운터" sub="/proc · /sys 가상 파일로 내놓음" lit={has("file")} />
            <Box x={246} y={142} w={52} h={44} title="perf" sub="표본" lit={has("perf")} />
            <Box x={302} y={142} w={52} h={44} title="bpftrace" sub="이벤트" lit={has("bpf")} />
            <Box x={246} y={210} w={108} h={46} title="파일을 안 거침" sub="CPU 위 코드 · 커널 지점" lit={has("inside")} />
            <Up x={58} y1={210} y2={186} lit={has("cmd")} />
            <Up x={58} y1={142} y2={118} lit={has("out")} />
            <Up x={180} y1={210} y2={186} lit={has("exporter")} />
            <Up x={180} y1={142} y2={118} lit={has("prom")} />
            <Up x={180} y1={74} y2={50} lit={has("dash")} />
            <Up x={272} y1={210} y2={186} lit={has("perf")} dashed />
            <Up x={328} y1={210} y2={186} lit={has("bpf")} dashed />
            <text x={300} y={104} textAnchor="middle" fontSize={11} fontWeight={700} opacity={has("perf") ? 1 : 0.32} className="fill-foreground">무엇이?</text>
            <text x={300} y={124} textAnchor="middle" fontSize={9.5} opacity={has("perf") ? 1 : 0.32} fill="#64748b">코드 · 이벤트 이름</text>
          </svg>
        );
      }}
    />
  );
}
