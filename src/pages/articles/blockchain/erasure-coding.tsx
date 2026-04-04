import Overview from './erasure-coding/Overview';
import ReedSolomon from './erasure-coding/ReedSolomon';
import TwoDimensional from './erasure-coding/TwoDimensional';
import Comparison from './erasure-coding/Comparison';

export default function ErasureCodingArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <ReedSolomon />
      <TwoDimensional />
      <Comparison />
    </div>
  );
}
