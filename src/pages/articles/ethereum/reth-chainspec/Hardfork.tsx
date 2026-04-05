import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HardforkDetailViz from './viz/HardforkDetailViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { FORK_TYPES } from './HardforkData';

export default function Hardfork({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="hardfork" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Hardfork enum & 활성화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 BTreeMap인가?</strong>{' '}
          Geth의 <code>ChainConfig</code>는 하드포크마다 struct 필드를 추가한다.<br />
          <code>ShanghaiTime *uint64</code>, <code>CancunTime *uint64</code> 같은 방식이다.<br />
          새 하드포크가 추가될 때마다 필드 + nil 체크 + 테스트를 갱신해야 한다.{' '}
          <CodeViewButton onClick={() => open('fork-condition')} />
        </p>
        <p className="leading-7">
          Reth는 <code>BTreeMap&lt;EthereumHardfork, ForkCondition&gt;</code>으로 관리한다.<br />
          BTreeMap의 키가 자동 정렬되므로 하드포크 순서가 자연스럽게 유지된다.<br />
          새 하드포크 지원은 enum variant 하나와 맵 엔트리 하나를 추가하는 것으로 끝난다.{' '}
          <CodeViewButton onClick={() => open('chainspec-struct')} />
        </p>

        {/* ── EthereumHardfork enum ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">EthereumHardfork enum — 역사 전체</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`#[derive(Copy, Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Debug)]
pub enum EthereumHardfork {
    Frontier,        // 2015-07-30 (blk 0)          최초 런칭
    Homestead,       // 2016-03-14 (blk 1_150_000)  EIP-2 gas 개선
    Dao,             // 2016-07-20 (blk 1_920_000)  The DAO 해킹 롤백
    Tangerine,       // 2016-10-18 (blk 2_463_000)  EIP-150 DoS 대응
    SpuriousDragon,  // 2016-11-22 (blk 2_675_000)  EIP-155 replay 보호
    Byzantium,       // 2017-10-16 (blk 4_370_000)  EIP-100/140 추가
    Constantinople,  // 2019-02-28 (blk 7_280_000)  EIP-1014 CREATE2
    Petersburg,      // 2019-02-28 (blk 7_280_000)  EIP-1283 롤백
    Istanbul,        // 2019-12-08 (blk 9_069_000)  EIP-1344 chainid
    MuirGlacier,     // 2020-01-02 (blk 9_200_000)  난이도 폭탄 지연
    Berlin,          // 2021-04-15 (blk 12_244_000) EIP-2929 gas 개편
    London,          // 2021-08-05 (blk 12_965_000) EIP-1559 수수료 시장
    ArrowGlacier,    // 2021-12-09 (blk 13_773_000) 난이도 폭탄 지연
    GrayGlacier,     // 2022-06-30 (blk 15_050_000) 난이도 폭탄 지연
    Paris,           // 2022-09-15 (blk 15_537_394) The Merge (PoS)
    Shanghai,        // 2023-04-12 (ts 1_681_338_455) EIP-4895 withdrawals
    Cancun,          // 2024-03-13 (ts 1_710_338_135) EIP-4844 blob
    Prague,          // 2025 예정 (ts TBD) EIP-7702 account abstraction
}

// BTreeMap 키로 사용 가능 — derive(PartialOrd, Ord)로 enum 정렬 보장
// BTreeMap<EthereumHardfork, ForkCondition>을 iterate하면 위 순서대로 방문`}
        </pre>
        <p className="leading-7">
          Rust enum의 순서가 이더리움 하드포크 연대기와 정확히 일치 — <code>derive(PartialOrd, Ord)</code>가 선언 순서로 정렬 보장.<br />
          새 하드포크 추가: enum 끝에 variant 추가 + BTreeMap 엔트리 1줄 추가 = 전부.<br />
          Geth와의 대조: Geth는 <code>ChainConfig</code> struct에 <code>PragueTime *uint64</code> 필드 추가 + 각 호출부 nil 체크.
        </p>

        {/* ── active_at_block / active_at_timestamp ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">활성화 체크 — active_at_block / active_at_timestamp</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`impl ForkCondition {
    /// 주어진 블록 번호에서 이 포크가 활성인가?
    pub fn active_at_block(&self, current_block: u64) -> bool {
        match self {
            ForkCondition::Block(activation) => current_block >= *activation,
            ForkCondition::TTD { fork_block: Some(b), .. } => current_block >= *b,
            _ => false,
        }
    }

    /// 주어진 타임스탬프에서 이 포크가 활성인가?
    pub fn active_at_timestamp(&self, current_ts: u64) -> bool {
        match self {
            ForkCondition::Timestamp(activation) => current_ts >= *activation,
            _ => false,
        }
    }

    /// 블록 또는 타임스탬프 어느 쪽이든 활성이면 true
    pub fn active_at_head(&self, head: &Head) -> bool {
        match self {
            ForkCondition::Block(b) => head.number >= *b,
            ForkCondition::Timestamp(t) => head.timestamp >= *t,
            ForkCondition::TTD { total_difficulty, .. } => {
                head.total_difficulty >= *total_difficulty
            }
            ForkCondition::Never => false,
        }
    }
}`}
        </pre>
        <p className="leading-7">
          <code>active_at_head</code>가 통합 진입점 — <code>Head {"{ number, timestamp, total_difficulty }"}</code>를 받아 모든 조건을 처리.<br />
          EVM 실행 시점에 "이 블록에서 EIP-X가 활성인가?"를 O(1)로 판단.<br />
          <code>Never</code>는 L2가 특정 포크를 건너뛸 때 사용 — 활성 체크는 항상 false.
        </p>

        {/* ── ForkFilter (EIP-2124) ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ForkFilter — EIP-2124 fork identifier</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub struct ForkId {
    pub hash: ForkHash,   // 4바이트 CRC32 체크섬
    pub next: u64,        // 다음 포크의 활성 블록/타임스탬프 (없으면 0)
}

// ForkHash 계산 알고리즘 (EIP-2124)
fn compute_fork_hash(genesis_hash: B256, activations: &[u64]) -> ForkHash {
    let mut crc = CRC32::new();
    crc.update(genesis_hash.as_slice());                 // 1. genesis로 시드
    for activation in activations {
        crc.update(&activation.to_be_bytes());           // 2. 각 활성화 블록/ts를 누적
    }
    ForkHash(crc.finalize().to_be_bytes())
}

// 피어 핸드셰이크 시 사용:
// - 내 ForkId.hash가 상대 ForkId.hash와 같음 → 같은 체인, 같은 포크 상태
// - 다름 + next가 내 tip보다 과거 → 상대가 뒤처진 체인 (연결 OK)
// - 다름 + next가 내 tip보다 미래 → 상대가 새 포크 지원 (내가 업그레이드 필요)`}
        </pre>
        <p className="leading-7">
          <code>ForkHash</code>는 4바이트 CRC32 — 두 노드가 같은 포크 상태인지 <strong>O(1) 비교</strong>로 확인.<br />
          <code>next</code> 필드는 "다음 포크까지의 유예 기간" 정보 — 상대가 업그레이드 지연 중인지 판별.<br />
          이 설계 덕분에 피어 연결 시 전체 ChainConfig를 주고받지 않아도 호환성 확인 가능.
        </p>

        {/* ── ChainHardforks 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ChainHardforks — BTreeMap 래퍼</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub struct ChainHardforks {
    forks: BTreeMap<Box<dyn Hardfork>, ForkCondition>,
    //             ↑ trait object 키 — 이더리움/OP/임의 체인 하드포크 모두 수용
}

// EthereumHardfork::mainnet() → ChainHardforks 변환
impl From<EthereumHardforkList> for ChainHardforks {
    fn from(list: EthereumHardforkList) -> Self {
        let mut forks = BTreeMap::new();
        forks.insert(Box::new(EthereumHardfork::Frontier), ForkCondition::Block(0));
        forks.insert(Box::new(EthereumHardfork::Homestead), ForkCondition::Block(1_150_000));
        forks.insert(Box::new(EthereumHardfork::Dao), ForkCondition::Block(1_920_000));
        // ... 17개 하드포크 전부
        forks.insert(Box::new(EthereumHardfork::Cancun), ForkCondition::Timestamp(1_710_338_135));
        ChainHardforks { forks }
    }
}

// 사용 예:
// - chainspec.hardforks.fork(EthereumHardfork::London) → &ForkCondition
// - chainspec.hardforks.is_active_at_block(EthereumHardfork::Berlin, current) → bool`}
        </pre>
        <p className="leading-7">
          <code>Box&lt;dyn Hardfork&gt;</code>를 키로 사용 — trait object로 체인 종류에 무관하게 저장 가능.<br />
          OP Stack, Arbitrum, Base는 자체 Hardfork enum(<code>OpHardfork::Bedrock</code> 등)을 같은 맵에 공존시킬 수 있다.<br />
          <code>BTreeMap</code> 특성 덕분에 순회 시 자연스럽게 활성 순서대로 방문.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: enum vs struct field 전쟁</p>
          <p className="mt-2">
            Geth 방식 (struct 필드):<br />
            <code>{`type ChainConfig struct {
    BerlinBlock  *big.Int
    LondonBlock  *big.Int
    ShanghaiTime *uint64
    CancunTime   *uint64
    PragueTime   *uint64  // 새 포크마다 추가
}`}</code>
          </p>
          <p className="mt-2">
            Reth 방식 (BTreeMap + enum):<br />
            <code>BTreeMap&lt;EthereumHardfork, ForkCondition&gt;</code><br />
            새 포크 지원은 enum variant 추가 + 맵 엔트리 1줄 추가로 완료.
          </p>
          <p className="mt-2">
            각 방식의 트레이드오프:<br />
            - Geth: 필드 접근이 <code>config.LondonBlock</code>으로 직관적. 단, <code>nil</code> 체크가 모든 사용처에 필요.<br />
            - Reth: <code>hardforks.fork(London)</code> 한 단계 간접 접근. 대신 새 포크 추가가 enum 1줄.<br />
            - 확장성에서 Reth가 우세. Geth는 새 EIP 추가 시 코드베이스 전체 nil 체크 업데이트가 필요.
          </p>
        </div>
      </div>

      {/* Interactive ForkCondition type cards */}
      <h3 className="text-lg font-semibold mb-3">ForkCondition -- 3가지 활성화 조건</h3>
      <div className="not-prose space-y-2 mb-6">
        {FORK_TYPES.map(f => (
          <motion.div key={f.id}
            onClick={() => setExpanded(expanded === f.id ? null : f.id)}
            className="rounded-lg border p-4 cursor-pointer transition-colors"
            style={{
              borderColor: expanded === f.id ? f.color : 'var(--color-border)',
              background: expanded === f.id ? `${f.color}08` : undefined,
            }}
            animate={{ opacity: expanded === f.id ? 1 : 0.7 }}>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full" style={{ background: f.color }} />
              <span className="font-mono font-bold text-sm">{f.condition}</span>
              <span className="text-xs text-muted-foreground">{f.era}</span>
            </div>
            <AnimatePresence>
              {expanded === f.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <div className="mt-3 ml-5 space-y-1 text-sm">
                    <p className="text-foreground/80">{f.detail}</p>
                    <p className="text-foreground/60">
                      <span className="font-semibold">예시:</span> {f.examples}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose">
        <HardforkDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
