import Overview from './tendermint-bft/Overview';
import Protocol from './tendermint-bft/Protocol';
import Locking from './tendermint-bft/Locking';
import Comparison from './tendermint-bft/Comparison';

export default function TendermintBFTArticle() {
  return (
    <>
      <Overview />
      <Protocol />
      <Locking />
      <Comparison />
    </>
  );
}
