import OverviewViz from './viz/OverviewViz';
import { PrinciplesViz, HistoryViz } from './viz/OverviewDetailViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프롬프트 엔지니어링이란</h2>
      <div className="not-prose mb-8"><OverviewViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>프롬프트 엔지니어링</strong> — LLM에서 원하는 출력을 이끌어내기 위해 입력을 체계적으로 설계하는 기술<br />
          모델 파라미터를 수정하지 않고, 입력 텍스트만으로 성능을 끌어올리는 방법
        </p>
        <p>
          같은 GPT-4에 "수도 알려줘"와 "JSON으로 수도 출력"은 완전히 다른 결과를 생성<br />
          프롬프트 = LLM의 프로그래밍 인터페이스 — 명확한 지시가 명확한 결과로 이어짐
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">프롬프트 엔지니어링 6대 원칙</h3>
        <div className="not-prose mb-6"><PrinciplesViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">프롬프트 엔지니어링 역사</h3>
        <div className="not-prose mb-6"><HistoryViz /></div>
        <p className="leading-7">
          요약 1: 프롬프트 엔지니어링 = <strong>LLM의 프로그래밍 인터페이스</strong>.<br />
          요약 2: <strong>6대 원칙</strong> — 명확성·컨텍스트·예시·역할·구조·반복.<br />
          요약 3: GPT-3 이후 <strong>in-context learning</strong>이 fine-tuning 대체.
        </p>
      </div>
    </section>
  );
}
