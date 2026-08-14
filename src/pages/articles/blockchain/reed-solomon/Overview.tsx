import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Reed–Solomon 구현은 “다항식”보다 먼저 code profile을 고정해야 한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          원본 k개 symbol을 n개로 늘리면 n−k개의 여유가 생깁니다. 그러나
          field, 평가점, source를 coefficient로 볼지 evaluation으로 볼지,
          systematic layout과 symbol byte order가 다르면 같은 “RS(n,k)”라는
          이름으로도 wire format은 호환되지 않습니다. Decoder는 이 profile과
          object identity를 먼저 확인한 뒤에만 복원을 시작해야 합니다.
        </p>
        <p>
          평가 code와 minimum-distance 증명은
          <Link to="/blockchain/erasure-coding#reed-solomon"> erasure coding 정본</Link>,
          유한체와 polynomial root bound는
          <Link to="/crypto/finite-field-theory"> 유한체 정본</Link>, k개 점에서의
          복원식은 <Link to="/crypto/lagrange">Lagrange 정본</Link>을
          재사용합니다. 이 글은 중복 정의 대신 profile → encode → typed decode
          → ZK proximity 사용 → release gate를 구현 흐름으로 연결합니다.
        </p>
      </div>
      <ContentBoundary article="reed-solomon" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[42rem] border-collapse text-sm">
          <thead><tr className="border-b"><th className="p-3 text-left">Profile field</th><th className="p-3 text-left">고정할 값</th><th className="p-3 text-left">불일치 결과</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="p-3 font-semibold">Algebra</td><td className="p-3">field·irreducible polynomial·generator·evaluation points</td><td className="p-3">같은 bytes를 다른 symbol/value로 해석</td></tr>
            <tr className="border-b"><td className="p-3 font-semibold">Layout</td><td className="p-3">n,k·systematic 여부·matrix/point order</td><td className="p-3">복원은 성공해도 원본 순서가 다름</td></tr>
            <tr><td className="p-3 font-semibold">Object</td><td className="p-3">object digest·shard index·symbol size·padding</td><td className="p-3">다른 object shard 혼합 또는 silent padding</td></tr>
          </tbody>
        </table>
      </div>
      <div id="paper-reed-solomon-1960" className="scroll-mt-24">
        <CitationBlock
          source="Reed & Solomon (1960) · Polynomial Codes over Certain Finite Fields"
          href="https://doi.org/10.1137/0108018"
          citeKey={1}
        >
          문제: finite-field symbol vector를 더 긴 vector로 보내 transmission
          error에서 원본을 복원합니다. 기여: message polynomial을 field points에서
          평가하는 polynomial code construction을 제시합니다. 전제: 선택한 finite
          field와 독립한 message coordinates를 사용합니다. 근거 범위: 원래
          polynomial-code 아이디어입니다. 비주장: 오늘날의 systematic packet
          profile, Berlekamp–Welch API, FRI soundness와 특정 구현 성능을 정하지
          않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
