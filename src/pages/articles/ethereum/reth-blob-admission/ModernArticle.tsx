import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import type { ProjectMeta } from "@/components/code/types";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import RethEip4844Locator, {
  RethEip4844MapReturn,
} from "../reth-eip4844/RethEip4844Locator";
import AdmissionTraceViz from "./AdmissionTraceViz";
import { codeRefs } from "./codeRefs";
import { rethBlobAdmissionTree } from "./fileTree";

const PROJECT_META: Record<string, ProjectMeta> = {
  reth: {
    id: "reth",
    label: "Reth v2.8.1 · Rust",
    badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
  },
};

function CodeLink({
  codeKey,
  label,
  open,
}: {
  codeKey: keyof typeof codeRefs;
  label: string;
  open: (key: string, ref: (typeof codeRefs)[string]) => void;
}) {
  return (
    <div className="not-prose flex flex-wrap items-center gap-2">
      <CodeViewButton onClick={() => open(codeKey, codeRefs[codeKey])} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export default function ModernRethBlobAdmission() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="scroll-mt-20 space-y-5">
        <RethEip4844Locator current="reth-blob-admission" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            Reth는 비용이 다른 검사를 어떤 순서로 실행해 Blob transaction을 Pool에 받습니까?
          </h2>
        </div>
        <p className="text-lg leading-8">
          새로 받은 외부 Blob transaction 한 건을 T₀라고 하겠습니다. T₀는 type 3,
          nonce 7, Blob reference 한 개와 v0 sidecar 한 개를 가집니다. Sender의 현재
          nonce도 7이고 balance는 T₀의 최대 비용보다 큽니다. 이 값들은 한 요청을
          끝까지 놓치지 않기 위한 설명용 사례이며, 실제 Reth는 선택한 head와 node
          설정에서 값을 읽습니다.
        </p>
        <AdmissionTraceViz />
        <p>
          핵심은 “싼 검사부터 KZG까지”라는 한 문장보다 더 정확합니다. Reth v2.8.1은
          transaction 자체로 판단할 수 있는 stateless 검사를 먼저 끝냅니다. 통과한
          경우에만 state provider와 sender account를 읽고, 그 뒤 새 sidecar의 version,
          transaction 결속과 KZG proof를 확인합니다. 결과는 <code>Valid</code>,
          <code>Invalid</code>, <code>Error</code>로 나뉘며, <code>Valid</code>도 실제
          Pool insertion을 시도할 자격일 뿐 최종 삽입을 보장하지 않습니다.
        </p>
        <ContentBoundary article="reth-blob-admission" />
      </section>

      <section id="cheap-checks" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">Stateless</h2>
        <p>
          <code>validate_stateless</code>는 이미 transaction 타입으로 decode된 T₀를
          받습니다. 따라서 기존 글의 “bounded decode”는 이 함수의 실제 책임이
          아니었습니다. 여기서 확인하는 크기도 131,072-byte Blob 원문 전체가 아니라
          transaction의 input과 access list 같은 동적 영역입니다.
        </p>
        <TermBreakdown
          title="T₀가 state 조회 전에 통과해야 하는 조건"
          items={[
            {
              term: "Type · fork",
              description: "Type 3을 지원하고 EIP-4844·Cancun 조건이 활성화되어야 합니다.",
              boundary: "활성 fork는 고정 상수가 아니라 ChainSpec과 현재 head에 따라 달라집니다.",
            },
            {
              term: "Size · gas",
              description: "Transaction 동적 크기, block·개별 gas limit과 intrinsic gas를 검사합니다.",
              boundary: "Sidecar의 Blob 원문 크기 검증과 같은 단계가 아닙니다.",
            },
            {
              term: "Fee · chain",
              description: "Tip과 fee cap 관계, local fee cap, minimum priority fee, chain id를 확인합니다.",
              boundary: "Blob fee와 execution fee를 같은 수치로 더해 비교하지 않습니다.",
            },
            {
              term: "Blob count",
              description: "Blob reference가 1개 이상이고 활성 fork의 상한 이하여야 합니다.",
              example: "T₀는 한 개이므로 이 gate를 통과합니다.",
            },
          ]}
        />
        <p>
          이 단계에서 크기 초과나 chain id 불일치가 발견되면 state provider와 KZG를
          호출하지 않고 <code>Invalid(transaction, reason)</code>으로 끝납니다. 실패를
          일찍 끝내는 것은 단순한 속도 최적화가 아니라, 잘못된 입력이 node의 DB 조회와
          암호 연산을 반복해서 강제하지 못하게 하는 비용 경계입니다.
        </p>
        <CodeLink codeKey="stateless" label="Reth v2.8.1 · validate_stateless의 실제 분기" open={sidebar.open} />
      </section>

      <section id="state-kzg" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">State와 Sidecar</h2>
        <p>
          Stateless 검사를 통과하면 최신 state provider를 한 번 얻고 T₀ sender의 account를
          읽습니다. Provider 생성이나 account 조회가 실패한 경우는 T₀가 규칙을 어겼다는
          뜻이 아니므로 <code>Error</code>입니다. 조회에 성공한 뒤 sender bytecode, nonce,
          balance를 검사하다 규칙 위반을 발견하면 <code>Invalid</code>입니다.
        </p>
        <ExplainedFormula
          question="T₀는 언제 validator의 Valid가 됩니까?"
          idea="모든 검사는 같은 transaction과 같은 head의 state를 기준으로 참이어야 합니다. 이 식은 검사 순서를 요약하며, 실제 결과 타입은 실패 원인에 따라 Invalid와 Error를 구분합니다."
          formula={String.raw`V(T_0,H)=I_{stateless}\land I_{account(H)}\land I_{sidecar}\land I_{extra}`}
          annotatedFormula={String.raw`\begin{aligned}I_{cheap}&=\underbrace{I_{fork}\land I_{size}\land I_{gas,fee}\land I_{chain}\land I_{blob\ count}}_{\text{state 조회 전}}\\I_{state}&=\underbrace{I_{bytecode}\land I_{nonce}\land I_{balance}}_{\text{head H의 account}}\\V(T_0,H)&=\underbrace{I_{cheap}\land I_{state}\land I_{sidecar}\land I_{extra}}_{\text{모두 참일 때 Valid}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`I_{fork}\land I_{size}\land I_{gas,fee}\land I_{chain}\land I_{blob\ count}`,
              annotation: ["Transaction 자체와 설정으로 판단합니다.", "거짓이면 account를 읽지 않고 Invalid입니다."],
            },
            {
              expression: String.raw`I_{bytecode}\land I_{nonce}\land I_{balance}`,
              annotation: ["같은 head H의 account와 비교합니다.", "Provider 조회 실패는 이 boolean이 아니라 Error입니다."],
            },
            {
              expression: String.raw`I_{sidecar}`,
              annotation: ["새 제출은 version·binding·KZG를 확인합니다.", "T₀는 proof까지 맞아야 통과합니다."],
            },
          ]}
          terms={[
            { symbol: "T₀", name: "검사할 제출", description: "Type-3 transaction과 새 sidecar 한 개입니다." },
            { symbol: "H", name: "Head snapshot", description: "Nonce와 balance를 읽는 동일한 chain state입니다." },
            { symbol: "V", name: "Validator result", description: "현재 head에서 Valid이면 1입니다." },
          ]}
          assumptions={[
            "선택한 Reth release, ChainSpec, node 설정과 KZG backend를 고정합니다.",
            "Provider read 성공과 transaction 규칙 만족을 같은 실패로 합치지 않습니다.",
            "Validator Valid와 Pool insertion 성공을 구분합니다.",
          ]}
          interpretation="T₀의 nonce가 7인데 head H의 sender nonce가 8이면 I_nonce=0이므로 Invalid입니다. 반대로 DB 조회 자체가 실패하면 식을 계산할 account가 없으므로 Error이며, T₀를 영구적으로 잘못된 입력이라고 단정하지 않습니다."
        />
        <CodeLink codeKey="validation-path" label="Reth v2.8.1 · stateless에서 stateful로 내려가는 실제 호출 순서" open={sidebar.open} />

        <h3 className="break-keep text-xl font-bold">Present · Missing · None</h3>
        <p>
          Account 검사를 통과한 새 T₀는 <code>Present(sidecar)</code> 분기로 들어갑니다.
          Reth는 활성 fork에 맞는 sidecar version인지 확인하고, transaction의 reference와
          sidecar commitment가 맞는지와 KZG proof를 구현 타입에 맡겨 검증합니다. 성공한
          sidecar는 <code>Some(sidecar)</code>로 다음 결과에 실립니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px text-sm leading-6 sm:grid-cols-3">
          {[
            ["Present", "새 제출입니다. Version·binding·KZG를 검증하고 성공하면 sidecar를 전달합니다."],
            ["Missing", "Reorg 재주입일 수 있습니다. 같은 tx hash의 검증된 sidecar가 BlobStore에 있어야 통과합니다."],
            ["None", "Blob transaction인데 sidecar 상태가 아예 없는 내부 경계입니다. 지원할 수 없는 transaction으로 거부합니다."],
          ].map(([title, body]) => (
            <div key={title} className="bg-background p-4">
              <strong className="text-xs text-primary">{title}</strong>
              <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <p>
          Parent 글에서 이미 개수·reference·KZG 결속을 설명했으므로 여기서는 그 수학을
          반복하지 않습니다. 이 글이 소유하는 질문은 Reth가 그 검사를 전체 admission
          순서의 어디에서 호출하고 어떤 결과 타입으로 바꾸는가입니다.
        </p>
        <CodeLink codeKey="blob-validation" label="Reth v2.8.1 · validate_eip4844의 세 sidecar 상태" open={sidebar.open} />
      </section>

      <section id="outcomes" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">세 결과</h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[44rem] border-collapse text-left text-xs leading-5">
            <thead>
              <tr className="text-muted-foreground">
                <th className="px-3 py-3">결과</th>
                <th className="px-3 py-3">뜻</th>
                <th className="px-3 py-3">T₀의 예</th>
                <th className="px-3 py-3">다음 동작</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Valid", "현재 head에서 유효", "모든 gate 통과 · ValidWithSidecar", "Pool insertion 시도"],
                ["Invalid", "Transaction 규칙 위반", "nonce 불일치 · bad proof", "invalid event와 typed error"],
                ["Error", "검증 의존성 실패", "latest state provider 조회 실패", "discarded event와 운영 오류"],
              ].map((row) => (
                <tr key={row[0]} className="border-t border-border">
                  {row.map((cell, index) => index === 0 ? <th key={cell} className="px-3 py-3">{cell}</th> : <td key={cell} className="px-3 py-3">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          세 결과를 bool 하나로 줄이면 입력 문제와 노드 장애가 같은 retry 대상이 됩니다.
          Reth의 타입은 현재 head에서 유효한 후보, 영구적 제약을 위반한 입력, 검증 중 발생한
          의존성 오류를 분리해 Pool과 관측 경계에 전달합니다.
        </p>
        <CodeLink codeKey="outcomes" label="Reth v2.8.1 · TransactionValidationOutcome과 ValidWithSidecar" open={sidebar.open} />
      </section>

      <section id="pool-insertion" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">Pool 삽입</h2>
        <p>
          T₀가 <code>ValidWithSidecar</code>가 되면 Reth는 transaction과 sidecar를 다시
          분리하고 <code>pool.add_transaction</code>을 호출합니다. 여기에는 sender nonce
          graph, duplicate와 replacement 같은 Pool 자체 규칙이 있으므로 validator의
          <code>Valid</code>가 곧 삽입 성공을 뜻하지 않습니다.
        </p>
        <ol className="not-prose grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-3">
          {[
            ["01 · Insert", "Valid transaction을 account metadata와 함께 내부 Pool graph에 넣습니다."],
            ["02 · Capacity", "Batch 뒤 size limit을 넘으면 discard_worst가 후보를 제거하고 방금 넣은 T₀도 DiscardedOnInsert가 될 수 있습니다."],
            ["03 · Sidecar", "Pool write lock을 놓은 뒤 새 삽입 metadata의 sidecar를 BlobStore와 listener에 전달하고, capacity에서 탈락한 후보의 Blob은 이어서 지웁니다."],
          ].map(([title, body]) => (
            <li key={title} className="bg-background p-4">
              <strong className="block text-xs text-primary">{title}</strong>
              <span className="mt-2 block break-keep text-xs leading-5">{body}</span>
            </li>
          ))}
        </ol>
        <p>
          따라서 기존 글의 “KZG 뒤 resource gate가 admission을 결정한다”는 표현은 실제
          v2.8.1 경계를 지나치게 단순화했습니다. 암호 검증은 validator 안에 있고, Pool
          insertion과 capacity eviction, sidecar 저장은 그 뒤의 별도 상태 전이입니다.
          다음 글은 여기서 전달된 sidecar가 BlobStore에서 어떻게 보관되고 정리되는지
          이어서 설명합니다.
        </p>
        <CodeLink codeKey="pool-insertion" label="Reth v2.8.1 · Valid outcome에서 Pool과 BlobStore로 이어지는 경계" open={sidebar.open} />
      </section>

      <section id="paper-reth-blob-validation" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">근거 범위</h2>
        <CitationBlock
          type="code"
          citeKey={1}
          source="Reth v2.8.1 · d763342fa185 · transaction-pool"
          href="https://github.com/paradigmxyz/reth/tree/v2.8.1/crates/transaction-pool"
        >
          <p><b>확인한 범위:</b> stateless→state provider→account→Blob validation 순서, Valid·Invalid·Error 타입, Pool insertion과 sidecar 저장 경계입니다.</p>
          <p><b>고정 조건:</b> Reth v2.8.1 release, 해당 release의 ChainSpec·feature와 KZG backend를 기준으로 읽습니다.</p>
          <p><b>확대하지 않은 범위:</b> Moving main의 함수명과 순서, 모든 node의 local limit, 대상 환경의 처리량과 공격 비용을 보장하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock
          type="paper"
          citeKey={2}
          source="EIP-4844 · Shard Blob Transactions"
          href="https://eips.ethereum.org/EIPS/eip-4844"
        >
          <p><b>확인한 범위:</b> Type-3 transaction, versioned hash와 Blob sidecar validation의 protocol 조건입니다.</p>
          <p><b>확대하지 않은 범위:</b> Reth local Pool ordering·capacity·retention이나 block inclusion·finality를 정하지 않습니다.</p>
        </CitationBlock>
      </section>

      <section className="not-prose border-y border-border py-5" aria-labelledby="reth-blob-admission-review">
        <p className="text-[10px] font-bold text-primary">그림 없이 다시 설명하기</p>
        <h2 id="reth-blob-admission-review" className="mt-2 text-xl font-bold">
          T₀가 제출된 뒤 sidecar가 저장 단계로 넘어갈 때까지 설명해 보세요
        </h2>
        <ol className="mt-4 grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-3">
          {[
            ["01 · 순서", "왜 stateless 뒤에 state provider와 KZG가 옵니까? (답: Stateless·State와 Sidecar)"],
            ["02 · 결과", "Invalid와 Error는 무엇이 다릅니까? (답: 세 결과)"],
            ["03 · 경계", "Validator Valid가 왜 최종 삽입 보장이 아닙니까? (답: Pool 삽입)"],
          ].map(([title, body]) => (
            <li key={title} className="bg-background p-4">
              <strong className="block text-xs text-primary">{title}</strong>
              <span className="mt-2 block break-keep">{body}</span>
            </li>
          ))}
        </ol>
      </section>

      <RethEip4844MapReturn current="reth-blob-admission" />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ reth: rethBlobAdmissionTree }}
        projectMetas={PROJECT_META}
      />
    </article>
  );
}
