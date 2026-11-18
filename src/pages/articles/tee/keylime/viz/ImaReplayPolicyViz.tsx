import SceneShell from "./SceneShell";

/**
 * 본문 대응: #quote-policy — 부팅 뒤 파일 하나가 바뀐 급여 처리 노드(본문 lead).
 * Quote 서명(Q)·nonce(N)·log replay(L)는 통과해도 runtime policy(P)에서 막혀 R = 0이 되는 순서.
 * 본문 failure "PCR은 맞지만 IMA file hash drift → Runtime policy mismatch, 격리와 reason receipt"와 같은 경우입니다.
 * 파일 세 개·hash 이름·nonce 이름은 그림을 위한 가정입니다.
 */
type Gate = "pass" | "fail" | "open" | "skip";

const FILES = [
  { name: "파일 1", hash: "h₁", allowed: true },
  { name: "파일 2", hash: "h₂", allowed: true },
  { name: "파일 3", hash: "h₃′", allowed: false },
] as const;
const ALLOWLIST = "h₁ · h₂ · h₃";

const GATES = [
  { key: "Q", name: "quote 서명" },
  { key: "N", name: "nonce" },
  { key: "L", name: "log replay" },
  { key: "P", name: "policy" },
  { key: "C", name: "수신 channel" },
  { key: "R", name: "비밀 지급" },
] as const;

const GATE_STATES: readonly (readonly Gate[])[] = [
  ["pass", "pass", "open", "open", "open", "open"],
  ["pass", "pass", "pass", "open", "open", "open"],
  ["pass", "pass", "pass", "fail", "open", "open"],
  ["pass", "pass", "pass", "fail", "skip", "fail"],
];

const SCENES = [
  {
    label: "Quote가 진짜이고 지금 것인가",
    summary: "Q = 1 · N = 1",
    note: "Quote는 verifier가 보낸 nonce와 PCR 10 값에 TPM 안의 서명 키 AK가 서명한 것입니다. 서명이 맞으면 Q, nonce가 이번 challenge와 같으면 N이 통과합니다. 서명 성공만으로는 어떤 파일이 실행됐는지, 그것이 허용된 것인지 아직 모릅니다.",
  },
  {
    label: "목록을 다시 계산해 서명값과 맞춤",
    summary: "v3 = 서명된 PCR 10 → L = 1",
    note: "Extend는 '새 PCR = hash(이전 PCR ‖ 측정값)'으로만 PCR을 바꾸는 TPM 연산입니다. 목록을 처음부터 차례로 extend한 v3가 서명된 PCR 10과 같으면 L이 통과합니다. 목록이 서명된 값과 맞는다는 뜻일 뿐, 파일이 괜찮다는 뜻은 아닙니다.",
  },
  {
    label: "허용 목록과 비교",
    summary: "h₃′ 없음 → P = 0",
    note: "파일 3은 부팅 뒤 바뀌어 측정값이 h₃′입니다. Runtime policy에는 h₃만 있으므로 replay가 맞아도 P = 0입니다. 본문 실패 표의 'PCR은 맞지만 IMA file hash drift'가 이 경우입니다.",
  },
  {
    label: "비밀을 내줄지 판정",
    summary: "R = 0 · key·payload 지급 없음",
    note: "R은 다섯 조건이 모두 참일 때만 참입니다. P = 0이므로 수신 channel C를 따지기 전에 지급하지 않습니다. 노드를 격리하고 agent·policy revision·evidence digest·reason을 receipt에 남깁니다.",
  },
] as const;

const GATE_STYLE: Record<Gate, { text: string; box: string; mark: string }> = {
  pass: { text: "통과", box: "border-green-600 text-green-700 dark:text-green-400", mark: "1" },
  fail: { text: "실패", box: "border-red-600 text-red-700 dark:text-red-400", mark: "0" },
  open: { text: "아직", box: "border-dashed border-border text-muted-foreground", mark: "?" },
  skip: { text: "볼 필요 없음", box: "border-dashed border-border text-muted-foreground", mark: "–" },
};

export default function ImaReplayPolicyViz() {
  return (
    <SceneShell
      eyebrow="Quote · log replay · runtime policy"
      title="서명도 nonce도 replay도 맞는데, 바뀐 파일 하나 때문에 비밀을 내주지 않습니다"
      description="IMA는 커널이 연 파일의 hash를 measurement list에 적고 TPM의 PCR 10에 extend하는 기능입니다. 파일 세 개와 hash·nonce 이름은 가정입니다."
      ariaLabel="Keylime quote 검증, IMA log replay, runtime policy 비교, 지급 판정 순서"
      scenes={SCENES}
      render={(active) => {
        const gates = GATE_STATES[active];
        return (
          <div className="min-w-0 space-y-3 text-xs sm:text-sm">
            <div className={`rounded-lg border p-3 ${active === 0 ? "border-primary" : "border-border"}`}>
              <p className="font-semibold">Quote · AK 서명</p>
              <p className="mt-1 break-keep font-mono text-muted-foreground">
                nonce n (이번 challenge) · PCR 10 = S (서명된 값){active >= 1 ? " = v3" : ""}
              </p>
            </div>
            <div className={`rounded-lg border ${active === 1 || active === 2 ? "border-primary" : "border-border"}`}>
              <div className="grid grid-cols-[minmax(0,1fr)_3rem_4rem] gap-2 border-b border-border px-3 py-2 font-semibold sm:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1.3fr)_6rem]">
                <span>IMA 목록</span>
                <span>측정값</span>
                <span className="hidden sm:block">replay</span>
                <span>허용 목록</span>
              </div>
              {FILES.map((file, index) => {
                const showPolicy = active >= 2;
                return (
                  <div key={file.name} className="grid grid-cols-[minmax(0,1fr)_3rem_4rem] items-baseline gap-2 px-3 py-1.5 sm:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1.3fr)_6rem]">
                    <span className={!file.allowed && active >= 2 ? "font-semibold text-red-700 dark:text-red-400" : ""}>
                      {file.name}{!file.allowed ? " (부팅 뒤 변경)" : ""}
                    </span>
                    <span className="font-mono">{file.hash}</span>
                    <span className="order-last col-span-3 whitespace-nowrap font-mono text-muted-foreground sm:order-none sm:col-span-1">
                      {active >= 1 ? `v${index + 1} = H(v${index} ‖ ${file.hash})` : "–"}
                    </span>
                    <span className={`font-semibold ${showPolicy ? (file.allowed ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400") : "text-muted-foreground"}`}>
                      {showPolicy ? (file.allowed ? "있음" : "없음") : "–"}
                    </span>
                  </div>
                );
              })}
              <p className="border-t border-border px-3 py-2 text-muted-foreground">
                v0 = 0 (시작값) · runtime policy 허용 hash: <span className="font-mono">{ALLOWLIST}</span>
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {GATES.map((gate, index) => {
                const style = GATE_STYLE[gates[index]];
                return (
                  <div key={gate.key} className={`rounded-md border px-2 py-1.5 text-center ${style.box} ${gate.key === "R" ? "border-[1.25px]" : ""}`}>
                    <span className="block font-mono font-bold">{gate.key} = {style.mark}</span>
                    <span className="block text-[11px] leading-4">{gate.name}</span>
                    <span className="block text-[11px] leading-4">{style.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
