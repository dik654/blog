import ZkVMArchViz from './viz/ZkVMArchViz';
import CodePanel from '@/components/ui/code-panel';
import { USAGE_CODE, usageAnnotations } from './OverviewData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

const LAYERS = [
  { name: 'SP1 SDK', color: '#6366f1', desc: '고수준 API. prove(), execute(). CPU/CUDA/Network 백엔드 선택.' },
  { name: 'Core Executor', color: '#10b981', desc: 'RISC-V ELF 실행. ExecutionTrace 생성. 4가지 모드.' },
  { name: 'Core Machine', color: '#f59e0b', desc: 'AIR 시스템. 칩(Chip) 기반 제약 조건 생성.' },
  { name: 'SP1 Prover', color: '#8b5cf6', desc: 'Core Proof → Compress → Groth16/PLONK 래핑.' },
  { name: 'Recursion (Plonky3)', color: '#ec4899', desc: '재귀 압축. FRI 기반 STARK. 증명 집계.' },
];

const COMPARE = [
  ['증명 시스템', 'Plonky3 (AIR + FRI)', 'STARK + FRI (자체 구현)'],
  ['재귀 압축', 'Plonky3 재귀 + SNARK', '3계층 재귀 STARK'],
  ['온체인 래핑', 'Groth16 또는 PLONK', 'Groth16만'],
  ['칩 아키텍처', 'AIR 칩 모듈화', 'RV32IM 단일 회로'],
  ['표준 라이브러리', 'std 완전 지원', 'std 제한적'],
  ['GPU 가속', 'CUDA (자체 구현)', 'CUDA (자체 구현)'],
];

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 &amp; 아키텍처</h2>
      <div className="not-prose mb-8"><ZkVMArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SP1(Succinct Proof 1)은 Succinct Labs가 개발한 RISC-V 기반 zkVM입니다.<br />
          RISC Zero와 동일하게 Rust 코드를 그대로 실행하지만,
          <strong>Plonky3</strong> 프레임워크를 사용한 AIR 기반
          STARK으로 증명합니다. 온체인 검증을 위해 Groth16 또는 PLONK으로 래핑합니다.
        </p>
        <h3>SP1 vs RISC Zero 비교</h3>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-foreground/60 font-medium">항목</th>
                <th className="text-left py-2 px-3 text-indigo-400 font-medium">SP1</th>
                <th className="text-left py-2 px-3 text-emerald-400 font-medium">RISC Zero</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([item, sp1, r0]) => (
                <tr key={item} className="border-b border-border/50">
                  <td className="py-2 px-3 font-medium text-foreground/70">{item}</td>
                  <td className="py-2 px-3 text-foreground/80">{sp1}</td>
                  <td className="py-2 px-3 text-foreground/80">{r0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('vm-struct', codeRefs['vm-struct'])} />
          <span className="text-[10px] text-muted-foreground self-center">SP1 소스 코드 탐색기</span>
        </div>
        <CodePanel title="기본 사용 패턴" code={USAGE_CODE} annotations={usageAnnotations} />
      </div>
      <div className="space-y-1.5 mt-6">
        {LAYERS.map(l => (
          <div key={l.name} className="rounded-lg border p-3 flex items-start gap-3"
            style={{ borderColor: l.color + '30', background: l.color + '06' }}>
            <span className="text-xs font-mono font-bold mt-0.5 w-36 flex-shrink-0" style={{ color: l.color }}>
              {l.name}
            </span>
            <span className="text-sm text-foreground/75">{l.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
