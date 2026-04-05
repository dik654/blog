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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// AccountChangeSets: 계정 변경 이력
// Key: BlockNumber
// Value: (Address, 이전 AccountInfo)
//
// 블록 N에서 계정 A가 변경되었다면:
//   AccountChangeSets[N] = (A, 블록 N 실행 전 상태)
//
// 읽는 방법:
// 1. 블록 N 실행 전 계정 A 상태 복원하려면:
//    AccountChangeSets[N] 조회 → 이전 값 확인
// 2. 블록 N-1 실행 전 상태는:
//    AccountChangeSets[N-1], [N-2], ... 순차 역추적

// StorageChangeSets (DupSort): 스토리지 변경 이력
// Key: (BlockNumber, Address)
// Value: (StorageKey, 이전 StorageValue)
//
// 같은 키에 여러 엔트리 가능 (DupSort)
// 같은 블록에서 같은 계정의 여러 슬롯 변경 시

// 예시:
// 블록 100에서 계정 A의 balance 변경: 10 → 50
// 블록 100에서 계정 A의 스토리지[0x01] 변경: 0 → 100
//
// AccountChangeSets[100] = (A, Account { balance: 10, ... })
// StorageChangeSets[(100, A)] = [(0x01, 0)]

// 저장 크기 비교 (메인넷):
// archive 모드 (Geth): 전체 상태 트리 스냅샷 × 블록 수 → 수 TB
// ChangeSet 방식 (Reth): 변경분만 → 수백 GB
// 대략 5~10배 절약`}
        </pre>
        <p className="leading-7">
          ChangeSets 테이블이 <strong>시간역행 복원 엔진</strong>.<br />
          "이 블록 직전 상태는 무엇이었나"를 블록별로 기록 — 역순 적용으로 과거 재구성.<br />
          archive 모드의 전체 스냅샷 저장 방식 대비 5~10배 디스크 절약.
        </p>

        {/* ── 복원 알고리즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HistoricalStateProvider::account() — 역추적</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`impl<TX: DbTx> StateProvider for HistoricalStateProviderRef<'_, TX> {
    fn account(&self, addr: &Address) -> Result<Option<Account>> {
        let target_block = self.block_number;

        // 1. 현재 상태 로드 (tip 시점)
        let mut current = self.tx.get::<PlainAccountState>(*addr)?;

        // 2. AccountHistory 인덱스로 변경이 있었던 블록 찾기
        //    AccountHistory: Address → BlockNumber list (역인덱스)
        let history_entry = self.tx
            .get::<AccountHistory>(*addr)?
            .unwrap_or_default();

        // 3. target_block 이후 변경들 역적용
        for &changed_block in history_entry.iter().rev() {
            if changed_block <= target_block {
                break;  // target 이전 변경은 건너뜀
            }

            // AccountChangeSets에서 이전 값 로드
            let previous = self.tx
                .get::<AccountChangeSets>(changed_block)?
                .into_iter()
                .find(|(a, _)| *a == *addr)
                .map(|(_, info)| info);

            // 현재 상태를 이전 상태로 되돌림
            current = previous;
        }

        // 4. 최종 결과: target_block 시점의 계정 상태
        Ok(current)
    }
}

// 성능 특성:
// - 최근 블록 조회 (tip-1000): 1000회 이하 역추적 → 빠름
// - 1년 전 조회 (~260만 블록 역추적): 수 초 소요
// - 1년 이상은 현실적으로 거의 사용 안 됨`}
        </pre>
        <p className="leading-7">
          역추적 알고리즘: <strong>현재 → 과거 방향으로 ChangeSet 역적용</strong>.<br />
          <code>AccountHistory</code> 인덱스로 해당 계정의 변경 블록만 빠르게 찾음 (O(log n)).<br />
          target_block에 도달하면 즉시 종료 — 불필요한 역추적 방지.
        </p>

        {/* ── AccountHistory 인덱스 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">AccountHistory — 변경 블록 역인덱스</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// AccountHistory 테이블
// Key: Address
// Value: Vec<BlockNumber> (오름차순 정렬)
//
// 계정 A가 블록 100, 150, 200, 300에서 변경되었다면:
// AccountHistory[A] = [100, 150, 200, 300]

// 사용 시나리오:
// "블록 180 시점 계정 A의 상태는?"
//
// 1. AccountHistory[A] 로드 → [100, 150, 200, 300]
// 2. 180 이후 변경 블록 찾기: [200, 300]
// 3. [300, 200] 순서로 역적용
//    - AccountChangeSets[300].get(A) → 블록 300 이전 상태 = 블록 200 이후 상태
//    - AccountChangeSets[200].get(A) → 블록 200 이전 상태 = 블록 180~199 상태
// 4. 결과: 블록 180 시점 상태

// HistoryIndex Stage:
// - ExecutionStage 이후 실행
// - AccountChangeSets 스캔 → AccountHistory 구성
// - 스토리지는 StorageHistory에 동일 패턴

// 메모리 효율:
// - 메인넷 ~2.5억 계정
// - 평균 변경 빈도: 계정당 ~3회
// - AccountHistory 크기: ~7.5억 entries ≈ 20GB`}
        </pre>
        <p className="leading-7">
          <code>AccountHistory</code>가 <strong>"이 계정이 언제 변경되었나"</strong>의 역인덱스.<br />
          전체 블록을 스캔할 필요 없이 관련 블록만 직접 접근.<br />
          HistoryIndex Stage가 별도로 이 인덱스를 구축 (ExecutionStage 이후).
        </p>

        {/* ── 트레이드오프 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Archive vs ChangeSet — 트레이드오프</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 두 방식 비교 (메인넷, 1800만 블록)

// ┌─────────────────┬──────────────┬──────────────┐
// │ 항목            │ Geth archive │ Reth ChangeSet│
// ├─────────────────┼──────────────┼──────────────┤
// │ 디스크 사용     │ ~12 TB       │ ~2.5 TB      │
// │ 최신 조회       │ O(1) trie    │ O(1) plain   │
// │ 과거 조회 (1일전)│ O(1)        │ ~수백 ms     │
// │ 과거 조회 (1년전)│ O(1)        │ ~수 초       │
// │ reorg 지원      │ 복잡         │ 내장         │
// │ 스토리지 팽창율 │ 연간 ~2TB    │ 연간 ~400GB  │
// └─────────────────┴──────────────┴──────────────┘

// Reth 방식의 이점:
// - 디스크 5배 절약
// - SSD 쓰기량 감소 (수명 연장)
// - 점진적 팽창 (미래 지속 가능)

// Reth 방식의 비용:
// - 과거 조회 시 지연 (수백 ms ~ 수 초)
// - RPC 제공자 입장에서 latency SLA 관리 필요

// 실용적 선택:
// - 대부분의 RPC 요청은 최근 블록 (~99% 최근 1주)
// - 과거 조회는 특수 목적 (분석, 감사) → 지연 허용`}
        </pre>
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
