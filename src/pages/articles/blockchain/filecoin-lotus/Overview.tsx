export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Filecoin Lotus 아키텍처 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Lotus는 Filecoin 프로토콜의 Go 참조 구현체입니다.
          이더리움이 "화폐 + 스마트 컨트랙트" 플랫폼이라면,
          Filecoin은 <strong>"분산 스토리지 + 검증 가능한 저장 증명"</strong> 플랫폼입니다.
          이더리움의 EL+CL 구조와 비교하면 Lotus는 훨씬 복잡한 다층 아키텍처를 가집니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">이더리움 vs Filecoin 아키텍처</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`이더리움                          Filecoin (Lotus)
┌────────────────────┐          ┌────────────────────────┐
│  Consensus Layer   │          │  Expected Consensus     │
│  (Casper FFG)      │          │  (Tipset 기반)          │
├────────────────────┤          ├────────────────────────┤
│  Execution Layer   │          │  FVM (Filecoin VM)      │
│  (EVM)             │          │  + Built-in Actors      │
├────────────────────┤          ├────────────────────────┤
│  State (MPT)       │          │  State (HAMT + AMT)     │
├────────────────────┤          ├────────────────────────┤
│  P2P (devp2p)      │          │  P2P (libp2p)           │
├────────────────────┤          ├────────────────────────┤
│                    │          │  Storage Market         │
│  (해당 없음)       │          │  (Deal Making)          │
│                    │          ├────────────────────────┤
│                    │          │  Storage Proving        │
│                    │          │  (PoRep, PoSt)          │
└────────────────────┘          └────────────────────────┘

Filecoin만의 고유 레이어:
  - Storage Market: 스토리지 제공자와 클라이언트 매칭
  - Storage Proving: 데이터가 실제로 저장되어 있음을 암호학적으로 증명`}</code>
        </pre>
      </div>
    </section>
  );
}
