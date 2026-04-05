import type { CodeRef } from '@/components/code/types';
import TokenTrackingViz from './viz/TokenTrackingViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function TokenTracking({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="token-tracking" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">토큰 잔액 추적 (ERC-20/721)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          ERC-20 <code>balanceOf</code>는 Solidity 매핑이다.
          <br />
          스토리지 슬롯 = <code>keccak256(address || slot_number)</code>로 계산한다.
        </p>
        <p className="leading-7">
          Helios <code>get_proof</code>로 스토리지 Merkle 증명을 받아 로컬에서 검증한다.
          <br />
          풀 노드 없이도 특정 주소의 정확한 토큰 잔액을 확인할 수 있다.
        </p>
        <p className="leading-7">
          ERC-721(NFT)도 같은 패턴이다. <code>tokenId || OWNER_SLOT</code>으로 소유자 슬롯을 계산한다.
          <br />
          증명 기반이므로 RPC가 거짓 소유자를 반환할 수 없다.
        </p>
      </div>
      <div className="not-prose"><TokenTrackingViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Storage Slot Calculation</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Solidity storage layout

// Simple variable
contract Counter {
    uint256 public count;  // slot 0
    bool public active;    // slot 1
}

// Mapping
contract Token {
    mapping(address => uint256) public balances;  // slot 0
    mapping(address => mapping(address => uint256)) public allowances;  // slot 1
}

// Storage slot for mapping value
// balances[alice] storage slot?
// = keccak256(abi.encode(alice, uint256(slot_num)))
// = keccak256(pad32(alice) + pad32(0))

// Example
alice = 0x742d35Cc6639C6c7B1B13B6C4fA8ec89b33CD1ab
slot_num = 0
computed_slot = keccak256(
    "0x000000000000000000000000742d35cc6639c6c7b1b13b6c4fa8ec89b33cd1ab" +
    "0x0000000000000000000000000000000000000000000000000000000000000000"
)

// Rust 구현
use ethers::types::U256;
use tiny_keccak::{Hasher, Keccak};

fn compute_balance_slot(addr: Address, mapping_slot: u64) -> [u8; 32] {
    let mut keccak = Keccak::v256();
    let mut input = [0u8; 64];

    // First 32 bytes: address (left-padded)
    input[12..32].copy_from_slice(&addr.0);

    // Second 32 bytes: mapping slot
    input[32 + 24..64].copy_from_slice(&mapping_slot.to_be_bytes());

    keccak.update(&input);
    let mut output = [0u8; 32];
    keccak.finalize(&mut output);
    output
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Verified Token Balance</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Full verification with Helios

async fn get_erc20_balance_verified(
    token: Address,
    holder: Address,
) -> Result<U256> {
    // 1) Compute storage slot
    // 대부분 ERC-20은 balances mapping을 slot 0에 두지만
    // 컨트랙트마다 다를 수 있음 (layout 분석 필요)
    let slot = compute_balance_slot(holder, 0);

    // 2) Request proof from RPC
    let proof = provider.get_proof(
        token,
        vec![slot],
        BlockId::Latest,
    ).await?;

    // 3) Verify state root (Helios)
    let block_header = helios.get_verified_header().await?;
    verify_proof(&proof, block_header.state_root)?;

    // 4) Extract balance from proof
    let balance = U256::from_be_bytes(
        proof.storage_proof[0].value
    );

    Ok(balance)
}

// 일반 ERC-20 (balanceOf는 slot 0)
// Custom contracts may differ
// - Zero (0x0) for standard OpenZeppelin
// - Different for upgradeable/proxy contracts

// 성능 vs Security trade-off
// - proof verification: ~1-5ms
// - Untrusted RPC response: ~100ms
// - Extra overhead for security`}</pre>

      </div>
    </section>
  );
}
