import G2OpsViz from './viz/G2OpsViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function G2Ops({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="g2-ops" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">G2 확장체 위의 연산</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          페어링에 필요한 G2는 원래 E(Fp12) 위의 점 — Fp12 산술은 Fp 곱셈 ~144회
          <br />
          sextic twist로 Fp2 위의 곡선으로 옮기면 Fp 곱셈 3회로 축소 — ~36배 성능 향상
          <br />
          트위스트 파라미터 b&apos; = 3/(9+u): ξ=9+u는 Fp6 구성의 non-residue
        </p>
        <p className="leading-7">
          G2::double/add는 G1과 동일한 Jacobian 공식 — 좌표 타입만 Fp에서 Fp2로 변경
          <br />
          Fp2 곱셈 1회 = Fp 곱셈 3회(Karatsuba) → G2 연산은 G1 대비 약 3배 비용
        </p>
      </div>
      <div className="not-prose mb-8">
        <G2OpsViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          Rust의 타입 시스템: G1(Fp)과 G2(Fp2)는 별도 struct — 제네릭 대신 명시적 복사
          <br />
          교육용 구현이라 코드 중복을 허용 — 프로덕션에서는 trait으로 추상화
          <br />
          twist_b()가 런타임 계산인 점도 교육적 선택 — 프로덕션에서는 const로 하드코딩
        </p>
      </div>
    </section>
  );
}
