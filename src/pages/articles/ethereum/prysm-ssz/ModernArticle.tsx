import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import { prysmTree } from "./fileTrees";
import PrysmSszLocator, { PrysmSszMapReturn } from "./PrysmSszLocator";
import PrysmSszFlowViz from "./viz/PrysmSszFlowViz";

const Label = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">{children}</span>
);

const wireParts = [
  ["slot", "8 B", "01 00 00 00 00 00 00 00"],
  ["validators offset", "4 B", "10 00 00 00"],
  ["epoch", "4 B", "03 00 00 00"],
  ["validator 10", "8 B", "0a 00 00 00 00 00 00 00"],
  ["validator 20", "8 B", "14 00 00 00 00 00 00 00"],
] as const;

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <PrysmSszLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            Prysm이 받은 값 하나는 어떻게 전송 바이트와 검증 가능한 Root가 됩니까?
          </h2>
        </div>
        <PrysmSszFlowViz />
        <p className="text-lg leading-8">
          <Label>A</Label>SSZ schema가 두 계산의 공통 출발점이 됩니다. Serialization은 같은 typed value를 canonical bytes로 만들고, hash-tree-root는 field별 32-byte chunk를 Merkle tree에 놓아 commitment를 만듭니다. Generalized index는 그 tree에서 field의 위치를 가리킵니다.
        </p>
        <p>
          세 결과는 연결돼 있지만 같은 결과는 아닙니다. Wire bytes 32개를 그대로 SHA-256 한 값이 container root가 아니며, Merkle proof가 맞는다고 그 root가 canonical chain의 finalized state라는 뜻도 아닙니다. 이 글은 <Link to="/cs/blockchain/prysm#overview">Prysm 전체 구조</Link>에서 consensus object의 byte·root identity만 떼어 한 사례로 추적합니다.
        </p>
        <ContentBoundary article="prysm-ssz" />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">설명용 DemoRecord 하나를 끝까지 사용합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="설명용 SSZ container의 field와 값">
          {[
            ["field 0", "slot : uint64", "1"],
            ["field 1", "validators : List[uint64,4]", "[10, 20]"],
            ["field 2", "epoch : uint32", "3"],
          ].map(([index, type, value]) => (
            <div key={index} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{index}</span>
              <strong className="mt-1 block break-keep text-xs">{type}</strong>
              <code className="mt-2 block break-all text-[11px] text-muted-foreground">value = {value}</code>
            </div>
          ))}
        </div>
        <p>
          DemoRecord는 계산을 단순하게 보이기 위한 설명용 type이며 실제 Ethereum protocol object가 아닙니다. 다만 uint little-endian, variable field offset, list limit, 32-byte packing, mix-in-length, container Merkleization은 고정한 SSZ 규격의 실제 규칙을 그대로 적용합니다.
        </p>
      </section>

      <section id="schema" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Schema는 바이트 위치와 Tree 위치를 함께 정합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
          <div className="min-w-0 bg-background p-4">
            <span className="text-[10px] font-bold text-muted-foreground">Serialization이 읽는 정보</span>
            <strong className="mt-1 block text-sm">순서 · 고정 폭 · Dynamic 여부</strong>
            <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">slot 8 B 뒤에 validators 내용이 아니라 4-byte offset을 쓰고 epoch 4 B를 이어 붙입니다.</p>
          </div>
          <div className="min-w-0 bg-background p-4">
            <span className="text-[10px] font-bold text-muted-foreground">Merkleization이 읽는 정보</span>
            <strong className="mt-1 block text-sm">Type kind · Field 순서 · Limit</strong>
            <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">세 field root를 순서대로 leaf에 놓고 validators의 capacity 4와 실제 길이 2를 모두 반영합니다.</p>
          </div>
        </div>
        <p>
          Payload에는 <code>List[uint64,4]</code>라는 type 이름이 들어 있지 않습니다. 송신자와 수신자가 같은 fork schema를 이미 공유해야 offset 16 이후의 16 bytes를 두 uint64로 해석할 수 있습니다. 같은 bytes를 다른 schema로 읽으면 다른 value가 되거나 decode가 실패합니다.
        </p>
      </section>

      <section id="encode-decode" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Fixed part 16 Bytes 뒤에 List 내용 16 Bytes를 둡니다</h2>
        <ExplainedFormula
          question="validators의 시작 위치와 전체 wire 길이는 얼마입니까?"
          idea="Fixed part에는 slot 값, validators의 4-byte offset과 epoch 값이 들어갑니다. Variable part에는 두 uint64가 이어집니다."
          formula={String.raw`o_v=8+4+4=16\ \mathrm B,\qquad |wire|=16+2\times8=32\ \mathrm B`}
          annotatedFormula={String.raw`o_v=\underbrace{8}_{slot}+\underbrace{4}_{offset}+\underbrace{4}_{epoch}=16\ \mathrm B,\quad |wire|=\underbrace{16}_{fixed}+\underbrace{2\times8}_{validators}=32\ \mathrm B`}
          operations={[
            { expression: String.raw`8+4+4`, annotation: ["slot uint64는 8 bytes", "가변 field 자리에는 4-byte offset", "epoch uint32는 4 bytes"] },
            { expression: String.raw`2\times8`, annotation: ["validators 실제 원소는 2개", "uint64 한 개는 8 bytes", "variable part는 16 bytes"] },
          ]}
          terms={[
            { symbol: "o_v", name: "validators offset", description: "Container 시작에서 validators payload 첫 byte까지의 거리입니다." },
            { symbol: "wire", name: "Serialized bytes", description: "Fixed part와 variable part를 field 순서대로 합친 canonical encoding입니다." },
          ]}
          assumptions={["Field 순서는 slot, validators, epoch입니다.", "Offset은 uint32 little-endian이며 container 시작 기준입니다.", "List 원소는 uint64 두 개이고 limit 4를 넘지 않습니다."]}
          interpretation="Offset 16은 10 00 00 00으로 기록됩니다. 전체 wire는 32 bytes이며 offset 자체는 list 길이가 아닙니다."
        />
        <div className="not-prose grid grid-cols-5 gap-px bg-border p-px" aria-label="DemoRecord의 실제 32-byte wire layout">
          {wireParts.map(([label, width, bytes]) => (
            <div key={label} className="min-w-0 bg-background px-1.5 py-3 sm:px-3">
              <span className="block break-keep text-[8px] font-bold text-muted-foreground sm:text-[10px]">{label} · {width}</span>
              <code className="mt-2 block overflow-hidden text-ellipsis whitespace-nowrap text-[8px] text-primary sm:text-[10px]">{bytes}</code>
            </div>
          ))}
        </div>
        <p>
          Decoder는 첫 offset이 fixed part 16보다 작지 않고 payload 끝 32를 넘지 않는지 먼저 검사합니다. Validators slice 길이 16이 uint64 폭 8의 배수인지, 원소 수 2가 limit 4 이하인지 확인한 뒤에 할당합니다. Offset 12, offset 40, 길이 10인 slice는 각각 fixed part 침범, payload 범위 초과, element 정렬 실패로 거부해야 합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("ssz-offset", codeRefs["ssz-offset"])} />
          <span className="text-xs text-muted-foreground">Prysm v7.3.1이 고정한 methodical-ssz의 실제 offset 읽기·쓰기</span>
        </div>
      </section>

      <section id="merkleize" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">List 길이와 Container Field 순서를 Root에 함께 넣습니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="DemoRecord의 Merkle leaf 네 개">
          {[
            ["gindex 4", "slot root", "01…00"],
            ["gindex 5", "validators root", "9647…c266"],
            ["gindex 6", "epoch root", "03…00"],
            ["gindex 7", "zero leaf", "00…00"],
          ].map(([index, name, value]) => (
            <div key={index} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{index}</span>
              <strong className="mt-1 block break-keep text-xs">{name}</strong>
              <code className="mt-2 block break-all text-[10px] text-muted-foreground">{value}</code>
            </div>
          ))}
        </div>
        <ExplainedFormula
          question="Validators list와 세 field container의 최종 root는 어떻게 연결됩니까?"
          idea="두 uint64를 한 data chunk에 pack하고 실제 길이 2를 mix합니다. 그 list root를 slot·epoch root와 함께 폭 4의 container tree에 놓습니다."
          formula={String.raw`r_v=H(c_v\|\ell_2),\qquad r=H\!\left(H(r_s\|r_v)\|H(r_e\|z)\right)`}
          annotatedFormula={String.raw`r_v=H(\underbrace{c_v}_{10,20\ packed}\|\underbrace{\ell_2}_{length\ 2}),\quad r=H\!\left(\underbrace{H(r_s\|r_v)}_{fields\ 0,1}\|\underbrace{H(r_e\|z)}_{field\ 2,zero}\right)`}
          operations={[
            { expression: String.raw`H(c_v\|\ell_2)`, annotation: ["10과 20을 little-endian으로 한 32-byte chunk에 pack", "길이 2를 32-byte chunk에 기록", "두 chunk를 hash해 list root 9647…c266"] },
            { expression: String.raw`H(H(r_s\|r_v)\|H(r_e\|z))`, annotation: ["Field 3개를 폭 4 tree에 배치", "빈 네 번째 leaf는 zero", "최종 root 9dfd…32cc"] },
          ]}
          terms={[
            { symbol: "c_v", name: "Validators data chunk", description: "uint64 10과 20을 연속으로 pack하고 나머지를 zero padding한 32 bytes입니다." },
            { symbol: String.raw`\ell_2`, name: "Length chunk", description: "실제 원소 수 2를 uint64 little-endian으로 기록한 32 bytes입니다." },
            { symbol: "z", name: "Zero leaf", description: "세 field를 완전 이진 트리 폭 4에 놓을 때 비는 네 번째 leaf입니다." },
          ]}
          assumptions={["Hash 함수는 SSZ가 정한 SHA-256입니다.", "Field root의 left/right 순서를 보존합니다.", "Validators type limit은 4이고 실제 길이는 2입니다."]}
          interpretation="Wire bytes를 통째로 hash하지 않습니다. 각 field의 type별 root를 먼저 만든 뒤 container field 순서로 Merkleize합니다."
        />
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("ssz-list-root", codeRefs["ssz-list-root"])} />
          <span className="text-xs text-muted-foreground">Prysm v7.3.1의 list root와 mix-in-length 구현</span>
        </div>
      </section>

      <section id="multiproof" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Validators Field는 Gindex 5와 Sibling 두 개로 증명합니다</h2>
        <ExplainedFormula
          question="세 field 중 두 번째 validators의 generalized index와 proof payload는 얼마입니까?"
          idea="Container field 셋은 다음 2의 거듭제곱인 폭 4에 놓입니다. Root 1에 폭 4를 곱하고 0-based field 위치 1을 더합니다."
          formula={String.raw`g=1\times4+1=5=101_2,\qquad |P|=2\times32=64\ \mathrm B`}
          annotatedFormula={String.raw`g=\underbrace{1}_{root}\times\underbrace{4}_{tree\ width}+\underbrace{1}_{field\ position}=5=101_2,\quad |P|=\underbrace{2}_{depth}\times\underbrace{32}_{sibling\ hash}=64\ \mathrm B`}
          operations={[
            { expression: String.raw`1\times4+1`, annotation: ["Container field 수 3을 폭 4로 올림", "validators는 0-based field position 1", "gindex 5"] },
            { expression: String.raw`101_2`, annotation: ["선두 1을 제외한 path 01", "Root에서 left 다음 right", "validators leaf에 도착"] },
            { expression: String.raw`2\times32`, annotation: ["Sibling slot root 32 bytes", "Sibling right subtree root 32 bytes", "합계 64 bytes"] },
          ]}
          terms={[
            { symbol: "g", name: "Generalized index", description: "Root-to-node path를 binary digits에 담는 양의 정수입니다." },
            { symbol: "P", name: "Single proof", description: "Target root를 신뢰 root까지 다시 계산하는 데 필요한 sibling hash 목록입니다." },
          ]}
          assumptions={["Verifier가 DemoRecord schema와 신뢰할 root를 이미 알고 있습니다.", "Target은 validators field root 전체입니다.", "Proof payload 계산은 target value와 metadata overhead를 제외합니다."]}
          interpretation="Verifier는 validators root와 slot root로 left subtree를 만들고, right subtree root를 붙여 9dfd…32cc가 되는지 확인합니다."
        />
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("ssz-gindex", codeRefs["ssz-gindex"])} />
          <span className="text-xs text-muted-foreground">Prysm v7.3.1 SSZ query가 field path를 gindex로 바꾸는 실제 계산</span>
        </div>
        <p>
          여러 field를 증명할 때는 각 single proof를 그대로 이어 붙이지 않습니다. Target들의 ancestor path를 합치고 다른 target으로 계산 가능한 sibling을 제거합니다. 다만 proof parser는 duplicate target, ancestor·descendant 충돌, 빠진 helper와 초과 node를 거부해야 합니다.
        </p>
      </section>

      <section id="implementation" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">현재 Prysm은 Protocol 규칙과 생성기·Query 구현을 나눕니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["Protocol", "consensus-specs v1.6.1", "Type·encoding·Merkleization의 정본"],
            ["Generated methods", "methodical-ssz 932cc738", "Marshal·Unmarshal·HashTreeRoot 생성"],
            ["Prysm runtime", "Prysm v7.3.1", "List root·SSZ query·proof와 protocol 사용"],
          ].map(([layer, version, role]) => (
            <div key={layer} className="min-w-0 bg-background p-4">
              <span className="text-[10px] font-bold text-muted-foreground">{layer}</span>
              <strong className="mt-1 block break-keep text-xs">{version}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{role}</p>
            </div>
          ))}
        </div>
        <p>
          Prysm v7.3.1의 <code>go.mod</code>는 methodical-ssz commit <code>932cc738</code>을 고정합니다. 따라서 과거 <code>fastssz</code> 또는 Prysm 내부 helper만 보고 현재 생성 method의 offset·decode 동작을 단정하면 안 됩니다. 규격, 생성기 dependency와 Prysm runtime source를 같은 release receipt에 묶어야 합니다.
        </p>
      </section>

      <section id="failure-boundary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">SSZ가 통과해도 Consensus 검증은 끝나지 않습니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4">
          {[
            ["Decode", "Bytes → typed value", "Schema·offset·limit"],
            ["Root", "Value → commitment", "Type·field order·length"],
            ["Proof", "Field ∈ supplied root", "gindex·sibling·trusted root"],
            ["Consensus", "Root가 chain에서 유효", "Signature·transition·fork choice"],
          ].map(([step, meaning, guard]) => (
            <div key={step} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{step}</span>
              <strong className="mt-1 block break-keep text-xs">{meaning}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{guard}</p>
            </div>
          ))}
        </div>
        <p>
          Malformed offset이나 limit 초과는 SSZ decode 단계에서 닫힙니다. 올바르게 decode된 object의 signature가 틀리거나 state transition precondition을 어기는 문제는 다음 계층에서 닫힙니다. 공격자가 준 임의 root에 대한 proof가 수학적으로 맞아도 그 root를 신뢰할 consensus evidence가 없다면 chain 사실로 승격할 수 없습니다.
        </p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">고정한 규격과 Release에서 확인한 범위만 사용합니다</h2>
        <CitationBlock citeKey={1} source="Ethereum consensus-specs v1.6.1 @ 5fa6edcc" href="https://github.com/ethereum/consensus-specs/blob/5fa6edcca8ab4cf548653e6680b17b9d3e04d225/ssz/simple-serialize.md">
          <p><Label>O</Label>SSZ type, serialization, Merkleization, mix-in-length와 generalized index 규칙을 확인했습니다.</p>
          <p><strong>범위:</strong> Stable specification의 표현·commitment 규칙입니다. Prysm 내부 cache나 처리량을 정하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock citeKey={2} source="Ethereum SSZ Merkle proof formats v1.6.1 @ 5fa6edcc" href="https://github.com/ethereum/consensus-specs/blob/5fa6edcca8ab4cf548653e6680b17b9d3e04d225/ssz/merkle-proofs.md">
          <p><Label>O</Label>Generalized index, helper index와 single·multiproof 형식을 확인했습니다.</p>
          <p><strong>범위:</strong> 제공된 root에 대한 포함 증명 형식이며 그 root의 chain 신뢰를 만들지 않습니다.</p>
        </CitationBlock>
        <CitationBlock citeKey={3} type="code" source="OffchainLabs Prysm v7.3.1 @ 96d418cd" href="https://github.com/OffchainLabs/prysm/tree/96d418cd964b083e37519a9df274030a1beac7db">
          <p><Label>O</Label><code>encoding/ssz</code>의 list root, generalized-index query와 proof 구현, 그리고 <code>go.mod</code>의 methodical-ssz dependency를 확인했습니다.</p>
          <p><strong>범위:</strong> 이 릴리스의 source와 dependency 경계입니다. 다른 release의 package 구조를 일반화하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock citeKey={4} type="code" source="methodical-ssz @ 932cc738" href="https://github.com/OffchainLabs/methodical-ssz/tree/932cc7380128">
          <p><Label>O</Label>Generated marshal·unmarshal method가 사용하는 uint32 little-endian offset과 bounded collection template을 확인했습니다.</p>
          <p><strong>범위:</strong> Prysm v7.3.1이 고정한 generator snapshot입니다. 대상 환경의 allocation이나 bytes/s는 측정하지 않았습니다.</p>
        </CitationBlock>
        <p><Label>M</Label>DemoRecord의 32-byte wire와 SHA-256 root <code>9dfd6779b1e33a1a16a8cc4ed8094d0ef5529b63c45bffc39afe8d79410832cc</code>는 독립 계산했습니다. Prysm production object의 처리량·메모리·지연은 측정하지 않았습니다.</p>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-3 pl-5 text-sm leading-6">
          <li>Offset 16이 list 길이 16이라는 뜻이 아닌 이유는 무엇입니까? <strong>(답: Offset은 container 시작에서 variable payload가 시작되는 위치이며 길이는 다음 offset 또는 payload 끝과 element 폭으로 계산하기 때문입니다.)</strong></li>
          <li>Validators [10,20]이 data chunk 하나여도 길이 chunk가 필요한 이유는 무엇입니까? <strong>(답: List는 capacity 4와 실제 길이 2가 다르며 같은 zero-padded data라도 다른 실제 길이를 구분해야 하기 때문입니다.)</strong></li>
          <li>Field 3개인 container에서 validators gindex가 5인 이유는 무엇입니까? <strong>(답: Field tree 폭을 4로 올리고 root 1×4에 0-based field 위치 1을 더하기 때문입니다.)</strong></li>
          <li>Proof가 root와 일치해도 canonical chain field라고 단정할 수 없는 이유는 무엇입니까? <strong>(답: Proof는 제공된 root 안의 포함만 증명하며 그 root의 signature·transition·fork-choice·finality는 별도 consensus evidence가 정하기 때문입니다.)</strong></li>
        </ol>
      </section>

      <PrysmSszMapReturn />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ prysm: prysmTree }}
        projectMetas={{
          prysm: { id: "prysm", label: "Prysm v7.3.1 · Go", badgeClass: "bg-violet-500/10 border-violet-500 text-violet-700" },
        }}
      />
    </article>
  );
}
