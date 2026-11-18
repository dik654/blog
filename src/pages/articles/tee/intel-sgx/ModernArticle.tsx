import VendorTeeArticle from "../vendor-tee-article";
import EnclaveCallOrderViz from "./viz/EnclaveCallOrderViz";
import MrenclaveReleaseViz from "./viz/MrenclaveReleaseViz";

export default function ModernIntelSgxArticle() {
  return <VendorTeeArticle vendor="intel-sgx" commitViz={<EnclaveCallOrderViz />} measurementViz={<MrenclaveReleaseViz />} />;
}
