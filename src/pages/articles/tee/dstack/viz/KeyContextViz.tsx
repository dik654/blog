import SceneShell from "./SceneShell";

/**
 * 본문 대응: #identity-key — KMS가 먼저 appraisal을 통과시킨 뒤
 * K_app = HKDF(K_root, app_id ‖ purpose ‖ e)를 파생한다.
 * context 칸 하나가 바뀌면 다른 key, 같으면 같은 key, gate에서 막히면 지급 0.
 * 실패 장면은 #release-gate 표의 "Compose/image hash drift" 행을 쓴다.
 */
type Gate = "pass" | "app-fail";

interface KeyScene {
  label: string;
  summary: string;
  note: string;
  instance: string;
  gate: Gate;
  context: readonly [string, string, string];
  changed: number;
  key: string;
  compare: string;
}

const SCENES: readonly KeyScene[] = [
  {
    label: "기준: 첫 instance",
    summary: "payroll ‖ disk ‖ e1 → key A",
    note: "KMS는 quote freshness·TCB·app/OS measurement·governance allowlist를 먼저 봅니다. 통과한 instance에만 K_root에서 이 context의 key를 파생해 줍니다. key A, e1, #1 같은 이름은 장면을 구분하려 붙인 것입니다(가정).",
    instance: "payroll CVM #1",
    gate: "pass",
    context: ["payroll", "disk", "e1"],
    changed: -1,
    key: "key A",
    compare: "기준 key",
  },
  {
    label: "instance만 교체",
    summary: "context 그대로 → 다시 key A",
    note: "글의 식은 instance identity를 context에 넣지 않았으므로 같은 app·purpose·epoch이면 같은 key가 재현됩니다. Instance identity나 migration policy를 context에 넣을지는 threat model에 따라 명시해야 하고, 같은 app migration에서 key를 유지하려면 허용된 source/target identity를 policy와 receipt로 정해 둡니다.",
    instance: "payroll CVM #2",
    gate: "pass",
    context: ["payroll", "disk", "e1"],
    changed: -1,
    key: "key A",
    compare: "기준과 같음",
  },
  {
    label: "purpose만 변경",
    summary: "payroll ‖ TLS ‖ e1 → key B",
    note: "같은 app이라도 disk용과 TLS용은 다른 key가 나옵니다. purpose 칸이 사용 영역을 갈라 놓습니다. 잘못된 purpose 요청은 다른 derived key가 되거나 거부되어야 하며 silent fallback은 금지입니다(3절 표).",
    instance: "payroll CVM #2",
    gate: "pass",
    context: ["payroll", "TLS", "e1"],
    changed: 1,
    key: "key B",
    compare: "기준과 다름",
  },
  {
    label: "epoch만 변경",
    summary: "payroll ‖ disk ‖ e2 → key C",
    note: "epoch는 rotation·revocation·migration policy가 정한 key 세대입니다. 세대를 올리면 같은 app·purpose라도 이전 key와 다른 key가 나옵니다.",
    instance: "payroll CVM #2",
    gate: "pass",
    context: ["payroll", "disk", "e2"],
    changed: 2,
    key: "key C",
    compare: "기준과 다름",
  },
  {
    label: "compose·image hash drift",
    summary: "gate에서 거부 → 지급 0",
    note: "Quote가 유효해도 compose·image hash가 허용된 app policy와 맞지 않으면 KMS는 파생 전에 거부하므로 key가 하나도 나가지 않습니다. allowlist 칸(–)은 판정을 표시하지 않았습니다.",
    instance: "변경된 compose",
    gate: "app-fail",
    context: ["—", "—", "—"],
    changed: -1,
    key: "지급 없음",
    compare: "release 0",
  },
];

const CHECKS = ["quote freshness", "TCB", "app/OS measurement", "allowlist"] as const;
const SLOT_NAMES = ["app_id", "purpose", "epoch"] as const;

function Arrow({ label }: { label: string }) {
  return (
    <div aria-hidden className="flex items-center justify-center gap-2 py-1 text-xs text-muted-foreground">
      <span>↓</span>
      <span>{label}</span>
    </div>
  );
}

export default function KeyContextViz() {
  return (
    <SceneShell
      eyebrow="Key 파생"
      title="Gate를 통과한 뒤 context 세 칸이 key를 정합니다"
      description="KMS root key(K_root)에서 application key를 HKDF로 파생하는 과정을 한 칸씩 바꿔 봅니다. Gate는 key를 내주기 전 KMS가 하는 appraisal입니다. HKDF는 root key와 context 문자열로 새 key를 만드는 key 유도 함수이고, context는 app_id·purpose·epoch를 이어 붙인 값입니다."
      ariaLabel="KMS gate 통과 여부와 app_id, purpose, epoch 변화에 따라 같은 key, 다른 key, 지급 없음이 나오는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const passed = scene.gate === "pass";
        return (
          <div className="mx-auto min-w-0 max-w-2xl">
            <div className="grid grid-cols-2 gap-2">
              <div className="min-w-0 rounded-lg border border-border px-3 py-2 text-xs leading-5">
                <span className="block font-semibold text-muted-foreground">요청한 instance</span>
                <span className="mt-1 block font-mono font-bold">{scene.instance}</span>
              </div>
              <div className={`min-w-0 rounded-lg border px-3 py-2 text-xs leading-5 ${passed ? "border-border" : "border-red-600"}`}>
                <span className="block font-semibold text-muted-foreground">KMS appraisal</span>
                <ul className="mt-1 space-y-0.5">
                  {CHECKS.map((check, index) => {
                    const fail = !passed && index === 2;
                    const unjudged = !passed && index > 2;
                    return (
                      <li
                        key={check}
                        className={fail ? "font-bold text-red-700 dark:text-red-400" : unjudged ? "text-muted-foreground" : ""}
                      >
                        {fail ? "✗" : unjudged ? "–" : "✓"} {check}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <Arrow label={passed ? "통과 → 파생" : "거부 → 파생 없음"} />
            <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-2">
              <div className={`min-w-0 rounded-lg border px-3 py-2 text-xs leading-5 ${passed ? "border-border" : "border-dashed border-border/60 opacity-50"}`}>
                <span className="block font-semibold text-muted-foreground">HKDF(K_root, c)</span>
                <div className="mt-1 grid grid-cols-3 gap-1">
                  {SLOT_NAMES.map((name, index) => {
                    const changed = scene.changed === index;
                    return (
                      <div
                        key={name}
                        className={`min-w-0 rounded border px-0.5 py-1 text-center ${
                          changed ? "border-amber-600 font-bold text-amber-800 dark:text-amber-300" : "border-border"
                        }`}
                      >
                        <span className="block text-[11px] text-muted-foreground">{name}</span>
                        <span className="block break-all font-mono text-[11px] sm:text-xs">{scene.context[index]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={`min-w-0 rounded-lg border px-3 py-2 text-xs leading-5 ${passed ? "border-blue-600" : "border-red-600"}`}>
                <span className="block font-semibold text-muted-foreground">K_app</span>
                <span className="mt-1 block font-mono text-sm font-bold">{scene.key}</span>
                <span className="block text-muted-foreground">{scene.compare}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
