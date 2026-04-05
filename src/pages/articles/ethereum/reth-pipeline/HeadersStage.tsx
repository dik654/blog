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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub struct Header {
    pub parent_hash: B256,        // 부모 블록의 keccak256 해시 → 체인 연결성
    pub ommers_hash: B256,        // 삼촌 블록 목록의 머클 루트 (PoS 이후 무의미)
    pub beneficiary: Address,     // 블록 보상 수령자 (coinbase)
    pub state_root: B256,         // 블록 실행 후 전체 상태의 머클 루트 ← MerkleStage 검증 대상
    pub transactions_root: B256,  // TX 목록의 머클 루트 ← BodiesStage 검증 대상
    pub receipts_root: B256,      // 영수증 목록의 머클 루트 ← ExecutionStage 생성
    pub logs_bloom: Bloom,        // 256바이트 블룸 필터 (이벤트 로그 인덱싱)
    pub difficulty: U256,         // PoS 이후 0 고정
    pub number: BlockNumber,      // 블록 높이
    pub gas_limit: u64,           // 블록당 최대 가스
    pub gas_used: u64,            // 실제 사용된 가스
    pub timestamp: u64,           // Unix 초
    pub extra_data: Bytes,        // 최대 32바이트 임의 데이터
    pub mix_hash: B256,           // PoS 이후 PREVRANDAO (beacon chain 랜덤값)
    pub nonce: B64,               // PoS 이후 0 고정
    pub base_fee_per_gas: Option<u64>,         // EIP-1559
    pub withdrawals_root: Option<B256>,        // Shanghai (withdrawals 머클 루트)
    pub blob_gas_used: Option<u64>,            // EIP-4844
    pub excess_blob_gas: Option<u64>,          // EIP-4844
    pub parent_beacon_block_root: Option<B256>,// Cancun (beacon chain tie-in)
}
// 총 크기 ≈ 508바이트 (Cancun 기준)`}
        </pre>
        <p className="leading-7">
          <code>parent_hash</code>가 체인을 선형으로 이어붙이는 유일한 링크다.<br />
          헤더 N개만 있으면 창세기부터 tip까지의 전체 해시 체인을 검증할 수 있다.<br />
          바디는 <code>transactions_root</code>를 통해 "정답 해시"에 묶여 있으므로, 나중에 받아도 위조 여부를 판별할 수 있다.
        </p>

        {/* ── devp2p 프로토콜 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">devp2p/eth 프로토콜 — GetBlockHeaders 요청</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// eth/68 와이어 프로토콜 메시지
struct GetBlockHeaders {
    request_id: u64,              // 응답 매칭용 고유 ID
    origin: HashOrNumber,         // 시작점 (블록 해시 or 번호)
    amount: u64,                  // 요청 개수 (최대 1024)
    skip: u64,                    // 건너뛸 블록 수 (0 = 연속)
    reverse: bool,                // true면 역순 다운로드
}

struct BlockHeaders {
    request_id: u64,
    headers: Vec<Header>,         // 피어가 보낸 헤더 목록
}

// HeaderDownloader 동작:
// 1. 여러 피어에 GetBlockHeaders를 동시 발송 (round-robin)
// 2. 응답이 오는 대로 Stream<Item=Header>로 방출
// 3. 느린 피어는 timeout → 다른 피어에게 재시도
// 4. 검증 실패 피어는 즉시 ban (reputation 시스템)`}
        </pre>
        <p className="leading-7">
          <code>reverse=true</code>는 초기 동기화 시 유용하다.<br />
          CL이 알려준 tip 해시에서 역방향으로 헤더를 받으면, 이미 가진 블록까지 도달할 때 자연스럽게 스트림이 끝난다.<br />
          <code>skip</code>은 스캐터(scatter) 다운로드용 — 건너뛴 헤더로 범위를 빠르게 샘플링할 수 있다.
        </p>

        {/* ── 검증 로직 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">헤더 검증 로직 — validate_header_against_parent</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// consensus 크레이트의 검증 체크
fn validate_header_against_parent(header: &Header, parent: &Header) -> Result<()> {
    // 1. 블록 번호 연속성: number == parent.number + 1
    if header.number != parent.number + 1 {
        return Err(ConsensusError::ParentBlockNumberMismatch);
    }
    // 2. parent_hash 일치: 이전 블록의 keccak256과 동일
    if header.parent_hash != parent.hash() {
        return Err(ConsensusError::ParentHashMismatch);
    }
    // 3. 타임스탬프 단조 증가: timestamp > parent.timestamp
    if header.timestamp <= parent.timestamp {
        return Err(ConsensusError::TimestampIsInPast);
    }
    // 4. gas_limit 변동 제한: 이전 값의 1/1024 이내로만 변화
    validate_gas_limit(header.gas_limit, parent.gas_limit)?;
    // 5. EIP-1559 base_fee 계산 검증 (런던 포크 이후)
    validate_base_fee(header, parent)?;
    // 6. extra_data 크기 ≤ 32바이트
    if header.extra_data.len() > 32 {
        return Err(ConsensusError::ExtraDataExceedsMax);
    }
    Ok(())
}`}
        </pre>
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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// DB 삽입 — 3개 테이블에 분산
provider.insert_headers(batch.drain(..))?;
// ├─ Headers 테이블: BlockNumber → Header (RLP 직렬화)
// ├─ HeaderNumbers 테이블: B256(블록 해시) → BlockNumber (역조회)
// └─ CanonicalHeaders 테이블: BlockNumber → B256 (canonical chain 표시)

// 체크포인트 저장
Ok(ExecOutput {
    checkpoint: StageCheckpoint::new(end), // 마지막 처리 블록 번호
    done: true,
})`}
        </pre>
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
