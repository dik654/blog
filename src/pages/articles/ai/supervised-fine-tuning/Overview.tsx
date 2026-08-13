import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import SftBoundaryViz from "./viz/SftBoundaryViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">SFT는 새 지식을 넣는다는 한 문장보다 어떤 token을 정답으로 삼는지부터 봐야 한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">Pretrained language model은 다음 token distribution을 이미 학습했지만, 사용자의 요청에 답하는 형식과 품질 기준이 명시적으로 정해져 있지는 않습니다. Supervised fine-tuning(SFT)은 prompt와 원하는 response로 된 demonstration을 보여 주고, 선택한 target token의 likelihood를 높여 이 행동 pattern을 학습합니다.</p>
        <p className="leading-8">핵심은 model 구조가 아니라 data와 loss의 경계입니다. <Link to="/ai/transformer-architecture#output-head">Language-model policy</Link>가 next-token distribution을 내고, <Link to="/ai/cross-entropy#cross-entropy">cross-entropy NLL</Link>이 response token에 correction을 보냅니다. 어떤 role과 token을 loss에 넣는지, teacher forcing과 inference prefix가 어떻게 달라지는지, packed sample 사이가 서로 보이지 않는지를 결정해야 같은 “SFT”도 재현할 수 있습니다.</p>
      </div>
      <ContentBoundary article="supervised-fine-tuning" />
      <SftBoundaryViz />
    </section>
  );
}
