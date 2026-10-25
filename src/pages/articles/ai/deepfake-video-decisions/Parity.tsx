import { CitationBlock } from "@/components/ui/citation";
import ParityReceiptViz from "./viz/ParityReceiptViz";

export default function Parity() {
  return (
    <section id="parity" data-teach-level="6" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">모델을 비교하기 전에 입력과 판정 조건부터 맞춥니다</h2>
      <ParityReceiptViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          공간 모델과 시간 모델을 비교하면서 한쪽만 더 많은 프레임이나 다른 얼굴 crop을
          보면 결과 차이에 두 원인이 섞입니다. 같은 원본 묶음, 열 개 시각, 유효 crop 여섯
          개, 입력 크기와 집계 규칙을 먼저 맞춰야 모델 구조의 차이를 읽을 수 있습니다.
        </p>
        <p>
          보정 함수는 모델 출력 분포가 다르므로 각 모델에 따로 맞춥니다. 다만 같은 검증
          split과 같은 보정 방법을 사용합니다. 지연과 메모리도 같은 장비에서 재고,
          오류율과 함께 coverage를 공개해야 한 후보가 어려운 입력을 더 많이 버려서 좋아
          보이는 일을 막을 수 있습니다.
        </p>
      </div>
      <div id="paper-deepfakebench" className="not-prose mt-8 scroll-mt-24">
        <CitationBlock
          type="paper"
          citeKey={1}
          source="DeepfakeBench · NeurIPS 2023"
          href="https://papers.nips.cc/paper_files/paper/2023/hash/0e735e4b4f07de483cbe250130992726-Abstract-Datasets_and_Benchmarks.html"
        >
          <div className="space-y-2 text-sm leading-6">
            <p><strong>확인한 문제.</strong> 서로 다른 전처리 입력·실험 설정·평가 방식은 탐지기 비교를 불공정하게 만들 수 있습니다.</p>
            <p><strong>공식 기여.</strong> 논문은 통일된 자료 관리, 탐지기 구현 틀, 평가 지표와 절차를 제시합니다.</p>
            <p><strong>이 글에 적용한 부분.</strong> 두 후보에 같은 source split·입력 영수증·frame budget·평가 절차를 주어야 한다는 비교 경계에 사용했습니다.</p>
            <p><strong>확대하지 않은 부분.</strong> 본문의 상위 두 개 평균·보정값·coverage 문턱은 논문의 측정 결과가 아니라 판정 계약을 설명하기 위한 가정입니다.</p>
          </div>
        </CitationBlock>
      </div>
    </section>
  );
}
