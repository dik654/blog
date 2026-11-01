import DerivativeDeepArticle from "./DerivativeDeepArticle";
import SwaptionVolatilityCubeViz from "./SwaptionVolatilityCubeViz";
import { swaptionVolatilityCubeData } from "./derivative-curriculum-gaps-data";

export default function SwaptionVolatilityCubeArticle() {
  return <div className="space-y-16"><SwaptionVolatilityCubeViz /><DerivativeDeepArticle data={swaptionVolatilityCubeData} /></div>;
}
