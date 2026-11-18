import PlatformTeeArticle from "../platform-tee-article";
import OpteeRequestPathViz from "./viz/OpteeRequestPathViz";
export default function ModernOpTeeArticle(){return <PlatformTeeArticle platform="op-tee" slots={{ beforeSequence: <OpteeRequestPathViz /> }}/>;}
