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

      <div className="max-w-none mt-6 space-y-5">
        <h3 className="text-xl font-semibold mt-6 mb-3">TokenPair 및 양방향 변환</h3>

        {/* TokenPair 구조 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">TokenPair 구조</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3">
            <div className="rounded bg-muted p-2">
              <p className="font-medium"><code className="text-[11px]">Erc20Address</code></p>
              <p className="text-muted-foreground"><code className="text-[11px]">string</code> — 컨트랙트 주소</p>
            </div>
            <div className="rounded bg-muted p-2">
              <p className="font-medium"><code className="text-[11px]">Denom</code></p>
              <p className="text-muted-foreground"><code className="text-[11px]">string</code> — Cosmos denom</p>
            </div>
            <div className="rounded bg-muted p-2">
              <p className="font-medium"><code className="text-[11px]">Enabled</code></p>
              <p className="text-muted-foreground"><code className="text-[11px]">bool</code> — 활성 여부</p>
            </div>
            <div className="rounded bg-muted p-2">
              <p className="font-medium"><code className="text-[11px]">ContractOwner</code></p>
              <p className="text-muted-foreground"><code className="text-[11px]">Owner</code> — MODULE or EXTERNAL</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            <code className="text-[11px]">OWNER_MODULE</code>: 모듈이 컨트랙트 배포/관리 &nbsp;|&nbsp;
            <code className="text-[11px]">OWNER_EXTERNAL</code>: 외부 소유자의 ERC20
          </p>
        </div>

        {/* Conversion 흐름 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-green-500/30 bg-card p-4">
            <h4 className="text-sm font-semibold mb-2">Cosmos Coin → ERC20</h4>
            <p className="text-xs text-muted-foreground mb-2">
              <code className="text-[11px]">ConvertCoin</code> — denom: <code className="text-[11px]">"aevmos"</code>, amount: <code className="text-[11px]">100 * 10^18</code>, receiver: <code className="text-[11px]">0x1234...</code>
            </p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li><code className="text-[11px]">bankKeeper.SendCoinsFromAccountToModule</code> (escrow)</li>
              <li><code className="text-[11px]">Find TokenPair(denom)</code></li>
              <li>MODULE → <code className="text-[11px]">evmKeeper.CallEVM(mint, receiver, amount)</code></li>
              <li>Emit events</li>
            </ol>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-card p-4">
            <h4 className="text-sm font-semibold mb-2">ERC20 → Cosmos Coin</h4>
            <p className="text-xs text-muted-foreground mb-2">
              <code className="text-[11px]">ConvertERC20</code> — erc20: <code className="text-[11px]">0xABCD...</code>, amount: <code className="text-[11px]">100 * 10^18</code>, receiver: <code className="text-[11px]">evmos1xyz...</code>
            </p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li><code className="text-[11px]">Find TokenPair(erc20_address)</code></li>
              <li>MODULE → <code className="text-[11px]">evmKeeper.CallEVM(burn, sender, amount)</code></li>
              <li><code className="text-[11px]">bankKeeper.SendCoinsFromModuleToAccount</code> (release)</li>
              <li>Emit events</li>
            </ol>
          </div>
        </div>

        {/* Precision + Registration + Revenue */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-semibold mb-2">Precision Handling</h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li><code className="text-[11px]">"aevmos"</code> = 10^-18 EVMOS</li>
              <li><code className="text-[11px]">"wei"</code> = 10^-18 ETH → 1:1 매핑</li>
              <li><code className="text-[11px]">"uatom"</code> = 10^-6 ATOM → 18자리 필요</li>
              <li><code className="text-[11px]">x/precisebank</code>가 차이 해결</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-semibold mb-2">Token Registration</h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Governance proposal로 등록</li>
              <li><code className="text-[11px]">RegisterCoinProposal</code> — Cosmos Coin</li>
              <li><code className="text-[11px]">RegisterERC20Proposal</code> — ERC20</li>
              <li>거버넌스 승인 후 활성화</li>
            </ul>
          </div>
          <div className="rounded-lg border border-muted bg-card p-4">
            <h4 className="text-sm font-semibold mb-2">Revenue Module (x/revenue)</h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>dApp 개발자 수익 공유 시스템</li>
              <li>Contract deployer → % of gas fees</li>
              <li>Developer incentive</li>
              <li className="text-red-400/70">2024년 deprecated (일부 chain)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
