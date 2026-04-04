import EcallFlowViz from './viz/EcallFlowViz';
import CodePanel from '@/components/ui/code-panel';
import {
  SYSCALL_TRAIT_CODE, syscallTraitAnnotations,
  ECALL_CODE, ecallAnnotations, SYSCALL_CATEGORIES,
} from './SyscallSystemData';

export default function SyscallSystem() {
  return (
    <section id="syscall-system" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">시스템 콜 처리</h2>
      <div className="not-prose mb-8"><EcallFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SP1은 암호화 연산(SHA256, keccak, 타원곡선)을
          <strong>ECALL 시스템 콜</strong>로 가속합니다.<br />
          Guest가 일반 Rust 함수를 호출하면 SP1 패치 크레이트가
          자동으로 ECALL로 대체해 전용 AIR 칩에서 처리합니다.
        </p>
        <CodePanel title="Syscall trait" code={SYSCALL_TRAIT_CODE}
          annotations={syscallTraitAnnotations} />
        <h3>시스콜 카테고리</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4 mb-6">
        {SYSCALL_CATEGORIES.map(c => (
          <div key={c.category} className="rounded-lg border p-3"
            style={{ borderColor: c.color + '30', background: c.color + '06' }}>
            <p className="font-mono font-bold text-xs mb-1" style={{ color: c.color }}>
              {c.category}
            </p>
            {c.items.map(item => (
              <p key={item} className="text-xs text-foreground/65 font-mono">{item}</p>
            ))}
          </div>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CodePanel title="ECALL 처리 흐름 (handle_ecall)" code={ECALL_CODE}
          annotations={ecallAnnotations} />
      </div>
    </section>
  );
}
