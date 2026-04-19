import DevToolsViz from './viz/DevToolsViz';
import CliCommandsViz from './viz/CliCommandsViz';
import HardhatFoundryViz from './viz/HardhatFoundryViz';
import ClientSdkViz from './viz/ClientSdkViz';
import RoflDevViz from './viz/RoflDevViz';
import CliConfigTomlViz from './viz/CliConfigTomlViz';

export default function DeveloperTools() {
  return (
    <section id="developer-tools" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개발자 도구</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Oasis CLI</h3>
        <p>
          <strong>oasis CLI</strong>: Go + Cobra 기반 계층적 명령줄 도구<br />
          <strong>네트워크 관리</strong>, 지갑 생성, 계정 관리, 런타임 상호작용<br />
          <strong>@oasisprotocol/cli</strong> npm 패키지로 배포 (docker, brew, binary)<br />
          macOS/Linux/Windows 전부 지원
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">주요 명령 카테고리</h3>
      </div>
      <div className="not-prose mb-4"><CliCommandsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Hardhat/Foundry 통합</h3>
      </div>
      <div className="not-prose mb-4"><HardhatFoundryViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Sapphire 클라이언트 SDK</h3>
      </div>
      <div className="not-prose mb-4"><ClientSdkViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">ROFL App 개발</h3>
      </div>
      <div className="not-prose mb-4"><RoflDevViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">CLI 명령어 & 설정 시스템</h3>
      </div>
      <DevToolsViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">설정 파일 구조</h3>
      </div>
      <div className="not-prose mb-4"><CliConfigTomlViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Sapphire의 Ethereum 호환성 수준</p>
          <p>
            <strong>완벽 호환</strong>:<br />
            ✓ Solidity 0.4 ~ 0.8.x 그대로<br />
            ✓ Hardhat, Foundry, Remix, Truffle<br />
            ✓ Metamask, WalletConnect, OpenZeppelin<br />
            ✓ 표준 EVM opcodes (Shanghai 기준)
          </p>
          <p className="mt-2">
            <strong>Sapphire 전용 기능</strong>:<br />
            ✗ 기밀 calldata → wrapper 필수<br />
            ✗ view function 서명 → signed query<br />
            ✗ KM 공개키 의존 → 온라인 조회 필요<br />
            ✗ Precompile은 Sapphire 전용 주소
          </p>
          <p className="mt-2">
            <strong>마이그레이션 전략</strong>:<br />
            - 1단계: 기존 컨트랙트 그대로 배포 (public 모드)<br />
            - 2단계: 민감한 state 변수만 private 키워드 추가<br />
            - 3단계: 클라이언트 SDK 교체<br />
            - 전체 재작성 불필요
          </p>
        </div>

      </div>
    </section>
  );
}
