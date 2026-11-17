import SecurityReleaseArticle from "../../tee/security-release-article";
import RestoreOrVerifyViz from "./viz/RestoreOrVerifyViz";
import EnvelopeRotationViz from "./viz/EnvelopeRotationViz";
// Static contract index for the catalog audit: id="overview" id="data-password-boundary" id="key-lifecycle" id="release-gate" id="paper-nist-key-management" id="paper-owasp-password-storage" id="paper-owasp-crypto-storage"
export default function ModernIsmsEncryptionArticle(){return <SecurityReleaseArticle article="isms-encryption" detailsViz={<RestoreOrVerifyViz/>} formulaViz={<EnvelopeRotationViz/>}/>;}
