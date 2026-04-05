import Overview from './usdc-circle/Overview';
import IssuanceRedemption from './usdc-circle/IssuanceRedemption';
import CrossChain from './usdc-circle/CrossChain';
import ReservesAttestation from './usdc-circle/ReservesAttestation';

export default function UsdcCircleArticle() {
  return (
    <>
      <Overview />
      <IssuanceRedemption />
      <CrossChain />
      <ReservesAttestation />
    </>
  );
}
