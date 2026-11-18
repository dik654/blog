import CloudCertificationArticle from "./CloudCertificationArticle";
import { certificationRoadmapData } from "./commonData";
import ExamPathViz from "./cloud-certification-roadmap-2026/viz/ExamPathViz";

export default function CloudCertificationRoadmapArticle() {
  return <CloudCertificationArticle data={certificationRoadmapData} sectionLead={{ names: <ExamPathViz /> }} />;
}
