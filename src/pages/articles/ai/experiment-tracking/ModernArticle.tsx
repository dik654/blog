import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { ProvenanceDagViz } from "./viz/ModernExperimentViz";

export default function ExperimentTrackingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          실험 추적은 chart가 아니라 결과에서 input까지 돌아가는
          provenance입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            “validation loss 0.213”은 결과 숫자일 뿐입니다.{" "}
            <strong>Experiment provenance</strong>는 그 숫자에서 evaluation
            report·prediction·checkpoint·실행 attempt·고정된 입력까지 거슬러 갈
            수 있게 만드는 방향 있는 graph입니다.
          </p>
          <p>
            먼저 같은 실험 조건과 같은 실행을 구분합니다. 같은
            code·data·split·config를 seed만 바꿔 반복한 실행은 같은
            specification 아래의 다른 attempts입니다. Worker 장애 뒤 retry도
            이전 attempt를 덮어쓰지 않습니다.
          </p>
        </div>
        <TermBreakdown
          title="Provenance graph의 네 node"
          items={[
            {
              term: "Experiment spec",
              description:
                "Code·data·split·resolved config·environment·command를 묶은 변경 불가능한 실행 조건입니다.",
              example:
                "Git tree·dataset digest·fold manifest·container digest를 함께 hash합니다.",
              boundary:
                "사람이 붙인 run name은 검색 label이지 identity가 아닙니다.",
            },
            {
              term: "Attempt",
              description: "Spec을 실제로 한 번 실행한 사건입니다.",
              example: "Seed 2, retry 1, worker gpu-07을 별도 ID로 남깁니다.",
              boundary: "실패 attempt도 exit code와 last step을 보존합니다.",
            },
            {
              term: "Artifact",
              description:
                "Attempt가 읽거나 만든 versioned data·checkpoint·prediction·report입니다.",
              example:
                "URI와 bytes digest·schema·size·producer attempt를 함께 저장합니다.",
              boundary:
                "latest.pt 같은 위치 문자열만으로 내용을 식별하지 않습니다.",
            },
            {
              term: "Provenance edge",
              description:
                "Attempt가 어떤 artifact를 읽고 무엇을 만들었는지 나타내는 관계입니다.",
              example:
                "split-v4 → run-27 → prediction-v8 → report-v3 흐름입니다.",
              boundary:
                "Node 목록만 있고 producer/consumer edge가 없으면 재계산 경로를 찾기 어렵습니다.",
            },
          ]}
        />
        <ProvenanceDagViz />
        <ContentBoundary article="experiment-tracking" />
      </section>
      <section id="spec-attempt" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Spec digest는 조건을, attempt ID는 실제 실행을 식별합니다
        </h2>
        <ExplainedFormula
          question="Configuration이 같은 반복과 조건이 다른 실험을 어떻게 기계적으로 구분하나요?"
          idea={
            <p>
              정규화한 immutable inputs를 순서대로 직렬화해 spec digest를
              만들고, seed·retry·worker를 붙여 실제 attempt를 구분합니다.
            </p>
          }
          formula={String.raw`d_s=H(c\Vert d\Vert s\Vert g\Vert e\Vert k),\quad a=(d_s,z,r,w)`}
          annotatedFormula={String.raw`\begin{aligned}b_s&=\underbrace{\operatorname{encode}(c,d,s,g,e,k)}_{\text{실행 조건을 정규 순서로 직렬화}}\\d_s&=\underbrace{H(b_s)}_{\text{조건 bytes를 immutable identity로 압축}}\\a&=\underbrace{(d_s,z,r,w)}_{\text{seed·retry·worker를 붙여 attempt 구분}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\operatorname{encode}(c,d,s,g,e,k)`,
              annotation: [
                "code·data·split·config·environment·command를",
                "정해진 schema와 순서로 직렬화",
              ],
            },
            {
              expression: String.raw`H(b_s)`,
              annotation: [
                "정규화된 spec bytes를 hash해",
                "내용 기반 identity 생성",
              ],
            },
            {
              expression: String.raw`(d_s,z,r,w)`,
              annotation: [
                "같은 spec에 실행 좌표를 붙여",
                "반복·retry가 덮어쓰이지 않게 분리",
              ],
            },
          ]}
          terms={[
            {
              symbol: "c,d,s",
              name: "Code · data · split",
              description:
                "Code revision, immutable dataset과 split manifest입니다.",
            },
            {
              symbol: "g,e,k",
              name: "Config · environment · command",
              description:
                "Resolved config, image/dependencies/hardware, 실제 entry command입니다.",
            },
            {
              symbol: String.raw`d_s`,
              name: "Spec digest",
              description: "실행 조건 전체의 content identity입니다.",
            },
            {
              symbol: "z,r,w",
              name: "Seed · retry · worker",
              description: "같은 조건 아래 실제 attempt를 구분하는 좌표입니다.",
            },
          ]}
          assumptions={[
            "Mutable external input은 snapshot 또는 as-of version으로 고정합니다.",
            "Secret 원문은 제외하되 provider·secret version·policy를 기록합니다.",
            "Serialization schema와 default resolution도 versioning합니다.",
          ]}
          interpretation="Config 한 필드가 달라지면 spec digest가 달라집니다. 같은 digest를 seed 1·2로 실행하면 두 attempts는 다르지만 같은 조건의 반복입니다."
        />
      </section>
      <section id="artifact-reference" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Artifact는 위치·내용·형태·생산자를 함께 가리킵니다
        </h2>
        <ExplainedFormula
          question="URI가 바뀌거나 덮어써져도 과거 artifact를 같은 것으로 확인하려면 무엇이 필요한가요?"
          idea={
            <p>
              Object 위치와 실제 bytes digest, 해석 schema, 크기, producer
              attempt를 하나의 reference로 저장하고 소비 시 다시 검증합니다.
            </p>
          }
          formula={String.raw`R_a=(u_a,H(B_a),\sigma_a,n_a,p_a)`}
          annotatedFormula={String.raw`\begin{aligned}d_a&=\underbrace{H(B_a)}_{\text{다운로드한 bytes의 내용 identity}}\\q_a&=\underbrace{\mathbf1[d_a=d_a^{\rm recorded}]}_{\text{기록된 digest와 실제 bytes 비교}}\\R_a&=\underbrace{(u_a,d_a,\sigma_a,n_a,p_a)}_{\text{위치·내용·schema·크기·producer 결합}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`H(B_a)`,
              annotation: [
                "artifact bytes를 hash해",
                "위치와 독립적인 content identity 생성",
              ],
            },
            {
              expression: String.raw`\mathbf1[d_a=d_a^{\rm recorded}]`,
              annotation: [
                "실제 digest를 producer 기록과 비교해",
                "변조·덮어쓰기 여부 판정",
              ],
            },
            {
              expression: String.raw`(u_a,d_a,\sigma_a,n_a,p_a)`,
              annotation: [
                "저장 위치와 semantic metadata를 묶어",
                "재생 가능한 artifact reference 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`u_a`,
              name: "URI",
              description: "Artifact object를 읽을 storage location입니다.",
            },
            {
              symbol: String.raw`B_a,d_a`,
              name: "Bytes · digest",
              description: "실제 serialized content와 그 hash입니다.",
            },
            {
              symbol: String.raw`\sigma_a`,
              name: "Schema",
              description:
                "Shape·row ID·class order·dtype 같은 해석 계약입니다.",
            },
            {
              symbol: String.raw`p_a`,
              name: "Producer",
              description: "Artifact를 만든 immutable attempt입니다.",
            },
          ]}
          assumptions={[
            "Logical content digest와 physical serialization digest의 범위를 구분합니다.",
            "Metadata보다 artifact retention이 짧아 dangling reference가 생기지 않게 합니다.",
            "Schema fixture로 row count·ID uniqueness·shape를 실제 검사합니다.",
          ]}
          interpretation="s3://bucket/model/latest.pt만 저장하면 내일 다른 bytes를 가리킬 수 있습니다. Digest·schema·producer가 있어야 과거 report의 정확한 model을 찾습니다."
        />
      </section>
      <section id="provenance-receipt" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          실패 attempt까지 남겨야 성공 결과만 보이는 편향을 막습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Run 종료 receipt에는 exit code·last step·stderr·partial outputs와
            required artifact checks를 포함합니다. 성공한 checkpoint만 남기면
            어떤 configuration이 OOM이나 data error를 만들었는지 사라집니다.
          </p>
          <p>
            다음 수업에서는 이 provenance 위에 metric observation을 쌓는{" "}
            <Link to="/ai/learning-curve-tracking">
              learning-curve tracking
            </Link>
            을 다룹니다.
          </p>
        </div>
        <div id="paper-mlflow-lifecycle" className="scroll-mt-24">
          <CitationBlock
            source="Accelerating the Machine Learning Lifecycle with MLflow"
            citeKey={1}
            href="https://people.eecs.berkeley.edu/~alig/papers/mlflow.pdf"
          >
            <strong>문제:</strong> 서로 다른 library와 deployment에서
            experiment·run·model을 공통 관리하기 어려움. <strong>기여:</strong>{" "}
            Tracking·Projects·Models의 초기 open interface.{" "}
            <strong>전제:</strong> 2018년 초기 MLflow architecture.{" "}
            <strong>근거 범위:</strong> 논문의 design·use cases.{" "}
            <strong>과장 금지:</strong> 현재 registry·alias API가 그대로라는
            뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
