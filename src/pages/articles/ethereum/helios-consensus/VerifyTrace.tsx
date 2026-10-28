import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function VerifyTrace({ title, onCodeRef }: Props & { title: string }) {
  return (
    <section id="verify-trace" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <code>T0</code>의 finalized slot은 8,191이고 current committee는 <code>K0</code>, next committee는 <code>K1</code>입니다. Update
          <code>u-8193</code>은 attested·finalized slot 8,192와 signature slot 8,193을 제시합니다.
        </p>
        <p>
          Helios는 시간 순서와 period를 먼저 확인해 signature를 검증할 <code>K1</code>을 고릅니다. 그런 다음 finality·next-committee branch를 확인하고,
          참여 bit에 해당하는 public key로 aggregate signature를 검증합니다. 이 순서가 끝나야 <code>u-8193</code>은 Store 적용 후보가 됩니다.
        </p>
      </div>

      <ExplainedFormula
        question="512-position committee에서 2/3 supermajority가 되는 최소 참여 position 수는 몇 개일까요?"
        idea="부동소수점 비율 대신 양쪽을 정수로 곱해 client마다 같은 경계를 만듭니다. Equality도 포함하는 사양 판정을 그대로 읽습니다."
        formula={String.raw`3p\ge 2N\qquad\Longrightarrow\qquad p_{min}=\left\lceil\frac{2N}{3}\right\rceil=342\;(N=512)`}
        annotatedFormula={String.raw`\underbrace{3p\ge 2N}_{\text{정수 2/3 판정}}\qquad\Longrightarrow\qquad p_{min}=\underbrace{\left\lceil\frac{2N}{3}\right\rceil}_{\text{최소 참여 position}}=342\;(N=512)`}
        operations={[
          { expression: String.raw`3p\ge 2N`, annotation: ["참여 bit 수 p의 3배가 2N 이상인지","부동소수점 없이 정수로만 비교","341이면 1,023<1,024라 탈락"] },
          { expression: String.raw`\left\lceil\frac{2N}{3}\right\rceil`, annotation: ["N=512면 1024/3≈341.3을 올림해 342","342면 1,026≥1,024로 통과","bit만 세고 BLS·branch 검사는 못 뺌"] },
        ]}
        terms={[
          { symbol: "N", name: "Committee position 수", description: "Network preset의 sync committee size; 예시는 512 positions" },
          { symbol: "p", name: "참여 position 수", description: "sync_committee_bits에서 1인 bit의 개수" },
          { symbol: "3p\\ge2N", name: "정수 supermajority 판정", description: "2/3 이상인지 rounding 없이 비교하는 Boolean 조건" },
          { symbol: "p_{min}", name: "최소 supermajority 참여", description: "N=512일 때 ceil(1024/3)=342 positions" },
        ]}
        assumptions={[
          "Bitvector 길이와 committee public-key list가 같은 preset에 속하며 bit index를 중복 제거하지 않습니다.",
          "각 selected public key는 trusted current/next committee commitment에서 옵니다.",
          "선택한 public key에 대한 signature 검증도 별도로 통과합니다.",
          "Supermajority는 light-client update quality/finality transition의 조건이며 모든 valid update의 유일한 최소 참여 조건으로 일반화하지 않습니다.",
        ]}
        interpretation="341이면 3×341=1,023이 1,024보다 작아 2/3에 못 미치고, 342이면 1,026≥1,024로 통과합니다. 그러나 342 bits만 세고 BLS·branch·slot 검사를 생략할 수는 없습니다."
      />

      <ExplainedFormula
        question="선택된 position들이 바로 이 network·fork의 attested header에 서명했다는 것을 어떻게 확인할까요?"
        idea="Set bit의 public keys를 group에서 집계하고, header object root에 sync-committee domain을 붙인 signing root와 aggregate signature의 pairing 관계를 비교합니다."
        formula={String.raw`PK_A=\sum_{i:b_i=1}PK_i,\quad m=HTR(H,D_{sync}),\quad e(PK_A,H_2(m))\stackrel{?}{=}e(G_1,\Sigma)`}
        annotatedFormula={String.raw`PK_A=\underbrace{\sum_{i:b_i=1}PK_i}_{\text{set bit 공개키 합}},\quad m=\underbrace{HTR(H,D_{sync})}_{\text{header + sync domain}},\quad \underbrace{e(PK_A,H_2(m))\stackrel{?}{=}e(G_1,\Sigma)}_{\text{aggregate pairing 비교}}`}
        operations={[
          { expression: String.raw`\sum_{i:b_i=1}PK_i`, annotation: ["sync_committee_bits가 1인 position의","trusted committee 공개키를 G1에서 합산","bit 17을 끄면 PK_A가 달라짐"] },
          { expression: String.raw`HTR(H,D_{sync})`, annotation: ["attested header root에 domain type·","fork version·genesis root를 붙인 root","다른 network genesis면 m이 달라짐"] },
          { expression: String.raw`e(PK_A,H_2(m))\stackrel{?}{=}e(G_1,\Sigma)`, annotation: ["aggregate Σ가 PK_A의 비밀키들로 m에","서명한 것인지 pairing 등식으로 확인","통과해도 finality·execution은 별개"] },
        ]}
        terms={[
          { symbol: "b_i", name: "참여 bit", description: "Position i가 aggregate signature에 참여했는지 나타내는 Boolean" },
          { symbol: "PK_i", name: "Position public key", description: "Trusted sync committee의 i번째 BLS public key" },
          { symbol: "PK_A", name: "집계 public key", description: "Set bit에 해당하는 G1 public-key points의 합" },
          { symbol: "H", name: "Attested header", description: "Update가 consensus 지지 대상으로 제시한 light-client header" },
          { symbol: "D_{sync}", name: "Sync domain", description: "Domain type·fork version·genesis validators root로 만든 역할/chain context" },
          { symbol: "m", name: "Signing root", description: "Header object root와 domain을 SSZ SigningData로 결합한 32-byte root" },
          { symbol: "H_2", name: "Hash to G2", description: "Signing root를 BLS signature group point로 매핑하는 ciphersuite 함수" },
          { symbol: "e", name: "Pairing", description: "G1×G2의 scalar 관계를 target group에서 비교하는 bilinear map" },
          { symbol: String.raw`\Sigma`, name: "Aggregate signature", description: "참여 positions의 G2 signatures를 합한 point" },
        ]}
        assumptions={[
          "Public keys와 signature는 canonical encoding·curve·subgroup·non-identity validation을 통과했습니다.",
          "모든 참여 position은 byte-identical signing root에 서명했고 Ethereum key-registration/committee 전제를 사용합니다.",
          "Fork version은 signature slot에 적용되는 spec 규칙으로 계산하며 local wall-clock fork를 임의로 대입하지 않습니다.",
        ]}
        interpretation="Bit 17을 끄면 aggregate public key가 달라집니다. 다른 network의 genesis root를 넣으면 signing root가 달라져 pairing equality가 깨집니다. 이 등식은 signature tuple의 유효성만 확인하며 header의 finality나 execution validity 전체를 뜻하지 않습니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>검증 순서가 실패 비용을 결정합니다</h3>
        <p>
          Slot·period·branch를 먼저 검사하면 분명히 잘못된 입력을 BLS 검증 전에 거부할 수 있습니다. 이 순서는 malformed input이 비싼
          pairing 단계까지 가는 비용을 줄입니다.
        </p>
        <p>
          BLS 곡선·point·domain 정의는 <Link to="/cs/blockchain/prysm-bls#sign-verify">BLS 검증 글</Link>에서 이어집니다. 여기서는 그 정의가
          <code>u-8193</code>의 committee와 header에 어떻게 연결되는지만 확인합니다.
        </p>
      </div>
      <div className="not-prose mt-5">
        <CodeViewButton label="실제 verify_generic_update 순서 보기" onClick={() => onCodeRef("hl-verify-update", codeRefs["hl-verify-update"])} />
      </div>
    </section>
  );
}
