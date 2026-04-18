import AAModelViz from './viz/AAModelViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EOA vs CA: Account Abstraction 필요성</h2>
      <div className="not-prose mb-8"><AAModelViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이더리움 계정은 EOA(Externally Owned Account)와 CA(Contract Account) 두 종류입니다.<br />
          EOA만이 트랜잭션을 개시할 수 있고, 반드시 ECDSA 서명이 필요합니다.<br />
          이 제약이 사용자 경험과 보안 모두에 한계를 만듭니다.
        </p>

        <h3>EOA의 한계</h3>
        <p className="leading-7">
          시드 구문 분실 시 자산 영구 손실. 서명 알고리즘 변경 불가.<br />
          가스비를 반드시 ETH로 지불. 단일 트랜잭션에 하나의 작업만 가능.<br />
          소셜 복구, 일일 한도 등 프로그래머블 보안 정책을 적용할 수 없습니다.
        </p>

        <h3>Account Abstraction (AA)</h3>
        <p className="leading-7">
          AA는 계정의 유효성 검증 로직을 프로그래밍 가능하게 합니다.<br />
          서명 알고리즘, 가스 지불 방식, 트랜잭션 배치를
          스마트 컨트랙트 레벨에서 커스터마이즈할 수 있습니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">EOA vs CA 기술적 비교</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border p-4 bg-card">
            <h4 className="font-semibold mb-2">EOA (Externally Owned Account)</h4>
            <ul className="text-sm space-y-1.5 list-disc list-inside">
              <li>주소 = <code>keccak256(pubkey)[12:]</code></li>
              <li>비밀키: ECDSA secp256k1</li>
              <li>트랜잭션 개시 가능, 서명 필수</li>
              <li>코드/스토리지 없음</li>
              <li>생성 비용 무료 (온체인 액션 불필요)</li>
            </ul>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <h4 className="font-semibold mb-2">CA (Contract Account)</h4>
            <ul className="text-sm space-y-1.5 list-disc list-inside">
              <li>주소 = <code>keccak256(rlp([sender, nonce]))[12:]</code> 또는 CREATE2</li>
              <li>트랜잭션 개시 불가 (pre-AA)</li>
              <li>코드: EVM 바이트코드</li>
              <li>스토리지: 2<sup>256</sup> 슬롯</li>
              <li>생성 비용: 배포 가스</li>
            </ul>
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">Pre-AA 트랜잭션 흐름</h4>
        <div className="rounded-xl border p-4 bg-card text-sm mb-6">
          <p>User(EOA) → 개인키로 서명 → EVM: <code>tx.from</code>은 EOA여야 함 → ECDSA 검증(내장, 변경 불가) → 실행: 전송 또는 컨트랙트 호출</p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">EOA 모델의 한계</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm mb-1">1. 고정 서명 알고리즘</p>
            <p className="text-sm text-muted-foreground">ECDSA secp256k1만 사용. 포스트퀀텀 서명, 생체인증(Passkey), BLS 집계 불가.</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm mb-1">2. 고정 수수료 토큰</p>
            <p className="text-sm text-muted-foreground">가스비로 ETH만 가능. 사용자는 반드시 ETH를 보유해야 하며, 온보딩 마찰 발생.</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm mb-1">3. 단일 호출</p>
            <p className="text-sm text-muted-foreground"><code>approve</code> + <code>swap</code> = 2개 트랜잭션, 2개 서명 필요.</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm mb-1">4. 복구 불가</p>
            <p className="text-sm text-muted-foreground">시드 분실 = 자산 영구 손실. 소셜 리커버리 없음.</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm mb-1">5. 지출 한도 없음</p>
            <p className="text-sm text-muted-foreground">모든 서명이 전체 권한 부여. 시간 제한 키 불가.</p>
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">AA가 해제하는 것</h4>
        <div className="rounded-xl border p-4 bg-card text-sm mb-6">
          <p className="mb-2"><code>validateUserOp()</code> — 검증 로직이 프로그래밍 가능해집니다.</p>
          <p className="text-muted-foreground">ECDSA, WebAuthn, 멀티시그, ZK proof, 시간 기반 검증, 소셜 리커버리 등 자유롭게 구현할 수 있습니다.</p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">AA 역사</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm">2016 — EIP-86</p>
            <p className="text-sm text-muted-foreground">Vitalik의 원래 제안. 프로토콜 레벨, 미구현 (너무 복잡).</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm">2019 — Argent, Gnosis Safe</p>
            <p className="text-sm text-muted-foreground">멀티시그 지갑으로 EOA 모델 우회. 배포에 여전히 EOA + 가스 필요.</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm">2020 — EIP-2938</p>
            <p className="text-sm text-muted-foreground">AA 전용 트랜잭션 타입 제안. 프로토콜 침습성으로 거부.</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm">2021 — ERC-4337</p>
            <p className="text-sm text-muted-foreground">프로토콜 변경 없이 alt mempool + EntryPoint로 구현.</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm">2023 — ERC-4337 메인넷 배포</p>
            <p className="text-sm text-muted-foreground">이더리움 메인넷에서 프로덕션 가동.</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm">2024+ — EIP-7702 / EIP-7701</p>
            <p className="text-sm text-muted-foreground">EOA→스마트 컨트랙트 위임 + 프로토콜 레벨 Native AA 로드맵.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
