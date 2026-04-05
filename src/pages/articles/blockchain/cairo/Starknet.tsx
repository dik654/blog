import CodePanel from '@/components/ui/code-panel';
import StarknetContractViz from './viz/StarknetContractViz';
import {
  CONTRACT_CODE, CONTRACT_ANNOTATIONS,
  ABI_CODE, ABI_ANNOTATIONS,
} from './StarknetData';

export default function Starknet({ title }: { title?: string }) {
  return (
    <section id="starknet" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Starknet 컨트랙트 컴파일'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Starknet 컨트랙트는 일반 Cairo 프로그램과 달리 플러그인 기반 처리,
          ABI 생성, 클래스 해시 계산 등 추가적인 컴파일 단계가 필요합니다.
          <code>cairo-lang-starknet</code> crate가 이를 담당합니다.
        </p>
      </div>

      <StarknetContractViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>플러그인 시스템 & 컨트랙트 발견</h3>
        <CodePanel title="starknet_plugin_suite()" code={CONTRACT_CODE}
          annotations={CONTRACT_ANNOTATIONS} />

        <h3>ABI 생성 & 클래스 해시</h3>
        <CodePanel title="ABI Builder + ContractClass" code={ABI_CODE}
          annotations={ABI_ANNOTATIONS} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Starknet 컨트랙트 모델</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Starknet Contract Architecture
//
// Contract vs Class separation:
//
//   Contract Class:
//     The "code" (Sierra/CASM bytecode)
//     Identified by class_hash
//     Deployed once (declared)
//     Can be instantiated many times
//
//   Contract Instance:
//     An address running a class
//     Identified by contract_address
//     Has its own storage
//     contract_address = hash(class_hash, salt, ...)
//
//   Benefits:
//     Reuse code across many instances
//     Upgrade via replace_class_hash
//     Save gas on deployment

// Contract declaration flow:
//
//   1. Developer writes Cairo contract
//   2. scarb build → Sierra + CASM
//   3. starkli declare → sends declare tx
//   4. Network verifies Sierra compiles to CASM
//   5. class_hash computed:
//      class_hash = poseidon(
//        CONTRACT_CLASS_VERSION,
//        external_functions_hash,
//        l1_handlers_hash,
//        constructors_hash,
//        abi_hash,
//        sierra_program_hash
//      )
//   6. Sequencer stores class

// Contract deployment:
//
//   1. User calls deploy_syscall(class_hash, salt, args)
//   2. Computes contract_address:
//      CONTRACT_ADDRESS_PREFIX = 'STARKNET_CONTRACT_ADDRESS'
//      address = pedersen_hash_array(
//        CONTRACT_ADDRESS_PREFIX,
//        deployer_address,
//        salt,
//        class_hash,
//        constructor_calldata_hash
//      ) mod 2^251 - ...
//   3. Creates storage slot
//   4. Runs constructor

// Entry points:
//
//   #[external(v0)] fn transfer(...) { ... }
//     ↓
//   External entry point
//   Callable from users/other contracts
//
//   #[l1_handler] fn receive_from_l1(...) { ... }
//     ↓
//   L1→L2 message handler
//   Called by StarkGate
//
//   #[constructor] fn constructor(...) { ... }
//     ↓
//   Called once at deploy time
//
// Entry points indexed by selector:
//   selector = starknet_keccak(function_name) mod 2^250

// Storage layout:
//
//   #[storage] struct Storage {
//     balance: u256,
//     owners: Map<ContractAddress, bool>,
//     allowances: Map<(ContractAddress, ContractAddress), u256>,
//   }
//
//   Compiles to storage slots:
//     balance → sn_keccak('balance')
//     owners[addr] → sn_keccak('owners') XOR addr (hash chain)
//     allowances[(a,b)] → hash of keys
//
//   Slots are felt252 addresses in global storage tree

// ABI:
//
//   Auto-generated from Sierra
//   Describes:
//     - Function signatures
//     - Events
//     - Structs/enums used
//     - Interfaces implemented
//
//   JSON format used by:
//     - Wallet UIs
//     - SDK clients
//     - Explorers

// Plugin system:
//
//   Starknet-specific syntactic transformations:
//     #[contract] → expands to storage + dispatch
//     #[abi] → generates ABI entries
//     #[event] → indexed event handling
//     #[storage] → storage slot mapping
//     component! → composable modules
//
//   Implemented as Cairo 1 macros
//   Run during lowering phase

// Account abstraction (native):
//
//   ALL Starknet accounts are contracts
//   Must implement __validate__, __execute__
//
//   Custom validation:
//     - ECDSA (stark curve)
//     - Multisig
//     - WebAuthn
//     - Paymaster
//     - ZK-based

// Upgradability:
//
//   replace_class_hash(new_class) syscall
//   Contract can point to new code
//   Storage layout preserved
//   Owner must be careful with slot compatibility`}
        </pre>
      </div>
    </section>
  );
}
