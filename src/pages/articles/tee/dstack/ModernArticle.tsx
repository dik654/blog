import PlatformTeeArticle from "../platform-tee-article";
import KeyContextViz from "./viz/KeyContextViz";
export default function ModernDstackArticle(){return <PlatformTeeArticle platform="dstack" slots={{ beforeFormula: <KeyContextViz /> }}/>;}
