import TextUnitStackViz from "./viz/TextUnitStackViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">화면에 한 글자로 보인다고 저장소에서도 원소 하나인 것은 아니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          사람은 ‘가’나 가족 emoji를 화면의 한 글자로 읽습니다. 컴퓨터는 같은 text를 Unicode code point의 sequence로 다루고, 파일과 network에서는 다시 UTF-8 byte sequence로 저장합니다. 사용자가 보는 글자 경계, 문자열 API가 세는 원소, tokenizer가 받는 byte 수가 서로 다를 수 있는 이유입니다.
        </p>
        <p className="leading-8">
          이 글에서는 bit와 byte부터 시작해 code point, grapheme cluster, UTF-8과 normalization을 차례대로 분리합니다. 마지막에는 span label과 검색 결과가 어느 좌표의 offset인지 명시해야 하는 이유를 확인하고 tokenizer로 연결합니다. 처음부터 읽으면 문자 encoding을 안다고 가정하지 않습니다.
        </p>
      </div>
      <TextUnitStackViz />
    </section>
  );
}
