import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import ProviderTraitViz from './viz/ProviderTraitViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ProviderTrait({ onCodeRef }: Props) {
  return (
    <section id="provider-trait" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Provider trait 조합 패턴</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>Provider</code> trait은 3개 async 메서드로 추상화된다.
          <br />
          <code>get_balance</code>, <code>get_nonce</code>, <code>call</code> — 구현체만 교체하면 된다.
        </p>
        <p className="leading-7">
          <code>KohakuProvider</code>는 <code>HeliosClient</code> + <code>ORAMProxy</code> + <code>DandelionRouter</code>를 조합한다.
          <br />
          테스트 시 MockProvider를 주입하면 네트워크 없이 단위 테스트가 가능하다.
        </p>
      </div>
      <div className="not-prose">
        <ProviderTraitViz />
        <div className="flex items-center gap-2 mt-3 justify-end">
          <CodeViewButton onClick={() => onCodeRef('kh-provider', codeRefs['kh-provider'])} />
          <span className="text-[10px] text-muted-foreground">provider.rs</span>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Provider Trait 추상화</h3>
        <p className="text-sm text-muted-foreground mb-3">모든 Ethereum 통신의 단일 추상화 — <code>Provider</code> trait</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">기본 Query</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><code>get_balance(addr, block)</code> → <code>Result&lt;U256&gt;</code></li>
              <li><code>get_nonce(addr, block)</code> → <code>Result&lt;u64&gt;</code></li>
              <li><code>get_code(addr, block)</code> → <code>Result&lt;Bytes&gt;</code></li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Call Execution</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><code>call(tx, block)</code> → <code>Result&lt;Bytes&gt;</code></li>
              <li><code>estimate_gas(tx)</code> → <code>Result&lt;U256&gt;</code></li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Transaction</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><code>send_raw_transaction(raw)</code> → <code>Result&lt;TxHash&gt;</code></li>
              <li><code>get_transaction(hash)</code> → <code>Result&lt;Option&lt;Tx&gt;&gt;</code></li>
              <li><code>get_transaction_receipt(hash)</code> → <code>Result&lt;Option&lt;Receipt&gt;&gt;</code></li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Block Data</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><code>get_block(id)</code> → <code>Result&lt;Option&lt;Block&gt;&gt;</code></li>
              <li><code>get_block_number()</code> → <code>Result&lt;u64&gt;</code></li>
            </ul>
          </div>
        </div>

        <p className="text-sm font-semibold mb-2">Composition 패턴: <code>KohakuProvider</code></p>
        <div className="bg-muted rounded-lg p-4 not-prose mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-3">
            <div className="bg-background rounded px-3 py-2 text-center">
              <p className="font-medium">helios</p>
              <p className="text-xs text-muted-foreground"><code>HeliosClient</code></p>
              <p className="text-[10px] text-muted-foreground">Trust-minimized 검증</p>
            </div>
            <div className="bg-background rounded px-3 py-2 text-center">
              <p className="font-medium">oram</p>
              <p className="text-xs text-muted-foreground"><code>ORAMProxy</code></p>
              <p className="text-[10px] text-muted-foreground">Query privacy</p>
            </div>
            <div className="bg-background rounded px-3 py-2 text-center">
              <p className="font-medium">dandelion</p>
              <p className="text-xs text-muted-foreground"><code>DandelionRouter</code></p>
              <p className="text-[10px] text-muted-foreground">TX privacy</p>
            </div>
            <div className="bg-background rounded px-3 py-2 text-center">
              <p className="font-medium">fallback</p>
              <p className="text-xs text-muted-foreground"><code>Box&lt;dyn Provider&gt;</code></p>
              <p className="text-[10px] text-muted-foreground">backup (Infura)</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><code>get_balance</code> — ORAM으로 query 익명화 → Helios로 Merkle proof 검증 → <code>response.balance</code> 반환</p>
            <p><code>send_raw_transaction</code> — Dandelion++로 익명 전파</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Mock Provider (testing)</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2"><code>MockProvider</code> 구조</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><code>balances</code>: <code>Arc&lt;RwLock&lt;HashMap&lt;Address, U256&gt;&gt;&gt;</code> — 주소별 잔액 저장</li>
              <li><code>txs</code>: <code>Arc&lt;RwLock&lt;Vec&lt;Bytes&gt;&gt;&gt;</code> — 전송된 TX 기록</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Provider 구현</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><code>get_balance</code> — <code>balances.read().get(&amp;addr)</code>로 조회, 없으면 0</li>
              <li><code>send_raw_transaction</code> — <code>keccak256(&amp;raw)</code>로 해시 생성, <code>txs</code>에 push</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">단위 테스트 흐름</p>
            <p className="text-sm text-muted-foreground">
              <code>MockProvider::new()</code> → <code>set_balance(addr, 1000)</code> → <code>Wallet::new(Box::new(mock))</code> → <code>wallet.balance_of(addr)</code> 검증
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-1 rounded">네트워크 무관 테스트</span>
            <span className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-1 rounded">빠른 CI/CD</span>
            <span className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-1 rounded">Determinism (reproducible)</span>
            <span className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-1 rounded">에러 시뮬레이션 쉬움</span>
          </div>
        </div>

      </div>
    </section>
  );
}
