import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function CommitteeBranch({ title, onCodeRef: _onCodeRef }: Props & { title: string }) {
  return (
    <section id="committee-branch" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          RPC가 임의의 public keys를 current committee라고 보내도 branch 검증이 없으면 이후 공격자 서명은 정상처럼 보입니다. SSZ의
          generalized index는 state tree에서 current committee leaf까지의 좌우 경로를 지정하고, sibling을 차례로 hash해 header의
          state root와 같은지 확인합니다. Generalized index 자체의 정본은 <Link to="/blockchain/prysm-ssz">Prysm SSZ</Link>에서 다룹니다.
        </p>
      </div>
      <ExplainedFormula
        question="Committee leaf와 Merkle branch가 header의 state root에 실제로 묶였는지 어떻게 확인할까요?"
        idea="Generalized index의 각 bit가 현재 hash를 sibling의 왼쪽에 둘지 오른쪽에 둘지 정합니다. Branch를 모두 접은 최종 root만 비교합니다."
        formula={String.raw`r_0=HTR(K),\qquad r_{i+1}=H(\operatorname{order}(r_i,b_i,g_i)),\qquad r_d\stackrel{?}{=}R_{state}`}
        annotatedFormula={String.raw`r_0=\underbrace{HTR(K),\qquad r_{i+1}=H(\operatorname{order}(r_i,b_i,g_i)),\qquad r_d\stackrel{?}{=}R_{state}}_{\text{Header state root 계산}}`}
        operations={[
          { expression: String.raw`HTR(K),\qquad r_{i+1}=H(\operatorname{order}(r_i,b_i,g_i)),\qquad r_d\stackrel{?}{=}R_{state}`, annotation: ["Header state root이(가) 식의 결과에 기여하는","방식을 계산합니다.","Generalized index의 각 bit가 현재 hash를","sibling의 왼쪽에 둘지 오른쪽에 둘지 정합니다."] },
        ]}
        terms={[
          { symbol: "K", name: "Current sync committee", description: "응답으로 받은 public-key list와 aggregate public key" },
          { symbol: "HTR(K)", name: "Committee root", description: "Fork-specific SSZ schema로 계산한 hash-tree-root" },
          { symbol: "b_i", name: "Sibling hash", description: "Merkle branch의 i번째 32-byte sibling" },
          { symbol: "g_i", name: "경로 방향 bit", description: "Generalized index에서 읽은 left/right 배치 정보" },
          { symbol: "d", name: "Branch depth", description: "Schema가 정한 leaf-to-root 단계 수" },
          { symbol: "R_{state}", name: "Header state root", description: "Trusted checkpoint header가 약속한 BeaconState root" },
        ]}
        assumptions={[
          "Fork별 LightClientHeader와 BeaconState schema, generalized index와 branch depth가 일치합니다.",
          "Header의 hash-tree-root가 입력 checkpoint root와 먼저 일치했습니다.",
          "Hash와 SSZ serialization이 canonical이며 잘못된 length·extra sibling은 거부합니다.",
        ]}
        interpretation="깊이 5인 작은 예에서 sibling 하나의 위치를 반대로 두기만 해도 최종 root가 달라집니다. Root가 같다는 것은 committee inclusion을 보장하지만 해당 위원회가 미래 모든 update에 충분히 참여한다는 뜻은 아닙니다."
      />
    </section>
  );
}
