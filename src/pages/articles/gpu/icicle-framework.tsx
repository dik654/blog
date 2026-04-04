import Overview from './icicle-framework/Overview';
import CudaBackend from './icicle-framework/CudaBackend';
import Bindings from './icicle-framework/Bindings';
import Benchmark from './icicle-framework/Benchmark';

export default function IcicleFrameworkArticle() {
  return (
    <>
      <Overview />
      <CudaBackend />
      <Bindings />
      <Benchmark />
    </>
  );
}
