import VendorTeeArticle from "../vendor-tee-article";
import CommitOrderViz from "./viz/CommitOrderViz";
import MeasurementTimelineViz from "./viz/MeasurementTimelineViz";

export default function ModernIntelTdxArticle() {
  return <VendorTeeArticle vendor="intel-tdx" commitViz={<CommitOrderViz />} measurementViz={<MeasurementTimelineViz />} />;
}
