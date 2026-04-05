import Overview from './dai-maker/Overview';
import VaultCdp from './dai-maker/VaultCdp';
import StabilityFee from './dai-maker/StabilityFee';
import LiquidationAuction from './dai-maker/LiquidationAuction';
import PegStability from './dai-maker/PegStability';

export default function DaiMakerArticle() {
  return (
    <>
      <Overview />
      <VaultCdp />
      <StabilityFee />
      <LiquidationAuction />
      <PegStability />
    </>
  );
}
