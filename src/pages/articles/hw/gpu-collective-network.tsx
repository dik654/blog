import NetworkRouteIntro from "./network/NetworkRouteIntro";
import InfiniBand from "./network/InfiniBand";

export default function GpuCollectiveNetworkArticle() {
  return <article><NetworkRouteIntro mode="collective" /><InfiniBand /></article>;
}
