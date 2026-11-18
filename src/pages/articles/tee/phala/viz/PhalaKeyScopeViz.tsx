import SceneShell from "./PhalaSceneShell";

/**
 * 본문 대응: #identity-key — K = KDF(S_e, worker ‖ contract ‖ purpose).
 * 같은 worker가 여러 contract를 실행해도 context 한 칸이 다르면 다른 key가 나오고,
 * epoch가 바뀌면 old epoch 요청에 같은 key를 주지 않으며,
 * 03절 표의 "Unregistered or stale worker"는 key 분배 자체를 거부한다.
 */
interface KeyScene {
  label: string;
  summary: string;
  note: string;
  epoch: string;
  worker: string;
  gate: "pass" | "deny";
  context: readonly [string, string, string];
  changed: number;
  key: string;
  compare: string;
}

const SCENES: readonly KeyScene[] = [
  {
    label: "기준",
    summary: "W1 ‖ payroll ‖ state → key A",
    note: "등록된 worker W1이 payroll contract의 state용 key를 받습니다. W1, key A, epoch 번호 같은 이름은 장면을 구분하려 붙인 것입니다(가정). Context는 세 칸을 순서와 길이가 모호하지 않게 이어 붙인 값입니다.",
    epoch: "S_e1",
    worker: "W1 · 등록됨",
    gate: "pass",
    context: ["W1", "payroll", "state"],
    changed: -1,
    key: "key A",
    compare: "기준 key",
  },
  {
    label: "같은 worker, 다른 contract",
    summary: "W1 ‖ contract B ‖ state → key B",
    note: "한 worker가 두 번째 contract를 실행해도 contract 칸이 달라 다른 key가 나옵니다. 같은 worker 안에서도 invocation target이 key로 갈라집니다. 두 번째 contract는 비교를 위한 가정입니다(가정).",
    epoch: "S_e1",
    worker: "W1 · 등록됨",
    gate: "pass",
    context: ["W1", "contract B", "state"],
    changed: 1,
    key: "key B",
    compare: "기준과 다름",
  },
  {
    label: "같은 contract, 다른 용도",
    summary: "W1 ‖ payroll ‖ channel → key C",
    note: "Purpose는 state·channel·signing처럼 key 쓰임새를 나누는 label입니다. 같은 payroll이라도 purpose 칸이 달라 state용과 channel용 key가 따로 나옵니다.",
    epoch: "S_e1",
    worker: "W1 · 등록됨",
    gate: "pass",
    context: ["W1", "payroll", "channel"],
    changed: 2,
    key: "key C",
    compare: "기준과 다름",
  },
  {
    label: "epoch가 바뀜",
    summary: "S_e2에서 파생 → key D",
    note: "Epoch secret이 바뀌면 context 세 칸이 같아도 다른 key가 나옵니다. Old epoch를 가리키는 요청에는 같은 key를 주지 않고, epoch를 넘어가려면 explicit migration policy가 필요합니다.",
    epoch: "S_e2",
    worker: "W1 · 등록됨",
    gate: "pass",
    context: ["W1", "payroll", "state"],
    changed: 3,
    key: "key D",
    compare: "old epoch 요청엔 같은 key 없음",
  },
  {
    label: "stale worker",
    summary: "등록이 낡은 worker → 지급 0",
    note: "03절 표의 'Unregistered or stale worker' 행입니다. 등록되지 않았거나 오래된 worker에는 key distribution과 contract assignment를 거부하므로 파생 자체가 일어나지 않습니다. KDF는 worker compromise나 잘못된 contract code까지 막아 주지는 않습니다.",
    epoch: "S_e2",
    worker: "W1 · stale",
    gate: "deny",
    context: ["—", "—", "—"],
    changed: -1,
    key: "지급 없음",
    compare: "key 분배 거부",
  },
];

const SLOT_NAMES = ["worker", "contract", "purpose"] as const;

export default function PhalaKeyScopeViz() {
  return (
    <SceneShell
      eyebrow="Key 범위"
      title="Context 한 칸만 달라도 다른 key가 나옵니다"
      description="Gatekeeper/key hierarchy가 관리하는 epoch secret(S_e)에서 KDF로 key를 파생하는 과정을 한 칸씩 바꿔 봅니다. KDF는 비밀값과 context 문자열로 새 key를 만드는 key 유도 함수이고, context는 worker·contract·purpose를 이어 붙인 값입니다."
      ariaLabel="worker, contract, purpose, epoch 변화에 따라 같은 epoch secret에서 서로 다른 key가 나오고 stale worker에는 key를 주지 않는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const passed = scene.gate === "pass";
        return (
          <div className="mx-auto min-w-0 max-w-2xl">
            <div className="grid grid-cols-2 gap-2">
              <div className={`min-w-0 rounded-lg border px-3 py-2 text-xs leading-5 ${scene.changed === 3 ? "border-amber-600" : "border-border"}`}>
                <span className="block font-semibold text-muted-foreground">epoch secret</span>
                <span className="mt-1 block font-mono font-bold">{scene.epoch}</span>
              </div>
              <div className={`min-w-0 rounded-lg border px-3 py-2 text-xs leading-5 ${passed ? "border-border" : "border-red-600"}`}>
                <span className="block font-semibold text-muted-foreground">요청한 worker</span>
                <span className={`mt-1 block font-mono font-bold ${passed ? "" : "text-red-700 dark:text-red-400"}`}>{scene.worker}</span>
              </div>
            </div>
            <div aria-hidden className="flex items-center justify-center gap-2 py-1 text-xs text-muted-foreground">
              <span>↓</span>
              <span>{passed ? "registry 확인 → 파생" : "거부 → 파생 없음"}</span>
            </div>
            <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-2">
              <div className={`min-w-0 rounded-lg border px-3 py-2 text-xs leading-5 ${passed ? "border-border" : "border-dashed border-border/60 opacity-50"}`}>
                <span className="block font-semibold text-muted-foreground">KDF({scene.epoch}, c)</span>
                <div className="mt-1 grid grid-cols-3 gap-1">
                  {SLOT_NAMES.map((name, index) => {
                    const changed = scene.changed === index;
                    return (
                      <div
                        key={name}
                        className={`min-w-0 rounded border px-0.5 py-1 text-center ${changed ? "border-amber-600 font-bold text-amber-800 dark:text-amber-300" : "border-border"}`}
                      >
                        <span className="block text-[11px] text-muted-foreground">{name}</span>
                        <span className="block break-all font-mono text-[11px] sm:text-xs">{scene.context[index]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={`min-w-0 rounded-lg border px-3 py-2 text-xs leading-5 ${passed ? "border-blue-600" : "border-red-600"}`}>
                <span className="block font-semibold text-muted-foreground">K</span>
                <span className="mt-1 block font-mono text-sm font-bold">{scene.key}</span>
                <span className="block break-keep text-muted-foreground">{scene.compare}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
