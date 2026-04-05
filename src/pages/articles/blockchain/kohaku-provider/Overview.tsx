import type { CodeRef } from '@/components/code/types';
import OverviewViz from './viz/OverviewViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프레임워크 아키텍처 & 위협 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          MetaMask로 Infura에 요청하면 IP, 조회 주소, TX가 전부 노출된다.
          <br />
          RPC 서버가 사용자의 자산 흐름을 완전히 프로파일링할 수 있다.
        </p>
        <p className="leading-7">
          Kohaku는 세 가지 프라이버시 컴포넌트를 조합한 프레임워크다.
          <br />
          <strong>Helios</strong>(검증) + <strong>ORAM</strong>(쿼리 프라이버시) + <strong>Dandelion++</strong>(TX 프라이버시).
        </p>
        <p className="leading-7">
          각 컴포넌트가 독립적으로 교체 가능하다.
          <br />
          Helios 없이 ORAM만 써도 되고, Dandelion만 빼도 된다.
        </p>
      </div>
      <div className="not-prose"><OverviewViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Privacy Threat Model</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 전통 MetaMask → Infura 흐름의 정보 누출

// 1) IP Address
// - Infura가 client IP 로깅
// - ISP 기반 지역·정체성 추적
// - VPN으로 부분 완화

// 2) Queried Addresses
// - eth_getBalance, eth_getTransactionCount
// - 어떤 주소 관심 있는지 공개
// - Wallet balance tracking 가능

// 3) Transactions Broadcast
// - eth_sendRawTransaction
// - TX 시간 + content + origin IP
// - Infura만 MetaMask 사용자 전체 매핑 가능

// 4) RPC Patterns
// - 어떤 DApp 사용 중인지 추론
// - UX 행동 패턴 (balance check 빈도 등)
// - Timing analysis

// 누가 위협인가?
// - Infura/Alchemy 직원 (insider)
// - Infrastructure-level 해커
// - Government subpoena
// - ISP eavesdropper
// - Analytics firms (Chainalysis)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Kohaku의 3계층 Privacy</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Layer 1: Helios (Trust Minimization)
// - Light client, merkle proof 검증
// - Infura 대신 sync committee trust
// - "Don't trust, verify"
// - 위협 완화: RPC가 거짓말 못 함

// Layer 2: ORAM (Query Privacy)
// - Oblivious RAM 기반 access pattern 숨김
// - 실제 쿼리 + 가짜 쿼리 혼합
// - RPC는 어떤 주소/slot 관심인지 모름
// - 위협 완화: wallet tracking 방어

// Layer 3: Dandelion++ (TX Privacy)
// - Anonymous TX broadcasting
// - Stem phase: 일대일 P2P hop
// - Fluff phase: gossip network
// - 위협 완화: TX origin hiding

// 조합 효과
// - Helios: "서버 신뢰 제거"
// - ORAM: "어떤 주소인지 숨김"
// - Dandelion++: "누가 보냈는지 숨김"

// 독립적 모듈화
// - 사용자가 필요한 layer 선택
// - Performance vs privacy 조절
// - 기존 wallet에 incrementally 통합`}</pre>

      </div>
    </section>
  );
}
