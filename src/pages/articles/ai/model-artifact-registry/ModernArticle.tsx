import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import {
  ModelArtifactRegistryLocator,
  ModelArtifactRegistryReturn,
} from "../shared/ModelDeliveryPathLocator";
import ModelArtifactRegistryViz from "./ModelArtifactRegistryViz";

export default function ModelArtifactRegistryArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <ModelArtifactRegistryLocator />
        <ModelArtifactRegistryViz />

        <h2 className="mb-6 text-2xl font-bold">
          1. 승인한 v21과 고객 요청을 처리하는 v21이 같은지 끝까지 확인합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            고객 문의의 위험도를 분류하는 <code>prod.ml_team.claims_model</code>을
            배포한다고 하겠습니다. 학습 실행 <code>run-27</code>은 모델 파일 묶음을
            만들었고 레지스트리는 이를 변경 불가능한 버전 <code>v21</code>로
            등록했습니다. 승인자는 <code>Champion</code> 별명이 가리키던 v21을
            승인했고, 새 endpoint도 v21을 읽었다고 보고합니다.
          </p>
          <p>
            여기까지 이름만 같다고 충분하지 않습니다. 데이터베이스의 v21 행이 실제
            object의 바이트를 가리키는지, 승인 순간의 별명이 어느 버전이었는지, 배포
            명세와 실행 중인 Pod가 같은 bundle·container·config digest를 쓰는지 차례로
            대조해야 합니다. 어느 경계든 끊어지면 “승인한 모델을 배포했다”는 말은
            증명되지 않습니다.
          </p>
          <p>
            이 글의 run ID, 모델 이름, 버전, digest, 승인자와 시각은 전체 흐름을
            설명하기 위한 가정입니다. 특정 회사의 배포 기록이나 측정 결과가 아닙니다.
          </p>
        </div>

        <TermBreakdown
          title="한 모델을 추적한 뒤 붙이는 네 이름"
          items={[
            {
              term: "Backend store",
              description: "실행 ID, 모델 버전, 지표, tag와 object URI 같은 작은 기록을 보관합니다.",
              example: "run-27이 claims_model v21과 bundle URI를 만들었다는 행을 저장합니다.",
              boundary: "행이 남아 있어도 실제 모델 바이트가 복구됐다는 뜻은 아닙니다.",
            },
            {
              term: "Artifact store",
              description: "가중치, tokenizer, signature, 검증 fixture 같은 큰 파일을 보관합니다.",
              example: "v21 bundle의 실제 바이트와 각 파일 digest를 object storage에 둡니다.",
              boundary: "URI가 있다는 사실만으로 읽기 권한·내용·schema가 맞다고 볼 수 없습니다.",
            },
            {
              term: "Immutable version",
              description: "특정 실행과 모델 파일 묶음에 고정된 등록 단위입니다.",
              example: "claims_model v21은 시간이 지나도 같은 승인 대상을 가리킵니다.",
              boundary: "버전 번호가 다른 registry나 모델 이름에서는 다른 대상을 뜻할 수 있습니다.",
            },
            {
              term: "Mutable alias",
              description: "Champion처럼 다른 고정 버전으로 옮길 수 있는 선택 이름입니다.",
              example: "오늘 Champion은 v21이지만 다음 승인 뒤에는 v25가 될 수 있습니다.",
              boundary: "과거 승인 기록에는 별명만 두지 않고 당시 해석한 버전과 digest를 남깁니다.",
            },
          ]}
        />
        <ContentBoundary article="model-artifact-registry" />
      </section>

      <section id="store-integrity" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          2. 데이터베이스 행과 필수 파일 네 개를 함께 복구합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            v21의 필수 파일을 <code>weights.safetensors</code>, <code>tokenizer.json</code>,
            <code>signature.json</code>, <code>fixture.jsonl</code>로 정했다고
            하겠습니다. backend DB에는 이 목록과 object URI가 있고, 실제 바이트는
            object store에 있습니다. DB backup만 성공하고 object가 지워졌다면
            v21이라는 이름은 남아도 모델을 다시 읽을 수 없습니다.
          </p>
          <p>
            각 파일에 대해 존재 여부, 배포 identity의 읽기 권한, 기록한 digest와의
            일치, 필요한 schema를 모두 검사합니다. 네 파일 중 하나라도 실패하면
            <code>replayable=false</code>로 두고 promotion 대상에서 제외합니다. 백업
            복구 시험도 DB와 object store의 같은 복구 시점을 짝지어 수행해야 합니다.
          </p>
        </div>
        <ExplainedFormula
          question="기록된 모델 버전을 실제로 다시 읽을 수 있다고 판정하려면 어떤 검사를 모두 통과해야 하나요?"
          idea={
            <p>
              backend metadata가 복구되었는지 먼저 보고, 필수 파일마다 존재·읽기·digest·schema를 검사합니다. 하나라도 거짓이면 전체 판정도 거짓입니다.
            </p>
          }
          formula={String.raw`Q_{replay}=Q_{meta}\land\bigwedge_{a\in A_{req}}(E_a\land R_a\land D_a\land S_a)`}
          annotatedFormula={String.raw`\begin{aligned}q_a&=\underbrace{E_a\land R_a\land D_a\land S_a}_{\text{파일 a의 존재·읽기·digest·schema 검사}}\\q_A&=\underbrace{\bigwedge_{a\in A_{req}}q_a}_{\text{필수 파일 전체를 AND}}\\Q_{replay}&=\underbrace{Q_{meta}\land q_A}_{\text{metadata와 실제 object를 공동 판정}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`E_a\land R_a\land D_a\land S_a`,
              annotation: [
                "한 파일에 필요한 네 검사를 묶어",
                "위치만 남거나 내용이 바뀐 파일을 실패로 판정",
              ],
            },
            {
              expression: String.raw`\bigwedge_{a\in A_{req}}`,
              annotation: [
                "필수 파일의 판정을 모두 AND해",
                "tokenizer나 signature 하나의 누락도 숨기지 않음",
              ],
            },
            {
              expression: String.raw`Q_{meta}\land q_A`,
              annotation: [
                "DB 기록과 object 검사를 다시 결합해",
                "두 저장소가 함께 복구된 경우만 재생 가능으로 판정",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`A_{req}`,
              name: "필수 파일 집합",
              description: "모델을 읽고 입력을 검사하며 smoke test를 수행하는 데 필요한 파일 목록입니다.",
            },
            {
              symbol: String.raw`E_a,R_a`,
              name: "존재 · 읽기",
              description: "object가 존재하고 실제 배포 identity로 다운로드할 수 있는지 나타냅니다.",
            },
            {
              symbol: String.raw`D_a,S_a`,
              name: "내용 · 해석",
              description: "다운로드한 바이트의 digest와 shape·입력 signature 같은 schema가 기록과 같은지 나타냅니다.",
            },
            {
              symbol: String.raw`Q_{replay}`,
              name: "재생 가능 판정",
              description: "해당 버전을 실제로 load하고 검증할 수 있다는 최종 gate입니다.",
            },
          ]}
          assumptions={[
            "필수 파일 목록 자체도 버전 관리하고 v21의 승인 기록에 고정합니다.",
            "검사는 개발자 노트북이 아니라 실제 배포와 같은 network path와 identity로 수행합니다.",
            "retention 정책이 DB 행보다 object를 먼저 지워 dangling reference를 만들지 않게 합니다.",
          ]}
          interpretation="v21의 DB 행이 살아 있어도 tokenizer.json이 사라졌다면 네 파일의 AND가 false가 됩니다. 따라서 v21은 등록돼 있지만 재생 가능한 배포 후보는 아닙니다."
        />
        <div id="paper-mlflow-artifact-store" className="scroll-mt-24">
          <CitationBlock
            source="MLflow · Backend Stores와 Artifact Stores"
            citeKey={1}
            href="https://mlflow.org/docs/latest/tracking/backend-stores/"
          >
            2026-10-26에 확인한 공식 문서는 run·model·trace의 metadata를 backend
            store에, 가중치 같은 큰 파일을 artifact store에 둔다고 구분합니다.
            MLflow 3.17.1의 기능 존재를 확인했지만, 두 저장소의 같은 시점 백업과 위
            digest gate가 자동으로 완성된다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="alias-promotion" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          3. 움직이는 Champion을 승인 순간의 v21로 바꿔 적습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <code>Champion</code>은 운영에 쓸 모델을 사람이 읽기 쉽게 나타내는
            별명입니다. 오늘 v21을 가리키고 다음 주 v25로 이동할 수 있습니다. 배포
            기록에 <code>models:/prod.ml_team.claims_model@Champion</code>만 남기면
            나중에 같은 문자열을 읽었을 때 다른 모델을 받을 수 있습니다.
          </p>
          <p>
            승인 작업은 Champion을 한 번 해석해 v21을 얻고, 실제 bundle을 다시 hash한
            뒤 모델 이름·별명·고정 버전·digest·정책·승인자·시각을
            <code>promotion-84</code>에 묶습니다. 별명이 이동해도 과거 결정은 이 기록으로
            다시 찾을 수 있습니다.
          </p>
        </div>
        <ExplainedFormula
          question="Champion이 나중에 이동해도 승인한 모델을 다시 찾으려면 무엇을 고정해야 하나요?"
          idea={
            <p>
              승인 시각의 별명을 고정 버전으로 해석하고 실제 바이트의 digest를 확인한 뒤, 선택과 승인 근거를 한 기록에 결합합니다.
            </p>
          }
          formula={String.raw`v^*=resolve(m,\alpha,t),\quad \rho=(m,\alpha,v^*,d,p,h,t)`}
          annotatedFormula={String.raw`\begin{aligned}v^*&=\underbrace{resolve(m,\alpha,t)}_{\text{승인 시각의 별명을 고정 버전으로 해석}}\\q_d&=\underbrace{\mathbf1[H(B_{v^*})=d]}_{\text{실제 bundle bytes를 기록 digest와 비교}}\\\rho&=\underbrace{(m,\alpha,v^*,d,p,h,t)}_{\text{선택·내용·정책·승인자·시각을 한 기록으로 고정}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`resolve(m,\alpha,t)`,
              annotation: [
                "모델 m의 별명 α를 승인 시각 t에 조회해",
                "이후 이동하지 않는 버전 v*를 얻음",
              ],
            },
            {
              expression: String.raw`\mathbf1[H(B_{v^*})=d]`,
              annotation: [
                "버전이 가리킨 실제 바이트를 다시 hash해",
                "registry pointer와 저장 내용의 일치를 확인",
              ],
            },
            {
              expression: String.raw`(m,\alpha,v^*,d,p,h,t)`,
              annotation: [
                "선택 identity와 승인 근거를 한 묶음으로 저장해",
                "과거 결정을 별명의 현재 값과 분리",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`m,\alpha`,
              name: "모델 · 별명",
              description: "등록된 모델 identity와 Champion 같은 변경 가능한 선택 이름입니다.",
            },
            {
              symbol: String.raw`v^*,d`,
              name: "고정 버전 · digest",
              description: "승인 순간 선택된 v21과 그 bundle 내용의 식별값입니다.",
            },
            {
              symbol: String.raw`p,h,t`,
              name: "정책 · 승인자 · 시각",
              description: "통과한 정책 revision, 결정 권한을 가진 주체와 승인 시각입니다.",
            },
            {
              symbol: String.raw`\rho`,
              name: "승인 기록",
              description: "별명 이동과 무관하게 과거 선택을 다시 확인하는 promotion receipt입니다.",
            },
          ]}
          assumptions={[
            "별명 변경과 registry mutation은 감사 로그에 남습니다.",
            "승인자는 정책이 요구한 역할 분리와 권한을 충족합니다.",
            "v21의 무결성 gate와 입력 signature 검사가 승인 전에 통과했습니다.",
          ]}
          interpretation="Champion만 저장했다면 별명이 v25로 이동한 뒤 promotion-84가 무엇을 승인했는지 잃습니다. v21과 digest를 함께 고정해야 과거 승인을 재현할 수 있습니다."
        />
        <pre className="not-prose my-6 max-w-full overflow-x-auto rounded-xl border border-border bg-muted/20 p-4 text-sm leading-6"><code>{`from mlflow import MlflowClient

# 변경 가능한 Champion을 결정 시점에 한 번 해석합니다.
client = MlflowClient()
resolved = client.get_model_version_by_alias(
    "prod.ml_team.claims_model",
    "Champion",
)

# 승인 기록에는 별명만 두지 않고 고정 버전과 실제 내용 식별값을 남깁니다.
promotion_receipt = {
    "promotion_id": "promotion-84",
    "model_name": resolved.name,
    "alias": "Champion",
    "resolved_version": resolved.version,
    "bundle_digest": "sha256:9b7e...",
    "policy_revision": "release-policy-v6",
}`}</code></pre>
        <div id="paper-mlflow-registry" className="scroll-mt-24">
          <CitationBlock
            source="MLflow 3.17.1 · Model Registry Workflows"
            citeKey={2}
            href="https://github.com/mlflow/mlflow/blob/v3.17.1/docs/docs/classic-ml/model-registry/workflow.mdx"
          >
            공식 workflow는 model version을 고정 단위로 두고 alias를 특정 version에
            붙였다가 다시 할당할 수 있는 이름으로 설명합니다. 이 기능은 alias 해석을
            제공하지만, 여기서 사용하는 promotion-84 형식과 승인 통제는 별도의 설계입니다.
          </CitationBlock>
        </div>
      </section>

      <section id="deployment-parity" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          4. READY가 아니라 승인 기록과 실행 중인 endpoint를 대조합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            배포 controller는 promotion-84에서 v21을 읽어 배포 명세에 고정합니다. 새
            Pod는 시작할 때 loaded model version, bundle digest, container digest,
            serving config digest를 runtime attestation으로 내보냅니다. controller는
            이 값을 승인 기록과 비교한 뒤에만 새 Pod를 트래픽 대상에 넣습니다.
          </p>
          <p>
            기존 v17과 새 v21이 canary 동안 90%·10%로 공존하는 것은 오류가 아닙니다.
            배포 기록에 허용 버전과 트래픽 비율이 명시되어 있다면 의도한 중간 상태입니다.
            반대로 endpoint 상태가 READY여도 새 Pod가 v17을 읽었거나 v21의 config
            digest가 다르면 parity는 실패합니다.
          </p>
        </div>
        <ExplainedFormula
          question="승인 기록과 실제 실행 상태가 같다는 판정은 어떤 항목을 비교해야 하나요?"
          idea={
            <p>
              모델 버전뿐 아니라 모델 bundle, container와 serving config의 digest를 각각 비교하고 모두 일치할 때만 트래픽을 허용합니다.
            </p>
          }
          formula={String.raw`Q_{serve}=Q_v\land Q_b\land Q_c\land Q_g\land Q_{smoke}`}
          annotatedFormula={String.raw`\begin{aligned}Q_v&=\underbrace{\mathbf1[v_{run}=v_{approved}]}_{\text{실행 버전과 승인 버전 비교}}\\Q_bQ_cQ_g&=\underbrace{\mathbf1[d_b=d_b^*]\mathbf1[d_c=d_c^*]\mathbf1[d_g=d_g^*]}_{\text{bundle·container·config digest 비교}}\\Q_{serve}&=\underbrace{Q_v\land Q_b\land Q_c\land Q_g\land Q_{smoke}}_{\text{identity와 실제 예측을 모두 통과}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbf1[v_{run}=v_{approved}]`,
              annotation: [
                "Pod가 실제로 읽은 버전을 승인 기록과 비교해",
                "READY인 오래된 v17 Pod를 실패로 판정",
              ],
            },
            {
              expression: String.raw`Q_bQ_cQ_g`,
              annotation: [
                "모델 파일·실행 image·설정을 각각 대조해",
                "같은 v21 이름 아래의 다른 실행 조건을 탐지",
              ],
            },
            {
              expression: String.raw`Q_{serve}`,
              annotation: [
                "identity 대조와 smoke prediction을 모두 AND해",
                "일치한 새 Pod에만 트래픽 편입을 허용",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`v_{run},v_{approved}`,
              name: "실행 버전 · 승인 버전",
              description: "현재 Pod가 읽은 모델 버전과 promotion-84가 고정한 버전입니다.",
            },
            {
              symbol: String.raw`d_b,d_c,d_g`,
              name: "Bundle · container · config digest",
              description: "모델 내용, 실행 image와 serving 설정을 각각 식별합니다.",
            },
            {
              symbol: String.raw`Q_{smoke}`,
              name: "Smoke prediction",
              description: "고정 fixture를 실제 endpoint에 넣어 signature와 최소 동작을 확인한 결과입니다.",
            },
            {
              symbol: String.raw`Q_{serve}`,
              name: "트래픽 편입 gate",
              description: "새 Pod가 승인한 실행 계약을 만족해 요청을 받을 수 있다는 판정입니다.",
            },
          ]}
          assumptions={[
            "runtime attestation은 Pod가 실제 load를 마친 뒤 생성합니다.",
            "controller가 읽는 승인 기록은 변경 불가능하며 배포별로 고유합니다.",
            "canary에서는 허용 버전 집합과 각 트래픽 비율을 별도 배포 기록에 고정합니다.",
          ]}
          interpretation="claims-prod가 READY여도 loaded_version=v17이면 Qv가 false입니다. version이 v21이어도 config digest가 다르면 Qg가 false이므로 새 Pod에 트래픽을 보내지 않습니다."
        />

        <div id="databricks-unity-catalog" className="mt-10 scroll-mt-24">
          <h3 className="text-xl font-bold">
            Unity Catalog를 써도 이름·권한·배포 상태는 서로 다른 경계입니다
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              Databricks의 현재 공식 lifecycle은 <code>catalog.schema.model</code>의
              세 단계 이름, model version과 alias를 사용합니다. 이름을 안다고 실행할
              수 있는 것은 아닙니다. catalog·schema 사용 권한과 model 실행 권한이
              필요하며, <code>prod</code> catalog에 등록했다는 사실도 production
              traffic을 받고 있다는 뜻은 아닙니다.
            </p>
            <p>
              endpoint update 시에는 Champion을 먼저 해석해 얻은 version을 served
              entity에 넣고, 배포 뒤 endpoint가 실제로 읽은 version과 smoke prediction을
              확인합니다. 별명을 직접 읽는 batch workload는 다음 실행에서 새 version을
              자동으로 받을 수 있으므로, 감사 가능한 고정 배포와 의도적으로 최신 별명을
              따르는 작업을 구분해야 합니다.
            </p>
          </div>
          <CitationBlock
            source="Databricks · Models in Unity Catalog"
            citeKey={3}
            href="https://learn.microsoft.com/en-us/azure/databricks/machine-learning/manage-model-lifecycle/"
          >
            2026-10-26에 확인한 공식 문서는 세 단계 모델 이름, 변경 가능한 alias,
            version 번호 로딩과 alias를 해석해 serving endpoint를 갱신하는 흐름을
            구분합니다. Unity Catalog 사용 여부와 runtime version parity는 별개의
            검증입니다.
          </CitationBlock>
          <CitationBlock
            source="Databricks · Create custom model serving endpoints"
            citeKey={4}
            href="https://learn.microsoft.com/en-us/azure/databricks/machine-learning/model-serving/create-manage-serving-endpoints"
          >
            공식 endpoint 생성 흐름은 Unity Catalog 모델과 명시적인 version, 여러 served
            entity의 traffic percentage를 설정합니다. endpoint READY 상태가 이 글의
            bundle·container·config digest 검사를 대신한다는 주장은 하지 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="failure-paths" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          5. 실패한 경계에 따라 차단·복구·재배포 위치가 달라집니다
        </h2>
        <div className="not-prose max-w-full overflow-x-auto">
          <table className="w-full min-w-[780px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-y border-border bg-muted/30">
                <th className="px-3 py-3">관찰한 상태</th>
                <th className="px-3 py-3">판정</th>
                <th className="px-3 py-3">차단 위치</th>
                <th className="px-3 py-3">복구 뒤 확인</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["DB에는 v21, object 하나 없음", "재생 불가", "promotion 전", "같은 복구 시점의 object와 digest"],
                ["Champion은 v25, promotion-84는 v21", "정상적인 과거 기록", "차단 없음", "배포가 promotion-84의 v21을 유지하는지"],
                ["endpoint READY, loaded v17", "배포 parity 실패", "Service endpoint 편입 전", "v21 runtime attestation과 smoke prediction"],
                ["canary v17 90%·v21 10%", "명세와 같으면 정상", "허용 비율 초과 시", "버전별 요청·오류·traffic fraction"],
                ["v21이지만 config digest 불일치", "실행 계약 실패", "트래픽 확대 전", "승인 config로 새 Pod 재배포"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={cell} className="px-3 py-3 leading-6 text-muted-foreground">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          <p>
            레지스트리의 책임은 파일을 등록하는 데서 끝나지 않습니다. 다만 레지스트리가
            Kubernetes rollout을 직접 복구하거나 object backup을 자동으로 복원한다고
            가정해서도 안 됩니다. 저장소 복구, 승인 상태, 배포 controller와 runtime
            probe의 authoritative writer를 나누고 서로 전달하는 identity를 고정해야
            합니다.
          </p>
          <p>
            다음 글에서는 이 묶음을 빈 worker에 가져가 같은 결과를 다시 만들 수 있는지
            검사합니다. 레지스트리 parity가 통과해도 GPU·library·난수 stream이 달라지면
            수치 결과가 달라질 수 있으므로 재현 수준을 별도로 선언해야 합니다.
          </p>
        </div>
        <ModelArtifactRegistryReturn />
      </section>
    </div>
  );
}
