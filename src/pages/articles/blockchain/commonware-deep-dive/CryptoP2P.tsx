import CryptoP2PViz from './viz/CryptoP2PViz';

export default function CryptoP2P() {
  return (
    <section id="crypto-p2p" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호화 & P2P 네트워킹</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          <strong>cryptography::bls12381</strong> — BLS12-381 타원 곡선 기반 암호화 프리미티브
          <br />
          DKG(분산 키 생성, 보드리스 공유 분배) → Threshold Signatures(임계 서명, O(1) 96 bytes)
          <br />
          Resharing으로 검증자 세트 변경 대응 — Epoch 기반 키 리셰어링
        </p>
        <p className="leading-7">
          3가지 서명 스킴 지원:
          <br />
          <strong>ed25519</strong> — 빠른 서명/검증, 배치 검증 지원. 일반 용도
          <br />
          <strong>bls12381</strong> — 서명 집계, 임계 서명. 합의·크로스체인 검증에 핵심
          <br />
          <strong>secp256r1</strong> — NIST P-256, HSM 호환. 엔터프라이즈 환경
        </p>
        <p className="leading-7">
          <strong>p2p::authenticated</strong> — ECIES 암호화 연결 + 서명 기반 피어 인증 + 멀티플렉싱(다중 채널)
          <br />
          Blocker 인터페이스로 악의적 피어 차단 · 동적 피어 관리 · 네트워크 파티션 복구
          <br />
          <strong>p2p::simulated</strong> — 결정론적 시뮬레이션을 위한 가상 네트워크
        </p>
      </div>
      <div className="not-prose mb-8"><CryptoP2PViz /></div>
    </section>
  );
}
