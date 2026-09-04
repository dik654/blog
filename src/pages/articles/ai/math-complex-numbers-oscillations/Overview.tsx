import { Link } from "react-router-dom";
import RotationCoordinatesViz from "./viz/RotationCoordinatesViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">복소수는 낯선 수를 하나 더 붙인 것이 아니라 회전의 상태를 한 값에 담는 좌표다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          소리의 진동, 파동, 계절성처럼 같은 패턴이 되풀이되는 현상에는 두 정보가 함께 필요합니다. 얼마나 큰지뿐 아니라 한 주기에서 지금 어디쯤 왔는지도 알아야 합니다. 실수 하나는
          직선 위의 위치만 나타냅니다. 복소수는 평면의 가로·세로 좌표를 한 값으로 묶기 때문에 크기와 회전 각도를 동시에 기록합니다.
        </p>
        <p className="leading-8">
          이 글은 삼각함수나 복소수를 이미 안다고 가정하지 않습니다. 먼저 한 바퀴를 재는 radian을 정의하고, 단위원 위 점의 좌표가 sine과 cosine이라는 사실을 확인합니다. 그런 다음 <code>i²=-1</code>을 이용해 평면의 점을 하나의 복소수로 적고, Euler 공식이 지수와 회전을 연결하는 이유를 살펴봅니다. 벡터의 좌표와 길이가 낯설다면 <Link to="/ai/math-vectors-inner-products">벡터·내적 글</Link>부터 읽으면 됩니다.
        </p>
      </div>
      <RotationCoordinatesViz />
    </section>
  );
}
