import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import PrecompileSteps from './viz/PrecompileSteps';

const STEPS = [
  { label: '프리컴파일 카테고리 4가지', body: 'EVM 기본(Berlin) + ICosmos + ERC20Registry + JSONUtils.\nKeeper.precompiles()에서 등록하여 EVM에 주입.' },
  { label: 'EVM 기본 프리컴파일', body: 'go-ethereum이 제공하는 표준 프리컴파일.\necRecover(0x01), SHA256(0x02), RIPEMD-160(0x03), bn256 등.\nBerlin 하드포크 규칙에 따라 활성화.' },
  { label: 'ICosmos 프리컴파일', body: 'EVM에서 Cosmos 기능 호출의 핵심.\nexecute_cosmos: IBC 전송·스테이킹·거버넌스를 Solidity에서 실행.\nquery_cosmos: 화이트리스트 기반 Cosmos gRPC 쿼리.\n서명자 검증으로 권한 확인.' },
  { label: 'ERC20 Registry 프리컴파일', body: 'Cosmos denom ↔ ERC20 컨트랙트 주소 양방향 매핑.\nregister_erc20_store: 사용자 ERC20 스토어 등록.\nCosmos 네이티브 토큰이 EVM에서 ERC20으로 동작.' },
  { label: 'JSONUtils 프리컴파일', body: 'Solidity의 JSON 파싱 한계를 보완.\nCosmos 메시지는 JSON 형식이므로 EVM 내부에서 구성 필요.\n가스 효율적인 네이티브 JSON 처리.' },
];

const CODE_MAP = ['mini-precompile-reg', 'mini-precompile-reg', 'mini-execute-cosmos', 'mini-precompile-reg', 'mini-precompile-reg'];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function Precompiles({ onCodeRef }: Props) {
  return (
    <section id="precompiles" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프리컴파일: EVM-Cosmos 브릿지</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        MiniEVM의 프리컴파일 — EVM에서 Cosmos 기능에 접근하는 네이티브 인터페이스.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <PrecompileSteps step={step} />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef(CODE_MAP[step], codeRefs[CODE_MAP[step]])} />
                <span className="text-[10px] text-muted-foreground">
                  {step === 2 ? 'cosmos/contract.go' : 'precompiles.go'}
                </span>
              </div>
            )}
          </div>
        )}
      </StepViz>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">프리컴파일 인터페이스 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// MiniEVM Precompile Architecture
//
// Standard EVM precompiles (0x01 - 0x09):
//   0x01: ecRecover (signature recovery)
//   0x02: sha256
//   0x03: ripemd-160
//   0x04: identity (data copy)
//   0x05: modexp (modular exponentiation)
//   0x06: bn256Add (curve add)
//   0x07: bn256Mul (curve mul)
//   0x08: bn256Pairing (pairing check)
//   0x09: blake2f
//
// MiniEVM adds custom precompiles at higher addresses:
//   0x...ICosmos: Cosmos integration
//   0x...ERC20Registry: token mapping
//   0x...JSONUtils: JSON encoding helpers

// ICosmos precompile (KEY innovation):
//
//   interface ICosmos {
//     function execute_cosmos(string calldata jsonMsg) external;
//       // Queue a Cosmos SDK Msg for dispatch
//       // e.g., IBC transfer, staking delegation
//
//     function query_cosmos(string calldata reqJSON) external view
//       returns (string memory);
//       // Query Cosmos state (whitelisted queries only)
//
//     function to_denom(address token) external view
//       returns (string memory);
//       // Convert ERC20 address -> Cosmos denom
//
//     function to_erc20(string calldata denom) external view
//       returns (address);
//       // Convert Cosmos denom -> ERC20 address
//   }
//
//   Address: common.HexToAddress("0x00...CAFE")
//   (fixed address, known to all contracts)

// Execute_cosmos mechanism:
//
//   Solidity side:
//     string memory ibc_msg = '{
//       "@type": "/ibc.applications.transfer.v1.MsgTransfer",
//       "source_port": "transfer",
//       "source_channel": "channel-0",
//       "token": {"denom":"uinit","amount":"1000000"},
//       "sender": "init1...",
//       "receiver": "osmo1...",
//       "timeout_timestamp": 1234567890000000000
//     }';
//     ICosmos(COSMOS).execute_cosmos(ibc_msg);
//
//   Precompile side (Go):
//     func executeCosmos(jsonMsg string, caller common.Address) {
//         // 1. Parse JSON to sdk.Msg
//         msg := unmarshalCosmosMsg(jsonMsg)
//
//         // 2. Validate signer == caller (authorization)
//         signers := msg.GetSigners()
//         require(signers[0] == cosmosFromEVMAddr(caller))
//
//         // 3. Queue for dispatch (after EVM completes)
//         k.queueCosmosMsg(ctx, msg, caller, callbackId)
//     }

// Why queue instead of direct execute?
//
//   Problem: Cosmos Msg execution can MODIFY state
//   that EVM already read/cached
//   Could cause inconsistency within single EVM tx
//
//   Solution: EXECUTE-AFTER-EVM pattern
//     1. EVM runs, precompiles queue Cosmos msgs
//     2. EVM completes, state committed
//     3. Queued Cosmos msgs dispatched sequentially
//     4. Callbacks (if any) invoke EVM back

// Callback pattern (EVM ↔ Cosmos bidirectional):
//
//   Solidity registers callback:
//     function my_callback(uint256 result) external {
//       // handle IBC ack result
//     }
//     uint256 callbackId = ICosmos.execute_cosmos_with_callback(
//       ibc_msg, address(this), this.my_callback.selector
//     );
//
//   When IBC ack arrives:
//     1. x/ibc delivers packet ack
//     2. MiniEVM looks up callback registration
//     3. Calls contract.callback(result) via EVM
//     4. Completes in new transaction

// Query_cosmos safety:
//
//   Whitelist-based:
//     Only queries in allowed_queries list work
//     Prevents state leak attacks
//
//   Examples (whitelisted):
//     - /cosmos.bank.v1beta1.Query/Balance
//     - /cosmos.staking.v1beta1.Query/Validator
//     - /ibc.applications.transfer.v1.Query/DenomTrace
//
//   Not whitelisted:
//     - Internal module queries
//     - Non-deterministic queries (time-based)
//     - Expensive iterations

// ERC20 Registry:
//
//   Maps between Cosmos denoms and EVM ERC20 contracts
//
//   Bidirectional:
//     Cosmos side:
//       x/bank has "uinit" with 6 decimals
//     EVM side:
//       ERC20 contract at 0x...INIT with 18 decimals
//
//   Conversions:
//     Cosmos → EVM: native tokens appear as ERC20
//     EVM → Cosmos: ERC20 can be IBC-transferred
//
//   Decimal scaling:
//     Cosmos "uinit" (6 dp) * 10^12 = ERC20 INIT (18 dp)

// JSONUtils precompile:
//
//   Solidity JSON parsing is limited and expensive
//   MiniEVM provides native helpers:
//     string memory encoded = JSONUtils.marshal(data);
//     JSONUtils.stringify_uint(123);
//     JSONUtils.stringify_bytes(hash);
//
//   Used for constructing Cosmos Msgs from EVM

// Precompile gas costs:
//   execute_cosmos: ~50K gas (JSON parse + queue)
//   query_cosmos: ~10-50K gas (depends on query)
//   to_denom/to_erc20: ~5K gas (simple lookup)
//   JSONUtils helpers: ~1-10K gas each

// Security considerations:
//
//   1) Authorization:
//      execute_cosmos verifies caller == msg.signer
//      Prevents unauthorized state changes
//
//   2) Replay:
//      Cosmos sequence numbers prevent replay
//      EVM tx nonces prevent EVM replay
//
//   3) Reentrancy:
//      Cosmos msgs dispatched AFTER EVM completes
//      No reentrancy during EVM execution`}
        </pre>
      </div>
    </section>
  );
}
