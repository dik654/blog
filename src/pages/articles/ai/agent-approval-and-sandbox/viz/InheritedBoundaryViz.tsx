import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import VizFrame from "@/components/viz/VizFrame";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

/**
 * 본문 대응: why-two 절. 승인 화면에는 npm test 한 줄만 보이고, 실제 효과는 자식 프로세스에서 생긴다.
 * 벽은 자식에게 상속되므로 이름을 몰라도 연결 시도에서 막는다. 프로세스 이름과 주소는 가정이며,
 * 203.0.113.7은 문서용 예약 주소다.
 */
const TREE = [
  { depth: 0, name: "npm test", act: "테스트 시작" },
  { depth: 1, name: "node (테스트 실행기)", act: "src/auth.ts 검사" },
  { depth: 2, name: "node (의존성의 보고 스크립트)", act: ".env 읽기" },
  { depth: 3, name: "connect(203.0.113.7:443)", act: "외부 전송 시도" },
] as const;

const SCENES = [
  { label: "심사가 보는 것", visible: 1, walled: false, result: "허용 목록과 일치: 실행" },
  { label: "실제로 생기는 일", visible: 4, walled: false, result: "연결 성공: .env 내용이 나감" },
  { label: "벽 안에서 실행", visible: 4, walled: true, result: "연결 실패: 테스트 판정은 그대로" },
] as const;

const NOTES = [
  "심사가 받는 입력은 명령 문자열입니다. 이 한 줄에는 자식 프로세스도 연결 시도도 적혀 있지 않습니다.",
  "운영체제 입장에서는 프로세스 네 층이 차례로 일합니다. 전송은 맨 아래에서 일어나고, 그때 심사는 이미 끝났습니다.",
  "자식 프로세스는 부모의 제한을 물려받습니다. 벽은 스크립트 이름을 몰라도 네트워크로 나가는 호출에서 실패를 돌려줍니다.",
] as const;

function Scene({ index }: { index: number }) {
  const s = SCENES[index];
  const blockedDepth = s.walled ? 3 : -1;
  return (
    <div>
      <div className={`border p-3 ${s.walled ? "border-dashed border-primary" : "border-border"}`}>
        <p className="mb-2 text-xs font-bold text-muted-foreground">{s.walled ? "제한이 걸린 프로세스 묶음" : "제한 없는 프로세스 묶음"}</p>
        <ul className="grid gap-2">
          {TREE.map((node, i) => {
            const shown = i < s.visible;
            const blocked = node.depth === blockedDepth;
            const reached = !s.walled && index === 1 && i === 3;
            return (
              <li
                key={node.name}
                style={{ marginLeft: `${node.depth * 0.75}rem` }}
                className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border px-2 py-1.5 text-xs ${
                  !shown
                    ? "border-dashed border-border text-transparent"
                    : blocked
                      ? "border-primary bg-primary/5 text-foreground"
                      : reached
                        ? "border-[#b45309] bg-[#b45309]/10 text-foreground"
                        : "border-border bg-background text-foreground"
                }`}
              >
                <code className="min-w-0 break-words">{node.name}</code>
                <span className={shown ? "text-muted-foreground" : "text-transparent"}>{node.act}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="mt-3 text-sm font-bold text-foreground">{s.result}</p>
    </div>
  );
}

export default function InheritedBoundaryViz() {
  const scene = useAnimatedScenes(SCENES.length, 4200);
  const labels = SCENES.map((s) => s.label);
  return (
    <VizFrame
      eyebrow="문자열과 실제 효과"
      title="허락은 첫 줄에 내리고 효과는 맨 아래 자식 프로세스에서 생깁니다"
      description="프로세스 구성과 주소는 설명을 위한 가정입니다."
      note="벽이 자식까지 적용된다는 점은 Codex와 Claude Code 공식 문서가 밝힌 동작입니다. 실패 메시지는 구현과 운영체제마다 다릅니다."
    >
      <div
        id={scene.playbackId}
        role="group"
        tabIndex={0}
        onKeyDown={scene.onKeyDown}
        aria-label="승인 화면의 명령 문자열과 실제 프로세스 트리의 차이"
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
