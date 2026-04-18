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

      <div className="mt-6 space-y-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">프리컴파일 인터페이스 상세</h3>

        {/* 표준 EVM 프리컴파일 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">표준 EVM 프리컴파일 (0x01 - 0x09)</h4>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-2"><code className="text-xs">0x01</code> ecRecover</div>
            <div className="rounded bg-muted/50 p-2"><code className="text-xs">0x02</code> sha256</div>
            <div className="rounded bg-muted/50 p-2"><code className="text-xs">0x03</code> ripemd-160</div>
            <div className="rounded bg-muted/50 p-2"><code className="text-xs">0x04</code> identity</div>
            <div className="rounded bg-muted/50 p-2"><code className="text-xs">0x05</code> modexp</div>
            <div className="rounded bg-muted/50 p-2"><code className="text-xs">0x06</code> bn256Add</div>
            <div className="rounded bg-muted/50 p-2"><code className="text-xs">0x07</code> bn256Mul</div>
            <div className="rounded bg-muted/50 p-2"><code className="text-xs">0x08</code> bn256Pairing</div>
            <div className="rounded bg-muted/50 p-2"><code className="text-xs">0x09</code> blake2f</div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">MiniEVM 커스텀 프리컴파일은 상위 주소에 등록: <code className="text-xs">ICosmos</code> (Cosmos 통합), <code className="text-xs">ERC20Registry</code> (토큰 매핑), <code className="text-xs">JSONUtils</code> (JSON 인코딩)</p>
        </div>

        {/* ICosmos 프리컴파일 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">ICosmos 프리컴파일 (핵심 혁신)</h4>
          <div className="space-y-3 text-xs text-muted-foreground">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded bg-muted/50 p-3">
                <code className="text-xs font-medium text-foreground">execute_cosmos(string calldata jsonMsg) external</code>
                <p className="mt-1">Cosmos SDK Msg를 큐에 등록. IBC 전송, 스테이킹 위임 등 실행</p>
              </div>
              <div className="rounded bg-muted/50 p-3">
                <code className="text-xs font-medium text-foreground">query_cosmos(string calldata reqJSON) external view returns (string memory)</code>
                <p className="mt-1">Cosmos 상태 쿼리 (화이트리스트 기반만 허용)</p>
              </div>
              <div className="rounded bg-muted/50 p-3">
                <code className="text-xs font-medium text-foreground">to_denom(address token) external view returns (string memory)</code>
                <p className="mt-1">ERC20 주소 → Cosmos denom 변환</p>
              </div>
              <div className="rounded bg-muted/50 p-3">
                <code className="text-xs font-medium text-foreground">to_erc20(string calldata denom) external view returns (address)</code>
                <p className="mt-1">Cosmos denom → ERC20 주소 변환</p>
              </div>
            </div>
            <p>주소: <code className="text-xs">common.HexToAddress("0x00...CAFE")</code> — 고정 주소, 모든 컨트랙트에 알려짐</p>
          </div>
        </div>

        {/* execute_cosmos 메커니즘 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">execute_cosmos 메커니즘</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">Solidity 측</span>
              <p className="mt-1">JSON 형식의 Cosmos 메시지(예: <code className="text-xs">MsgTransfer</code>)를 구성하고 <code className="text-xs">ICosmos(COSMOS).execute_cosmos(ibc_msg)</code> 호출. source_port, source_channel, token, sender, receiver, timeout 등을 JSON으로 직렬화</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">프리컴파일 측 (Go)</span>
              <ol className="mt-1 list-decimal list-inside space-y-0.5">
                <li>JSON → <code className="text-xs">sdk.Msg</code> 파싱 (<code className="text-xs">unmarshalCosmosMsg</code>)</li>
                <li>서명자 == 호출자 검증 (<code className="text-xs">msg.GetSigners()[0] == cosmosFromEVMAddr(caller)</code>)</li>
                <li>디스패치 큐에 등록 (<code className="text-xs">k.queueCosmosMsg(ctx, msg, caller, callbackId)</code>)</li>
              </ol>
            </div>
          </div>
        </div>

        {/* 왜 큐잉인가 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">왜 즉시 실행이 아닌 큐잉인가?</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded border-l-2 border-red-500 bg-muted/50 p-3">
              <span className="font-medium text-foreground">문제</span>
              <p className="mt-1">Cosmos Msg 실행이 EVM이 이미 읽거나 캐싱한 상태를 수정할 수 있음. 단일 EVM tx 내에서 불일치 발생 가능</p>
            </div>
            <div className="rounded border-l-2 border-emerald-500 bg-muted/50 p-3">
              <span className="font-medium text-foreground">해결: EXECUTE-AFTER-EVM 패턴</span>
              <ol className="mt-1 list-decimal list-inside space-y-0.5">
                <li>EVM 실행, 프리컴파일이 Cosmos 메시지 큐잉</li>
                <li>EVM 완료, 상태 커밋</li>
                <li>큐잉된 Cosmos 메시지 순차 디스패치</li>
                <li>콜백(있는 경우) EVM 재호출</li>
              </ol>
            </div>
          </div>
        </div>

        {/* 콜백 패턴 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">콜백 패턴 (EVM ↔ Cosmos 양방향)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">Solidity에서 콜백 등록</span>
              <p className="mt-1"><code className="text-xs">execute_cosmos_with_callback(ibc_msg, address(this), this.my_callback.selector)</code>로 콜백 함수 등록. 콜백은 IBC ack 결과를 처리</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">IBC ack 도착 시</span>
              <ol className="mt-1 list-decimal list-inside space-y-0.5">
                <li><code className="text-xs">x/ibc</code>가 packet ack 전달</li>
                <li>MiniEVM이 콜백 등록 조회</li>
                <li>EVM을 통해 <code className="text-xs">contract.callback(result)</code> 호출</li>
                <li>새 트랜잭션에서 완료</li>
              </ol>
            </div>
          </div>
        </div>

        {/* query_cosmos 안전성 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">query_cosmos 안전성</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">화이트리스트 허용</span>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li><code className="text-xs">/cosmos.bank.v1beta1.Query/Balance</code></li>
                <li><code className="text-xs">/cosmos.staking.v1beta1.Query/Validator</code></li>
                <li><code className="text-xs">/ibc.applications.transfer.v1.Query/DenomTrace</code></li>
              </ul>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">비허용</span>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li>내부 모듈 쿼리</li>
                <li>비결정론적 쿼리 (시간 기반)</li>
                <li>비용 높은 이터레이션</li>
              </ul>
              <p className="mt-1">상태 유출 공격 방지가 목적</p>
            </div>
          </div>
        </div>

        {/* ERC20 Registry */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">ERC20 Registry</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">양방향 매핑</span>
              <p className="mt-1">Cosmos <code className="text-xs">x/bank</code>의 <code className="text-xs">"uinit"</code>(6dp) ↔ EVM ERC20 컨트랙트 <code className="text-xs">0x...INIT</code>(18dp)</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">변환</span>
              <p className="mt-1">Cosmos → EVM: 네이티브 토큰이 ERC20으로 표현. EVM → Cosmos: ERC20를 IBC 전송 가능</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">소수점 스케일링</span>
              <p className="mt-1"><code className="text-xs">Cosmos "uinit"(6dp) * 10^12 = ERC20 INIT(18dp)</code></p>
            </div>
          </div>
        </div>

        {/* JSONUtils */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">JSONUtils 프리컴파일</h4>
          <div className="rounded bg-muted/50 p-3 text-xs text-muted-foreground">
            <p>Solidity의 JSON 파싱은 제한적이고 비용이 높음. MiniEVM이 네이티브 헬퍼 제공</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <div className="rounded bg-background p-2"><code className="text-xs">JSONUtils.marshal(data)</code></div>
              <div className="rounded bg-background p-2"><code className="text-xs">JSONUtils.stringify_uint(123)</code></div>
              <div className="rounded bg-background p-2"><code className="text-xs">JSONUtils.stringify_bytes(hash)</code></div>
            </div>
            <p className="mt-2">EVM에서 Cosmos Msg를 구성할 때 사용</p>
          </div>
        </div>

        {/* 가스 비용 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">프리컴파일 가스 비용</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-2"><code className="text-xs">execute_cosmos</code> ~50K gas (JSON 파싱 + 큐잉)</div>
            <div className="rounded bg-muted/50 p-2"><code className="text-xs">query_cosmos</code> ~10-50K gas (쿼리에 따라)</div>
            <div className="rounded bg-muted/50 p-2"><code className="text-xs">to_denom / to_erc20</code> ~5K gas (단순 조회)</div>
            <div className="rounded bg-muted/50 p-2"><code className="text-xs">JSONUtils</code> 헬퍼 각 ~1-10K gas</div>
          </div>
        </div>

        {/* 보안 고려 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">보안 고려 사항</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">1) 권한 검증</span>
              <p className="mt-1"><code className="text-xs">execute_cosmos</code>가 <code className="text-xs">caller == msg.signer</code> 확인. 비인가 상태 변경 방지</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">2) 리플레이 방지</span>
              <p className="mt-1">Cosmos sequence number + EVM tx nonce 이중 방어</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">3) 재진입 방지</span>
              <p className="mt-1">Cosmos 메시지는 EVM 완료 후 디스패치. EVM 실행 중 재진입 불가</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
