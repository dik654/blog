import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import CryptoFoundationsViz from "../crypto-foundations-viz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">암호 프리미티브는 각각 다른 보안 질문에 답한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          영지식 시스템을 만든다고 해서 해시·Merkle tree·서명·군 연산을 한 종류의 “암호 기술”로 묶어도 되는 것은 아닙니다. Poseidon은 회로 안의 많은 field 값을 digest 하나로 압축하고, Merkle tree는 root에 고정된 항목 하나를 짧게 열며, Schnorr와 Ed25519는 비밀키 소유자가 특정 메시지를 승인했는지 확인합니다. 이 보장들을 섞어 읽으면 proof가 통과했는데도 잘못된 root나 다른 domain의 서명을 신뢰할 수 있습니다.
        </p>
        <p>
          이 글은 각 도구를 <strong>입력 → 계산 → 출력 → 보장 → 실패 조건</strong>의 같은 틀로 비교합니다. Field의 inverse와 원소 order는 <Link to="/crypto/finite-field-theory">유한체 정본</Link>, 이산로그 공격 비용은 <Link to="/crypto/discrete-log">DLP 정본</Link>, 실제 점 연산과 subgroup은 <Link to="/crypto/elliptic-curves">타원곡선군 정본</Link>을 재사용합니다. 따라서 이 글의 목표는 수학 정의를 중복하는 것이 아니라, 여러 프리미티브를 조합할 때 보장 사이의 빈틈을 찾는 것입니다.
        </p>
      </div>
      <ContentBoundary article="crypto-primitives" />
      <CryptoFoundationsViz mode="primitive-map" />

      <div id="paper-poseidon-overview" className="scroll-mt-24">
        <CitationBlock source="Grassi et al. · Poseidon (USENIX Security 2021)" href="https://www.usenix.org/conference/usenixsecurity21/presentation/grassi" citeKey={1}>
          문제: bit-oriented hash를 arithmetic circuit에서 계산할 때 제약 비용이 커집니다. 기여: prime field 위 SPN permutation과 HADES full/partial round 전략, 공격별 parameter 분석을 제시합니다. 전제: field·state width·S-box exponent·round 수·matrix를 함께 고정합니다. 근거 범위: 논문의 parameter와 분석입니다. 비주장: 임의로 줄인 round나 모든 구현의 constraint 수·프로젝트 채택을 보장하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-rfc8032-overview" className="scroll-mt-24">
        <CitationBlock source="RFC 8032 · EdDSA: Ed25519 and Ed448" href="https://www.rfc-editor.org/rfc/rfc8032.html" citeKey={2}>
          문제: Edwards curve 서명의 parameter·encoding·sign/verify 절차가 구현마다 달라지는 일을 막습니다. 기여: Ed25519/Ed448 instance와 test vector·security consideration을 제공합니다. 전제: variant와 context/prehash 규칙, strict parsing을 일치시킵니다. 근거 범위: RFC가 정한 EdDSA interoperability입니다. 비주장: 모든 library의 side-channel 안전성이나 key 보관을 자동 보장하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
