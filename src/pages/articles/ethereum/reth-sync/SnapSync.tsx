import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import SnapDetailViz from './viz/SnapDetailViz';
import { SNAP_PHASES } from './SnapSyncData';

export default function SnapSync({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const sel = SNAP_PHASES.find(p => p.id === activePhase);

  return (
    <section id="snap-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Snap Sync 상태 다운로드</h2>
      <div className="not-prose mb-8"><SnapDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('sync-snap', codeRefs['sync-snap'])} />
          <span className="text-[10px] text-muted-foreground self-center">SnapSync 전체</span>
        </div>
        <p className="leading-7">
          Snap Sync는 블록을 재실행하지 않고, 피어에서 최신 상태를 직접 다운로드한다.<br />
          핵심 아이디어 — 1800만 블록의 중간 상태 전이는 건너뛰고, 결과만 받는다.
        </p>
        <p className="leading-7">
          보안은 Merkle proof로 보장한다.<br />
          각 청크마다 피어가 proof를 첨부하고, 수신 측은 알려진 state root에 대해 검증한다.<br />
          proof가 유효하지 않으면 해당 피어의 응답을 거부하고 다른 피어에게 재요청한다.
        </p>
        <p className="leading-7">
          다운로드는 4단계로 진행된다.<br />
          아래 카드를 클릭하면 각 단계의 상세 동작을 확인할 수 있다.
        </p>

        {/* ── snap 프로토콜 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">eth/snap 프로토콜 — 상태 범위 쿼리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// snap/1 프로토콜 메시지 (EIP-2364)

// 1. GetAccountRange — 계정 범위 요청
struct GetAccountRange {
    request_id: u64,
    root_hash: B256,         // 기준 state_root
    origin: B256,            // 시작 해시 (keccak256(address))
    limit: B256,             // 끝 해시
    response_bytes: u64,     // 최대 응답 크기
}

// 2. AccountRange — 응답
struct AccountRange {
    request_id: u64,
    accounts: Vec<(B256, SlimAccount)>,  // 정렬된 계정 목록
    proof: Vec<Bytes>,       // 범위 증명 (첫/끝 계정의 trie path)
}

// 3. GetStorageRanges — 컨트랙트 스토리지 요청
struct GetStorageRanges {
    request_id: u64,
    root_hash: B256,
    accounts: Vec<B256>,     // 타겟 계정들
    origin: B256,            // 시작 slot 해시
    limit: B256,
    response_bytes: u64,
}

// 4. GetByteCodes — 컨트랙트 바이트코드
struct GetByteCodes {
    request_id: u64,
    hashes: Vec<B256>,       // code_hash 목록
    bytes: u64,
}

// 5. GetTrieNodes — 누락된 trie 노드 (healing)
struct GetTrieNodes {
    request_id: u64,
    root_hash: B256,
    paths: Vec<Vec<Bytes>>,
    bytes: u64,
}`}
        </pre>
        <p className="leading-7">
          snap 프로토콜은 <strong>범위 쿼리 기반</strong> — origin~limit 구간을 한 번에 전송.<br />
          응답에 Merkle proof 포함 → 수신자가 독립적으로 검증.<br />
          5가지 메시지로 전체 상태(account + storage + code + trie) 다운로드 가능.
        </p>

        {/* ── Merkle proof 검증 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Range Proof 검증 — 완전성 증명</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 수신한 account range를 state_root에 대해 검증
fn verify_account_range(
    state_root: B256,
    origin: B256,
    limit: B256,
    accounts: &[(B256, SlimAccount)],
    proof: &[Bytes],
) -> Result<bool> {
    // 1. accounts가 정렬되어 있는지 확인
    for window in accounts.windows(2) {
        if window[0].0 >= window[1].0 {
            return Err(NotSorted);
        }
    }

    // 2. origin/limit 범위 내에 있는지 확인
    if let Some((first_hash, _)) = accounts.first() {
        if *first_hash < origin { return Err(OutOfRange); }
    }
    if let Some((last_hash, _)) = accounts.last() {
        if *last_hash > limit { return Err(OutOfRange); }
    }

    // 3. proof로 trie 경로 재구성 → state_root 검증
    let computed_root = verify_range_proof(
        origin, limit, accounts, proof,
    )?;

    if computed_root != state_root {
        return Err(ProofMismatch);
    }

    Ok(true)  // 유효한 range
}

// Range Proof의 핵심:
// - 범위 경계(origin, limit)의 trie path 증명
// - 내부 계정들은 proof 없이도 검증 가능 (경계로 묶임)
// - 악의적 피어가 일부 계정 누락 시 proof 불일치 발생`}
        </pre>
        <p className="leading-7">
          Range Proof는 <strong>"이 범위에 다른 계정이 없다"</strong>까지 증명.<br />
          origin/limit 경계의 trie path만 받으면 내부 계정 목록의 완전성 보장.<br />
          악의적 피어가 중간 계정을 빼먹으면 proof 검증 실패 → 거부.
        </p>

        {/* ── Healing 단계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Healing — 변경분 최종 정합성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Snap Sync 타임라인:
// T=0:     스냅샷 다운로드 시작 (root_hash = S0)
// T=0~2h:  AccountRange/StorageRanges 다운로드
//          이 사이에 새 블록 수천 개 생성됨
// T=2h:    다운로드 완료, 현재 state_root는 S1 (S0 아님)

// 문제: S0 시점 스냅샷 vs 현재 S1 상태 불일치
// 변경된 계정/슬롯의 trie 노드가 다름

// 해결: Healing phase
fn heal_trie(
    target_root: B256,  // 현재 S1
    existing_root: B256, // 내가 가진 S0
) -> Result<()> {
    // 1. S0과 S1 사이의 블록들 실행 (normal block execution)
    for block in (s0_block + 1)..=s1_block {
        execute_block(block)?;
    }

    // 2. 실행 중 누락된 trie 노드 감지 → snap으로 추가 요청
    loop {
        let missing = detect_missing_trie_nodes()?;
        if missing.is_empty() { break; }

        // GetTrieNodes 요청
        let nodes = request_trie_nodes(missing)?;
        insert_into_db(nodes)?;
    }

    // 3. state_root 최종 검증
    let computed_root = compute_state_root()?;
    if computed_root != target_root {
        return Err(HealingFailed);
    }

    Ok(())
}

// Healing 소요 시간:
// 스냅샷 다운로드 + 변경 블록 수에 비례
// 보통 수십 분 ~ 1시간`}
        </pre>
        <p className="leading-7">
          <strong>Healing</strong>이 Snap Sync의 정체성 — "스냅샷 + 변경분 보정".<br />
          다운로드 중 체인이 진행되므로 최종 state_root까지 따라잡기 필요.<br />
          누락 trie 노드를 GetTrieNodes로 추가 요청하여 정합성 확보.
        </p>

        {/* ── 총 소요시간 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Snap Sync 전체 단계별 소요 시간</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 메인넷 Snap Sync 단계별 시간 (2026 기준)
//
// Phase 1: Headers 동기화
//   - 1800만 헤더 다운로드
//   - 시간: ~30분
//
// Phase 2: Account snapshot
//   - ~2.5억 계정 × SlimAccount(~80B) ≈ 20GB
//   - 피어 대역폭에 따라: ~2~4시간
//
// Phase 3: Storage snapshot
//   - 컨트랙트 스토리지 ~200GB
//   - 시간: ~4~8시간
//
// Phase 4: Bytecode + Trie healing
//   - 바이트코드 ~30GB
//   - Healing: 변경된 trie 노드 수리
//   - 시간: ~1~2시간
//
// ─────────────────────────────
// 총 Snap Sync: ~8~15시간
// Full Sync: ~36시간
// → 약 3~5배 빠름

// Snap Sync 전제:
// - 피어가 snap/1 프로토콜 지원
// - 피어의 snapshot이 최신 (~32 epoch 이내)
// - 안정적인 네트워크 연결

// 신뢰 가정:
// - Full Sync: 제네시스에서 직접 검증 (완전 신뢰 없음)
// - Snap Sync: 초기 state_root는 CL에서 받음 (CL 신뢰 필요)
// - CL 신뢰는 PoS 보안 모델의 일부이므로 합리적`}
        </pre>
        <p className="leading-7">
          Snap Sync는 <strong>Full Sync 대비 3~5배 빠름</strong>.<br />
          블록 실행을 건너뛰고 상태 스냅샷만 받으므로 CPU 부하 크게 감소.<br />
          신뢰 가정(CL의 state_root)은 PoS 보안 모델과 일치 → 안전성 유지.
        </p>
      </div>

      <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {SNAP_PHASES.map(p => (
          <button key={p.id}
            onClick={() => setActivePhase(activePhase === p.id ? null : p.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activePhase === p.id ? p.color : 'var(--color-border)',
              background: activePhase === p.id ? `${p.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: p.color }}>{p.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{p.role}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.label}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.details}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>Healing이 필요한 이유</strong> — 다운로드에 수시간이 걸리는 동안 새 블록이 계속 생성된다.<br />
          상태가 변경된 부분의 Trie 노드가 불일치하므로, 마지막에 변경분만 다시 받아 최신 state root와 일치시킨다.
        </p>
      </div>
    </section>
  );
}
