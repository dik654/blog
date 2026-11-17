import SceneShell from "./SceneShell";

/**
 * 본문 대응: #memory-lifecycle — DELEGATE(정리 뒤 NS → Realm granule) → CREATE(RMI로 descriptor·translation·REC) → RUN(REC entry/RSI, shared buffer 검증)
 * 과 실패 표의 "Undelegated granule reuse", "Stale host mapping or DMA", EL3 + GPT가 access마다 현재 state를 확인한다는 actor 설명.
 * G1·G2 두 granule과 G2를 shared buffer로 쓰는 배치는 설명용 가정이다.
 */
type Tone = "ok" | "deny" | "info" | "none";

type Access = { text: string; tone: Tone };

type Granule = {
  world: "Normal world" | "Realm";
  prep: string;
  host: Access;
  realm: Access;
};

const NONE: Access = { text: "Realm 생성 전", tone: "none" };
const HOST_OK: Access = { text: "접근 가능", tone: "ok" };
const HOST_DENY: Access = { text: "GPC가 Realm 상태 확인 → 거부", tone: "deny" };

const G1_START: Granule = { world: "Normal world", prep: "host mapping·cache·device access 남아 있음", host: HOST_OK, realm: NONE };
const G1_DELEGATED: Granule = { world: "Realm", prep: "host mapping·cache·device access 정리됨", host: HOST_DENY, realm: NONE };
const G2_IDLE: Granule = { world: "Normal world", prep: "delegate하지 않음 · shared buffer로 쓸 곳(가정)", host: HOST_OK, realm: NONE };

const SCENES = [
  {
    label: "시작",
    summary: "G1·G2 모두 Normal world",
    action: "Host/VMM이 두 granule을 자원으로 관리",
    result: { text: "Realm 아직 없음", tone: "info" as Tone },
    g1: G1_START,
    g2: G2_IDLE,
    note: "Granule은 GPT(Granule Protection Table)가 어느 world에 속하는지 배정하는 memory 단위입니다. Realm을 만들기 전 G1과 G2는 모두 Normal world에 있고, host가 관리하며 읽을 수 있습니다.",
  },
  {
    label: "정리 없이 delegate",
    summary: "delegate 거부 · G1은 Normal 유지",
    action: "host mapping·DMA가 남은 채 G1 delegate 요청",
    result: { text: "Delegate 거부", tone: "deny" as Tone },
    g1: { ...G1_START, prep: "host mapping·DMA 남음 → precondition 실패" },
    g2: G2_IDLE,
    note: "Host mapping이나 device DMA가 남아 있으면 delegate precondition과 SMMU/device policy 검사에서 실패하고 deny됩니다. G1의 world는 바뀌지 않습니다.",
  },
  {
    label: "정리 후 delegate",
    summary: "G1 → Realm granule",
    action: "host mapping·cache·device access를 정리하고 G1 delegate",
    result: { text: "G1 world = Realm", tone: "ok" as Tone },
    g1: G1_DELEGATED,
    g2: G2_IDLE,
    note: "정리를 마친 뒤에야 G1이 Realm ownership으로 전환됩니다. 그 뒤 host가 G1에 접근하면 GPC(granule protection check)가 access마다 GPT의 현재 state를 확인해 막습니다. Host는 자원을 관리하지만 Realm memory를 읽는 주체가 아닙니다.",
  },
  {
    label: "미위임 granule로 map",
    summary: "G2 사용 → state transition 실패",
    action: "RMI로 Realm을 구성하며 delegate 안 한 G2를 쓰려 함",
    result: { text: "Create/map 전에 실패", tone: "deny" as Tone },
    g1: G1_DELEGATED,
    g2: { ...G2_IDLE, prep: "delegate 안 됨 → Realm용으로 못 씀" },
    note: "Delegate하지 않은 granule을 Realm에 쓰려 하면 Realm create/map 전에 state transition이 실패합니다.",
  },
  {
    label: "Realm 생성 (RMI)",
    summary: "descriptor·translation·REC 구성",
    action: "RMI로 Realm descriptor·translation·REC 구성",
    result: { text: "measured content 고정", tone: "ok" as Tone },
    g1: { ...G1_DELEGATED, realm: { text: "Realm translation으로 사용", tone: "ok" as Tone } },
    g2: G2_IDLE,
    note: "Host는 RMI로 Realm 생성을 요청하고, Realm descriptor·translation·REC(Realm Execution Context, Realm의 vCPU 실행 상태)가 구성되고 measured content가 고정됩니다. 이 lifecycle과 stage-2 translation은 RMM이 중재합니다. G1은 이제 Realm이 쓰는 memory입니다.",
  },
  {
    label: "실행 (REC entry · RSI)",
    summary: "G1 private · G2 shared는 검증",
    action: "REC로 Realm 실행 · RSI로 host service 요청",
    result: { text: "G2 내용은 untrusted로 검증", tone: "info" as Tone },
    g1: { ...G1_DELEGATED, realm: { text: "private으로 사용", tone: "ok" as Tone } },
    g2: { ...G2_IDLE, prep: "shared buffer(가정)", realm: { text: "읽되 untrusted protocol로 검증", tone: "info" as Tone } },
    note: "Realm 실행과 host service 요청을 구분합니다. Host도 쓸 수 있는 shared buffer G2의 내용은 Realm이 untrusted protocol로 검증한 뒤에만 사용하고, private G1은 여전히 host 접근이 막혀 있습니다.",
  },
] as const satisfies readonly {
  label: string;
  summary: string;
  action: string;
  result: Access;
  g1: Granule;
  g2: Granule;
  note: string;
}[];

const TONE: Record<Tone, { text: string; border: string; mark: string }> = {
  ok: { text: "#15803d", border: "#16a34a", mark: "✓" },
  deny: { text: "#b91c1c", border: "#dc2626", mark: "✕" },
  info: { text: "#b45309", border: "#d97706", mark: "!" },
  none: { text: "#94a3b8", border: "#cbd5e1", mark: "—" },
};

function AccessRow({ who, access }: { who: string; access: Access }) {
  const tone = TONE[access.tone];
  return (
    <div className="grid min-w-0 grid-cols-[3.25rem_minmax(0,1fr)] items-start gap-2 border-t border-border/60 py-2 text-xs leading-5">
      <span className="font-semibold text-muted-foreground">{who}</span>
      <span className="min-w-0 break-keep font-semibold" style={{ color: tone.text }}>
        <span className="mr-1 font-mono">{tone.mark}</span>
        {access.text}
      </span>
    </div>
  );
}

function GranuleCard({ name, granule }: { name: string; granule: Granule }) {
  const realm = granule.world === "Realm";
  return (
    <div className="min-w-0 rounded-lg border bg-background p-3" style={{ borderColor: realm ? "#7c3aed" : "#94a3b8" }}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
        <span className="font-mono text-sm font-bold">{name}</span>
        <span className="text-xs font-bold" style={{ color: realm ? "#6d28d9" : "#475569" }}>GPT: {granule.world}</span>
      </div>
      <p className="mt-2 min-h-[2.5rem] break-keep text-xs leading-5 text-muted-foreground">{granule.prep}</p>
      <AccessRow who="Host" access={granule.host} />
      <AccessRow who="Realm" access={granule.realm} />
    </div>
  );
}

export default function GranuleDelegateViz() {
  return (
    <SceneShell
      eyebrow="Granule delegate와 Realm 생성"
      title="Granule은 정리와 delegate를 거쳐야 Realm memory가 됩니다"
      description="두 칸은 같은 machine의 memory granule G1·G2(가정)입니다. 위 줄은 이번 장면에서 일어난 요청과 결과, 칸 안은 GPT가 배정한 world와 Host·Realm이 그 granule에 접근할 때의 결과입니다."
      ariaLabel="granule G1과 G2가 delegate, Realm 생성, 실행 단계를 거치며 world와 접근 결과가 바뀌는 여섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const result = TONE[scene.result.tone];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,13rem)]">
              <div className="min-w-0 rounded-lg border border-border/70 bg-background px-3 py-2 text-sm">
                <span className="mr-2 text-xs font-bold text-muted-foreground">요청</span>
                <span className="break-keep">{scene.action}</span>
              </div>
              <div className="min-w-0 rounded-lg border bg-background px-3 py-2 text-sm font-bold" style={{ borderColor: result.border, color: result.text }}>
                <span className="mr-1 font-mono">{result.mark}</span>
                {scene.result.text}
              </div>
            </div>
            <div className="grid min-w-0 gap-2 sm:grid-cols-2 sm:gap-3">
              <GranuleCard name="G1" granule={scene.g1} />
              <GranuleCard name="G2" granule={scene.g2} />
            </div>
          </div>
        );
      }}
    />
  );
}
