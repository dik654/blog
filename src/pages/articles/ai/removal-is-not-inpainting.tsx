import Overview from "./removal-is-not-inpainting/Overview";
import AbsenceNotDrawable from "./removal-is-not-inpainting/AbsenceNotDrawable";
import Propagation from "./removal-is-not-inpainting/Propagation";
import ToolContract from "./removal-is-not-inpainting/ToolContract";
import TwoStageRejected from "./removal-is-not-inpainting/TwoStageRejected";
import RemoveGate from "./removal-is-not-inpainting/RemoveGate";

/**
 * 지우기는 인페인팅의 한 종류가 아닙니다
 *
 * 자동 판정기가 없는 회차이므로 정량 실패율 주장을 하지 않고 대조표와 마스크 밖 수치로만 판정한다.
 */
export default function RemovalIsNotInpaintingArticle() {
  return (
    <div className="space-y-16">
      <Overview />
      <AbsenceNotDrawable />
      <Propagation />
      <ToolContract />
      <TwoStageRejected />
      <RemoveGate />
    </div>
  );
}
