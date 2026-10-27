import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import type { ProjectMeta } from "@/components/code/types";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import RethEip4844Locator, {
  RethEip4844MapReturn,
} from "./RethEip4844Locator";
import {
  alloyEip4844Tree,
  rethEip4844Tree,
} from "./modernFileTree";
import { modernCodeRefs } from "./modernCodeRefs";
import { BlobBoundaryViz } from "./viz/ModernEip4844Viz";

const PROJECT_META: Record<string, ProjectMeta> = {
  reth: {
    id: "reth",
    label: "Reth v2.8.1 · Rust",
    badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
  },
  alloy: {
    id: "alloy",
    label: "Alloy v2.5.0 · Rust",
    badgeClass: "bg-sky-500/10 border-sky-500 text-sky-700",
  },
};

export default function ModernRethEip4844() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RethEip4844Locator current="reth-eip4844" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            큰 Blob을 transaction과 sidecar로 나누고도 어떻게 같은 제출인지 검증합니까?
          </h2>
        </div>
        <p className="text-lg leading-8">
          롤업 배치 하나를 EIP-4844 Blob 형식으로 인코딩한다고 하겠습니다. 이
          글에서는 131,072-byte Blob을 B₀라고 부릅니다. 여기서 만든 48-byte
          commitment는 C₀, 32-byte versioned hash는 h₀, 48-byte proof는
          π₀입니다. 네 기호는 같은 제출을 끝까지 추적하기 위한 설명용
          식별자입니다.
        </p>
        <BlobBoundaryViz />
        <p>
          답은 세 조건을 함께 확인하는 것입니다. 먼저 transaction과 sidecar의
          목록 수와 순서가 맞아야 합니다. 이어서 같은 index의 commitment에서
          다시 계산한 versioned hash를 transaction의 참조와 비교합니다. 마지막으로
          Blob·commitment·proof의 KZG 검증도 통과해야 합니다. Hash 하나만 맞거나
          proof 하나만 유효해서는 같은 제출로 받아들일 수 없습니다.
        </p>
        <ContentBoundary article="reth-eip4844" />
      </section>

      <section id="body-sidecar" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">두 기록</h2>
        <p>
          Type-3 transaction은 실행 계층이 합의해야 할 참조와 가격 조건을
          남깁니다. <code>blob_versioned_hashes[0]</code>에는 h₀가 들어가지만 B₀
          원문은 들어가지 않습니다. Blob sidecar는 별도 목록의 같은 index 0에
          B₀·C₀·π₀를 싣습니다.
        </p>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[42rem] border-collapse text-left text-xs leading-5">
            <thead>
              <tr className="text-muted-foreground">
                <th className="px-3 py-3">기록</th>
                <th className="px-3 py-3">보관하는 값</th>
                <th className="px-3 py-3">답하는 질문</th>
                <th className="px-3 py-3">혼자서는 증명하지 못하는 것</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <th className="px-3 py-3">Type-3 transaction</th>
                <td className="px-3 py-3">h₀ · Blob fee 상한 · 실행 필드</td>
                <td className="px-3 py-3">실행 payload가 어느 Blob을 참조하는가</td>
                <td className="px-3 py-3">B₀ 원문의 가용성과 KZG proof</td>
              </tr>
              <tr className="border-t border-border">
                <th className="px-3 py-3">Blob sidecar</th>
                <td className="px-3 py-3">B₀ · C₀ · π₀</td>
                <td className="px-3 py-3">검증할 데이터와 witness가 무엇인가</td>
                <td className="px-3 py-3">어느 signed transaction의 참조인지</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          두 기록을 나누면 execution payload가 Blob 원문 전체를 영구 실행
          데이터처럼 품지 않아도 됩니다. 하지만 분리된 두 기록을 index와
          암호학적 결속으로 다시 묶지 않으면 공격자가 다른 Blob이나
          commitment를 끼워 넣을 수 있습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton
            onClick={() => sidebar.open("transaction-fields", modernCodeRefs["transaction-fields"])}
          />
          <span className="text-xs text-muted-foreground">
            Alloy · transaction의 참조 필드와 검증 위임
          </span>
          <CodeViewButton
            onClick={() => sidebar.open("sidecar-fields", modernCodeRefs["sidecar-fields"])}
          />
          <span className="text-xs text-muted-foreground">
            Alloy · sidecar의 Blob·commitment·proof 목록
          </span>
        </div>
      </section>

      <section id="versioned-binding" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Reference</h2>
        <p>
          C₀를 그대로 transaction에 넣지 않고 32-byte versioned hash h₀로
          바꿉니다. 먼저 C₀의 SHA-256 digest를 구합니다. 그 첫 byte를 현재 KZG
          scheme version인 <code>0x01</code>로 바꾸면 어떤 검증 방식의 어느
          commitment를 가리키는지 한 값에 남길 수 있습니다.
        </p>
        <ExplainedFormula
          question="48-byte commitment C₀에서 transaction에 넣을 32-byte h₀를 어떻게 만듭니까?"
          idea="C₀를 SHA-256으로 32 bytes로 줄이고 첫 byte를 scheme version으로 바꿉니다. 이 계산은 C₀를 B₀로 복원하지 않으며 KZG proof 검증도 대신하지 않습니다."
          formula={String.raw`h_0=\mathtt{0x01}\,\|\,\operatorname{SHA256}(C_0)[1{:}32]`}
          annotatedFormula={String.raw`\begin{aligned}d&=\underbrace{\operatorname{SHA256}(C_0)}_{\text{48-byte commitment를 32-byte digest로 변환}}\\h_0&=\underbrace{\mathtt{0x01}}_{\text{KZG version}}\,\|\,\underbrace{d[1{:}32]}_{\text{digest의 뒤 31 bytes}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\operatorname{SHA256}(C_0)`,
              annotation: ["48-byte C₀를 hash합니다.", "32-byte digest d를 얻습니다."],
            },
            {
              expression: String.raw`d[1{:}32]`,
              annotation: ["Digest의 첫 byte 자리를 비웁니다.", "뒤 31 bytes는 그대로 둡니다."],
            },
            {
              expression: String.raw`\mathtt{0x01}\,\|\,d[1{:}32]`,
              annotation: ["첫 byte에 KZG version을 기록합니다.", "결과 h₀는 32 bytes입니다."],
            },
          ]}
          terms={[
            { symbol: "C₀", name: "KZG commitment", description: "B₀를 결속하는 48-byte 값입니다." },
            { symbol: "d", name: "SHA-256 digest", description: "C₀에서 만든 32-byte 중간값입니다." },
            { symbol: "h₀", name: "Versioned hash", description: "Transaction body가 보관하는 32-byte Blob 참조입니다." },
          ]}
          assumptions={[
            "EIP-4844 v0의 KZG version 0x01을 사용합니다.",
            "Commitment의 byte encoding과 SHA-256 입력 순서를 고정합니다.",
            "Reference 결속과 Blob proof 검증은 서로 다른 검사입니다.",
          ]}
          interpretation="Transaction의 h₀는 C₀의 digest에서 나온 참조입니다. B₀ 원문이나 π₀가 없어도 h₀ 자체는 계산할 수 있으므로, 이 식 하나만으로 데이터 가용성이나 proof 유효성을 주장할 수 없습니다."
        />
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton
            onClick={() => sidebar.open("versioned-hash", modernCodeRefs["versioned-hash"])}
          />
          <span className="text-xs text-muted-foreground">
            Alloy v2.5.0 · kzg_to_versioned_hash
          </span>
        </div>
      </section>

      <section id="validation" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">세 검사</h2>
        <ol className="not-prose grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-3">
          {[
            ["01 · 개수와 순서", "Transaction hash 1개와 sidecar의 Blob·commitment·proof가 각각 1개인지 확인합니다."],
            ["02 · Reference", "C₀에서 h₀를 다시 계산해 transaction의 index 0과 비교합니다."],
            ["03 · KZG proof", "B₀·C₀·π₀를 batch 검증에 넣고 true인지 확인합니다."],
          ].map(([title, body]) => (
            <li key={title} className="bg-background p-4">
              <strong className="block text-xs text-primary">{title}</strong>
              <span className="mt-2 block break-keep">{body}</span>
            </li>
          ))}
        </ol>
        <p>
          검사는 순서대로 서로 다른 공격을 막습니다. 개수가 다르면 같은 index의
          짝을 정할 수 없습니다. 개수만 같고 C₀가 다른 commitment라면 다시 계산한
          hash가 h₀와 다릅니다. Hash까지 맞더라도 π₀가 B₀와 C₀의 관계를 증명하지
          못하면 KZG 검증에서 거부합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton
            onClick={() => sidebar.open("sidecar-binding", modernCodeRefs["sidecar-binding"])}
          />
          <span className="text-xs text-muted-foreground">개수와 versioned hash 결속</span>
          <CodeViewButton
            onClick={() => sidebar.open("sidecar-proof", modernCodeRefs["sidecar-proof"])}
          />
          <span className="text-xs text-muted-foreground">Blob KZG batch proof</span>
        </div>
      </section>

      <section id="implementation" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Reth 경계</h2>
        <div className="not-prose grid gap-px bg-border p-px text-sm leading-6 sm:grid-cols-3">
          {[
            ["Reth v2.8.1", "Transaction과 sidecar version을 확인하고 Alloy 검증을 호출"],
            ["Alloy v2.5.0", "목록 결속과 versioned hash, KZG proof를 검증"],
            ["Reth BlobStore", "성공한 sidecar만 다음 저장 단계에서 사용"],
          ].map(([title, body], index) => (
            <div key={title} className="bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong className="mt-2 block text-sm">{title}</strong>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <p>
          Reth v2.8.1은 sidecar 검증식을 다시 구현하기보다
          <code>transaction.validate_blob</code>을 호출해 Alloy v2.5.0의 계약을
          사용합니다. 실패하면 transaction-pool의 EIP-4844 거부 사유와 메트릭으로
          바꾸고, 성공하면 추출한 sidecar를 저장 단계로 넘깁니다.
        </p>
        <p>
          이 글의 B₀·C₀·π₀는 EIP-4844 v0 sidecar를 설명합니다. 현재 Reth는 활성
          fork와 설정에 따라 EIP-7594 v1 sidecar도 구분합니다. 선택한 version의
          검증은 <code>BlobTransactionSidecarVariant</code>에 맡깁니다. 따라서 이
          글의 v0 구조를 현재 Reth가 다루는 모든 sidecar 형식으로 확대하면 안
          됩니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton
            onClick={() => sidebar.open("sidecar-version-boundary", modernCodeRefs["sidecar-version-boundary"])}
          />
          <span className="text-xs text-muted-foreground">Reth · fork별 sidecar version</span>
          <CodeViewButton
            onClick={() => sidebar.open("alloy-sidecar-variant", modernCodeRefs["alloy-sidecar-variant"])}
          />
          <span className="text-xs text-muted-foreground">Alloy · 공통 validation 계약</span>
          <CodeViewButton
            onClick={() => sidebar.open("reth-delegation", modernCodeRefs["reth-delegation"])}
          />
          <span className="text-xs text-muted-foreground">Reth · 실패 변환과 성공 전달</span>
        </div>
      </section>

      <section id="paper-eip4844" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거 범위</h2>
        <CitationBlock
          type="paper"
          citeKey={1}
          source="EIP-4844 · Shard Blob Transactions"
          href="https://eips.ethereum.org/EIPS/eip-4844"
        >
          <p><b>확인한 범위:</b> Type-3 transaction, v0 sidecar, versioned hash와 세 networking validation 조건입니다.</p>
          <p><b>확대하지 않은 범위:</b> Blob의 영구 보존, 롤업 내부 실행의 정확성, 특정 client의 Pool·저장 정책을 보장하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock
          type="code"
          citeKey={2}
          source="Reth v2.8.1 · d763342fa185"
          href="https://github.com/paradigmxyz/reth/releases/tag/v2.8.1"
        >
          <p><b>확인한 범위:</b> Transaction Pool의 sidecar version 판정, Alloy 검증 호출, 실패 metric과 성공 sidecar 전달입니다.</p>
          <p><b>주의:</b> Moving main이나 다른 release의 fork schedule과 crate 구조를 현재 구현으로 일반화하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock
          type="code"
          citeKey={3}
          source="Alloy v2.5.0 · EIP-4844 transaction and sidecar"
          href="https://github.com/alloy-rs/alloy/tree/v2.5.0/crates/eips/src/eip4844"
        >
          <p><b>확인한 범위:</b> Reth v2.8.1이 고정한 transaction fields, v0 sidecar 구조, versioned hash와 KZG validation입니다.</p>
          <p><b>주의:</b> 공식 구현의 존재는 대상 환경의 성능이나 Blob 가용 기간을 증명하지 않습니다.</p>
        </CitationBlock>
      </section>

      <section className="not-prose border-y border-border py-5" aria-labelledby="reth-eip4844-review">
        <p className="text-[10px] font-bold text-primary">그림 없이 다시 설명하기</p>
        <h2 id="reth-eip4844-review" className="mt-2 text-xl font-bold">
          한 Blob이 두 기록으로 나뉘고 다시 결속되는 과정을 설명해 보세요
        </h2>
        <ol className="mt-4 grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-3">
          {[
            ["01 · 분리", "Transaction과 sidecar에는 각각 무엇이 들어갑니까? (답: 두 기록)"],
            ["02 · Reference", "C₀에서 h₀를 어떻게 만들고 무엇을 증명하지 못합니까? (답: Reference)"],
            ["03 · 검증", "같은 제출임을 인정하려면 어떤 세 검사를 통과해야 합니까? (답: 세 검사)"],
          ].map(([title, body]) => (
            <li key={title} className="bg-background p-4">
              <strong className="block text-xs text-primary">{title}</strong>
              <span className="mt-2 block break-keep">{body}</span>
            </li>
          ))}
        </ol>
      </section>

      <RethEip4844MapReturn current="reth-eip4844" />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={modernCodeRefs}
        fileTrees={{ reth: rethEip4844Tree, alloy: alloyEip4844Tree }}
        projectMetas={PROJECT_META}
      />
    </article>
  );
}
