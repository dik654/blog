import Overview from './image-classification-pipeline/Overview';
import Backbone from './image-classification-pipeline/Backbone';
import Training from './image-classification-pipeline/Training';
import Postprocess from './image-classification-pipeline/Postprocess';

export default function ImageClassificationPipelineArticle() {
  return (
    <>
      <Overview />
      <Backbone />
      <Training />
      <Postprocess />
    </>
  );
}
