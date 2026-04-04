import MontViz from './viz/MontViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Montgomery({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="montgomery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">몽고메리 곱셈</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          일반 모듈러 곱셈: (a * b) mod p — 나눗셈이 필요해 느림
          <br />
          Montgomery 해법: 수를 a * R mod p 형태로 저장하면 나눗셈을 시프트로 대체
          <br />
          R = 2^256이므로 "R로 나누기" = 256비트 오른쪽 시프트
        </p>
        <p className="leading-7">
          mont_mul = schoolbook 4x4 곱셈 + REDC(Montgomery reduction)
          <br />
          REDC의 핵심: INV 상수로 하위 limb을 0으로 만들어 제거
          <br />
          4회 반복 후 8-limb을 4-limb으로 축소 — 결과는 자동으로 mod p
        </p>
      </div>
      <div className="not-prose mb-8">
        <MontViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          INV = -p^(-1) mod 2^64 — Newton법으로 컴파일 타임에 6회 반복으로 계산
          <br />
          각 반복마다 정밀도 2배: 1 → 2 → 4 → 8 → 16 → 32 → 64비트
          <br />
          inv()가 pow(p-2)로 구현된 것도 핵심 — 확장 유클리드 없이 한 줄로 역원
        </p>
      </div>
    </section>
  );
}
