import Overview from "./masked-edit-verb-routing/Overview";
import ModelDisposition from "./masked-edit-verb-routing/ModelDisposition";
import HandHint from "./masked-edit-verb-routing/HandHint";
import MaskPolarity from "./masked-edit-verb-routing/MaskPolarity";
import StyleScale from "./masked-edit-verb-routing/StyleScale";
import RoutingGate from "./masked-edit-verb-routing/RoutingGate";

/**
 * "편집"은 한 동작이 아니라 요구가 서로 다른 여섯 동작입니다
 *
 * 순위는 한 장비·한 회차·한 프롬프트 문체에서 얻은 실측이며 절대 임계값으로 일반화하지 않는다.
 */
export default function MaskedEditVerbRoutingArticle() {
  return (
    <div className="space-y-16">
      <Overview />
      <ModelDisposition />
      <HandHint />
      <MaskPolarity />
      <StyleScale />
      <RoutingGate />
    </div>
  );
}
