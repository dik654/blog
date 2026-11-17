import VendorTeeArticle from "../vendor-tee-article";
import GranuleDelegateViz from "./viz/GranuleDelegateViz";
import TokenAppraisalViz from "./viz/TokenAppraisalViz";

export default function ModernArmCcaArticle() {
  return <VendorTeeArticle vendor="arm-cca" lifecycleViz={<GranuleDelegateViz />} measurementViz={<TokenAppraisalViz />} />;
}
