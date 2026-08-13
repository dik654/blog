import { Link } from "react-router-dom";
import VectorMeasurementViz from "./viz/VectorMeasurementViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        여러 숫자를 한 방향으로 읽으면 AI 수식이 덜 추상적이다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          키 170cm처럼 숫자 하나만 있으면 <strong>scalar</strong>라고 부릅니다.
          반면 어떤 사람을 키·몸무게·나이라는 세 숫자로 나타내면 <strong>vector</strong>가
          됩니다. AI가 이미지를 pixel 수천 개, 문서를 embedding 수백 개로 바꾸는
          순간에도 하는 일은 같습니다. 서로 관련된 여러 좌표를 순서가 있는 한
          대상으로 묶는 것입니다.
        </p>
        <p>
          좌표를 묶은 뒤에는 세 질문이 반복됩니다. 이 vector는 얼마나 큰가, 두
          vector는 같은 방향을 향하는가, 한 vector가 다른 방향을 얼마나 포함하는가입니다.
          각각 norm, dot product, projection이 답합니다. 이 세 계산을 알면 퍼셉트론의
          score와 margin뿐 아니라 cosine similarity와 attention score도 같은 언어로
          읽을 수 있습니다.
        </p>
      </div>

      <VectorMeasurementViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>이 글에서 다루지 않는 것</h3>
        <p>
          이 글은 matrix 전체와 linear transformation, basis change를 한꺼번에 다루지
          않습니다. 먼저 vector 하나의 길이와 두 vector 사이의 관계를 계산할 수 있게
          만드는 것이 목표입니다. 이후 신경망의 matrix multiplication은
          <Link to="/ai/neural-network#forward">신경망의 tensor shape 설명</Link>에서
          확장합니다.
        </p>
      </div>
    </section>
  );
}
