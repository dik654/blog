import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { ETH_METHODS } from './EthApiData';

export default function EthApi({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = ETH_METHODS.find(m => m.id === selected);

  return (
    <section id="eth-api" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EthApi trait 구현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('rpc-eth-api', codeRefs['rpc-eth-api'])} />
          <span className="text-[10px] text-muted-foreground self-center">EthApiServer trait</span>
        </div>
        <p className="leading-7">
          <strong>EthApiServer</strong> trait은 eth_* JSON-RPC 메서드를 선언한다.<br />
          jsonrpsee의 <code>#[rpc(server, namespace = "eth")]</code> 매크로가 trait 정의에서 라우팅 코드를 자동 생성한다.<br />
          구현체는 이 trait을 impl하여 각 메서드의 비즈니스 로직을 작성한다.
        </p>
        <p className="leading-7">
          내부적으로 모든 상태 조회는 <strong>StateProvider</strong> trait을 통해 이루어진다.<br />
          이 추상화 덕분에 MDBX(기본 DB), 메모리 DB, Mock 등을 교체할 수 있다.<br />
          EVM 실행이 필요한 메서드(eth_call, eth_estimateGas)는 revm을 사용한다.
        </p>

        {/* ── eth_getBalance 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">eth_getBalance — 단순 조회</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`async fn balance(
    &self,
    address: Address,
    block_id: BlockId,
) -> RpcResult<U256> {
    // 1. BlockId 해석: "latest", "pending", "finalized", 블록 번호, 블록 해시
    let state = self.state_at_block_id(block_id)?;

    // 2. StateProvider에서 계정 조회
    let account = state.account(&address)?.unwrap_or_default();

    // 3. 잔고 반환 (wei 단위)
    Ok(account.balance)
}

// BlockId 종류:
pub enum BlockId {
    Hash(B256),                          // 특정 블록 해시
    Number(BlockNumberOrTag),            // 번호 또는 태그
}

pub enum BlockNumberOrTag {
    Latest,     // 현재 tip
    Finalized,  // finalized 블록
    Safe,       // safe 블록
    Earliest,   // genesis
    Pending,    // 아직 포함 안된 다음 블록 (txpool 포함)
    Number(u64), // 특정 번호
}

// state_at_block_id 동작:
// - "latest": LatestStateProvider (최신 MDBX 상태)
// - 과거 블록: HistoricalStateProvider (ChangeSets 역추적)
// - "pending": txpool 시뮬레이션 상태 (pending TX 적용 후)`}
        </pre>
        <p className="leading-7">
          <code>eth_getBalance</code>는 <strong>StateProvider 1회 호출</strong>로 완료.<br />
          <code>block_id</code>에 따라 다른 Provider 구현체 선택 → 통일된 인터페이스로 처리.<br />
          "latest" 빠르고, 과거 블록은 ChangeSet 역추적 (약간 느림).
        </p>

        {/* ── eth_call 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">eth_call — EVM 시뮬레이션</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`async fn call(
    &self,
    request: CallRequest,
    block_id: BlockId,
    overrides: Option<StateOverride>,
) -> RpcResult<Bytes> {
    // 1. 기준 블록 상태 로드
    let state = self.state_at_block_id(block_id)?;

    // 2. state overrides 적용 (디버깅용)
    let state = if let Some(overrides) = overrides {
        apply_state_overrides(state, overrides)
    } else { state };

    // 3. revm 설정 & 블록 환경
    let mut evm = Evm::builder()
        .with_db(StateProviderDatabase::new(state))
        .with_block_env(self.build_block_env(block_id)?)
        .with_tx_env(request.into_tx_env())
        .build();

    // 4. TX 실행 (상태 변경 없음, 결과만 수집)
    let ResultAndState { result, .. } = evm.transact()?;

    // 5. 출력 반환
    match result {
        ExecutionResult::Success { output, .. } => Ok(output.into_data()),
        ExecutionResult::Revert { output, .. } => Err(RevertError(output)),
        ExecutionResult::Halt { reason, .. } => Err(HaltError(reason)),
    }
}

// 특징:
// - read-only: 상태 변경 disk에 기록 안 함
// - 현재 블록 기준으로 시뮬레이션
// - gas 무제한 (기본 50M)
// - gas price 0 가능 (비용 계산 무시)

// 사용처:
// - ERC20 balanceOf 조회
// - Uniswap 쿼터 계산
// - 컨트랙트 view/pure 함수 호출`}
        </pre>
        <p className="leading-7">
          <code>eth_call</code>은 <strong>상태 변경 없이 EVM 실행</strong> — revm의 transact() 호출.<br />
          <code>StateOverride</code>로 가상의 상태 주입 가능 (디버깅/시뮬레이션).<br />
          Uniswap 쿼터, balance 조회 등 대부분의 "읽기" 스마트 컨트랙트 호출에 사용.
        </p>

        {/* ── eth_estimateGas ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">eth_estimateGas — binary search</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`async fn estimate_gas(
    &self,
    request: CallRequest,
    block_id: BlockId,
) -> RpcResult<U256> {
    let state = self.state_at_block_id(block_id)?;

    // Binary search 범위
    let mut lo = intrinsic_gas(&request);  // 최소 21000
    let mut hi = request.gas.unwrap_or(30_000_000);  // 블록 gas_limit

    // 초기 실행: hi로 성공하는지 확인
    let initial = execute_tx_with_gas(request.clone(), hi, state)?;
    if !initial.is_success() {
        return Err(ExecutionReverted);
    }

    // Binary search
    while hi - lo > 1 {
        let mid = (lo + hi) / 2;
        let result = execute_tx_with_gas(request.clone(), mid, state)?;
        if result.is_success() {
            hi = mid;  // mid로 성공 → 더 낮게 시도
        } else {
            lo = mid;  // mid로 실패 → 더 높게 시도
        }
    }

    // 수렴 지점: hi가 최소 필요 가스
    // 여유분 +10% 추가 (안전 마진)
    let estimated = hi * 110 / 100;
    Ok(U256::from(estimated))
}

// 성능:
// - log2(30_000_000 / 21_000) ≈ 11 iterations
// - 각 iteration = revm 실행 (평균 ~수 ms)
// - 총 estimateGas 응답: ~수십 ms

// 최적화:
// - memoize: 같은 TX의 여러 estimate 재사용
// - starting hint: 과거 유사 TX의 gas_used 참조`}
        </pre>
        <p className="leading-7">
          <code>eth_estimateGas</code>는 <strong>binary search + revm 실행</strong>.<br />
          정확한 gas 사용량은 실행해봐야 알 수 있음 — 점진적으로 범위 좁히기.<br />
          약 11회 실행으로 정확한 gas 추정 + 10% 안전 마진 추가.
        </p>

        {/* ── eth_getLogs ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">eth_getLogs — Bloom filter 활용</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`async fn get_logs(
    &self,
    filter: LogFilter,
) -> RpcResult<Vec<Log>> {
    let mut matching_logs = Vec::new();

    // 블록 범위 결정
    let from = filter.from_block.unwrap_or(0);
    let to = filter.to_block.unwrap_or(tip);

    // 블록별 순회
    for block_num in from..=to {
        let block_bloom = self.header_by_number(block_num)?.logs_bloom;

        // 1. Bloom 필터로 O(1) 사전 필터링
        if !matches_filter_bloom(&block_bloom, &filter) {
            continue;  // 이 블록은 매칭 없음 확정
        }

        // 2. Bloom 통과 블록만 실제 로그 조회
        let receipts = self.receipts_by_block(block_num)?;
        for receipt in receipts {
            for log in &receipt.logs {
                if filter.matches(log) {
                    matching_logs.push(log.clone());
                }
            }
        }
    }

    Ok(matching_logs)
}

// Bloom 사전 필터링의 효과:
// 100만 블록 범위 쿼리 가정:
// - Bloom 없이: 100만 블록 × 평균 150 TX = 1.5억 log 전수 검사
// - Bloom 있음: ~0.2% 히트 = 2000 블록만 검사 = 30만 log
// - 500배 가속

// 제한:
// - 기본 block 범위 제한: ~10K (인프라 보호)
// - 결과 개수 제한: ~10K logs (response size)
// - 초과 시 에러 반환 (400 Bad Request)`}
        </pre>
        <p className="leading-7">
          <code>eth_getLogs</code>는 <strong>Bloom filter로 99% 블록 건너뜀</strong>.<br />
          블룸 통과한 ~0.2% 블록만 실제 log 검사 → 500배 가속.<br />
          블록 범위 제한(~10K)으로 인프라 보호 + 정책적 제한.
        </p>
      </div>

      {/* Method cards */}
      <h3 className="text-lg font-semibold mb-3">주요 메서드</h3>
      <div className="not-prose grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {ETH_METHODS.map(m => (
          <button key={m.id}
            onClick={() => setSelected(selected === m.id ? null : m.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === m.id ? m.color : 'var(--color-border)',
              background: selected === m.id ? `${m.color}10` : undefined,
            }}>
            <p className="font-mono text-xs font-bold" style={{ color: m.color }}>{m.name}</p>
            <p className="text-xs text-foreground/50 mt-0.5">{m.category}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-1" style={{ color: sel.color }}>{sel.name}</p>
            <p className="text-sm text-foreground/80 mb-2">{sel.desc}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-foreground/40">흐름:</span>
              <span className="font-mono text-foreground/70">{sel.flow}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>eth_call은 읽기 전용</strong> — StateProvider 위에 revm을 임시로 실행하고 결과만 반환한다.<br />
          상태를 변경하지 않으므로 별도의 락이나 트랜잭션 관리가 필요 없다.
          eth_estimateGas는 binary search로 최소 가스를 탐색하므로 revm을 여러 번 실행한다.
        </p>
      </div>
    </section>
  );
}
