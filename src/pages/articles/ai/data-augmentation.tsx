import Overview from './data-augmentation/Overview';
import Geometric from './data-augmentation/Geometric';
import Color from './data-augmentation/Color';
import Advanced from './data-augmentation/Advanced';
import Tabular from './data-augmentation/Tabular';
import Pipeline from './data-augmentation/Pipeline';

export default function DataAugmentationArticle() {
  return (
    <>
      <Overview />
      <Geometric />
      <Color />
      <Advanced />
      <Tabular />
      <Pipeline />
    </>
  );
}
