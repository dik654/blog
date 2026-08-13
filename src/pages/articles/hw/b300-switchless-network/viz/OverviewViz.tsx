import ArticleFlowViz from "@/components/viz/article-flow-viz";
import { STEPS } from "./OverviewData";

export default function OverviewViz() {
  return <ArticleFlowViz steps={STEPS} />;
}
