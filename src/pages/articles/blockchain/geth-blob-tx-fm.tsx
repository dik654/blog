import { Link } from 'react-router-dom';
import { CodeSidebar, useCodeSidebar, type CodeRef, type FileNode } from '@/components/code';
import {
  CapabilityCheck,
  ConceptPrimer,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { getCoreItem } from '@/content/core';
import { coreItemPath } from '@/lib/paths';
import validationGo from './da-theory/codebase/go-ethereum/core/txpool/validation.go?raw';
import txBlobGo from './da-theory/codebase/go-ethereum/core/types/tx_blob.go?raw';

function withKoreanIntentComments(code: string, replacements: Record<string, string>) {
  return code
    .split('\n')
    .map((line) => replacements[line.trim()] ? line.replace(line.trim(), replacements[line.trim()]) : line)
    .join('\n');
}

function sourceWindow(code: string, start: number, end: number) {
  return code.split('\n').slice(start - 1, end).join('\n');
}

const validationGoKo = withKoreanIntentComments(validationGo, {
  '// validateBlobTx implements the blob-transaction specific validations.':
    '// validateBlobTx는 blob transaction에만 필요한 정적 검증을 수행한다. 이 함수의 의도는 state DB 없이 sidecar, fork, blob fee, commitment, proof가 서로 맞는지만 판정하는 것이다.',
  '// Ensure the sidecar is constructed with the correct version, consistent':
    '// 현재 fork와 sidecar 버전이 맞는지 확인한다.',
  '// with the current fork.':
    '// Cancun은 v0, Osaka는 v1을 기대하므로 fork 전환 규칙이 이 분기의 핵심 의도다.',
  '// Ensure the blob fee cap satisfies the minimum blob gas price':
    '// blob gas fee cap이 프로토콜 최소 blob gas price 이상인지 확인한다. 너무 낮으면 txpool에 넣기 전에 거절한다.',
  '// Ensure the number of items in the blob transaction and various side':
    '// 비싼 KZG 검증으로 들어가기 전에 blob transaction 본문과 sidecar 배열의 개수가 맞는지 먼저 확인한다.',
  '// data match up before doing any expensive validations':
    '// 이 단계의 의도는 길이 불일치나 빈 blob처럼 싼 반례를 앞에서 제거해 검증 비용과 오류 원인을 줄이는 것이다.',
  '// Fork-specific sidecar checks, including proof verification.':
    '// 마지막으로 fork별 sidecar 검증을 수행한다. v0은 blob proof, v1은 cell proof 검증으로 분기한다.',
});

const txBlobGoKo = withKoreanIntentComments(txBlobGo, {
  '// BlobTxSidecar contains the blobs of a blob transaction.':
    '// BlobTxSidecar는 blob transaction이 본문에 직접 싣지 않는 blob 데이터 묶음이다. 검증 경계에서는 Version, Blobs, Commitments, Proofs가 모두 같은 blob 집합을 가리키는지가 핵심이다.',
  'Version     byte                 // Version':
    'Version     byte                 // 현재 fork에서 기대하는 sidecar 형식이다. Cancun은 v0, Osaka는 v1을 사용한다.',
  'Blobs       []kzg4844.Blob       // Blobs needed by the blob pool':
    'Blobs       []kzg4844.Blob       // blob pool과 KZG 검증에 필요한 실제 blob 데이터다.',
  'Commitments []kzg4844.Commitment // Commitments needed by the blob pool':
    'Commitments []kzg4844.Commitment // 각 blob에 대한 KZG commitment다. transaction의 blob hash와 연결되는 기준값이다.',
  'Proofs      []kzg4844.Proof      // Proofs needed by the blob pool':
    'Proofs      []kzg4844.Proof      // commitment가 blob을 올바르게 약속했다는 KZG proof다.',
  '// NewBlobTxSidecar initialises the BlobTxSidecar object with the provided parameters.':
    '// NewBlobTxSidecar는 전달받은 version/blob/commitment/proof 배열을 그대로 sidecar로 묶는다. 여기서는 정규화보다 입력 모델의 구조를 보여주는 역할이 크다.',
  '// BlobHashes computes the blob hashes of the given blobs.':
    '// BlobHashes는 commitment에서 versioned hash를 계산한다. 이 값이 transaction 안의 blob hash와 일치해야 sidecar가 해당 transaction에 붙은 데이터라고 볼 수 있다.',
  '// CellProofsAt returns the cell proofs for blob with index idx.':
    '// CellProofsAt은 v1 sidecar에서 특정 blob의 cell proof 묶음을 꺼낸다.',
  '// This method is only valid for sidecars with version 1.':
    '// 이 메서드는 Osaka 이후 v1 sidecar에서만 유효하므로, 버전 경계가 proof 해석 방식까지 바꾼다는 점을 보여준다.',
});

const codeRefs: Record<string, CodeRef> = {
  'validate-blob-tx': {
    path: 'go-ethereum/core/txpool/validation.go',
    code: sourceWindow(validationGoKo, 160, 199),
    lang: 'go',
    highlight: [160, 199],
    lineStart: 160,
    desc: 'validateBlobTx 경계. 상태 DB 없이 blob transaction 자체와 head/options만으로 판정 가능한 정적 검증 단위다. 코드 주석은 항상 한국어로 의도까지 풀어, 각 분기가 왜 이 순서로 놓였는지 같이 보이게 한다.',
    annotations: [
      { lines: [161, 164], color: 'sky', note: '입력 경계: tx, head, ValidationOptions만 읽고 sidecar 존재성을 먼저 확인한다.' },
      { lines: [165, 178], color: 'amber', note: 'fork 버전과 blob fee cap을 빠르게 걸러, 명백한 reject를 KZG 검증 전에 끝낸다.' },
      { lines: [180, 191], color: 'emerald', note: 'transaction의 blob hash 목록과 sidecar의 blobs/commitments가 같은 단위인지 길이와 hash 연결로 확인한다.' },
      { lines: [193, 199], color: 'rose', note: '비싼 KZG 검증은 마지막 단계로 분리하고, fork별 proof 형식 차이는 별도 함수에 맡긴다.' },
    ],
  },
  'blob-sidecar-type': {
    path: 'go-ethereum/core/types/tx_blob.go',
    code: sourceWindow(txBlobGoKo, 70, 100),
    lang: 'go',
    highlight: [71, 96],
    lineStart: 70,
    desc: 'BlobTxSidecar의 관찰 가능한 데이터 모델. Version, Blobs, Commitments, Proofs가 같은 blob 묶음을 설명해야 하며, 이 네 필드가 검증 단위의 핵심 입력이다.',
    annotations: [
      { lines: [72, 75], color: 'sky', note: 'FM 모델의 상태 변수로 쓸 수 있는 네 필드다. version은 해석 규칙, 나머지 배열은 같은 blob 집합의 증거다.' },
      { lines: [89, 96], color: 'emerald', note: 'commitment에서 versioned hash를 계산해 transaction의 blob hash와 연결하는 규칙이다.' },
    ],
  },
};

const fileTree: FileNode = {
  name: 'go-ethereum',
  type: 'dir',
  children: [
    {
      name: 'core',
      type: 'dir',
      children: [
        {
          name: 'txpool',
          type: 'dir',
          children: [{ name: 'validation.go - validateBlobTx()', type: 'file', path: 'core/txpool/validation.go', codeKey: 'validate-blob-tx' }],
        },
        {
          name: 'types',
          type: 'dir',
          children: [{ name: 'tx_blob.go - BlobTxSidecar', type: 'file', path: 'core/types/tx_blob.go', codeKey: 'blob-sidecar-type' }],
        },
      ],
    },
  ],
};

const stages = [
  ['0. 대상 절단', 'validateBlobTx(tx, head, opts)만 잡고 stateful nonce/balance 검증은 제외한다.'],
  ['1. 관찰 경계', '입력은 tx/head/options, 출력은 nil 또는 error. 내부 KZG 구현은 검증 오라클로 취급한다.'],
  ['2. 추상 모델', 'Sidecar = {version, blobs, commitments, proofs}, Tx = {type, blobHashes, blobFeeCap}.'],
  ['3. 전제 조건', '상위 ValidateTransaction이 BlobTxType 여부, fork 활성화, 서명, intrinsic gas를 이미 통과시킨다.'],
  ['4. 불변조건', 'accepted이면 sidecar 존재, version 일치, blobHashes 길이 > 0, 배열 길이 일치, commitment hash 일치, proof 검증 성공.'],
  ['5. 반례 생성', '각 불변조건을 하나씩 깨는 최소 tx fixture를 만든다. 한 테스트는 한 조건만 실패시킨다.'],
  ['6. 회귀 고정', 'fork version과 proof scheme이 바뀌어도 이 표의 관찰 결과가 바뀌면 의도적 변경인지 리뷰한다.'],
];

const properties = [
  ['P1 Sidecar 존재성', 'BlobTxType인데 sidecar가 nil이면 거절한다.', 'missing sidecar'],
  ['P2 Fork-version 일치', 'Cancun은 v0, Osaka는 v1 sidecar만 허용한다.', 'unexpected sidecar version'],
  ['P3 Blob fee 하한', 'BlobGasFeeCap >= params.BlobTxMinBlobGasprice', 'ErrTxGasPriceTooLow'],
  ['P4 빈 blob 금지', 'len(tx.BlobHashes()) > 0', 'blobless blob transaction'],
  ['P5 길이 보존', 'len(blobs) == len(hashes), len(commitments) == len(hashes)', 'invalid number'],
  ['P6 Commitment 연결', 'CalcBlobHashV1(commitment[i]) == tx.BlobHashes()[i]', 'mismatches transaction'],
  ['P7 Proof 건전성', 'v0은 blob proof, v1은 cell proofs가 검증되어야 허용한다.', 'ErrKZGVerificationError'],
];

const tests = [
  ['T0 정상 경로 v0', 'Cancun head, v0 sidecar, hash/proof가 모두 유효함', '허용'],
  ['T1 sidecar 없음', 'Sidecar nil', 'P1 위반으로 거절'],
  ['T2 잘못된 버전', 'Cancun head + v1 sidecar 또는 Osaka head + v0 sidecar', 'P2 위반으로 거절'],
  ['T3 낮은 blob fee', 'BlobGasFeeCap = min - 1', 'P3 위반으로 거절'],
  ['T4 빈 hash 목록', 'BlobHashes = []', 'P4 위반으로 거절'],
  ['T5 길이 불일치', '1 hash, 0 blobs 또는 2 commitments', 'P5 위반으로 거절'],
  ['T6 commitment 불일치', 'hashes[0]만 다른 commitment에서 계산', 'P6 위반으로 거절'],
  ['T7 잘못된 proof', 'blob/commitment는 맞지만 proof만 변조', 'P7 위반으로 거절'],
  ['T8 정상 경로 v1', 'Osaka head, v1 sidecar, cell proofs가 모두 유효함', '허용'],
];

const coreItem = getCoreItem('verification-practice', 'geth-blob-tx-fm');
const concepts = coreItem?.concepts ?? [];

function Table({ rows, headers }: { rows: string[][]; headers: string[] }) {
  return (
    <div className="not-prose my-6">
      <div className="hidden overflow-hidden rounded-md border lg:block">
      <table className="w-full table-fixed text-sm">
        <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
          <tr>
            {headers.map((header) => <th key={header} className="px-4 py-3 font-semibold">{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join(':')} className="border-b last:border-0">
              {row.map((cell, index) => (
                <td key={`${cell}-${index}`} className={`px-4 py-3 align-top ${index === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
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

const validationPath = [
  ['01', '형식·fork', 'sidecar 존재와 wrapper version'],
  ['02', '가격·개수', 'fee cap과 빈 blob, 배열 길이'],
  ['03', '연결', 'commitment에서 계산한 hash 일치'],
  ['04', '암호 증거', 'fork별 blob 또는 cell proof'],
];

function BlobValidationOrderViz() {
  return (
    <div className="not-prose my-8 border-y border-border py-5" aria-label="Blob transaction 검증 비용 순서">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[11px] font-bold text-muted-foreground">CHEAP REJECT → CRYPTOGRAPHIC PROOF</p>
          <h3 className="mt-1 text-base font-bold">싼 반례를 앞에서 제거한 뒤 KZG로 간다</h3>
        </div>
        <p className="text-xs text-muted-foreground">오른쪽으로 갈수록 계산 비용과 외부 oracle 의존성이 커집니다.</p>
      </div>
      <ol className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-4">
        {validationPath.map(([number, title, detail], index) => (
          <li key={number} className="min-w-0 bg-background p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-muted-foreground">{number}</span>
              <span className="font-mono text-[10px] text-muted-foreground">cost {index + 1}/4</span>
            </div>
            <strong className="mt-3 block text-sm">{title}</strong>
            <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">{detail}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function GethBlobTxFmArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <section id="scope" className="mb-16 scroll-mt-20">
        <p className="mb-3 text-sm text-muted-foreground">go-ethereum txpool 코드베이스에서 확인할 기능 경계</p>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">geth Blob 트랜잭션을 정적으로 검증하는 부분</h2>
        <QuestionLead
          question="Blob transaction이 txpool에 들어오기 전에, 상태 DB 없이도 무엇을 확실히 거절할 수 있을까?"
          answer="Transaction 본문과 sidecar가 같은 blob 묶음을 가리키는지, 현재 fork의 wrapper 형식인지, 최소 blob fee를 지키는지, 마지막 KZG proof까지 유효한지는 tx·head·options만으로 판정할 수 있다. Nonce와 balance는 이 함수의 책임이 아니므로 다음 stateful 경계로 남긴다."
        />
        <ConceptPrimer
          items={[
            { term: 'Blob transaction', meaning: '실행 calldata 대신 별도 data-availability blob을 참조하는 EIP-4844 transaction이다.', why: 'EVM 실행과 blob 데이터 검증의 책임을 분리한다.' },
            { term: 'Sidecar', meaning: 'Transaction 본문 밖에서 blob, commitment, proof와 wrapper version을 함께 운반하는 데이터다.', why: '본문 hash와 실제 데이터 증거가 어디에서 만나는지 보여준다.' },
            { term: 'Commitment', meaning: 'Blob 내용을 공개하지 않고도 동일한 데이터에 대한 proof를 검증하게 하는 KZG 약속값이다.', why: 'Blob hash와 proof 사이의 연결 고리를 이해한다.' },
            { term: 'Fork gate', meaning: 'Protocol 시점에 따라 허용되는 sidecar version과 proof 형식이 바뀌는 분기다.', why: '같은 byte 구조가 언제 유효한지 시간 전제를 명시한다.' },
          ]}
        />
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          오래된 코드베이스를 그대로 믿지 않고, 먼저 관찰 가능한 함수 경계를 하나 자른다.
          여기서는 geth의 blob transaction 정적 검증 경계인 <code>validateBlobTx</code>만 대상으로 삼는다.
          이 단위는 상태 DB, 네트워크, txpool 정책 전체를 몰라도 입력과 출력이 명확하다.
        </p>
        <BlobValidationOrderViz />
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => sidebar.open('validate-blob-tx', codeRefs['validate-blob-tx'])} className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent">
            validateBlobTx 소스
          </button>
          <button type="button" onClick={() => sidebar.open('blob-sidecar-type', codeRefs['blob-sidecar-type'])} className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent">
            BlobTxSidecar 모델
          </button>
        </div>
      </section>

      <section id="boundary" className="mb-16 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">경계 명세</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ['입력', 'tx, head, ValidationOptions. 외부 상태 DB는 읽지 않는다.'],
            ['출력', 'nil이면 accept, error면 reject. error 종류가 테스트 관찰값이다.'],
            ['제외', 'nonce, balance, account slot, mempool replacement 정책은 다음 경계로 미룬다.'],
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border p-4">
              <p className="mb-2 text-sm font-semibold">{title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="concepts" className="mb-16 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">핵심 개념 정리</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {concepts.map((concept) => (
            <div key={concept.term} className="rounded-lg border p-4">
              <p className="text-sm font-semibold">{concept.term}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{concept.summary}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">코드 의도: </span>
                {concept.intent}
              </p>
              <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                {concept.details.map((detail) => (
                  <li key={detail} className="pl-3 before:-ml-3 before:content-['-']">
                    {detail}
                  </li>
                ))}
              </ul>
              {concept.references && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">관련 글</span>
                  {concept.references.map((reference) => (
                    <Link
                      key={reference.href}
                      to={reference.href}
                      className="rounded-md border px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                    >
                      {reference.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="procedure" className="mb-16 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">검증 절차</h2>
        <Table headers={['단계', '판단 기준']} rows={stages} />
      </section>

      <section id="properties" className="mb-16 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">객관적 불변조건</h2>
        <Table headers={['속성', '정식 문장', '관찰 가능한 실패']} rows={properties} />
      </section>

      <section id="tests" className="mb-16 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">테스트 매트릭스</h2>
        <Table headers={['케이스', 'fixture 조작', '기대 결과']} rows={tests} />
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          핵심은 테스트 수가 아니라 독립성이다. 하나의 fixture는 하나의 속성만 깨야 한다.
          그래야 실패가 나왔을 때 구현이 틀렸는지, 명세가 틀렸는지, fork 전제가 바뀌었는지 분리해서 볼 수 있다.
        </p>
      </section>

      <section id="result" className="mb-16 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">이번 절단의 결과</h2>
        <div className="border-y border-border py-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            이 경계는 "검증된 지저분함"을 바로 재작성하지 않고 사용할 수 있게 만든다.
            geth 내부가 복잡해도 이 단위에서는 입력, 출력, 전제, 불변조건, 반례가 모두 표로 고정된다.
            다음 단위는 <code>ValidateTransaction</code>의 공통 pre-check 또는 stateful validation으로 확장하면 된다.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to={coreItemPath('verification-practice', 'fm-boundary-practice')} className="rounded-md border px-3 py-2 text-xs font-semibold hover:bg-muted/40">절단 방법으로 돌아가기</Link>
            <Link to={coreItemPath('verification-practice', 'geth-test-units')} className="rounded-md border px-3 py-2 text-xs font-semibold hover:bg-muted/40">geth 전체 레지스트리</Link>
          </div>
        </div>
        <CapabilityCheck
          title="이 글의 코드와 표만으로 판정할 수 있어야 하는 것"
          items={[
            'validateBlobTx가 책임지는 정적 검증과 nonce·balance 같은 stateful 검증을 구분한다.',
            'Cancun v0과 Osaka v1에서 sidecar와 proof 형식이 달라지는 이유를 설명한다.',
            '배열 길이·commitment hash·KZG proof가 서로 다른 실패를 잡는다는 점을 구분한다.',
            '싼 구조 검사를 KZG 검증보다 먼저 두는 성능·진단상의 이유를 설명한다.',
          ]}
        />
        <SourceNotes sources={[
          { label: 'go-ethereum · validation.go', href: 'https://github.com/ethereum/go-ethereum/blob/master/core/txpool/validation.go', note: '이 글의 함수 순서와 오류 경계를 고정한 원본 구현.' },
          { label: 'EIP-4844', href: 'https://eips.ethereum.org/EIPS/eip-4844', note: 'Blob-carrying transaction, versioned hash와 KZG commitment의 기초 규격.' },
          { label: 'EIP-7594 · PeerDAS', href: 'https://eips.ethereum.org/EIPS/eip-7594', note: 'Wrapper version 1과 cell proof 검증이 추가되는 이유와 필수 길이 조건.' },
        ]} />
      </section>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'go-ethereum': fileTree }}
        projectMetas={{
          'go-ethereum': { id: 'go-ethereum', label: 'go-ethereum · Go', badgeClass: 'bg-sky-50 border-sky-400 text-sky-800' },
        }}
      />
    </>
  );
}
