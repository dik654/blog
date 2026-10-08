import CloudCertificationArticle, {
  type CloudCertificationArticleData,
} from "../../cloud/CloudCertificationArticle";

export type AiInfrastructureArticleData = CloudCertificationArticleData;

export default function AiInfrastructureArticle({
  data,
}: {
  data: AiInfrastructureArticleData;
}) {
  return <CloudCertificationArticle data={data} />;
}
