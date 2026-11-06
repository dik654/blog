import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import VizFrame from "@/components/viz/VizFrame";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

/**
 * 본문 대응: small-case 절. 가정한 명령 5개를 네 설정에 통과시켜 피해 건수와 사람에게 물은 횟수를 센다.
 * 숫자는 본문·연습문제와 같다: 피해 3→1→1→0, 물음 0→2→0→1.
 */
const COMMANDS = [
  { code: 'rg "401" src', effect: "읽기" },
  { code: "sed -i ... src/auth.ts", effect: "의도한 수정" },
  { code: "npm test", effect: "외부 전송 숨음" },
  { code: "rm -rf src", effect: "작업 폴더 삭제" },
  { code: "echo ... >> ~/.bashrc", effect: "폴더 밖 쓰기" },
] as const;

type Outcome = { text: string; harm: boolean; stopped: boolean };

const ran: Outcome = { text: "실행", harm: false, stopped: false };
const harm = (text: string): Outcome => ({ text, harm: true, stopped: false });
const stop = (text: string): Outcome => ({ text, harm: false, stopped: true });

const SCENES: readonly { label: string; rows: readonly Outcome[]; asks: number }[] = [
  { label: "막는 것 없음", asks: 0, rows: [ran, ran, harm("실행, 전송됨"), harm("실행, 삭제됨"), harm("실행, 기록됨")] },
  { label: "실행 전 심사만", asks: 2, rows: [ran, ran, harm("통과, 전송됨"), stop("물음, 거부"), stop("물음, 거부")] },
  { label: "실행 중 벽만", asks: 0, rows: [ran, ran, stop("실행, 전송 실패"), harm("실행, 삭제됨"), stop("쓰기 실패")] },
  { label: "둘 다", asks: 1, rows: [ran, ran, stop("실행, 전송 실패"), stop("물음, 거부"), stop("쓰기 실패")] },
];

const NOTES = [
  "아무것도 막지 않으면 5개가 모두 실행되고 피해가 3건 남습니다.",
  "세 명령을 허용 목록에 넣고 나머지만 묻습니다. 물음 2번으로 두 건은 막지만 npm test 안쪽의 전송은 이름만 봐서는 보이지 않습니다.",
  "작업 폴더 밖 쓰기와 네트워크를 닫고 묻지 않습니다. 두 건은 저절로 실패하지만 폴더 안의 삭제는 허용 범위라 그대로 실행됩니다.",
  "벽에 삭제 물음 규칙을 하나 더합니다. 피해는 0건이고, 물음은 심사만 쓸 때의 2번에서 1번으로 줄어듭니다.",
] as const;

function Row({ code, effect, outcome }: { code: string; effect: string; outcome: Outcome }) {
  const tone = outcome.harm
    ? "border-[#b45309] bg-[#b45309]/10 text-foreground"
    : outcome.stopped
      ? "border-primary/60 bg-primary/5 text-foreground"
      : "border-border bg-background text-muted-foreground";
  const mark = outcome.harm ? "피해" : outcome.stopped ? "막음" : "정상";
  return (
    <div className="grid gap-1 border-b border-border py-2 last:border-b-0 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.2fr)] sm:items-center sm:gap-3">
      <code className="min-w-0 break-words text-xs text-foreground">{code}</code>
      <span className="text-xs text-muted-foreground">{effect}</span>
      <span className={`flex items-center justify-between gap-2 border px-2 py-1 text-xs ${tone}`}>
        <span>{outcome.text}</span>
        <span className="shrink-0 font-bold">{mark}</span>
      </span>
    </div>
  );
}

function Scene({ index }: { index: number }) {
  const s = SCENES[index];
  const harmCount = s.rows.filter((row) => row.harm).length;
  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_7.5rem] sm:items-start">
      <div>
        {COMMANDS.map((command, i) => (
          <Row key={command.code} code={command.code} effect={command.effect} outcome={s.rows[i]} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
        <div className="border-l-2 border-[#b45309] pl-3">
          <p className="text-xs text-muted-foreground">남은 피해</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-foreground">{harmCount}건</p>
        </div>
        <div className="border-l-2 border-primary pl-3">
          <p className="text-xs text-muted-foreground">사람에게 물음</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-foreground">{s.asks}번</p>
        </div>
      </div>
    </div>
  );
}

export default function GateMatrixViz() {
  const scene = useAnimatedScenes(SCENES.length, 4200);
  const labels = SCENES.map((s) => s.label);
  return (
    <VizFrame
      eyebrow="명령 5개, 설정 4개"
      title="같은 명령을 어떤 관문에 통과시키느냐로 남는 피해가 달라집니다"
      description="명령과 숨은 효과는 설명을 위해 정한 사례입니다(가정). 물은 명령은 사람이 모두 거부한다고 둡니다."
      note="피해 건수는 이 다섯 명령 안에서 센 값이며 실제 사고율이 아닙니다."
    >
      <div
        id={scene.playbackId}
        role="group"
        tabIndex={0}
        onKeyDown={scene.onKeyDown}
        aria-label="명령 다섯 개를 네 가지 설정에 통과시킨 결과"
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scene.active}
          scenes={SCENES.map((s, index) => (
            <div key={s.label} className="pb-3">
              <p className="mb-2 text-sm font-bold text-foreground">{s.label}</p>
              <Scene index={index} />
              <p className="mt-3 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{NOTES[index]}</p>
            </div>
          ))}
        />
        <AnimatedSceneControls {...scene} labels={labels} />
        <StaticSceneList labels={labels} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
