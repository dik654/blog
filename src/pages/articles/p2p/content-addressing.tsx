import Overview from './content-addressing/Overview';
import CID from './content-addressing/CID';
import MerkleDAG from './content-addressing/MerkleDAG';
import Resolution from './content-addressing/Resolution';

export default function ContentAddressingArticle() {
  return (
    <>
      <Overview />
      <CID />
      <MerkleDAG />
      <Resolution />
    </>
  );
}
