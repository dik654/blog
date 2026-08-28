import {
  EDITORIAL_BOUNDARIES,
  type EditorialBoundaryKey,
} from "@/content/editorial-ownership";
import ProgressiveDetail from "@/components/articles/progressive-detail";

const EVIDENCE_LABEL = {
  standard: "표준·명세",
  "primary-source": "공식 자료",
  "project-measurement": "프로젝트 실측",
  "project-claim": "프로젝트 해석",
} as const;

export default function ContentBoundary({
  article,
}: {
  article: EditorialBoundaryKey;
}) {
  const boundary = EDITORIAL_BOUNDARIES[article];

  return (
    <aside className="not-prose my-6" aria-label="콘텐츠 소유권과 근거 경계">
      <ProgressiveDetail
        className="my-0"
        label="검증 범위 펼쳐 보기"
        title={boundary.title}
        preview="이 글이 직접 설명하는 내용과 연결 글·근거의 책임을 분리해 과도한 주장을 막습니다."
      >
        <p>
          아래 항목은 독자가 출처와 설명의 경계를 확인하고 싶을 때 보는 편집
          명세입니다. 본문의 핵심 흐름을 읽는 데 먼저 외울 필요는 없습니다.
        </p>

        <section>
          <h4>이 글이 직접 설명하는 내용</h4>
          <ul>
            {boundary.owns.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h4>다른 글의 정본 설명을 재사용하는 내용</h4>
          <ul>
            {boundary.reuses.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h4>근거를 읽는 방법</h4>
          <ul>
            {boundary.evidence.map((item) => (
              <li key={`${item.kind}-${item.rule}`}>
                <strong>{EVIDENCE_LABEL[item.kind]}:</strong> {item.rule}
              </li>
            ))}
          </ul>
        </section>
      </ProgressiveDetail>
    </aside>
  );
}
