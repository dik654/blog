import Overview from "./open-r1/Overview";
import SFTProcess from "./open-r1/SFTProcess";
import GRPOProcess from "./open-r1/GRPOProcess";
import RewardSystem from "./open-r1/RewardSystem";
import DataPipeline from "./open-r1/DataPipeline";
import Evaluation from "./open-r1/Evaluation";

export default function OpenR1Article() {
  return (
    <>
      <Overview />
      <SFTProcess />
      <GRPOProcess />
      <RewardSystem />
      <DataPipeline />
      <Evaluation />
    </>
  );
}
