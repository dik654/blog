import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { zhangCameraCalibration2000Spec } from './paper-spine/robotCameraCalibrationSpecs';

export default function PaperZhangCameraCalibration2000Article() {
  return <FoundationalPaperStudy spec={zhangCameraCalibration2000Spec} />;
}
