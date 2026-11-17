import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #request-envelope — 2026-07-28 core에서는 요청마다 protocol version·client information·capability를
 * 함께 보내 다른 worker가 받아도 이전 connection memory 없이 해석한다. 지원하지 않는 version은 명시적 mismatch.
 * 호출 사이 state는 explicit handle(예: 20분 export job의 jobHandle)로 넘기고 caller·scope·expiry를 매번 확인한다.
 * Worker 2대는 설명용 가정.
 */
const SCENES = [
  {
    label: "요청 1이 worker A에 도착",
    summary: "해석 규칙을 요청이 들고 옴",
    target: 0,
    note: "요청에는 method와 인자 말고도 protocol version·client information·capabilities가 함께 실립니다. Worker A는 이 요청 하나만 보고 어떤 규칙으로 읽을지 정합니다.",
  },
  {
    label: "요청 2는 worker B가 받아도 됩니다",
    summary: "이전 connection memory 불필요",
    target: 1,
    note: "Worker B는 요청 1을 본 적이 없습니다. 그래도 요청 2가 같은 정보를 다시 싣고 오므로 이전 connection memory 없이 해석할 수 있습니다.",
  },
  {
    label: "모르는 version이면 mismatch",
    summary: "명시적으로 mismatch 반환",
    target: 2,
    note: "받는 쪽이 2026-07-28을 지원하지 않으면 그 사실을 명시적인 mismatch로 돌려줍니다. Version 문자열은 해석 규칙을 고정할 뿐 caller identity가 아닙니다.",
  },
  {
    label: "이어야 할 state는 handle로",
    summary: "jobHandle을 인자로 다시 넣음",
    target: 3,
    note: "20분짜리 export job처럼 호출 사이에 이어야 할 state는 jobHandle 같은 opaque 식별자로 status·cancel 요청에 다시 넣습니다. Handle을 가졌다고 권한이 생기지는 않아 caller·scope·expiry를 매번 확인합니다.",
  },
] as const;

const FIELDS = ["protocol version: 2026-07-28", "client: example-host 1.4.0", "capabilities: …"] as const;

function RequestCard({ title, lines, extra, tone }: { title: string; lines: readonly string[]; extra?: string; tone: "ok" | "bad" | "handle" }) {
  const border = tone === "bad" ? "border-[#dc2626]" : tone === "handle" ? "border-[#b45309]" : "border-[#2563eb]";
  return (
    <div className={`min-w-0 rounded-lg border ${border} bg-background p-3`}>
      <p className="text-xs font-bold">{title}</p>
      <ul className="mt-1.5 space-y-0.5 font-mono text-[11px] leading-5 text-muted-foreground sm:text-xs">
        {lines.map((line) => (
          <li key={line} className="break-words">{line}</li>
        ))}
        {extra && <li className="break-words font-bold text-[#b45309] dark:text-[#fbbf24]">{extra}</li>}
      </ul>
    </div>
  );
}

function Worker({ name, on, result }: { name: string; on: boolean; result: string }) {
  return (
    <div className={`min-w-0 rounded-lg border px-3 py-2 transition-opacity motion-reduce:transition-none ${on ? "border-foreground/60 opacity-100" : "border-border opacity-40"}`}>
      <p className="text-xs font-bold">{name}</p>
      <p className="mt-1 min-h-[2.5rem] text-[11px] leading-5 text-muted-foreground sm:text-xs">{on ? result : "이 요청을 받지 않음"}</p>
    </div>
  );
}

function Stage({ target }: { target: number }) {
  const card =
    target === 0 ? (
      <RequestCard title="요청 1 · tools/call" lines={FIELDS} tone="ok" />
    ) : target === 1 ? (
      <RequestCard title="요청 2 · tools/call" lines={FIELDS} tone="ok" />
    ) : target === 2 ? (
      <RequestCard title="요청 · tools/call" lines={FIELDS} tone="bad" />
    ) : (
      <RequestCard title="status 요청" lines={FIELDS} extra="jobHandle: (20분 export job)" tone="handle" />
    );
  return (
    <div className="min-w-0 space-y-3">
      {card}
      <p className="text-center text-xs text-muted-foreground">{target === 3 ? "↓ handle을 받은 쪽이 매번 확인" : "↓"}</p>
      {target === 3 ? (
        <div className="grid grid-cols-3 gap-2">
          {["caller", "scope", "expiry"].map((check) => (
            <div key={check} className="flex flex-col items-center justify-center rounded-lg border border-[#b45309] px-1 py-2 text-center">
              <span className="font-mono text-xs font-bold">{check}</span>
              <span className="text-[11px] text-muted-foreground">확인</span>
            </div>
          ))}
        </div>
      ) : target === 2 ? (
        <div className="rounded-lg border border-[#dc2626] px-3 py-2">
          <p className="text-xs font-bold">2026-07-28을 지원하지 않는 server</p>
          <p className="mt-1 text-[11px] leading-5 text-muted-foreground sm:text-xs">명시적으로 mismatch 반환 ✕</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Worker name="Worker A" on={target === 0} result="요청에 실린 version으로 해석 ✓" />
          <Worker name="Worker B" on={target === 1} result="요청 1을 몰라도 해석 ✓" />
        </div>
      )}
    </div>
  );
}

export default function SelfDescribingRequestViz() {
  return (
    <SceneShell
      eyebrow="Self-describing request"
      title="요청마다 해석 정보를 들고 다닙니다"
      description="Worker는 같은 server 기능을 처리하는 여러 실행 단위 중 하나이며, 여기서는 두 대로 둡니다(가정). 위 카드가 이번 요청, 아래 칸이 그 요청을 받은 worker입니다."
      ariaLabel="요청마다 version, client 정보, capability를 실어 어느 worker든 해석하고, 모르는 version은 mismatch, 이어지는 state는 handle로 넘기는 과정"
      scenes={SCENES}
      render={(active) => <StableSceneStack active={active} scenes={SCENES.map((scene) => <Stage key={scene.label} target={scene.target} />)} />}
    />
  );
}
