import Overview from './gpu-architecture/Overview';
import MemoryHierarchy from './gpu-architecture/MemoryHierarchy';
import Warp from './gpu-architecture/Warp';
import Optimization from './gpu-architecture/Optimization';

export default function GPUArchitectureArticle() {
  return (
    <>
      <Overview />
      <MemoryHierarchy />
      <Warp />
      <Optimization />
    </>
  );
}
