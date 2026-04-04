import CodePanel from '@/components/ui/code-panel';
import {
  FIB_GUEST_CODE, fibGuestAnnotations,
  FIB_HOST_CODE, fibHostAnnotations,
  CASES, BEST_PRACTICES,
} from './ExamplesData';

export default function Examples() {
  return (
    <section id="examples" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실전 예제 &amp; 베스트 프랙티스</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SP1은 <strong>표준 Rust 코드</strong>를 그대로 증명할 수 있습니다.<br />
          Fibonacci부터 Tendermint 라이트 클라이언트까지,
          Guest/Host 분리 패턴을 따르면 됩니다.
        </p>
        <CodePanel title="Fibonacci Guest" code={FIB_GUEST_CODE}
          annotations={fibGuestAnnotations} />
        <CodePanel title="Fibonacci Host" code={FIB_HOST_CODE}
          annotations={fibHostAnnotations} />
        <h3>사용 사례</h3>
      </div>
      <div className="space-y-2 mt-4 mb-6">
        {CASES.map(c => (
          <div key={c.name} className="rounded-lg border p-3"
            style={{ borderColor: c.color + '30', background: c.color + '06' }}>
            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-mono text-xs font-bold" style={{ color: c.color }}>
                {c.name}
              </span>
              <span className="text-sm text-foreground/75">{c.desc}</span>
            </div>
            <p className="text-[11px] font-mono text-foreground/45">{c.perf}</p>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>베스트 프랙티스</h3>
        <ul>
          {BEST_PRACTICES.map(bp => (
            <li key={bp} className="text-sm">{bp}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
