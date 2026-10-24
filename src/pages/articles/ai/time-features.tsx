import Overview from "./time-features/Overview";
import Lag from "./time-features/Lag";
import Rolling from "./time-features/Rolling";
import Cyclic from "./time-features/Cyclic";
import Leakage from "./time-features/Leakage";
import {
  TemporalDataFamilyLocator,
  TemporalDataFamilyMapReturn,
} from "./shared/TemporalDataFamilyLocator";

export default function TimeFeaturesArticle() {
  return (
    <div className="space-y-12" data-teach-level="0">
      <TemporalDataFamilyLocator current="features" />
      <Overview />
      <Lag />
      <Rolling />
      <Cyclic />
      <Leakage />
      <TemporalDataFamilyMapReturn current="features" />
    </div>
  );
}
