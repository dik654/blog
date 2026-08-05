import Overview from './gpu-comparison/Overview';
import Glossary from './gpu-comparison/Glossary';
import Consumer from './gpu-comparison/Consumer';
import Datacenter from './gpu-comparison/Datacenter';
import Blockchain from './gpu-comparison/Blockchain';

export default function GPUComparisonArticle() {
  return (
    <>
      <Overview />
      <Glossary />
      <Consumer />
      <Datacenter />
      <Blockchain />
    </>
  );
}
