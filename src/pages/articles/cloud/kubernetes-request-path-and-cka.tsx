import CloudCertificationArticle from "./CloudCertificationArticle";
import CkaInteractiveLab from "./CkaInteractiveLab";
import CkaResourceMap from "./CkaResourceMap";
import { kubernetesRequestPathAndCkaData } from "./kubernetesData";

export default function KubernetesRequestPathAndCkaArticle() {
  return (
    <>
      <CloudCertificationArticle data={kubernetesRequestPathAndCkaData} />
      <div className="mt-16 space-y-16">
        <CkaResourceMap />
        <CkaInteractiveLab />
      </div>
    </>
  );
}
