import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import FrScalarViz from "./viz/FrScalarViz";

export default function FrScalar() {
  return (
    <section id="fr-scalar" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Fp와 Fr은 크기가 비슷해도 서로 바꿀 수 없는 타입이다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          BN254에서 Fp는 curve coordinate를 환원하는 base field이고 Fr은 prime-order subgroup에서 점을 몇 번 더할지 정하는 scalar
          field입니다. 두 modulus 모두 254-bit 부근입니다. 그래도 값과 역할은 다릅니다. Witness가 어떤 field에 놓이는지는 proof system이
          circuit field를 무엇으로 잡았느냐에 달렸으니 “모든 ZK 값은 BN254 Fr”이라는 일반화는 성립하지 않습니다.
        </p>
      </div>
      <FrScalarViz />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <thead><tr className="border-b"><th className="p-3 text-left">타입</th><th className="p-3 text-left">modulus의 의미</th><th className="p-3 text-left">허용되는 연결</th><th className="p-3 text-left">금지할 혼동</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="p-3 font-semibold">Fp/Fq</td><td className="p-3">G1 좌표와 Fp² tower의 base</td><td className="p-3">curve equation·coordinate arithmetic</td><td className="p-3">Fr bytes를 같은 residue로 decode</td></tr>
            <tr><td className="p-3 font-semibold">Fr</td><td className="p-3">subgroup order r</td><td className="p-3">[k]P의 scalar·해당 circuit field</td><td className="p-3">point coordinate처럼 사용</td></tr>
          </tbody>
        </table>
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Release 순서는 correctness가 먼저다</h3>
        <p>
          field ID·modulus·limb width·Montgomery R/R²/INV·crate version/SHA를 한
          receipt에 기록합니다. 그다음 official vectors, canonical round-trip,
          p±1과 carry chain, zero inverse, Fp/Fr 교차 decode 거부, 독립
          implementation parity를 확인합니다. 이 gate 뒤에만 throughput과
          side-channel 측정을 비교합니다. Curve point의 subgroup 검사는
          <Link to="/crypto/elliptic-curves#g1-curve"> 타원곡선 정본</Link>의
          별도 책임입니다.
        </p>
      </div>
      <div id="paper-eip197-field-boundary" className="scroll-mt-24">
        <CitationBlock
          source="EIP-197 · alt_bn128 pairing precompile"
          href="https://eips.ethereum.org/EIPS/eip-197"
          citeKey={3}
        >
          문제: Ethereum에서 BN254 G1·G2 입력과 pairing product check를 같은
          bytes 규격으로 실행합니다. 기여: base field p, group order q, Fp/Fp²
          좌표 encoding과 subgroup 요구를 구분합니다. 전제: EIP-197의 curve와
          fork semantics를 사용합니다. 근거 범위: 해당 precompile의 field/group
          경계입니다. 비주장: 임의 BN254 library의 내부 Montgomery 상수나
          constant-time 성질을 규정하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
