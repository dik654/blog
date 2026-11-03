import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import { curioTree, lotusTree } from "./fileTrees";
import {
  CurioTaskLifecycleViz,
  LotusCompletionBoundaryViz,
  LotusOwnershipMapViz,
  LotusReleaseBundleViz,
  LotusSuiteTraceViz,
} from "./viz/ModernLotusSuiteViz";

const LOTUS_RELEASE = "https://github.com/filecoin-project/lotus/releases/tag/v1.38.3";
const LOTUS_SOURCE = "https://github.com/filecoin-project/lotus/tree/29d72bdf77d13e6e3e20264d7a9167feb2a41ab0";
const CURIO_RELEASE = "https://github.com/filecoin-project/curio/releases/tag/v1.29.0";
const CURIO_DESIGN = "https://github.com/filecoin-project/curio/blob/409a2ab3510d65f22ae31ba1afddc911f4b315d7/documentation/en/design/README.md";
const CURIO_TASK = "https://github.com/filecoin-project/curio/blob/409a2ab3510d65f22ae31ba1afddc911f4b315d7/harmony/harmonytask/task_type_handler.go";

export default function ModernFilecoinLotusArticle() {
  const sidebar = useCodeSidebar();

  return <>
    <article className="space-y-14">
      <section id="overview" className="scroll-mt-24 space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">파일 D7 하나의 전체 경로</p>
          <h2 className="text-3xl font-bold tracking-tight">Lotus와 Curio는 체인 상태와 저장 작업을 나누어 맡습니다</h2>
        </header>
        <LotusSuiteTraceViz />
        <p className="text-lg leading-8 text-foreground/90">
          사용자가 파일 D7을 보관한 뒤 다시 내려받는 과정을 따라갑니다. Curio는 piece를 받고 sector 작업을 DB에 등록하며 실행 노드에 배정합니다. 계산이 끝나면 Lotus RPC를 통해 메시지를 제출하고, Lotus는 블록을 검증·실행해 체인 상태와 영수증을 만듭니다. 마지막에는 retrieval 경로가 저장된 bytes를 찾아 사용자에게 돌려줍니다.
        </p>
        <p>
          이 글이 답할 질문은 하나입니다. <strong>한 파일이 업로드·작업·체인·전달을 지날 때 각 상태는 어디에 남고 누가 그 상태를 바꿀 수 있습니까?</strong> “업로드 완료”를 “체인 반영 완료”나 “다운로드 가능”으로 바꾸어 부르지 않고, 단계마다 다음 단계가 확인할 증거를 남깁니다.
        </p>
        <ContentBoundary article="filecoin-lotus" />
      </section>

      <section id="process-map" className="scroll-mt-24 space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · 소유권</p>
          <h2 className="mt-2 text-2xl font-bold">프로세스가 함께 떠 있어도 상태 원장은 서로 다릅니다</h2>
        </header>
        <LotusOwnershipMapViz />
        <p>
          Lotus의 <code>ChainStore</code>와 <code>StateManager</code>는 검증된 tipset, state root와 receipt root를 읽고 실행합니다. Curio의 HarmonyTask는 작업 행, <code>owner_id</code>, 재시도 횟수와 실행 이력을 HarmonyDB에 기록합니다. 계산 노드는 piece·scratch·sector 경로에 산출물을 쓰고, 시장·retrieval 경로는 사용자 요청과 전달 결과를 관리합니다.
        </p>
        <p>
          이 경계를 알아야 장애를 잘못 진단하지 않습니다. Curio 작업이 성공했다고 Lotus의 canonical chain 포함이 증명되는 것은 아니며, Lotus가 sector의 actor state를 보여 준다고 사용자가 지금 bytes를 받을 수 있다는 뜻도 아닙니다. 실제 배포에서 여러 역할을 한 서버에 합칠 수는 있어도 authoritative writer는 상태별로 하나여야 합니다.
        </p>
        <p>
          Curio v1.29.0 릴리스는 새 저장 계약의 market intake를 Curio의 Market 2.0 경로로 안내합니다. 따라서 이 글은 별도 Boost 배포를 모든 provider가 반드시 거치는 기본 경로처럼 그리지 않습니다. Boost를 함께 운영한다면 proposal·piece·message 영수증을 잇는 별도 서비스 경계로 표시해야 합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-3">
          <CodeViewButton label="Lotus FilecoinEC" onClick={() => sidebar.open("lotus-filecoin-ec", codeRefs["lotus-filecoin-ec"])} />
          <CodeViewButton label="Lotus ChainStore" onClick={() => sidebar.open("lotus-chainstore", codeRefs["lotus-chainstore"])} />
          <CodeViewButton label="Lotus StateManager" onClick={() => sidebar.open("lotus-statemgr", codeRefs["lotus-statemgr"])} />
          <CodeViewButton label="Curio TaskInterface" onClick={() => sidebar.open("curio-task-interface", codeRefs["curio-task-interface"])} />
        </div>
        <div id="paper-curio-design">
          <CitationBlock type="code" citeKey={1} source="Curio design · v1.29.0 commit 409a2ab" href={CURIO_DESIGN}>
            <p><strong>문제:</strong> 여러 provider node가 sealing·proof·message 작업을 durable state로 나누어 실행해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Pinned design은 HarmonyDB, task engine, storage paths와 chain-facing 작업의 책임을 설명합니다.</p>
            <p><strong>중요 가정:</strong> Curio v1.29.0 코드와 같은 schema·설정·Lotus 연결을 사용합니다.</p>
            <p><strong>근거 범위:</strong> 해당 revision의 설계 문서와 source에 존재하는 구조에 한정합니다.</p>
            <p><strong>일반화 금지:</strong> 문서가 provider의 처리량·고가용성이나 모든 storage topology를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-lotus-release">
          <CitationBlock type="code" citeKey={2} source="Lotus v1.38.3 release" href={LOTUS_RELEASE}>
            <p><strong>문제:</strong> 실제 node revision과 그 binary를 만든 Go 보안 버전을 고정해야 합니다.</p>
            <p><strong>핵심 기여:</strong> v1.38.3은 Go 1.26.10으로 node·miner·worker를 다시 빌드해 알려진 손상 intermediate certificate를 <code>crypto/x509</code>이 거절하게 한 patch release입니다.</p>
            <p><strong>중요 가정:</strong> 배포 network, actor bundle, proof parameter와 database migration 조건을 함께 맞춥니다.</p>
            <p><strong>근거 범위:</strong> 공식 release와 tag의 기능 존재에 한정합니다.</p>
            <p><strong>일반화 금지:</strong> 최신 tag라는 사실이 현재 장비에서의 안정성·처리량을 증명하지는 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="artifact-handoff" className="scroll-mt-24 space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · 작업</p>
          <h2 className="mt-2 text-2xl font-bold">HarmonyDB의 owner_id가 실행 권한을 한 노드에만 줍니다</h2>
        </header>
        <CurioTaskLifecycleViz />
        <p>
          작업은 <code>owner_id=NULL</code>인 대기 행으로 시작합니다. 각 노드는 동시 실행 한도, CPU·RAM·GPU·저장 경로와 task별 <code>CanAccept</code> 조건을 검사합니다. 후보 하나가 <code>FOR UPDATE SKIP LOCKED</code>로 행을 잠그고 자신의 machine ID를 기록한 뒤에야 <code>Do</code>를 실행합니다.
        </p>
        <p>
          실행 중에는 <code>stillOwned</code>를 확인합니다. 소유권을 잃은 노드가 같은 체인 메시지나 파일 변경을 계속 만들면 중복 외부 효과가 생길 수 있기 때문입니다. 성공한 작업은 active table에서 지우고 history에 남깁니다. 재시도 가능한 실패는 <code>owner_id</code>를 다시 비우고 retry 수를 올립니다.
        </p>
        <p>
          예를 들어 node 27이 TreeR 계산을 마친 직후 종료됐다고 하겠습니다. 재시작한 scheduler는 DB 행만 보고 proof와 체인 메시지가 모두 끝났다고 판단하면 안 됩니다. 저장 경로의 artifact digest, 제출한 message CID, Lotus receipt를 차례로 대조한 뒤 누락된 단계부터 다시 시작해야 합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-3">
          <CodeViewButton label="Curio TaskInterface · stillOwned" onClick={() => sidebar.open("curio-task-interface", codeRefs["curio-task-interface"])} />
          <CodeViewButton label="Curio SQL claim · 완료 기록" onClick={() => sidebar.open("curio-task-claim", codeRefs["curio-task-claim"])} />
        </div>
        <div id="paper-curio-task">
          <CitationBlock type="code" citeKey={3} source="Curio HarmonyTask · v1.29.0 commit 409a2ab" href={CURIO_TASK}>
            <p><strong>문제:</strong> 여러 process가 같은 task를 경쟁해도 한 owner만 외부 효과를 만들고, 종료 뒤에는 안전하게 재개해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Resource·CanAccept 검사, SQL claim, owner 갱신, 성공 history와 재시도 상태 전이를 구현합니다.</p>
            <p><strong>중요 가정:</strong> HarmonyDB transaction과 machine identity가 정상이며 개별 task도 <code>stillOwned</code> 계약을 지킵니다.</p>
            <p><strong>근거 범위:</strong> Pinned HarmonyTask handler의 배정·완료 처리에 한정합니다.</p>
            <p><strong>일반화 금지:</strong> 공통 task engine만으로 proof artifact·message submission·storage durability의 정확성이 보장되지는 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="operations" className="scroll-mt-24 space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 완료</p>
          <h2 className="mt-2 text-2xl font-bold">업로드·계산·제출·체인·전달의 영수증을 따로 확인합니다</h2>
        </header>
        <LotusCompletionBoundaryViz />
        <p>
          업로드 영수증은 piece bytes와 CID를 받았다는 뜻입니다. 계산 영수증은 commitment와 proof 산출물이 생겼다는 뜻이고, 제출 영수증은 메시지를 Lotus에 보냈다는 뜻입니다. 체인 영수증은 canonical tipset에서 actor state와 실행 결과를 확인했다는 뜻입니다. 사용자에게 bytes를 돌려주고 CID가 일치해야 전달까지 끝납니다.
        </p>
        <ExplainedFormula
          question="서비스가 파일 D7을 사용할 수 있다고 표시하려면 어떤 증거가 필요합니까?"
          idea={<>체인 반영, 현재 provider profile, artifact lineage와 작업 소유권을 같은 sector·message identity로 연결합니다. Retrieval 완료를 표시할 때는 전달된 bytes의 CID도 추가로 확인합니다.</>}
          formula={String.raw`A_{ready}=A_{chain}\land A_{profile}\land A_{lineage}\land A_{owner}`}
          annotatedFormula={String.raw`\underbrace{A_{ready}}_{\text{사용 가능 판정}}=\underbrace{A_{chain}}_{\text{체인 영수증}}\land\underbrace{A_{profile}}_{\text{버전·설정}}\land\underbrace{A_{lineage}}_{\text{산출물 계보}}\land\underbrace{A_{owner}}_{\text{단일 소유권}}`}
          operations={[
            { expression: String.raw`A_{chain}=1`, annotation: ["같은 message CID의 receipt와 actor state를 확인", "제출 응답만으로는 1이 아님"] },
            { expression: String.raw`A_{profile}\land A_{lineage}`, annotation: ["Lotus·Curio·proof profile을 고정", "piece·sector·proof digest를 같은 작업 계보로 연결"] },
            { expression: String.raw`A_{owner}=1`, annotation: ["현재 task owner와 완료 history가 모순되지 않음", "소유권을 잃은 worker의 외부 효과는 거절"] },
          ]}
          terms={[
            { symbol: "Aready", name: "서비스 사용 가능", description: "선택한 완료 경계까지 필요한 증거가 모두 맞으면 1입니다." },
            { symbol: "Achain", name: "체인 영수증", description: "메시지 실행 결과와 actor state가 요구한 confidence에서 canonical이면 1입니다." },
            { symbol: "Aprofile", name: "호환 프로필", description: "Lotus·Curio·actor·proof 설정이 검증한 조합과 같으면 1입니다." },
            { symbol: "Alineage", name: "산출물 계보", description: "PieceCID, sector, commitment, proof와 message가 같은 요청에서 이어졌으면 1입니다." },
            { symbol: "Aowner", name: "작업 소유권", description: "현재 실행자와 history가 DB의 단일 owner 전이와 일치하면 1입니다." },
          ]}
          assumptions={[
            "모든 영수증은 같은 piece D7, sector 42와 message M42를 가리킵니다.",
            "Chain confidence와 reorg 처리 기준은 배포 정책에서 별도로 정합니다.",
            "Retrieval 성공을 주장하려면 받은 bytes의 CID 검증을 이 식 뒤에 추가합니다.",
          ]}
          interpretation="Achain이 1이어도 artifact 계보가 끊겼거나 현재 작업 owner가 모순되면 서비스는 완료로 표시하지 않습니다. 실패한 단계의 소유자부터 조사하고 이미 확인한 외부 효과는 반복하지 않습니다."
        />
      </section>

      <section id="release-gate" className="scroll-mt-24 space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">04 · 배포</p>
          <h2 className="mt-2 text-2xl font-bold">Lotus·Curio·proof 조합을 하나의 배포 단위로 검증합니다</h2>
        </header>
        <LotusReleaseBundleViz />
        <p>
          이 글의 코드 범위는 Lotus v1.38.3 tag와 Curio v1.29.0 tag에 고정했습니다. 하지만 tag 두 개가 존재한다고 서로 호환되거나 현재 provider에서 안전하다는 뜻은 아닙니다. Canary에는 actor·network version, Curio DB migration, proof parameter, sector size와 storage path profile을 함께 기록합니다.
        </p>
        <p>
          같은 작은 piece fixture로 업로드, task claim, CommD·CommR·proof, message inclusion과 retrieval을 끝까지 실행합니다. Worker 종료, Lotus RPC timeout, DB owner 회수와 chain reorg를 단계별로 주입하고 중복 메시지·고아 artifact·잘못된 완료 표시가 없는지 확인합니다. 이 글은 해당 조합의 처리량이나 가용성을 측정하지 않았습니다.
        </p>
        <p>
          되돌릴 때는 binary만 낮추지 않습니다. Lotus database와 network migration의 역호환 조건, Curio schema snapshot, 이전 proof parameter bundle과 routing 설정을 함께 확인합니다. 이미 chain에 포함된 메시지는 다시 제출하지 않고, 확인되지 않은 로컬 단계만 영수증에서 재개합니다.
        </p>
        <div id="paper-lotus-source">
          <CitationBlock type="code" citeKey={4} source="Lotus source · v1.38.3 commit 29d72bd" href={LOTUS_SOURCE}>
            <p><strong>문제:</strong> ChainStore·StateManager·Expected Consensus 구현 주장을 재현 가능한 source에 고정해야 합니다.</p>
            <p><strong>핵심 기여:</strong> 이 글에서 인용한 Lotus chain·state code의 정확한 revision을 제공합니다.</p>
            <p><strong>중요 가정:</strong> 해당 tag의 dependencies, actor bundle, network profile과 build configuration을 함께 고정합니다.</p>
            <p><strong>근거 범위:</strong> Commit 29d72bd의 source behavior에 한정합니다.</p>
            <p><strong>일반화 금지:</strong> Source가 production availability, 고정 처리량이나 미래 network behavior를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-curio-release">
          <CitationBlock type="code" citeKey={5} source="Curio v1.29.0 release" href={CURIO_RELEASE}>
            <p><strong>문제:</strong> Curio의 network·Lotus 의존성과 현재 market intake 변화를 실제 release에 고정해야 합니다.</p>
            <p><strong>핵심 기여:</strong> NV29 지원, Lotus v1.37.0 의존성, 새 DDO 계약의 Market 2.0 경로와 중단되는 legacy intake를 명시합니다.</p>
            <p><strong>중요 가정:</strong> 배포하려는 network와 database migration path가 release 조건을 만족합니다.</p>
            <p><strong>근거 범위:</strong> 공식 release note에 명시된 기능과 호환성 범위입니다.</p>
            <p><strong>일반화 금지:</strong> Release note만으로 현재 storage hardware·DB·운영 절차의 안전성을 확정하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>
    </article>

    <CodeSidebar
      codeRefKey={sidebar.codeRefKey}
      codeRef={sidebar.codeRef}
      onClose={sidebar.close}
      onNavigate={sidebar.navigate}
      codeRefs={codeRefs}
      fileTrees={{ lotus: lotusTree, curio: curioTree }}
      projectMetas={{
        lotus: {
          id: "lotus",
          label: "Lotus v1.38.3 · Go",
          badgeClass: "border-blue-500 bg-blue-500/10 text-blue-700",
        },
        curio: {
          id: "curio",
          label: "Curio v1.29.0 · Go",
          badgeClass: "border-emerald-500 bg-emerald-500/10 text-emerald-700",
        },
      }}
    />
  </>;
}
