import Overview from "./helios-types/Overview";
import CoreTypes from "./helios-types/CoreTypes";
import Encoding from "./helios-types/Encoding";
import SszInternal from "./helios-types/SszInternal";

export default function HeliosTypes() {
  return (
    <>
      <Overview />
      <CoreTypes title="Header · Aggregate · Update · Store" onCodeRef={() => {}} />
      <Encoding title="SSZ · Fork · Domain signing context" onCodeRef={() => {}} />
      <SszInternal
        title="SSZ proof — object root · generalized index"
        onCodeRef={() => {}}
      />
    </>
  );
}
