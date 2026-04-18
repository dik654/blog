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
        <p className="text-sm text-muted-foreground mb-3">전통 MetaMask → Infura 흐름의 정보 누출</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">1) IP Address</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Infura가 client IP 로깅</li>
              <li>ISP 기반 지역/정체성 추적</li>
              <li>VPN으로 부분 완화</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">2) Queried Addresses</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><code>eth_getBalance</code>, <code>eth_getTransactionCount</code></li>
              <li>어떤 주소에 관심 있는지 공개</li>
              <li>Wallet balance tracking 가능</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">3) Transactions Broadcast</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><code>eth_sendRawTransaction</code></li>
              <li>TX 시간 + content + origin IP</li>
              <li>Infura만 MetaMask 사용자 전체 매핑 가능</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">4) RPC Patterns</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>어떤 DApp 사용 중인지 추론</li>
              <li>UX 행동 패턴 (balance check 빈도 등)</li>
              <li>Timing analysis</li>
            </ul>
          </div>
        </div>
        <div className="bg-muted rounded-lg p-4 not-prose">
          <p className="text-sm font-semibold mb-2">위협 행위자</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-background px-2 py-1 rounded">Infura/Alchemy 직원 (insider)</span>
            <span className="bg-background px-2 py-1 rounded">Infrastructure-level 해커</span>
            <span className="bg-background px-2 py-1 rounded">Government subpoena</span>
            <span className="bg-background px-2 py-1 rounded">ISP eavesdropper</span>
            <span className="bg-background px-2 py-1 rounded">Analytics firms (Chainalysis)</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Kohaku의 3계층 Privacy</h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="bg-muted rounded-lg p-4 border-l-4 border-blue-400">
            <p className="text-sm font-semibold mb-2">Layer 1: Helios (Trust Minimization)</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Light client + Merkle proof 검증</li>
              <li>Infura 대신 Sync Committee trust</li>
              <li>"Don't trust, verify"</li>
            </ul>
            <p className="text-xs mt-2 text-blue-500 font-medium">위협 완화: RPC가 거짓말 못 함</p>
          </div>
          <div className="bg-muted rounded-lg p-4 border-l-4 border-green-400">
            <p className="text-sm font-semibold mb-2">Layer 2: ORAM (Query Privacy)</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Oblivious RAM 기반 access pattern 숨김</li>
              <li>실제 쿼리 + 가짜 쿼리 혼합</li>
              <li>RPC는 어떤 주소/slot 관심인지 모름</li>
            </ul>
            <p className="text-xs mt-2 text-green-500 font-medium">위협 완화: wallet tracking 방어</p>
          </div>
          <div className="bg-muted rounded-lg p-4 border-l-4 border-purple-400">
            <p className="text-sm font-semibold mb-2">Layer 3: Dandelion++ (TX Privacy)</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Anonymous TX broadcasting</li>
              <li>Stem phase: 일대일 P2P hop</li>
              <li>Fluff phase: gossip network</li>
            </ul>
            <p className="text-xs mt-2 text-purple-500 font-medium">위협 완화: TX origin hiding</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">조합 효과</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Helios — "서버 신뢰 제거"</li>
              <li>ORAM — "어떤 주소인지 숨김"</li>
              <li>Dandelion++ — "누가 보냈는지 숨김"</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">독립적 모듈화</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>사용자가 필요한 layer 선택</li>
              <li>Performance vs Privacy 조절</li>
              <li>기존 wallet에 incrementally 통합</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
