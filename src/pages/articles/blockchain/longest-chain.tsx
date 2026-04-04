import Overview from './longest-chain/Overview';
import ChainSelection from './longest-chain/ChainSelection';
import Finality from './longest-chain/Finality';
import Comparison from './longest-chain/Comparison';

export default function LongestChainArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <ChainSelection />
      <Finality />
      <Comparison />
    </div>
  );
}
