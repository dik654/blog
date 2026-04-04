import Overview from './helios-types/Overview';
import CoreTypes from './helios-types/CoreTypes';
import Encoding from './helios-types/Encoding';
import SszInternal from './helios-types/SszInternal';

export default function HeliosTypes() {
  return (
    <>
      <Overview />
      <CoreTypes title="4가지 핵심 구조체" onCodeRef={() => {}} />
      <Encoding title="SSZ + Fork + Domain 인코딩" onCodeRef={() => {}} />
      <SszInternal title="SSZ 내부 — hash_tree_root + generalized index" onCodeRef={() => {}} />
    </>
  );
}
