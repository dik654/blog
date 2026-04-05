import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import OverviewSteps from './OverviewSteps';

const STEPS = [
  { label: 'EVM 통합 3가지 접근법 비교', body: '이더리움 네이티브 / Octane(외부 geth 연결) / MiniEVM(Cosmos 모듈 내부 임베딩).\nInitia는 세 번째 방식 — EVM을 x/evm 모듈로 직접 임베딩.' },
  { label: '이더리움 네이티브: CL + Engine API + EL', body: 'Beacon Chain이 Engine API로 geth와 통신.\n가장 표준적인 구조이지만 Cosmos 생태계와 호환 불가.' },
  { label: 'Octane: CometBFT → Engine API → geth', body: 'ABCI 콜백을 Engine API로 변환하여 외부 geth를 연결.\n장점: EL 클라이언트 재활용 / 단점: IPC 통신 오버헤드.' },
  { label: 'MiniEVM: Cosmos 모듈 안에 EVM 임베딩', body: 'go-ethereum의 EVM을 x/evm Keeper 내부에서 직접 실행.\nCosmos IBC와 EVM이 같은 상태 공간 공유 — 네이티브 상호운용.' },
];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Initia MiniEVM 개요</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        Initia의 MiniEVM — Cosmos SDK 모듈로 구현된 경량 EVM.<br />
        EVM을 Cosmos 모듈 내부에 직접 임베딩하여 IBC + EVM 네이티브 통합.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <OverviewSteps step={step} />
            {onCodeRef && step === 3 && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef('mini-keeper', codeRefs['mini-keeper'])} />
                <span className="text-[10px] text-muted-foreground">keeper.go</span>
              </div>
            )}
          </div>
        )}
      </StepViz>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Initia MiniEVM 아키텍처</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Initia MiniEVM Overview
//
// Initia:
//   L1 blockchain built for rollup interop
//   InitiaOS: Cosmos SDK + customizations
//   Supports multiple VMs: MoveVM, MiniWasm, MiniEVM
//
// MiniEVM philosophy:
//   "EVM as a Cosmos module"
//   Not a separate chain, not Engine API
//   Direct integration at module level

// Three EVM integration approaches:
//
//   1) Native Ethereum architecture:
//      Beacon Chain (CL) + Engine API + geth (EL)
//      Two separate processes, Engine API bridge
//      Used: Ethereum, Berachain BeaconKit
//      Pro: maximum compatibility
//      Con: complex, IBC not native
//
//   2) Octane / Decoupled:
//      CometBFT → Engine API → external geth
//      ABCI converted to EL protocol
//      Pro: reuses geth client
//      Con: IPC overhead, state sync complexity
//
//   3) MiniEVM / Embedded:
//      EVM executed INSIDE Cosmos SDK module
//      go-ethereum's EVM imported as library
//      Keeper directly calls evm.Call()
//      Pro: native IBC integration, single state tree
//      Con: less compatibility surface

// Why MiniEVM vs other Cosmos EVMs?
//
//   Evmos / Cosmos EVM:
//     Similar module approach
//     Adds x/vm, x/erc20, x/feemarket, x/precisebank
//     4 modules, heavier
//
//   MiniEVM:
//     Single x/evm module (lighter)
//     Reuses Cosmos modules: x/auth, x/bank
//     Minimalist design
//     Closer to "EVM precompile" style

// Core components:
//
//   x/evm module:
//     Keeper: manages EVM state
//     MsgServer: handles EVM calls
//     StateDB adapter: Cosmos KVStore -> EVM StateDB
//     Precompiles: Cosmos function exposure
//
//   Uses standard Cosmos modules:
//     x/auth: account sequences (nonces)
//     x/bank: token balances
//     x/ibc: cross-chain messaging

// State mapping details:
//
//   EVM address ↔ Cosmos address:
//     hex(20 bytes) <-> bech32 with chain prefix
//     Bijection established via x/auth
//
//   EVM balance:
//     balance[addr] = bank.GetBalance(addr, denom)
//     Shared pool with Cosmos tokens
//
//   EVM nonce:
//     nonce[addr] = auth.GetSequence(addr)
//     Incremented on each EVM tx
//
//   EVM storage:
//     KVStore key: address || slot
//     KVStore value: 32-byte word
//     Flat structure (no MPT tree)
//
//   EVM code:
//     KVStore key: codeHash
//     KVStore value: bytecode
//     Content-addressed deduplication

// Advantages of single state tree:
//
//   No consistency issues between EL and CL state
//   IBC tokens visible to EVM natively
//   Staking rewards auto-credited to EVM addresses
//   Atomic cross-operation (e.g., IBC+ERC20 in one tx)

// Precompile-based Cosmos access:
//
//   From Solidity:
//     interface ICosmos {
//       function execute_cosmos(string memory msg) external;
//       function query_cosmos(string memory req) external view returns (string memory);
//       function to_denom(address token) external view returns (string memory);
//       function to_erc20(string memory denom) external view returns (address);
//     }
//
//   ICosmos precompile at fixed address
//   Enables IBC transfers, staking, etc. from contracts

// Use cases:
//   - Rollup built on Initia (uses MiniEVM)
//   - EVM dApps with native IBC
//   - Cross-VM composability (EVM + Move)
//   - Interoperable stable swaps

// Comparison:
//
//                  MiniEVM    Evmos    Berachain
//   Architecture   Module     Module   Engine API
//   EVM source     go-eth     go-eth   reth/geth
//   CL engine      CometBFT   CometBFT BeaconKit
//   IBC native     Yes        Yes      No (needs bridge)
//   State tree     Shared     Shared   Separate
//   Gas model      Cosmos+EVM EIP-1559 Hybrid`}
        </pre>
      </div>
    </section>
  );
}
