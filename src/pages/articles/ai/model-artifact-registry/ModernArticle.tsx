import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { RegistryParityViz } from "../experiment-tracking/viz/ModernExperimentViz";

export default function ModelArtifactRegistryArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Model registry는 이름표 목록이 아니라 immutable artifact를 production
          선택으로 연결하는 경계입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Model artifact registry</strong>는 학습 run의 model bytes를
            변경 불가능한 version으로 등록하고, 검토·승인·배포가 어떤 version을
            선택했는지 남기는 system입니다.
          </p>
          <p>
            metadata store와 artifact store를 분리하는 데서 출발합니다. 그 위에서 mutable alias를 immutable version으로 resolve해야
            registry 기록과 실제 endpoint를 대조할 수 있습니다.
          </p>
        </div>
        <TermBreakdown
          title="Registry를 이루는 네 대상"
          items={[
            {
              term: "Backend store",
              description:
                "Run, parameter, metric, tag와 artifact URI 같은 작은 metadata를 저장합니다.",
              example:
                "run-27 row가 model URI와 producer attempt를 가리킵니다.",
              boundary:
                "Database backup만으로 model bytes가 복구되지는 않습니다.",
            },
            {
              term: "Artifact store",
              description:
                "Model weights, tokenizer, signature, prediction fixture 같은 큰 object를 저장합니다.",
              example:
                "s3://models/sha256-abcd 아래 immutable bundle을 둡니다.",
              boundary:
                "URI가 존재해도 digest·schema·read 권한을 통과해야 usable artifact입니다.",
            },
            {
              term: "Immutable version",
              description:
                "특정 artifact digest와 source run에 고정된 등록 단위입니다.",
              example:
                "fraud-model version 17은 시간이 지나도 같은 bundle을 뜻합니다.",
              boundary:
                "Version number만 복사하지 않고 registry identity와 digest를 함께 기록합니다.",
            },
            {
              term: "Mutable alias",
              description:
                "champion·candidate처럼 승인 과정에서 다른 immutable version으로 이동할 수 있는 이름입니다.",
              example: "candidate가 v17에서 v21로 재할당됩니다.",
              boundary:
                "배포 영수증에는 alias 문자열이 아니라 resolve된 version을 고정합니다.",
            },
          ]}
        />
        <RegistryParityViz />
        <ContentBoundary article="model-artifact-registry" />
      </section>

      <section id="store-integrity" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Metadata와 artifact 중 하나만 남아도 run은 재생되지 않습니다
        </h2>
        <ExplainedFormula
          question="기록된 run을 실제로 replay할 수 있다고 판정하려면 어떤 검사를 모두 통과해야 하나요?"
          idea={
            <p>
              필수 object마다 존재·읽기 권한·digest·schema를 검사하고 하나라도 실패하면 전체 replayability를 실패로 둡니다.
            </p>
          }
          formula={String.raw`Q_{\rm replay}=Q_{\rm meta}\land\bigwedge_{a\in A_{\rm req}}(E_a\land R_a\land D_a\land S_a)`}
          annotatedFormula={String.raw`\begin{aligned}q_a&=\underbrace{E_a\land R_a\land D_a\land S_a}_{\text{한 artifact의 네 검사}}\\q_A&=\underbrace{\bigwedge_{a\in A_{\rm req}}q_a}_{\text{필수 artifact 전체를 AND}}\\Q_{\rm replay}&=\underbrace{Q_{\rm meta}\land q_A}_{\text{metadata와 object를 공동 복구}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`E_a\land R_a\land D_a\land S_a`,
              annotation: [
                "한 object의 네 검사를 AND해",
                "부분적으로 남은 artifact를 성공으로 오인하지 않음",
              ],
            },
            {
              expression: String.raw`\bigwedge_{a\in A_{\rm req}}`,
              annotation: [
                "필수 object 전체의 판정을 다시 AND해",
                "tokenizer·weights·signature 중 하나의 누락도 탐지",
              ],
            },
            {
              expression: String.raw`Q_{\rm meta}\land q_A`,
              annotation: [
                "DB metadata와 blob integrity를 결합해",
                "두 store를 함께 복구해야 replayable로 판정",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`A_{\rm req}`,
              name: "Required artifacts",
              description:
                "Model을 load·evaluate·serve하는 데 필요한 object 집합입니다.",
            },
            {
              symbol: String.raw`E_a,R_a`,
              name: "Existence · readability",
              description:
                "Object가 존재하고 해당 execution identity가 읽을 수 있는지 나타냅니다.",
            },
            {
              symbol: String.raw`D_a,S_a`,
              name: "Digest · schema checks",
              description:
                "Bytes가 기록과 같고 expected shape·signature를 만족하는지 나타냅니다.",
            },
            {
              symbol: String.raw`Q_{\rm replay}`,
              name: "Replayability gate",
              description:
                "Run metadata와 필수 objects를 실제로 재생할 수 있다는 최종 판정입니다.",
            },
          ]}
          assumptions={[
            "Required artifact manifest 자체가 versioned되어 있습니다.",
            "검사는 production과 같은 identity·network path로 수행합니다.",
            "Retention policy가 metadata와 artifact 사이에 dangling reference를 만들지 않습니다.",
          ]}
          interpretation="AND를 사용하는 이유는 어느 한 검사만 성공해도 load 가능한 model이 되는 것이 아니기 때문입니다. DB row가 살아 있어도 object가 삭제됐다면 결과는 false입니다."
        />
        <div id="paper-mlflow-artifact-store" className="scroll-mt-24">
          <CitationBlock
            source="MLflow: Artifact Stores"
            citeKey={1}
            href="https://mlflow.org/docs/latest/self-hosting/architecture/artifact-store/"
          >
            <strong>문제:</strong> Run metadata와 큰 artifact의 storage 역할을
            구분해야 함. <strong>기여:</strong> Backend store와 artifact store의
            책임·access configuration을 설명. <strong>전제:</strong> 배포 mode와
            provider 설정에 따라 경로가 달라짐. <strong>근거 범위:</strong> 현재
            MLflow self-hosting architecture. <strong>과장 금지:</strong>{" "}
            MLflow를 쓰면 digest 검증과 공동 복구가 자동 완성된다는 뜻은
            아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="alias-promotion" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Alias는 움직이므로 승인 순간의 resolve 결과를 영수증으로 고정합니다
        </h2>
        <ExplainedFormula
          question="candidate alias가 나중에 이동해도 승인한 model을 다시 찾으려면 무엇을 남겨야 하나요?"
          idea={
            <p>
              승인 시각의 alias를 immutable version으로 resolve한 뒤 artifact
              digest·정책·승인자를 같은 receipt에 결합합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}v^*&=\operatorname{resolve}(m,\alpha,t)\\\rho&=(m,\alpha,v^*,d,p,h,t)\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}v^*&=\underbrace{\operatorname{resolve}(m,\alpha,t)}_{\text{승인 시각의 alias를 immutable version으로 해석}}\\q_d&=\underbrace{\mathbf1[H(B_{v^*})=d]}_{\text{resolve된 version의 실제 bytes를 digest와 비교}}\\\rho&=\underbrace{(m,\alpha,v^*,d,p,h,t)}_{\text{선택·내용·정책·승인자·시각을 영수증으로 고정}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\operatorname{resolve}(m,\alpha,t)`,
              annotation: [
                "model과 alias를 승인 시각에 조회해",
                "움직이는 이름을 immutable version으로 변환",
              ],
            },
            {
              expression: String.raw`\mathbf1[H(B_{v^*})=d]`,
              annotation: [
                "load한 bytes를 hash하고 기록 digest와 비교해",
                "registry pointer와 실제 object의 일치 확인",
              ],
            },
            {
              expression: String.raw`(m,\alpha,v^*,d,p,h,t)`,
              annotation: [
                "판정에 필요한 모든 항목을 묶어",
                "사후 alias 이동과 독립적인 promotion receipt 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`m,\alpha`,
              name: "Model · alias",
              description:
                "Registered model identity와 candidate·champion 같은 mutable name입니다.",
            },
            {
              symbol: String.raw`v^*,d`,
              name: "Resolved version · digest",
              description:
                "승인 순간 선택된 immutable version과 artifact content identity입니다.",
            },
            {
              symbol: String.raw`p,h,t`,
              name: "Policy · approver · time",
              description:
                "통과한 policy revision, 승인 주체, 결정 시각입니다.",
            },
            {
              symbol: String.raw`\rho`,
              name: "Promotion receipt",
              description:
                "Alias 선택을 반복 검증할 수 있게 고정한 승인 기록입니다.",
            },
          ]}
          assumptions={[
            "Alias history와 registry mutations가 audit log에 남습니다.",
            "승인자는 policy가 요구한 separation of duties를 만족합니다.",
            "Artifact digest와 serving signature 검사가 promotion 전에 완료됩니다.",
          ]}
          interpretation="Alias만 배포 manifest에 쓰면 다음 resolve에서 다른 version을 받을 수 있습니다. 그래서 resolve 연산으로 version을 고정하고 digest 비교로 실제 bytes까지 닫습니다."
        />
        <div id="paper-mlflow-registry" className="scroll-mt-24">
          <CitationBlock
            source="MLflow: Model Registry Workflows"
            citeKey={2}
            href="https://mlflow.org/docs/latest/ml/model-registry/workflow/"
          >
            <strong>문제:</strong> Registered model version을 검토·조직·배포에
            연결해야 함. <strong>기여:</strong> Version·tag·mutable alias와
            alias 기반 loading workflow를 설명. <strong>전제:</strong>{" "}
            Self-hosted registry에는 지원 backend가 필요함.{" "}
            <strong>근거 범위:</strong> 현재 공식 registry workflow.{" "}
            <strong>과장 금지:</strong> Alias 자체가 승인 통제나 immutable
            deployment receipt를 제공한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="deployment-parity" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          Registry의 champion과 endpoint가 실제로 같은지 독립적으로 확인합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            시작할 때 endpoint는 loaded model version·artifact digest·container digest·serving config digest를 내보내고
            controller는 promotion receipt와 이 runtime attestation을 비교합니다. 이때 alias가 v21을 가리켜도 오래된 pod가 v17을 들고
            있다면 registry는 맞지만 deployment parity는 실패한 상태입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
