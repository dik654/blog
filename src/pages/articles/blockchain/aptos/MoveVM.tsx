import MoveVMViz from './viz/MoveVMViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function MoveVM({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="move-vm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Move VM</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Move — 리소스 안전성을 타입 시스템에서 보장하는 스마트 컨트랙트 언어<br />
          이중 지출, 자산 소멸 같은 버그를 컴파일 타임에 원천 차단
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('apt-move-abilities', codeRefs['apt-move-abilities'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              coin.move — Coin 구조체
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <MoveVMViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Move 언어 자원 안전성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Move Language Resource Safety
//
// Philosophy:
//   "Digital assets as first-class resources"
//   Inspired by linear logic + Rust ownership
//
// vs Solidity:
//   Solidity: balance = mapping(address => uint)
//     - Balances are just numbers
//     - Easy to forget underflow, double-credit
//   Move: Coin<APT> is a struct
//     - Coin object itself moves between accounts
//     - Cannot be duplicated or silently destroyed
//     - Type system enforces invariants

// Abilities (type capabilities):
//
//   struct Coin<phantom CoinType> has store {
//       value: u64,
//   }
//
//   abilities:
//     copy   — can be duplicated (value types)
//     drop   — can be destroyed (most types)
//     store  — can exist inside global storage
//     key    — can be at top-level of an account
//
//   Coin has store, but NOT copy, NOT drop:
//     → cannot duplicate or lose coins!
//     → must move into other struct or split

// Resource lifecycle:
//
//   Create:
//     let coin = Coin<APT> { value: 100 };
//   Move:
//     move_to(&account, coin);
//   Split:
//     let part = coin::extract(&mut coin, 30);
//     // coin.value = 70, part.value = 30
//   Merge:
//     coin::merge(&mut coin, part);
//   Destroy (must be explicit):
//     let Coin { value: _ } = coin;
//     // DESTRUCTURED, value extracted

// Type safety examples:
//
//   Invalid (does not compile):
//     fun double_spend(coin: Coin<APT>) {
//         send(alice, coin);  // moved
//         send(bob, coin);    // ERROR: used after move
//     }
//
//   Invalid (does not compile):
//     fun silent_burn(coin: Coin<APT>) {
//         // coin goes out of scope
//     } // ERROR: unused resource
//
//   Valid:
//     fun transfer(from: &signer, to: address, amount: u64) {
//         let coin = withdraw(from, amount);
//         deposit(to, coin);
//     }

// Global storage model:
//
//   Storage: map<(address, type) → resource>
//
//   move_to<T: key>(account, value: T)
//     → storage[(addr, T)] = value
//
//   move_from<T: key>(addr): T
//     → value = storage[(addr, T)]; storage.remove((addr, T))
//
//   borrow_global<T: key>(addr): &T
//   borrow_global_mut<T: key>(addr): &mut T
//
//   Each (address, type) is unique slot
//   No mappings needed for single owner

// Generic programming:
//
//   Coin<CoinType> is parameterized
//   Coin<APT>, Coin<USDC>, Coin<BTC> all different types
//   Same code, different types
//
//   Phantom types:
//     phantom CoinType: NOT stored in runtime
//     Just a compile-time marker
//     Zero gas cost

// Move bytecode verifier:
//
//   Before execution, Move VM verifies:
//     1. Type checking
//     2. Resource safety (no duplication/loss)
//     3. Reference safety (no dangling pointers)
//     4. Stack balance
//     5. Linking (all called functions exist)
//
//   Only verified bytecode can execute
//   → entire classes of bugs eliminated statically

// Move vs Sui Move:
//
//   Aptos Move (original Move):
//     - Global storage by address
//     - Account-centric
//     - Similar to Diem Move
//
//   Sui Move:
//     - Object-centric (no global storage)
//     - Objects have unique IDs
//     - Parallelism via ownership
//     - Dynamic fields
//
//   Different execution models!
//   Code often not portable between them.

// Aptos Move features beyond Diem:
//
//   - Tables (Table<K, V>) for efficient storage
//   - Events with streaming
//   - Fungible Asset (FA) standard
//   - Object model (v2)
//   - Cryptography primitives (Ristretto255, BLS)
//   - Randomness API (on-chain VRF)`}
        </pre>
      </div>
    </section>
  );
}
