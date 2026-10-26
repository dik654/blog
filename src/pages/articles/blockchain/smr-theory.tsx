import ContentBoundary from "@/components/articles/content-boundary";
import Overview from "./smr-theory/Overview";
import TotalOrder from "./smr-theory/TotalOrder";
import LogReplication from "./smr-theory/LogReplication";
import Paxos from "./smr-theory/Paxos";
import DistributedSystemsPathLocator, {
  DistributedSystemsMapReturn,
} from "./distributed-systems/DistributedSystemsPathLocator";

export default function SMRTheory() {
  return (
    <article className="space-y-14">
      <DistributedSystemsPathLocator current="smr" />
      <Overview />
      <TotalOrder />
      <LogReplication />
      <Paxos />
      <DistributedSystemsMapReturn current="smr" />
      <ContentBoundary article="smr-theory" />
    </article>
  );
}
