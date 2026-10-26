import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import PracticeWorkflowViz from "./viz/PracticeWorkflowViz";

export default function OperationsOverview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold">
        Adapter를 저장했다는 사실만으로 같은 학습과 배포를 재현할 수는 없습니다
      </h2>
      <p className="mb-4 max-w-3xl text-sm leading-6 text-muted-foreground">
        데이터가 token으로 바뀌는 순간부터 재개 checkpoint와 최종 serving artifact가 갈라지는 지점까지 한 실행을 따라갑니다.
      </p>
      <PracticeWorkflowViz />
      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          같은 adapter를 다시 만들려면 입력 데이터의 직렬화와 loss mask가 같아야 합니다. 학습이 중단됐다면 weight뿐 아니라 optimizer·scheduler·난수·data position도 이어져야 합니다. 배포할 때는 정확한 base와 tokenizer 위에서 adapter를 불러오고, merge나 requantization 뒤의 출력까지 다시 확인해야 합니다.
        </p>
        <p>
          이 글은 이런 상태를 누가 저장하고 무엇으로 완료를 확인할지 다룹니다. 저랭크 행렬이 왜 parameter를 줄이는지와 QLoRA가 어떤 값을 4-bit로 보관하는지는 <Link to="/cs/ai/lora-finetuning">LoRA·QLoRA 개념 글</Link>에서 먼저 확인할 수 있습니다.
        </p>
        <p>
          한 base에 여러 adapter를 동시에 올려 요청별로 바꾸는 문제는 별도의 <Link to="/cs/ai/multi-adapter-serving">Multi-adapter serving</Link> 글로 이어집니다. 여기서는 adapter 하나를 학습하고 배포 후보로 확정하는 지점까지만 닫습니다.
        </p>
      </div>
      <ContentBoundary article="lora-training-and-release" />
    </section>
  );
}
