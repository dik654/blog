import Overview from './arm-cca/Overview';
import RmeGpt from './arm-cca/RmeGpt';
import RealmLifecycle from './arm-cca/RealmLifecycle';
import RmiRsi from './arm-cca/RmiRsi';
import TfRmm from './arm-cca/TfRmm';
import Stage2Mmu from './arm-cca/Stage2Mmu';
import Attestation from './arm-cca/Attestation';
import SmmuDma from './arm-cca/SmmuDma';

export default function ArmCcaArticle() {
  return (
    <>
      <Overview />
      <RmeGpt />
      <RealmLifecycle />
      <RmiRsi />
      <TfRmm />
      <Stage2Mmu />
      <Attestation />
      <SmmuDma />
    </>
  );
}
