import Overview from './bandwidth-deep-dive/Overview';
import Roofline from './bandwidth-deep-dive/Roofline';
import LlmBandwidth from './bandwidth-deep-dive/LlmBandwidth';
import Network from './bandwidth-deep-dive/Network';
import IoStorage from './bandwidth-deep-dive/IoStorage';

export default function BandwidthDeepDive() {
  return (
    <>
      <Overview />
      <Roofline />
      <LlmBandwidth />
      <Network />
      <IoStorage />
    </>
  );
}
