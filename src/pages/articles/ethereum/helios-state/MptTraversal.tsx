import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";

interface Props {
  title: string;
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function MptTraversal({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="mpt-traversal" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>

      <ExplainedFormula
        question="Proof node 배열이 특정 key-value를 root R에 연결한다는 것은 무엇일까요?"
        idea={
          <>
            Raw key는 secure hash의 nibble path로, expected value는 canonical
            RLP bytes로 바꿉니다. 각 node가 다음 child를 inline bytes 또는
            hash로 가리키고 마지막 path/value가 일치해야 검증이 성공합니다.
          </>
        }
        formula={
          "k={\\rm Nibbles}({\\rm Keccak256}(x)),\\quad v={\\rm RLP}(y),\\quad {\\rm Verify}(R,k,v,\\pi)=\\mathrm{true}"
        }
        annotatedFormula={String.raw`k=\underbrace{{\rm Nibbles}({\rm Keccak256}(x)),\quad v={\rm RLP}(y),\quad {\rm Verify}(R,k,v,\pi)=\mathrm{true}}_{\text{Proof nodes 계산}}`}
        operations={[
          { expression: String.raw`{\rm Nibbles}({\rm Keccak256}(x)),\quad v={\rm RLP}(y),\quad {\rm Verify}(R,k,v,\pi)=\mathrm{true}`, annotation: ["Proof nodes이(가) 식의 결과에 기여하는 방식을","계산합니다.","Raw key는 secure hash의 nibble","path로, expected value는 canonical"] },
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
            description: "Account 네 field 또는 storage integer입니다.",
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
          "Block hash와 root가 먼저 light-client consensus에 고정돼 있습니다.",
          "Keccak-256·hex-prefix·RLP·inline/hash reference를 canonical하게 해석합니다.",
          "Existence proof에서는 y가 실제 값이고 absence proof에서는 expected value가 비어 있음을 구조로 확인합니다.",
        ]}
        interpretation="Verify=true는 정확히 R·x·y·proof tuple에 대한 포함 또는 부재를 말합니다. 같은 주소라도 다른 block root에 이 proof를 재사용하거나 현재 canonical head라고 확대할 수 없습니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Branch·extension·leaf마다 멈춰야 할 조건이 다릅니다</h3>
        <p>
          Branch는 다음 nibble index의 child를 고르고, extension은 압축한 shared
          prefix가 남은 path와 같은지 확인합니다. Leaf에서는 terminator가 있는
          마지막 suffix와 value를 비교합니다. Encoded child가 짧으면 parent 안에
          inline되고, 길면 Keccak hash로 참조되므로 모든 child를 32-byte
          hash라고 가정해서는 안 됩니다.
        </p>
        <h3>Absence proof도 검증 결과이며 “응답 누락”과 다릅니다</h3>
        <p>
          요청 path가 branch의 빈 child에서 끝나거나, extension/leaf의 남은
          suffix와 갈라지면 그 root 아래 key가 없다는 부재 proof가 됩니다.
          Helios 0.11.1은 empty account·slot의 RLP를 expected value 없음으로
          바꿔 trie verifier에 전달합니다. 반대로 provider가 proof node를
          중간에서 잘라 보낸 것은 cryptographic absence가 아니라 invalid proof
          오류입니다.
        </p>
      </div>
    </section>
  );
}
