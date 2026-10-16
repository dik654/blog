import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * Pod spec 한 장이 커널의 세 축(cgroup 파일 · namespace 플래그 · capability 집합)으로 번역되는 모습을 고정 격자로 그린다.
 * 한 mechanism: 왼쪽 spec 줄 하나가 오른쪽 커널 객체 한 칸으로 떨어지고, 세 축은 서로 다른 질문(얼마나·무엇이 보이나·무엇을 할 수 있나)에 답한다.
 * 장면마다 켜지는 칸만 바뀌고 격자 크기는 그대로다.
 */
interface Row {
  spec: string;
  axis: 0 | 1 | 2;
  kernel: string;
  value: string;
}

const AXES = [
  { name: "cgroup v2", question: "얼마나 쓸 수 있나", color: "#2563eb" },
  { name: "namespace", question: "무엇이 보이나", color: "#16a34a" },
  { name: "capability", question: "무엇을 할 수 있나", color: "#b45309" },
] as const;

const ROWS: readonly Row[] = [
  { spec: "resources.requests.cpu: 500m", axis: 0, kernel: "cpu.weight", value: "20" },
  { spec: "resources.limits.cpu: 500m", axis: 0, kernel: "cpu.max", value: "50000 100000" },
  { spec: "resources.limits.memory: 2Gi", axis: 0, kernel: "memory.max", value: "2147483648" },
  { spec: "(Pod 하나)", axis: 1, kernel: "CLONE_NEWNET · NEWUTS · NEWIPC", value: "Pod 안 컨테이너가 공유" },
  { spec: "(컨테이너 하나)", axis: 1, kernel: "CLONE_NEWNS · NEWPID", value: "mount · PID 1" },
  { spec: "securityContext.runAsUser: 1000", axis: 2, kernel: "uid · CapEff", value: "non-root" },
  { spec: "capabilities.add: [NET_BIND_SERVICE]", axis: 2, kernel: "CAP 10 → bit 0x400", value: "1024 미만 bind 허용" },
];

interface Scene {
  label: string;
  axis: 0 | 1 | 2 | 3;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "Pod spec 한 장", axis: 3, note: "왼쪽은 운영자가 쓰는 spec 줄입니다. 컨테이너 런타임은 이 줄들을 세 종류의 커널 설정으로 나눠 씁니다. 세 축은 서로 독립이라 하나를 바꿔도 다른 축은 그대로입니다." },
  { label: "cgroup v2 · 얼마나", axis: 0, note: "requests와 limits는 cgroup 디렉터리의 파일 세 개로 떨어집니다. 500m request는 shares 512를 거쳐 cpu.weight 20, 500m limit은 cpu.max \"50000 100000\", 2Gi limit은 memory.max 2,147,483,648 byte입니다." },
  { label: "namespace · 무엇이 보이나", axis: 1, note: "네트워크·호스트 이름·IPC namespace는 Pod 단위라 한 Pod 안의 컨테이너들이 localhost와 hostname을 공유합니다. mount와 PID namespace는 컨테이너마다 따로라 각 컨테이너의 첫 프로세스가 PID 1입니다." },
  { label: "capability · 무엇을 할 수 있나", axis: 2, note: "runAsUser 1000이면 root 권한 전체가 사라지고, 필요한 능력만 capabilities.add로 돌려줍니다. CAP_NET_BIND_SERVICE는 번호 10이라 bitmap의 0x400 비트이고, 이 비트가 있어야 80번 포트에 bind할 수 있습니다." },
];

export default function ContainerThreeAxesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const lit = (axis: number) => scene.axis === 3 || scene.axis === axis;

  return (
    <VizFrame
      eyebrow="Container = cgroup + namespace + capability"
      title="spec 한 줄은 커널의 세 축 가운데 한 칸으로 떨어집니다"
      description="왼쪽은 Pod spec, 오른쪽은 그 줄이 쓰는 커널 파일·플래그·비트입니다. 색은 축을 뜻합니다."
      note="cpu.weight 20은 Kubernetes v1.37.1 kubelet의 변환식(1 + (512 − 2) × 9999 ÷ 262142)으로 계산한 값입니다. namespace 공유 범위는 containerd·CRI-O의 기본 Pod sandbox 설정 기준입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Pod spec이 cgroup·namespace·capability로 번역되는 표"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="min-h-[1.75rem] text-base font-bold">{scene.label}</h4>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {AXES.map((a, i) => (
              <motion.div
                key={a.name}
                className="rounded-md border px-2 py-1.5 text-center"
                initial={false}
                animate={{ borderColor: lit(i) ? a.color : "#e2e8f0", backgroundColor: lit(i) ? `${a.color}14` : "rgba(0,0,0,0)" }}
                transition={{ duration: reduced ? 0 : 0.25 }}
              >
                <div className="text-[11px] font-black" style={{ color: a.color }}>
                  {a.name}
                </div>
                <div className="text-[10px] leading-4 text-muted-foreground">{a.question}</div>
              </motion.div>
            ))}
          </div>
          <div className="mt-3 overflow-x-auto">
            <div className="grid min-w-[18rem] grid-cols-[minmax(0,1.15fr)_1.25rem_minmax(0,1fr)] gap-x-1 gap-y-1 text-[11px] sm:text-xs">
              {ROWS.map((r) => {
                const on = lit(r.axis);
                const color = AXES[r.axis].color;
                return (
                  <div key={r.spec} className="contents">
                    <motion.code
                      className="truncate rounded border px-1.5 py-1 font-mono"
                      initial={false}
                      animate={{ opacity: on ? 1 : 0.35, borderColor: on ? color : "#e2e8f0" }}
                      transition={{ duration: reduced ? 0 : 0.25 }}
                      title={r.spec}
                    >
                      {r.spec}
                    </motion.code>
                    <motion.span className="self-center text-center font-bold" initial={false} animate={{ opacity: on ? 1 : 0.25, color }} transition={{ duration: reduced ? 0 : 0.25 }}>
                      →
                    </motion.span>
                    <motion.div
                      className="min-w-0 rounded border px-1.5 py-1"
                      initial={false}
                      animate={{ opacity: on ? 1 : 0.35, borderColor: on ? color : "#e2e8f0", backgroundColor: on ? `${color}14` : "rgba(0,0,0,0)" }}
                      transition={{ duration: reduced ? 0 : 0.25 }}
                    >
                      <div className="truncate font-mono font-bold" style={{ color }} title={r.kernel}>
                        {r.kernel}
                      </div>
                      <div className="truncate text-muted-foreground" title={r.value}>
                        {r.value}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="mt-3 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
