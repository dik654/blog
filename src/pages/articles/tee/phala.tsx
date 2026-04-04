import Overview from './phala/Overview';
import PhatContract from './phala/PhatContract';
import TEEWorker from './phala/TEEWorker';
import DistributedCompute from './phala/DistributedCompute';
import Tokenomics from './phala/Tokenomics';

export default function PhalaArticle() {
  return (
    <>
      <Overview />
      <PhatContract />
      <TEEWorker />
      <DistributedCompute />
      <Tokenomics />
    </>
  );
}
