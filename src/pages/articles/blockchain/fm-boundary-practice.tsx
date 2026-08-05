const decisionFrame = [
  ['대상', '오래된 구현, 복잡한 논문, 합의 알고리즘, txpool, state transition처럼 한 번에 믿기 어려운 덩어리'],
  ['목표', '전체를 깨끗하게 재작성하는 것이 아니라, 관찰 가능한 작은 경계를 찾아 검증 기록을 쌓는 것'],
  ['산출물', '경계 명세, 전제 조건, 불변조건, 반례 fixture, 회귀 테스트, 남은 위험'],
  ['판정', '처음 보는 사람도 왜 이 단위를 믿을 수 있는지 입력과 출력만 보고 따라갈 수 있어야 함'],
];

const workflow = [
  ['1. 후보 수집', '함수, 타입, 프로토콜 단계, 메시지 처리 루프를 후보로 적는다.', '이름만 보고 책임이 하나로 설명되는가'],
  ['2. 경계 절단', '입력, 출력, 읽는 상태, 쓰는 상태, 외부 oracle을 분리한다.', '상태 DB나 네트워크를 몰라도 테스트할 수 있는가'],
  ['3. 전제 기록', '상위 계층이 이미 보장한 조건과 아직 보장하지 않는 조건을 구분한다.', '실패가 이 경계 책임인지 위 계층 책임인지 분리되는가'],
  ['4. 속성화', '정상 동작을 예시가 아니라 불변조건 문장으로 바꾼다.', 'accepted이면 반드시 참이어야 하는 문장인가'],
  ['5. 반례 작성', '각 불변조건을 하나씩 깨는 최소 fixture를 만든다.', '한 테스트가 한 속성만 실패시키는가'],
  ['6. 회귀 고정', '테스트 결과와 실패 메시지를 표로 남긴다.', '나중 변경이 의도인지 퇴행인지 리뷰할 수 있는가'],
  ['7. 확장 결정', '다음 경계로 넓힐지, wrapper로 감쌀지, 재작성할지 결정한다.', '검증 기록이 다음 작업의 입력으로 쓰이는가'],
];

const cutTypes = [
  ['Pure boundary', '입력만으로 출력이 결정되는 함수', 'hash, encoding, signature check, static tx validation', '가장 먼저 자른다. fixture가 작고 실패 원인이 명확하다.'],
  ['State-read boundary', '상태를 읽지만 쓰지는 않는 검증', 'balance, nonce, account lookup, fork config lookup', 'state snapshot 또는 mock state를 명시한다.'],
  ['State-transition boundary', '상태를 읽고 쓴 뒤 불변조건을 만족해야 하는 처리', 'EVM execution, block import, staking transition', 'pre/post condition과 rollback 조건을 함께 둔다.'],
  ['Protocol-step boundary', '메시지와 시간, peer 상태가 얽힌 단계', 'consensus vote handling, gossip validation, sync step', 'trace 기반 테스트와 state machine 모델이 필요하다.'],
];

const artifactChecklist = [
  ['Boundary card', '이 경계가 무엇을 책임지고 무엇을 책임지지 않는지 한 화면에 적는다.'],
  ['Source anchors', '실제 코드 위치, 핵심 타입, 호출자를 연결한다. 설명만 있고 코드 근거가 없으면 보류한다.'],
  ['Invariant table', 'accepted 상태에서 반드시 참인 속성과 reject해야 하는 위반 조건을 표로 둔다.'],
  ['Counterexample matrix', '최소 실패 fixture를 속성별로 하나씩 둔다. 통합 테스트보다 먼저 만든다.'],
  ['Risk ledger', '아직 black box로 둔 부분, 외부 oracle, 성능/동시성/타이밍 위험을 따로 남긴다.'],
  ['Next cut', '다음에 잘라야 할 인접 경계를 하나만 지정한다. 범위를 한 번에 넓히지 않는다.'],
];

const implementationIdeas = [
  ['Spec fixture generator', '경계별 입력 타입을 작은 fixture builder로 고정한다. happy path에서 한 필드만 바꾸는 방식으로 반례를 만든다.'],
  ['Property runner', '예시 테스트와 property test를 함께 둔다. property test는 넓은 탐색, 예시 테스트는 리뷰 가능한 문서 역할을 맡긴다.'],
  ['Code anchor sidebar', '글의 주장 옆에 실제 코드 라인과 타입을 붙인다. 주장이 코드와 분리되면 검증 기록이 아니라 에세이가 된다.'],
  ['Regression ledger', '테스트 결과, 실패 메시지, fork/version 전제를 날짜와 함께 남긴다. 프로토콜 변경과 구현 퇴행을 분리한다.'],
  ['Agent review loop', '에이전트는 후보 경계 탐색, 반례 제안, 테스트 누락 검토에 쓰고 최종 명세는 사람이 확정한다.'],
];

const failureModes = [
  ['너무 크게 자름', '테스트가 통과해도 무엇을 믿게 됐는지 모른다.', '입력/출력/상태를 한 문장으로 못 쓰면 더 작게 자른다.'],
  ['예시만 있음', 'happy path는 문서가 되지만 검증이 되지 않는다.', 'accepted 불변조건과 reject 반례를 먼저 쓴다.'],
  ['구현을 베낌', '기존 코드를 그대로 다시 표현해서 같은 버그를 통과시킨다.', '소스 코드는 근거로 쓰되 명세 문장은 독립적으로 쓴다.'],
  ['oracle을 숨김', 'KZG, DB, network, clock 같은 외부 신뢰점이 안 보인다.', 'oracle로 둔 부분을 이름 붙이고 다음 검증 후보로 넘긴다.'],
  ['테스트가 섞임', '실패 원인이 어느 속성인지 모른다.', '한 fixture는 한 속성만 깨도록 강제한다.'],
];

function Table({ rows, headers }: { rows: string[][]; headers: string[] }) {
  return (
    <div className="not-prose my-6">
      <div className="hidden overflow-hidden rounded-md border lg:block">
      <table className="w-full table-fixed text-sm">
        <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-semibold">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join(':')} className="border-b last:border-0">
              {row.map((cell, index) => (
                <td
                  key={`${cell}-${index}`}
                  className={`px-4 py-3 align-top ${index === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="divide-y divide-border border-y border-border lg:hidden">
        {rows.map((row) => (
          <dl key={row.join(':')} className="space-y-3 py-4">
            {row.map((cell, index) => (
              <div key={`${headers[index]}-${cell}`} className="grid min-w-0 gap-1 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-3">
                <dt className="text-[11px] font-semibold text-muted-foreground">{headers[index]}</dt>
                <dd className={`min-w-0 break-words text-sm leading-relaxed ${index === 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{cell}</dd>
              </div>
            ))}
          </dl>
        ))}
      </div>
    </div>
  );
}

const boundaryStages = [
  ['01', '경계를 고른다', '입력과 출력이 한 문장으로 보이는 함수 하나'],
  ['02', '속성을 쓴다', '허용 결과에서 반드시 참이어야 할 문장'],
  ['03', '하나만 깨뜨린다', '속성 하나만 위반하는 최소 반례 fixture'],
  ['04', '증거를 남긴다', '실행 명령·결과·남은 외부 신뢰점'],
];

function BoundaryEvidenceViz() {
  return (
    <div className="not-prose my-8 border-y border-border py-5" aria-label="경계를 검증 증거로 바꾸는 네 단계">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[11px] font-bold text-muted-foreground">BOUNDARY TO EVIDENCE</p>
          <h3 className="mt-1 text-base font-bold">큰 시스템을 한 번에 증명하지 않는다</h3>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">각 단계의 출력이 다음 단계의 입력이 되어야 검증 기록이 누적됩니다.</p>
      </div>
      <ol className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-4">
        {boundaryStages.map(([number, title, detail]) => (
          <li key={number} className="min-w-0 bg-background p-4">
            <span className="font-mono text-xs font-bold text-muted-foreground">{number}</span>
            <strong className="mt-3 block text-sm">{title}</strong>
            <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">{detail}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function FmBoundaryPracticeArticle() {
  return (
    <>
      <section id="problem" className="mb-16 scroll-mt-20">
        <p className="mb-3 font-mono text-sm text-muted-foreground">FM practice · boundary-first accumulation</p>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">지저분한 큰 덩어리를 검증 가능한 작은 단위로 축적하기</h2>
        <QuestionLead
          question="전체 시스템을 다 이해하지 못한 상태에서도, 어디부터 '믿어도 된다'고 말할 수 있을까?"
          answer="입력·출력·읽고 쓰는 상태를 한 문장으로 고정할 수 있는 가장 작은 경계부터 시작한다. 그 경계에서 반드시 지켜야 할 속성을 쓰고, 속성 하나만 깨는 반례를 실행해 결과를 남기면 전체 재작성 없이도 신뢰 범위가 한 칸씩 넓어진다."
        />
        <ConceptPrimer
          items={[
            { term: '경계', meaning: '입력과 관찰 가능한 출력, 외부 의존성이 구분되는 함수·프로토콜 단계다.', why: '무엇을 검증했고 무엇은 아직 믿지 않는지 범위를 닫는다.' },
            { term: '전제 조건', meaning: '이 경계에 들어오기 전에 상위 계층이 이미 보장해야 하는 조건이다.', why: '상위 입력 오류를 현재 함수의 책임으로 잘못 돌리지 않는다.' },
            { term: '불변조건', meaning: '허용된 결과라면 반드시 참이어야 하는 속성 문장이다.', why: '예시가 아니라 새로운 입력에도 적용할 판정 기준을 만든다.' },
            { term: '최소 반례', meaning: '정상 fixture에서 속성 하나만 깨뜨린 가장 작은 실패 입력이다.', why: '실패 원인을 한 조건에 귀속시켜 회귀 테스트를 설명 가능한 증거로 만든다.' },
          ]}
        />
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          레거시 코드나 오래 누적된 개념 체계는 처음부터 깨끗한 모듈로 보이지 않는다. 그래서 전체를
          신뢰하거나 전체를 재작성하는 대신, 관찰 가능한 경계를 하나씩 자르고 각 경계에 대해 명세,
          반례, 테스트, 남은 위험을 남긴다. 이 방식의 목적은 지저분함을 미화하는 것이 아니라, 실제로
          믿을 수 있는 부분과 아직 믿으면 안 되는 부분을 분리하는 것이다.
        </p>
        <BoundaryEvidenceViz />
      </section>

      <section id="frame" className="mb-16 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">판단 프레임</h2>
        <Table headers={['항목', '내용']} rows={decisionFrame} />
      </section>

      <section id="workflow" className="mb-16 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">반복 절차</h2>
        <Table headers={['단계', '작업', '객관적 판정 기준']} rows={workflow} />
      </section>

      <section id="cut-types" className="mb-16 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">자를 수 있는 경계의 종류</h2>
        <Table headers={['종류', '정의', '예시', '운영 방식']} rows={cutTypes} />
      </section>

      <section id="artifacts" className="mb-16 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">남겨야 하는 산출물</h2>
        <Table headers={['산출물', '기준']} rows={artifactChecklist} />
      </section>

      <section id="implementation" className="mb-16 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">구현 아이디어</h2>
        <Table headers={['아이디어', '구현 방향']} rows={implementationIdeas} />
      </section>

      <section id="failure-modes" className="mb-16 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">실패 모드</h2>
        <Table headers={['실패', '문제', '방지 기준']} rows={failureModes} />
      </section>

      <section id="next" className="mb-16 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">다음 작업 단위</h2>
        <div className="border-y border-border py-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            첫 사례가 <code>validateBlobTx</code>라면 다음 후보는 두 갈래다. 하나는
            <code>ValidateTransaction</code>의 공통 pre-check를 잘라 static validation의 상위 전제를
            검증하는 것이고, 다른 하나는 stateful nonce/balance 검증으로 넘어가 state-read boundary를
            다루는 것이다. 순서는 pure boundary에서 state-read boundary로 넓히는 편이 좋다.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to={coreItemPath('verification-practice', 'geth-blob-tx-fm')} className="rounded-md border px-3 py-2 text-xs font-semibold hover:bg-muted/40">
              첫 적용 사례: validateBlobTx
            </Link>
            <Link to={coreItemPath('verification-practice', 'geth-test-units')} className="rounded-md border px-3 py-2 text-xs font-semibold hover:bg-muted/40">
              전체 검증 레지스트리
            </Link>
          </div>
        </div>
        <CapabilityCheck
          title="이 글만 읽고 할 수 있어야 하는 판정"
          items={[
            '후보 함수의 입력·출력·읽는 상태·쓰는 상태를 분리한다.',
            '상위 전제와 현재 경계의 불변조건을 서로 다른 문장으로 쓴다.',
            '정상 fixture에서 한 속성만 깨는 최소 반례를 만든다.',
            '통과한 범위와 외부 oracle로 남긴 범위를 위험 장부에 함께 적는다.',
          ]}
        />
        <SourceNotes sources={[
          { label: 'Go Fuzzing', href: 'https://go.dev/doc/security/fuzz/', note: '정상 단위 테스트와 함께 예상하지 못한 입력 공간을 탐색하는 공식 Go 안내.' },
          { label: 'Hypothesis', href: 'https://hypothesis.readthedocs.io/en/latest/', note: '예시를 넘어 성질과 반례를 중심으로 테스트를 설계하는 property-based testing 문서.' },
          { label: 'Lamport · TLA+', href: 'https://lamport.azurewebsites.net/tla/tla.html', note: '상태와 동작, 불변조건을 분리해 시스템을 기술하는 형식 명세의 기준 자료.' },
        ]} />
      </section>
    </>
  );
}
import { Link } from 'react-router-dom';
import {
  CapabilityCheck,
  ConceptPrimer,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { coreItemPath } from '@/lib/paths';
