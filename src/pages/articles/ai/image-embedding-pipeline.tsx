import { CodeSidebar, useCodeSidebar } from "@/components/code";
import Overview from "./image-embedding-pipeline/Overview";
import Preprocessing from "./image-embedding-pipeline/Preprocessing";
import Pooling from "./image-embedding-pipeline/Pooling";
import Similarity from "./image-embedding-pipeline/Similarity";
import PipelineContract from "./image-embedding-pipeline/PipelineContract";
import Evaluation from "./image-embedding-pipeline/Evaluation";
import { codeRefs } from "./image-embedding-pipeline/codeRefs";
import { transformersTree } from "./image-embedding-pipeline/fileTree";

const PROJECT_META = {
  transformers: {
    id: "transformers",
    label: "Transformers · DINOv3 ViT",
    badgeClass: "bg-amber-500/10 border-amber-500 text-amber-700",
  },
};

/**
 * 이미지 임베딩은 전처리와 풀링에서 대부분 갈립니다
 *
 * 코드 인용은 huggingface/transformers @ f62dc9bf2c90 스냅샷을 가리킨다.
 */
export default function ImageEmbeddingPipelineArticle() {
  const sidebar = useCodeSidebar();
  return (
    <div className="space-y-16">
      <Overview />
      <Preprocessing onCodeRef={sidebar.open} />
      <Pooling onCodeRef={sidebar.open} />
      <Similarity />
      <PipelineContract />
      <Evaluation />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ transformers: transformersTree }}
        projectMetas={PROJECT_META}
      />
    </div>
  );
}
