import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";

const stages = [
  ["Score", "누가 더 positive에 가까운가", "Ranking"],
  ["Probability", "0.8 중 실제 positive가 약 80%인가", "Calibration"],
  ["Decision", "어디부터 alert로 처리할까", "Threshold"],
  ["Outcome", "FP·FN이 얼마의 비용을 만들었나", "Operations"],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">불균형 문제의 핵심은 비율이 아니라 score를 어떤 결정으로 바꾸느냐입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          양성 비율이 5%인 dataset에서 모두 음성이라고 답하면 accuracy는 95%입니다.
          숫자는 높지만 양성을 한 건도 찾지 못했습니다. 그래서 먼저 model이 sample을
          올바른 순서로 세우는지, score가 probability로 믿을 만한지, 어느 threshold에서
          alert를 만들지, false positive와 false negative가 실제로 얼마의 비용을
          만드는지를 분리해야 합니다.
        </p>
        <p>
          Oversampling·SMOTE는 training distribution을 바꾸고, class weight·focal
          loss는 gradient 기여를 바꾸며, threshold는 학습이 끝난 score를 운영
          decision으로 바꿉니다. 같은 문제를 푸는 상위 호환 기법들이 아닙니다.
          Resampling은 <Link to="/ai/tabular-data-synthesis#split-local">tabular synthesis의 split-local 경계</Link>,
          probability loss는 <Link to="/ai/cross-entropy">likelihood·cross-entropy</Link>를
          재사용합니다.
        </p>
      </div>
      <ContentBoundary article="imbalanced-data" />
      <figure data-viz="imbalance-decision-stack" className="not-prose my-8 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
        <figcaption className="mb-5 text-sm font-semibold">한 model output을 네 층의 질문으로 나눕니다</figcaption>
        <div className="grid gap-4 md:grid-cols-4">
          {stages.map(([title, question, layer], index) => <div key={title} className="min-w-0 border-t border-primary/45 pt-4"><p className="text-xs font-bold text-primary/70">0{index+1} · {layer}</p><p className="mt-2 font-semibold">{title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{question}</p></div>)}
        </div>
      </figure>
    </section>
  );
}
