import PlatformTeeArticle from "../platform-tee-article";
import PhalaInvokeFlowViz from "./viz/PhalaInvokeFlowViz";
import PhalaKeyScopeViz from "./viz/PhalaKeyScopeViz";
export default function ModernPhalaArticle(){return <PlatformTeeArticle platform="phala" slots={{ beforeSequence: <PhalaInvokeFlowViz />, beforeFormula: <PhalaKeyScopeViz /> }}/>;}
