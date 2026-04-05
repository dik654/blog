import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import ERC20Steps from './ERC20Steps';

const STEPS = [
  { label: 'ERC20 양방향 변환 구조', body: 'Cosmos Coin ↔ ERC20 토큰 양방향 변환.\nTokenPair로 매핑 관리, IBC 전송 시에도 자동 변환.' },
  { label: 'Cosmos Coin → ERC20 변환', body: '1. Cosmos 코인을 모듈에 에스크로.\n2. 코인 잠금.\n3. 대응 ERC20 토큰을 사용자에게 민팅.' },
  { label: 'ERC20 → Cosmos Coin 변환', body: '1. ERC20 토큰을 모듈에 전송.\n2. ERC20 토큰을 번(burn).\n3. 에스크로된 Cosmos 코인을 사용자에게 전송.' },
  { label: 'TokenPair 구조체', body: 'Erc20Address(컨트랙트 주소) + Denom(Cosmos denomination) + Enabled(활성화).\nContractOwner로 소유권 관리.' },
];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function RevenueModule({ onCodeRef }: Props) {
  return (
    <section id="revenue-module" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ERC20 & Revenue 모듈</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        Cosmos 네이티브 코인과 ERC20 토큰 간 양방향 변환 시스템.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <ERC20Steps step={step} />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef('ev-token-pair', codeRefs['ev-token-pair'])} />
                <span className="text-[10px] text-muted-foreground">token_pair.go</span>
              </div>
            )}
          </div>
        )}
      </StepViz>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">TokenPair 및 양방향 변환</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// x/erc20 Module 상세
//
// TokenPair 구조:
//
// type TokenPair struct {
//     Erc20Address  string          // 컨트랙트 주소
//     Denom         string          // Cosmos denom
//     Enabled       bool            // 활성 여부
//     ContractOwner Owner           // OWNER_MODULE or OWNER_EXTERNAL
// }
//
// OwnerType:
//   OWNER_MODULE: 모듈이 컨트랙트 배포/관리
//   OWNER_EXTERNAL: 외부 소유자의 ERC20

// Conversion 흐름:
//
// Cosmos Coin → ERC20:
//
//   사용자 요청: ConvertCoin
//     denom: "aevmos"
//     amount: 100 * 10^18
//     receiver: 0x1234...
//
//   모듈 처리:
//     1. bankKeeper.SendCoinsFromAccountToModule
//        (escrow user's coins)
//     2. Find TokenPair(denom)
//     3. If ContractOwner == MODULE:
//          evmKeeper.CallEVM(mint, receiver, amount)
//        Else:
//          require escrow already held
//     4. Emit events
//
// ERC20 → Cosmos Coin:
//
//   사용자 요청: ConvertERC20
//     erc20_address: 0xABCD...
//     amount: 100 * 10^18
//     receiver: evmos1xyz...
//
//   모듈 처리:
//     1. Find TokenPair(erc20_address)
//     2. If ContractOwner == MODULE:
//          evmKeeper.CallEVM(burn, sender, amount)
//        Else:
//          evmKeeper.CallEVM(transfer, sender, module)
//     3. bankKeeper.SendCoinsFromModuleToAccount
//        (release escrowed coins)
//     4. Emit events

// Precision Handling:
//   Cosmos: "aevmos" = 10^-18 EVMOS
//   Ethereum: "wei" = 10^-18 ETH
//   → 1:1 매핑 가능 (둘 다 18 decimals)
//
//   다른 체인:
//     "uatom" = 10^-6 ATOM
//     Ethereum expects 18 decimals
//     → x/precisebank가 해결

// 자동 Token Registration:
//   Governance proposal로 TokenPair 등록
//   RegisterCoinProposal: Cosmos Coin 등록
//   RegisterERC20Proposal: ERC20 등록
//   → 거버넌스 승인 후 활성화

// Revenue Module (x/revenue):
//   dApp 개발자 수익 공유 시스템
//   Contract deployer → % of gas fees
//   Developer incentive
//   2024년 deprecated (일부 chain)`}
        </pre>
      </div>
    </section>
  );
}
