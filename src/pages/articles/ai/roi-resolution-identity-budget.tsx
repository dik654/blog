import Overview from "./roi-resolution-identity-budget/Overview";
import TokenBudget from "./roi-resolution-identity-budget/TokenBudget";
import DenoiseWindow from "./roi-resolution-identity-budget/DenoiseWindow";
import RoiCrop from "./roi-resolution-identity-budget/RoiCrop";
import UpscaleKnownAnswer from "./roi-resolution-identity-budget/UpscaleKnownAnswer";
import ResolutionGate from "./roi-resolution-identity-budget/ResolutionGate";

/**
 * 같은 편집이 얼굴 크기에 따라 성공하고 실패합니다
 *
 * 축소 배율·패치 크기는 구현마다 달라 토큰 계산은 관계만 보이고 절대 기준으로 쓰지 않는다.
 */
export default function RoiResolutionIdentityBudgetArticle() {
  return (
    <div className="space-y-16">
      <Overview />
      <TokenBudget />
      <DenoiseWindow />
      <RoiCrop />
      <UpscaleKnownAnswer />
      <ResolutionGate />
    </div>
  );
}
