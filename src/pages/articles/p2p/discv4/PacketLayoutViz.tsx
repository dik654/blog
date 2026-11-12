import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #wire 의 ExplainedFormula·AlgorithmBlock — 같은 packet 위에서 hash가 덮는 범위
 * (packet[32:])와 signature가 서명한 범위(packet[97:])가 어떻게 다른지 자리로 보여 준다.
 * 32 + 65 + 1 = 98, 1280 − 98 = 1182. 칸 폭은 byte 길이에 비례하지 않는다.
 */
const SCENES = [
  {
    label: "네 칸의 자리",
    summary: "32 + 65 + 1 = 98 B 고정",
    cover: "none",
    note: "맨 앞 32 byte가 packet hash, 다음 65 byte가 recoverable signature, 그다음 1 byte가 packet type입니다. 그 뒤 type별 RLP data는 1280 − 98 = 1182 byte 안에 들어가야 합니다.",
  },
  {
    label: "hash 검사",
    summary: "keccak256(packet[32:]) = packet[0:32] ?",
    cover: "hash",
    note: "수신자는 33번째 byte부터 끝까지, 곧 signature·type·data를 다시 Keccak-256해 맨 앞 32 byte와 비교합니다. 다르면 손상됐거나 discv4 framing이 아닌 datagram으로 거릅니다. Spec은 이 hash에 packet format 인식 외 다른 목적을 부여하지 않습니다.",
  },
  {
    label: "signature 복원",
    summary: "recover(σ, keccak256(packet[97:]))",
    cover: "sig",
    note: "65-byte signature σ는 type과 data에 결속돼 있습니다. 여기서 복원한 public key가 sender identity입니다. 앞의 hash가 일치했다는 것만으로는 이 identity가 증명되지 않습니다.",
  },
  {
    label: "둘 다 맞아도 남는 것",
    summary: "payload 평문 · UDP 경로 미확인",
    cover: "after",
    note: "두 검사를 통과해도 payload는 암호화되지 않은 평문입니다. Identity key를 복원했다는 사실과 UDP source address로 실제 응답할 수 있다는 사실은 endpoint proof(PING/PONG) 전까지 별개입니다.",
  },
] as const;

type Cover = (typeof SCENES)[number]["cover"];

const FIELDS = [
  { name: "hash", size: "32 B", range: "[0:32]" },
  { name: "signature σ", size: "65 B", range: "[32:97]" },
  { name: "type", size: "1 B", range: "[97]" },
  { name: "RLP data", size: "≤ 1182 B", range: "[98:]" },
] as const;

const COLS = "grid-cols-[2fr_3fr_1.3fr_3.4fr]";

function fieldTone(index: number, cover: Cover) {
  if (cover === "hash") {
    if (index === 0) return "border-amber-600 bg-amber-500/10";
    return "border-sky-600 bg-sky-500/10";
  }
  if (cover === "sig") {
    if (index === 1) return "border-amber-600 bg-amber-500/10";
    if (index >= 2) return "border-violet-600 bg-violet-500/10";
    return "border-border/60 opacity-60";
  }
  if (cover === "after" && index === 3) return "border-dashed border-red-600";
  return "border-border";
}

const CHECKS: readonly { name: string; states: readonly string[] }[] = [
  { name: "형식 (hash)", states: ["아직", "일치 확인", "일치 확인", "일치 확인"] },
  { name: "sender identity (σ)", states: ["아직", "아직", "public key 복원", "public key 복원"] },
  { name: "UDP 응답 경로", states: ["아직", "아직", "아직", "PING/PONG 전까지 미확인"] },
];

function PacketBody({ active }: { active: number }) {
        const cover = SCENES[active].cover;
        return (
          <div className="min-w-0 space-y-3">
            <div className={`grid ${COLS} gap-1`}>
              {FIELDS.map((field, index) => (
                <div
                  key={field.name}
                  className={`min-w-0 rounded-md border px-1 py-2 text-center text-[11px] leading-4 transition-colors duration-300 motion-reduce:transition-none sm:text-xs ${fieldTone(index, cover)}`}
                >
                  <span className="block break-words font-semibold">{field.name}</span>
                  <span className="block font-mono">{field.size}</span>
                  <span className="block font-mono text-muted-foreground">{field.range}</span>
                </div>
              ))}
            </div>

            <div className={`grid ${COLS} gap-1 text-[11px] leading-4 sm:text-xs`}>
              {cover === "hash" && (
                <>
                  <div className="rounded-md border border-amber-600 px-1 py-1 text-center font-semibold text-amber-800 dark:text-amber-300">
                    비교 대상
                  </div>
                  <div className="col-span-3 rounded-md border border-sky-600 px-2 py-1 text-center font-semibold text-sky-800 dark:text-sky-300">
                    hash 입력: packet[32:] 전체
                  </div>
                </>
              )}
              {cover === "sig" && (
                <>
                  <div />
                  <div className="rounded-md border border-amber-600 px-1 py-1 text-center font-semibold text-amber-800 dark:text-amber-300">
                    복원에 쓰는 σ
                  </div>
                  <div className="col-span-2 rounded-md border border-violet-600 px-2 py-1 text-center font-semibold text-violet-800 dark:text-violet-300">
                    서명 대상: packet[97:]
                  </div>
                </>
              )}
              {cover === "after" && (
                <>
                  <div className="col-span-3" />
                  <div className="rounded-md border border-dashed border-red-600 px-1 py-1 text-center font-semibold text-red-700 dark:text-red-400">
                    평문
                  </div>
                </>
              )}
              {cover === "none" && (
                <div className="col-span-3 rounded-md border border-border px-2 py-1 text-center font-semibold">
                  고정 envelope 98 B
                </div>
              )}
            </div>

            <div className="grid gap-1 text-xs sm:text-sm">
              {CHECKS.map((check) => {
                const state = check.states[active];
                const done = state !== "아직" && !state.includes("미확인");
                const open = state.includes("미확인");
                return (
                  <div key={check.name} className="grid grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)] items-center gap-2">
                    <span className="text-muted-foreground">{check.name}</span>
                    <span
                      className={`font-semibold ${
                        done ? "text-emerald-700 dark:text-emerald-400" : open ? "text-red-700 dark:text-red-400" : "text-muted-foreground/70"
                      }`}
                    >
                      {done ? "✓ " : open ? "✗ " : "· "}
                      {state}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
}

export default function PacketLayoutViz() {
  return (
    <SceneShell
      eyebrow="packet 한 개"
      title="hash와 signature는 packet의 다른 구간을 확인합니다"
      description="한 discv4 packet을 왼쪽부터 byte 순서대로 놓았습니다. 칸 폭은 byte 길이에 비례하지 않습니다. 대괄호는 0부터 센 byte 위치입니다."
      ariaLabel="discv4 packet 안에서 hash가 덮는 구간과 signature가 서명한 구간 비교"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack active={active} scenes={SCENES.map((scene, index) => <PacketBody key={scene.label} active={index} />)} />
      )}
    />
  );
}
