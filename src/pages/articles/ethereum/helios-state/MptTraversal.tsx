import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";

interface Props {
  title: string;
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function MptTraversal({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="mpt-traversal" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>

      <ExplainedFormula
        question="하나의 proof 검증은 어떤 입력을 고정할까요?"
        idea={
          <>
            Raw key를 secure nibble path로, expected typed value를 RLP bytes로
            바꿉니다. Proof는 정확히 root·path·expected value 세 입력을 하나의
            trie 경로로 연결해야 합니다.
          </>
        }
        formula={
          "k={\\rm Nibbles}({\\rm Keccak256}(x)),\\quad v={\\rm RLP}(y),\\quad {\\rm Verify}(R,k,v,\\pi)=\\mathrm{true}"
        }
        annotatedFormula={String.raw`k=\underbrace{{\rm Nibbles}({\rm Keccak256}(x))}_{\text{secure nibble path}},\quad v=\underbrace{{\rm RLP}(y)}_{\text{leaf와 비교할 bytes}},\quad \underbrace{{\rm Verify}(R,k,v,\pi)}_{\text{root부터 leaf까지 추적}}=\mathrm{true}`}
        operations={[
          { expression: String.raw`{\rm Nibbles}({\rm Keccak256}(x))`, annotation: ["주소·storage slot key를 Keccak-256합니다","32 bytes는 64개의 4-bit nibble이 됩니다","trie는 이 secure path를 따라갑니다"] },
          { expression: String.raw`{\rm RLP}(y)`, annotation: ["RPC가 주장한 account 또는 slot 값을","leaf와 byte 단위로 대조할","canonical expected bytes로 만듭니다"] },
          { expression: String.raw`{\rm Verify}(R,k,v,\pi)`, annotation: ["R에서 proof node π를 따라갑니다","path와 child reference를 모두 확인합니다","끝의 값 또는 부재가 expected와 같아야 합니다"] },
        ]}
        terms={[
          {
            symbol: "x",
            name: "Raw key",
            description: "Account address 또는 32-byte storage slot key입니다.",
          },
          {
            symbol: "k",
            name: "Secure nibble path",
            description:
              "Keccak-256 결과를 64개 4-bit digit으로 나눈 path입니다.",
          },
          {
            symbol: "y",
            name: "Expected typed value",
            description: "RPC가 주장한 account 네 field 또는 storage integer입니다.",
          },
          {
            symbol: "v",
            name: "Canonical RLP value",
            description: "Trie leaf에서 비교할 expected byte encoding입니다.",
          },
          {
            symbol: "\\pi",
            name: "Proof nodes",
            description:
              "Root부터 마지막 matching node까지의 RLP node 배열입니다.",
          },
          {
            symbol: "R",
            name: "Trusted root",
            description:
              "Verified block의 state root 또는 proven account의 storage root입니다.",
          },
        ]}
        assumptions={[
          "검증된 block header에서 root R을 먼저 가져왔습니다.",
          "Keccak-256·hex-prefix·RLP·inline/hash reference는 선택한 Alloy trie 구현의 canonical 규칙을 따릅니다.",
          "부재 검증에서는 wrapper가 empty typed value를 expected None으로 바꿉니다.",
        ]}
        interpretation="Verify=true는 정확히 R·x·y·proof tuple의 포함 또는 부재만 말합니다. 그 block이 현재 optimistic head인지 finalized head인지는 부모 consensus 상태가 따로 결정합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Branch·extension·leaf는 path를 소비하는 방식이 다릅니다</h3>
        <p>
          Branch는 다음 nibble에 해당하는 child를 고릅니다. Extension은 여러
          nibble의 공통 prefix를 한 번에 소비합니다. Leaf는 남은 suffix와
          expected value를 함께 확인합니다. 짧은 child node는 parent 안에
          inline되고, 긴 node는 Keccak hash로 참조되므로 모든 edge가 32-byte
          hash라고 가정할 수 없습니다.
        </p>
        <h3>정상 부재는 마지막으로 확인한 node가 설명합니다</h3>
        <p>
          요청 path가 branch의 empty child에서 끝나거나 extension·leaf의 suffix와
          갈라지면 해당 root 아래 key가 없음을 증명할 수 있습니다. 여기에도
          root부터 그 node까지의 온전한 hash chain이 필요합니다. RPC timeout,
          빈 배열, 중간 node 누락은 이 구조를 만들지 못하므로 정상 부재로
          바꾸지 않습니다.
        </p>
      </div>
    </section>
  );
}
