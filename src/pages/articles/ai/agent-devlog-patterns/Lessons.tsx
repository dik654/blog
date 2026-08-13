import { CitationBlock } from "@/components/ui/citation";
import LessonsViz from "./viz/LessonsViz";

const LESSON_FIELDS = [
  ["Rule", "다음 작업에서 실행할 현재 행동 기준"],
  ["Scope", "적용되는 data path와 적용되지 않는 예외"],
  ["Evidence", "incident, Changelog, ADR, test artifact의 link"],
  ["Verification", "rule을 지키는 test·metric·review"],
  ["Revisit", "전제나 system boundary가 달라져 다시 볼 조건"],
] as const;

export default function Lessons() {
  return (
    <section id="lessons" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Lessons는 사건을 요약하는 곳이 아니라 현재 원칙을 소유합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          고정 사례에서 뽑을 수 있는 원칙은 “compaction은 위험하다”가 아닙니다.
          더 정확한 문장은 “기존 non-empty state를 model이나 batch job이 원본에서
          만들어 낸 파생 결과(derived output)가 비어 있다면, 그 결과로 기존 값을
          replace하기 전에 구조 validation, explicit delete
          intent, rollback evidence를 확인한다”입니다. 적용 조건과 검증 방법이
          들어가야 다른 memory, migration, index rebuild에서도 실제 판단에 쓸 수
          있습니다.
        </p>
        <p>
          보통 한 사건만으로 넓은 rule을 확정하면 우연한 조건을 일반화하기
          쉽습니다. 다만 data loss나 security처럼 한 번의 실패도 예방 가치가 큰
          경우에는 적용 범위를 좁힌 provisional lesson을 즉시 만들 수 있습니다.
          이후 counterexample과 새 evidence가 생기면 같은 문서를 갱신하고, 별도
          날짜의 복사본을 늘리지 않습니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <LessonsViz />
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {LESSON_FIELDS.map(([field, meaning]) => (
          <article
            key={field}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h3 className="break-words text-sm font-semibold">{field}</h3>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              {meaning}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>고정 사례를 재사용 가능한 rule로 쓰기</h3>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-muted p-4 text-sm">
          {`# Derived output으로 기존 state를 교체할 때의 guardrail

## Rule
기존 state가 non-empty인데 새 derived output이 structurally empty이면
자동 replace하지 않는다. explicit delete intent나 승인된 migration만 예외다.

## Scope
- profile compaction write
- bulk replace migration
- 재생성 가능한 index의 source-of-truth 교체

## Evidence
- Changelog 2026-04-16
- run-1842
- ADR-005

## Verification
- empty / partial / full output 회귀 test
- 기존 state checksum 보존
- explicit deletion test는 별도 fixture로 검증

## Revisit
transactional store가 replace를 원자적으로 검증하고 복구 evidence를 제공하면
guard 위치와 책임을 다시 결정한다.`}
        </pre>
        <p>
          이 구조는 “하지 마라”로 끝나지 않고 exception과 test까지 연결합니다.
          예를 들어 사용자가 profile 삭제를 명시한 경우 empty state는 정상 결과일
          수 있으므로 단순한 <code>length &gt; 0</code> 검사는 오탐을 만듭니다.
          explicit intent와 derived failure를 구분하는 domain rule이 필요합니다.
        </p>

        <h3>Postmortem과 Lessons를 섞지 않습니다</h3>
        <p>
          큰 incident라면 timeline, impact, detection, mitigation, contributing
          factors, follow-up owner가 있는 postmortem을 별도로 작성합니다. Lessons는
          그 문서를 압축해서 대체하지 않고, 여러 incident에서 지금 재사용할
          rule만 소유합니다. postmortem action item은 owner와 verifiable end
          state가 있어야 하며, Lessons의 원칙도 어떤 test로 지킬지 연결해야
          문서가 구호로 끝나지 않습니다.
        </p>
        <p>
          사람이나 model을 탓하는 문장도 피합니다. “agent가 바보라 empty output을
          냈다”가 아니라 “empty output이 기존 state를 replace할 수 있었고,
          validation과 rollback signal이 없었다”처럼 system condition을 적어야
          재발 방지 action으로 이어집니다. blameless는 책임을 없애는 말이 아니라
          원인 분석을 개인 비난에서 system 개선으로 옮기는 원칙입니다.
        </p>
      </div>

      <div
        id="paper-google-sre-postmortem"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Google SRE Postmortem Culture
        </p>
        <CitationBlock
          source="Google SRE — Postmortem Culture: Learning from Failure"
          citeKey={3}
          type="paper"
          href="https://sre.google/workbook/postmortem-culture/"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> incident를 복구하고도 원인과 preventive action을 formal하게 학습하지 않으면 비슷한 failure가 반복되고 개인 비난이 evidence 공유를 막을 수 있습니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> blameless postmortem, 객관적 trigger, complete incident data, measurable preventive action, owner와 review를 통해 system learning으로 연결합니다.</p>
            <p><strong>전제·조건:</strong> Google SRE의 대규모 production incident와 조직 문화 사례이며, 팀은 자기 service에 맞는 postmortem trigger와 review process를 사전에 정해야 합니다.</p>
            <p><strong>근거 범위:</strong> 사건을 evidence와 action item으로 보존하고 반복 pattern을 조직적 학습으로 전환하는 운영 원리를 뒷받침합니다.</p>
            <p><strong>비주장:</strong> 이 글의 Lessons 문서가 Google postmortem과 같은 artifact이거나, 개인 agent project에 Google의 process 전체를 적용해야 한다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>agent는 초안을 만들 수 있지만 evidence를 발명할 수 없습니다</h3>
        <p>
          agent에게 여러 log와 issue를 검색해 반복 condition을 묶게 하면 Lessons
          후보를 찾는 데 도움이 됩니다. 다만 “세 번 반복됐다”는 claim에는 세
          artifact link가 있어야 하고, causal conclusion은 반례와 reviewer를
          거쳐야 합니다. source에 없는 숫자, 삭제된 log, 접근 권한이 없는 incident를
          채워 넣지 못하도록 citation existence와 link permission을 자동 검사하고
          최종 rule은 owner가 승인합니다.
        </p>
      </div>
    </section>
  );
}
