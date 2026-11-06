import type { ReactNode } from "react";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stream-capture — 캡처 구간에서 Python은 돌고 GPU 작업은 기록만 된다. 재생은 그 반대다.
 * 값은 본문 사례(A=3이면 22). 카운터는 함수 안에서 한 번 증가시키는 Python 값이다.
 * 마지막 장면의 두 stream 분할(앞 둘·뒤 둘)은 그림을 위한 가정이다.
 */
const OPS = ["+1", "×2", "+3", "×2"] as const;

const SCENES = [
  { label: "캡처 구간", summary: "기록 4 · GPU 계산 0", python: "네 연산 호출", counter: 1, recorded: true, run: false, result: "결과 자리에 22가 있다고 볼 수 없음", note: "Python 함수는 실제로 돌아 카운터가 1이 됩니다. 그 함수가 stream에 제출한 GPU 작업은 기록될 뿐 이 구간에서 실행되지 않습니다." },
  { label: "재생 1회", summary: "Python 0 · GPU 계산 4", python: "호출하지 않음", counter: 1, recorded: true, run: true, result: "Z = 22", note: "재생은 기록한 네 작업을 GPU에 다시 제출합니다. Python 함수를 다시 호출하지 않으므로 카운터는 1에 머뭅니다." },
  { label: "재생 2회", summary: "카운터는 여전히 1", python: "호출하지 않음", counter: 1, recorded: true, run: true, result: "Z = 22", note: "재생을 몇 번 해도 CPU 쪽 카운터는 자동으로 다시 증가하지 않습니다. 다시 일어나는 것은 기록한 네 GPU 계산입니다." },
  { label: "두 stream에 나눌 때", summary: "event로 합류", python: "", counter: 1, recorded: true, run: false, result: "", note: "네 연산을 두 stream에 나누더라도 앞 결과를 읽는 관계는 event 의존성으로 보존합니다. event는 여기서 다른 stream의 앞 작업이 끝나기를 기다리게 하는 연결입니다. 다른 stream이 event로 합류했다면 캡처 종료 전에 원래 stream으로 다시 연결합니다. 앞 둘·뒤 둘로 나눈 것은 가정입니다." },
] as const;

function Row({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 text-xs leading-5">
      <span className="font-semibold text-muted-foreground">{name}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Lanes({ scene }: { scene: (typeof SCENES)[number] }) {
  return (
    <div className="space-y-3">
      <Row name="Python">
        <span className="font-semibold">{scene.python}</span>
        <span className="ml-2 font-mono">카운터 = {scene.counter}</span>
      </Row>
      <Row name="GPU 기록">
        <div className="grid grid-cols-4 gap-1">
          {OPS.map((op, index) => (
            <span key={index} className="rounded border border-[#64748b] bg-background py-1 text-center font-mono">{op}</span>
          ))}
        </div>
      </Row>
      <Row name="GPU 계산">
        <div className="grid grid-cols-4 gap-1">
          {[4, 8, 11, 22].map((value) => (
            <span key={value} className={`rounded border py-1 text-center font-mono ${scene.run ? "border-[#2563eb] bg-[#2563eb]/15 font-bold" : "border-dashed border-border text-muted-foreground"}`}>
              {scene.run ? value : "안 함"}
            </span>
          ))}
        </div>
      </Row>
      <Row name="결과">
        <span className="font-mono font-bold">{scene.result}</span>
      </Row>
    </div>
  );
}

function Streams() {
  return (
    <svg viewBox="0 0 340 128" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="네 연산을 두 stream에 나누고 event로 잇는 그림">
      <defs>
        <marker id="capture-event-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0L8 4L0 8" fill="#b45309" />
        </marker>
      </defs>
      <text x={0} y={34} fontSize={11} fontWeight={700} className="fill-foreground">stream 1</text>
      <text x={0} y={98} fontSize={11} fontWeight={700} className="fill-foreground">stream 2</text>
      <line x1={56} x2={336} y1={30} y2={30} stroke="#94a3b8" strokeWidth={1} />
      <line x1={56} x2={336} y1={94} y2={94} stroke="#94a3b8" strokeWidth={1} />
      {[[62, 16, "+1"], [108, 16, "×2"], [168, 80, "+3"], [214, 80, "×2"]].map(([bx, by, op]) => (
        <g key={`${bx}`}>
          <rect x={Number(bx)} y={Number(by)} width={38} height={28} rx={3} fill="#2563eb" opacity={0.15} stroke="#2563eb" strokeWidth={1} />
          <text x={Number(bx) + 19} y={Number(by) + 19} textAnchor="middle" fontSize={12} className="fill-foreground">{op}</text>
        </g>
      ))}
      <path d="M146 44 L168 80" fill="none" stroke="#b45309" strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#capture-event-arrow)" />
      <text x={140} y={70} textAnchor="end" fontSize={11} fontWeight={700} fill="#b45309">event</text>
      <path d="M252 80 L280 44" fill="none" stroke="#b45309" strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#capture-event-arrow)" />
      <text x={272} y={70} fontSize={11} fontWeight={700} fill="#b45309">다시 연결</text>
      <rect x={280} y={16} width={56} height={28} rx={3} className="fill-background" stroke="#64748b" strokeWidth={1} />
      <text x={308} y={35} textAnchor="middle" fontSize={11} className="fill-foreground">캡처 종료</text>
    </svg>
  );
}

export default function CaptureVsReplayViz() {
  return (
    <SceneShell
      eyebrow="캡처와 재생"
      title="캡처에서는 Python이 돌고, 재생에서는 GPU 계산이 돕니다"
      description="stream은 작업 제출 순서를 유지하는 줄이고, 이 줄을 캡처 상태로 두면 제출한 작업이 기록됩니다. A에 3이 있는 사례의 네 연산이며 함수 안의 Python 카운터를 한 번 증가시킨다고 가정합니다."
      ariaLabel="캡처와 재생에서 Python, GPU 기록, GPU 계산이 각각 일어나는지 비교"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={[<Lanes key="0" scene={SCENES[0]} />, <Lanes key="1" scene={SCENES[1]} />, <Lanes key="2" scene={SCENES[2]} />, <Streams key="3" />]}
        />
      )}
    />
  );
}
