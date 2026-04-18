import UseCaseViz from './viz/UseCaseViz';

export default function UseCases() {
  return (
    <section id="use-cases" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AA 활용: 소셜 로그인, 세션 키, 배치</h2>
      <div className="not-prose mb-8"><UseCaseViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>소셜 로그인 (Passkey / WebAuthn)</h3>
        <p className="leading-7">
          사용자가 생체 인증(Face ID, 지문)으로 트랜잭션에 서명합니다.<br />
          P-256(secp256r1) 서명을 validateUserOp()에서 검증합니다.<br />
          시드 구문 없이 지갑을 생성하고 사용할 수 있습니다.
        </p>

        <h3>세션 키 (Session Key)</h3>
        <p className="leading-7">
          제한된 권한의 임시 키를 발급합니다.<br />
          유효 기간, 호출 가능 함수, 지출 한도를 온체인에서 강제합니다.<br />
          게임, DeFi 자동화 등 빈번한 트랜잭션에 적합합니다.
        </p>

        <h3>배치 트랜잭션 (Batch Transaction)</h3>
        <p className="leading-7">
          approve + swap을 하나의 UserOp로 묶어 실행합니다.<br />
          사용자 경험이 향상되고 가스도 절약됩니다.<br />
          executeBatch()로 여러 콜데이터를 순차 실행합니다.
        </p>

        <h3>가스 대납 (Paymaster)</h3>
        <p className="leading-7">
          프로젝트가 사용자의 가스비를 대신 지불합니다.<br />
          ERC-20 토큰으로 가스 결제, 무료 체험, 구독 모델 등이 가능합니다.<br />
          Web2 수준의 온보딩 경험을 제공합니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">AA 활용 패턴 구현 상세</h3>

        <h4 className="font-semibold mt-4 mb-3">1. Passkey / WebAuthn 인증</h4>
        <div className="rounded-xl border p-4 bg-card text-sm mb-6">
          <p className="mb-2">Secure Enclave에서 P-256 키쌍 생성. 개인키는 디바이스 밖으로 나가지 않음. Face ID / Touch ID / Windows Hello로 서명.</p>
          <p className="mb-2 text-muted-foreground"><code>validateUserOp()</code>: <code>sha256(authenticatorData || sha256(clientData))</code> 해시에 대해 P-256 <code>ecRecover</code>로 공개키 검증.</p>
          <p className="text-muted-foreground">가스: ~200K (RIP-7212 P-256 프리컴파일 적용 시 ~20K). 운영: Coinbase Smart Wallet, Safe&#123;Wallet&#125;, OKX.</p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">2. Session Keys</h4>
        <div className="rounded-xl border p-4 bg-card text-sm mb-6">
          <p className="mb-3">DeFi 자동화 등 빈번한 서명 문제를 해결. 제한된 권한의 임시 키를 위임.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
            {[
              ['signer', '임시 키 주소'],
              ['validAfter', '시작 시간'],
              ['validUntil', '만료 시간'],
              ['targets[]', '허용 컨트랙트'],
              ['selectors[]', '허용 함수'],
              ['spendLimit', '윈도우당 최대 ETH'],
            ].map(([field, desc]) => (
              <div key={field} className="rounded-lg border p-2 bg-background">
                <code className="text-xs">{field}</code>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground"><code>validateUserOp()</code>: 세션 미만료 + 타겟 화이트리스트 확인 후 <code>ecRecover</code>. 운영: Argent X, Zerion, Sequence.</p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">3. 배치 실행</h4>
        <div className="rounded-xl border p-4 bg-card text-sm mb-6">
          <p className="mb-2"><code>executeBatch(targets[], values[], datas[])</code> — EntryPoint만 호출 가능. 각 타겟에 대해 <code>call&#123;value&#125;(data)</code> 순차 실행.</p>
          <div className="rounded-lg border p-3 bg-background mt-3">
            <p className="font-semibold text-xs mb-1">DEX 스왑 예시</p>
            <p className="text-xs text-muted-foreground">1. <code>approve(USDC, router, amount)</code> → 2. <code>router.swap(USDC, WETH, amount)</code> → 1개 UserOp, 원자적, 가스 절약.</p>
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">4. 멀티시그 임계값</h4>
        <div className="rounded-xl border p-4 bg-card text-sm mb-6">
          <p className="mb-2"><code>owners[]</code> + <code>threshold</code> (예: 3명 중 2명). <code>validateUserOp()</code>에서 서명 배열을 디코드하여 각 서명을 <code>ecRecover</code>로 검증, 유효 서명 수가 threshold 이상이면 통과.</p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">5. 소셜 리커버리</h4>
        <div className="rounded-xl border p-4 bg-card text-sm mb-6">
          <p className="font-semibold text-xs mb-2">Guardian 시스템 (Argent 스타일)</p>
          <p className="mb-2 text-muted-foreground"><code>owner</code> + <code>guardians[]</code> + <code>recoveryThreshold</code>.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            <div className="rounded-lg border p-2 bg-background text-center">
              <p className="text-xs font-semibold">1</p>
              <p className="text-xs text-muted-foreground">N명 가디언이 new_owner 메시지 서명</p>
            </div>
            <div className="rounded-lg border p-2 bg-background text-center">
              <p className="text-xs font-semibold">2</p>
              <p className="text-xs text-muted-foreground">대기 기간 (예: 48시간)</p>
            </div>
            <div className="rounded-lg border p-2 bg-background text-center">
              <p className="text-xs font-semibold">3</p>
              <p className="text-xs text-muted-foreground">대기 중 소유자 거부권</p>
            </div>
            <div className="rounded-lg border p-2 bg-background text-center">
              <p className="text-xs font-semibold">4</p>
              <p className="text-xs text-muted-foreground">기간 경과 후 new_owner 인수</p>
            </div>
          </div>
          <p className="text-muted-foreground">변형: 이메일 OTP 가디언, 하드웨어 키 가디언, 친구 컨트랙트 복구, zk-guardian (비밀 지식 증명).</p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">6. Paymaster 스폰서십</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm mb-2">VerifyingPaymaster</p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>프론트엔드 → Paymaster API로 UserOp 전송</li>
              <li>Paymaster가 <code>(op, validUntil, validAfter)</code> 서명</li>
              <li>서명을 <code>paymasterAndData</code>에 추가</li>
              <li>온체인: Paymaster가 서명 검증</li>
              <li>Paymaster가 EntryPoint에 가스 지불</li>
            </ol>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm mb-2">TokenPaymaster</p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>사용자가 USDC로 지불 (ETH 불필요)</li>
              <li>Paymaster가 <code>USDC.transferFrom</code> 실행</li>
              <li>Paymaster가 ETH로 EntryPoint에 지불</li>
              <li>오라클이 USDC/ETH 환율 제공</li>
            </ol>
          </div>
        </div>
        <div className="rounded-xl border p-4 bg-card text-sm mb-6">
          <p className="font-semibold text-xs mb-2">스폰서십 기준 예시</p>
          <div className="flex flex-wrap gap-2">
            {['화이트리스트 주소 (KYC)', '일일 최대 N건', '특정 dApp 컨트랙트만', 'NFT 보유자 무료 tx'].map(c => (
              <span key={c} className="rounded-full border px-3 py-1 text-xs bg-background">{c}</span>
            ))}
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">7. 가스 추상화 (ERC-20 가스)</h4>
        <div className="rounded-xl border p-4 bg-card text-sm mb-6">
          <p className="mb-2">사용자가 USDC만 보유, ETH 없음: <code>UserOp.paymasterAndData = TokenPaymaster</code></p>
          <p className="text-muted-foreground">1. Paymaster가 <code>transferFrom</code>으로 USDC 잠금 → 2. EntryPoint에 prefund → 3. <code>postOp</code>에서 USDC로 가스 환불.</p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">8. 프로그래머블 권한 (ERC-7579 모듈)</h4>
        <div className="rounded-xl border p-4 bg-card text-sm mb-6">
          <p className="mb-3">모듈러 Smart Account 표준:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            <div className="rounded-lg border p-2 bg-background text-center">
              <p className="text-xs font-semibold">Validators</p>
              <p className="text-xs text-muted-foreground">서명 로직</p>
            </div>
            <div className="rounded-lg border p-2 bg-background text-center">
              <p className="text-xs font-semibold">Executors</p>
              <p className="text-xs text-muted-foreground">커스텀 실행</p>
            </div>
            <div className="rounded-lg border p-2 bg-background text-center">
              <p className="text-xs font-semibold">Fallback</p>
              <p className="text-xs text-muted-foreground">핸들러</p>
            </div>
            <div className="rounded-lg border p-2 bg-background text-center">
              <p className="text-xs font-semibold">Hooks</p>
              <p className="text-xs text-muted-foreground">pre/post 실행</p>
            </div>
          </div>
          <p className="text-muted-foreground">플러그앤플레이: SocialRecoveryValidator, TwoFactorValidator, GaslessSessionKeyModule, IntentHandler.</p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">프로덕션 인프라</h4>
        <div className="flex flex-wrap gap-2">
          {[
            'Rhinestone — AA 보안 모듈',
            'Pimlico — Bundler + Paymaster',
            'Stackup — 인프라 + SDK',
            'ZeroDev — Kernel 모듈러 계정',
            'Biconomy — Paymaster 플랫폼',
            'Safe{Core} — 엔터프라이즈 AA',
          ].map(p => (
            <span key={p} className="rounded-full border px-3 py-1 text-sm bg-card">{p}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
