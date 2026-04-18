import type { CodeRef } from '@/components/code/types';

export default function PdpIntegration({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="pdp-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PDP 기반 검증 가능 스토리지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          SP가 핫 데이터를 PDP로 주기적으로 증명. 봉인 없이 원본 그대로 저장.<br />
          증명 실패 시 자동 패널티 → SP 담보에서 클라이언트에게 보상 지급
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">PDP Integration Flow</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Client Journey</h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>SP에 데이터 업로드</li>
              <li>SP가 Merkle root 온체인 등록</li>
              <li>Client가 escrow 컨트랙트에 FIL 예치</li>
              <li>매 epoch PDP proof 진행</li>
              <li>proof 기반 자동 결제</li>
              <li>Client는 언제든 데이터 조회</li>
            </ol>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">SP Journey</h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>Client로부터 데이터 수신</li>
              <li>Merkle tree 계산</li>
              <li>PDP contract에 등록 + 담보 예치</li>
              <li>주기적 PDP proof 생성</li>
              <li>온체인 제출</li>
              <li>epoch마다 FIL 수령</li>
            </ol>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Verification Flow</h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>DRAND beacon → random challenge</li>
              <li>SP가 offset에서 160B 읽기</li>
              <li>Merkle proof 생성 후 온체인 제출</li>
              <li>Contract가 SHA256 x ~20 검증</li>
              <li>유효 → epoch payment 해제</li>
              <li>무효 → collateral slash</li>
            </ol>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Economic Model</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>SP reward: <code className="text-xs bg-background px-1 rounded">price x data_size x duration</code> (valid proof 조건)</li>
              <li>SP penalty: <code className="text-xs bg-background px-1 rounded">N x reward</code> (missed/invalid proof)</li>
              <li>Client refund: <code className="text-xs bg-background px-1 rounded">unused_escrow + penalty_transfer</code></li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">PDP 장점</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>trustless verification</li>
              <li>automated payment</li>
              <li>no intermediary</li>
              <li>SLA in code</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">vs Centralized (S3)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Amazon 신뢰 필요</li>
              <li>암호학적 증명 없음</li>
              <li>약관 변경 가능, 검열 가능</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">vs No Proofs (Saturn)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>SP 행동 검증 불가</li>
              <li>경제적 책임 없음</li>
              <li>abuse potential</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          PDP Integration: <strong>upload → proofs → auto-payment → retrieval</strong>.<br />
          trustless verification + automated SLA enforcement.<br />
          "decentralized + verifiable" sweet spot.
        </p>
      </div>
    </section>
  );
}
