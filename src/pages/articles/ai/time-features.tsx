import Overview from "./time-features/Overview";
import Lag from "./time-features/Lag";
import Rolling from "./time-features/Rolling";
import Cyclic from "./time-features/Cyclic";
import Leakage from "./time-features/Leakage";

export default function TimeFeaturesArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Lag />
      <Rolling />
      <Cyclic />
      <Leakage />
    </div>
  );
}
