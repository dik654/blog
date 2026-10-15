import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * Datadog 사후 보고서의 Cilium 노드 규칙 7줄이 networkd 재시작 뒤 2줄이 되는 과정과,
 * 그 전후에 같은 패킷이 어느 규칙에서 멈추는지를 한 표 위에서 보여 준다.
 * 한 mechanism: 커널은 우선순위가 작은 규칙부터 맞춰 보고 처음 맞는 표를 쓴다. 규칙이 사라지면 패킷은 더 아래 규칙으로 떨어진다.
 */
const LABELS = ["규칙 7줄", "응답 패킷 전", "분류", "삭제", "응답 패킷 후", "pod 패킷 후"] as const;

const RULES = [
  { pri: 9, text: "fwmark 0x200/0xf00 lookup 2004", role: "L7 proxy로 보냄" },
  { pri: 20, text: "to 10.132.126.226 lookup main", role: "pod로 들어가는 길" },
  { pri: 100, text: "lookup local", role: "Cilium이 0번에서 옮긴 local" },
  { pri: 109, text: "fwmark 0x80/0xf80 lookup main", role: "Cilium 표시 패킷" },
  { pri: 111, text: "from 10.132.126.226 lookup 11", role: "pod에서 ens6로 나감" },
  { pri: 32766, text: "lookup main", role: "커널 기본" },
  { pri: 32767, text: "lookup default", role: "커널 기본" },
] as const;

type Mark = "idle" | "skip" | "hit" | "kernel" | "foreign" | "gone";

interface Scene {
  marks: Mark[];
  packet: string;
  verdict: string;
  note: string;
}

const KERNEL = (pri: number) => pri >= 32766;

const SCENE_DATA: readonly Scene[] = [
  {
    marks: RULES.map(() => "idle"),
    packet: "패킷 없음",
    verdict: "규칙 7줄, 우선순위 작은 것부터 검사",
    note: "Cilium이 돌고 있는 노드의 IPv4 규칙입니다. 커널은 작은 번호부터 맞춰 보고 처음 맞는 규칙의 표로 길을 찾습니다. 0번 local은 Cilium이 100번으로 옮겼습니다.",
  },
  {
    marks: ["skip", "skip", "hit", "idle", "idle", "idle", "idle"],
    packet: "8.8.8.8 → 10.128.123.85 (ens5로 들어옴)",
    verdict: "100번 local 표에서 노드 주소 발견 → lo로 전달",
    note: "노드가 보낸 요청의 응답입니다. 9번과 20번은 맞지 않고, 100번 local 표에서 노드 자신의 주소를 찾아 노드 안으로 배달됩니다.",
  },
  {
    marks: RULES.map((r) => (KERNEL(r.pri) ? "kernel" : "foreign")),
    packet: "networkd 시작: 규칙 목록 읽기",
    verdict: "커널 표와 같은 줄 2개, 남의 규칙 5개",
    note: "재시작한 networkd가 7줄을 읽어 커널 규칙 표(0번 local, 32766번, 32767번)와 비교합니다. 100번 local은 번호가 달라 남의 규칙이 되고, 5줄이 rules_foreign에 들어갑니다.",
  },
  {
    marks: RULES.map((r) => (KERNEL(r.pri) ? "kernel" : "gone")),
    packet: "networkd: RTM_DELRULE × 5",
    verdict: "7 − 5 = 2줄만 남음",
    note: ".network 파일에 없는 5줄을 networkd가 하나씩 지웁니다. 0번 local은 Cilium이 이미 옮겨 없었으므로 되살릴 줄이 없고, 두 줄만 남습니다.",
  },
  {
    marks: RULES.map((r) => (r.pri === 32766 ? "hit" : KERNEL(r.pri) ? "kernel" : "gone")),
    packet: "8.8.8.8 → 10.128.123.85 (ens5로 들어옴)",
    verdict: "main 표의 기본 경로 → ens5로 다시 내보냄 → 클라우드 망이 버림",
    note: "같은 응답이 local 표를 못 만나 32766번 main으로 떨어집니다. 기본 경로가 ens5 밖이라 자기 주소로 온 패킷을 다시 내보내고, 노드 연결이 통째로 끊깁니다.",
  },
  {
    marks: RULES.map((r) => (r.pri === 32766 ? "hit" : KERNEL(r.pri) ? "kernel" : "gone")),
    packet: "10.132.126.226 → 8.8.8.8 (pod에서 나감)",
    verdict: "ens6 대신 ens5 → AWS·Azure 망이 버림",
    note: "pod 패킷은 111번 규칙으로 ens6에 나가야 합니다. 그 줄이 없으니 main을 따라 ens5로 나가고 AWS·Azure 가상 망이 버립니다. Google Cloud에는 이 줄이 원래 없습니다.",
  },
];

const MARK_STYLE: Record<Mark, string> = {
  idle: "border-border",
  skip: "border-border text-muted-foreground",
  hit: "border-primary bg-primary/10 font-bold",
  kernel: "border-emerald-600/60",
  foreign: "border-amber-600/70 bg-amber-500/10",
  gone: "border-dashed border-border text-muted-foreground line-through",
};
const MARK_LABEL: Record<Mark, string> = {
  idle: "",
  skip: "통과",
  hit: "여기서 결정",
  kernel: "커널 규칙",
  foreign: "남의 규칙",
  gone: "삭제됨",
};

export default function RuleFlushViz() {
  const scenes = useAnimatedScenes(SCENE_DATA.length, 4300);
  const active = scenes.active;
  const scene = SCENE_DATA[active];
  const remaining = scene.marks.filter((m) => m !== "gone").length;

  return (
    <VizFrame
      eyebrow="Policy routing rules"
      title="규칙 7줄 중 커널 표에 있는 2줄만 남았습니다"
      description="행 하나가 ip rule 한 줄입니다. 왼쪽 숫자가 우선순위이고, 패킷은 위에서부터 처음 맞는 줄에서 멈춥니다."
      note="규칙과 주소는 Datadog 2023-03-08 사후 보고서의 AWS 노드 예시입니다. 109번 규칙의 역할 설명은 이 글의 해석입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="정책 라우팅 규칙 삭제 전후의 패킷 경로"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <p className="text-[11px] font-black text-primary">Scene · {String(active + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{LABELS[active]}</h4>
          <p className="mt-1 min-h-[2.5rem] break-words font-mono text-xs text-foreground sm:min-h-0">{scene.packet}</p>

          <ol className="mt-3 space-y-1" aria-label="ip rule 목록">
            {RULES.map((rule, index) => {
              const mark = scene.marks[index];
              return (
                <li key={rule.pri} className={`grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-x-2 rounded-md border px-2 py-1 sm:grid-cols-[3.5rem_minmax(0,1fr)_11rem_5.5rem] ${MARK_STYLE[mark]}`}>
                  <span className="font-mono text-xs font-bold">{rule.pri}</span>
                  <code className="min-w-0 break-all font-mono text-[11px] leading-4">{rule.text}</code>
                  <span className="col-start-2 text-[11px] text-muted-foreground sm:col-start-auto">{rule.role}</span>
                  <span className="col-start-2 min-h-4 text-[11px] font-semibold sm:col-start-auto sm:text-right">{MARK_LABEL[mark] || "\u00a0"}</span>
                </li>
              );
            })}
          </ol>

          <dl className="mt-2 grid grid-cols-2 gap-x-4 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">남은 규칙</dt>
              <dd className="font-bold">{remaining}줄</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">판정</dt>
              <dd className="min-h-[4.5rem] break-words font-bold sm:min-h-[2rem]">{scene.verdict}</dd>
            </div>
          </dl>

          <p className="mt-2 min-h-[12rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[10.5rem] sm:min-h-[5.25rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} />
      </div>
    </VizFrame>
  );
}
