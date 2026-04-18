import Overview from './deepfake-detection/Overview';
import FaceExtraction from './deepfake-detection/FaceExtraction';
import Frequency from './deepfake-detection/Frequency';
import Models from './deepfake-detection/Models';
import ExternalData from './deepfake-detection/ExternalData';

export default function DeepfakeDetectionArticle() {
  return (
    <>
      <Overview />
      <FaceExtraction />
      <Frequency />
      <Models />
      <ExternalData />
    </>
  );
}
