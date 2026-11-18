import CloudCertificationArticle from "./CloudCertificationArticle";
import { awsDeveloperCloudOpsData } from "./awsData";
import FailedDeployRollbackViz from "./aws-developer-cloudops-paths/viz/FailedDeployRollbackViz";
import RetryIdempotencyViz from "./aws-developer-cloudops-paths/viz/RetryIdempotencyViz";
import VerbTallyViz from "./aws-developer-cloudops-paths/viz/VerbTallyViz";

export default function AwsDeveloperCloudOpsArticle() {
  return (
    <CloudCertificationArticle
      data={awsDeveloperCloudOpsData}
      paragraphLead={{
        case: { 0: <FailedDeployRollbackViz /> },
        need: { 0: <RetryIdempotencyViz /> },
        mechanism: { 0: <VerbTallyViz /> },
      }}
    />
  );
}
