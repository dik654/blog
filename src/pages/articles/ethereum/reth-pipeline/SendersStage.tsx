import { useState } from 'react';
import { motion } from 'framer-motion';
import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import SendersDetailViz from './viz/SendersDetailViz';
import { SENDER_FACTS } from './SendersStageData';

export default function SendersStage({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeFact, setActiveFact] = useState(0);

  return (
    <section id="senders-stage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SendersStage 추적</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          이더리움 TX에는 <code>sender</code> 필드가 없다.<br />
          발신자 주소는 ECDSA 서명 <code>(v, r, s)</code>에서 <strong>ecrecover</strong>(타원곡선 서명 복구 함수)로 역산해야 한다.<br />
          이 과정에서 secp256k1 곡선 연산이 필요하므로 CPU 집약적이다.
        </p>

        {/* ── 서명 복구 원리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ECDSA 서명 복구 — secp256k1 수학</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-indigo-500 mb-2">Signature 구조 <span className="font-normal text-foreground/50">(EIP-155 이후)</span></p>
            <div className="grid grid-cols-1 gap-1.5 text-sm">
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">v: u8</code>
                <span className="text-foreground/60 text-xs">recovery id (0 or 1) + chain_id 혼합</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">r: U256</code>
                <span className="text-foreground/60 text-xs">서명 x좌표 (mod n)</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">s: U256</code>
                <span className="text-foreground/60 text-xs">서명 값 (mod n)</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">ecrecover 알고리즘 (RFC 6979)</p>
            <ol className="list-decimal list-inside space-y-1.5 text-sm text-foreground/70">
              <li><code>r, s</code>가 curve order <code>n</code> 범위 내인지 검증</li>
              <li><code>r</code>에서 곡선 위의 점 <code>R</code> 복원 (<code>v</code>의 recovery id로 y좌표 결정)</li>
              <li>공개키 계산: <code>Q = r^(-1) * (s*R - z*G)</code> -- z = msg_hash, G = secp256k1 생성자</li>
            </ol>
            <div className="mt-2 pt-2 border-t border-border/30">
              <p className="text-xs text-foreground/50">주소 변환: <code>keccak256(pubkey_x || pubkey_y)</code>의 하위 20바이트</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>ecrecover</code>는 이더리움에서 가장 비싼 연산 중 하나다.<br />
          secp256k1 곡선의 스칼라 곱셈(scalar multiplication)이 포함되어 TX 1개당 약 50~100 마이크로초 소요.<br />
          블록당 평균 150 TX × 1,800만 블록 = 약 27억 TX — 순차로 돌리면 수 시간 이상.
        </p>

        {/* ── rayon 병렬화 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">rayon par_iter — 완벽한 병렬화</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">SendersStage 핵심: <code>transactions.par_iter().map(recover_signer).collect()</code></p>
            <p className="text-sm text-foreground/70"><code>rayon</code> 병렬 iterator로 모든 TX의 <code>ecrecover</code>를 동시 실행, 결과를 <code>Vec&lt;Address&gt;</code>로 수집</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-foreground/60 mb-2">par_iter() 동작 원리</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-foreground/70">
              <li>transactions 슬라이스를 N개 청크로 분할 (N = 코어 수)</li>
              <li>각 스레드가 work-stealing 스케줄러로 청크 소비</li>
              <li>완료한 스레드가 다른 스레드의 남은 작업을 훔침 (load balancing)</li>
              <li><code>collect()</code>가 순서 보존해서 <code>Vec&lt;Address&gt;</code>로 합침</li>
            </ol>
            <div className="mt-2 pt-2 border-t border-border/30 text-xs text-foreground/50">
              병렬화 효율 약 100%: 각 ecrecover가 완전 독립 / 캐시 미스 균일 / Address는 20바이트 고정
            </div>
          </div>
        </div>
        <p className="leading-7">
          rayon의 work-stealing 스케줄러가 CPU 코어를 거의 100% 활용한다.<br />
          16코어 머신에서 10만 TX를 처리하면 순차 대비 14~15배 빠르다. (이상적 선형 가속 = 16배)<br />
          0.5~1배의 오버헤드는 스레드 생성, work-stealing 큐 동기화 비용.
        </p>

        {/* ── Geth 대비 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Geth 대비 — 중복 제거 효과</h3>
        <div className="not-prose my-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-3">Geth vs Reth ecrecover 비교</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded border border-border/40 p-3">
              <p className="text-xs font-semibold text-foreground/60 mb-1.5">Geth 흐름</p>
              <ol className="list-decimal list-inside space-y-1 text-xs text-foreground/60">
                <li>TX 풀 입장 시 <code>types.Sender()</code> -- 1차 호출</li>
                <li>블록 검증 시 -- 2차 호출 (캐시 히트 가능)</li>
                <li>EVM 실행 시 -- 이미 복구된 값 재사용</li>
              </ol>
              <p className="text-xs text-foreground/40 mt-1.5">순차 + 블록 단위 &rarr; 수 시간</p>
            </div>
            <div className="rounded border border-emerald-400/40 bg-emerald-50/20 dark:bg-emerald-950/10 p-3">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5">Reth 흐름</p>
              <ol className="list-decimal list-inside space-y-1 text-xs text-foreground/70">
                <li>SendersStage: <code>par_iter</code>로 한 번에 전부 복구 &rarr; DB 저장</li>
                <li>ExecutionStage: DB에서 sender 조회 (ecrecover 없음)</li>
              </ol>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1.5">병렬 + DB 캐싱 &rarr; 수 분</p>
            </div>
          </div>
          <p className="text-xs text-foreground/50 mt-2">총 호출 수는 동일 (27억 TX), 병렬화와 I/O 패턴 차이가 수십 배 속도 차이를 만듦</p>
        </div>
        <p className="leading-7">
          Geth도 TX 풀에 캐시가 있어 중복 복구를 줄이지만, 실행 경로가 TX마다 분산되어 병렬화가 어렵다.<br />
          Reth는 <strong>Stage 단위로 작업을 묶어서 한 번에 병렬 처리</strong>하므로 ecrecover 호출 자체는 같아도 처리 시간이 수십 배 빠르다.
        </p>

        {/* ── DB 저장 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TxSenders 테이블 — ExecutionStage의 입력</h3>
        <div className="not-prose my-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">DB 저장 — <code>provider.insert_transaction_senders(start, hashes, senders)</code></p>
          <div className="space-y-1.5 text-sm text-foreground/70 ml-2">
            <p><code>TxSenders</code> 테이블: Key = <code>TxNumber (u64)</code>, Val = <code>Address (20바이트)</code></p>
          </div>
          <div className="mt-2 pt-2 border-t border-border/30 text-xs text-foreground/50">
            <p>글로벌 TX 번호로 인덱싱 &rarr; BodiesStage Transactions 테이블과 동일 키 공간</p>
            <p>ExecutionStage가 TX 로드 시 같은 TxNumber로 sender 조회 &rarr; MDBX 순차 읽기로 매우 빠름</p>
          </div>
        </div>
        <p className="leading-7">
          TxSenders와 Transactions 테이블이 <strong>같은 키 공간(TxNumber)</strong>을 공유하는 것이 핵심 설계.<br />
          ExecutionStage는 한 블록의 TX N개를 로드할 때, 같은 범위에서 Transactions와 TxSenders를 병렬 스캔한다.<br />
          MDBX는 mmap 기반이라 두 테이블의 순차 스캔이 페이지 캐시 레벨에서 거의 무료로 처리된다.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 성능 수치: 병렬화 효과 측정</p>
          <p className="mt-2">
            경험적 수치(16코어 AMD Ryzen, 메인넷 동기화 중 측정):<br />
            - TX당 ecrecover: ~60 마이크로초 (단일 스레드)<br />
            - par_iter 기본 throughput: ~15만 TX/초 (16코어)<br />
            - 100만 TX 처리: 약 6.7초<br />
            - 1,800만 블록 × 평균 150 TX = 27억 TX → 약 5시간
          </p>
          <p className="mt-2">
            SendersStage만 5시간? 많아 보이지만:<br />
            - 이는 전체 초기 동기화 시간의 ~20% 수준<br />
            - Geth는 같은 일을 약 30~50시간 소요 (실행과 섞여 병렬화 불가)<br />
            - Reth는 Stage 단위 분리 덕분에 CPU 자원을 다른 Stage와 겹치지 않고 온전히 사용
          </p>
        </div>
      </div>

      <div className="not-prose mb-6"><SendersDetailViz /></div>

      {/* Fact cards */}
      <h3 className="text-lg font-semibold mb-3">핵심 수치</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {SENDER_FACTS.map((f, i) => (
          <motion.div key={i} onClick={() => setActiveFact(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeFact ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeFact ? 1 : 0.7 }}>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs text-foreground/60">{f.label}</span>
              <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">{f.value}</span>
            </div>
            {i === activeFact && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-sm text-foreground/70 leading-relaxed mt-2">{f.desc}</motion.p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('senders-stage', codeRefs['senders-stage'])} />
        <span className="text-[10px] text-muted-foreground self-center">SendersStage::execute()</span>
      </div>
    </section>
  );
}
