import { Link } from "react-router-dom";
import ChangeReadingViz from "./viz/ChangeReadingViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">미분은 어려운 기호가 아니라 변화의 환율이다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          자동차가 1초 동안 3m 더 움직였다면 평균 속도는 초당 3m입니다. 신경망에서도
          같은 질문을 던집니다. Weight를 아주 조금 바꿨을 때 loss가 얼마나 바뀌는지를
          재면, loss를 줄이려면 weight를 어느 방향으로 움직여야 하는지 알 수 있습니다.
          이때 입력의 작은 변화와 출력의 작은 변화 사이의 비율이 <strong>derivative</strong>입니다.
        </p>
        <p>
          이 글은 함수, 극한, 미분, chain rule, 편미분과 gradient를 한 경로로 연결합니다.
          여러 좌표를 다루는 부분에서는 <Link to="/ai/math-vectors-inner-products#vectors">vector와
          dot product</Link>를 사용하지만, 미분을 이미 안다고 가정하지는 않습니다.
        </p>
      </div>
      <ChangeReadingViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>먼저 도달해야 할 질문</h3>
        <p>
          글을 읽은 뒤에는 <em>왜 h를 0에 가깝게 보내는지</em>, 여러 함수가 연결될 때
          derivative를 왜 곱하는지, gradient가 왜 가장 가파른 증가 방향인지, ReLU의 0처럼
          매끈하지 않은 점에서는 무엇을 하는지를 숫자로 설명할 수 있어야 합니다. 뒤의
          activation·backpropagation·optimizer 글은 이 답을 다시 복제하지 않고 여기로 연결합니다.
        </p>
      </div>
    </section>
  );
}
