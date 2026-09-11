import Overview from "./generative-measurement-controls/Overview";
import IdentityMetric from "./generative-measurement-controls/IdentityMetric";
import StyleCoverage from "./generative-measurement-controls/StyleCoverage";
import RoundtripFloor from "./generative-measurement-controls/RoundtripFloor";
import InstrumentControls from "./generative-measurement-controls/InstrumentControls";
import MeasurementGate from "./generative-measurement-controls/MeasurementGate";

/**
 * 계측기도 답을 아는 입력으로 먼저 검증해야 합니다
 *
 * 수치는 한 대의 장비에서 얻은 프로젝트 실측이며 다른 모델 조합으로 일반화하지 않는다.
 */
export default function GenerativeMeasurementControlsArticle() {
  return (
    <div className="space-y-16">
      <Overview />
      <IdentityMetric />
      <StyleCoverage />
      <RoundtripFloor />
      <InstrumentControls />
      <MeasurementGate />
    </div>
  );
}
