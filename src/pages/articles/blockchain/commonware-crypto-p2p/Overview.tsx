import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import OverviewViz from './viz/OverviewViz';

interface Props {
  onCodeRef: (k: string, r: CodeRef) => void;
}

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호화 프리미티브 설계 철학</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Commonware 암호화 계층 — trait 기반 추상화로 서명 스킴 자유 교체
          <br />
          CometBFT는 ed25519 하드코딩 — Commonware는 trait으로 분리하여 스킴 교체 시 합의 코드 변경 불필요
          <br />
          <strong>namespace</strong> 파라미터 필수 — 도메인 분리로 리플레이 공격 원천 차단
        </p>
        <p className="leading-7">
          Signer → PrivateKey(직렬화 확장), Verifier → PublicKey(Ord+Hash 확장)
          <br />
          BatchVerifier — 서명 누적 후 일괄 검증. 랜덤 가중합으로 위조 배치 방지
          <br />
          Recoverable — secp256r1 전용. 서명에서 공개키 복원
        </p>
      </div>
      <div className="not-prose mb-8">
        <OverviewViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
