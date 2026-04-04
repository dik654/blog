import Overview from './discv4/Overview';
import Wire from './discv4/Wire';
import Handshake from './discv4/Handshake';
import FindNode from './discv4/FindNode';
import ENR from './discv4/ENR';

export default function Discv4Article() {
  return (
    <>
      <Overview />
      <Wire />
      <Handshake />
      <FindNode />
      <ENR />
    </>
  );
}
