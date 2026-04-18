export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GIWA 프로젝트 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">GIWA란</h3>
        <p>
          <strong>GIWA</strong>: "기와"(한국 전통 기와지붕)에서 유래한 이름 — Korean 브랜딩 의도<br />
          <strong>OP Stack 기반 이더리움 L2</strong> — Optimism 롤업 기술 채택<br />
          리포: <code>github.com/giwa-io/node</code>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">기술 스택 요약</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">계층</th>
                <th className="border border-border px-3 py-2 text-left">구성</th>
                <th className="border border-border px-3 py-2 text-left">비고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">프레임워크</td>
                <td className="border border-border px-3 py-2">OP Stack</td>
                <td className="border border-border px-3 py-2">Optimism 오픈소스 롤업 스택</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">L1</td>
                <td className="border border-border px-3 py-2">Ethereum</td>
                <td className="border border-border px-3 py-2">데이터 가용성·보안 의존</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Execution Client</td>
                <td className="border border-border px-3 py-2">Geth / Reth</td>
                <td className="border border-border px-3 py-2">둘 다 지원 (선택 가능)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Consensus Layer</td>
                <td className="border border-border px-3 py-2">op-node</td>
                <td className="border border-border px-3 py-2">L1 state → L2 block 파생</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">배포</td>
                <td className="border border-border px-3 py-2">Docker Compose</td>
                <td className="border border-border px-3 py-2">Shell scripts 기반 자동화</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">테스트넷</td>
                <td className="border border-border px-3 py-2">Sepolia 기반</td>
                <td className="border border-border px-3 py-2">현재 운영 중</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">메인넷</td>
                <td className="border border-border px-3 py-2">준비 중</td>
                <td className="border border-border px-3 py-2">출시 전</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">OP Stack 선택의 의미</h3>
        <p>
          GIWA가 OP Stack 채택한 이유:<br />
          <strong>1. 검증된 보안</strong> — Optimism·Base·World Chain 등 성공 사례 다수<br />
          <strong>2. 이더리움 생태계 접근</strong> — EVM 호환, 기존 DeFi 재사용<br />
          <strong>3. Superchain 비전</strong> — 여러 OP Stack 체인 간 interoperability<br />
          <strong>4. 한국 팀 독립성</strong> — 자체 체인 운영하되 공통 인프라 공유
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">OP Stack 아키텍처 (L2 동작 원리)</h3>
        <p>
          OP Stack L2의 트랜잭션 흐름:
        </p>
        <p>
          <strong>1. Sequencer 수신</strong><br />
          사용자가 GIWA에 트랜잭션 전송 → Sequencer가 순서 결정<br />
          &quot;soft confirmation&quot; 즉시 제공 (수 초 내)
        </p>
        <p>
          <strong>2. L1 배치 게시</strong><br />
          Sequencer가 batch로 묶어 이더리움 L1에 게시 (calldata)<br />
          주기: 약 2분<br />
          L1 게시 시점에 "finalized"
        </p>
        <p>
          <strong>3. 상태 전이</strong><br />
          op-node(CL)가 L1 calldata 읽고 L2 블록 파생<br />
          execution client(geth/reth)가 실제 상태 업데이트
        </p>
        <p>
          <strong>4. Challenge Window</strong><br />
          7일간 누구나 fraud proof 제출 가능<br />
          이 기간 후 "withdrawal 최종성" 확정
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">하드웨어 요구사항</h3>
        <div className="not-prose grid sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="font-semibold text-sm mb-2">Minimum (테스트넷)</p>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="font-mono">CPU</span><span>4 cores</span>
              <span className="font-mono">RAM</span><span>8GB</span>
              <span className="font-mono">Storage</span><span>500GB NVMe SSD</span>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="font-semibold text-sm mb-2">Recommended (아카이브 노드)</p>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="font-mono">CPU</span><span>8+ cores</span>
              <span className="font-mono">RAM</span><span>16GB+</span>
              <span className="font-mono">Storage</span><span>1TB+ NVMe SSD</span>
            </div>
          </div>
        </div>
        <div className="not-prose rounded-lg border border-border bg-card p-4 my-4">
          <p className="font-semibold text-sm mb-2">이더리움 풀 노드 대비</p>
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="font-mono">Ethereum Archive</span><span>12TB+</span>
            <span className="font-mono">GIWA Archive</span><span>1TB+ (L2이므로 적음)</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">3가지 Sync 전략</h3>
        <p>
          <strong>Snap Sync</strong> (프로덕션):<br />
          최신 상태 스냅샷만 다운로드 → 빠른 시작<br />
          과거 블록 실행 없음 → 히스토리컬 쿼리 불가
        </p>
        <p>
          <strong>Archive Sync</strong> (인덱싱·리서치):<br />
          제네시스부터 모든 블록 실행<br />
          완전한 히스토리 보유 — 저장 공간 多
        </p>
        <p>
          <strong>Consensus-Driven Sync</strong> (L2 verifier):<br />
          CL이 EL에 직접 블록 주입<br />
          L2 peer discovery 불필요 — 단순 운영
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 왜 OP Stack을 선택했는가</p>
          <p>
            GIWA가 자체 체인 대신 <strong>OP Stack 채택</strong>한 전략적 이유:
          </p>
          <p className="mt-2">
            ✓ <strong>Time-to-market</strong>: 제로부터 체인 개발 vs 검증된 스택 포크<br />
            ✓ <strong>보안 상속</strong>: Optimism·Base에서 battle-test된 코드<br />
            ✓ <strong>이더리움 보안</strong>: DA·finality를 이더리움에 의존 → 높은 보안<br />
            ✓ <strong>개발자 친화</strong>: EVM 호환 → 기존 툴 재사용
          </p>
          <p className="mt-2">
            <strong>한국 시장 전략적 측면</strong>:<br />
            - 독립 주권 체인 유지 (타 OP Stack 체인과 동등)<br />
            - 자체 거버넌스·수수료 구조<br />
            - Korean 특화 스테이블코인·서비스 구축 가능
          </p>
        </div>

      </div>
    </section>
  );
}
