import R0GuestHostViz from '../components/R0GuestHostViz';
import SegmentRecursionViz from './viz/SegmentRecursionViz';
import CodePanel from '@/components/ui/code-panel';
import { USAGE_CODE, usageAnnotations } from './OverviewData';

const TERMS = [
  { name: 'Method', desc: 'zkVM에서 실행할 Rust 코드를 컴파일한 RISC-V ELF. Image ID(ELF 해시)로 식별.' },
  { name: 'Host', desc: 'zkVM 외부에서 실행. 입력 데이터 제공, prove() 호출, Receipt 검증.' },
  { name: 'Guest', desc: 'zkVM 내부 RISC-V 머신. 계산 수행, Journal에 결과 기록.' },
  { name: 'Journal', desc: 'Guest가 기록하는 공개 출력 로그 (append-only). 검증자가 확인.' },
  { name: 'Receipt', desc: 'Journal + Seal. 올바른 실행의 증명. verify(image_id)로 검증.' },
  { name: 'Seal', desc: '불투명한 암호학적 증명 데이터 (STARK 또는 Groth16 SNARK).' },
];

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 핵심 개념'}</h2>
      <div className="not-prose mb-8"><SegmentRecursionViz /></div>
      <div className="not-prose mb-8"><R0GuestHostViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          RISC Zero — <strong>zk-STARK</strong> + <strong>RISC-V</strong> 결합 범용 zkVM<br />
          Rust 코드를 그대로 zkVM 위에서 실행, 실행의 올바름을 수학적으로 증명
        </p>
        <h3>핵심 용어</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {TERMS.map(item => (
            <div key={item.name} className="rounded-lg border border-border/60 p-3">
              <p className="font-mono font-bold text-sm text-indigo-400">{item.name}</p>
              <p className="text-sm mt-1 text-foreground/75">{item.desc}</p>
            </div>
          ))}
        </div>
        <CodePanel title="기본 사용 패턴" code={USAGE_CODE} annotations={usageAnnotations} />
      </div>
    </section>
  );
}
