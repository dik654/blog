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
          Registry는 승인한 model과 실제 배포를 연결합니다
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
        <p className="font-semibold">그림을 보기 전에 세 가지를 예측해 보세요.</p>
        <ol className="list-decimal space-y-2 pl-6"><li>Run metadata database만 백업하면 model bytes까지 복구할 수 있을까요?</li><li>candidate 같은 alias는 시간이 지나며 다른 immutable version을 가리킬 수 있을까요?</li><li>배포 영수증에는 resolve된 version과 digest를 함께 고정해야 할까요?</li></ol>
        <p>답은 <strong>아니요, 예, 예</strong>입니다. Registry는 변경 가능한 선택 이름을 실제로 배포된 변경 불가능한 artifact와 연결하고 그 일치를 검증합니다.</p>
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
        <div id="databricks-unity-catalog" className="mt-10 scroll-mt-24">
          <h3 className="text-xl font-bold">
            Notebook 밖에서는 model을 찾지 못했습니다
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              (가정) 개발자는 laptop에서 MLflow server를 띄우고 `mlflow.db`와 local
              model directory에 weight를 기록했습니다. Notebook에서는 잘 열렸지만
              배포 worker는 그 laptop의 파일과 credential을 읽을 수 없었습니다. Run이
              사라진 것이 아니라 팀 경계 밖의 저장소에 있었던 사건입니다.
            </p>
            <p>
              혼자 실험할 때는 한 host의 SQLite와 local directory로 기록과 큰 파일을
              함께 보관할 수 있습니다. 팀이 함께 쓰기 시작하면 기록용 database, model을
              둘 object storage와 tracking server의 접근 권한을 나눠 운영해야 합니다.
            </p>
            <p>
              Databricks를 쓰면 이 역할 일부를 managed MLflow와 Unity Catalog가 맡습니다.
              그래도 model을 찾는 이름과 실행 권한이 저절로 같아지는 것은 아닙니다.
            </p>
          </div>
          <div className="not-prose my-8 max-w-full overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left text-sm">
              <thead><tr className="border-y border-border bg-muted/30"><th className="px-3 py-3">경계</th><th className="px-3 py-3">local 실습</th><th className="px-3 py-3">팀·production</th><th className="px-3 py-3">복구 시험</th></tr></thead>
              <tbody className="divide-y divide-border">{[
                ["Run metadata", "SQLite on one host", "shared SQL backend 또는 managed tracking", "DB와 schema migration을 함께 복원"],
                ["큰 model 파일", "local directory", "object store·managed file storage", "URI가 아니라 실제 bytes와 digest를 읽음"],
                ["Model identity", "짧은 local name", "catalog.schema.model + immutable version", "다른 workspace identity로 load"],
                ["Promotion", "사람이 파일 경로 변경", "권한이 있는 주체가 alias 이동", "alias history와 resolve된 version 대조"],
                ["Serving", "notebook process", "endpoint가 고정 model version을 load", "READY·model version·test prediction 확인"],
              ].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell} className="px-3 py-3 leading-6 text-muted-foreground">{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              Unity Catalog의 model 이름은 `catalog.schema.model`처럼 세 단계로 읽습니다.
              첫 단계는 조직의 data domain, 두 번째는 팀이나 lifecycle 경계, 마지막은
              registered model입니다. 이름을 안다고 load할 수 있는 것은 아닙니다. 상위
              catalog·schema를 사용할 권한과 model 실행 권한을 함께 확인해야 합니다.
            </p>
          </div>
          <pre className="not-prose my-6 max-w-full overflow-x-auto rounded-xl border border-border bg-muted/20 p-4 text-sm leading-6"><code>{`import mlflow
from mlflow import MlflowClient

model_name = "prod.ml_team.claims_model"
client = MlflowClient()

# 움직이는 이름은 결정 시점에 한 번만 해석한다.
resolved = client.get_model_version_by_alias(model_name, "Champion")
deploy_choice = {
    "model_name": model_name,
    "alias": "Champion",
    "resolved_version": resolved.version,
    "source_run_id": resolved.run_id,
}

# 배포 설정에는 alias가 아니라 위에서 고정한 version을 넣는다.
model_uri = f"models:/{model_name}/{deploy_choice['resolved_version']}"`}</code></pre>
          <div className="not-prose my-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-emerald-600/30 bg-emerald-500/5 p-4"><p className="text-xs font-bold uppercase tracking-wide">정상 판독 · 예시 출력</p><pre className="mt-3 whitespace-pre-wrap rounded-lg bg-background p-3 text-xs leading-5"><code>{`name: prod.ml_team.claims_model
Champion → version 22
endpoint loaded_version: 22
state: READY`}</code></pre><p className="mt-3 text-sm leading-6 text-muted-foreground">Alias 해석 결과와 endpoint가 실제로 읽은 version이 같습니다. Model digest와 test prediction까지 통과해야 parity를 닫습니다.</p></div>
            <div className="rounded-xl border border-rose-600/30 bg-rose-500/5 p-4"><p className="text-xs font-bold uppercase tracking-wide">실패 판독 · 예시 출력</p><pre className="mt-3 whitespace-pre-wrap rounded-lg bg-background p-3 text-xs leading-5"><code>{`Champion → version 22
endpoint loaded_version: 21
state: READY`}</code></pre><p className="mt-3 text-sm leading-6 text-muted-foreground">Endpoint가 READY여도 승인한 model을 싣지 않았습니다. READY와 registry parity를 서로 다른 gate로 둡니다.</p></div>
          </div>
          <CitationBlock source="MLflow · Backend Stores" citeKey={3} href="https://mlflow.org/docs/latest/self-hosting/architecture/backend-store/">현재 문서는 run·model·trace의 metadata를 backend store에 두고 큰 weight 같은 파일을 artifact store에 둡니다. SQLite는 현재 기본 local backend지만 높은 동시성의 production에서는 shared relational database를 검토해야 합니다.</CitationBlock>
          <CitationBlock source="Databricks · Models in Unity Catalog" citeKey={4} href="https://docs.databricks.com/aws/en/machine-learning/manage-model-lifecycle/">공식 lifecycle은 세 단계 model 이름, version과 alias, 상위 catalog·schema 권한을 함께 사용합니다. Alias를 이동할 권한과 model을 실행할 권한은 별도로 검토해야 합니다.</CitationBlock>
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
          <p>
            Databricks Model Serving을 쓰는 경우에도 생성 요청의 `served_entities`에
            Unity Catalog model의 전체 이름과 version을 고정하고, 배포 뒤 endpoint
            상태와 실제 test prediction을 읽습니다. Cold start나 `READY` 표시는
            model digest·input signature·업무 지표를 대신하지 않습니다.
          </p>
        </div>
        <CitationBlock source="Databricks · Create custom model serving endpoints" citeKey={5} href="https://docs.databricks.com/aws/en/machine-learning/model-serving/create-manage-serving-endpoints">현재 공식 API는 Unity Catalog의 전체 model 이름과 명시적인 version을 served entity에 지정합니다. Endpoint 생성 권한, resource access와 READY 상태는 별도 조건입니다.</CitationBlock>
      </section>
    </div>
  );
}
