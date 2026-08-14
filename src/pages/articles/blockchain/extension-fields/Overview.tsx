import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        확장체 tower는 같은 Fp¹² 연산을 재사용 가능한 층으로 분해한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Pairing 구현은 Fp 원소 열두 개를 한 번에 다루기보다
          <strong> Fp → Fp² → Fp⁶ → Fp¹²</strong> 순서로 쌓습니다. 각 층은
          아래 field의 원소를 coefficient로 사용하고 defining polynomial로 높은
          차수 항을 줄입니다. 이 구조 덕분에 Karatsuba, sparse multiplication,
          Frobenius coefficient 같은 최적화를 하위 연산에 재사용할 수 있습니다.
        </p>
        <p>
          비가약 다항식의 quotient가 field가 되는 이유는
          <Link to="/crypto/finite-field-theory#extension-field"> 확장체 이론 정본</Link>,
          BN254 G2 twist와 subgroup은
          <Link to="/crypto/elliptic-curves#g1-g2-bn254"> 타원곡선 정본</Link>,
          Miller loop와 final exponentiation은
          <Link to="/crypto/pairing"> pairing 글</Link>이 소유합니다. 이 글은
          concrete tower의 data layout·곱셈 schedule·Frobenius table·검증 순서를
          구현 관점에서만 다룹니다.
        </p>
        <p>
          Source 예시는 <code>ark-bn254 0.5.0</code> API와 2026-08-14에
          확인한 arkworks curves commit
          <code>e2d16a27e2cfa9f972ae9772df827a22730011b4</code>에 고정합니다.
          Moving main이나 다른 BN254 profile에 상수와 coefficient order를
          일반화하지 않습니다.
        </p>
      </div>
      <ContentBoundary article="extension-fields" />
      <div id="paper-ark-bn254-source" className="scroll-mt-24">
        <CitationBlock
          source="arkworks curves · BN254 field source snapshot"
          href="https://github.com/arkworks-rs/curves/tree/e2d16a27e2cfa9f972ae9772df827a22730011b4/bn254/src/fields"
          citeKey={1}
          type="code"
        >
          문제: BN254의 Fq/Fq²/Fq⁶/Fq¹² parameter와 tower 연산을 concrete
          Rust 타입으로 구현합니다. 기여: field config, non-residue,
          Frobenius coefficient와 type alias의 source seam을 제공합니다. 전제:
          위 SHA와 ark-bn254 0.5.0 API를 함께 고정합니다. 근거 범위: 선택
          snapshot의 parameter/layout입니다. 비주장: moving branch, 다른 library,
          EVM wire encoding, 모든 target의 constant-time 성질을 대신하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
