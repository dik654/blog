import Overview from './karatsuba/Overview';
import NaiveMul from './karatsuba/NaiveMul';
import KaratsubaTrick from './karatsuba/KaratsubaTrick';
import Recursive from './karatsuba/Recursive';
import CostComparison from './karatsuba/CostComparison';

export default function Karatsuba() {
  return (
    <div className="space-y-12">
      <Overview />
      <NaiveMul />
      <KaratsubaTrick />
      <Recursive />
      <CostComparison />
    </div>
  );
}
