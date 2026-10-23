import CloudCertificationArticle from "./CloudCertificationArticle";
import CkaInteractiveLab from "./CkaInteractiveLab";
import CkaResourceMap from "./CkaResourceMap";
import { kubernetesRequestPathAndCkaData } from "./kubernetesData";
import KubernetesSeriesLocator from "./kubernetes-shared/KubernetesSeriesLocator";

export default function KubernetesRequestPathAndCkaArticle() {
  return (
    <>
      <KubernetesSeriesLocator current="request" path={["request", "resource", "controllers", "placement", "health"]} question="YAML 한 장은 API 요청에서 시작해 어떤 제어 경로를 지나 Ready Pod가 될까요?" />
      <CloudCertificationArticle data={kubernetesRequestPathAndCkaData} />
      <div className="mt-16 space-y-16">
        <CkaResourceMap />
        <CkaInteractiveLab />
      </div>
    </>
  );
}
