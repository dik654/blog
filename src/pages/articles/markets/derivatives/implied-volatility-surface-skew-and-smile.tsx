import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { volatilitySurfaceData } from "./derivative-model-data";
import VolatilitySurfaceMapViz from "./VolatilitySurfaceMapViz";

export default function ImpliedVolatilitySurfaceArticle() {
  return (
    <div className="space-y-16">
      <VolatilitySurfaceMapViz />
      <DerivativeDeepArticle data={volatilitySurfaceData} />
    </div>
  );
}
