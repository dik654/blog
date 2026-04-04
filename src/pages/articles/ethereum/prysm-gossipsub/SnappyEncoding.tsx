import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function SnappyEncoding({ onCodeRef: _ }: Props) {
  return (
    <section id="snappy-encoding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SSZ-Snappy 인코딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          비콘 체인 메시지는 <strong>SSZ 직렬화 + Snappy 프레임 압축</strong>을 거친다.<br />
          RLP(EL)와 달리 SSZ는 고정 크기 필드 오프셋으로 부분 디코딩이 가능하다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">인코딩 파이프라인</h3>
        <ul>
          <li><strong>SSZ 직렬화</strong> — 구조체를 고정 오프셋 바이트로 변환</li>
          <li><strong>Snappy 압축</strong> — LZ77 기반 빠른 압축 (CPU 부담 최소)</li>
          <li><strong>길이 프리픽스</strong> — varint로 압축 전 크기를 명시</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 Snappy vs gzip</strong> — gzip 대비 압축률은 낮지만 속도가 10배 이상 빠름<br />
          12초 슬롯마다 수천 개 어테스테이션을 처리해야 하므로<br />
          CPU 오버헤드 최소화가 압축률보다 우선
        </p>
      </div>
    </section>
  );
}
