import Overview from './claw-worker-boot/Overview';
import TrustResolver from './claw-worker-boot/TrustResolver';
import Observe from './claw-worker-boot/Observe';
import Misdelivery from './claw-worker-boot/Misdelivery';

export default function ClawWorkerBootArticle() {
  return (
    <>
      <Overview />
      <TrustResolver />
      <Observe />
      <Misdelivery />
    </>
  );
}
