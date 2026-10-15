import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * systemd-networkd v249가 시작할 때 실행하는 순서를 의사코드 한 줄씩 진행하며,
 * 같은 줄이 '부팅 직후'와 '실행 중 재시작' 두 노드에서 어떤 값을 만드는지 나란히 센다.
 * 한 mechanism: 코드는 같고 시작 순간 커널에 이미 있던 규칙 수만 다르다.
 */
const LABELS = ["설정", "읽기", "분류", "link", "삭제", "준비"] as const;
const PSEUDOCODE = [
  "conf ← networkd.conf   # ManageForeignRoutingPolicyRules=yes",
  "rules ← RTM_GETRULE(커널)",
  "rule 마다: 커널 표와 같으면 kernel, 아니면 rules_foreign 에 기억",
  "관리하는 link 마다: link_configure(link)",
  "  rules_foreign 의 각 줄: kernel 아님 ∧ .network 에 없음 → RTM_DELRULE",
  "sd_notify(READY)   # \"Enumeration completed\"",
] as const;

interface Column {
  seen: string;
  foreign: string;
  removed: string;
}

const BOOT: readonly Column[] = [
  { seen: "—", foreign: "—", removed: "0" },
  { seen: "3줄 (0·32766·32767)", foreign: "—", removed: "0" },
  { seen: "3줄", foreign: "0줄", removed: "0" },
  { seen: "3줄", foreign: "0줄", removed: "0" },
  { seen: "3줄", foreign: "0줄", removed: "0" },
  { seen: "3줄", foreign: "0줄", removed: "0 → 이후 Cilium이 7줄을 만듦" },
];
const RUNTIME: readonly Column[] = [
  { seen: "—", foreign: "—", removed: "0" },
  { seen: "7줄 (Cilium 5 + 커널 2)", foreign: "—", removed: "0" },
  { seen: "7줄", foreign: "5줄 (9·20·100·109·111)", removed: "0" },
  { seen: "7줄", foreign: "5줄", removed: "0" },
  { seen: "7줄", foreign: "5줄", removed: "5 → 2줄 남음" },
  { seen: "2줄", foreign: "0줄", removed: "5, 노드 연결 끊김" },
];
const NOTES = [
  "두 노드 모두 같은 v249 바이너리와 같은 기본 설정을 씁니다. 설정 파일이 비어 있으면 남이 만든 규칙도 networkd가 관리합니다(기본 yes).",
  "부팅 직후에는 Cilium agent가 아직 뜨지 않아 커널이 처음부터 가진 규칙 3줄만 있습니다. 실행 중인 노드에는 Cilium이 깐 5줄과, 0번을 잃고 남은 커널 규칙 2줄이 있습니다.",
  "커널 규칙 표와 우선순위·table까지 같은 줄만 kernel입니다. 부팅 노드는 셋 다 kernel이고, 실행 중인 노드는 5줄이 남의 규칙으로 기억됩니다.",
  "networkd가 관리하는 인터페이스(.network 파일이 맞는 link)를 설정하기 시작합니다. 이 함수가 남의 설정을 먼저 정리합니다.",
  "규칙은 link 단위가 아니라 노드 전체 목록에서 지웁니다. 부팅 노드는 지울 줄이 없고, 실행 중인 노드는 5줄을 모두 지웁니다.",
  "networkd는 준비 완료를 알립니다. 부팅 노드는 그 뒤 Cilium이 규칙을 깔아 정상이 되고, 재시작한 노드는 규칙 2줄만 남은 채 정상이라고 보고합니다.",
] as const;

function ColumnCard({ title, data }: { title: string; data: Column }) {
  return (
    <div className="min-h-[6.5rem] min-w-0 rounded-md border border-border px-3 py-1.5 sm:min-h-[5.5rem]">
      <p className="text-xs font-bold">{title}</p>
      <dl className="mt-1 grid grid-cols-1 gap-x-3 gap-y-0.5 font-mono text-[11px]">
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-muted-foreground">읽은 규칙</dt>
          <dd>{data.seen}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-muted-foreground">남의 규칙</dt>
          <dd>{data.foreign}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-muted-foreground">지운 규칙</dt>
          <dd className="font-bold">{data.removed}</dd>
        </div>
      </dl>
    </div>
  );
}

export default function NetworkdStartViz() {
  const scenes = useAnimatedScenes(PSEUDOCODE.length, 4300);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="systemd-networkd start-up"
      title="같은 시작 코드가 부팅 때는 0줄, 재시작 때는 5줄을 지웁니다"
      description="진한 의사코드 줄이 지금 실행되는 단계입니다. 아래 두 칸은 같은 줄을 부팅 직후 노드와 실행 중 노드에서 실행한 결과입니다."
      note="networkd.c 84–100행, networkd-manager.c 664–679행, networkd-routing-policy-rule.c 644–668·823–844행, networkd-link.c 997–1022행을 줄인 의사코드입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="networkd 시작 순서와 두 노드의 규칙 수"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <p className="text-[11px] font-black text-primary">Scene · {String(active + 1).padStart(2, "0")}</p>
          <ol aria-label="현재 장면과 함께 실행되는 의사코드" className="mt-2 space-y-1">
            {PSEUDOCODE.map((line, index) => (
              <li
                key={line}
                aria-current={active === index ? "step" : undefined}
                className={`flex min-w-0 gap-2 rounded-md border-l-2 px-3 py-0.5 ${
                  active === index
                    ? "border-primary bg-primary/[0.07]"
                    : index < active
                      ? "border-primary/30 text-muted-foreground"
                      : "border-border/60 text-muted-foreground"
                }`}
              >
                <span className="shrink-0 font-mono text-[10px] font-bold text-primary">
                  {index < active ? "✓" : String(index + 1).padStart(2, "0")}
                </span>
                <code className="min-w-0 break-words font-mono text-[11px] leading-5">{line}</code>
              </li>
            ))}
          </ol>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <ColumnCard title="부팅 직후 노드" data={BOOT[active]} />
            <ColumnCard title="실행 중 재시작한 노드" data={RUNTIME[active]} />
          </div>

          <p className="mt-3 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[5.25rem]">
            {NOTES[active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} />
      </div>
    </VizFrame>
  );
}
