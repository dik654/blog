import Ablation from "./sionic-eureka/Ablation";
import DataBoundary from "./sionic-eureka/DataBoundary";
import Distillation from "./sionic-eureka/Distillation";
import Evaluation from "./sionic-eureka/Evaluation";
import HardNegatives from "./sionic-eureka/HardNegatives";
import Overview from "./sionic-eureka/Overview";
import QueryGeneration from "./sionic-eureka/QueryGeneration";

export default function SionicEurekaArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <DataBoundary />
      <QueryGeneration />
      <HardNegatives />
      <Distillation />
      <Ablation />
      <Evaluation />
    </div>
  );
}
