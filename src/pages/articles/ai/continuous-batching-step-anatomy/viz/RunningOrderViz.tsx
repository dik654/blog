import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-running — running 목록을 순서대로 돌며 min(필요량, 잔액)을 고른다.
 * A·B: 8→7→6. P(입력 6 남음)·A, 잔액 4: min(6,4)=4 → 잔액 0 → A 미선택.
 * 저장 공간 실패 시 이미 배정한 요청을 빼면 그 토큰이 잔액으로 돌아온다.
 * 고정 원문 scheduler.py L590-615: 반환(token_budget +=)은 PRIORITY 분기에만 있고, 그 밖의 정책은 running.pop()으로 맨 뒤를 뺀다.
 * 그래서 [A, B]의 B가 실패하면 FCFS에서는 B 자신이 빠지고 A의 토큰은 돌아오지 않는다.
 */
type Tone = "ok" | "wait" | "no";

interface Row {
  id: string;
  need: number;
  calc: string;
  status: string;
  tone: Tone;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  cells: readonly string[];
  caption: string;
  rows: readonly Row[];
}

const SCENES: readonly Scene[] = [
  {
    label: "A 다음 B · 잔액 8",
    summary: "8 → 7 → 6",
    note: "A와 B는 답변을 이어 쓰는 요청이라 필요량이 1입니다. 목록 순서대로 하나씩 가져가면 잔액 6이 남습니다.",
    cells: ["A", "B", "", "", "", "", "", ""],
    caption: "시작 8 · 남은 잔액 6",
    rows: [
      { id: "A", need: 1, calc: "min(1, 8) = 1", status: "배정 1", tone: "ok" },
      { id: "B", need: 1, calc: "min(1, 7) = 1", status: "배정 1", tone: "ok" },
    ],
  },
  {
    label: "P 다음 A · P의 차례",
    summary: "min(6, 4) = 4",
    note: "P는 입력을 6토큰 더 읽어야 하는 요청이고 잔액은 4입니다(가정). 앞에 있는 P가 잔액을 전부 가져갑니다.",
    cells: ["P", "P", "P", "P"],
    caption: "시작 4 · 남은 잔액 0",
    rows: [
      { id: "P", need: 6, calc: "min(6, 4) = 4", status: "배정 4", tone: "ok" },
      { id: "A", need: 1, calc: "아직 차례가 아님", status: "다음 차례", tone: "wait" },
    ],
  },
  {
    label: "P 다음 A · A의 차례",
    summary: "잔액 0 → A 선택 안 됨",
    note: "A는 답변을 잇는 요청이지만 이번에 선택되지 않습니다. 미루기 조건을 끈 이 반례에서 running 먼저는 목록 순서일 뿐입니다.",
    cells: ["P", "P", "P", "P"],
    caption: "시작 4 · 남은 잔액 0",
    rows: [
      { id: "P", need: 6, calc: "min(6, 4) = 4", status: "배정 4", tone: "ok" },
      { id: "A", need: 1, calc: "남은 토큰 없음", status: "미선택", tone: "no" },
    ],
  },
  {
    label: "B가 저장 공간을 못 받음",
    summary: "잔액 7에서 멈춤",
    note: "A가 1토큰을 받아 잔액은 7입니다. B는 저장 공간을 받지 못해(가정) 성공 목록에 넣지 않고 토큰도 빼지 않습니다.",
    cells: ["A", "", "", "", "", "", "", ""],
    caption: "시작 8 · 남은 잔액 7",
    rows: [
      { id: "A", need: 1, calc: "min(1, 8) = 1", status: "배정 1", tone: "ok" },
      { id: "B", need: 1, calc: "저장 공간 없음", status: "공간 실패", tone: "no" },
    ],
  },
  {
    label: "A를 빼고 토큰을 되돌림",
    summary: "7 → 8",
    note: "요청을 중단시켜 공간을 되찾는 preemption입니다. A가 우선순위 최하위면(가정) 1토큰이 돌아옵니다. FCFS(도착 순서)면 맨 뒤 B가 빠져 잔액은 그대로입니다.",
    cells: ["", "", "", "", "", "", "", ""],
    caption: "시작 8 · 남은 잔액 8",
    rows: [
      { id: "A", need: 1, calc: "중단 · 1토큰 반환", status: "중단", tone: "no" },
      { id: "B", need: 1, calc: "되찾은 공간으로 다시 시도", status: "재시도", tone: "wait" },
    ],
  },
];

const CELL: Record<string, string> = {
  A: "border-[#2563eb] bg-[#2563eb] text-white",
  B: "border-[#2563eb] bg-[#2563eb] text-white",
  P: "border-[#f59e0b] bg-[#f59e0b] text-[#451a03]",
  "": "border-dashed border-border text-muted-foreground",
};

const TONE: Record<Tone, string> = {
  ok: "border-[#16a34a] text-[#166534] dark:text-[#bbf7d0]",
  wait: "border-dashed border-border text-muted-foreground",
  no: "border-[#dc2626] text-[#991b1b] dark:text-[#fecaca]",
};

export default function RunningOrderViz() {
  return (
    <SceneShell
      eyebrow="목록 순서와 잔액"
      title="잔액은 목록 앞에서부터 줄고, 빼낸 요청의 몫은 돌아옵니다"
      description="칸 하나가 토큰 1개입니다. 칠해진 칸은 배정, 점선 칸은 잔액입니다. 아래는 목록 순서이고 필요량은 그 요청에 남은 계산량입니다."
      note="숫자는 본문의 설명용 가정이며 배포 실측이 아닙니다. 실제 코드는 모델 길이와 다른 조건도 먼저 검사합니다."
      ariaLabel="running 목록 순서에 따라 토큰 잔액이 줄고 preemption으로 돌아오는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <p className="mb-2 font-mono text-xs text-muted-foreground">{scene.caption}</p>
            <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(8, minmax(0, 1fr))" }}>
              {scene.cells.map((cell, index) => (
                <span key={index} className={`flex h-7 items-center justify-center rounded-sm border text-xs font-bold ${CELL[cell]}`}>
                  {cell}
                </span>
              ))}
            </div>
            <ol className="mt-2 space-y-1">
              {scene.rows.map((row, index) => (
                <li key={row.id} className="grid grid-cols-[minmax(0,1fr)_5rem] items-center gap-2 border-t border-border pt-1.5">
                  <div className="min-w-0">
                    <p className="text-sm font-bold">{index + 1}번째 {row.id} · 필요량 {row.need}</p>
                    <p className="font-mono text-xs text-muted-foreground">{row.calc}</p>
                  </div>
                  <span className={`flex h-8 items-center justify-center rounded-sm border text-xs font-bold ${TONE[row.tone]}`}>{row.status}</span>
                </li>
              ))}
            </ol>
          </div>
        );
      }}
    />
  );
}
