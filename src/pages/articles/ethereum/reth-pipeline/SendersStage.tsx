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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// TX 서명 구조 (EIP-155 이후)
struct Signature {
    v: u8,   // recovery id (0 or 1) + chain_id 혼합
    r: U256, // 서명 x좌표 (mod n)
    s: U256, // 서명 값 (mod n)
}

// ecrecover 알고리즘 (RFC 6979 기반)
fn ecrecover(msg_hash: B256, sig: &Signature) -> Result<PublicKey> {
    // 1. r, s가 curve order n 범위 내에 있는지 검증
    if r == 0 || r >= SECP256K1_N || s == 0 || s >= SECP256K1_N {
        return Err(InvalidSignature);
    }
    // 2. r에서 곡선 위의 점 R 복원 (v의 recovery id로 y좌표 결정)
    let R = point_from_x(r, v & 1)?;
    // 3. 공개키 계산: Q = r^(-1) * (s*R - z*G)
    //    z = msg_hash를 정수로 변환, G = secp256k1 생성자
    let Q = r.invert() * (s * R - msg_hash * G);
    Ok(PublicKey(Q))
}

// 주소 변환: keccak256(pubkey_x || pubkey_y)의 하위 20바이트
fn pubkey_to_address(pk: &PublicKey) -> Address {
    let hash = keccak256(pk.serialize_uncompressed()[1..]);
    Address(hash[12..32])
}`}
        </pre>
        <p className="leading-7">
          <code>ecrecover</code>는 이더리움에서 가장 비싼 연산 중 하나다.<br />
          secp256k1 곡선의 스칼라 곱셈(scalar multiplication)이 포함되어 TX 1개당 약 50~100 마이크로초 소요.<br />
          블록당 평균 150 TX × 1,800만 블록 = 약 27억 TX — 순차로 돌리면 수 시간 이상.
        </p>

        {/* ── rayon 병렬화 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">rayon par_iter — 완벽한 병렬화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// SendersStage 핵심 루프
let senders: Vec<Address> = transactions
    .par_iter()                          // rayon 병렬 iterator
    .map(|tx| {
        tx.recover_signer()              // 각 TX 독립적으로 ecrecover
            .ok_or(StageError::SenderRecoveryFailed)
    })
    .collect::<Result<Vec<_>>>()?;

// par_iter() 동작 원리:
// 1. transactions 슬라이스를 rayon이 N개 청크로 분할 (N = 코어 수)
// 2. 각 스레드가 work-stealing 스케줄러로 청크 소비
// 3. 한 청크 완료한 스레드가 다른 스레드의 남은 작업을 훔침 (load balancing)
// 4. collect()가 결과를 순서 보존해서 Vec<Address>로 합침

// 병렬화 효율이 거의 100%인 이유:
// - 각 ecrecover 호출이 완전 독립 (공유 상태 없음)
// - 캐시 미스가 균일 (곡선 상수는 스레드-로컬 캐시)
// - 메모리 할당 최소 (Address는 20바이트 고정)`}
        </pre>
        <p className="leading-7">
          rayon의 work-stealing 스케줄러가 CPU 코어를 거의 100% 활용한다.<br />
          16코어 머신에서 10만 TX를 처리하면 순차 대비 14~15배 빠르다. (이상적 선형 가속 = 16배)<br />
          0.5~1배의 오버헤드는 스레드 생성, work-stealing 큐 동기화 비용.
        </p>

        {/* ── Geth 대비 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Geth 대비 — 중복 제거 효과</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Geth 흐름 (blockchain/state_processor.go 참조)
// TX 수명 동안 ecrecover가 여러 번 호출됨:
//
// 1. TX 풀 입장 시: types.Sender(signer, tx)  ← 1차 호출
// 2. 블록 검증 시:  types.Sender(signer, tx)  ← 2차 호출 (캐시 히트 가능)
// 3. EVM 실행 시:   evm.Context.Origin         ← 이미 복구된 값 재사용
//
// Reth 흐름:
// 1. SendersStage: par_iter로 한 번에 전부 복구 → DB 저장
// 2. ExecutionStage: DB에서 msg.sender 조회 (ecrecover 호출 없음)
//
// 초기 동기화 시 비용 비교 (1,800만 블록 × 150 TX/블록):
// Geth: 27억 TX × 최소 1회 ecrecover = 27억 ecrecover
// Reth: 27억 TX × 정확히 1회 ecrecover = 27억 ecrecover
//
// 단, Reth는 병렬 처리 + DB 캐싱 → 실제 처리 시간은 수 분 수준
// Geth는 순차 + 블록 단위 → 수 시간 수준`}
        </pre>
        <p className="leading-7">
          Geth도 TX 풀에 캐시가 있어 중복 복구를 줄이지만, 실행 경로가 TX마다 분산되어 병렬화가 어렵다.<br />
          Reth는 <strong>Stage 단위로 작업을 묶어서 한 번에 병렬 처리</strong>하므로 ecrecover 호출 자체는 같아도 처리 시간이 수십 배 빠르다.
        </p>

        {/* ── DB 저장 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TxSenders 테이블 — ExecutionStage의 입력</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 복구된 sender를 DB에 저장
provider.insert_transaction_senders(
    start,                                    // 시작 TX 번호
    transactions.iter().map(|tx| tx.hash()),  // TX 해시 목록
    senders,                                  // 복구된 주소 목록
)?;

// TxSenders 테이블 스키마
// Key: TxNumber (u64)
// Val: Address (20바이트)
//
// 글로벌 TX 번호로 인덱싱 → BodiesStage의 Transactions 테이블과 동일 키 공간
// ExecutionStage가 TX 로드 시 같은 TxNumber로 sender를 조회
//
// 읽기 패턴: 블록 내 TX를 순차 스캔 → MDBX 순차 읽기로 매우 빠름`}
        </pre>
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
