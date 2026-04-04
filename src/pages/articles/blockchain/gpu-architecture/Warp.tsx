import { CitationBlock } from '@/components/ui/citation';
import WarpScheduleViz from './viz/WarpScheduleViz';

export default function Warp() {
  return (
    <section id="warp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">워프 스케줄링 & 점유율</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          GPU SM은 여러 워프(32-thread 그룹)를 동시에 관리하며,
          하나의 워프가 메모리 응답을 기다리는 동안 다른 워프를 즉시 실행합니다.
          <br />
          이 <strong>지연 은닉(Latency Hiding)</strong> 기법이 GPU 처리량의 핵심입니다.
        </p>

        <CitationBlock source="NVIDIA — Warp Scheduling and Latency Hiding" citeKey={3} type="paper"
          href="https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#hardware-multithreading">
          <p className="italic">"When a warp is paused or stalled, the warp scheduler selects another
          available warp to execute — hiding the latency of memory accesses."</p>
        </CitationBlock>
      </div>

      <div className="not-prose my-8"><WarpScheduleViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">점유율 제한 요인</h3>
        <ul className="space-y-1 text-sm">
          <li><strong>레지스터 수</strong> — 스레드당 사용 레지스터가 많으면 SM에 올릴 수 있는 워프 수 감소</li>
          <li><strong>공유 메모리</strong> — 블록당 사용량이 크면 동시 활성 블록 수 제한</li>
          <li><strong>블록 크기</strong> — 블록당 스레드 수가 워프 배수가 아니면 낭비 발생</li>
        </ul>
      </div>
    </section>
  );
}
