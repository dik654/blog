import ArticleFlowViz from "@/components/viz/article-flow-viz";
import { STEPS } from "./ContextVizData";

export default function ContextViz() {
  return <ArticleFlowViz steps={STEPS} />;
}
