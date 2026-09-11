import Overview from "./negative-result-3d-face-control/Overview";
import WindingBug from "./negative-result-3d-face-control/WindingBug";
import ShapeSurvival from "./negative-result-3d-face-control/ShapeSurvival";
import SeedControl from "./negative-result-3d-face-control/SeedControl";
import BrokenNotDifferent from "./negative-result-3d-face-control/BrokenNotDifferent";
import NegativeGate from "./negative-result-3d-face-control/NegativeGate";

/**
 * 세 라운드를 들여 실패했고 그 기록이 남을 가치가 있습니다
 *
 * 실패한 것은 이 세 방법이며 3차원 형태 제어 일반이 불가능하다는 뜻이 아니다.
 */
export default function NegativeResult3dFaceControlArticle() {
  return (
    <div className="space-y-16">
      <Overview />
      <WindingBug />
      <ShapeSurvival />
      <SeedControl />
      <BrokenNotDifferent />
      <NegativeGate />
    </div>
  );
}
