import Kernel from "./sionic-glm-b300/Kernel";
import Measurement from "./sionic-glm-b300/Measurement";
import Mtp from "./sionic-glm-b300/Mtp";
import Overview from "./sionic-glm-b300/Overview";
import Production from "./sionic-glm-b300/Production";
import Roofline from "./sionic-glm-b300/Roofline";
import Runtime from "./sionic-glm-b300/Runtime";

export default function SionicGlmB300Article() {
  return (
    <div className="space-y-12">
      <Overview />
      <Roofline />
      <Kernel />
      <Runtime />
      <Mtp />
      <Measurement />
      <Production />
    </div>
  );
}
