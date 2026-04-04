import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function HotState({ onCodeRef }: Props) {
  return (
    <section id="hot-state" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Hot State 캐시</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Hot State는 최근 수 에폭(기본 2 에폭, ~12.8분)의 상태를 메모리에 유지한다.<br />
          Fork Choice, 어테스테이션 검증 등 빈번한 읽기에 즉시 응답한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('state-by-root', codeRefs['state-by-root'])} />
          <span className="text-[10px] text-muted-foreground self-center">StateByRoot() — 캐시 우선 조회</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">캐시 관리</h3>
        <ul>
          <li><strong>Copy-on-Write</strong> — 캐시에서 반환 시 복사본을 제공해 원본 보호</li>
          <li><strong>에폭 전환 시 정리</strong> — Finalized 이전 에폭의 상태를 캐시에서 제거</li>
          <li><strong>메모리 제한</strong> — 최대 N개 상태만 유지 (LRU 퇴출)</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 90%+ 캐시 히트율</strong> — 대부분의 상태 조회는 최근 에폭에 집중<br />
          Hot 캐시 덕분에 DB 접근 없이 완료<br />
          메인넷 기준 캐시 히트율 90% 이상
        </p>
      </div>
    </section>
  );
}
