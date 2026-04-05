import { useState } from 'react';
import { motion } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import EvmConfigDetailViz from './viz/EvmConfigDetailViz';
import { BLOCK_ENV_FIELDS, TX_ENV_FIELDS } from './EvmConfigData';
import type { CodeRef } from '@/components/code/types';

export default function EvmConfig({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [tab, setTab] = useState<'block' | 'tx'>('block');
  const fields = tab === 'block' ? BLOCK_ENV_FIELDS : TX_ENV_FIELDS;

  return (
    <section id="evm-config" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EvmConfig & revm 설정</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          revm의 <code>Evm</code> 인스턴스는 두 가지 환경 설정이 필요하다.<br />
          <code>BlockEnv</code>는 블록 수준 정보(번호, 수수료, 타임스탬프)를 담고, <code>TxEnv</code>는 TX 수준 정보(발신자, 가스, 값)를 담는다.<br />
          EvmConfig trait이 헤더와 TX에서 이 값들을 추출해 revm 환경에 매핑한다.
        </p>
        <p className="leading-7">
          <strong>왜 trait인가?</strong> Geth는 EVM 환경 설정이 <code>core/vm</code>에 하드코딩되어 있다.<br />
          다른 체인을 지원하려면 코드를 직접 수정해야 한다.<br />
          Reth의 EvmConfig trait 덕분에 체인별 구현체를 교체할 수 있다.<br />
          Optimism은 L1 block info TX 등의 추가 환경만 오버라이드해서 사용한다.
        </p>
        <p className="leading-7">
          PoS 전환 이후 <code>difficulty</code>는 항상 0이다.<br />
          대신 <code>prevrandao</code>(이전 RANDAO 값)가 난수 소스로 사용된다.<br />
          <code>fill_block_env()</code>가 <code>after_merge</code> 플래그를 보고 이 분기를 처리한다.
        </p>

        {/* ── BlockEnv 필드 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BlockEnv — revm에 전달하는 블록 컨텍스트</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// revm의 BlockEnv 구조
pub struct BlockEnv {
    pub number: U256,              // 블록 번호 (BLOCKNUMBER opcode용)
    pub coinbase: Address,         // 수수료 수취인 (COINBASE opcode)
    pub timestamp: U256,           // Unix ts (TIMESTAMP opcode)
    pub gas_limit: U256,           // 블록 가스 한도 (GASLIMIT opcode)
    pub basefee: U256,             // EIP-1559 base fee (BASEFEE opcode)
    pub difficulty: U256,          // PoW 난이도 (PoS에서는 0)
    pub prevrandao: Option<B256>,  // PoS 랜덤값 (PREVRANDAO opcode)
    pub blob_excess_gas_and_price: // EIP-4844 blob gas 가격
        Option<BlobExcessGasAndPrice>,
}

// fill_block_env() 구현 예시
fn fill_block_env(block_env: &mut BlockEnv, header: &Header, after_merge: bool) {
    block_env.number = U256::from(header.number);
    block_env.coinbase = header.beneficiary;
    block_env.timestamp = U256::from(header.timestamp);
    block_env.gas_limit = U256::from(header.gas_limit);
    block_env.basefee = U256::from(header.base_fee_per_gas.unwrap_or(0));

    if after_merge {
        block_env.difficulty = U256::ZERO;
        block_env.prevrandao = Some(header.mix_hash);  // PoS RANDAO
    } else {
        block_env.difficulty = header.difficulty;
        block_env.prevrandao = None;
    }
}`}
        </pre>
        <p className="leading-7">
          <code>BlockEnv</code>의 각 필드는 EVM opcode에 1:1 매핑 — BLOCKNUMBER, COINBASE, TIMESTAMP, GASLIMIT, BASEFEE, DIFFICULTY/PREVRANDAO.<br />
          PoS 전환 후 <code>difficulty</code>는 0, 대신 <code>mix_hash</code>가 <code>prevrandao</code>로 사용 — 스마트 컨트랙트의 난수 소스.<br />
          <code>blob_excess_gas_and_price</code>는 EIP-4844 이후 추가 — blob TX의 가격 결정에 사용.
        </p>

        {/* ── TxEnv 필드 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TxEnv — TX 실행 컨텍스트</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub struct TxEnv {
    pub caller: Address,            // 발신자 (msg.sender)
    pub gas_limit: u64,             // TX 가스 한도
    pub gas_price: U256,            // effective gas price
    pub transact_to: TxKind,        // Call(address) | Create
    pub value: U256,                // 전송 ETH (wei)
    pub data: Bytes,                // calldata
    pub nonce: Option<u64>,         // nonce (None이면 검증 스킵)
    pub chain_id: Option<u64>,      // EIP-155 replay 방어
    pub access_list: Vec<AccessListItem>,  // EIP-2930
    pub gas_priority_fee: Option<U256>,    // EIP-1559 max_priority_fee
    pub blob_hashes: Vec<B256>,     // EIP-4844 blob versioned hashes
    pub max_fee_per_blob_gas: Option<U256>,
}

// effective_gas_price 계산 (TX 타입별 분기):
//
// Legacy TX: tx.gas_price (고정)
// EIP-2930 TX: tx.gas_price (고정)
// EIP-1559 TX: min(max_fee, base_fee + max_priority_fee)
// EIP-4844 TX: min(max_fee, base_fee + max_priority_fee)
//
// basefee가 이미 차감되고 남는 priority_fee가 miner에게 지급`}
        </pre>
        <p className="leading-7">
          <code>TxEnv</code>는 EVM의 <strong>msg.sender, msg.value, msg.data</strong>에 대응.<br />
          <code>gas_price</code>는 TX 타입에 따라 다르게 계산 — Legacy는 고정, EIP-1559는 base_fee 기반 동적.<br />
          <code>blob_hashes</code>는 Cancun 이후 추가 — BLOBHASH opcode의 입력.
        </p>

        {/* ── EIP-4788 beacon_root ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">EIP-4788 — Cancun 이후 beacon root 처리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Cancun (2024-03) 이후 추가된 pre-execution 훅
// EIP-4788: Beacon block root in the EVM
//
// 매 블록 실행 전에 시스템 TX를 주입:
// - target: 0xbEAC020...8002 (beacon root precompile)
// - calldata: parent_beacon_block_root
// - caller: 0xffff...fffe (시스템 주소)
// - gas: 30_000 (고정)

fn apply_beacon_root_contract_call(
    parent_beacon_block_root: B256,
    db: &mut State<DB>,
) -> Result<()> {
    let tx_env = TxEnv {
        caller: SYSTEM_ADDRESS,  // 0xffff...fffe
        transact_to: TxKind::Call(BEACON_ROOTS_ADDRESS),
        data: Bytes::from(parent_beacon_block_root.as_slice()),
        gas_limit: 30_000_000,
        ..Default::default()
    };

    // revm으로 시스템 TX 실행
    // 결과는 블록의 receipts에 포함되지 않음 (invisible TX)
    let mut evm = Evm::builder()
        .with_db(db)
        .with_tx_env(tx_env)
        .build();
    evm.transact_commit()?;
    Ok(())
}

// 스마트 컨트랙트에서 beacon root 조회:
// keccak256(timestamp) % 8191 → storage slot
// CL과 EL 간 staking 상태 증명 등에 활용`}
        </pre>
        <p className="leading-7">
          EIP-4788은 <strong>CL 상태를 EL EVM에서 증명 가능</strong>하게 만듦.<br />
          매 블록 시작 시 "시스템 TX"로 beacon root를 컨트랙트에 기록 — 스마트 컨트랙트가 읽을 수 있음.<br />
          Lido, EigenLayer 등 restaking 프로토콜의 기반 기술.
        </p>
      </div>

      <div className="not-prose mb-6"><EvmConfigDetailViz /></div>

      {/* Tab toggle for Block vs TX env */}
      <div className="not-prose mb-6">
        <div className="flex gap-2 mb-3">
          <button onClick={() => setTab('block')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${tab === 'block' ? 'bg-indigo-500 text-white' : 'bg-muted text-muted-foreground'}`}>
            BlockEnv
          </button>
          <button onClick={() => setTab('tx')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${tab === 'tx' ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>
            TxEnv
          </button>
        </div>
        <motion.div key={tab} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-border/60 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-4 py-2 font-medium">필드</th>
                <th className="text-left px-4 py-2 font-medium">소스</th>
                <th className="text-left px-4 py-2 font-medium">설명</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((f, i) => (
                <tr key={i} className="border-t border-border/30">
                  <td className="px-4 py-2 font-mono text-xs">{f.field}</td>
                  <td className="px-4 py-2 font-mono text-xs text-foreground/60">{f.source}</td>
                  <td className="px-4 py-2 text-foreground/80">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('evm-config', codeRefs['evm-config'])} />
        <span className="text-[10px] text-muted-foreground self-center">EvmConfig trait</span>
      </div>
    </section>
  );
}
