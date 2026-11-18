import CloudCertificationArticle from "./CloudCertificationArticle";
import { awsClfData } from "./awsData";
import CostToolTimelineViz from "./aws-clf-c02-fast-study/viz/CostToolTimelineViz";
import ExamDomainSplitViz from "./aws-clf-c02-fast-study/viz/ExamDomainSplitViz";
import RegionBoundaryMapViz from "./aws-clf-c02-fast-study/viz/RegionBoundaryMapViz";

export default function AwsClfArticle() {
  return (
    <CloudCertificationArticle
      data={awsClfData}
      sectionLead={{
        need: <CostToolTimelineViz />,
        names: <ExamDomainSplitViz />,
        comparison: <RegionBoundaryMapViz />,
      }}
    />
  );
}
