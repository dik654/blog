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
    </section>
  );
}
