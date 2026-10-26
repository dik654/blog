import ContentBoundary from "@/components/articles/content-boundary";
import BFTTheory from "./distributed-systems/BFTTheory";
import CAP from "./distributed-systems/CAP";
import ConsensusClass from "./distributed-systems/ConsensusClass";
import DistributedSystemsPathLocator, {
  DistributedSystemsMapReturn,
} from "./distributed-systems/DistributedSystemsPathLocator";
import FLP from "./distributed-systems/FLP";
import Overview from "./distributed-systems/Overview";

export default function DistributedSystems() {
  return (
    <article className="space-y-14">
      <DistributedSystemsPathLocator current="system-model" />
      <Overview />
      <FLP />
      <CAP />
      <BFTTheory />
      <ConsensusClass />
      <DistributedSystemsMapReturn current="system-model" />
      <ContentBoundary article="distributed-systems" />
    </article>
  );
}
