import Overview from './frobenius-optimization/Overview';
import CoeffRearrange from './frobenius-optimization/CoeffRearrange';
import WhyFree from './frobenius-optimization/WhyFree';
import InFinalExp from './frobenius-optimization/InFinalExp';
import Concrete from './frobenius-optimization/Concrete';

export default function FrobeniusOptimization() {
  return (
    <div className="space-y-12">
      <Overview />
      <CoeffRearrange />
      <WhyFree />
      <InFinalExp />
      <Concrete />
    </div>
  );
}
