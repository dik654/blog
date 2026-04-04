import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Anti-Framework 철학 & 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Commonware — Rust 기반 오픈소스 블록체인 프리미티브 라이브러리
          <br />
          창립자 Patrick O'Grady (Ava Labs VP · Coinbase Rosetta · Avalanche HyperSDK)
        </p>
        <p className="leading-7">
          기존 Cosmos SDK, OP Stack = "프레임워크" — 커스터마이징에 Fork 필수
          <br />
          Commonware = <strong>"Anti-Framework"</strong> — 필요한 컴포넌트만 선택적으로 조합
          <br />
          VM/커널에서 영감 — 특정 애플리케이션에 맞는 프리미티브 조합
        </p>
        <p className="leading-7">
          6개 카테고리:
          <strong> consensus</strong> · <strong>broadcast</strong> · <strong>storage</strong> · <strong>cryptography</strong> · <strong>p2p</strong> · <strong>runtime</strong>
          <br />
          이 아티클은 <strong>Runtime trait이 모든 모듈을 연결하는 방식</strong>에 집중
        </p>
      </div>
      <div className="not-prose mb-8"><OverviewViz /></div>
    </section>
  );
}
