import Overview from './memory/Overview';
import DDR from './memory/DDR';
import ECC from './memory/ECC';
import RDIMM from './memory/RDIMM';

export default function MemoryArticle() {
  return (
    <>
      <Overview />
      <DDR />
      <ECC />
      <RDIMM />
    </>
  );
}
