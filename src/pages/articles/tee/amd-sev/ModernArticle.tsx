import VendorTeeArticle from "../vendor-tee-article";
import ReportAppraisalViz from "./viz/ReportAppraisalViz";
import RmpOwnershipCheckViz from "./viz/RmpOwnershipCheckViz";
import SharedPrivateCommitViz from "./viz/SharedPrivateCommitViz";

export default function ModernAmdSevArticle() {
  return <VendorTeeArticle vendor="amd-sev" lifecycleViz={<RmpOwnershipCheckViz />} commitViz={<SharedPrivateCommitViz />} measurementViz={<ReportAppraisalViz />} />;
}
