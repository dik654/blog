import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 첫 번째 표(A=0, B=10, C=11)로 적은 001011을 왼쪽부터 되찾고,
 * A=0, B=1, C=01인 표에서는 01이 두 가지로 읽히는 것을 대조한다.
 */
const BITS = ["0", "0", "1", "0", "1", "1"] as const;
const CHUNKS = [
  { start: 0, end: 1, letter: "A" },
  { start: 1, end: 2, letter: "A" },
  { start: 2, end: 4, letter: "B" },
  { start: 4, end: 6, letter: "C" },
] as const;

const SCENES = [
  { label: "첫 자리 0", summary: "0 → A", note: "표에서 0은 A 하나뿐입니다. 뒤 자리를 더 볼 필요 없이 첫 글자가 A로 정해집니다." },
  { label: "다음 자리 0", summary: "0 → A", note: "A가 끝난 자리에서 다시 시작합니다. 또 0이므로 두 번째 글자도 A입니다." },
  { label: "1이면 한 자리 더", summary: "10 → B", note: "1 하나만 적힌 글자는 이 표에 없습니다. 다음 자리까지 읽어 10이 되면 B입니다." },
  { label: "마지막 두 자리", summary: "11 → C · A, A, B, C", note: "남은 11은 C입니다. 구분점이 없었는데도 원래 네 글자를 그대로 되찾았습니다." },
  { label: "모호한 표", summary: "A=0, B=1, C=01", note: "이 표에서는 C의 코드 01이 A의 코드 0으로 시작합니다. 01을 받은 수신자는 C 하나인지 A 다음 B인지 구별하지 못합니다." },
] as const;

function DecodePanel({ step }: { step: number }) {
  const done = CHUNKS.slice(0, step + 1);
  const current = CHUNKS[step];
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold text-muted-foreground">코드 표: A=0 · B=10 · C=11</p>
      <div className="mt-3 flex justify-center gap-1.5">
        {BITS.map((bit, index) => {
          const isCurrent = index >= current.start && index < current.end;
          const isRead = index < current.start;
          return (
            <span
              key={index}
              className={`flex h-10 w-10 items-center justify-center rounded border font-mono text-base ${
                isCurrent ? "border-primary bg-primary/15 font-bold" : isRead ? "border-border bg-muted/50 text-muted-foreground" : "border-border bg-background"
              }`}
            >
              {bit}
            </span>
          );
        })}
      </div>
      <p className="mt-4 text-xs font-semibold text-muted-foreground">되찾은 글자</p>
      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {CHUNKS.map((chunk, index) => (
          <span
            key={index}
            className={`flex h-10 items-center justify-center rounded border text-base font-bold ${
              index < done.length ? "border-border bg-background" : "border-dashed border-border/50 text-transparent"
            }`}
          >
            {chunk.letter}
          </span>
        ))}
      </div>
    </div>
  );
}

function AmbiguousPanel() {
  const readings = [
    { title: "읽기 1", cells: ["01"], result: "C" },
    { title: "읽기 2", cells: ["0", "1"], result: "A, B" },
  ];
  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2">
      {readings.map((reading) => (
        <div key={reading.title} className="rounded-lg border border-border bg-background p-3">
          <p className="text-xs font-semibold text-muted-foreground">{reading.title}</p>
          <div className="mt-2 flex gap-1.5">
            {reading.cells.map((cell) => (
              <span key={cell} className={`flex h-10 items-center justify-center rounded border border-red-600 font-mono text-base ${cell.length === 2 ? "w-[5.375rem]" : "w-10"}`}>
                {cell}
              </span>
            ))}
          </div>
          <p className="mt-2 text-sm font-bold">→ {reading.result}</p>
        </div>
      ))}
    </div>
  );
}

export default function PrefixDecodeViz() {
  return (
    <SceneShell
      eyebrow="구분점 없이 읽기"
      title="001011은 왼쪽부터 읽으면 네 글자로 되돌아옵니다"
      description="코드 표는 글자마다 정한 표시입니다. 진한 칸이 지금 읽는 자리이고, 아래 칸에 되찾은 글자가 쌓입니다."
      ariaLabel="이진 코드 001011을 왼쪽부터 해독하는 과정과 모호한 코드 표의 대조"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack active={active} scenes={SCENES.map((_, index) => (index < CHUNKS.length ? <DecodePanel key={index} step={index} /> : <AmbiguousPanel key={index} />))} />
      )}
    />
  );
}
