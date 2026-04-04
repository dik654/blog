import Overview from './gpu-arch-hopper/Overview';
import SmStructure from './gpu-arch-hopper/SmStructure';
import TMA from './gpu-arch-hopper/TMA';
import Cluster from './gpu-arch-hopper/Cluster';
import TransformerEngine from './gpu-arch-hopper/TransformerEngine';

export default function GpuArchHopperArticle() {
  return (
    <>
      <Overview />
      <SmStructure />
      <TMA />
      <Cluster />
      <TransformerEngine />
    </>
  );
}
