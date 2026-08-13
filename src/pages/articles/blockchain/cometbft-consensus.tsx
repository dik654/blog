import Overview from "./cometbft-consensus/Overview";
import ReceiveRoutine from "./cometbft-consensus/ReceiveRoutine";
import RoundState from "./cometbft-consensus/RoundState";
import VoteHandling from "./cometbft-consensus/VoteHandling";
import Timeout from "./cometbft-consensus/Timeout";
import Byzantine from "./cometbft-consensus/Byzantine";
export default function CometBFTConsensusArticle() {
  return (
    <>
      <Overview />
      <ReceiveRoutine />
      <RoundState />
      <VoteHandling />
      <Timeout />
      <Byzantine />
    </>
  );
}
