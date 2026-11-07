import BitCells from "./BitCells";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #race — 전체 값 0x01을 두 코어가 함께 읽고 0x21·0x41을 만든다.
 * 덮어쓰기는 나중 값 0x41만 남을 수 있고, SET에 0x20·0x40을 쓰면 0x01|0x20|0x40=0x61.
 * 덮어쓰는 순서와 SET·CLR 순서는 가정이다. 0x21에서 CLR→0x01, 0x01에서 SET→0x21.
 */
const FIVE = 0x20;
const SIX = 0x40;

interface Line {
  who: string;
  action: string;
  value: number;
  focus: number;
  lost?: number;
  result?: boolean;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  lines: readonly Line[];
}

const A = "5번을 세우는 코어";
const B = "6번을 세우는 코어";
const OUT = "전체 출력 값";

const SCENES: readonly Scene[] = [
  {
    label: "같은 값을 읽습니다",
    summary: "둘 다 0x01",
    note: "전체 출력 값이 0x01인 다른 상황을 가정합니다. 두 코어가 이 값을 동시에 읽어 각자 손에 들고 있습니다.",
    lines: [
      { who: A, action: "읽음 0x01", value: 0x01, focus: 0 },
      { who: B, action: "읽음 0x01", value: 0x01, focus: 0 },
      { who: OUT, action: "0x01", value: 0x01, focus: 0, result: true },
    ],
  },
  {
    label: "각자 고칩니다",
    summary: "0x21과 0x41",
    note: "각자 자기 자리만 1로 고칩니다. 그런데 상대가 고친 자리는 모릅니다. 아직 아무도 쓰지 않아 전체 출력 값은 그대로입니다.",
    lines: [
      { who: A, action: "만듦 0x21", value: 0x21, focus: FIVE },
      { who: B, action: "만듦 0x41", value: 0x41, focus: SIX },
      { who: OUT, action: "0x01", value: 0x01, focus: 0, result: true },
    ],
  },
  {
    label: "전체 값을 덮어쓰면",
    summary: "0x21 → 0x41",
    note: "0x21을 먼저, 0x41을 나중에 썼다고 가정합니다. 나중 값이 전체를 덮으므로 먼저 세운 5번 비트가 사라집니다. 쓰는 순서가 바뀌면 사라지는 자리도 바뀝니다.",
    lines: [
      { who: A, action: "먼저 씀 0x21", value: 0x21, focus: FIVE },
      { who: B, action: "나중에 씀 0x41", value: 0x41, focus: SIX },
      { who: OUT, action: "0x41 · 5번 잃음", value: 0x41, focus: SIX, lost: FIVE, result: true },
    ],
  },
  {
    label: "SET 주소에 쓰면",
    summary: "0x01 | 0x20 | 0x40 = 0x61",
    note: "각 코어가 자기 자리 0x20, 0x40만 SET 주소에 씁니다. 하드웨어가 선택한 자리만 바꾸므로 두 비트가 모두 남아 결과는 0x61입니다.",
    lines: [
      { who: A, action: "SET ← 0x20", value: 0x20, focus: FIVE },
      { who: B, action: "SET ← 0x40", value: 0x40, focus: SIX },
      { who: OUT, action: "0x61", value: 0x61, focus: FIVE | SIX, result: true },
    ],
  },
  {
    label: "같은 5번을 다투면",
    summary: "쓰기 순서가 결과를 정함",
    note: "0x01에서 시작해 같은 5번을 서로 세우고 내리면(가정) 최종 값은 쓰기 순서에 좌우됩니다. 원자적 비트 변경(읽고 고쳐 쓰는 틈 없이 그 자리만 바꾸기)도 어느 의도가 우선인지는 정하지 않습니다.",
    lines: [
      { who: "한 코어는 SET, 다른 코어는 CLR", action: "← 0x20", value: 0x20, focus: FIVE },
      { who: "SET 뒤 CLR이면 (가정)", action: "0x01", value: 0x01, focus: FIVE, result: true },
      { who: "CLR 뒤 SET이면 (가정)", action: "0x21", value: 0x21, focus: FIVE, result: true },
    ],
  },
];

export default function WriteRaceViz() {
  return (
    <SceneShell
      eyebrow="두 코어가 함께 쓰는 출력"
      title="전체 값을 덮어쓰면 비트를 잃을 수 있고, SET은 그 자리만 바꿉니다"
      description="칸 하나가 한 비트이고 왼쪽이 7번, 오른쪽이 0번입니다. 윗자리는 모두 0이라 생략했습니다."
      ariaLabel="읽고 고쳐 쓰기와 SET 쓰기에서 두 코어의 비트 결과 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="max-w-xl space-y-3">
          {SCENES[active].lines.map((line) => (
            <div key={`${line.who}-${line.action}`} className={line.result ? "rounded-lg border border-border bg-background p-2" : "p-2"}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 text-xs">
                <span className={line.result ? "font-bold" : "text-muted-foreground"}>{line.who}</span>
                <span className={`font-mono ${line.result ? "font-bold text-primary" : ""}`}>{line.action}</span>
              </div>
              <BitCells value={line.value} focus={line.focus} lost={line.lost} />
            </div>
          ))}
        </div>
      )}
    />
  );
}
