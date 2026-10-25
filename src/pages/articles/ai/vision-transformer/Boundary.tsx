import { Link } from "react-router-dom";
import { VisionTransformerMapReturn } from "./VisionTransformerLocator";

export default function Boundary() {
  return (
    <section id="boundary" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">여기서 확정한 것</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ViT는 image를 그대로 읽지 않습니다. Patch 크기가 공간을 몇 개의 token으로
          나눌지 정하고, shared projection이 각 patch를 D차원으로 바꾸며, position과
          special token이 sequence의 의미를 완성합니다. 이 계약이 달라지면 입력 shape,
          attention 비용, checkpoint 호환성도 함께 달라집니다.
        </p>
        <p>
          이 설명만으로 우리 환경에 쓸 backbone을 고르거나 배포를 승인할 수는 없습니다.
          품질·latency·memory를 같은 조건에서 재는 일은 <Link to="/cs/ai/vision-backbone-selection">백본 선택 실무 글</Link>,
          weight와 preprocessing·출력을 함께 검증하는 일은 <Link to="/cs/ai/transfer-learning-practice">checkpoint 인계 실무 글</Link>에서 이어집니다.
        </p>

        <h3 id="self-check" className="scroll-mt-24">확인 질문</h3>
        <ol>
          <li>224×224 image를 16×16 patch로 나누면 왜 196개가 됩니까? (답: Patch sequence)</li>
          <li><code>Conv2d(kernel=16, stride=16)</code>이 patch projection과 같은 계산을 하는 조건은 무엇입니까? (답: Patch sequence)</li>
          <li>DeiT·Swin·MAE는 기본 ViT의 어떤 서로 다른 병목을 바꿉니까? (답: 세 가지 분기)</li>
        </ol>
      </div>
      <VisionTransformerMapReturn />
    </section>
  );
}
