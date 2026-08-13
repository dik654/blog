import Overview from "./compression-pipeline/Overview";
import Order from "./compression-pipeline/Order";
import Budget from "./compression-pipeline/Budget";
import Benchmark from "./compression-pipeline/Benchmark";

export default function CompressionPipelineArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Order />
      <Budget />
      <Benchmark />
    </div>
  );
}
