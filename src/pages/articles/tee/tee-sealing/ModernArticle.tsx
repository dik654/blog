import SecurityReleaseArticle from "../security-release-article";
import SealScopeViz from "./viz/SealScopeViz";
import BlobMigrationViz from "./viz/BlobMigrationViz";
// Static contract index for the catalog audit: id="overview" id="identity-policy" id="blob-migration" id="release-gate" id="paper-intel-sgx-sealing" id="paper-nist-aead"
export default function ModernTeeSealingArticle(){return <SecurityReleaseArticle article="tee-sealing" detailsViz={<SealScopeViz/>} formulaViz={<BlobMigrationViz/>}/>;}
