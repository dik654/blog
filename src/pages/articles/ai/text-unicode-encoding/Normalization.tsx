import NormalizationChoiceViz from "./viz/NormalizationChoiceViz";

export default function Normalization() {
  return (
    <section id="normalization" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Normalization은 같은 text 표현을 맞추지만 어떤 차이를 지울지도 결정한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          화면에서 같은 é도 미리 합쳐진 code point 하나나 <code>e</code>와 combining mark 두 개로 표현될 수 있습니다. NFC와 NFD는 이런 canonical equivalent sequence를 합성형 또는 분해형으로 맞춥니다. 반면 NFKC와 NFKD는 전각·위첨자·동그라미 숫자처럼 compatibility-equivalent한 차이까지 접을 수 있습니다.
        </p>
        <p>
          검색에서는 <code>①</code>과 <code>1</code>을 같은 것으로 취급하는 편이 유용할 수 있지만, source code·식별자·법률 원문·정확한 복원에서는 그 차이가 의미일 수 있습니다. 따라서 normalization은 무조건적인 청소 단계가 아니라 task가 보존할 정보를 정하는 정책입니다.
        </p>
        <p>
          실무에서는 사용자가 입력한 <strong>raw 원문</strong>과 검색·비교에 쓰는 <strong>normalized comparison key</strong>를 분리해 저장하는 편이 안전합니다. 예를 들어 NFKC를 적용하면 raw 값이 다른 <code>①</code>과 <code>1</code>이 같은 key <code>1</code>로 모일 수 있습니다. 검색이라면 같은 결과 후보로 묶되 화면에는 raw 원문을 보여줄 수 있지만, 로그인 ID처럼 identity를 정하는 값이라면 collision(서로 다른 원문이 같은 key가 되는 충돌)이 생겼는지 먼저 검사하고 등록을 거부하거나 사람의 검토로 보내야 합니다. 서로 다른 계정을 말없이 합치면 normalization이 authorization 오류로 이어질 수 있기 때문입니다.
        </p>
        <p>
          저장 record에는 raw 값과 comparison key뿐 아니라 <code>normalization_form</code>, Unicode data 또는 normalizer version, policy version을 함께 남깁니다. 정책 version이 바뀌면 기존 key를 그대로 신뢰하지 않고 collision audit과 index 재생성을 거쳐야 하며, 이 계약은 NFKC를 모든 identifier에 적용하라는 뜻이 아니라 어떤 차이를 접었는지 재현하기 위한 최소 기록입니다.
        </p>
      </div>
      <NormalizationChoiceViz />
      <div id="paper-unicode-normalization" className="not-prose my-8 border-l border-primary/50 pl-4 scroll-mt-24">
        <p className="text-xs font-bold text-primary">표준 읽기 · Canonical과 compatibility equivalence</p>
        <p className="mt-2 text-sm font-semibold">Unicode Standard Annex #15 — Unicode Normalization Forms</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">NFC·NFD·NFKC·NFKD의 decomposition·composition과 안정성·conformance를 정의합니다. 특히 compatibility normalization은 임의 text에 무조건 적용하면 의미 있는 formatting 차이와 round-trip을 잃을 수 있다고 명시합니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline" href="https://www.unicode.org/reports/tr15/" target="_blank" rel="noreferrer">최신 Unicode normalization 규격 보기</a>
      </div>
    </section>
  );
}
