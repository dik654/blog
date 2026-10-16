import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * Pod의 resolv.conf(search 3개 · ndots:5)에서 이름 하나가 몇 개의 DNS 질의로 펼쳐지는지를 4행 × 2열 고정 격자로 센다.
 * 한 mechanism: 점 개수 < ndots 이고 끝에 점이 없으면 search 목록을 순서대로 붙여 먼저 묻고, 전부 실패해야 이름 그대로 묻는다. 행마다 A·AAAA 두 질의다.
 */
const SEARCH = ["test.svc.cluster.local", "svc.cluster.local", "cluster.local"] as const;

interface Scene {
  label: string;
  name: string;
  dots: number;
  trailing: boolean;
  /** 각 행의 상태: 질의 안 함 / NXDOMAIN / 응답 */
  rows: readonly ("skip" | "nx" | "ok")[];
  count: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "api.example.com · 점 2개",
    name: "api.example.com",
    dots: 2,
    trailing: false,
    rows: ["nx", "nx", "nx", "ok"],
    count: "4 이름 × 2 = 8 질의",
    note: "점이 2개라 ndots 5보다 적고 끝에 점도 없습니다. glibc는 search 목록 세 개를 차례로 붙여 묻고 셋 다 NXDOMAIN을 받은 뒤에야 이름 그대로 묻습니다. 이름마다 A와 AAAA를 보내므로 외부 이름 하나에 8번 질의합니다.",
  },
  {
    label: "api.example.com. · 끝에 점",
    name: "api.example.com.",
    dots: 3,
    trailing: true,
    rows: ["skip", "skip", "skip", "ok"],
    count: "1 이름 × 2 = 2 질의",
    note: "끝의 점은 '절대 이름'이라는 표시입니다. __res_context_search는 trailing_dot이면 search를 건너뛰고 그대로 한 번만 묻습니다. 코드에서 외부 호스트를 FQDN에 점을 붙여 적으면 질의가 8에서 2로 줄어듭니다.",
  },
  {
    label: "data · 점 0개",
    name: "data",
    dots: 0,
    trailing: false,
    rows: ["ok", "skip", "skip", "skip"],
    count: "1 이름 × 2 = 2 질의",
    note: "같은 네임스페이스의 Service 이름은 첫 search 항목 test.svc.cluster.local을 붙인 질의가 바로 응답을 받습니다. 짧은 이름이 클러스터 안에서는 가장 싼 이유이고, ndots:5가 이 경우를 위해 큰 값으로 잡혀 있습니다.",
  },
  {
    label: "data.prod · 점 1개",
    name: "data.prod",
    dots: 1,
    trailing: false,
    rows: ["nx", "ok", "skip", "skip"],
    count: "2 이름 × 2 = 4 질의",
    note: "다른 네임스페이스 prod의 Service는 첫 항목을 붙인 data.prod.test.svc.cluster.local이 NXDOMAIN이고, 둘째 항목을 붙인 data.prod.svc.cluster.local이 응답합니다. ndots가 1이었다면 점이 하나 있으니 이름 그대로 먼저 물었을 것입니다.",
  },
];

const ROW_LABELS = [...SEARCH.map((s) => `+ ${s}`), "그대로"] as const;

export default function DnsSearchNdotsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const style = (s: "skip" | "nx" | "ok") =>
    s === "ok" ? { bg: "#dcfce7", border: "#16a34a", text: "#166534", label: "응답" } : s === "nx" ? { bg: "#fee2e2", border: "#dc2626", text: "#991b1b", label: "NXDOMAIN" } : { bg: "rgba(0,0,0,0)", border: "#e2e8f0", text: "#94a3b8", label: "질의 안 함" };

  return (
    <VizFrame
      eyebrow="resolv.conf search · ndots"
      title="점이 ndots보다 적은 이름은 search 목록을 다 붙여 본 뒤에야 그대로 묻습니다"
      description="왼쪽은 붙이는 search 항목(마지막 행은 이름 그대로), 오른쪽 두 칸은 A·AAAA 질의입니다. 빨강은 NXDOMAIN, 초록은 응답, 회색은 보내지 않은 질의입니다."
      note="(가정) Pod가 네임스페이스 test에 있고 kubelet이 쓴 resolv.conf는 search test.svc.cluster.local svc.cluster.local cluster.local / options ndots:5입니다. 호스트 search 도메인은 없다고 둡니다. A·AAAA 동시 질의는 glibc 기본 동작입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="DNS search 확장과 질의 수"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-sm font-bold text-primary">{scene.count}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
            <span className="rounded border border-border px-2 py-0.5 font-bold text-foreground">{scene.name}</span>
            <span className="text-muted-foreground">
              dots={scene.dots} {scene.dots >= 5 || scene.trailing ? "≥ ndots 또는 끝점 → 그대로 먼저" : "< ndots 5 → search 먼저"}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] gap-1 text-[11px] sm:text-xs">
            <span className="px-1 font-bold text-muted-foreground">붙이는 항목</span>
            <span className="px-1 text-center font-bold text-muted-foreground">A</span>
            <span className="px-1 text-center font-bold text-muted-foreground">AAAA</span>
            {ROW_LABELS.map((label, i) => {
              const st = style(scene.rows[i]);
              return (
                <div key={label} className="contents">
                  <motion.span
                    className="truncate rounded border px-1.5 py-1.5 font-mono"
                    initial={false}
                    animate={{ borderColor: st.border, color: scene.rows[i] === "skip" ? "#94a3b8" : "inherit", opacity: scene.rows[i] === "skip" ? 0.6 : 1 }}
                    transition={{ duration: reduced ? 0 : 0.25 }}
                    title={label}
                  >
                    {i + 1}. {label}
                  </motion.span>
                  {[0, 1].map((col) => (
                    <motion.span
                      key={col}
                      className="rounded border px-1 py-1.5 text-center font-bold"
                      initial={false}
                      animate={{ backgroundColor: st.bg, borderColor: st.border, color: st.text }}
                      transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : i * 0.12 + col * 0.04 }}
                    >
                      {st.label}
                    </motion.span>
                  ))}
                </div>
              );
            })}
          </div>
          <p className="mt-3 min-h-[11.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[10rem] sm:min-h-[5.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
