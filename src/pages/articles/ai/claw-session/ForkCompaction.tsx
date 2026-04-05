import ForkViz from './viz/ForkViz';
import ForkRewindFlowViz from './viz/ForkRewindFlowViz';

export default function ForkCompaction() {
  return (
    <section id="fork-compaction" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">세션 포크 &amp; 컴팩션</h2>
      <ForkRewindFlowViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ForkViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 포크가 필요한가</h3>
        <p>
          LLM 에이전트는 종종 "시도해봐야 아는" 경로에 직면<br />
          - A 접근법 시도 → 실패 → B 접근법 시도<br />
          - 이미 30턴 진행한 대화에서 2가지 후보를 병렬 탐색<br />
          <strong>포크 없이는</strong> 실패한 시도가 세션에 쌓여 컨텍스트 오염 발생
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 포크 없는 경우 (오염 발생)
session: [msg1, ..., msg30, 시도A실패, "취소하고 다시...", 시도B성공]
// 시도A 흔적이 LLM 컨텍스트에 남아 판단에 영향

// 포크 사용
parent: [msg1, ..., msg30]
fork_A: [msg1, ..., msg30, 시도A실패]   // 부모의 복사본 + A
fork_B: [msg1, ..., msg30, 시도B성공]   // 부모의 복사본 + B
// A와 B가 격리됨 — 성공한 B만 부모로 병합 가능`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">fork_session() 구현</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl SessionStore {
    pub fn fork_session(&mut self, parent_id: &SessionId) -> Result<SessionId> {
        let parent = self.get(parent_id)?;

        // 1) 새 세션 ID 생성
        let new_id = SessionId::new();

        // 2) 상태 복제 (messages, tool_calls, token_usage 모두 clone)
        let mut forked = parent.clone();
        forked.id = new_id.clone();
        forked.parent = Some(parent_id.clone());
        forked.started_at = Utc::now();
        forked.metadata.insert("forked_from", parent_id.to_string());

        // 3) 레지스트리에 등록
        self.sessions.insert(new_id.clone(), forked);

        Ok(new_id)
    }
}`}</pre>
        <p>
          <strong>3단계 포크</strong>: ID 생성 → 전체 clone → 레지스트리 등록<br />
          <code>clone()</code>은 Rust 표준 — Vec 복사는 O(n) 선형 시간, 하지만 단 1회 비용<br />
          부모 세션은 <strong>불변</strong> — 포크 후에도 그대로 유지되어 후속 fork 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">포크 수명 주기</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 세션 수명 상태 머신
pub enum ForkState {
    Active,       // 포크 진행 중 — 대화 계속
    Abandoned,    // 포크 포기 — 메모리에서 제거 대상
    Merged,       // 부모로 병합 완료 — 제거 대상
}

// 전이:
// Active → Abandoned  (사용자가 폐기)
// Active → Merged     (성공 결과를 부모로 병합)
// Abandoned → 삭제   (GC 타이밍)
// Merged   → 삭제   (GC 타이밍)`}</pre>
        <p>
          <strong>3가지 ForkState</strong>: Active, Abandoned, Merged<br />
          Active에서만 Merged·Abandoned로 전이 가능 — 최종 상태에서 되돌릴 수 없음<br />
          GC는 <code>SessionStore::collect_garbage()</code>가 주기적으로 수행 — 10분 이상 Abandoned 세션 삭제
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">merge_fork() — 포크를 부모로 반영</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub fn merge_fork(&mut self, fork_id: &SessionId) -> Result<()> {
    let fork = self.get(fork_id)?;
    let parent_id = fork.parent.as_ref().ok_or(anyhow!("not a fork"))?;
    let parent = self.get_mut(parent_id)?;

    // 포크에서 "부모 이후 추가된 메시지"만 추출
    let parent_len = parent.messages.len();
    let delta = fork.messages[parent_len..].to_vec();

    // 부모에 차분 적용
    parent.messages.extend(delta);
    parent.token_usage.accumulate_from(&fork.token_usage);
    parent.tool_calls.extend_from_slice(&fork.tool_calls[parent_len..]);

    // 포크 상태를 Merged로 전이
    self.mark_merged(fork_id)?;
    Ok(())
}`}</pre>
        <p>
          <strong>차분 병합</strong>: 포크 전체가 아닌 "부모 이후 증분"만 부모에 적용<br />
          Fork 시점의 메시지 개수(<code>parent_len</code>)를 경계로 slice 분리<br />
          토큰 사용량도 누적 — 포크에서 사용한 토큰이 부모 사용량에 반영
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">포크와 컴팩션의 상호작용</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 포크 세션도 독립적으로 컴팩션 가능
let fork_id = store.fork_session(&parent_id)?;

// 포크 진행...
runtime.run_turn("시도A를 해보자").await?;
runtime.run_turn("더 깊이 파보자").await?;

// 포크가 커지면 컴팩션 트리거
if should_compact(&runtime.session, &config) {
    let result = compact_session(&runtime.session, &config)?;
    runtime.session = result.compacted_session;
}

// 결과가 좋으면 부모로 병합
store.merge_fork(&fork_id)?;`}</pre>
        <p>
          <strong>핵심</strong>: 포크 세션도 일반 세션과 동일하게 컴팩션 지원<br />
          포크가 길어져도 토큰 예산 초과 없이 탐색 가능<br />
          병합 시에는 <strong>포크의 현재 메시지 배열</strong>(압축됐을 수 있음)이 부모로 들어감
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">포크 ↔ 컴팩션 상호작용 — 주의사항</h3>
        <p>
          <strong>위험 1</strong>: 부모 세션이 포크 이후에 컴팩션되면, 병합 시 메시지 인덱스 불일치<br />
          → <code>merge_fork()</code>는 병합 전 <strong>부모의 메시지 수가 fork 시점과 동일한지 검증</strong>
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 부모 변경 감지
impl Session {
    pub fn fork_checkpoint(&self) -> ForkCheckpoint {
        ForkCheckpoint {
            session_id: self.id.clone(),
            message_count: self.messages.len(),
            hash: self.compute_message_hash(),
        }
    }
}

// 병합 시점에 검증
fn merge_fork(&mut self, fork_id: &SessionId) -> Result<()> {
    let fork = self.get(fork_id)?;
    let checkpoint = fork.metadata.fork_checkpoint.as_ref()
        .ok_or(anyhow!("missing checkpoint"))?;
    let parent = self.get(&checkpoint.session_id)?;

    if parent.messages.len() != checkpoint.message_count {
        return Err(anyhow!("parent diverged since fork"));
    }
    // ... 병합 수행
}`}</pre>
        <p>
          <strong>fork_checkpoint</strong>로 부모의 fork 시점 상태를 해시로 저장<br />
          병합 시 부모가 변경됐으면 <code>parent diverged</code> 에러 — 사용자 개입 필요<br />
          이 체크 덕분에 <strong>"모르는 사이에 상태가 덮어씌워지는" 사고 방지</strong>
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Git과의 개념적 유사성</p>
          <p>
            Session fork ≈ <code>git branch</code><br />
            merge_fork ≈ <code>git merge</code><br />
            Abandoned ≈ 삭제된 브랜치<br />
            fork_checkpoint ≈ merge base
          </p>
          <p className="mt-2">
            차이점: Git은 파일 기반, Session은 메시지 배열 기반<br />
            Git의 충돌 해소(3-way merge)에 해당하는 것이 <strong>parent diverged 에러</strong><br />
            claw-code는 자동 해소 대신 "사용자 개입 요구" — 대화 의미의 충돌은 기계적으로 풀 수 없음
          </p>
          <p className="mt-2">
            이 패턴은 LLM 에이전트에서 흔치 않음 — 대부분의 프레임워크는 선형 세션만 지원<br />
            Fork는 <strong>"가설 탐색 능력"</strong>을 제공하는 강력한 기능
          </p>
        </div>

      </div>
    </section>
  );
}
