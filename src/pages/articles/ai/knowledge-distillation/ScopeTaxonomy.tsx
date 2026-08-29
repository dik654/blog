import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";

export default function ScopeTaxonomy() {
  return (
    <section id="distillation-scope" className="mb-16 scroll-mt-20 space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">04 · what to distill</p>
        <h2 className="mt-2 text-2xl font-bold">
          Distillation은 배포 task 하나가 아니라 여러 task의 능력까지
          겨냥할 수 있다
        </h2>
      </header>
      <p>
        지금까지는 teacher signal을 student에 어떻게(logit·feature) 전달할지를
        다뤘습니다. 이 절은 무엇을 전달할지, 곧 distillation의 목표 범위를
        다룹니다. 배포할 task 하나만 좁게 맞출지 여러 task에 걸친 일반 능력을
        맞출지에 따라 필요한 데이터와 평가 기준이 달라집니다.
      </p>
      <p>
        Task-specific distillation은 student가 배포할 task 하나에서만 teacher를
        따라가면 되므로 그 task의 held-out 정확도만으로 승인할 수 있습니다.
        감성분류 teacher 하나를 그 task로만 증류하면 다른 task 성능은 애초에
        목표가 아닙니다.
      </p>
      <p>
        Capability distillation은 teacher가 코딩·추론·대화처럼 여러 task에
        걸쳐 가진 일반 능력을 student에 옮기려 하므로, task 하나가 아니라
        benchmark suite 평균으로 검증해야 합니다.
      </p>
      <p>
        Teacher가 요약, 코드, 수학, 대화 네 benchmark 평균 62점을 낸다면,
        capability distillation의 student도 이 네 평균을 함께 봐야 하고
        그중 하나만 잘하는 student로는 대체되지 않습니다.
      </p>
      <TermBreakdown
        title="Task-specific distillation과 capability distillation의 차이"
        description="같은 teacher-student 관계라도 무엇을 옮기려 하는지에 따라 학습 데이터와 평가 기준이 달라집니다."
        items={[
          {
            term: "Task-specific distillation",
            description:
              "배포할 task 하나에서 teacher 행동을 재현하도록 좁게 학습합니다.",
            example:
              "감성분류 teacher 정확도 94%를 student가 92%까지 따라가면 그 task만으로 승인합니다.",
            boundary:
              "학습에 없던 새 task로는 일반화를 보장하지 않고, 그 task 안의 out-of-distribution 입력에도 취약할 수 있습니다.",
          },
          {
            term: "Capability distillation",
            description:
              "여러 task에 걸친 teacher의 일반 능력을 student가 폭넓게 재현하도록 학습합니다.",
            example:
              "요약·코드·수학·대화 네 benchmark 평균에서 teacher 62점과 student 점수 차이를 함께 봅니다.",
            boundary:
              "폭넓은 데이터가 필요해 학습 비용이 크고, task 하나만 놓고 보면 좁게 학습한 task-specific student보다 낮을 수 있습니다.",
          },
        ]}
      />
      <p>
        이 축은 teacher가 어떤 dataset으로 student 학습 데이터를 만드는지와도
        이어집니다. Teacher가 직접 만든 synthetic dataset으로 student를
        학습하는 문제는{" "}
        <Link to="/ai/synthetic-data-and-data-flywheel#generation-sources">
          synthetic data generation
        </Link>
        에서 다루며, 그 dataset이 어떤 task·capability를 겨냥해 만들어졌는지가
        바로 이 절의 scope 선택과 맞물립니다.
      </p>
    </section>
  );
}
