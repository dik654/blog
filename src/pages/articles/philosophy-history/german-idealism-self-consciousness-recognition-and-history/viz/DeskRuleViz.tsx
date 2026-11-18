import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 책상 60분을 규칙 A(60 대 0)와 규칙 B(30 대 30, 또는 40분과 20분)로 나눕니다.
 * 막대 전체 = 하루 60분. 파랑 = 가, 주황 = 나. 아래 칸 = 그 규칙을 누가 세우고 고치는지.
 */
const TOTAL = 60;
const GA = "#2563eb";
const NA = "#d97706";

interface Split {
  label: string;
  ga: number;
  na: number;
}

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  rows: readonly [Split | null, Split | null];
  author: string;
  shared: boolean;
}[] = [
  {
    label: "규칙 A",
    summary: "60 : 0",
    note: "먼저 온 가가 60분을 모두 쓰고 나는 0분을 씁니다. 가가 자신에게만 적용하는 원칙은 ‘내가 먼저 왔으니 전부 쓴다’입니다. 한 사람의 필요만 규칙이 됩니다.",
    rows: [{ label: "가의 원칙", ga: 60, na: 0 }, null],
    author: "가 혼자 정한 원칙",
    shared: false,
  },
  {
    label: "나도 같은 원칙을 내세우면",
    summary: "60 : 0 ↔ 0 : 60",
    note: "나도 ‘먼저 왔으니 전부 쓴다’를 내세우면 다음 날 충돌이 다시 생깁니다. 어느 쪽이 이 원칙을 쓰든 다른 쪽은 0분이 되므로, 60 대 0은 둘에게 함께 적용될 규칙이 되지 못합니다.",
    rows: [
      { label: "가의 원칙", ga: 60, na: 0 },
      { label: "나의 원칙이라면", ga: 0, na: 60 },
    ],
    author: "각자 혼자 정한 두 원칙이 같은 60분을 다툼",
    shared: false,
  },
  {
    label: "규칙 B",
    summary: "30 : 30 또는 40분과 20분",
    note: "둘이 서로를 같은 자격의 이용자로 인정하면 30분씩 쓰거나, 필요한 시간을 공개하고 번갈아 40분과 20분을 씁니다. 누가 40분 쪽인지는 그림을 위한 가정입니다.",
    rows: [
      { label: "균등안", ga: 30, na: 30 },
      { label: "필요 공개 (가정)", ga: 40, na: 20 },
    ],
    author: "둘이 함께 정한 규칙",
    shared: true,
  },
  {
    label: "중요한 값",
    summary: "몇 분인가보다 누가 참여하는가",
    note: "중요한 값은 정확히 반으로 나눴는지가 아니라 둘 다 이유를 요구하고 규칙 수정에 참여할 수 있는가입니다. 그래서 30 대 30과 40분·20분은 모두 규칙 B에 들어갑니다.",
    rows: [
      { label: "균등안", ga: 30, na: 30 },
      { label: "필요 공개 (가정)", ga: 40, na: 20 },
    ],
    author: "가 · 나 모두 이유를 요구하고 규칙을 고칠 수 있음",
    shared: true,
  },
];

function MinuteBar({ split }: { split: Split | null }) {
  return (
    <div className="grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)] items-center gap-2 text-xs sm:grid-cols-[8rem_minmax(0,1fr)] sm:text-sm">
      <span className={split ? "font-semibold" : "text-muted-foreground/60"}>{split ? split.label : "—"}</span>
      {split ? (
        <div className="flex h-8 min-w-0 overflow-hidden rounded-md border border-border">
          {split.ga > 0 ? (
            <div className="flex items-center justify-center font-mono text-xs font-bold text-white" style={{ width: `${(split.ga / TOTAL) * 100}%`, backgroundColor: GA }}>
              가 {split.ga}
            </div>
          ) : null}
          {split.na > 0 ? (
            <div className="flex items-center justify-center font-mono text-xs font-bold text-white" style={{ width: `${(split.na / TOTAL) * 100}%`, backgroundColor: NA }}>
              나 {split.na}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="h-8 min-w-0 rounded-md border border-dashed border-border/50" />
      )}
    </div>
  );
}

export default function DeskRuleViz() {
  return (
    <SceneShell
      eyebrow="책상 60분"
      title="60분을 나누는 방식보다 규칙을 누가 세우는지가 갈립니다"
      description="막대 하나가 책상 하루 60분입니다. 파랑은 먼저 온 연구자 가, 주황은 나의 몫입니다. 아래 칸은 그 규칙을 누가 세우고 고칠 수 있는지 보여 줍니다."
      ariaLabel="책상 60분을 규칙 A의 60 대 0과 규칙 B의 30 대 30, 40분과 20분으로 나눈 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)] gap-2 text-[11px] text-muted-foreground sm:grid-cols-[8rem_minmax(0,1fr)]">
              <span />
              <div className="flex justify-between font-mono">
                <span>0분</span>
                <span>30분</span>
                <span>60분</span>
              </div>
            </div>
            <MinuteBar split={scene.rows[0]} />
            <MinuteBar split={scene.rows[1]} />
            <div className={`rounded-lg border px-3 py-2 text-sm leading-6 ${scene.shared ? "border-primary/60" : "border-dashed border-border"}`}>
              <span className="mr-2 text-xs text-muted-foreground">규칙을 세우는 쪽</span>
              <span className="font-semibold">{scene.author}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
