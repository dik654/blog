import Overview from './cuda-thread-hierarchy/Overview';
import BuiltinVars from './cuda-thread-hierarchy/BuiltinVars';
import Indexing1D from './cuda-thread-hierarchy/Indexing1D';
import Indexing2D from './cuda-thread-hierarchy/Indexing2D';

export default function CUDAThreadHierarchyArticle() {
  return (
    <>
      <Overview />
      <BuiltinVars />
      <Indexing1D />
      <Indexing2D />
    </>
  );
}
