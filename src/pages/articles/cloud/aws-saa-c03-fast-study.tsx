import CloudCertificationArticle from "./CloudCertificationArticle";
import { awsSaaData } from "./awsData";
import MessagingDirectionViz from "./aws-saa-c03-fast-study/viz/MessagingDirectionViz";
import OptionEliminationViz from "./aws-saa-c03-fast-study/viz/OptionEliminationViz";
import QueueBurstViz from "./aws-saa-c03-fast-study/viz/QueueBurstViz";
import RequestPathFailureViz from "./aws-saa-c03-fast-study/viz/RequestPathFailureViz";
import RpoRtoTimelineViz from "./aws-saa-c03-fast-study/viz/RpoRtoTimelineViz";

export default function AwsSaaArticle() {
  return (
    <CloudCertificationArticle
      data={awsSaaData}
      paragraphLead={{
        case: { 0: <RpoRtoTimelineViz /> },
        picture: { 0: <RequestPathFailureViz /> },
        need: { 0: <QueueBurstViz /> },
        mechanism: { 0: <OptionEliminationViz /> },
        comparison: { 1: <MessagingDirectionViz /> },
      }}
    />
  );
}
