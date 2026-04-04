import Overview from './optimizers/Overview';
import SGD from './optimizers/SGD';
import BatchVariants from './optimizers/BatchVariants';
import Momentum from './optimizers/Momentum';
import Adam from './optimizers/Adam';
import AdamW from './optimizers/AdamW';

export default function OptimizersArticle() {
  return (
    <>
      <Overview />
      <SGD />
      <BatchVariants />
      <Momentum />
      <Adam />
      <AdamW />
    </>
  );
}
