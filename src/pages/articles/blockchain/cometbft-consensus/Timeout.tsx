import { codeRefs } from './codeRefs';
import TimeoutViz from './viz/TimeoutViz';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Timeout({ onCodeRef }: Props) {
  return (
    <section id="timeout" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">타임아웃 전략 & 크래시 복구</h2>
      <div className="not-prose mb-8">
        <TimeoutViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 단계별 타임아웃 체인</strong> — 제안 미도착 → timeoutPropose → nil prevote<br />
          모든 타임아웃은 라운드마다 선형 증가(linear backoff) → 네트워크 안정화 대기
        </p>
        <p className="text-sm mt-3 border-l-2 border-sky-500/50 pl-3">
          <strong>💡 WAL 기반 크래시 복구</strong> — WriteSync로 자신의 투표를 디스크에 확정<br />
          크래시 후 WAL 리플레이 → 마지막 합의 상태 복원, 이중 서명 위험 제거
        </p>
      </div>
    </section>
  );
}
