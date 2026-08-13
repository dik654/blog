import ContentBoundary from "@/components/articles/content-boundary";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        지식 증류는 큰 모델을 복사하는 일이 아니라, teacher가 만든 어떤 신호를 student의 학습 목표로 바꿀지 정하는 일입니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          분류 모델이 고양이를 맞혔다는 정답 label은 다른 class를 얼마나 헷갈렸는지 알려 주지 않습니다. 반면 teacher의 probability가 고양이 .7, 여우 .2, 자동차 .1이라면 고양이와 여우가 더 비슷하다는 상대 관계도 training signal이 됩니다. Knowledge distillation은 이런 output distribution, 중간 feature 또는 teacher가 생성한 sequence를 student의 loss에 넣는 학습 방법입니다.
        </p>
        <p>
          “지식”은 model weight가 통째로 이동한다는 뜻이 아닙니다. Student는 teacher가 관측한 input에서 내놓은 제한된 신호를 모방하며, teacher의 오류·bias·calibration 문제도 함께 배울 수 있습니다. 따라서 teacher가 크다는 이유만으로 선택하지 않고 target domain과 slice에서 teacher가 hard-label baseline보다 어떤 추가 정보를 주는지 먼저 확인해야 합니다.
        </p>
        <p>
          시작점은 배포할 student의 architecture·tokenizer·latency·memory budget입니다. 그다음 두 모델이 공유하는 interface에 따라 class logits, mapped feature, token distribution 또는 generated sequence 중 전달 가능한 신호를 고릅니다. LLM에서는 신호의 종류만큼 그 sequence를 누가 생성했는지도 중요합니다. 이 글은 logit distillation에서 시작해 feature와 teacher sequence를 살펴본 뒤, student가 실제로 방문한 prefix에서 배우는 on-policy distillation과 self-distillation 순으로 범위를 넓힙니다.
        </p>
      </div>
      <ContentBoundary article="knowledge-distillation" />
      <div className="not-prose my-8">
        <OverviewViz />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Distillation loss가 낮아졌다는 사실은 teacher와 가까워졌다는 뜻일 뿐, 정답이나 배포 목표에 가까워졌다는 뜻은 아닙니다. 그래서 ground-truth loss를 anchor로 남기고, teacher agreement와 독립 test quality, student-only runtime을 서로 다른 열에 기록합니다.
        </p>
      </div>
    </section>
  );
}
