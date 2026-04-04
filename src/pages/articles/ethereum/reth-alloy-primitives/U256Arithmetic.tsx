import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import U256ArithViz from './viz/U256ArithViz';

export default function U256Arithmetic({ onCodeRef }: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="u256-arithmetic" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">U256 산술 연산</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          U256은 4개의 u64 limb로 256비트를 표현한다.<br />
          little-endian 순서로 <code>limbs[0]</code>이 최하위 64비트,
          <code>limbs[3]</code>이 최상위 64비트다.<br />
          이 배치는 carry 전파(하위 limb의 오버플로를 상위 limb에 더하는 것)에 자연스럽다.
        </p>
        <p className="leading-7">
          덧셈은 limb[0]부터 시작한다.<br />
          두 u64의 합이 <code>u64::MAX</code>를 초과하면 carry가 1이 되고,
          다음 limb 덧셈에 합산된다.<br />
          이 과정이 limb[3]까지 반복되며, 마지막 carry가 남으면 256비트 오버플로다.
        </p>
        <p className="leading-7">
          EVM의 ADD opcode는 <strong>wrapping</strong>(mod 2^256) 연산이 기본이다.<br />
          오버플로가 발생해도 에러가 아니라 하위 256비트만 남긴다.<br />
          <code>checked_add</code>는 오버플로 시 None을 반환하고,
          <code>saturating_add</code>는 U256::MAX를 반환한다.
        </p>
      </div>

      <div className="not-prose">
        <U256ArithViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
