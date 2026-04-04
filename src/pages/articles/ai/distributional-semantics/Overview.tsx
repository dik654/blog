import OneHotViz from './viz/OneHotViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 단어를 숫자로 바꿔야 하는가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          컴퓨터는 텍스트를 직접 처리할 수 없음<br />
          신경망의 입력 — 실수(real number) 벡터만 허용<br />
          "고양이"라는 문자열을 수학 연산에 넣으려면 <strong>숫자 표현</strong>이 필수
        </p>

        <h3>One-Hot 인코딩의 한계</h3>
        <p>
          가장 단순한 방법 — 어휘 크기 V차원 벡터에서 해당 단어 위치만 1, 나머지 0<br />
          V = 10만이면 10만 차원 — <strong>차원 폭발</strong>(curse of dimensionality)<br />
          모든 단어 쌍의 코사인 유사도가 0 — 의미적 관계 표현 불가
        </p>
      </div>
      <div className="not-prose my-8">
        <OneHotViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          해결책 — 단어를 <strong>저차원 밀집 벡터</strong>(dense vector)로 변환<br />
          의미가 비슷한 단어가 벡터 공간에서 가까이 위치하도록 학습<br />
          이것이 <strong>분산 표현</strong>(Distributed Representation)의 핵심 아이디어
        </p>
      </div>
    </section>
  );
}
