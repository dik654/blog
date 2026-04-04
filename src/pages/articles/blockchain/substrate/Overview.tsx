import SDKArchViz from './viz/SDKArchViz';
import CodePanel from '@/components/ui/code-panel';

const STRUCTURE_CODE = `Polkadot SDK
├── Substrate          # 블록체인 개발 프레임워크
│   ├── FRAME 시스템    # 팔렛 기반 모듈화
│   ├── 런타임 (WASM)   # 포크 없는 업그레이드
│   ├── 합의 (BABE/GRANDPA)
│   └── libp2p 네트워킹
├── Polkadot           # 릴레이 체인 구현
│   ├── 공유 보안       # 파라체인 보안 제공
│   ├── 검증자 시스템
│   └── DOT 스테이킹
├── Cumulus            # 파라체인 개발 도구
│   ├── XCM 지원
│   └── 콜레이터 시스템
└── Bridges            # 외부 네트워크 연결
    ├── Snowbridge (이더리움)
    └── 릴레이어 시스템`;

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 아키텍처'}</h2>
      <div className="not-prose mb-8">
        <SDKArchViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Polkadot SDK</strong>(구 Substrate) — Parity Technologies의 모듈화 블록체인 프레임워크<br />
          Substrate, Polkadot, Cumulus, Bridges 네 핵심 컴포넌트로 상호 운용 가능한 멀티체인 생태계 구축<br />
          FRAME 팔렛 시스템 — 비즈니스 로직에만 집중 가능, WASM 런타임으로 포크 없는 업그레이드 지원
        </p>
        <CodePanel
          title="Polkadot SDK 컴포넌트 구조"
          code={STRUCTURE_CODE}
          annotations={[
            { lines: [2, 6], color: 'sky', note: 'Substrate: 코어 프레임워크' },
            { lines: [7, 10], color: 'emerald', note: 'Polkadot: 릴레이 체인' },
            { lines: [11, 13], color: 'amber', note: 'Cumulus: 파라체인 도구' },
            { lines: [14, 16], color: 'violet', note: 'Bridges: 외부 브릿지' },
          ]}
        />
      </div>
    </section>
  );
}
