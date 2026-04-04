import CodePanel from '@/components/ui/code-panel';
import {
  MEMORY_CODE, MEMORY_ANNOTATIONS,
  BUILTIN_CODE, BUILTIN_ANNOTATIONS,
} from './MemoryData';

export default function Memory({ title }: { title?: string }) {
  return (
    <section id="memory" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '메모리 시스템 & 빌트인'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          S-two Cairo의 메모리 시스템은 증명 생성 효율을 위해 특별히 설계되었습니다.<br />
          이중 저장 시스템으로 작은 값과 큰 값을 분리 관리하며,
          빌트인 세그먼트는 SIMD 병렬 처리를 위해 2의 거듭제곱 크기로 패딩됩니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>이중 저장 메모리 (Small / F252)</h3>
        <CodePanel title="Memory 구조체 & MemoryValue" code={MEMORY_CODE}
          annotations={MEMORY_ANNOTATIONS} />

        <h3>빌트인 세그먼트 시스템</h3>
        <CodePanel title="BuiltinSegments & 패딩" code={BUILTIN_CODE}
          annotations={BUILTIN_ANNOTATIONS} />
      </div>
    </section>
  );
}
