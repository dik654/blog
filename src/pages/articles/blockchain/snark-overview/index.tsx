import Overview from './Overview';
import Components from './Components';
import VerifyFlow from './VerifyFlow';
import Landscape from './Landscape';

export default function SNARKOverview() {
  return (
    <div className="space-y-12">
      <Overview />
      <Components />
      <VerifyFlow />
      <Landscape />
    </div>
  );
}
