import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { volatilitySurfaceData } from "./derivative-model-data";

export default function ImpliedVolatilitySurfaceArticle() {
  return <DerivativeDeepArticle data={volatilitySurfaceData} />;
}
