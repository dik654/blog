import GadgetLifecycleViz from '../components/GadgetLifecycleViz';
import EVMProvingViz from './viz/EVMProvingViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Gadget({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const _onCodeRef = onCodeRef;
  return (
    <section id="gadget" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'ExecutionGadget -- 오퍼코드 회로 구현'}</h2>
      <div className="not-prose mb-8"><GadgetLifecycleViz /></div>
      <div className="not-prose mb-8"><EVMProvingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          각 EVM 오퍼코드는 <code>ExecutionGadget</code> 트레이트를 구현합니다.
          <code>configure</code>에서 제약을 등록하고,
          <code>assign_exec_step</code>에서 실제 실행 트레이스로 셀을 채웁니다.
        </p>
        {_onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => _onCodeRef('add-sub-gadget', codeRefs['add-sub-gadget'])} />
            <span className="text-[10px] text-muted-foreground self-center">add_sub.rs</span>
            <CodeViewButton onClick={() => _onCodeRef('add-sub-assign', codeRefs['add-sub-assign'])} />
            <span className="text-[10px] text-muted-foreground self-center">assign</span>
          </div>
        )}

        <h3 className="text-lg font-semibold mt-6 mb-3">ExecutionGadget 트레이트</h3>
        <div className="not-prose rounded-lg border border-border bg-muted/30 p-4 mb-6">
          <p className="text-sm font-semibold mb-3">
            <code className="text-xs">trait ExecutionGadget&lt;F: Field&gt;</code>
            <span className="text-muted-foreground font-normal ml-2">execution.rs</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-3">
              <p className="font-semibold text-sky-700 dark:text-sky-300 mb-1">가젯 식별</p>
              <ul className="space-y-1 text-foreground/80">
                <li><code className="text-xs">NAME: &'static str</code></li>
                <li><code className="text-xs">EXECUTION_STATE: ExecutionState</code></li>
              </ul>
            </div>
            <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-3">
              <p className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">configure (keygen)</p>
              <p className="text-foreground/80"><code className="text-xs">fn configure(cb: &mut EVMConstraintBuilder&lt;F&gt;) -&gt; Self</code></p>
              <p className="text-xs text-muted-foreground mt-1">회로 열 쿼리 + 논리 제약 등록</p>
            </div>
            <div className="rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3">
              <p className="font-semibold text-amber-700 dark:text-amber-300 mb-1">assign (prove)</p>
              <p className="text-foreground/80"><code className="text-xs">fn assign_exec_step(&self, region, offset, block, transaction, call, step)</code></p>
              <p className="text-xs text-muted-foreground mt-1">셀에 실제 값 기입</p>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">ADD/SUB 가젯 구현</h3>
        <div className="not-prose rounded-lg border border-border bg-muted/30 p-4 mb-6">
          <p className="text-sm font-semibold mb-3">
            <code className="text-xs">AddSubGadget&lt;F&gt;</code>
            <span className="text-muted-foreground font-normal ml-2">execution/add_sub.rs</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
            <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-3">
              <p className="font-semibold text-sky-700 dark:text-sky-300 mb-1">필드 구성</p>
              <ul className="space-y-1 text-foreground/80">
                <li><code className="text-xs">same_context: SameContextGadget&lt;F&gt;</code> — 공통 오퍼코드 상태 전환</li>
                <li><code className="text-xs">add_words: AddWordsGadget&lt;F, 2, false&gt;</code> — a + b = c (mod 2^256)</li>
                <li><code className="text-xs">is_sub: PairSelectGadget&lt;F&gt;</code> — SUB이면 a/c 교환</li>
              </ul>
            </div>
            <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-3">
              <p className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">configure 핵심</p>
              <ul className="space-y-1 text-foreground/80">
                <li><code className="text-xs">query_word_rlc()</code>로 a, b, c 워드 쿼리</li>
                <li><code className="text-xs">AddWordsGadget::construct(cb, [a, b], c)</code></li>
                <li><code className="text-xs">PairSelectGadget</code>으로 ADD/SUB 분기</li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3">
              <p className="font-semibold text-amber-700 dark:text-amber-300 mb-1">스택 팝/푸시 (RwTable 룩업)</p>
              <ul className="space-y-1 text-foreground/80">
                <li><code className="text-xs">cb.stack_pop(select(is_sub, c, a))</code></li>
                <li><code className="text-xs">cb.stack_pop(b)</code></li>
                <li><code className="text-xs">cb.stack_push(select(is_sub, a, c))</code></li>
              </ul>
            </div>
            <div className="rounded border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30 p-3">
              <p className="font-semibold text-violet-700 dark:text-violet-300 mb-1">상태 전환</p>
              <ul className="space-y-1 text-foreground/80">
                <li><code className="text-xs">rw_counter: Delta(3)</code></li>
                <li><code className="text-xs">program_counter: Delta(1)</code></li>
                <li><code className="text-xs">stack_pointer: Delta(1)</code></li>
                <li><code className="text-xs">gas_left: Delta(-3)</code> — ADD gas cost</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">bus-mapping 연계</h3>
        <div className="not-prose rounded-lg border border-border bg-muted/30 p-4 mb-6">
          <p className="text-sm font-semibold mb-3">
            <span className="text-muted-foreground font-normal">bus-mapping 크레이트: EVM 실행 트레이스 → 회로 입력 변환</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-3">
              <p className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">assign에서 실제 값 기입</p>
              <ul className="space-y-1 text-foreground/80">
                <li><code className="text-xs">a = block.get_rws(step, 0).stack_value()</code></li>
                <li><code className="text-xs">b = block.get_rws(step, 1).stack_value()</code></li>
                <li><code className="text-xs">c = a.overflowing_add(b).0</code></li>
                <li><code className="text-xs">add_words.assign(region, offset, [a, b], c)</code></li>
              </ul>
            </div>
            <div className="rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3">
              <p className="font-semibold text-amber-700 dark:text-amber-300 mb-1">전체 파이프라인</p>
              <ol className="space-y-1 text-foreground/80 list-decimal list-inside">
                <li>bus-mapping으로 EVM 트레이스 재실행 → <code className="text-xs">Block</code> 생성</li>
                <li><code className="text-xs">EvmCircuit::synthesize(&block)</code> → 어드바이스 열 할당</li>
                <li><code className="text-xs">create_proof()</code> → KZG 커밋 + SHPLONK 개구 증명</li>
                <li>모든 서브회로 증명을 집계(aggregation)하여 온체인 검증</li>
              </ol>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Gadget Pattern -- DRY for 140+ Opcodes</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-4">
            <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-2">1) Common constraints 추상화</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>PC increment</li>
              <li>Stack push/pop</li>
              <li>Gas consumption</li>
              <li>Memory access</li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">2) Reusable gadgets</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code className="text-xs">AddWordsGadget</code> — 256-bit 덧셈</li>
              <li><code className="text-xs">CmpGadget</code> — 비교 연산</li>
              <li><code className="text-xs">RangeCheck</code> — 값 범위 검증</li>
              <li><code className="text-xs">LookupGadget</code> — table lookup</li>
            </ul>
          </div>
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">3) Opcode-specific gadget</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code className="text-xs">AddGadget</code> — AddWordsGadget 재사용</li>
              <li><code className="text-xs">SubGadget</code> — AddGadget 역연산</li>
              <li><code className="text-xs">MulGadget</code> — AddWordsGadget 반복</li>
            </ul>
          </div>
        </div>
        <div className="not-prose rounded-lg border border-border bg-muted/30 p-4 mb-6">
          <p className="text-sm font-semibold mb-2">ADD (opcode 0x01) 예시</p>
          <p className="text-sm text-foreground/80 mb-2">Pop x, y → Push x+y → PC+=1 → gas-=3 — 모든 step이 common gadget으로 구성</p>
          <div className="grid grid-cols-3 gap-3 text-sm text-center">
            <div className="rounded bg-emerald-100 dark:bg-emerald-900/30 p-2">
              <p className="font-semibold">코드 중복</p>
              <p className="text-foreground/80">1/10로 감소</p>
            </div>
            <div className="rounded bg-emerald-100 dark:bg-emerald-900/30 p-2">
              <p className="font-semibold">버그 수정</p>
              <p className="text-foreground/80">gadget 레벨에서 fix → 전파</p>
            </div>
            <div className="rounded bg-emerald-100 dark:bg-emerald-900/30 p-2">
              <p className="font-semibold">확장성</p>
              <p className="text-foreground/80">기존 gadget 조합으로 새 opcode</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: configure vs assign 분리</p>
          <p>
            <strong>configure (compile-time)</strong>: 제약식 등록, 회로 구조 정의<br />
            <strong>assign (runtime)</strong>: 실제 witness 값 할당, 증명 생성<br />
            둘을 분리하는 이유: 회로 자체는 한 번만 구성 → prove 반복 시 재사용
          </p>
        </div>

      </div>
    </section>
  );
}
