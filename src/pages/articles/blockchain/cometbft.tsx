import Overview from './cometbft/Overview';
import ConsensusEngine from './cometbft/ConsensusEngine';
import ABCI from './cometbft/ABCI';
import P2PLayer from './cometbft/P2PLayer';
import MempoolStateSync from './cometbft/MempoolStateSync';

export default function CometBFTArticle() {
  return (
    <>
      <Overview />
      <ConsensusEngine />
      <ABCI />
      <P2PLayer />
      <MempoolStateSync />
    </>
  );
}
