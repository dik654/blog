import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HistoricalViz from './viz/HistoricalViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { CHANGESET_STEPS } from './HistoricalData';

export default function Historical({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [step, setStep] = useState(0);

  return (
    <section id="historical" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HistoricalStateProvider</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>eth_call</code>에 과거 블록 번호를 지정하면 그 시점의 상태가 필요하다.<br />
          Geth는 이를 위해 archive 모드(모든 블록의 전체 상태를 보존하는 모드)를 사용한다.<br />
          디스크 사용량이 수 TB에 달하는 이유다.
        </p>
        <p className="leading-7">
          Reth는 다른 접근을 취한다.<br />
          <strong>현재 상태 + ChangeSet 역추적</strong>으로 과거 상태를 복원한다.<br />
          ChangeSet은 "블록 실행 시 변경된 값의 이전 상태"를 기록한 테이블이다.<br />
          현재 값에서 변경 이력을 거꾸로 적용하면 원하는 시점의 상태를 재구성할 수 있다.
        </p>
        <p className="leading-7">
          archive 모드 대비 디스크 사용량이 크게 줄어든다.<br />
          전체 상태 스냅샷 대신 변경분(delta)만 저장하기 때문이다.<br />
          단, 매우 오래된 블록을 조회하면 역추적 횟수가 많아져 느려질 수 있다.
        </p>

        {/* ── ChangeSet 테이블 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ChangeSet 테이블 스키마</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="font-semibold text-sm text-sky-400 mb-2">AccountChangeSets</p>
              <p className="text-xs text-foreground/70">Key: <code>BlockNumber</code> → Value: <code>(Address, 이전 AccountInfo)</code></p>
              <p className="text-xs text-foreground/60 mt-2">블록 N에서 계정 A 변경 시:</p>
              <p className="text-xs font-mono text-foreground/50 mt-0.5">ChangeSets[N] = (A, 실행 전 상태)</p>
              <p className="text-xs text-muted-foreground mt-1">복원: N, N-1, N-2... 순차 역추적</p>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">StorageChangeSets <span className="text-[10px] px-1 py-0.5 rounded bg-amber-500/10">DupSort</span></p>
              <p className="text-xs text-foreground/70">Key: <code>(BlockNumber, Address)</code> → Value: <code>(StorageKey, 이전 Value)</code></p>
              <p className="text-xs text-foreground/60 mt-2">같은 블록+계정의 여러 슬롯 변경 가능</p>
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">예시: 블록 100에서 계정 A 변경</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="rounded bg-muted/50 p-2">
                <p className="text-foreground/60">balance 변경: 10 → 50</p>
                <p className="font-mono text-foreground/50">AccountChangeSets[100] = (A, &#123;balance: 10&#125;)</p>
              </div>
              <div className="rounded bg-muted/50 p-2">
                <p className="text-foreground/60">스토리지[0x01] 변경: 0 → 100</p>
                <p className="font-mono text-foreground/50">StorageChangeSets[(100, A)] = [(0x01, 0)]</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-center">
              <p className="text-xs font-semibold text-red-400">Geth archive</p>
              <p className="text-xs text-foreground/60">전체 상태 스냅샷 x 블록 수 → 수 TB</p>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
              <p className="text-xs font-semibold text-emerald-400">Reth ChangeSet</p>
              <p className="text-xs text-foreground/60">변경분만 → 수백 GB (5~10배 절약)</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          ChangeSets 테이블이 <strong>시간역행 복원 엔진</strong>.<br />
          "이 블록 직전 상태는 무엇이었나"를 블록별로 기록 — 역순 적용으로 과거 재구성.<br />
          archive 모드의 전체 스냅샷 저장 방식 대비 5~10배 디스크 절약.
        </p>

        {/* ── 복원 알고리즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HistoricalStateProvider::account() — 역추적</h3>
        <div className="my-4 not-prose">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-3"><code>HistoricalStateProviderRef::account()</code> — 역추적 알고리즘</p>
            <div className="space-y-3">
              {[
                { step: '1', title: '현재 상태 로드', detail: 'PlainAccountState에서 tip 시점 값 가져오기', color: 'text-sky-400' },
                { step: '2', title: 'AccountHistory 인덱스 조회', detail: 'Address → BlockNumber list (역인덱스)로 변경 블록 찾기', color: 'text-emerald-400' },
                { step: '3', title: 'target 이후 변경 역적용', detail: '변경 블록 역순 순회 → AccountChangeSets에서 이전 값 → 현재 상태 되돌림', color: 'text-amber-400' },
                { step: '4', title: '최종 결과 반환', detail: 'target_block 시점 계정 상태', color: 'text-indigo-400' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-muted shrink-0 ${s.color}`}>{s.step}</span>
                  <div>
                    <p className="text-sm font-semibold">{s.title}</p>
                    <p className="text-xs text-foreground/60">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-border grid grid-cols-3 gap-2 text-xs">
              <div className="rounded bg-muted/50 p-2 text-center">
                <p className="font-semibold text-emerald-400">최근 1000블록</p>
                <p className="text-foreground/60">빠름</p>
              </div>
              <div className="rounded bg-muted/50 p-2 text-center">
                <p className="font-semibold text-amber-400">1년 전 (~260만)</p>
                <p className="text-foreground/60">수 초 소요</p>
              </div>
              <div className="rounded bg-muted/50 p-2 text-center">
                <p className="font-semibold text-muted-foreground">1년 이상</p>
                <p className="text-foreground/60">거의 사용 안 됨</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          역추적 알고리즘: <strong>현재 → 과거 방향으로 ChangeSet 역적용</strong>.<br />
          <code>AccountHistory</code> 인덱스로 해당 계정의 변경 블록만 빠르게 찾음 (O(log n)).<br />
          target_block에 도달하면 즉시 종료 — 불필요한 역추적 방지.
        </p>

        {/* ── AccountHistory 인덱스 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">AccountHistory — 변경 블록 역인덱스</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">AccountHistory 테이블</p>
            <p className="text-xs text-foreground/70">Key: <code>Address</code> → Value: <code>Vec&lt;BlockNumber&gt;</code> (오름차순)</p>
            <p className="text-xs font-mono text-foreground/50 mt-1">AccountHistory[A] = [100, 150, 200, 300]</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">시나리오: "블록 180 시점 계정 A?"</p>
            <div className="space-y-2">
              {[
                { step: '1', text: 'AccountHistory[A] → [100, 150, 200, 300]' },
                { step: '2', text: '180 이후 변경 블록: [200, 300]' },
                { step: '3', text: '[300, 200] 역적용 → ChangeSets에서 이전 값 로드' },
                { step: '4', text: '결과: 블록 180 시점 상태' },
              ].map(s => (
                <div key={s.step} className="flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center bg-muted text-muted-foreground font-bold shrink-0">{s.step}</span>
                  <span className="text-foreground/70">{s.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1">HistoryIndex Stage</p>
              <p className="text-xs text-foreground/60">ExecutionStage 이후 실행</p>
              <p className="text-xs text-foreground/60">AccountChangeSets 스캔 → AccountHistory 구성</p>
              <p className="text-xs text-foreground/60">StorageHistory도 동일 패턴</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1">메모리 효율 (메인넷)</p>
              <p className="text-xs text-foreground/60">~2.5억 계정 x 평균 3회 변경</p>
              <p className="text-xs text-foreground/60">~7.5억 entries ≈ 20GB</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>AccountHistory</code>가 <strong>"이 계정이 언제 변경되었나"</strong>의 역인덱스.<br />
          전체 블록을 스캔할 필요 없이 관련 블록만 직접 접근.<br />
          HistoryIndex Stage가 별도로 이 인덱스를 구축 (ExecutionStage 이후).
        </p>

        {/* ── 트레이드오프 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Archive vs ChangeSet — 트레이드오프</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">메인넷 비교 (1800만 블록)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border">
                  <th className="text-left py-1 pr-3 font-semibold">항목</th>
                  <th className="text-right py-1 px-3 font-semibold text-red-400">Geth archive</th>
                  <th className="text-right py-1 pl-3 font-semibold text-emerald-400">Reth ChangeSet</th>
                </tr></thead>
                <tbody className="text-foreground/70">
                  <tr className="border-b border-border/50"><td className="py-1.5 pr-3">디스크 사용</td><td className="text-right px-3 text-red-400">~12 TB</td><td className="text-right pl-3 text-emerald-400">~2.5 TB</td></tr>
                  <tr className="border-b border-border/50"><td className="py-1.5 pr-3">최신 조회</td><td className="text-right px-3">O(1) trie</td><td className="text-right pl-3">O(1) plain</td></tr>
                  <tr className="border-b border-border/50"><td className="py-1.5 pr-3">과거 조회 (1일 전)</td><td className="text-right px-3">O(1)</td><td className="text-right pl-3">~수백 ms</td></tr>
                  <tr className="border-b border-border/50"><td className="py-1.5 pr-3">과거 조회 (1년 전)</td><td className="text-right px-3">O(1)</td><td className="text-right pl-3">~수 초</td></tr>
                  <tr className="border-b border-border/50"><td className="py-1.5 pr-3">reorg 지원</td><td className="text-right px-3">복잡</td><td className="text-right pl-3 text-emerald-400">내장</td></tr>
                  <tr><td className="py-1.5 pr-3">연간 팽창률</td><td className="text-right px-3 text-red-400">~2 TB</td><td className="text-right pl-3 text-emerald-400">~400 GB</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="text-xs font-semibold text-emerald-400 mb-1">Reth 이점</p>
              <p className="text-xs text-foreground/60">디스크 5배 절약, SSD 수명 연장, 점진적 팽창</p>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="text-xs font-semibold text-amber-400 mb-1">Reth 비용</p>
              <p className="text-xs text-foreground/60">과거 조회 지연 (수백 ms~수 초) — 99% 요청이 최근 블록이므로 실질 영향 적음</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>디스크 vs 조회 속도</strong>의 고전적 트레이드오프.<br />
          Reth는 디스크 5배 절약 + 오래된 쿼리 느려짐 → 대부분 워크로드에 유리.<br />
          RPC의 99% 요청이 최근 블록이므로 지연은 실질적 영향 적음.
        </p>
      </div>

      {/* ChangeSet 역추적 과정 */}
      <h3 className="text-lg font-semibold mb-3">ChangeSet 역추적 과정</h3>
      <div className="space-y-2 mb-8">
        {CHANGESET_STEPS.map((s, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === step ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === step ? s.color : 'var(--muted)', color: i === step ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>Geth archive vs Reth ChangeSet</strong> — Geth archive는 모든 블록의 전체 상태 트리를 보존한다.<br />
          디스크 수 TB.
          <br />
          Reth는 변경분만 저장하고 역추적으로 복원한다.<br />
          디스크 절약 + 동일 기능. 단, 역추적 깊이가 깊으면 조회가 느려진다.
        </p>
      </div>

      <div className="not-prose">
        <HistoricalViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
