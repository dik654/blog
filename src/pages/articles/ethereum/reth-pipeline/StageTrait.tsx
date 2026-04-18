import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import StageTraitViz from './viz/StageTraitViz';
import { STAGE_METHODS } from './StageTraitData';
import type { CodeRef } from '@/components/code/types';

export default function StageTrait({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [active, setActive] = useState(0);

  return (
    <section id="stage-trait" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Stage trait & 실행 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Pipeline은 <code>Vec&lt;Box&lt;dyn Stage&gt;&gt;</code>를 순회하며 각 Stage를 호출한다.<br />
          Stage trait의 핵심은 두 메서드다.<br />
          <code>execute()</code>가 정방향 처리를 담당하고, <code>unwind()</code>가 reorg(체인 재구성) 시 역방향 롤백을 처리한다.
        </p>

        {/* ── trait 시그니처 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Stage trait 시그니처</h3>
        <div className="not-prose my-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-semibold text-indigo-500 mb-2">Stage&lt;DB: Database&gt;: Send + Sync</p>
          <div className="space-y-3 text-sm">
            <div className="rounded border border-border/40 p-3">
              <p className="font-mono text-xs font-semibold text-foreground/80 mb-1">fn id(&amp;self) -&gt; StageId</p>
              <p className="text-foreground/60 text-xs">Stage 식별자 -- 체크포인트 테이블 키로 사용 (Headers, Bodies, SenderRecovery, Execution, MerkleExecute)</p>
            </div>
            <div className="rounded border border-border/40 p-3">
              <p className="font-mono text-xs font-semibold text-foreground/80 mb-1">fn execute(&amp;mut self, provider: &amp;Provider, input: ExecInput) -&gt; Result&lt;ExecOutput, StageError&gt;</p>
              <p className="text-foreground/60 text-xs"><code>provider</code>: DB 트랜잭션(R/W) / <code>input</code>: {'{'} target, checkpoint {'}'} -- checkpoint+1부터 target까지 정방향 처리</p>
            </div>
            <div className="rounded border border-border/40 p-3">
              <p className="font-mono text-xs font-semibold text-foreground/80 mb-1">fn unwind(&amp;mut self, provider: &amp;Provider, input: UnwindInput) -&gt; Result&lt;UnwindOutput, StageError&gt;</p>
              <p className="text-foreground/60 text-xs"><code>input</code>: {'{'} checkpoint, unwind_to, bad_block {'}'} -- reorg 시 역방향 롤백</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>Send + Sync</code> 경계가 붙은 이유: Pipeline이 스레드 안전하게 Stage를 소유해야 하기 때문이다.<br />
          <code>&amp;mut self</code>로 가변 참조를 받으므로 Stage가 내부 상태(카운터, 버퍼)를 유지할 수 있다.<br />
          <code>Result&lt;_, StageError&gt;</code> 반환 — 에러가 발생하면 Pipeline이 이를 감지해 Unwind 시그널로 전환한다.
        </p>

        {/* ── ExecInput/ExecOutput ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ExecInput & ExecOutput 구조</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-indigo-500 mb-2">ExecInput</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1.5 py-0.5 rounded">target</code>
                <span className="text-foreground/70"><code>Option&lt;BlockNumber&gt;</code> — CL tip, FCU로 전달된 목표 블록 번호</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1.5 py-0.5 rounded">checkpoint</code>
                <span className="text-foreground/70"><code>Option&lt;StageCheckpoint&gt;</code> — 마지막 완료 블록 (None이면 genesis부터)</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border/30">
              <p className="text-xs text-foreground/60"><code>next_block_range()</code> — checkpoint+1 ~ target 범위를 <code>RangeInclusive&lt;BlockNumber&gt;</code>로 반환</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">ExecOutput</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1.5 py-0.5 rounded">checkpoint</code>
                <span className="text-foreground/70"><code>StageCheckpoint</code> — 이번 호출이 완료한 마지막 블록</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1.5 py-0.5 rounded">done</code>
                <span className="text-foreground/70"><code>bool</code> — target 도달 여부. false면 Pipeline이 같은 Stage를 다시 호출</span>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>next_block_range()</code>가 체크포인트 기반 재개를 캡슐화한다.<br />
          Stage 구현체는 이 범위만 보면 되고, 크래시 복구 로직을 신경 쓸 필요가 없다.<br />
          <code>done=false</code> 반환은 "아직 target 미도달, 다시 호출해줘"의 명시적 시그널 — 한 번의 execute() 호출로 메모리를 다 쓰지 않도록 분할 처리 가능.
        </p>

        {/* ── unwind 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">unwind() 역방향 롤백</h3>
        <p className="leading-7">
          reorg 감지 시 Pipeline은 <strong>역순</strong>으로 unwind를 호출한다.<br />
          Merkle → Execution → Senders → Bodies → Headers 순서 — 의존성의 반대 방향.<br />
          각 Stage는 자기가 쓴 DB 테이블에서 target+1 이후의 엔트리를 제거한다.
        </p>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-pink-500 mb-2">UnwindInput</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1.5 py-0.5 rounded">checkpoint</code>
                <span className="text-foreground/70"><code>StageCheckpoint</code> — 되감기 시작점 (현재 체크포인트)</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1.5 py-0.5 rounded">unwind_to</code>
                <span className="text-foreground/70"><code>BlockNumber</code> — 이 블록까지만 DB에 남김</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1.5 py-0.5 rounded">bad_block</code>
                <span className="text-foreground/70"><code>Option&lt;B256&gt;</code> — reorg를 일으킨 블록 해시 (로깅/디버깅용)</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-pink-500 mb-2">ExecutionStage::unwind() 흐름</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-foreground/70">
              <li><code>provider.remove_state_from(unwind_to + 1)</code> — PlainAccountState, PlainStorageState에서 unwind_to+1 이후 제거</li>
              <li><code>provider.remove_receipts_from(unwind_to + 1)</code> — Receipts 테이블 정리</li>
              <li>체크포인트를 <code>unwind_to</code>로 덮어쓰기 &rarr; <code>UnwindOutput</code> 반환</li>
            </ol>
          </div>
        </div>
        <p className="leading-7">
          <strong>Geth와의 차이:</strong> Geth는 블록 단위 실행이라 reorg 시 전체 상태를 되돌려야 한다.<br />
          Reth는 Stage별 unwind()가 있어 필요한 Stage만 부분 롤백이 가능하다.<br />
          예를 들어 MerkleStage만 검증 실패하면 Execution까지만 되돌리면 된다. Bodies/Headers는 건드릴 필요 없다.
        </p>

        {/* ── trait object ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 trait object인가 — dyn Stage 설계</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-indigo-500 mb-2">실제 설계: <code>Vec&lt;Box&lt;dyn Stage&lt;N::DB&gt;&gt;&gt;</code></p>
            <p className="text-sm text-foreground/70">트레이트 객체 벡터 (동적 디스패치) — 런타임 다형성</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-red-300/40 bg-red-50/30 dark:bg-red-950/10 p-3">
              <p className="text-xs font-semibold text-red-500 mb-1">대안 1: 제네릭 튜플</p>
              <p className="text-xs text-foreground/60"><code>Pipeline&lt;A: Stage, B: Stage, C, D, E&gt;</code></p>
              <p className="text-xs text-foreground/50 mt-1">컴파일 타임 결정 -- Stage 추가/제거 시 시그니처 변경 필요</p>
            </div>
            <div className="rounded-lg border border-emerald-300/40 bg-emerald-50/30 dark:bg-emerald-950/10 p-3">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">채택: Vec&lt;Box&lt;dyn Stage&gt;&gt;</p>
              <p className="text-xs text-foreground/60">런타임 추가/제거/순서변경 + PipelineBuilder 패턴</p>
              <p className="text-xs text-foreground/50 mt-1">비용: vtable lookup 1회 (Stage 실행 비용 대비 무시 가능)</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Stage 호출은 파이프라인 전체 실행 시간 중 극히 작은 부분이다.<br />
          실제 비용은 DB I/O, 네트워크, 해시 계산에 있다. vtable 오버헤드는 무시할 수준.<br />
          trait object를 선택해 <strong>빌더 패턴으로 파이프라인을 조립</strong>하는 유연성을 얻었다.
        </p>

        {/* ── done=false 분할 실행 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">done=false 분할 실행 시나리오</h3>
        <p className="leading-7">
          Pipeline::run()은 모든 Stage가 <code>done=true</code>를 반환할 때까지 루프를 반복한다.<br />
          한 Stage가 target까지 도달하지 못하면 다음 루프에서 같은 Stage부터 이어서 실행한다.
        </p>
        <div className="not-prose my-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-3">시나리오: HeadersStage 100만 블록을 10만씩 분할 처리</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3 rounded border border-border/40 p-2.5">
              <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">1</span>
              <div className="text-foreground/70">
                <p>input: target=18,000,000 / checkpoint=17,000,000</p>
                <p className="text-xs text-foreground/50 mt-0.5">&rarr; 100K 블록 처리 &rarr; <code>ExecOutput {'{'} checkpoint: 17,100,000, done: false {'}'}</code></p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded border border-border/40 p-2.5">
              <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">2</span>
              <div className="text-foreground/70">
                <p>input: target=18,000,000 / checkpoint=17,100,000</p>
                <p className="text-xs text-foreground/50 mt-0.5">&rarr; 100K 블록 처리 &rarr; <code>done: false</code> ... 반복</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded border border-emerald-400/40 bg-emerald-50/30 dark:bg-emerald-950/10 p-2.5">
              <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">10</span>
              <div className="text-foreground/70">
                <p>target 도달 &rarr; <code>ExecOutput {'{'} checkpoint: 18,000,000, done: true {'}'}</code></p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">다음 Stage로 진행</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          이 분할 메커니즘이 <strong>메모리 상한을 강제</strong>한다.<br />
          Stage는 "한 번에 너무 많이 처리하지 말라"를 알아서 판단해 done=false로 여유를 가진다.<br />
          Pipeline은 스테이지 내부 사정을 모르고도 되먹임(feedback)만 보고 스케줄링한다.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: 왜 trait로 추상화했나</p>
          <p className="mt-2">
            Stage trait은 3가지 역할을 동시에 수행한다:<br />
            1. <strong>계약(contract)</strong> — 모든 Stage는 execute/unwind 짝을 구현해야 한다<br />
            2. <strong>일관된 체크포인트 모델</strong> — ExecInput/ExecOutput이 강제하는 재개 프로토콜<br />
            3. <strong>조립 유연성</strong> — Box&lt;dyn Stage&gt;로 런타임 순서 변경/추가 가능
          </p>
          <p className="mt-2">
            새 Stage 추가 사례:<br />
            - <code>StorageHashingStage</code> — 스토리지 키를 해시 키로 변환 (Merkle 전처리)<br />
            - <code>HistoryIndexStage</code> — 역사 인덱스 구축 (RPC eth_getLogs용)<br />
            - <code>TransactionLookupStage</code> — tx_hash → 블록 번호 역조회 인덱스
          </p>
          <p className="mt-2">
            각 Stage는 자기 테이블만 책임지면 된다.<br />
            Pipeline 루프 코드는 한 번 작성하면 Stage가 늘어나도 수정할 필요 없다.
          </p>
        </div>
      </div>

      <div className="not-prose mb-6"><StageTraitViz /></div>

      {/* Interactive trait method cards */}
      <h3 className="text-lg font-semibold mb-3">Stage trait 메서드</h3>
      <div className="not-prose space-y-2 mb-6">
        {STAGE_METHODS.map((m, i) => (
          <motion.div key={i} onClick={() => setActive(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === active ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === active ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${i === active ? 'bg-indigo-500 text-white' : 'bg-muted text-muted-foreground'}`}>{m.method}</span>
              <span className="text-sm font-medium">{m.desc}</span>
            </div>
            <AnimatePresence>
              {i === active && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-1 leading-relaxed">{m.detail}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('pipeline-run', codeRefs['pipeline-run'])} />
        <span className="text-[10px] text-muted-foreground self-center">Pipeline::run()</span>
      </div>
    </section>
  );
}
