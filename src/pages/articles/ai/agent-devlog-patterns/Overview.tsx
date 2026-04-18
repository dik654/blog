import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 git log만으로 부족한가</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          개인 에이전트 개발은 "문제 → 수정"의 끝없는 흐름이다.<br />
          harness가 엉키고, tool이 실패하고, memory가 drift하고, routing이 애매해진다.<br />
          오늘 해결하면 내일 또 다른 증상이 나타난다. 해결 과정의 맥락은 머릿속에 잠시 머물다 사라진다.
        </p>
        <p className="leading-7">
          3주 뒤 같은 증상이 돌아왔을 때 — "저번에 어떻게 고쳤지?"<br />
          git log를 뒤져 보면 "fix memory drift" 한 줄만 있다. 왜 그렇게 고쳤는지, 어떤 대안을 버렸는지, 무엇을 배웠는지는 어디에도 없다.<br />
          개인 프로젝트라 PR 리뷰도 없고, 동료의 기억에 분산 저장해 둘 수도 없다.
        </p>
        <p className="leading-7">
          이 글은 개인 에이전트 개발에서 "무엇을 어디에 기록할지"를 정리한다.<br />
          핵심은 한 파일로 다 감당하려 하지 말고 — <strong>세 층</strong>으로 나누는 것이다.<br />
          Changelog, ADR(Architecture Decision Record), Lessons 세 층이 각각 다른 조회 질문을 담당한다.
        </p>
        <p className="leading-7">
          이 글의 모든 예시는 실제로 내가 운영 중인 <code>context-manager</code> 프로젝트에서 뽑았다.<br />
          Rust Gateway + TypeScript Agent + PostgreSQL/Qdrant/Redis 기반의 개인용 지식 시스템으로, Podman rootless 컨테이너 위에서 돌아간다.<br />
          이 프로젝트의 <code>knowledge/</code> 디렉토리 아래에 3층 구조가 구축돼 있고, <code>lessons/decisions/001-dev-journaling-pattern.md</code>에 이 구조 자체가 ADR로 기록돼 있다 — 즉 이 글은 그 ADR을 산문으로 풀어쓴 것이기도 하다.
        </p>

        <div className="not-prose my-8"><OverviewViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">git log가 기록하지 못하는 것</h3>
        <p className="leading-7">
          git commit message의 목적은 "무엇이 바뀌었는가"다.<br />
          diff로는 알기 어려운 변경 의도를 한 줄~몇 줄로 남긴다. 이게 유일한 공식 기록이라면 많은 맥락이 소실된다.
        </p>
        <p className="leading-7">
          특히 이런 것들이 남지 않는다:
        </p>
        <ul className="leading-7">
          <li><strong>탐색한 대안</strong> — "A 접근을 먼저 해봤는데 B로 뒤집은" 과정. 최종 커밋에는 B만 남는다.</li>
          <li><strong>실패한 시도</strong> — 브랜치를 지우면 흔적이 사라진다. 저장된 "왜 실패했는가"가 없다.</li>
          <li><strong>결정의 배경 제약</strong> — "이 구조를 고른 건 legal 요구 때문"처럼, 코드 밖에서 온 이유.</li>
          <li><strong>시간 감각</strong> — "최근 2주간 memory 쪽만 건드렸네"처럼 흐름을 훑는 조회가 어렵다.</li>
          <li><strong>원칙화된 교훈</strong> — "이런 상황에서는 이렇게 판단한다"는 반복 가능한 규칙.</li>
        </ul>
        <p className="leading-7">
          이것들을 모두 commit message에 넣으면 message가 부풀고, 부푼 message는 작성과 리뷰가 고통스럽고, 고통스러우면 곧 안 쓰게 된다.<br />
          그래서 git 밖에 별도 기록 층이 필요하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">세 가지 다른 조회 질문</h3>
        <p className="leading-7">
          기록이 필요한 이유는 결국 "나중에 조회하기 위해서"다.<br />
          그런데 조회 질문을 잘 들여다보면 서로 다른 세 종류가 섞여 있다.
        </p>
        <p className="leading-7">
          <strong>시간 축 조회</strong> — "언제 무슨 일이 있었지?"<br />
          예: "2주 전에 routing 쪽 이슈 있었던 것 같은데 언제였지?" "지난달에 뭐 했지?"<br />
          이 질문에 답하려면 시간순으로 쭉 훑을 수 있어야 한다. 주제별로 분산된 파일들은 이 조회에 약하다.
        </p>
        <p className="leading-7">
          <strong>결정 축 조회</strong> — "이 아키텍처를 왜 이렇게 짰지?"<br />
          예: "memory를 multi-file로 쪼갠 건 왜 그랬지?" "이 결정을 뒤집어도 되나?"<br />
          이 질문은 특정 결정의 배경과 제약을 묻는다. 시간순 나열에 묻혀 있으면 찾기 어렵다.
        </p>
        <p className="leading-7">
          <strong>원칙 축 조회</strong> — "비슷한 상황에서 어느 쪽을 택해야 하지?"<br />
          예: "LLM-as-judge 써도 될 때와 안 될 때는?" "가중치 접근 없을 때 어떤 해법이 맞지?"<br />
          이 질문은 특정 시점이나 결정이 아니라 <strong>반복 가능한 판단 기준</strong>을 묻는다.<br />
          시간순 로그에 있으면 영원히 못 찾는다 — 주제별로 수렴시켜야 한다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>한 파일의 한계</strong> — 세 질문을 하나의 파일로 감당하려 하면 어느 쪽도 제대로 못 한다.<br />
          시간순으로 쓰면 원칙을 찾을 수 없고, 주제순으로 쓰면 시간 훑기가 안 되고, 결정 기반으로 쓰면 일상 변경이 묻힌다.<br />
          "하나만 써도 되지 않을까"는 처음 며칠만 통한다. 한 달이 지나면 파일이 카오스가 된다.<br />
          3주 뒤의 나를 위해서는 층을 분리하는 게 정답이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">세 층의 분담</h3>
        <p className="leading-7">
          세 조회 질문에 각각 다른 층이 대응한다.
        </p>
        <p className="leading-7">
          <strong>Changelog</strong> — 시간 축.<br />
          단일 파일, 시간역순 prepend. 한 엔트리 3~5줄 (제목 + 짧은 요약 + 상세 링크).<br />
          매 작업이 끝나면 한 줄 추가한다. "언제 무슨 일"만 빠르게 훑을 수 있는 인덱스.
        </p>
        <p className="leading-7">
          <strong>ADR (Architecture Decision Record)</strong> — 결정 축.<br />
          결정마다 번호 매긴 개별 파일. context / decision / consequences 세 필드.<br />
          일상 변경이 아니라 "뒤집기 어려운, 배경이 중요한 결정"만 기록. 한 달에 1~3개 정도.
        </p>
        <p className="leading-7">
          <strong>Lessons</strong> — 원칙 축.<br />
          주제별 개별 파일. "어떤 상황에서 어떻게 판단하는가"를 규칙과 이유로 적는다.<br />
          시간순이 아니라 주제별로 수렴시킨다. 같은 교훈이 여러 번 나타나면 기존 파일을 업데이트한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">세 층은 링크로 연결된다</h3>
        <p className="leading-7">
          세 층이 완전히 독립적이면 오히려 불편하다.<br />
          실전에서는 Changelog 엔트리가 ADR과 Lessons로 링크되고, ADR이 관련 Lessons를 참조하고, Lessons가 구체 사례로 Changelog를 가리킨다.
        </p>
        <p className="leading-7">
          전형적인 흐름:
        </p>
        <ol className="leading-7">
          <li>작업 중 문제 발생 → 해결 → Changelog에 한 줄 추가.</li>
          <li>이게 중요한 결정이면 ADR 하나 생성 → Changelog 엔트리에 ADR 링크.</li>
          <li>같은 교훈이 두 번째 나타나면 Lessons 파일 생성 또는 기존 파일 업데이트 → Changelog에서 Lessons 링크.</li>
        </ol>
        <p className="leading-7">
          조회 시에는 질문이 진입점을 결정한다.<br />
          시간 질문은 Changelog에서 시작 → 필요하면 링크로 점프. 결정 질문은 ADR 직접 진입. 원칙 질문은 Lessons 직접 진입.<br />
          이 네트워크 구조가 세 층을 "한 파일 분리"가 아니라 "다른 축의 인덱스 3개"로 만든다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">유지 비용이 낮아야 실제로 유지된다</h3>
        <p className="leading-7">
          가장 중요한 원칙: <strong>짧게 자주</strong>.<br />
          길게 쓰려는 순간 유지가 깨진다. "나중에 제대로 써야지"는 "영원히 안 쓴다"와 동의어다.
        </p>
        <p className="leading-7">
          각 층의 목표 유지 비용:
        </p>
        <ul className="leading-7">
          <li>Changelog — 매 작업 끝에 <strong>1분</strong>. 3~5줄짜리 엔트리 prepend.</li>
          <li>ADR — 중요 결정이 있을 때만, <strong>10분</strong>. 한 파일 10~20줄.</li>
          <li>Lessons — 교훈이 명확히 수렴했을 때만, <strong>20분</strong>. 주제별로 꾸준히 업데이트.</li>
        </ul>
        <p className="leading-7">
          이 budget을 넘기면 안 된다. 특히 Changelog는 1분 내에 끝나야 "매 작업마다"가 현실적이다.<br />
          길게 쓰고 싶은 욕구가 생기면 — Changelog 엔트리는 짧게 유지하고, 길게 쓸 내용은 ADR 또는 Lessons로 빼낸다.<br />
          "Changelog에는 제목과 링크, 깊은 맥락은 다른 층"이 반복 가능한 분리 기준이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">이 글의 구성</h3>
        <p className="leading-7">
          남은 4개 섹션에서 각 층을 하나씩 뜯어본다.
        </p>
        <ul className="leading-7">
          <li>
            <strong>§2 Changelog</strong> — 파일 포맷, 엔트리 규칙, 시간역순 prepend 흐름, 월별 아카이브.<br />
            예시 엔트리 몇 개와 유지 실패의 전형적 패턴.
          </li>
          <li>
            <strong>§3 ADR</strong> — 템플릿, 번호 매기기, "이건 ADR인가 Lessons인가" 판단 기준.<br />
            결정 뒤집기, superseded 표기, ADR끼리의 참조 관계.
          </li>
          <li>
            <strong>§4 Lessons</strong> — 주제별 수렴, "원칙"과 "레시피"의 차이, 업데이트 흐름.<br />
            Lessons에 들어가면 안 되는 것들 (디버깅 레시피, 코드 구조).
          </li>
          <li>
            <strong>§5 세 층 분담과 유지 규칙</strong> — 층들의 상호작용, git hook 자동화, 월별 아카이브, 팀/개인 차이.<br />
            새 프로젝트에서 이 구조를 0에서 세팅하는 절차.
          </li>
        </ul>
        <p className="leading-7">
          각 섹션은 "왜 이 층이 필요한가"에서 시작해 "어떻게 유지하는가"로 끝난다.<br />
          구조만 이해하고 유지 비용을 관리하지 못하면 세 층 전부 한 달 안에 방치된다 — 그래서 유지 쪽을 끝까지 강조한다.
        </p>
      </div>
    </section>
  );
}
