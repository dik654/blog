import Overview from './Overview';
import LowDegreeTest from './LowDegreeTest';
import Folding from './Folding';
import STARKUsage from './STARKUsage';

export default function FRI() {
  return (
    <div className="space-y-12">
      <Overview />
      <LowDegreeTest />
      <Folding />
      <STARKUsage />
    </div>
  );
}
