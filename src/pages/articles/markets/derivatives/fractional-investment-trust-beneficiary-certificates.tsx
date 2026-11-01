import DerivativeDeepArticle from "./DerivativeDeepArticle";
import FractionalTrustCashRightsViz from "./FractionalTrustCashRightsViz";
import { fractionalTrustCertificatesData } from "./derivative-specialized-market-gaps-data";

export default function FractionalTrustCertificatesArticle() {
  return <div className="space-y-16"><FractionalTrustCashRightsViz /><DerivativeDeepArticle data={fractionalTrustCertificatesData} /></div>;
}
