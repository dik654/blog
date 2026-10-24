import { Link } from "react-router-dom";

const STEPS = [
  {
    id: "contract",
    label: "허용 변화",
    track: "개념",
    detail: "입력 변화와 정답 갱신을 하나의 변환 계약으로 정의합니다.",
    href: "/cs/ai/data-augmentation",
  },
  {
    id: "image",
    label: "영상 좌표",
    track: "실무",
    detail:
      "잘라 내기·이동·색 변화가 상자·마스크·화소 값에 미치는 영향을 추적합니다.",
    href: "/cs/ai/image-augmentation-transforms",
  },
  {
    id: "mixing",
    label: "표본 조합",
    track: "실무",
    detail:
      "여러 입력을 섞은 비율과 위치에 맞춰 분류·검출 정답을 다시 만듭니다.",
    href: "/cs/ai/mixup-cutmix",
  },
  {
    id: "tabular",
    label: "표 합성",
    track: "실무",
    detail:
      "열 범위뿐 아니라 행 관계·시간 순서·자료 분리 경계를 함께 검사합니다.",
    href: "/cs/ai/tabular-data-synthesis",
  },
  {
    id: "evaluation",
    label: "정책 평가",
    track: "실무",
    detail:
      "원본 성능·변형 강건성·추론 비용을 나눠 측정하고 배포 여부를 결정합니다.",
    href: "/cs/ai/augmentation-evaluation",
  },
] as const;

export type DataAugmentationPracticeStep = (typeof STEPS)[number]["id"];

const QUESTIONS: Record<DataAugmentationPracticeStep, string> = {
  contract:
    "입력을 바꿀 때 정답이 그대로인지, 함께 바뀌어야 하는지는 어떻게 결정합니까?",
  image:
    "화면의 위치와 색을 바꾸면 상자·마스크·화소 값은 어떤 순서로 갱신합니까?",
  mixing:
    "여러 표본을 한 입력으로 합치면 정답의 비율과 좌표를 어떻게 다시 계산합니까?",
  tabular:
    "각 열의 값은 정상인데 행 전체가 불가능한 합성 자료를 어떻게 걸러냅니까?",
  evaluation:
    "학습 자료를 바꾼 결과가 실제 품질 개선인지 어떤 기준으로 판단합니까?",
};

const FINDINGS: Record<DataAugmentationPracticeStep, string> = {
  contract:
    "자료 증강은 파일 수를 늘리는 작업이 아니라, 배포 환경에서 허용할 변화와 그 변화에 맞는 정답 변환을 정의하는 일입니다.",
  image:
    "위치 변화는 같은 변환값으로 공간 정답을 옮긴 뒤 화면 밖 영역을 잘라야 합니다. 색 변화는 좌표를 옮기지 않지만 정답 단서를 없애지 않는 범위인지 따로 검증해야 합니다.",
  mixing:
    "입력을 섞은 기록이 정답의 근거가 됩니다. Mixup은 같은 혼합 비율을, CutMix는 실제로 남은 면적을, Mosaic은 각 조각의 크기·이동·잘림을 정답에 반영해야 합니다.",
  tabular:
    "합성 행은 열별 자료형만 맞아서는 부족합니다. 학습 자료 안에서만 생성 규칙을 맞추고, 열 사이 관계와 시간 순서를 통과한 뒤 유용성과 정보 노출 위험을 따로 평가해야 합니다.",
  evaluation:
    "증강 정책은 이름이 아니라 범위·확률·순서·난수값·정답 변환 버전을 포함한 실행 산출물입니다. 같은 조건의 기준 모델과 비교해 원본 품질, 강건성, 보정, 지연 시간을 각각 통과해야 배포할 수 있습니다.",
};

export function DataAugmentationPracticeLocator({
  current,
}: {
  current: DataAugmentationPracticeStep;
}) {
  const currentStep = STEPS.find((step) => step.id === current)!;

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="자료 증강 개념과 실무에서 현재 글의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/data-augmentation" className="hover:text-primary">
          자료 증강
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          {currentStep.label}
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            {currentStep.track}
          </span>
          <p className="mt-3 break-keep text-base font-bold leading-7">
            {QUESTIONS[current]}
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">
            직속 부모 개념
          </p>
          <Link
            to="/cs/ai/data-augmentation#target-map"
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            입력 변환과 정답 변환을 같은 기록으로 묶기 ↗
          </Link>
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5"
        aria-label="자료 증강을 이해하고 적용하는 다섯 단계"
      >
        {STEPS.map((step, index) => (
          <Link
            key={step.id}
            to={step.href}
            aria-current={step.id === current ? "step" : undefined}
            className={`min-w-0 bg-background px-3 py-3 ${step.id === current ? "text-foreground" : "text-muted-foreground hover:text-primary"}`}
          >
            <span className="font-mono text-[9px] font-black text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <strong className="mt-1 block break-keep text-xs leading-5">
              {step.label}
            </strong>
            <span className="mt-1 hidden break-keep text-[10px] leading-4 md:block">
              {step.detail}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function DataAugmentationPracticeMapReturn({
  current,
}: {
  current: DataAugmentationPracticeStep;
}) {
  const position = STEPS.findIndex((step) => step.id === current);
  const next = STEPS[position + 1];

  return (
    <aside
      id="data-augmentation-practice-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 자료 증강 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">
        부모 지도에 되돌려 놓기
      </p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        {FINDINGS[current]}
      </p>
      <Link
        to={next?.href ?? "/cs/ai/imbalanced-data"}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {next
          ? `다음 단계 · ${next.label} →`
          : "다음 묶음 · 불균형 자료로 이동 →"}
      </Link>
    </aside>
  );
}
