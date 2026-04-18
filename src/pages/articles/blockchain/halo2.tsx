import Overview from './halo2/Overview';
import Keygen from './halo2/Keygen';
import Prover from './halo2/Prover';
import ConstraintSystem from './halo2/ConstraintSystem';
import VirtualRegion from './halo2/VirtualRegion';
import Halo2Ecc from './halo2/Halo2Ecc';
import Examples from './halo2/Examples';

export default function Halo2Article() {
  return (
    <>
      <Overview />
      <Keygen />
      <Prover />
      <ConstraintSystem />
      <VirtualRegion />
      <Halo2Ecc />
      <Examples />
    </>
  );
}
