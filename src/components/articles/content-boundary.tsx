import {
  EDITORIAL_BOUNDARIES,
  type EditorialBoundaryKey,
} from "@/content/editorial-ownership";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import { Link } from "react-router-dom";

const EVIDENCE_LABEL = {
  standard: "표준·명세",
  "primary-source": "공식 자료",
  "secondary-source": "연구·해설",
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
    <aside className="not-prose my-6" aria-label="이 글에서 다루는 범위와 근거">
      <ProgressiveDetail
        className="my-0"
        label="이 글의 범위 펼쳐 보기"
        title={boundary.title}
        preview="이 글에서 답하는 질문, 이어 읽을 내용, 판단에 사용한 자료의 범위를 확인합니다."
      >
        <p>
          본문은 아래 질문에 답합니다. 더 깊은 계산이나 다른 운영 단계는 연결된 글에서 이어 읽을 수 있습니다.
        </p>

        <section>
          <h4>이 글에서 답하는 것</h4>
          <ul>
            {boundary.owns.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h4>이어 읽을 내용</h4>
          <ul>
            {boundary.reuses.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link to={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h4>판단에 사용한 자료의 범위</h4>
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
