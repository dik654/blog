import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "자식 체인 요청",
  "로컬 실행",
  "체크포인트 생성",
  "투표력 정족수",
  "릴레이어 제출",
  "부모 체인 포함",
  "Bob에게 반영",
] as const;

const SCENES = [
  {
    title:
      "Alice가 자식 서브넷 C에서 부모 체인 P의 Bob에게 토큰 반환을 요청합니다",
    detail:
      "이 요청은 자식 체인과 부모 체인의 상태를 한 번에 바꾸지 않습니다. 먼저 출발지·목적지 경로와 메시지 nonce를 고정합니다.",
    owner: "child gateway",
    receipt: "아직 없음",
    next: "child block 실행",
    status: "제출됨",
  },
  {
    title:
      "자식 체인 합의가 반환 요청을 실행하고 bottom-up 메시지를 큐에 넣습니다",
    detail:
      "로컬 성공은 출발 서브넷에서 처리가 끝났다는 뜻입니다. 부모 체인에 있는 Bob의 잔액까지 바뀌었다는 뜻은 아닙니다.",
    owner: "자식 체인 합의",
    receipt: "L · 로컬 영수증",
    next: "체크포인트에 메시지 결속",
    status: "출발지 완료",
  },
  {
    title:
      "자식 체인의 높이와 상태 약속, 메시지 묶음을 체크포인트 하나로 묶습니다",
    detail:
      "서브넷 ID와 설정 개정 번호도 함께 묶어 다른 자식 체인이나 과거 검증자 집합의 서명을 재사용하지 못하게 합니다.",
    owner: "체크포인트 생성기",
    receipt: "체크포인트 후보",
    next: "현재 power table 서명",
    status: "quorum 전",
  },
  {
    title:
      "현재 구성원의 검증자 투표력이 기준을 넘으면 체크포인트가 확정됩니다",
    detail:
      "서명자 수가 아니라 투표력을 더합니다. 중복 서명자와 다른 구성 개정 번호의 서명은 제외합니다.",
    owner: "자식 체인 검증자",
    receipt: "Q · 정족수 영수증",
    next: "parent로 운반",
    status: "child checkpoint 확정",
  },
  {
    title:
      "릴레이어가 이미 확정된 체크포인트를 부모 체인의 트랜잭션으로 운반합니다",
    detail:
      "릴레이어는 정족수를 새로 만들지 않습니다. 가스 부족이나 릴레이어 정지는 Q를 지우지 않지만 부모 체인 도착을 늦춥니다.",
    owner: "릴레이어",
    receipt: "R · 제출 트랜잭션",
    next: "부모 체인 포함 확인",
    status: "운반 중",
  },
  {
    title:
      "부모 게이트웨이가 체크포인트를 포함하고 같은 높이의 중복 기록을 막습니다",
    detail:
      "트랜잭션을 전파했다고 끝난 것이 아닙니다. 부모 체인에서 필요한 확정 수준까지 정식 체인에 남았는지 확인해야 합니다.",
    owner: "부모 게이트웨이",
    receipt: "P · 부모 체인 영수증",
    next: "메시지 묶음 실행",
    status: "parent에 기록",
  },
  {
    title:
      "부모 체인이 같은 메시지를 한 번 실행해 Bob의 잔액 변화를 기록해야 완료됩니다",
    detail:
      "L·Q·R·P가 있어도 목적지 실행 D가 실패할 수 있습니다. 누락된 단계부터 다시 시도하되 이미 처리한 nonce는 중복 실행하지 않습니다.",
    owner: "목적지 실행기",
    receipt: "D · 목적지 영수증",
    next: "사용자에게 완료 표시",
    status: "L ∧ Q ∧ R ∧ P ∧ D",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.title} ${scene.detail} 이 단계의 소유자는 ${scene.owner}이고 상태는 ${scene.status}입니다.`,
);

function FlowNode({
  step,
  active,
  title,
  detail,
}: {
  step: number;
  active: number;
  title: string;
  detail: string;
}) {
  const current = active === step;
  const complete = active > step;
  return (
    <div
      className={`min-w-0 border p-2 motion-safe:transition-colors motion-safe:duration-300 sm:p-3 ${
        current
          ? "border-primary bg-primary/10"
          : complete
            ? "border-foreground/30 bg-background"
            : "border-border bg-background text-muted-foreground"
      }`}
    >
      <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
        <span
          className={`grid size-5 shrink-0 place-items-center border font-mono text-[9px] font-black ${
            current
              ? "border-primary bg-primary text-primary-foreground"
              : complete
                ? "border-foreground/40"
                : "border-border"
          }`}
        >
          {complete ? "✓" : step + 1}
        </span>
        <p className="break-keep text-[8px] font-black leading-3 sm:text-xs sm:leading-4">
          {title}
        </p>
      </div>
      <p className="mt-2 hidden break-keep font-mono text-[9px] leading-4 opacity-80 sm:block">
        {detail}
      </p>
    </div>
  );
}

export function IpcFinalityViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8200, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="자식 체인 C → 부모 체인 P · Alice의 반환 요청 → Bob"
      title="자식 체인에서 성공한 요청이 부모 체인의 Bob에게 반영되기까지 다섯 영수증이 필요합니다"
      description="로컬 실행, 체크포인트, 투표력 정족수, 릴레이어 제출, 부모 체인 포함과 목적지 실행을 bottom-up 메시지 하나로 추적합니다."
      note="Top-down은 반대 방향으로 단순 재생하는 과정이 아닙니다. 자식 체인의 검증자들이 부모 체인의 최종성에 합의한 뒤 부모 큐와 투표력 변경을 자식 체인에 적용합니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="IPC bottom-up message 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-3 sm:space-y-4">
          <div data-viz-scene-stage className="space-y-3 sm:space-y-4">
            <div className="hidden grid-cols-7 gap-1.5 sm:grid">
              {LABELS.map((label, index) => (
                <div
                  key={label}
                  className={`border px-1 py-2 text-center text-[9px] font-black ${
                    index === scenes.active
                      ? "border-primary bg-primary/10"
                      : index < scenes.active
                        ? "border-foreground/30 bg-background"
                        : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {index + 1}. {label}
                </div>
              ))}
            </div>

            <div className="border border-border bg-muted/10 p-3 sm:p-4">
              <p className="mb-2 text-[9px] font-black text-primary">
                부모 체인 P · 체크포인트 기록과 목적지 반영
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <FlowNode
                  step={5}
                  active={scenes.active}
                  title="부모 게이트웨이"
                  detail="P · 정식 체인 체크포인트 영수증"
                />
                <FlowNode
                  step={6}
                  active={scenes.active}
                  title="Bob의 잔액 반영"
                  detail="D · 같은 nonce를 한 번만 실행"
                />
              </div>

              <div className="grid grid-cols-[1fr_minmax(7rem,0.7fr)_1fr] items-center gap-2 py-3 text-center">
                <p className="text-[9px] font-black text-muted-foreground">
                  ↑ bottom-up 체크포인트
                </p>
                <FlowNode
                  step={4}
                  active={scenes.active}
                  title="릴레이어"
                  detail="R · 부모 체인 트랜잭션 제출"
                />
                <p className="text-[9px] font-black text-muted-foreground">
                  정족수를 만들지 않음
                </p>
              </div>

              <p className="mb-2 text-[9px] font-black text-primary">
                자식 체인 C · 로컬 실행과 체크포인트 형성
              </p>
              <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
                <FlowNode
                  step={0}
                  active={scenes.active}
                  title="Alice 요청"
                  detail="경로 · nonce · 값"
                />
                <FlowNode
                  step={1}
                  active={scenes.active}
                  title="로컬 실행"
                  detail="L · 출발지 상태와 큐"
                />
                <FlowNode
                  step={2}
                  active={scenes.active}
                  title="체크포인트"
                  detail="상태 · 메시지 · 활동"
                />
                <FlowNode
                  step={3}
                  active={scenes.active}
                  title="투표력 정족수"
                  detail="Q · 현재 구성 개정 번호"
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-px border border-border bg-border p-px sm:grid-cols-[0.8fr_auto_1fr_auto_1fr] sm:items-center">
                <p className="bg-background p-2 text-center text-[9px] font-black">
                  부모 체인 최종성
                  <span className="block font-mono font-medium text-muted-foreground">
                    높이 · 해시
                  </span>
                </p>
                <span className="hidden bg-background px-1 text-muted-foreground sm:block">
                  →
                </span>
                <p className="bg-background p-2 text-center text-[9px] font-black">
                  자식 체인 합의
                  <span className="block font-mono font-medium text-muted-foreground">
                    제안 · 투표
                  </span>
                </p>
                <span className="hidden bg-background px-1 text-muted-foreground sm:block">
                  →
                </span>
                <p className="bg-background p-2 text-center text-[9px] font-black">
                  Top-down 적용
                  <span className="block font-mono font-medium text-muted-foreground">
                    메시지 · 투표력 변경
                  </span>
                </p>
              </div>
              <p className="mt-2 text-center text-[9px] font-bold leading-4 text-muted-foreground">
                위의 top-down 경로는 bottom-up 애니메이션을 거꾸로 돌린 것이
                아닙니다.
              </p>
            </div>

            <div className="grid grid-cols-[minmax(0,1.45fr)_minmax(6.5rem,0.55fr)] gap-px bg-border p-px sm:grid-cols-[minmax(0,1.45fr)_minmax(13rem,0.55fr)]">
              <div className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">
                  지금 답할 질문 · {LABELS[scenes.active]}
                </p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">
                  {scene.title}
                </h4>
                <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">
                  {scene.detail}
                </p>
              </div>
              <div className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">
                  이 단계의 완료 상태
                </p>
                <p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">
                  {scene.status}
                </p>
                <p className="mt-4 break-keep text-[9px] leading-5 text-muted-foreground">
                  출발지 성공, 체크포인트 정족수와 목적지 반영은 서로 다른 완료
                  상태입니다.
                </p>
              </div>
            </div>

            <div className="hidden grid-cols-2 gap-2 sm:grid lg:grid-cols-4">
              {[
                ["현재 소유자", scene.owner],
                ["남은 단계", scene.next],
                ["영수증", scene.receipt],
                ["현재 상태", scene.status],
              ].map(([label, value], index) => (
                <article
                  key={label}
                  className={`min-w-0 border bg-background p-3 ${index === 3 ? "border-primary/60" : "border-border"}`}
                >
                  <p className="text-[9px] font-bold text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-2 break-keep font-mono text-[10px] font-black leading-5 sm:text-xs">
                    {value}
                  </p>
                </article>
              ))}
            </div>

            <div className="flex gap-1" aria-hidden="true">
              {LABELS.map((label, index) => (
                <span
                  key={label}
                  className={`h-1.5 flex-1 ${index <= scenes.active ? "bg-primary" : "bg-border"}`}
                />
              ))}
            </div>
          </div>

          <AnimatedSceneControls
            {...scenes}
            labels={LABELS}
            controlLabels={LABELS}
            playLabel="IPC bottom-up message 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
