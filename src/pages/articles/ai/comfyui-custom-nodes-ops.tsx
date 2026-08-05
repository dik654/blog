import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { NodeOpsReleaseViz } from './comfyui-runtime/viz/WorkflowRuntimeViz';

const gates = [
  ['Identity', '어느 registry package 또는 repository가 이 node type을 제공하는가?', 'Display name이 아니라 package ID와 source URL을 기록한다.'],
  ['Version', 'Workflow 작성자가 검증한 version·commit은 무엇인가?', 'Latest로 덮지 않고 먼저 동일 revision으로 replay한다.'],
  ['Install surface', 'Install script와 package가 어떤 코드·dependency를 실행하는가?', 'Source, dependency, subprocess·network·filesystem 권한을 검토한다.'],
  ['Compatibility', '현재 ComfyUI core·Python·GPU runtime과 함께 load되는가?', '별도 환경에서 import와 작은 smoke workflow를 실행한다.'],
  ['Replay', '같은 input과 model hash에서 accepted output과 일치하는가?', '정확·허용 오차 기준을 정하고 event·artifact를 비교한다.'],
  ['Rollback', 'Update 뒤 깨지면 어떤 snapshot으로 돌아가는가?', 'Core, custom node, Python lock과 model manifest를 함께 복구한다.'],
] as const;

const threatRows = [
  ['신뢰하지 않은 repository', 'Custom node는 로컬 Python code로 실행된다.', '주 작업 환경에 바로 설치하지 않고 source와 install path를 검토한다.'],
  ['Dependency confusion·충돌', '새 package가 기존 version을 바꿔 다른 node를 깨뜨릴 수 있다.', '격리 environment와 lockfile, install diff를 남긴다.'],
  ['Unpinned update', 'Input schema·default·behavior가 바뀌어 같은 JSON이 다르게 실행될 수 있다.', '검증된 semver 또는 commit을 pin하고 update를 별도 branch에서 검증한다.'],
  ['숨겨진 data flow', 'Set/Get·pipe·relay가 핵심 MODEL·CONDITIONING source를 가릴 수 있다.', '공유 graph에서는 주요 consumer까지의 typed path를 trace로 남긴다.'],
  ['Snapshot만 있고 model hash 없음', 'Environment는 같아도 다른 weight variant를 쓸 수 있다.', 'Model manifest를 snapshot과 같은 release ID로 묶는다.'],
] as const;

export default function ComfyUICustomNodesOpsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <QuestionLead
          question="ComfyUI Manager가 missing node를 찾아 설치했다면 같은 workflow가 안전하게 재현된 것인가?"
          answer="아니다. Missing-node recovery는 package 후보를 찾는 단계다. Custom node는 실행 가능한 Python code이고 version·dependency·model file까지 외부 상태이므로, 격리 환경에서 검토·pin·replay한 뒤에만 release bundle에 포함한다."
        />
        <h2 className="mb-6 text-2xl font-bold">Custom node는 plugin이자 공급망 dependency다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Custom node는 core에 없는 loader, preprocessor, video combine, detector와 model-specific operator를 제공한다. 동시에 workflow가 실행하는 code와 Python package를 늘린다. “편리한 node 하나 추가”는 기능·보안·재현성 세 계약을 함께 추가하는 일이다.</p>
          <p>Manager는 install, update, disable, missing-node 탐색과 snapshot을 돕는다. 그러나 자동 발견 결과는 검토의 시작점이다. Registry package identity, version, source와 dependency를 확인하고, 중요한 workflow는 latest가 아니라 검증한 revision을 pin한다.</p>
        </div>
        <ConceptPrimer items={[
          { term: 'Package identity', meaning: 'Node display name을 제공하는 registry package 또는 repository의 고유 식별자다.', why: '이름이 비슷한 잘못된 package 설치와 ownership 혼동을 막는다.' },
          { term: 'Semver · commit pin', meaning: 'Semver는 major.minor.patch 형식의 배포 version이고, commit pin은 source revision 하나를 정확히 고정하는 방법이다.', why: 'Latest라는 움직이는 이름 대신 검증한 code 상태를 다시 설치하게 한다.' },
          { term: 'Python lock', meaning: 'Python package와 정확한 version, 때로는 artifact hash까지 고정한 dependency 목록이다.', why: 'Custom node 하나를 설치하며 다른 package가 몰래 바뀌는 dependency drift를 재현하고 되돌린다.' },
          { term: 'Graph indirection', meaning: 'Reroute·group·subgraph는 선과 node를 묶어 보이게 하고, Set/Get·pipe·relay는 값을 떨어진 consumer로 간접 전달하는 구성이다.', why: '화면을 정리하는 대신 실제 MODEL·CONDITIONING producer를 숨길 수 있어 provenance를 따로 남겨야 한다.' },
          { term: 'Environment snapshot', meaning: 'Core·custom node·Python dependency version을 한 시점으로 기록한다.', why: 'Update 뒤 같은 workflow JSON의 실행 의미가 바뀌는 것을 되돌릴 기준이다.' },
          { term: 'Isolation', meaning: '실험 node를 안정 운영 환경과 분리된 Python·ComfyUI instance에서 검증한다.', why: 'Dependency 충돌과 악성 code의 영향 범위를 줄인다.' },
          { term: 'Replay evidence', meaning: '같은 input·model·graph를 다시 실행해 accepted output과 비교한 기록이다.', why: '설치 성공이 아니라 행동 계약이 유지됐는지 증명한다.' },
        ]} />
        <NodeOpsReleaseViz />
      </section>

      <section id="package-gates" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Install 전에 여섯 gate를 통과한다</h2>
        <div className="not-prose overflow-hidden border border-border">
          {gates.map(([gate, question, evidence], index) => (
            <div key={gate} className="grid min-w-0 border-b border-border last:border-b-0 lg:grid-cols-[2.5rem_8rem_minmax(0,1fr)]">
              <div className="flex items-center justify-center border-b border-border bg-muted/20 font-mono text-[10px] lg:border-b-0 lg:border-r">0{index + 1}</div>
              <strong className="border-b border-border px-3 py-3 text-sm lg:border-b-0 lg:border-r">{gate}</strong>
              <div className="min-w-0 px-3 py-3"><p className="text-sm leading-relaxed">{question}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">증거: {evidence}</p></div>
            </div>
          ))}
        </div>
        <Misconception>Registry 등록과 scan은 위험을 줄이는 signal이지 무해성 보증이 아니다. Official standards가 <code>eval</code>·<code>exec</code>, runtime pip install과 obfuscation을 금지해도 source·dependency·권한 검토와 격리 실행은 여전히 필요하다.</Misconception>
      </section>

      <section id="missing-node" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Missing node를 복구하는 순서</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>먼저 missing state가 오래된 core 때문인지 custom node 부재 때문인지 나눈다. Core node라면 ComfyUI version과 workflow 작성 version을 비교한다. Custom node라면 Manager의 missing-node 탐색 결과에서 node type을 제공하는 package를 찾고, package 전체와 individual node를 혼동하지 않는다.</p>
          <p>새 Manager UI는 registry 중심 경로를 제공한다. Registry에 없는 node는 수동 Git 설치가 필요할 수 있지만, 그 순간 version pin과 dependency 설치 책임이 사용자에게 더 많이 넘어온다. ZIP이나 임의 mirror보다 원 project source와 documented install route를 사용한다.</p>
          <p>설치 후 큰 workflow를 바로 queue하지 않는다. Node import, 작은 deterministic input, expected output type과 error path를 smoke test한다. Loader라면 작은 model, preprocessor라면 고정 image, utility node라면 간단한 scalar·image를 써서 package의 핵심 동작만 확인한다.</p>
        </div>
      </section>

      <section id="threat-model" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">깨짐과 침해를 같은 dependency 표에서 본다</h2>
        <div className="not-prose overflow-hidden border border-border">
          {threatRows.map(([risk, mechanism, control]) => (
            <div key={risk} className="grid min-w-0 border-b border-border last:border-b-0 md:grid-cols-[10rem_minmax(0,1fr)]">
              <strong className="border-b border-border bg-muted/20 px-3 py-3 text-sm md:border-b-0 md:border-r">{risk}</strong>
              <div className="min-w-0 px-3 py-3"><p className="text-sm leading-relaxed">{mechanism}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">통제: {control}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section id="release-bundle" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Workflow release는 실행 환경까지 포함한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Release ID 하나 아래 UI JSON, API-format JSON, core revision, custom-node package·version, Python lock, model hash·license, input asset hash, prompt_id trace와 stage별 output을 묶는다. Snapshot 기능은 환경 복구를 돕지만 model weight와 외부 asset의 identity까지 자동으로 대체한다고 가정하지 않는다.</p>
          <p>Update는 release 위에서 직접 하지 않는다. 복제한 environment에서 새 version을 설치하고 baseline replay를 실행한다. Node schema, cache behavior, runtime, memory와 output이 허용 범위 안이면 새 snapshot을 만들고, 아니면 이전 release를 유지한다.</p>
          <p>큰 graph를 정리할 때 reroute·group·subgraph는 가독성을 높인다. Set/Get·pipe·relay는 긴 선을 줄이지만 core MODEL·CLIP·VAE·CONDITIONING provenance를 숨길 수 있다. 공유용 graph에는 중요한 consumer input의 source를 note 또는 generated manifest로 남긴다.</p>
          <p>이 글은 <InternalLink slug="comfyui-workflow-map">첫 실행 계약</InternalLink>으로 되돌아가 cycle을 닫는다. 새 모델이나 node가 추가되어도 workflow snapshot부터 replay evidence까지 같은 절차를 반복하면 된다.</p>
        </div>
        <CapabilityCheck items={[
          'Missing node 후보를 package identity·version·source로 검증하고 격리 환경에서 smoke test할 수 있다.',
          'Graph·dependency·model·input·trace·output을 release ID 아래 묶고 update 전후 replay와 rollback을 설계할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'ComfyUI · Manager overview', href: 'https://docs.comfy.org/manager/overview', note: 'Install·update·disable, missing-node와 snapshot 기능의 공식 범위.' },
          { label: 'ComfyUI · Pack management', href: 'https://docs.comfy.org/manager/pack-management', note: 'Package·individual node 검색, 특정 version 설치와 missing-node recovery.' },
          { label: 'ComfyUI · Registry overview', href: 'https://docs.comfy.org/registry/overview', note: 'Package identity, immutable published version과 workflow version metadata.' },
          { label: 'ComfyUI · Registry standards', href: 'https://docs.comfy.org/registry/standards', note: 'Published node의 금지 행위와 security review 경계.' },
          { label: 'ComfyUI · Install custom nodes', href: 'https://docs.comfy.org/installation/install_custom_node', note: 'Manager·Git·manual installation과 unverified plugin 보안 경고.' },
        ]} />
      </section>
    </div>
  );
}
