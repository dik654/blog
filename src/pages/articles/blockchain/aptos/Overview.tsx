import AptosArchViz from './viz/AptosArchViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Aptos 아키텍처 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Aptos — Meta Diem 파생 L1 블록체인<br />
          <strong>Block-STM 병렬 실행</strong> + <strong>Move 언어</strong> + DiemBFT v4 합의
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('apt-blockstm-exec', codeRefs['apt-blockstm-exec'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              executor.rs — Block-STM 코어
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <AptosArchViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Aptos 아키텍처 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Aptos Blockchain Architecture
//
// History:
//   2019: Meta/Facebook announces Libra
//   2020: Rebrand to Diem
//   2022: Diem project shut down, team spins out:
//     - Aptos Labs (Diem core → Aptos)
//     - Mysten Labs (Diem experimental → Sui)
//   2022-10: Aptos mainnet launch
//
// Core innovations from Diem:
//   - Move language (resource-oriented)
//   - DiemBFT v4 (HotStuff variant)
//   - Block-STM (parallel execution)
//
// Aptos-specific changes:
//   - Account model: objects + resource groups
//   - Gas meter: per-object charge
//   - Fungible Asset standard (FA) replacing Coin
//
// Layered architecture:
//
//   ┌─────────────────────────┐
//   │ Application (Move dApps)│
//   ├─────────────────────────┤
//   │ Move VM + Aptos Framework│
//   ├─────────────────────────┤
//   │ Execution (Block-STM)   │
//   ├─────────────────────────┤
//   │ Consensus (DiemBFT v4)  │
//   ├─────────────────────────┤
//   │ Mempool (Quorum Store)  │
//   ├─────────────────────────┤
//   │ Storage (Jellyfish MPT) │
//   └─────────────────────────┘
//
// Performance claims (testnet):
//   ~20K TPS peak
//   ~500ms time-to-finality
//   Sub-second block time
//
// Competitors:
//   - Sui (sister chain from Mysten)
//   - Solana (Sealevel parallel exec)
//   - Monad (EVM + parallel exec)

// Aptos Framework (aptos-core):
//
//   aptos-framework/sources/:
//     account.move              // account management
//     coin.move                 // legacy coin standard
//     fungible_asset.move       // new FA standard
//     object.move               // object model
//     staking_contract.move     // staking
//     aptos_governance.move     // on-chain governance
//     reconfiguration.move      // epoch change

// Account model (Aptos-specific):
//
//   Standard account:
//     address: 32-byte hex
//     authentication_key: hash of pubkey
//     sequence_number: per-account nonce
//
//   Resource Account:
//     Programmatic owner
//     No private key
//     Used for dApp-owned resources
//
//   Multi-signer transaction:
//     Transaction can require signers[A, B]
//     Both must authorize before execution`}
        </pre>
      </div>
    </section>
  );
}
