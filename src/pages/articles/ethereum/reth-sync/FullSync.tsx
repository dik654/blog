import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { PIPELINE_STAGES } from './FullSyncData';

export default function FullSync({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const sel = PIPELINE_STAGES.find(s => s.id === activeStage);

  return (
    <section id="full-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Full Pipeline 동기화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('sync-pipeline', codeRefs['sync-pipeline'])} />
          <span className="text-[10px] text-muted-foreground self-center">Pipeline 전체</span>
        </div>
        <p className="leading-7">
          Full Sync는 <strong>Pipeline</strong>에 등록된 Stage들을 순서대로 실행한다.<br />
          각 Stage가 target(tip) 블록까지 처리를 완료하면 다음 Stage로 넘어간다.<br />
          모든 Stage가 완료되면 한 사이클이 끝나고, 새 tip이 있으면 다시 반복한다.
        </p>
        <p className="leading-7">
          Pipeline 패턴의 핵심은 <strong>unwind</strong>(되감기) 지원이다.<br />
          MerkleStage에서 상태 루트 불일치가 발생하면, 이전 Stage들을 역순으로 unwind한다.<br />
          각 Stage는 execute/unwind 인터페이스를 구현하며, 이를 통해 파이프라인 전체가 원자적으로 동작한다.
        </p>

        {/* ── 실행 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Pipeline::run() — 완전 동기화 루프</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Full Sync 메인 루프
pub async fn run(&mut self) -> Result<ControlFlow> {
    loop {
        // CL로부터 최신 tip 수신 (FCU)
        let tip = self.wait_for_tip().await?;
        self.tip = Some(tip);

        // 파이프라인 1 사이클 실행
        for stage in &mut self.stages {
            let input = ExecInput {
                target: Some(tip),
                checkpoint: self.progress.get(stage.id()),
            };

            let output = stage.execute(&provider, input)?;
            self.progress.update(stage.id(), output.checkpoint);

            if !output.done {
                // 아직 tip 미도달 → 다음 사이클로 break
                break;
            }
        }

        // 모든 Stage가 tip 도달 → live sync로 전환
        if self.progress.all_at(tip) {
            return Ok(ControlFlow::NoProgress);
        }
    }
}

// 완전 동기화 순서:
// 1. Headers: 0 → tip 헤더 다운로드
// 2. Bodies: 0 → tip 바디 다운로드
// 3. SenderRecovery: TX sender 병렬 복구
// 4. Execution: revm 실행 (배치 누적)
// 5. Hashing: 계정/스토리지 키 해싱
// 6. Merkle: 증분 state_root 계산
// 7. HistoryIndex: 역인덱스 구축
//
// 각 Stage는 수일 걸릴 수 있음 → breakpoint 기반 재시작`}
        </pre>
        <p className="leading-7">
          파이프라인 사이클은 <strong>모든 Stage가 tip 도달할 때까지</strong> 반복.<br />
          일부 Stage만 느리면 해당 Stage에서 break → 다음 사이클에서 이어서 진행.<br />
          체크포인트 기반 재시작으로 크래시 후에도 중단 지점부터 계속.
        </p>

        {/* ── 소요 시간 분석 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Full Sync 소요 시간 분석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 메인넷 archive Full Sync (2026 기준, 1800만 블록)

// Stage별 소요 시간:
// ┌──────────────────┬──────────────┐
// │ Stage            │ 시간         │
// ├──────────────────┼──────────────┤
// │ Headers          │ ~2시간       │
// │ Bodies           │ ~6시간       │
// │ SenderRecovery   │ ~4시간       │
// │ Execution        │ ~12시간      │
// │ Hashing          │ ~3시간       │
// │ Merkle           │ ~5시간       │
// │ HistoryIndex     │ ~4시간       │
// ├──────────────────┼──────────────┤
// │ 합계             │ ~36시간      │
// └──────────────────┴──────────────┘

// 네트워크 의존성:
// - Headers/Bodies: 피어 대역폭에 따라 다름 (수십 Gbps 권장)
// - SenderRecovery/Execution: CPU 집약적 (16+코어 권장)
// - Hashing/Merkle: CPU + DB I/O (SSD 필수)

// 하드웨어별 예상 시간:
// - 최소 사양 (8코어 + SATA SSD): ~5일
// - 권장 사양 (16코어 + NVMe): ~1.5일
// - 고성능 (32코어 + 엔터프라이즈 SSD): ~1일

// Geth 비교:
// 동일 하드웨어 기준 ~5~10일 (Reth의 5배 이상)

// 시간이 Stage별로 분리된 이점:
// - 병목 stage 명확히 파악 가능
// - 하드웨어 업그레이드 타겟 명확
// - 재시작 시 완료 stage는 건너뜀`}
        </pre>
        <p className="leading-7">
          Full Sync는 <strong>36시간 전후</strong> 소요 (적절한 하드웨어 기준).<br />
          ExecutionStage가 최장 — revm 실행이 CPU 집약적.<br />
          Stage 분리 덕분에 병목 파악 용이 → 하드웨어 튜닝 타겟 명확.
        </p>

        {/* ── unwind 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Unwind — reorg/검증실패 복구</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Unwind 시나리오:
// 1. MerkleStage에서 state_root 불일치 감지
// 2. Pipeline이 Unwind 시그널 발동
// 3. 모든 Stage를 역순 unwind (MerkleExecute → ... → Headers)

pub async fn unwind_to(
    &mut self,
    target: BlockNumber,
) -> Result<()> {
    // 역순 순회: Merkle → Execution → Senders → Bodies → Headers
    for stage in self.stages.iter_mut().rev() {
        let input = UnwindInput {
            checkpoint: self.progress.get(stage.id()),
            unwind_to: target,
            bad_block: None,
        };

        stage.unwind(&provider, input)?;
        self.progress.update(stage.id(), StageCheckpoint::new(target));
    }
    Ok(())
}

// 각 Stage의 unwind():
// - HeadersStage: Headers 테이블에서 target+1 이후 삭제
// - BodiesStage: BlockBodies, Transactions 삭제
// - SendersStage: TxSenders 삭제
// - ExecutionStage: AccountChangeSets/StorageChangeSets 역적용
// - MerkleStage: AccountsTrie/StoragesTrie 삭제

// 원자성:
// - MDBX 트랜잭션 단위로 unwind 수행
// - 실패 시 자동 롤백
// - 다음 실행 시 같은 target에서 재시작`}
        </pre>
        <p className="leading-7">
          Unwind는 <strong>역순 stage 호출</strong>로 상태 복원.<br />
          MDBX 트랜잭션 원자성 덕분에 unwind 중 크래시해도 안전.<br />
          검증 실패 → unwind → 재실행 사이클로 합의 복원.
        </p>
      </div>

      {/* Pipeline stages */}
      <h3 className="text-lg font-semibold mb-3">Stage 실행 순서</h3>
      <div className="not-prose flex gap-2 mb-4">
        {PIPELINE_STAGES.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => setActiveStage(activeStage === s.id ? null : s.id)}
              className="flex-1 rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
              style={{
                borderColor: activeStage === s.id ? s.color : 'var(--color-border)',
                background: activeStage === s.id ? `${s.color}10` : undefined,
              }}>
              <p className="font-mono text-xs font-bold" style={{ color: s.color }}>{s.name}</p>
              <p className="text-xs text-foreground/60 mt-1">{s.role}</p>
            </button>
            {i < PIPELINE_STAGES.length - 1 && (
              <span className="text-foreground/30 text-lg shrink-0">&#8594;</span>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.name}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.details}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>Full Sync의 트레이드오프</strong> — 수일이 걸리지만 모든 블록을 직접 검증한다.<br />
          Archive 노드(과거 상태 전체 보존)나 블록 탐색기처럼 보안과 완전성이 중요한 인프라에 적합하다.
        </p>
      </div>
    </section>
  );
}
