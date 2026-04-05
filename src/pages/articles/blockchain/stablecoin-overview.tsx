import Overview from './stablecoin-overview/Overview';
import FiatBacked from './stablecoin-overview/FiatBacked';
import CryptoBacked from './stablecoin-overview/CryptoBacked';
import Algorithmic from './stablecoin-overview/Algorithmic';
import Comparison from './stablecoin-overview/Comparison';

export default function StablecoinOverviewArticle() {
  return (
    <>
      <Overview />
      <FiatBacked />
      <CryptoBacked />
      <Algorithmic />
      <Comparison />
    </>
  );
}
