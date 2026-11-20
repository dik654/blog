import SceneShell from "./OpteeSceneShell";

/**
 * 본문 대응: #execution-boundary — CONTEXT → INVOKE → COMMIT → CLOSE와
 * #identity-key의 A = S ∧ C ∧ M ∧ K, 03절 실패 주입 표의
 * "Shared length·direction 변조", "Storage write 중 power loss" 행.
 * 위 = 요청이 지나는 위치(Normal World / SMC / Secure World), 아래 = 네 조건과 effect 판정(고정 자리).
 */
type NodeId = "client" | "driver" | "smc" | "core" | "ta" | "storage";
type Bit = "-" | "1" | "0";

interface PathScene {
  label: string;
  summary: string;
  note: string;
  lit: readonly NodeId[];
  fail: readonly NodeId[];
  carries: string;
  bits: readonly [Bit, Bit, Bit, Bit];
  effect: string;
  effectTone: "wait" | "ok" | "fail" | "info";
}

const NORMAL: readonly { id: NodeId; tag: string }[] = [
  { id: "client", tag: "Client app" },
  { id: "driver", tag: "Linux driver" },
];
const SECURE: readonly { id: NodeId; tag: string }[] = [
  { id: "core", tag: "OP-TEE Core" },
  { id: "ta", tag: "User TA" },
  { id: "storage", tag: "Secure storage" },
];

const BIT_NAMES = [
  ["S", "session"],
  ["C", "command"],
  ["M", "memory"],
  ["K", "key"],
] as const;

const SCENES: readonly PathScene[] = [
  {
    label: "OpenSession",
    summary: "TA UUID 확인 → session 생성",
    note: "Client가 TA UUID로 session을 엽니다. 요청은 driver와 SMC를 거쳐 Secure World에 들어오지만 이 통로는 전달만 할 뿐 TA 권한을 정하지 않습니다. TA UUID·login method·parameter type을 검증해 session identity를 만들면 S = 1입니다.",
    lit: ["client", "driver", "smc", "core"],
    fail: [],
    carries: "TA UUID · login method · parameter type",
    bits: ["1", "-", "-", "-"],
    effect: "아직 effect 없음",
    effectTone: "wait",
  },
  {
    label: "InvokeCommand",
    summary: "command ID + shared buffer 검증",
    note: "같은 session으로 command ID와 shared buffer를 보냅니다. Shared buffer는 client가 Secure World와 함께 쓰도록 넘긴 메모리라 untrusted input이므로, OP-TEE Core가 TA를 부르기 전에 이 buffer를 복사하며 size·direction·offset·alias를 검증하고(copy/bounds 단계) 그 복사본만 TA에 넘깁니다. 허용된 command면 C, buffer 검증을 통과하면 M이 1입니다.",
    lit: ["client", "driver", "smc", "core", "ta"],
    fail: [],
    carries: "command ID · shared buffer(size · direction · offset · alias)",
    bits: ["1", "1", "1", "-"],
    effect: "아직 effect 없음",
    effectTone: "wait",
  },
  {
    label: "COMMIT",
    summary: "네 조건 모두 1 → 한 번 갱신",
    note: "Crypto나 secure storage effect를 내기 전에 key handle·object usage·transaction outcome을 확인합니다. Key 조건 K까지 1이면 A = S ∧ C ∧ M ∧ K = 1이 되어 persistent state를 한 번 갱신합니다.",
    lit: ["core", "ta", "storage"],
    fail: [],
    carries: "key handle · object usage · transaction outcome",
    bits: ["1", "1", "1", "1"],
    effect: "A = 1 → persistent state 갱신",
    effectTone: "ok",
  },
  {
    label: "실패: buffer 방향 변조",
    summary: "Secure World 진입 성공, A = 0",
    note: "올바른 TA session이어도 output 전용 buffer를 input인 것처럼 속이면 TA를 부르기 전 OP-TEE Core의 copy/bounds 단계에서 M = 0이 되어 typed error로 끝나고 effect를 만들지 않습니다(03절 표). 요청이 SMC를 지나 Secure World에 들어왔어도 A = 1은 아닙니다. – 칸은 이 예가 정하지 않은 조건입니다.",
    lit: ["client", "driver", "smc", "core"],
    fail: ["core"],
    carries: "output 전용 buffer를 input으로 표시",
    bits: ["1", "-", "0", "-"],
    effect: "A = 0 → typed error, effect 없음",
    effectTone: "fail",
  },
  {
    label: "실패: key purpose 불일치",
    summary: "앞 세 조건 통과, K = 0",
    note: "Session·command·memory가 모두 맞아도 key handle의 purpose가 요청과 다르면 K = 0이고, 네 조건이 AND로 묶여 있으므로 A도 0입니다. 앞 세 칸이 1인 것은 이 예를 위한 가정입니다(가정).",
    lit: ["core", "ta"],
    fail: [],
    carries: "다른 purpose의 key handle",
    bits: ["1", "1", "1", "0"],
    effect: "A = 0 → crypto/storage effect 없음",
    effectTone: "fail",
  },
  {
    label: "실패: 쓰는 중 전원 차단",
    summary: "old 또는 new, 반쪽은 없음",
    note: "03절 표의 'Storage write 중 power loss' 행입니다. 네 조건을 통과해 쓰던 중 전원이 꺼져도 기대 결과(oracle)는 old 또는 new object 중 하나만 보이는 atomic outcome이며, 둘이 섞인 상태가 보이면 실패입니다.",
    lit: ["ta", "storage"],
    fail: ["storage"],
    carries: "persistent object 쓰기 도중 전원 차단",
    bits: ["1", "1", "1", "1"],
    effect: "재시작 뒤 old 또는 new 하나만",
    effectTone: "info",
  },
  {
    label: "CLOSE",
    summary: "CloseSession → Finalize",
    note: "Session을 닫으며 handle·shared mapping·TA state를 해제합니다. Timeout 뒤 같은 command가 다시 오면 operation ID로 이미 처리했는지 맞춰 봅니다(reconcile).",
    lit: ["client", "driver", "smc", "core", "ta"],
    fail: [],
    carries: "handle · shared mapping · TA state 해제",
    bits: ["-", "-", "-", "-"],
    effect: "session 종료, 중복 command는 operation ID로 확인",
    effectTone: "info",
  },
];

const EFFECT_CLASS = {
  wait: "border-border text-muted-foreground",
  ok: "border-blue-600 font-bold text-blue-700 dark:text-blue-400",
  fail: "border-red-600 font-bold text-red-700 dark:text-red-400",
  info: "border-amber-600 font-bold text-amber-800 dark:text-amber-300",
} as const;

function Node({ tag, lit, fail }: { tag: string; lit: boolean; fail: boolean }) {
  const border = fail ? "border-red-600" : lit ? "border-blue-600" : "border-border/60";
  const head = fail ? "text-red-700 dark:text-red-400" : lit ? "text-blue-700 dark:text-blue-400" : "text-muted-foreground";
  return (
    <div className={`min-w-0 rounded-lg border bg-background px-2 py-1.5 text-xs leading-5 ${border}`}>
      <span className={`block font-bold ${head}`}>{tag}</span>
    </div>
  );
}

export default function OpteeRequestPathViz() {
  return (
    <SceneShell
      eyebrow="Payroll 요청 한 건"
      title="Secure World에 들어온 것과 실행을 허락받은 것은 다릅니다"
      description="TA(Trusted Application)는 Secure World에서 도는 앱이고, SMC(Secure Monitor Call)는 Normal World가 Secure World로 넘어가는 호출입니다. 아래 S·C·M·K는 02절 식의 네 조건(session·command·memory·key)이며, 넷 다 1일 때만 effect 판정 A가 1입니다."
      ariaLabel="OP-TEE에서 client 요청이 driver와 SMC를 지나 Core, TA, secure storage에 이르는 경로와 네 조건 판정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const isLit = (id: NodeId) => scene.lit.includes(id);
        const isFail = (id: NodeId) => scene.fail.includes(id);
        const smcLit = isLit("smc");
        return (
          <div className="mx-auto min-w-0 max-w-3xl">
            <div className="grid gap-2 sm:grid-cols-[minmax(0,2fr)_4.5rem_minmax(0,3fr)]">
              <div className="min-w-0 rounded-lg border border-dashed border-border p-2">
                <p className="mb-1.5 text-[11px] font-bold tracking-wide text-muted-foreground">NORMAL WORLD</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {NORMAL.map((node) => (
                    <Node key={node.id} tag={node.tag} lit={isLit(node.id)} fail={isFail(node.id)} />
                  ))}
                </div>
              </div>
              <div
                className={`flex min-w-0 items-center justify-center rounded-lg border px-2 py-1 text-center sm:py-1.5 text-xs leading-5 ${smcLit ? "border-blue-600 text-blue-700 dark:text-blue-400" : "border-border/60 text-muted-foreground"}`}
              >
                <span>
                  <span className="font-bold sm:block">SMC</span>
                  <span className="sm:hidden"> · </span>
                  <span className="sm:block">world 전환</span>
                </span>
              </div>
              <div className="min-w-0 rounded-lg border border-dashed border-border p-2">
                <p className="mb-1.5 text-[11px] font-bold tracking-wide text-muted-foreground">SECURE WORLD</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {SECURE.map((node) => (
                    <Node key={node.id} tag={node.tag} lit={isLit(node.id)} fail={isFail(node.id)} />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 rounded-lg border border-border px-3 py-2 text-xs leading-5">
              <span className="font-semibold text-muted-foreground">이번에 오가는 것 · </span>
              <span className="font-mono">{scene.carries}</span>
            </p>
            <div className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,2fr)]">
              {BIT_NAMES.map(([symbol, name], index) => {
                const bit = scene.bits[index];
                const tone = bit === "1" ? "border-blue-600 text-blue-700 dark:text-blue-400" : bit === "0" ? "border-red-600 text-red-700 dark:text-red-400" : "border-border/60 text-muted-foreground";
                return (
                  <div key={symbol} className={`min-w-0 rounded-lg border px-1 py-1.5 text-center text-xs leading-5 ${tone}`}>
                    <span className="block font-mono font-bold">
                      {symbol} = {bit === "-" ? "–" : bit}
                    </span>
                    <span className="block text-[11px] text-muted-foreground">{name}</span>
                  </div>
                );
              })}
              <div className={`col-span-4 flex min-w-0 items-center rounded-lg border px-3 py-1.5 text-xs leading-5 sm:col-span-1 ${EFFECT_CLASS[scene.effectTone]}`}>
                {scene.effect}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
