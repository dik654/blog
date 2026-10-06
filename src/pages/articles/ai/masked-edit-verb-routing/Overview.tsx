import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import VerbViz from "./viz/VerbViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">"편집"은 한 동작이 아니라 요구가 서로 다른 여섯 동작입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          마스크를 주고 그 안을 바꾸는 기능을 흔히 하나로 묶어 부릅니다. 그런데 "벨트를 빨갛게"와 "벨트를
          지워"와 "뺨에 흉터를 넣어"는 모델에게 전혀 다른 일을 요구합니다. 앞의 것은 있는 것의 속성만 바꾸라는
          말이고, 뒤의 것은 없던 것을 만들어 내라는 말입니다.
        </p>

        <p>동작 여섯 개와 설치된 모델 일곱 개를 같은 입력·마스크·prompt·seed로 고정해 돌렸습니다.</p>
        <p className="font-semibold">그림을 보기 전에 세 가지를 예측해 보세요.</p>
        <ol>
          <li>색 변경과 물건 교체는 둘 다 원래 형태를 보존해야 성공할까요?</li>
          <li>더하기와 지우기는 모델에 같은 방향의 생성을 요구할까요?</li>
          <li>이 실험에서 지우기는 일곱 모델 모두 실패했을까요?</li>
        </ol>
        <p>답은 <strong>아니요, 아니요, 예</strong>입니다. 색 변경은 형태 보존, 교체는 새 물건의 경계 생성, 더하기는 생성, 지우기는 있던 대상의 소거가 성공 조건입니다.</p>

        <p className="leading-7">
          두 함정은 각각 마스크와 지표 쪽입니다. 하나는 마스크를 넓히는 방향이 동작마다 반대라는 것입니다. 다른 하나는 같은 동작의 수치가 그림 스타일에 따라 두 배씩 달라져 절대값으로
          모델을 고르면 안 된다는 것입니다.
        </p>

        <p className="leading-7">
          여기서 쓰는 수치의 바닥값과 임계값은{" "}
          <Link to="/cs/ai/generative-measurement-controls">계측기 검증</Link>이 소유합니다. 특히 마스크 밖
          변화량의 모델 간 비교는 그 글에서 무효화됐으므로 이 글에서는 선택 근거로 쓰지 않습니다. 확산 편집의
          구성 요소와 안내 계수 자체는{" "}
          <Link to="/cs/ai/latent-diffusion-guidance#pipeline">잠재 확산 파이프라인</Link>이 소유합니다.
        </p>
      </div>

      <VerbViz />
      <ContentBoundary article="masked-edit-verb-routing" />
    </section>
  );
}
