import CompactPipelineViz from './viz/CompactPipelineViz';

const factRows = [
  ['규모', '제거되는 user·assistant·tool 메시지 수를 센다.'],
  ['도구', 'ToolUse 이름과 ToolResult의 tool_name을 모아 정렬·중복 제거한다.'],
  ['최근 요청', '제거 구간의 마지막 user 텍스트 최대 3개를 시간순으로 남긴다.'],
  ['남은 일', 'todo, next, pending, follow up, remaining이 들어간 최근 텍스트 최대 3개를 남긴다.'],
  ['파일', '경로에 /가 있고 rs·ts·tsx·js·json·md 확장자인 후보를 정렬해 최대 8개 남긴다.'],
  ['현재 작업', '제거 구간에서 마지막으로 만나는 비어 있지 않은 텍스트를 최대 200자로 남긴다.'],
  ['타임라인', '제거되는 모든 block을 역할과 함께 쓰되 각 block을 최대 160자로 자른다.'],
] as const;

export default function Overview() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>압축은 메모리를 지우는 일이 아니라 경계를 다시 쓰는 일이다</h2>
          <p>
            긴 대화에는 사용자 문장만 쌓이지 않는다. assistant의 설명, 도구 호출, 도구 결과와 이미
            만든 압축 요약이 한 배열에 함께 들어간다. 단순히 앞부분을 삭제하면 현재 작업의 이유를 잃고,
            도구 결과만 홀로 남길 수도 있다. 그래서 <code>compact_session()</code>은 먼저
            <strong> 압축해도 되는가</strong>, 다음으로 <strong>어디에서 자를 것인가</strong>,
            마지막으로 <strong>무엇을 요약에 남길 것인가</strong>를 따로 결정한다.
          </p>
          <p>
            기본 설정은 최근 메시지 4개 보존, 추정 토큰 10,000이다. 여기서 “토큰”은 tokenizer의
            정확한 결과가 아니다. 각 block의 문자열 <strong>UTF-8 byte 길이를 4로 나누고 1을
            더한 값</strong>을 합산한 근사치다. 한글 한 글자는 여러 byte이므로 영어 문자 수와 같은
            감각으로 읽으면 안 된다.
          </p>
        </div>

        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          <div className="bg-background p-4">
            <p className="text-xs font-semibold text-muted-foreground">GATE 01 · 자를 수 있는가</p>
            <p className="mt-2 text-sm font-bold"><code>compactable.len() &gt; preserve_recent_messages</code></p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">남길 개수보다 새 메시지가 많아야 한다. 같으면 아무것도 자르지 않는다.</p>
          </div>
          <div className="bg-background p-4">
            <p className="text-xs font-semibold text-muted-foreground">GATE 02 · 충분히 큰가</p>
            <p className="mt-2 text-sm font-bold"><code>estimated_tokens &gt;= max_estimated_tokens</code></p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">첫 compact summary는 계산에서 제외하고, 그 뒤 원문만 합산한다.</p>
          </div>
        </div>
      </section>

      <section id="compact-pipeline" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>잘라낼 위치보다 역할 관계가 먼저다</h2>
          <p>
            보통 경계는 <code>전체 메시지 수 - 보존 개수</code>다. 하지만 첫 보존 메시지의 첫 block이
            <code>ToolResult</code>이면 바로 앞을 확인한다. 앞 메시지에 <code>ToolUse</code>가
            있으면 경계를 한 칸 뒤로 옮겨 호출과 결과를 함께 남긴다. 이미 결과가 고아 상태라면 더
            뒤로 걸어가 안전한 시작점을 찾는다.
          </p>
          <p>
            아래 실험은 세 가지 transcript와 수동·자동 적용 방식을 바꿔 본다. 숫자가 바뀌는 것보다
            <strong> raw boundary와 safe boundary가 왜 달라지는지</strong>, 그리고 계산된 결과가
            runtime에 실제 설치되는지를 확인하는 것이 핵심이다.
          </p>
        </div>
        <CompactPipelineViz />
      </section>

      <section id="summary-merge" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>모델이 이해한 요약이 아니라 코드가 고른 증거 묶음이다</h2>
          <p>
            제거 구간은 다음 규칙으로 <code>&lt;summary&gt;</code> 문자열이 된다. 규칙이 단순해
            결과는 재현 가능하지만, 동의어·숨은 의도·긴 인과관계를 이해하지는 못한다. 예를 들어
            “다음 차례에 고치자”는 한국어 문장은 영문 keyword가 없으면 pending work로 분류되지 않는다.
          </p>
        </div>

        <div className="not-prose my-7 divide-y divide-border border-y border-border">
          {factRows.map(([label, detail], index) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4">
              <div className="flex items-center gap-2 text-sm font-bold">
                <span className="font-mono text-[10px] text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                {label}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3>두 번째 압축은 이전 원문을 다시 볼 수 없다</h3>
          <p>
            첫 메시지가 Claw의 continuation preamble로 시작하면 이를 기존 압축 요약으로 인식한다.
            다음 압축에서는 그 메시지를 제거 대상과 trigger token 계산에서 빼고, 이전 요약의
            timeline 바깥 highlights를 <code>Previously compacted context</code>로 옮긴다. 새
            요약의 highlights와 timeline을 그 뒤에 붙인다.
          </p>
          <p>
            이는 “중복을 지능적으로 제거하고 최신 사실을 고른다”는 뜻이 아니다. 이전 요약을 다시
            구조화해 누적하는 문자열 merge다. 별도 <code>max_summary_tokens</code>나 2차
            compressor가 없으므로, 반복 압축에서 요약 자체가 계속 커질 가능성도 현재 경계로 남는다.
          </p>
        </div>
      </section>

      <section id="runtime-handoff" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>결과를 만들었다고 실행 중 세션이 바뀐 것은 아니다</h2>
          <p>
            <code>ConversationRuntime::compact(&amp;self, config)</code>는 현재 Session을 읽어
            <code>CompactionResult</code>를 반환할 뿐이다. 호출자가
            <code>result.compacted_session</code>을 채택하지 않으면 runtime state는 그대로다.
          </p>
          <p>
            자동 경로는 다르다. 한 turn이 끝난 뒤 누적 API input token이 환경 변수
            <code>CLAUDE_CODE_AUTO_COMPACT_INPUT_TOKENS</code>의 threshold 이상이면
            <code>maybe_auto_compact()</code>가 실행된다. 이때 내부
            <code>max_estimated_tokens</code>를 0으로 두어 메시지 수 gate만 통과하면 압축하고,
            제거된 메시지가 있을 때만 <code>self.session</code>을 결과로 교체한다.
          </p>
          <p>
            compacted Session의 첫 메시지는 합성 system continuation이고 뒤에는 보존한 원문이
            이어진다. 동시에 Session metadata에는 압축 횟수, 마지막 summary와 제거 개수가 기록되어
            JSONL 저장·복원 경로로 넘어간다. 따라서 성공 계약은 “문자열을 만들었다”가 아니라
            <strong> 안전한 transcript와 metadata가 다음 요청에 실제 사용됐다</strong>까지다.
          </p>
        </div>
      </section>
    </>
  );
}
