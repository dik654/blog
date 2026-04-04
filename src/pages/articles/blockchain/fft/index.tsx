import Overview from './Overview';
import DFT from './DFT';
import Butterfly from './Butterfly';
import UnitRoot from './UnitRoot';
import INTT from './INTT';
import ZKUsage from './ZKUsage';

export default function FFT() {
  return (
    <div className="space-y-12">
      <Overview />
      <DFT />
      <Butterfly />
      <UnitRoot />
      <INTT />
      <ZKUsage />
    </div>
  );
}
