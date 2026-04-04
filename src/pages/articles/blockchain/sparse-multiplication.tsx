import Overview from './sparse-multiplication/Overview';
import WhySparse from './sparse-multiplication/WhySparse';
import HowSparse from './sparse-multiplication/HowSparse';
import CostSaving from './sparse-multiplication/CostSaving';
import InMiller from './sparse-multiplication/InMiller';

export default function SparseMultiplication() {
  return (
    <div className="space-y-12">
      <Overview />
      <WhySparse />
      <HowSparse />
      <CostSaving />
      <InMiller />
    </div>
  );
}
