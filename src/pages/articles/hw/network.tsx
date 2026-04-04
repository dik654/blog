import Overview from './network/Overview';
import Ethernet from './network/Ethernet';
import RDMA from './network/RDMA';
import InfiniBand from './network/InfiniBand';

export default function NetworkArticle() {
  return (
    <>
      <Overview />
      <Ethernet />
      <RDMA />
      <InfiniBand />
    </>
  );
}
