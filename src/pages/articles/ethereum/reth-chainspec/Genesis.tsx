import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GenesisViz from './viz/GenesisViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { GENESIS_STEPS } from './GenesisData';

export default function Genesis({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [step, setStep] = useState(0);
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="genesis" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Genesis 초기화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 컴파일 타임 임베딩인가?</strong>{' '}
          Geth는 런타임에 genesis.json 파일을 읽는다.<br />
          파일 경로 오류, 포맷 불일치 등 런타임 실패 가능성이 있다.<br />
          Reth는 <code>include_str!</code> 매크로로 JSON을 바이너리에 직접 포함시킨다.<br />
          배포 시 바이너리 하나만 있으면 메인넷을 실행할 수 있다.{' '}
          <CodeViewButton onClick={() => open('mainnet-spec')} />
        </p>
        <p className="leading-7">
          제네시스 초기화의 핵심은 <code>state_root</code> 계산이다.<br />
          alloc 필드의 모든 계정으로 Merkle Patricia Trie를 구성하고 루트 해시를 도출한다.<br />
          이 값이 genesis header에 포함되며, 피어 연결 시 제네시스 해시로 체인 호환성을 검증한다.{' '}
          <CodeViewButton onClick={() => open('make-genesis')} />
        </p>

        {/* ── genesis.json 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">genesis.json 구조 — 이더리움 메인넷</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`{
  "config": { ... },                      // ChainConfig (ChainSpec이 이 부분을 파싱)
  "nonce": "0x0000000000000042",          // PoW 시절의 난이도 관련 필드 (의미 없음)
  "timestamp": "0x0",                     // 1970-01-01 (메인넷 genesis는 고정)
  "extraData": "0x11bbe8db4e347b4e...",   // "embedded" in mainnet: 존 로키 예언서 문구
  "gasLimit": "0x1388",                   // 5000 (현재 30M까지 상향됨)
  "difficulty": "0x400000000",            // 17179869184 (초기 PoW 난이도)
  "mixHash": "0x0000...0000",
  "coinbase": "0x0000...0000",
  "alloc": {                              // 프리마인 계정들
    "000d836201318ec6899a67540690382780743280": {
      "balance": "200000000000000000000"
    },
    "001762430ea9c3a26e5749afdb70da5f78ddbb8c": {
      "balance": "2000000000000000000000"
    },
    // ... 8,893개 계정 (메인넷 기준, 총 72M ETH 프리세일 배분)
  }
}`}
        </pre>
        <p className="leading-7">
          메인넷 <code>extraData</code>에는 "we owe it all to Jon Schnelle" 등의 문구가 인코딩되어 있다.<br />
          <code>alloc</code> 필드가 8,893개 계정을 포함 — 2014년 ETH 프리세일 참여자에게 배분된 약 72M ETH.<br />
          이 파일이 이더리움 전체 역사의 "출생 증명" — state_root를 계산하는 유일한 입력.
        </p>

        {/* ── make_genesis_header ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">make_genesis_header — 하드포크 조건부 필드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub fn make_genesis_header(
    genesis: &Genesis,
    hardforks: &ChainHardforks,
) -> Header {
    // London 활성 → base_fee_per_gas 초기값 (EIP-1559)
    let base_fee_per_gas = hardforks
        .fork(EthereumHardfork::London)
        .active_at_block(0)
        .then(|| INITIAL_BASE_FEE);  // 1_000_000_000 wei (1 Gwei)

    // Shanghai 활성 → withdrawals_root (EIP-4895)
    let withdrawals_root = hardforks
        .fork(EthereumHardfork::Shanghai)
        .active_at_timestamp(genesis.timestamp)
        .then_some(EMPTY_WITHDRAWALS);  // keccak256(RLP([])) = 0x56e8...

    // Cancun 활성 → blob_gas_used + excess_blob_gas (EIP-4844)
    let (blob_gas_used, excess_blob_gas) = if hardforks
        .fork(EthereumHardfork::Cancun)
        .active_at_timestamp(genesis.timestamp) {
        (Some(0), Some(0))
    } else { (None, None) };

    Header {
        state_root: state_root_ref_unhashed(&genesis.alloc),  // 핵심: alloc → MPT 루트
        timestamp: genesis.timestamp,
        gas_limit: genesis.gas_limit,
        base_fee_per_gas,
        withdrawals_root,
        blob_gas_used,
        excess_blob_gas,
        ..Default::default()
    }
}`}
        </pre>
        <p className="leading-7">
          제네시스 헤더의 각 필드는 <strong>활성화된 하드포크에 따라</strong> 조건부로 채워진다.<br />
          테스트넷/L2는 제네시스부터 최신 포크가 활성화될 수 있으므로 이 분기가 필요하다.<br />
          예: Holesky는 genesis부터 Shanghai 활성 → <code>withdrawals_root</code>가 genesis에 존재.
        </p>

        {/* ── state_root 계산 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">state_root 계산 — alloc → MPT 루트</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`fn state_root_ref_unhashed(alloc: &BTreeMap<Address, GenesisAccount>) -> B256 {
    let mut hb = HashBuilder::default();

    for (address, account) in alloc {
        // 1. 계정 주소 해시: keccak256(address) — MPT 키
        let hashed_addr = keccak256(address);

        // 2. GenesisAccount → TrieAccount 변환
        let trie_account = TrieAccount {
            nonce: account.nonce.unwrap_or(0),
            balance: account.balance,
            storage_root: if let Some(storage) = &account.storage {
                // 스토리지가 있으면 그 하위 트라이도 계산
                compute_storage_root(storage)
            } else {
                EMPTY_ROOT_HASH  // 0x56e8...
            },
            code_hash: account.code
                .as_ref()
                .map(keccak256)
                .unwrap_or(KECCAK_EMPTY),  // 0xc5d2...
        };

        // 3. RLP 직렬화 후 HashBuilder에 추가
        let encoded = alloy_rlp::encode(&trie_account);
        hb.add_leaf(Nibbles::unpack(&hashed_addr), &encoded);
    }

    hb.root()  // 메인넷: 0xd7f8...1544
}`}
        </pre>
        <p className="leading-7">
          <code>HashBuilder</code>는 정렬된 키 순서로 MPT를 구성하는 유틸리티.<br />
          8,893개 계정을 정렬(keccak256 순) → 각각 leaf로 추가 → 최종 root 계산.<br />
          메인넷 genesis state_root: <code>0xd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544</code> — 고정값.
        </p>

        {/* ── genesis_hash ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">genesis_hash — 피어 호환성 검증 키</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 메인넷 상수
pub const MAINNET_GENESIS_HASH: B256 = b256!(
    "d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3"
);

// eth/68 wire protocol — 피어 핸드셰이크 메시지
struct StatusMessage {
    protocol_version: u32,        // eth/68 = 68
    network_id: u64,              // mainnet = 1
    total_difficulty: U256,       // PoS 이후 final TD 고정
    best_hash: B256,              // 현재 tip 블록 해시
    genesis_hash: B256,           // ← 여기서 호환성 체크
    fork_id: ForkId,              // EIP-2124 fork identifier
}

// 피어 연결 시:
// 1. 상대방 Status 수신 → genesis_hash 비교
// 2. 불일치 → "다른 체인"으로 판단 → 연결 거부
// 3. 일치 → 정상 연결 진행`}
        </pre>
        <p className="leading-7">
          <code>genesis_hash</code>는 체인의 <strong>지문(fingerprint)</strong>.<br />
          내가 메인넷 노드를 실행하는데 상대가 Sepolia 제네시스 해시를 보내면 즉시 연결 거부.<br />
          실수로 잘못된 chain_id만 설정하면 genesis_hash가 같을 수 있으므로, 이 체크가 있어야 fork 체인과 안전하게 분리 가능.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: 컴파일 타임 임베딩의 대가</p>
          <p className="mt-2">
            <code>include_str!()</code>로 genesis.json을 바이너리에 포함시키는 비용:<br />
            - 메인넷 genesis: ~200KB (8,893 계정)<br />
            - Sepolia: ~50KB<br />
            - Holesky: ~150KB<br />
            - 합계 ~400KB 바이너리 증가 (전체 ~50MB 중 0.8%)
          </p>
          <p className="mt-2">
            얻는 이점:<br />
            1. <strong>zero config 배포</strong> — 바이너리 하나면 끝<br />
            2. <strong>런타임 실패 제거</strong> — 파일 경로/권한/포맷 오류 불가능<br />
            3. <strong>Docker 이미지 단순화</strong> — genesis 파일 마운트 불필요<br />
            4. <strong>버전 일관성 보장</strong> — 바이너리와 genesis가 항상 짝
          </p>
          <p className="mt-2">
            0.8% 크기 증가로 배포 안정성을 얻는 것 — 명확한 트레이드오프 승리.
          </p>
        </div>
      </div>

      {/* Interactive genesis initialization steps */}
      <h3 className="text-lg font-semibold mb-3">초기화 단계</h3>
      <div className="not-prose space-y-2 mb-6">
        {GENESIS_STEPS.map((s, i) => (
          <motion.div key={i}
            onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors
              ${i === step ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${i === step ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                {i + 1}
              </span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose">
        <GenesisViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
