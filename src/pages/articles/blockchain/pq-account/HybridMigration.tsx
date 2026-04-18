import MigrationViz from './viz/MigrationViz';

export default function HybridMigration() {
  return (
    <section id="hybrid-migration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">하이브리드 전환: ECDSA → PQ</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          양자 위협은 아직 현실화되지 않았지만, 준비는 지금 시작해야 합니다.
          ERC-4337 스마트 계정은 서명 검증 로직을 업그레이드할 수 있으므로,
          <strong>점진적 전환</strong>이 가능합니다.
        </p>
        <h3>4단계 마이그레이션</h3>
        <ol>
          <li><strong>Phase 1</strong> — AA 스마트 계정 배포, 기존 ECDSA로 운영</li>
          <li><strong>Phase 2</strong> — Dilithium 공개키 추가 등록</li>
          <li><strong>Phase 3</strong> — 하이브리드 모드: ECDSA + Dilithium 동시 검증</li>
          <li><strong>Phase 4</strong> — ECDSA 제거, PQ 전용 운영</li>
        </ol>
        <p>
          Phase 3의 하이브리드 모드는 "두 서명 모두 유효해야 통과"입니다.
          Dilithium이 깨지면 ECDSA가, ECDSA가 깨지면 Dilithium이 보호합니다.
          양쪽 모두 동시에 깨지지 않는 한 안전합니다.
        </p>
        <p className="text-sm border-l-2 border-blue-400 pl-3 bg-blue-50/50 dark:bg-blue-950/20 py-2 rounded-r">
          <strong>Insight</strong> — EOA는 프로토콜 레벨 하드포크 없이는 서명 방식을 변경할 수 없습니다.
          AA 스마트 계정만이 사용자 수준에서 양자 내성으로 전환할 수 있는 유일한 경로입니다.
        </p>
      </div>
      <div className="mt-8"><MigrationViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Phase별 구현 상세</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-blue-400 mb-2">Phase 1: ECDSA-only</p>
              <p className="text-xs text-muted-foreground mb-1"><code>SmartAccountV1</code></p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><code>owner</code>: <code>address</code> (ECDSA)</li>
                <li><code>validateUserOp()</code> &mdash; <code>ECDSA.recover(hash, sig) == owner</code></li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">Phase 2: Dilithium key 등록</p>
              <p className="text-xs text-muted-foreground mb-1"><code>SmartAccountV2</code></p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><code>dilithiumPkHash</code>: <code>bytes32</code> (추가)</li>
                <li><code>registerDilithium(pk)</code> &mdash; <code>keccak256(pk)</code> 저장</li>
                <li><code>dilithiumEnabled = false</code> (아직 비활성)</li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-500/30 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">Phase 3: Hybrid (AND)</p>
              <p className="text-xs text-muted-foreground mb-1"><code>SmartAccountV3</code></p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>signature를 <code>abi.decode</code>로 ECDSA + Dilithium 분리</li>
                <li><strong>둘 다 통과</strong>해야 유효: <code>ECDSA.recover</code> + <code>DilithiumVerifier.verify</code></li>
              </ul>
            </div>
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">Phase 4: PQ-only</p>
              <p className="text-xs text-muted-foreground mb-1"><code>SmartAccountV4</code></p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>ECDSA 제거</li>
                <li><code>DilithiumVerifier.verify(pk, hash, sig)</code>만 사용</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">Upgrade Mechanism</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-muted-foreground text-center">
              <span>Transparent/UUPS proxy</span>
              <span>Owner only upgrade</span>
              <span>Timelock (7일)</span>
              <span>Social recovery (선택)</span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Migration 실전 고려사항</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-red-400 mb-2">Trigger Events &mdash; 언제 전환?</p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>NIST PQC 표준 완전 채택 (2024~)</li>
              <li>실용적 quantum computer 등장 signal</li>
              <li>Harvest-now-decrypt-later 공격 뉴스</li>
              <li>대형 금융기관 PQ 전환 발표</li>
            </ol>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-blue-400 mb-2">Checklist (per account)</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>AA smart account 사용 중인가?</li>
                <li>Upgrade mechanism 존재?</li>
                <li>Dilithium signer 지갑 준비?</li>
                <li>Recovery 계획 설정?</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">Wallet Support (2024)</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><strong>Argent</strong>: AA 기반, PQ 연구 중</li>
                <li><strong>Safe (Gnosis)</strong>: 멀티시그, PQ module 가능</li>
                <li><strong>ZeroDev</strong>: AA SDK, PQ 통합 용이</li>
                <li><strong>Biconomy, Pimlico</strong>: PQ paymasters 계획</li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">일반 EOA 사용자</p>
              <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                <li>AA account로 먼저 migrate</li>
                <li>이후 PQ 전환</li>
                <li>대부분 사용자는 2단계 필요</li>
              </ol>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">Governance Token Holders</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Voting 시 PQ signature 지원 필요</li>
                <li>DAO tooling 업데이트 필수</li>
                <li>Snapshot signature schemes 확장</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: EOA의 근본 취약점</p>
          <p>
            <strong>문제</strong>: EOA는 프로토콜 레벨에서 ECDSA 고정<br />
            <strong>양자 이후</strong>: secp256k1 서명 scheme 영구 취약<br />
            <strong>해결 불가능</strong>: 하드포크 없이는 EOA 전환 불가
          </p>
          <p className="mt-2">
            <strong>AA의 유일성</strong>:<br />
            - 사용자가 서명 로직 선택 가능<br />
            - Upgrade 가능<br />
            - Quantum-ready<br />
            - <strong>Account Abstraction = quantum migration의 유일 경로</strong>
          </p>
        </div>

      </div>
    </section>
  );
}
