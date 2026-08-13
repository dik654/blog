import Overview from "./cometbft-types/Overview";
import BlockHeader from "./cometbft-types/BlockHeader";
import VoteCommit from "./cometbft-types/VoteCommit";
import ValidatorSet from "./cometbft-types/ValidatorSet";
export default function CometBFTTypesArticle() {
  return (
    <>
      <Overview />
      <BlockHeader />
      <VoteCommit />
      <ValidatorSet />
    </>
  );
}
