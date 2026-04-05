import ContextViz from './viz/ContextViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FVM 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('fvm-machine', codeRefs['fvm-machine'])} />
          <span className="text-[10px] text-muted-foreground self-center">fvm.rs — FVM Machine</span>
        </div>
        <p>
          FVM은 WASM 기반 가상 머신. wasmtime 런타임 위에서 Actor를 실행.<br />
          EVM 호환(FEVM)으로 Solidity 컨트랙트를 배포하고 스토리지 딜을 프로그래밍 가능
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 EVM 위에 Solidity로 스토리지 딜 프로그래밍</strong> — FEVM 덕분에<br />
          이더리움 개발자가 Filecoin 위에서 DeFi + 스토리지를 결합한 dApp을 만들 수 있음
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">FVM Architecture 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// FVM (Filecoin Virtual Machine):

// Architecture:
// - WASM-based runtime (wasmtime)
// - IPLD state storage
// - gas-metered execution
// - deterministic
// - sandboxed

// Evolution:
// - 2022: FVM v1 (built-in actors in WASM)
// - 2023: FEVM (Ethereum compat)
// - 2024: mature ecosystem
// - 2025+: production DeFi

// Layer stack:
// Application (Solidity, Rust, ...)
//   ↓
// FEVM (EVM compat)  or  FVM native
//   ↓
// WASM bytecode
//   ↓
// wasmtime runtime
//   ↓
// Host syscalls (ipld_get, ipld_put, ...)
//   ↓
// StateTree (HAMT)

// Key differences from EVM:
// 1. WASM not EVM bytecode
// 2. State: HAMT not MPT
// 3. Addresses: 5 types (ID, BLS, Secp, Actor, Delegated)
// 4. Native tokens: FIL only initially
// 5. Gas: different pricing

// FEVM (EVM on FVM):
// - Solidity contracts supported
// - MetaMask compatible
// - eth-rpc API
// - ETH addresses (Delegated f4)
// - tooling: Hardhat, Foundry, Remix

// FEVM use cases:
// - port Ethereum DeFi to Filecoin
// - storage-aware smart contracts
// - NFT markets with Filecoin storage
// - data DAOs
// - retrieval markets

// FVM Native (ref-fvm):
// - Rust implementation
// - actors in WASM
// - more powerful than EVM
// - direct syscalls
// - custom cryptography

// Supported languages:
// - Rust (primary for native)
// - Solidity (via FEVM)
// - AssemblyScript
// - C/C++ (via WASM)
// - Go (experimental)`}
        </pre>
        <p className="leading-7">
          FVM: <strong>WASM-based + IPLD state + FEVM compat</strong>.<br />
          FEVM으로 Solidity 지원 — Ethereum tooling 호환.<br />
          2022 v1 → 2023 FEVM → 2024 mature ecosystem.
        </p>
      </div>
    </section>
  );
}
