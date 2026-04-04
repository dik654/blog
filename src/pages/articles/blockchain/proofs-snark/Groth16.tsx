import { codeRefs } from './codeRefs';
import Groth16Viz from './viz/Groth16Viz';
import type { CodeRef } from '@/components/code/types';

export default function Groth16({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="groth16" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Groth16 증명/검증</h2>
      <div className="not-prose mb-8">
        <Groth16Viz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} Trusted Setup의 비용</strong> — Groth16은 회로별 CRS 필요
          <br />
          Filecoin은 2020년 대규모 Powers of Tau 세레모니 진행
          <br />
          회로 변경 시 새로운 세레모니 필요
        </p>
      </div>
    </section>
  );
}
