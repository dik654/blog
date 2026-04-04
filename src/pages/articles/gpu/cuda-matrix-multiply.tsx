import Overview from './cuda-matrix-multiply/Overview';
import Naive from './cuda-matrix-multiply/Naive';
import Tiled from './cuda-matrix-multiply/Tiled';
import Performance from './cuda-matrix-multiply/Performance';

export default function CudaMatrixMultiplyArticle() {
  return (
    <>
      <Overview />
      <Naive />
      <Tiled />
      <Performance />
    </>
  );
}
