import NativeAAViz from './viz/NativeAAViz';

export default function NativeAA() {
  return (
    <section id="native-aa" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Native AA: EIP-7701 & RIP-7560</h2>
      <div className="not-prose mb-8"><NativeAAViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          ERC-4337은 프로토콜 변경 없이 AA를 구현하지만,
          Bundler 인프라와 EntryPoint 컨트랙트 호출 오버헤드가 존재합니다.<br />
          Native AA는 프로토콜 레벨에서 AA를 지원하여 이 오버헤드를 제거합니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
          <div className="rounded-xl border border-sky-200 dark:border-sky-800 p-4 bg-card">
            <h4 className="font-semibold text-sm mb-2">EIP-7701: Native AA</h4>
            <p className="text-sm text-muted-foreground">EVM 프로토콜에 AA 직접 내장. Bundler/EntryPoint 불필요. 계정 코드에 <code>validateTransaction()</code> 구현. EL이 직접 검증 및 실행.</p>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 p-4 bg-card">
            <h4 className="font-semibold text-sm mb-2">RIP-7560: Rollup Native AA</h4>
            <p className="text-sm text-muted-foreground">L2 롤업용 AA 표준. EntryPoint 로직을 프리컴파일로 구현. 컨트랙트 호출 오버헤드 제거.</p>
          </div>
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 p-4 bg-card">
            <h4 className="font-semibold text-sm mb-2">ERC-4337 vs Native AA</h4>
            <p className="text-sm text-muted-foreground">ERC-4337: 프로토콜 변경 없음, Bundler 필요. Native AA: 프로토콜 변경 필요, 낮은 가스, 간단한 구조. 장기적으로 대체 전망.</p>
          </div>
        </div>
        <p className="leading-7">
          zkSync Era, StarkNet 등 일부 L2는 이미 Native AA를 구현했습니다.<br />
          이더리움 L1은 EIP-7701로 점진적 도입을 논의 중입니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Native AA 구현 및 비교</h3>

        <h4 className="font-semibold mt-4 mb-3">타임라인</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-xl border p-3 bg-card">
            <p className="font-semibold text-sm">2020</p>
            <p className="text-sm text-muted-foreground">EIP-2938 (Native AA tx) — 거부</p>
          </div>
          <div className="rounded-xl border p-3 bg-card">
            <p className="font-semibold text-sm">2021</p>
            <p className="text-sm text-muted-foreground">ERC-4337 (pseudo-AA) — 채택</p>
          </div>
          <div className="rounded-xl border p-3 bg-card">
            <p className="font-semibold text-sm">2023</p>
            <p className="text-sm text-muted-foreground">EIP-7702 (EOA에 코드 설정) — 단순 징검다리</p>
          </div>
          <div className="rounded-xl border p-3 bg-card">
            <p className="font-semibold text-sm">2024</p>
            <p className="text-sm text-muted-foreground">EIP-7701 / RIP-7560 (Native AA) — 제안</p>
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">EIP-7702: Set EOA Code (Pectra, 2025)</h4>
        <div className="rounded-xl border p-4 bg-card text-sm mb-6">
          <p className="mb-2">EOA가 스마트 컨트랙트에 위임. 새 tx 타입 <code>0x04</code>: <code>authorization_list</code> 포함.</p>
          <p className="mb-2 text-muted-foreground">효과: EOA 코드가 <code>0xef0100 ++ address</code>로 설정 → EOA가 스마트 컨트랙트 코드를 실행.</p>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <p className="font-semibold text-xs mb-1">장점</p>
              <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                <li>기존 EOA가 스마트 지갑으로 변환</li>
                <li>배포 불필요</li>
                <li>취소 가능 (새 auth가 이전 대체)</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-xs mb-1">주의</p>
              <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                <li>스토리지는 여전히 EOA 소유</li>
                <li>nonce는 매 tx마다 증가</li>
                <li>인증에 서명 여전히 필요</li>
              </ul>
            </div>
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">EIP-7701 실행 페이즈</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-xl border p-3 bg-card">
            <p className="font-semibold text-sm mb-1">1. Validation</p>
            <p className="text-xs text-muted-foreground"><code>sender.validateTransaction(tx)</code> — 가스 제한 프레임에서 계정 코드가 검증</p>
          </div>
          <div className="rounded-xl border p-3 bg-card">
            <p className="font-semibold text-sm mb-1">2. Paymaster (선택)</p>
            <p className="text-xs text-muted-foreground"><code>paymaster.validatePaymasterTransaction(tx)</code></p>
          </div>
          <div className="rounded-xl border p-3 bg-card">
            <p className="font-semibold text-sm mb-1">3. Execution</p>
            <p className="text-xs text-muted-foreground"><code>sender.executeTransaction(tx)</code></p>
          </div>
          <div className="rounded-xl border p-3 bg-card">
            <p className="font-semibold text-sm mb-1">4. Post-op (선택)</p>
            <p className="text-xs text-muted-foreground"><code>paymaster.postPaymasterTransaction()</code></p>
          </div>
        </div>
        <div className="rounded-xl border p-3 bg-card text-sm mb-6">
          <p>모든 페이즈가 하나의 트랜잭션 내에서 실행 (Bundler 불필요). 가스 규칙: 검증/실행/postop 별도 예산.</p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">RIP-7560 (Rollup Native AA)</h4>
        <div className="rounded-xl border p-4 bg-card text-sm mb-6">
          <p>EIP-7701과 동일하나 Rollup Improvement Proposal. L2 우선 타겟 (배포 용이). 참조 구현: Geth 7560 브랜치.</p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">실제 구현: zkSync Era & StarkNet</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm mb-2">zkSync Era (2023~)</p>
            <p className="text-sm text-muted-foreground mb-2">모든 계정이 스마트 컨트랙트 (EOA 없음).</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li><code>validateTransaction()</code> — 검증</li>
              <li><code>executeTransaction()</code> — 실행</li>
              <li><code>payForTransaction()</code> — 가스 지불</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">DefaultAccount: ECDSA 호환. 커스텀: 멀티시그, MPC, 소셜 리커버리.</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm mb-2">StarkNet (2020~)</p>
            <p className="text-sm text-muted-foreground mb-2">모든 계정이 컨트랙트. Cairo 언어로 계정 로직 작성.</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li><code>__validate__</code> 엔트리포인트</li>
              <li><code>__execute__</code> 엔트리포인트</li>
              <li><code>__validate_declare__</code> / <code>__validate_deploy__</code></li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2"><code>from</code> 필드 없음 (컨트랙트가 자체 검증). 내장 서명 스킴 없음 — 100% 커스터마이즈.</p>
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">비교 매트릭스</h4>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2"></th>
                <th className="text-left p-2">ERC-4337</th>
                <th className="text-left p-2">EIP-7702</th>
                <th className="text-left p-2">EIP-7701</th>
                <th className="text-left p-2">zkSync</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b"><td className="p-2 font-medium text-foreground">프로토콜 변경</td><td className="p-2">없음</td><td className="p-2">최소</td><td className="p-2">전면</td><td className="p-2">Yes</td></tr>
              <tr className="border-b"><td className="p-2 font-medium text-foreground">Bundler 필요</td><td className="p-2">Yes</td><td className="p-2">No</td><td className="p-2">No</td><td className="p-2">No</td></tr>
              <tr className="border-b"><td className="p-2 font-medium text-foreground">EOA 지원</td><td className="p-2">공존</td><td className="p-2">위임</td><td className="p-2">공존</td><td className="p-2">없음</td></tr>
              <tr className="border-b"><td className="p-2 font-medium text-foreground">가스 비용</td><td className="p-2">높음</td><td className="p-2">중간</td><td className="p-2">낮음</td><td className="p-2">낮음</td></tr>
              <tr className="border-b"><td className="p-2 font-medium text-foreground">상태</td><td className="p-2">All EVM</td><td className="p-2">Pectra+</td><td className="p-2">제안</td><td className="p-2">운영중</td></tr>
              <tr><td className="p-2 font-medium text-foreground">복잡도</td><td className="p-2">높음</td><td className="p-2">낮음</td><td className="p-2">중간</td><td className="p-2">중간</td></tr>
            </tbody>
          </table>
        </div>

        <h4 className="font-semibold mt-6 mb-3">보안 고려사항 (Native AA)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm mb-1">1. Griefing 공격</p>
            <p className="text-sm text-muted-foreground">무효 검증이 블록 가스 낭비. 대응: 발신자별 속도 제한, 검증 가스 상한.</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm mb-1">2. 검증 프론트러닝</p>
            <p className="text-sm text-muted-foreground">공격자가 동일 검증 제출하여 nonce 소진. 대응: 원자적 검증+실행.</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm mb-1">3. 스토리지 접근</p>
            <p className="text-sm text-muted-foreground">검증 중 임의 스토리지 읽기 가능. 대응: 검증 가스 제한, EVM 규칙.</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm mb-1">4. 교차 계정 호출</p>
            <p className="text-sm text-muted-foreground">DoS 또는 재진입 가능. 대응: RIP-7562 옵코드/스토리지 제한.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
