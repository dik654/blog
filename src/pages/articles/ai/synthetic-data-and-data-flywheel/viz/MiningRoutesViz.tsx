import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #trajectory-mining — 채점 결과의 갈래, hard-example 우선순위, Arena 승패, 재투입 여부의 차이.
 * 수집량 숫자는 글에 없어 칸 수나 막대 길이로 그리지 않습니다.
 */
const SCENES = [
  { label: "채점 결과는 두 갈래로 갑니다", summary: "성공 → target · 실패 → 보존", note: "SFT는 모범 답을 따라 하도록 학습하는 지도 미세조정입니다. 실패는 그대로 target으로 쓸 수 없어 중간 단계까지 남겨 어디서 갈렸는지 분석하거나 다음 학습 신호로 재활용할 수 있게 둡니다."},
  { label: "hard-example은 낮은 쪽을 먼저", summary: "신호: 낮은 pass rate", note: "이미 계산한 pass rate를 다시 씁니다. 낮은 문제를 더 많이 수집하며, 글의 예는 37.5% 이하 문제만 seed 후보로 올리는 방식입니다."},
  { label: "Arena Learning은 승패로 고릅니다", summary: "진 사례 → 다음 학습", note: "WizardArena 파이프라인의 방식입니다. 대상 model이 진 사례에서 약점을 드러내는 데이터만 골라 다음 라운드에 재사용합니다."},
  { label: "무엇을 되돌리느냐가 방향을 정합니다", summary: "성공만 vs 실패도", note: "성공만 쌓으면 이미 잘 푸는 문제의 정답 패턴만 늘어납니다. 실패와 hard-example이 seed로 들어가야 학습 데이터의 난이도 분포 자체가 바뀝니다."},
] as const;

function Route({ from, to, on = false }: { from: ReactNode; to: ReactNode; on?: boolean }) {
  return (
    <div className={`grid min-w-0 rounded-lg border px-3 py-1.5 text-xs leading-5 sm:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)] sm:gap-2 sm:py-2 ${on ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
      <span className="text-muted-foreground">{from}</span>
      <span aria-hidden="true" className="hidden text-center text-primary sm:inline">→</span>
      <span><span aria-hidden="true" className="text-primary sm:hidden">↳ </span>{to}</span>
    </div>
  );
}

export default function MiningRoutesViz() {
  return (
    <SceneShell
      eyebrow="Trajectory mining"
      title="채점이 끝난 output은 어디로 가고, 그 선택이 다음 라운드를 어떻게 바꾸나"
      description="trajectory와 trace는 모델이 답에 이르기까지 거친 추론 단계 전체입니다."
      ariaLabel="성공과 실패 trajectory의 갈래, hard-example 우선순위, Arena 승패, 재투입에 따른 방향 차이"
      scenes={SCENES}
      render={(index) => (
        <div className="min-w-0 space-y-3">
          {index === 0 && (
            <>
              <Route from="verifier 통과 trace" to={<><strong>success trajectory</strong> → SFT target</>} on />
              <Route from="verifier·judge 실패 output" to={<><strong>failure trajectory</strong> → 중간 단계까지 보존</>} on />
            </>
          )}
          {index === 1 && (
            <>
              <Route from={<>pass rate 100% <span className="font-mono">(8/8)</span></>} to="이미 쉬운 문제, 우선순위 아님" />
              <Route from={<>pass rate 37.5% <span className="font-mono">(3/8)</span></>} to={<><strong>우선 수집</strong> → 다음 라운드 seed 후보</>} on />
            </>
          )}
          {index === 2 && (
            <>
              <p className="text-center text-xs font-semibold">같은 질문에 여러 model이 답함 → 승패 판정</p>
              <Route from="대상 model이 이김" to="골라 쓰지 않음" />
              <Route from="대상 model이 짐" to={<><strong>약점을 드러내는 데이터만</strong> → 다음 SFT·RL 라운드</>} on />
            </>
          )}
          {index === 3 && (
            <>
              <Route from="다음 seed = 성공만" to="이미 잘 푸는 영역만 강화" />
              <Route from="다음 seed = 실패·hard-example 포함" to={<><strong>못 푸는 문제 쪽으로</strong> 생성이 다시 향함</>} on />
            </>
          )}
        </div>
      )}
    />
  );
}
