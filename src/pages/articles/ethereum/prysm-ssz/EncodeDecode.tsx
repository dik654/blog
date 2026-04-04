import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function EncodeDecode({ onCodeRef }: Props) {
  return (
    <section id="encode-decode" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">인코딩 & 디코딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">고정 크기 타입</h3>
        <p>
          <code>uint64</code>, <code>bytes32</code>, <code>bool</code> — 크기가 컴파일 타임에 결정된다.<br />
          리틀 엔디언으로 그대로 기록. 패딩 없음.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">가변 크기 타입</h3>
        <p>
          <code>List[T, N]</code>, <code>Bitlist[N]</code> — 오프셋(4바이트 LE)을 고정부에 기록한다.<br />
          실제 데이터는 모든 고정 필드 뒤에 순서대로 배치.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('ssz-pack', codeRefs['ssz-pack'])} />
          <span className="text-[10px] text-muted-foreground self-center">PackByChunk()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 오프셋 기반 부분 디코딩</strong> — Unmarshal 시 고정부를 순차 읽으며 오프셋을 수집<br />
          오프셋 구간 [offset_i, offset_i+1)에서 가변 데이터를 역직렬화<br />
          전체를 읽지 않고 특정 필드만 빠르게 접근 가능
        </p>
      </div>
    </section>
  );
}
