import M from '@/components/ui/math';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import KZGCommitViz from './viz/KZGCommitViz';
import KZGFlowViz from './viz/KZGFlowViz';
import { codeRefs } from './codeRefs';

export default function KZG({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="kzg" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">KZG 다항식 Commitment</h2>
      <div className="not-prose mb-8"><KZGCommitViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">KZG 흐름 시퀀스</h3>
      </div>
      <div className="not-prose mb-8"><KZGFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('kzg-srs', codeRefs['kzg-srs'])} />
          <span className="text-[10px] text-muted-foreground self-center">SRS 구조체</span>
          <CodeViewButton onClick={() => onCodeRef('kzg-commit', codeRefs['kzg-commit'])} />
          <span className="text-[10px] text-muted-foreground self-center">commit() + open()</span>
          <CodeViewButton onClick={() => onCodeRef('kzg-verify', codeRefs['kzg-verify'])} />
          <span className="text-[10px] text-muted-foreground self-center">verify() 페어링</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 KZG가 필요한가?</h3>
        <p>Groth16은 <strong>회로별 trusted setup</strong>이 필요하다.
        <br />
          회로가 바뀌면 setup을 처음부터 다시 해야 한다.
        <br />
          KZG(Kate-Zaverucha-Goldberg)는 <strong>universal setup</strong>으로 이 문제를 해결한다.
        <br />
          비밀 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">&tau;</code> 하나로 모든 다항식에 재사용할 수 있다.</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Commitment 크기: G1 1개 = 64 bytes</li>
          <li>Opening proof: G1 1개 = 64 bytes</li>
          <li>검증 시간: O(1) - 페어링 2회</li>
          <li>Setup: 1회 (universal), 파라미터 &tau; 1개</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심: 다항식 인수정리 (Factor Theorem)</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-sky-500/30 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">다항식 인수정리 기반 증명</p>
            <M display>{'f(z) = y \\iff (x - z) \\mid (f(x) - y)'}</M>
            <p className="text-sm text-muted-foreground mt-2">즉, <M>{'f(x) - y = q(x) \\cdot (x - z)'}</M>인 다항식 <M>{'q(x)'}</M>가 존재</p>
            <div className="mt-3 rounded border border-emerald-500/30 p-3">
              <p className="text-sm text-emerald-400 font-medium mb-1">증명자-검증자 흐름</p>
              <ol className="text-sm space-y-0.5 text-muted-foreground list-decimal pl-5">
                <li>증명자: &quot;<M>{'f(z) = y'}</M>&quot;를 주장</li>
                <li><M>{'q(x) = (f(x) - y) / (x - z)'}</M>를 계산해서 제출</li>
                <li>검증자: 타원곡선 위에서 pairing으로 확인</li>
              </ol>
              <M display>{'e([q]_1,\\; [\\tau - z]_2) = e([f - y]_1,\\; G_2)'}</M>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">SRS (Structured Reference String)</h3>
        <p>비밀 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">&tau;</code>를 직접 노출하지 않고, 타원곡선 위의 점으로 인코딩한다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">SRS 구성</p>
            <M display>{'\\text{SRS} = \\{ [\\tau^0]_1, [\\tau^1]_1, \\ldots, [\\tau^d]_1, [\\tau]_2 \\}'}</M>
            <p className="text-sm text-muted-foreground mt-2">여기서 <M>{'[x]_1 = x \\cdot G_1,\\; [x]_2 = x \\cdot G_2'}</M>. <M>{'\\tau'}</M> 자체는 MPC 세레모니 후 폐기 (toxic waste)</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Commit / Open / Verify</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-sky-500/30 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">Commit -- MSM 연산</p>
            <M display>{'C = \\sum_i f_i \\cdot [\\tau^i]_1 = [f(\\tau)]_1'}</M>
          </div>
          <div className="rounded-lg border border-emerald-500/30 p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">Open -- 다항식 나눗셈</p>
            <p className="text-sm text-muted-foreground"><M>{'y = f(z)'}</M></p>
            <M display>{'q(x) = \\frac{f(x) - y}{x - z}'}</M>
            <p className="text-sm text-muted-foreground">증거: <M>{'\\pi = [q(\\tau)]_1'}</M> (G1 점 1개)</p>
          </div>
          <div className="rounded-lg border border-violet-500/30 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">Verify -- 페어링 검증</p>
            <M display>{'e(\\pi,\\; [\\tau - z]_2) \\stackrel{?}{=} e(C - [y]_1,\\; G_2)'}</M>
            <p className="text-sm text-muted-foreground mt-1">양변 = <M>{'[q(\\tau)(\\tau - z)]_T = [(f(\\tau) - y)]_T'}</M></p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Batch Opening</h3>
        <p>여러 다항식을 같은 점 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">z</code>에서 한 번에 열 수 있다. 검증자가 랜덤 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">&nu;</code>를 선택하여 선형 결합한다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">Batch Opening</p>
            <div className="rounded border border-sky-500/30 p-3 mb-3">
              <p className="text-sm text-sky-400 font-medium mb-1">다항식 선형 결합</p>
              <M display>{'\\text{combined}(x) = f_0(x) + \\nu \\cdot f_1(x) + \\nu^2 \\cdot f_2(x) + \\cdots'}</M>
              <M display>{'\\text{combined\\_y} = y_0 + \\nu \\cdot y_1 + \\nu^2 \\cdot y_2 + \\cdots'}</M>
              <p className="text-sm text-muted-foreground mt-1">하나의 quotient: <M>{'q(x) = (\\text{combined}(x) - \\text{combined\\_y}) / (x - z)'}</M></p>
            </div>
            <div className="rounded border border-emerald-500/30 p-3">
              <p className="text-sm text-emerald-400 font-medium mb-1">Commitment 선형 결합으로 단일 검증</p>
              <M display>{'C_{\\text{combined}} = C_0 + \\nu \\cdot C_1 + \\nu^2 \\cdot C_2 + \\cdots'}</M>
              <p className="text-sm text-muted-foreground">→ 단일 pairing check로 완료</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
