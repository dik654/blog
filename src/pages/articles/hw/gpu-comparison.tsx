import Overview from './gpu-comparison/Overview';
import Consumer from './gpu-comparison/Consumer';
import Datacenter from './gpu-comparison/Datacenter';
import Blockchain from './gpu-comparison/Blockchain';

export default function GPUComparisonArticle() {
  return (
    <>
      <Overview />
      <Consumer />
      <Datacenter />
      <Blockchain />
    </>
  );
}
