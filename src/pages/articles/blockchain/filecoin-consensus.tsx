import Sortition from './filecoin-consensus/Sortition';
import Tipset from './filecoin-consensus/Tipset';
import BitTorrent from './filecoin-consensus/BitTorrent';

export default function FilecoinConsensus() {
  return (
    <>
      <Sortition />
      <Tipset />
      <BitTorrent />
    </>
  );
}
