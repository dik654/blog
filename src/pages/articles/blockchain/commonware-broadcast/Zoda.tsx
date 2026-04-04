import ZodaViz from './viz/ZodaViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Zoda({ onCodeRef }: Props) {
  return (
    <section id="zoda" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ZODA: Reed-Solomon 이레이저 코딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>Scheme</code> trait — encode/check/decode 3단계 이레이저 코딩 추상화
          <br />
          <code>PhasedScheme</code> — Strong(직접 수신)/Weak(전달) 샤드 분리. 검증 비용 최적화
        </p>
        <p className="leading-7">
          <strong>ZODA</strong> — Reed-Solomon + Hadamard + Fiat-Shamir 기반
          <br />
          데이터 → n·S × c 행렬 → RS 인코딩 → Merkle 커밋 → 체크섬 Z = X · H
          <br />
          KZG 대비: 신뢰 설정 불필요 · <code>ValidatingScheme</code> — 샤드 1개만 검증해도 전체 유효성 보장
        </p>
        <p className="leading-7">
          <strong>Strong → Weak</strong> 변환: weaken()으로 checksum/root 제거 → 대역폭 절약
          <br />
          check(): Merkle inclusion 검증 + shard · H == encoded_checksum 비교
        </p>
      </div>
      <div className="not-prose mb-8">
        <ZodaViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
