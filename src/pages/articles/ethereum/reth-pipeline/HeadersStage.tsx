import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import HeadersDetailViz from './viz/HeadersDetailViz';
import { HEADER_STEPS } from './HeadersStageData';

export default function HeadersStage({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [step, setStep] = useState(0);

  return (
    <section id="headers-stage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HeadersStage 추적</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 헤더를 먼저 다운로드하는가?</strong><br />
          블록 헤더는 약 508바이트 고정 크기다. 바디(TX 목록)는 수십~수백KB에 달한다.<br />
          헤더만으로 부모-자식 해시 체인을 검증할 수 있으므로, 먼저 헤더를 받아 체인 구조를 파악한 뒤 바디를 선택적으로 요청한다.<br />
          대역폭을 크게 절약하는 설계다.
        </p>

        {/* ── 헤더 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">블록 헤더의 필드 구성</h3>
        <div className="not-prose my-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-semibold text-indigo-500 mb-3">Header 구조체 <span className="font-normal text-foreground/50">(약 508바이트, Cancun 기준)</span></p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            <div className="flex items-start gap-2">
              <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">parent_hash</code>
              <span className="text-foreground/60 text-xs">B256 -- 부모 블록 keccak256 (체인 연결)</span>
            </div>
            <div className="flex items-start gap-2">
              <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">state_root</code>
              <span className="text-foreground/60 text-xs">B256 -- 실행 후 상태 머클 루트 (MerkleStage 대상)</span>
            </div>
            <div className="flex items-start gap-2">
              <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">transactions_root</code>
              <span className="text-foreground/60 text-xs">B256 -- TX 머클 루트 (BodiesStage 대상)</span>
            </div>
            <div className="flex items-start gap-2">
              <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">receipts_root</code>
              <span className="text-foreground/60 text-xs">B256 -- 영수증 머클 루트 (ExecutionStage 생성)</span>
            </div>
            <div className="flex items-start gap-2">
              <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">beneficiary</code>
              <span className="text-foreground/60 text-xs">Address -- coinbase 주소</span>
            </div>
            <div className="flex items-start gap-2">
              <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">number</code>
              <span className="text-foreground/60 text-xs">BlockNumber -- 블록 높이</span>
            </div>
            <div className="flex items-start gap-2">
              <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">gas_limit / gas_used</code>
              <span className="text-foreground/60 text-xs">u64 -- 최대/실제 가스</span>
            </div>
            <div className="flex items-start gap-2">
              <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">timestamp</code>
              <span className="text-foreground/60 text-xs">u64 -- Unix 초</span>
            </div>
            <div className="flex items-start gap-2">
              <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">base_fee_per_gas</code>
              <span className="text-foreground/60 text-xs">Option&lt;u64&gt; -- EIP-1559</span>
            </div>
            <div className="flex items-start gap-2">
              <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">mix_hash</code>
              <span className="text-foreground/60 text-xs">B256 -- PoS 이후 PREVRANDAO</span>
            </div>
            <div className="flex items-start gap-2">
              <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">withdrawals_root</code>
              <span className="text-foreground/60 text-xs">Option&lt;B256&gt; -- Shanghai 포크</span>
            </div>
            <div className="flex items-start gap-2">
              <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">blob_gas_used / excess</code>
              <span className="text-foreground/60 text-xs">Option&lt;u64&gt; -- EIP-4844</span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>parent_hash</code>가 체인을 선형으로 이어붙이는 유일한 링크다.<br />
          헤더 N개만 있으면 창세기부터 tip까지의 전체 해시 체인을 검증할 수 있다.<br />
          바디는 <code>transactions_root</code>를 통해 "정답 해시"에 묶여 있으므로, 나중에 받아도 위조 여부를 판별할 수 있다.
        </p>

        {/* ── devp2p 프로토콜 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">devp2p/eth 프로토콜 — GetBlockHeaders 요청</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-indigo-500 mb-2">GetBlockHeaders <span className="font-normal text-foreground/50">(eth/68 와이어 프로토콜)</span></p>
            <div className="grid grid-cols-1 gap-1.5 text-sm">
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">request_id</code>
                <span className="text-foreground/60 text-xs">u64 -- 응답 매칭용 고유 ID</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">origin</code>
                <span className="text-foreground/60 text-xs">HashOrNumber -- 시작점 (블록 해시 or 번호)</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">amount</code>
                <span className="text-foreground/60 text-xs">u64 -- 요청 개수 (최대 1024)</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">skip</code>
                <span className="text-foreground/60 text-xs">u64 -- 건너뛸 블록 수 (0 = 연속)</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">reverse</code>
                <span className="text-foreground/60 text-xs">bool -- true면 역순 다운로드</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">HeaderDownloader 동작</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-foreground/70">
              <li>여러 피어에 <code>GetBlockHeaders</code>를 동시 발송 (round-robin)</li>
              <li>응답이 오는 대로 <code>Stream&lt;Item=Header&gt;</code>로 방출</li>
              <li>느린 피어는 timeout &rarr; 다른 피어에게 재시도</li>
              <li>검증 실패 피어는 즉시 ban (reputation 시스템)</li>
            </ol>
          </div>
        </div>
        <p className="leading-7">
          <code>reverse=true</code>는 초기 동기화 시 유용하다.<br />
          CL이 알려준 tip 해시에서 역방향으로 헤더를 받으면, 이미 가진 블록까지 도달할 때 자연스럽게 스트림이 끝난다.<br />
          <code>skip</code>은 스캐터(scatter) 다운로드용 — 건너뛴 헤더로 범위를 빠르게 샘플링할 수 있다.
        </p>

        {/* ── 검증 로직 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">헤더 검증 로직 — validate_header_against_parent</h3>
        <div className="not-prose my-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-semibold text-pink-500 mb-3">validate_header_against_parent() — 6가지 검증</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <span className="text-foreground/70">블록 번호 연속성: <code>number == parent.number + 1</code></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">2</span>
              <span className="text-foreground/70"><code>parent_hash</code> 일치: 이전 블록의 <code>keccak256</code>과 동일</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <span className="text-foreground/70">타임스탬프 단조 증가: <code>timestamp &gt; parent.timestamp</code></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">4</span>
              <span className="text-foreground/70"><code>gas_limit</code> 변동 제한: 이전 값의 1/1024 이내</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">5</span>
              <span className="text-foreground/70">EIP-1559 <code>base_fee</code> 계산 검증 (런던 포크 이후)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">6</span>
              <span className="text-foreground/70"><code>extra_data</code> 크기 &le; 32바이트</span>
            </div>
          </div>
          <p className="text-xs text-foreground/50 mt-3">실패 시 <code>ConsensusError</code> 반환 &rarr; 해당 피어 즉시 ban</p>
        </div>
        <p className="leading-7">
          이 6가지 검증만 통과하면 헤더는 "이 체인에 연결 가능한 후보"가 된다.<br />
          PoS 이후 PoW 관련 필드(difficulty, nonce, mix_hash)는 Engine API 레이어에서 따로 검증한다.<br />
          검증 실패 시 해당 피어는 즉시 ban — 악의적 피어는 더 이상 헤더를 요청받지 않는다.
        </p>

        {/* ── 배치 삽입 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">배치 삽입 & 체크포인트</h3>
        <p className="leading-7">
          MDBX 트랜잭션으로 배치 삽입한다.<br />
          commit_threshold(기본 10,000) 단위로 묶어서 한 번에 기록하므로, 블록마다 I/O를 발생시키지 않는다.
        </p>
        <div className="not-prose my-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">DB 삽입 — <code>provider.insert_headers(batch)</code></p>
          <div className="space-y-1.5 text-sm text-foreground/70 ml-2">
            <p><code>Headers</code> 테이블: <code>BlockNumber &rarr; Header</code> (RLP 직렬화)</p>
            <p><code>HeaderNumbers</code> 테이블: <code>B256(블록 해시) &rarr; BlockNumber</code> (역조회)</p>
            <p><code>CanonicalHeaders</code> 테이블: <code>BlockNumber &rarr; B256</code> (canonical chain 표시)</p>
          </div>
          <div className="mt-3 pt-2 border-t border-border/30 text-xs text-foreground/50">
            체크포인트: <code>ExecOutput {'{'} checkpoint: StageCheckpoint::new(end), done: true {'}'}</code>
          </div>
        </div>
        <p className="leading-7">
          3개 테이블에 동시 삽입하는 이유: 쿼리 패턴이 다르기 때문이다.<br />
          - 번호 → 헤더: Headers 테이블 (BodiesStage가 순차 스캔)<br />
          - 해시 → 번호: HeaderNumbers 테이블 (RPC eth_getBlockByHash)<br />
          - canonical 표시: CanonicalHeaders 테이블 (reorg 시 non-canonical 구분)
        </p>
      </div>

      <div className="not-prose mb-6"><HeadersDetailViz /></div>

      {/* Step-by-step interactive cards */}
      <h3 className="text-lg font-semibold mb-3">실행 흐름</h3>
      <div className="not-prose space-y-2 mb-6">
        {HEADER_STEPS.map((s, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === step ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? 'bg-indigo-500 text-white' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10 leading-relaxed">{s.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('headers-stage', codeRefs['headers-stage'])} />
        <span className="text-[10px] text-muted-foreground self-center">HeadersStage::execute()</span>
      </div>
    </section>
  );
}
