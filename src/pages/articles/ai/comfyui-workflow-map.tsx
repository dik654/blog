import {
  BeginnerOpening,
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { WorkflowContractViz } from './comfyui-runtime/viz/WorkflowRuntimeViz';

const artifacts = [
  ['workflow.ui.json', '사람이 다시 열고 편집할 canvas, group, note와 widget 상태'],
  ['workflow.api.json', '실행 서버에 제출할 node ID, class_type, input과 link snapshot'],
  ['dependencies.lock', 'ComfyUI core, custom-node package·version, Python dependency'],
  ['models.manifest', 'weight 역할, variant, hash, license와 loader 이름'],
  ['run.json', 'prompt_id, seed, 입력 asset hash, target output과 실행 event'],
  ['outputs/', 'base·edit·postprocess 중 어느 stage 결과인지 표시한 산출물'],
] as const;

const recovery = [
  ['열자마자 missing node', '실행하지 않는다.', 'core 버전 차이인지 custom node 부재인지 먼저 분류한다.'],
  ['node는 있으나 model이 없음', '비슷한 파일을 임의로 넣지 않는다.', 'node output type보다 더 좁은 architecture·component 계약을 확인한다.'],
  ['queue는 됐으나 결과가 다름', 'prompt만 비교하지 않는다.', 'API snapshot, model hash, node revision과 cache trace를 대조한다.'],
  ['PNG만 전달받음', 'metadata 복원 가능 여부를 확인한다.', '별도 JSON과 dependency manifest가 없으면 완전 재현으로 간주하지 않는다.'],
] as const;

export default function ComfyUIWorkflowMapArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <BeginnerOpening
          title="ComfyUI는 상자를 선으로 이은 그림을 실제 image 생성 순서로 실행하는 도구입니다."
          description={<>화면의 상자 하나는 image를 읽거나, model을 불러오거나, noise를 지우는 <strong className="text-foreground">작업 한 단계</strong>다. 선은 앞 단계의 결과를 다음 단계에 넘긴다. 이 상자와 선의 전체 묶음을 workflow라고 부른다.</>}
          familiarScene={<>요리책의 완성 사진만 보았다고 같은 요리를 다시 만들 수는 없다. 재료, 조리 기구, 각 단계의 순서와 불 세기가 함께 있어야 한다. ComfyUI 화면도 비슷하다. Graph가 보여도 model file이나 custom node가 빠지면 같은 실행이 되지 않는다.</>}
          steps={[
            { label: '상자와 선을 읽는다', detail: '각 node가 무엇을 받고 무엇을 내보내는지 output에서 거꾸로 따라간다.' },
            { label: '화면 밖 재료를 확인한다', detail: 'Model, custom node, input asset과 version처럼 graph 밖 의존성을 찾는다.' },
            { label: '한 번의 실행을 묶어 남긴다', detail: '제출한 graph, seed, dependency, output과 실행 ID를 replay bundle로 보관한다.' },
          ]}
        />
        <QuestionLead
          question="워크플로를 열었는데 보인다는 것과, 같은 결과를 다시 만들 수 있다는 것은 왜 다른가?"
          answer="Canvas는 편집 화면이고 실행은 제출 시점의 graph snapshot이다. 같은 결과를 재현하려면 graph뿐 아니라 custom node, model component, input asset, 실행 parameter와 output provenance까지 한 실행 단위로 묶어야 한다."
        />
        <h2 className="mb-6 text-2xl font-bold">Workflow는 그림이 아니라 실행 계약이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>ComfyUI에서 workflow는 node들이 link로 연결된 graph다. 그러나 공유받은 JSON을 canvas에 띄우는 것만으로는 실행 준비가 끝나지 않는다. Graph는 외부 image·video, 여러 model weight, custom node와 Python 환경을 참조한다. 이 의존성이 하나라도 다르면 같은 상자를 보고도 다른 프로그램을 실행한다.</p>
          <p>따라서 첫 질문은 “어느 node를 누르는가”가 아니다. <strong>무엇을 입력으로 고정하고, 어느 graph를 제출하며, 어떤 실행 ID와 산출물을 함께 보관할 것인가</strong>다. 이 계약이 있어야 prompt 수정, model 교체, 후처리 추가를 실험으로 비교할 수 있다.</p>
        </div>
        <ConceptPrimer items={[
          { term: 'UI workflow', meaning: '사람이 canvas에서 편집하는 graph 표현이다.', why: 'group, note와 화면 상태는 읽기에 유용하지만 실행 서버가 필요한 정보와 정확히 같지는 않다.' },
          { term: 'API workflow', meaning: 'node ID별 class_type과 inputs로 정규화된 실행 입력이다.', why: '제출한 값이 무엇이었는지 diff하고 자동화하려면 실행용 snapshot이 필요하다.' },
          { term: 'Job', meaning: 'queue에 들어간 workflow snapshot 한 번의 실행이다.', why: 'UI를 나중에 바꿔도 이미 제출된 job의 입력은 바뀌지 않으므로 prompt_id로 구분해야 한다.' },
          { term: 'Replay bundle', meaning: 'workflow, dependency, model, input, run trace와 output을 묶은 artifact다.', why: 'JSON 한 장이 참조하지 못하는 외부 상태까지 복원해야 팀원이 같은 실행을 재현할 수 있다.' },
        ]} />
        <WorkflowContractViz />
      </section>

      <section id="execution-contract" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Import에서 실행 전 검증까지</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Community workflow를 받으면 먼저 <em>실행하지 않은 상태</em>에서 inventory를 만든다. Missing node, input asset, model file, loader, output node를 찾는다. ComfyUI 공식 문서도 workflow가 asset, custom node, Python dependency와 model에 의존한다고 구분한다. 이것은 설치 오류 목록이 아니라 실행 환경의 일부다.</p>
          <p>다음으로 output에서 거꾸로 읽는다. 최종 Save·Preview node가 어떤 IMAGE를 받고, 그 IMAGE는 어느 decode나 postprocess에서 왔으며, 그 upstream이 요구하는 MODEL·CONDITIONING·LATENT가 무엇인지 추적한다. 사용하지 않는 고립된 node까지 모두 설치할 필요는 없다. 실제 target output의 <strong>dependency closure</strong>, 즉 이 output을 만드는 데 거슬러 올라가며 필요한 node 전체부터 검증한다.</p>
        </div>
        <div className="not-prose overflow-hidden border border-border">
          {recovery.map(([symptom, stop, action], index) => (
            <div key={symptom} className="grid min-w-0 border-b border-border last:border-b-0 sm:grid-cols-[2.5rem_10rem_minmax(0,1fr)]">
              <div className="flex items-center justify-center border-b border-border bg-muted/20 font-mono text-xs sm:border-b-0 sm:border-r">0{index + 1}</div>
              <div className="border-b border-border px-3 py-3 sm:border-b-0 sm:border-r"><strong className="block text-sm">{symptom}</strong><span className="mt-1 block text-xs text-rose-700 dark:text-rose-300">{stop}</span></div>
              <p className="min-w-0 px-3 py-3 text-sm leading-relaxed text-muted-foreground">{action}</p>
            </div>
          ))}
        </div>
        <Misconception>“Missing node 찾기”에서 비슷한 이름의 package를 설치하면 된다고 생각하기 쉽다. Node display name은 package identity가 아니다. 원 workflow의 node type, registry package, version과 source를 확인해야 잘못된 코드를 graph에 끼워 넣지 않는다.</Misconception>
      </section>

      <section id="queue-boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Queue가 만드는 시간 경계</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>로컬 ComfyUI에서는 Queue 버튼이 서버의 <code>POST /prompt</code>로 현재 입력을 제출한다. Comfy Cloud API를 직접 쓸 때의 경로는 <code>POST /api/prompt</code>다. 둘은 경로와 운영 경계가 다르지만, 응답의 <code>prompt_id</code>로 제출한 job의 진행 event와 output을 연결한다는 원칙은 같다. 그래야 “내가 지금 canvas에서 보는 값”과 “GPU가 실제로 실행한 값”을 혼동하지 않는다.</p>
          <p>예를 들어 prompt A를 queue한 뒤 UI를 prompt B로 수정해도 이미 대기 중인 job은 A를 실행한다. B를 보며 A의 결과를 평가하면 잘못된 원인을 찾게 된다. 자동화에서도 base workflow 객체를 깊게 복사한 뒤 seed나 prompt input만 바꾸고, 제출한 snapshot과 반환된 prompt_id를 함께 저장해야 한다.</p>
          <p>Partial execution target을 쓸 때도 같은 원칙이 적용된다. “이 node만 실행”은 graph 전체가 사라진다는 뜻이 아니다. Target output을 계산하는 데 필요한 <strong>upstream closure</strong>, 즉 target에서 입력 방향으로 추적했을 때 만나는 필수 node 전체가 실행 단위가 된다. 무엇을 target으로 제출했는지 run record에 남겨야 cache 동작과 구분할 수 있다.</p>
        </div>
      </section>

      <section id="replay-artifacts" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">재현 단위에 무엇을 넣는가</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          아래에서 <code className="text-foreground">workflow.ui.json</code>과 <code className="text-foreground">workflow.api.json</code>은 ComfyUI의 두 workflow 표현을 구분해 붙인 이름이다. <code className="text-foreground">dependencies.lock</code>·<code className="text-foreground">models.manifest</code>·<code className="text-foreground">run.json</code>·<code className="text-foreground">outputs/</code>은 ComfyUI 표준 파일명이 아니라, 이 글이 팀 재현을 위해 제안하는 replay bundle 구조다.
        </p>
        <div className="not-prose overflow-hidden border border-border">
          {artifacts.map(([name, role]) => (
            <div key={name} className="grid min-w-0 border-b border-border last:border-b-0 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <code className="min-w-0 border-b border-border bg-muted/20 px-3 py-3 text-xs font-bold [overflow-wrap:anywhere] sm:border-b-0 sm:border-r">{name}</code>
              <p className="min-w-0 px-3 py-3 text-sm leading-relaxed text-muted-foreground">{role}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>PNG metadata는 빠른 handoff에 유용하지만 유일한 기록 수단으로 삼기 어렵다. Metadata를 보존하지 않는 media format과 후처리 경로가 있고, image 안의 workflow도 외부 weight와 package version을 포함하지 못한다. 중요한 실행은 사람이 편집할 JSON과 서버에 제출한 API JSON을 둘 다 남긴다.</p>
          <p>이 글이 다음 글에 넘기는 산출물은 <strong>검증 대상 output과 API snapshot</strong>이다. 이제 <InternalLink slug="comfyui-core-graph">타입 그래프와 실행 재사용</InternalLink>에서 그 snapshot의 어느 node가 실제 dependency인지, prompt 수정 때 왜 일부 node만 다시 도는지 읽는다.</p>
        </div>
        <CapabilityCheck items={[
          '공유 workflow를 실행하기 전에 graph·asset·model·custom node 의존성을 분리해 inventory할 수 있다.',
          'UI 수정 시점과 queue snapshot을 prompt_id로 구분하고 replay bundle에 필요한 artifact를 설명할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'ComfyUI · Workflow', href: 'https://docs.comfy.org/development/core-concepts/workflow', note: 'Workflow graph와 JSON·image metadata 저장 계약.' },
          { label: 'ComfyUI · Dependencies', href: 'https://docs.comfy.org/development/core-concepts/dependencies', note: 'Asset, model, custom node와 Python dependency 분류.' },
          { label: 'ComfyUI · Cloud API overview', href: 'https://docs.comfy.org/development/cloud/overview', note: 'API-format workflow, prompt_id와 비동기 job 수명주기.' },
          { label: 'ComfyUI · Submit workflow', href: 'https://docs.comfy.org/api-reference/cloud/workflow/submit-a-workflow-for-execution', note: 'prompt, node_errors와 partial execution target 입력.' },
          { label: 'ComfyUI · Local server routes', href: 'https://docs.comfy.org/development/comfyui-server/comms_routes', note: '로컬 서버의 POST /prompt와 실행 통신 경계.' },
        ]} />
      </section>
    </div>
  );
}
