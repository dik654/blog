import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import BLSViz from './viz/BLSViz';
import { CodeViewButton } from '@/components/code';

interface Props {
  onCodeRef: (k: string, r: CodeRef) => void;
}

export default function BLS12381({ onCodeRef }: Props) {
  return (
    <section id="bls12381" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BLS12-381: DKG → 임계 서명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          BLS12-381 임계 서명 — n명 중 t명만 서명하면 유효한 그룹 서명
          <br />
          인증서 크기 O(n) → <strong>O(1) (96 bytes)</strong> — 검증자 수 무관 동일 크기
          <br />
          Joint-Feldman DKG + Desmedt97 Resharing 구현
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">DKG 코드 추적</h3>
      </div>
      <div className="not-prose mb-8">
        <BLSViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">Epoch 기반 Resharing</h3>
        <p className="leading-7">
          검증자 세트 변경 시 DKG 재실행 없이 기존 키 리셰어링
          <br />
          Epoch k의 비밀 공유 → Epoch k+1의 새 검증자 세트에 재분배
        </p>
        <div className="not-prose flex flex-wrap gap-2 mt-4">
          <CodeViewButton onClick={() => onCodeRef('bls-signer', codeRefs['bls-signer'])} />
          <span className="text-[10px] text-muted-foreground self-center">
            bls12381::PrivateKey — Signer/Verifier impl
          </span>
        </div>
      </div>
    </section>
  );
}
