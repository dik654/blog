import OverviewViz from './viz/OverviewViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fp 소수체 표현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          BN254의 소수 p는 254비트 — u64 하나(64비트)로는 표현 불가
          <br />
          [u64; 4] 배열로 분할: 4 x 64 = 256비트 공간에 254비트 수를 저장
          <br />
          little-endian 배치 — limbs[0]이 최하위, limbs[3]이 최상위
        </p>
        <p className="leading-7">
          기본 빌딩 블록 세 가지: adc(add-with-carry), sbb(subtract-with-borrow), mac(multiply-accumulate)
          <br />
          이 세 함수 위에 모든 유한체 연산(+, -, *, inv, pow)을 쌓아 올림
        </p>
      </div>
      <div className="not-prose mb-8">
        <OverviewViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          sub_if_gte의 branchless 패턴 — "일단 빼보고 borrow면 원래 값"
          <br />
          조건 분기 없이 상수 시간 실행 — 타이밍 사이드채널 공격 방지
          <br />
          ZK 증명에서 필드 연산은 초당 수백만 회 — 이 수준의 최적화가 전체 성능 좌우
        </p>
      </div>
    </section>
  );
}
