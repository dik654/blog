import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import PayloadViz from './viz/PayloadViz';
import { DESIGN_CHOICES, ENGINE_FLOW } from './OverviewData';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = DESIGN_CHOICES.find(d => d.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">페이로드 빌드 흐름</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          PoS 이더리움에서 블록 생성은 CL(합의 계층)과 EL(실행 계층)의 협업이다.<br />
          CL이 검증자의 블록 제안 차례를 결정하고, EL이 TX를 선택하고 실행하여 블록을 조립한다.<br />
          Engine API가 이 두 계층을 연결한다.
        </p>
        <p className="leading-7">
          CL이 <code>ForkchoiceUpdated</code>를 보내면 EL은 두 가지를 처리한다.<br />
          첫째, canonical 체인을 갱신한다.<br />
          둘째, <code>payload_attributes</code>가 포함되어 있으면 백그라운드에서 블록 빌드를 시작한다.<br />
          이후 CL이 <code>GetPayload</code>를 호출하면 조립된 블록을 반환한다.
        </p>
        <p className="leading-7">
          <strong>시간 제약이 핵심이다.</strong><br />
          12초 슬롯 안에 TX 선택, EVM 실행, 상태 루트 계산을 완료해야 한다.<br />
          늦으면 빈 블록을 제출하게 되고 수수료 수익은 0이다.<br />
          Reth는 continuous building 전략으로 GetPayload 시점까지 점진적으로 블록을 개선한다.
        </p>

        {/* ── PayloadAttributes ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PayloadAttributes — 블록 생성 파라미터</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CL이 FCU에 포함시켜 전달하는 블록 생성 요청
pub struct PayloadAttributes {
    /// 블록 타임스탬프 (현재 슬롯의 시작 시간)
    pub timestamp: u64,
    /// RANDAO 값 (PoW의 mix_hash 대체)
    pub prev_randao: B256,
    /// 수수료 수취 주소 (validator가 지정)
    pub suggested_fee_recipient: Address,
    /// Shanghai 이후: withdrawals
    pub withdrawals: Option<Vec<Withdrawal>>,
    /// Cancun 이후: parent beacon block root (EIP-4788)
    pub parent_beacon_block_root: Option<B256>,
}

// Withdrawal 구조 (EIP-4895)
pub struct Withdrawal {
    pub index: u64,          // 글로벌 withdrawal 인덱스
    pub validator_index: u64, // CL validator ID
    pub address: Address,     // EL 수취 주소
    pub amount: u64,          // Gwei 단위 (1 Gwei = 10^9 wei)
}

// 전형적 withdrawals 처리:
// - CL이 매 슬롯 16개 withdrawals 선정
// - EL은 블록 실행 후 post-execution에서 잔고 증가
// - 별도 TX 실행 없이 state만 변경`}
        </pre>
        <p className="leading-7">
          <code>PayloadAttributes</code>가 <strong>블록 생성의 parameters</strong>.<br />
          CL이 timestamp, fee_recipient, RANDAO 값 등을 지정 → EL은 이를 헤더에 반영.<br />
          Shanghai 이후 withdrawals 필드 추가 — validator 인출을 block 단위로 묶어 처리.
        </p>

        {/* ── PayloadJob ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PayloadJob trait — 블록 빌드 상태 관리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub trait PayloadJob: Future<Output = Result<Self::BuiltPayload>> {
    type BuiltPayload: BuiltPayload;
    type ResolvePayloadFuture: Future<Output = Result<Self::BuiltPayload>>;

    /// 최선의 페이로드 반환 (현 시점까지 빌드된 블록)
    fn best_payload(&self) -> Result<Self::BuiltPayload>;

    /// CL의 GetPayload 요청 응답 (최종 결정)
    fn resolve(self) -> Self::ResolvePayloadFuture;

    /// 지금까지의 빌드 메트릭
    fn payload_attributes(&self) -> &PayloadAttributes;
}

// PayloadBuilder 구현체 (이더리움 메인넷)
pub struct EthereumPayloadJob<Client, Pool, Tasks> {
    attrs: PayloadAttributes,
    client: Client,              // StateProvider
    pool: Pool,                  // TxPool
    tasks: Tasks,                // tokio spawner
    best_payload: Arc<RwLock<BuiltPayload>>,
    cancel_token: CancellationToken,
}

// continuous building 패턴:
impl PayloadJob for EthereumPayloadJob {
    fn best_payload(&self) -> Result<BuiltPayload> {
        // 현재 best payload 읽기 (다른 스레드에서 업데이트 중일 수 있음)
        Ok(self.best_payload.read().clone())
    }

    fn resolve(mut self) -> Self::ResolvePayloadFuture {
        // GetPayload 요청 = "이제 그만 빌드, 지금 것 반환"
        self.cancel_token.cancel();
        async move {
            self.await  // 마지막 업데이트 대기
        }
    }
}`}
        </pre>
        <p className="leading-7">
          <code>PayloadJob</code>이 <strong>진행 중인 블록 빌드 상태</strong>를 표현.<br />
          <code>best_payload()</code>는 "지금까지 찾은 최선" 반환 — 백그라운드에서 개선 계속.<br />
          <code>resolve()</code>는 "이제 확정" 시그널 — 더 이상 개선 없이 반환.
        </p>

        {/* ── 타임라인 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Validator 슬롯 타임라인 — 12초 내 블록 빌드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Validator가 블록 제안자인 슬롯의 타임라인
//
// T=-12s (이전 슬롯): fork choice 준비
// T=0s: 슬롯 시작
//   CL → EL: FCU(head, ..., payload_attrs=Some)
//   EL: PayloadJob 생성, 빌드 시작
//
// T=0.5s: 초기 페이로드 완성
//   - 빈 블록 (withdrawals만) 즉시 준비
//   - best_payload() 호출 시 반환 가능
//
// T=1s: TX 추가 시작
//   - txpool.best_transactions() iterator
//   - 높은 priority TX부터 실행 & 추가
//   - gas_limit 30M까지 채우기
//
// T=2s: 첫 번째 개선 완료
//   - ~200 TX 포함, ~15M gas 사용
//   - best_payload 업데이트
//
// T=4s: CL의 GetPayload 요청 (validator 전략별 타이밍 다름)
//   CL → EL: engine_getPayloadV3(payload_id)
//   EL: resolve() → 현재 best_payload 반환
//   EL: PayloadJob 종료
//
// T=12s: 다음 슬롯 시작

// 시간 예산 분석:
// - 0~4s: 빌드 시간 (4초)
// - 4~12s: CL이 블록 전파 & attestation 수집
// - EL이 4초 안에 경쟁력 있는 블록 만들기 필요

// Reth 전략:
// - 병렬 TX 평가 (여러 TX 동시 시뮬레이션)
// - bundle 통합 (MEV 빌더 rbuilder)
// - state caching (이미 실행한 TX 재사용)`}
        </pre>
        <p className="leading-7">
          Validator는 <strong>4초 내에 수익 최대 블록</strong>을 만들어야 함.<br />
          Reth의 continuous building으로 시간 내 best 블록 확보.<br />
          GetPayload 호출 시점이 CL의 선택 — 늦을수록 더 나은 블록 가능.
        </p>
      </div>

      {/* 설계 판단 카드 */}
      <h3 className="text-lg font-semibold mb-3">핵심 설계 판단</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {DESIGN_CHOICES.map(d => (
          <button key={d.id} onClick={() => setSelected(selected === d.id ? null : d.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{ borderColor: selected === d.id ? d.color : 'var(--color-border)', background: selected === d.id ? `${d.color}10` : undefined }}>
            <p className="font-bold text-sm" style={{ color: d.color }}>{d.title}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.title}</p>
            <p className="text-sm text-foreground/60 leading-relaxed mb-2"><strong>문제:</strong> {sel.problem}</p>
            <p className="text-sm text-foreground/80 leading-relaxed"><strong>해결:</strong> {sel.solution}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Engine API 흐름 */}
      <h3 className="text-lg font-semibold mb-3">CL-EL 타이밍 흐름</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border border-border rounded-lg">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-semibold w-12">순서</th>
              <th className="text-left p-3 font-semibold">방향</th>
              <th className="text-left p-3 font-semibold">동작</th>
            </tr>
          </thead>
          <tbody>
            {ENGINE_FLOW.map((f, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-3 font-mono text-indigo-400">{f.step}</td>
                <td className="p-3 text-foreground/60">{f.caller}</td>
                <td className="p-3">{f.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose mt-6"><PayloadViz /></div>
    </section>
  );
}
