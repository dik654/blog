import SceneShell from "./SceneShell";

/**
 * 본문 대응: #checkpoint-resume — (가정) 2,000번째 갱신 목표, 1,800번째 갱신 직후 worker 종료.
 * 예시 출력: 정상 step 1800→1801, lr 1.200e-05→1.199e-05, cursor 57,600→57,632.
 * 실패 step 1800→1, lr 2.000e-04, cursor 0, optimizer state missing.
 * cursor는 갱신 한 번에 57,632−57,600 = 32씩 늘고 57,600 = 1,800×32와도 맞는다.
 * cursor 축 끝 64,000 = 2,000×32는 같은 속도가 이어진다는 가정.
 */
const TARGET = 2000;
const PER_STEP = 32;
const CURSOR_MAX = TARGET * PER_STEP;

const SCENES = [
  {
    label: "1,800번째 갱신 직후 종료",
    summary: "step 1,800 · cursor 57,600 · lr 1.200e-05",
    note: "2,000번째 갱신을 목표로 하던 학습이 1,800번째 갱신 직후 멈췄습니다(가정). 이 순간 weight가 배운 지점, global step, 다음에 읽을 data 위치가 모두 1,800번째 갱신에 맞춰져 있습니다.",
    weight: 1800,
    step: 1800,
    cursor: 57600,
    lr: "1.200e-05",
    lrNote: "",
    reread: false,
  },
  {
    label: "전체 상태로 재개",
    summary: "step 1,801 · cursor 57,632 · lr 1.199e-05",
    note: "Optimizer·scheduler·RNG·data position까지 읽으면 세 막대가 같은 자리에서 함께 한 칸 나아갑니다. cursor는 한 번의 갱신에 32씩 늘고(57,632 − 57,600), learning rate도 직전 값에서 이어집니다. 목표까지 199번이 남습니다.",
    weight: 1801,
    step: 1801,
    cursor: 57632,
    lr: "1.199e-05",
    lrNote: "직전 값에서 이어짐",
    reread: false,
  },
  {
    label: "weight만 읽고 재개",
    summary: "step 1 · cursor 0 · lr 2.000e-04",
    note: "Weight는 1,800번째 갱신까지 배운 값에서 한 번 더 갱신됐는데 step은 1로, data 위치는 0으로 돌아갔습니다. learning rate는 처음 값으로 돌아갔고, 이미 본 57,600개 위치(빨간 구간)를 다시 읽습니다. 파일은 복구됐지만 진행 상태는 복구되지 않았습니다.",
    weight: 1801,
    step: 1,
    cursor: 0,
    lr: "2.000e-04",
    lrNote: "처음 값으로 돌아감",
    reread: true,
  },
] as const;

const BLUE = "#2563eb";
const RED = "#dc2626";

function Track({
  label,
  value,
  max,
  text,
  reread = false,
  lost,
}: {
  label: string;
  value: number;
  max: number;
  text: string;
  reread?: boolean;
  lost: boolean;
}) {
  const pct = Math.max((value / max) * 100, value > 0 ? 0.6 : 0);
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs">
        <span className="font-semibold">{label}</span>
        <span className={`font-mono font-bold ${lost ? "text-red-700 dark:text-red-400" : "text-primary"}`}>{text}</span>
      </div>
      <div className="relative h-5 min-w-0 rounded-sm bg-muted/40">
        {reread && (
          <div className="absolute inset-y-0 left-0 rounded-sm border border-dashed" style={{ width: `${(57600 / CURSOR_MAX) * 100}%`, borderColor: RED, backgroundColor: "#dc262622" }} />
        )}
        <div className="absolute inset-y-0 left-0 rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${pct}%`, backgroundColor: lost ? RED : BLUE }} />
        <div className="absolute inset-y-[-3px] w-px bg-foreground/60" style={{ left: `${(1800 / TARGET) * 100}%` }} />
      </div>
    </div>
  );
}

export default function ResumeTimelineViz() {
  return (
    <SceneShell
      eyebrow="재개 전후 판독"
      title="재개한 뒤 세 진행 좌표가 같은 자리에서 이어지는지 봅니다"
      description="막대의 오른쪽 끝은 목표인 2,000번째 갱신이고, 세로선은 종료 지점인 1,800번째 갱신입니다. step·learning rate·cursor 값은 본문의 예시 출력이며, cursor 막대 끝 64,000은 갱신마다 32씩 읽는 속도가 이어진다는 가정으로 계산했습니다."
      ariaLabel="1,800번째 갱신에서 멈춘 학습을 전체 상태로 재개할 때와 weight만 읽고 재개할 때의 진행 좌표 비교"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <Track label="Weight가 배운 지점" value={s.weight} max={TARGET} text={`${s.weight.toLocaleString("en-US")}번째 갱신까지`} lost={false} />
            <Track label="Global step" value={s.step} max={TARGET} text={s.step.toLocaleString("en-US")} lost={s.reread} />
            <Track label="Sampler cursor" value={s.cursor} max={CURSOR_MAX} text={s.cursor.toLocaleString("en-US")} reread={s.reread} lost={s.reread} />
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 border-t border-border pt-3 text-xs">
              <span className="font-semibold">Learning rate</span>
              <span className="flex flex-wrap items-baseline justify-end gap-x-2">
                <span className={`font-mono font-bold ${s.reread ? "text-red-700 dark:text-red-400" : "text-primary"}`}>{s.lr}</span>
                {s.lrNote && <span className="text-muted-foreground">{s.lrNote}</span>}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
