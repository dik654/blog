import Overview from "./network/Overview";
import Interconnect from "./network/Interconnect";
import Ethernet from "./network/Ethernet";
import RDMA from "./network/RDMA";
import InfiniBand from "./network/InfiniBand";

export default function NetworkArticle() {
  return (
    <>
      <Overview />
      <Interconnect />
      <Ethernet />
      <RDMA />
      <InfiniBand />
    </>
  );
}
