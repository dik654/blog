import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function VerifyTrace({ title, onCodeRef: _onCodeRef }: Props & { title: string }) {
  return (
    <section id="verify-trace" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}: context부터 적용 가능성까지 순서대로 확인한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          첫째, current slot과 signature slot의 순서, attested/finalized header slot의 단조성을 확인합니다. 둘째, signature period가 store의
          current 또는 검증된 next committee와 연결되는지 고릅니다. 셋째, participation bits와 public-key positions를 같은 index로
          결속합니다. 넷째, 포함된 finality·next-committee branch를 fork별 generalized index로 검증합니다. 다섯째, network·fork·duty를
          넣은 signing root에 대해 aggregate BLS signature를 확인한 뒤에야 update quality와 store transition을 판단합니다.
        </p>
      </div>

      <ExplainedFormula
        question="512-position committee에서 2/3 supermajority가 되는 최소 참여 position 수는 몇 개일까요?"
        idea="부동소수점 비율 대신 양쪽을 정수로 곱해 client마다 같은 경계를 만듭니다. Equality도 포함하는 사양 판정을 그대로 읽습니다."
        formula={String.raw`3p\ge 2N\qquad\Longrightarrow\qquad p_{min}=\left\lceil\frac{2N}{3}\right\rceil=342\;(N=512)`}
        terms={[
          { symbol: "N", name: "Committee position 수", description: "Network preset의 sync committee size; 예시는 512 positions" },
          { symbol: "p", name: "참여 position 수", description: "sync_committee_bits에서 1인 bit의 개수" },
          { symbol: "3p\ge2N", name: "정수 supermajority 판정", description: "2/3 이상인지 rounding 없이 비교하는 Boolean 조건" },
          { symbol: "p_{min}", name: "최소 supermajority 참여", description: "N=512일 때 ceil(1024/3)=342 positions" },
        ]}
        assumptions={[
          "Bitvector 길이와 committee public-key list가 같은 preset에 속하며 bit index를 중복 제거하지 않습니다.",
          "각 selected public key는 trusted current/next committee commitment에서 왔고 signature 검증도 별도로 통과합니다.",
          "Supermajority는 light-client update quality/finality transition의 조건이며 모든 valid update의 유일한 최소 참여 조건으로 일반화하지 않습니다.",
        ]}
        interpretation="341이면 3×341=1,023이 1,024보다 작아 2/3에 못 미치고, 342이면 1,026≥1,024로 통과합니다. 그러나 342 bits만 세고 BLS·branch·slot 검사를 생략할 수는 없습니다."
      />

      <ExplainedFormula
        question="선택된 position들이 바로 이 network·fork의 attested header에 서명했다는 것을 어떻게 확인할까요?"
        idea="Set bit의 public keys를 group에서 집계하고, header object root에 sync-committee domain을 붙인 signing root와 aggregate signature의 pairing 관계를 비교합니다."
        formula={String.raw`PK_A=\sum_{i:b_i=1}PK_i,\quad m=HTR(H,D_{sync}),\quad e(PK_A,H_2(m))\stackrel{?}{=}e(G_1,\Sigma)`}
        terms={[
          { symbol: "b_i", name: "참여 bit", description: "Position i가 aggregate signature에 참여했는지 나타내는 Boolean" },
          { symbol: "PK_i", name: "Position public key", description: "Trusted sync committee의 i번째 BLS public key" },
          { symbol: "PK_A", name: "집계 public key", description: "Set bit에 해당하는 G1 public-key points의 합" },
          { symbol: "H", name: "Attested header", description: "Update가 consensus 지지 대상으로 제시한 light-client header" },
          { symbol: "D_{sync}", name: "Sync domain", description: "Domain type·fork version·genesis validators root로 만든 역할/chain context" },
          { symbol: "m", name: "Signing root", description: "Header object root와 domain을 SSZ SigningData로 결합한 32-byte root" },
          { symbol: "H_2", name: "Hash to G2", description: "Signing root를 BLS signature group point로 매핑하는 ciphersuite 함수" },
          { symbol: "e", name: "Pairing", description: "G1×G2의 scalar 관계를 target group에서 비교하는 bilinear map" },
          { symbol: "\Sigma", name: "Aggregate signature", description: "참여 positions의 G2 signatures를 합한 point" },
        ]}
        assumptions={[
          "Public keys와 signature는 canonical encoding·curve·subgroup·non-identity validation을 통과했습니다.",
          "모든 참여 position은 byte-identical signing root에 서명했고 Ethereum key-registration/committee 전제를 사용합니다.",
          "Fork version은 signature slot에 적용되는 spec 규칙으로 계산하며 local wall-clock fork를 임의로 대입하지 않습니다.",
        ]}
        interpretation="Bit 17을 끄거나 다른 network의 genesis root를 넣으면 aggregate public key 또는 signing root가 달라져 pairing equality가 깨집니다. Equality는 signature tuple의 유효성이지 header의 finality나 execution validity 전체를 뜻하지 않습니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>실패를 cheap-first로 분류합니다</h3>
        <p>
          Length·slot·period·branch처럼 싼 검사를 먼저 수행하고 expensive BLS는 마지막에 둡니다. Malformed input을 pairing queue까지 보내지
          않으면 DoS 비용을 제한할 수 있습니다. 기존 BLS 글의 <Link to="/blockchain/prysm-bls#sign-verify">point validation과 domain</Link>을
          그대로 재사용하며 Helios용으로 같은 정의를 다시 만들지 않습니다.
        </p>
      </div>
    </section>
  );
}
