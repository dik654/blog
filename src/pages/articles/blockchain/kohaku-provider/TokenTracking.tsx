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
        <div className="not-prose space-y-3 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Simple Variable Layout</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><code>uint256 count</code> → slot 0</li>
                <li><code>bool active</code> → slot 1</li>
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Mapping Layout</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><code>mapping(address =&gt; uint256) balances</code> → slot 0</li>
                <li><code>mapping(address =&gt; mapping(address =&gt; uint256)) allowances</code> → slot 1</li>
              </ul>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Mapping Slot 계산</p>
            <p className="text-sm text-muted-foreground"><code>balances[alice]</code>의 storage slot = <code>keccak256(pad32(alice) + pad32(slot_num))</code></p>
            <div className="bg-background rounded px-3 py-2 mt-2 text-xs text-muted-foreground font-mono overflow-x-auto">
              <p>alice = 0x742d35Cc6639C6c7B1B13B6C4fA8ec89b33CD1ab</p>
              <p>slot_num = 0</p>
              <p>computed_slot = keccak256(</p>
              <p className="pl-4">0x000...742d35cc6639c6c7b1b13b6c4fa8ec89b33cd1ab +</p>
              <p className="pl-4">0x000...0000</p>
              <p>)</p>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Rust 구현: <code>compute_balance_slot(addr, mapping_slot)</code></p>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1) 64바이트 input 버퍼 생성 — <code>[0u8; 64]</code></li>
              <li>2) 앞 32바이트: address (left-padded) — <code>input[12..32].copy_from_slice(&amp;addr.0)</code></li>
              <li>3) 뒤 32바이트: mapping slot — <code>input[32+24..64].copy_from_slice(&amp;mapping_slot.to_be_bytes())</code></li>
              <li>4) <code>Keccak::v256().update(&amp;input).finalize()</code> → <code>[u8; 32]</code> 슬롯</li>
            </ol>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Verified Token Balance</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2"><code>get_erc20_balance_verified(token, holder)</code> — Helios 전체 검증</p>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1) <code>compute_balance_slot(holder, 0)</code> — storage slot 계산 (대부분 ERC-20은 slot 0, 컨트랙트마다 다를 수 있음)</li>
              <li>2) <code>provider.get_proof(token, vec![slot], BlockId::Latest)</code> — RPC에서 proof 요청</li>
              <li>3) <code>helios.get_verified_header()</code> → <code>verify_proof(&amp;proof, block_header.state_root)</code> — state root 검증</li>
              <li>4) <code>U256::from_be_bytes(proof.storage_proof[0].value)</code> — proof에서 잔액 추출</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Slot 호환성</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Standard OpenZeppelin → slot 0</li>
                <li>Upgradeable/proxy contracts → 다를 수 있음</li>
                <li>Layout 분석 필요</li>
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">성능 vs Security</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Proof verification: ~1-5ms</li>
                <li>Untrusted RPC response: ~100ms</li>
                <li>보안을 위한 추가 overhead</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
