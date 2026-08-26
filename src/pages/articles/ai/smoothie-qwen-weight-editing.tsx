import SmoothieQwen from "./smoothie-qwen-weight-editing/SmoothieQwen";
import ContentBoundary from "@/components/articles/content-boundary";

export default function SmoothieQwenWeightEditingArticle() {
  return (
    <div className="space-y-12">
      <header id="overview" className="scroll-mt-20">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글은 다국어 출력 문제 전체가 아니라 <strong>학습이 끝난 Qwen의
            출력층을 다시 학습하지 않고 수정하는 한 방법</strong>만 검증합니다.
            Unicode·tokenizer로 만든 risk가 실제 언어 판정기는 아니라는 경계를
            먼저 세우고, scale 함수·logit 변화·softmax의 상대 효과를 거쳐 원본과
            변환본을 같은 prompt로 비교합니다.
          </p>
          <p>
            진단·prompt·runtime guard·배포 선택의 상위 흐름은
            <a href="/ai/qwen-korean-consistency"> Qwen 한국어 일관성 글</a>이
            소유합니다. 여기서는 weight artifact와 정상 번역 회귀를 포함한
            변환 검증에만 집중합니다.
          </p>
        </div>
        <ContentBoundary article="smoothie-qwen-weight-editing" />
      </header>
      <SmoothieQwen />
    </div>
  );
}
