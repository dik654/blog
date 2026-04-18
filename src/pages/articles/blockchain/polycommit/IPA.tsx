import M from '@/components/ui/math';
import CodePanel from '@/components/ui/code-panel';
import {
  IPA_CODE, IPA_ANNOTATIONS,
  MARLIN_CODE, MARLIN_ANNOTATIONS,
} from './IPAData';

export default function IPA({ title }: { title?: string }) {
  return (
    <section id="ipa" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'IPA & Marlin PC'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>IPA PC</strong>는 신뢰할 수 있는 설정이 불필요한 이산로그 기반 스킴이며,
          <strong>Marlin PC</strong>는 KZG10에 차수 제한 강제와 은닉성을 추가한 확장입니다.<br />
          두 스킴은 각각 투명성과 기능성에서 KZG10을 보완합니다.
        </p>

        <h3>IPA PC (Inner Product Argument)</h3>
        <CodePanel title="투명 설정 & 재귀 halving" code={IPA_CODE}
          annotations={IPA_ANNOTATIONS} />

        <h3>Marlin PC (차수 제한 강제)</h3>
        <CodePanel title="shifted_commitment & 배치 검증" code={MARLIN_CODE}
          annotations={MARLIN_ANNOTATIONS} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Inner Product Argument</h3>

        {/* 기본 구조 */}
        <div className="not-prose rounded-lg border-l-4 border-l-blue-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">IPA (Bulletproofs, Bunz et al. 2018)</div>
          <p className="text-sm text-muted-foreground mb-2">
            목표: <M>{'\\langle \\mathbf{a}, \\mathbf{b} \\rangle = c'}</M> 증명 &mdash; 공개: <M>{'G, H, C'}</M> / 비공개: <M>{'\\mathbf{a}, \\mathbf{b}'}</M>
          </p>
          <M display>{'C = \\underbrace{\\langle \\mathbf{a}, \\mathbf{G} \\rangle}_{\\text{벡터 a의 커밋}} + \\underbrace{\\langle \\mathbf{b}, \\mathbf{H} \\rangle}_{\\text{벡터 b의 커밋}} + \\underbrace{c \\cdot U}_{\\text{내적 결과 커밋}}'}</M>
          <p className="text-sm text-muted-foreground mt-2">
            <M>{'\\mathbf{a}, \\mathbf{b}'}</M>: 비밀 벡터 (길이 <M>n</M>), <M>{'\\mathbf{G}, \\mathbf{H}'}</M>: 공개 생성원 벡터, <M>{'U'}</M>: 내적 바인딩용 독립 생성원, <M>{'c = \\langle \\mathbf{a}, \\mathbf{b} \\rangle'}</M>: 내적 결과.
          </p>
        </div>

        {/* Halving Protocol */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Halving Protocol</div>
          <p className="text-sm text-muted-foreground mb-3">
            벡터 <M>{'\\mathbf{a}, \\mathbf{b}'}</M>를 반으로 나눈다: <M>{'\\mathbf{a} = (\\mathbf{a}_L, \\mathbf{a}_R)'}</M>, <M>{'\\mathbf{b} = (\\mathbf{b}_L, \\mathbf{b}_R)'}</M>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div className="rounded bg-muted/50 p-3">
              <div className="text-xs font-mono text-muted-foreground mb-1">Prover 전송</div>
              <M display>{'L = \\underbrace{\\langle \\mathbf{a}_L, \\mathbf{G}_R \\rangle}_{\\text{교차 커밋}} + \\underbrace{\\langle \\mathbf{b}_R, \\mathbf{H}_L \\rangle}_{\\text{교차 커밋}} + \\underbrace{\\langle \\mathbf{a}_L, \\mathbf{b}_R \\rangle U}_{\\text{교차 내적}}'}</M>
              <p className="text-sm text-muted-foreground mt-1 mb-2">
                <M>L</M>: 왼쪽 반(a)과 오른쪽 반(b,G)의 교차항. 검증자가 fold 일관성을 체크하는 데 사용.
              </p>
              <M display>{'R = \\underbrace{\\langle \\mathbf{a}_R, \\mathbf{G}_L \\rangle}_{\\text{교차 커밋}} + \\underbrace{\\langle \\mathbf{b}_L, \\mathbf{H}_R \\rangle}_{\\text{교차 커밋}} + \\underbrace{\\langle \\mathbf{a}_R, \\mathbf{b}_L \\rangle U}_{\\text{교차 내적}}'}</M>
              <p className="text-sm text-muted-foreground mt-1">
                <M>R</M>: <M>L</M>과 대칭 구조. <M>{'L, R'}</M> 쌍이 매 라운드 검증자에게 전송됨.
              </p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <div className="text-xs font-mono text-muted-foreground mb-1">Fold (challenge <M>u</M>)</div>
              <M display>{"\\mathbf{a}' = \\underbrace{\\mathbf{a}_L \\cdot u}_{\\text{왼쪽 반 × challenge}} + \\underbrace{\\mathbf{a}_R \\cdot u^{-1}}_{\\text{오른쪽 반 × 역원}}"}</M>
              <M display>{"\\mathbf{b}' = \\underbrace{\\mathbf{b}_L \\cdot u^{-1}}_{\\text{역방향 결합}} + \\underbrace{\\mathbf{b}_R \\cdot u}_{\\text{순방향 결합}}"}</M>
              <M display>{"\\mathbf{G}' = \\underbrace{\\mathbf{G}_L \\cdot u^{-1}}_{\\text{생성원 왼쪽}} + \\underbrace{\\mathbf{G}_R \\cdot u}_{\\text{생성원 오른쪽}}"}</M>
              <p className="text-sm text-muted-foreground mt-1">
                <M>u</M>: 검증자가 보낸 랜덤 challenge. <M>{'u^{-1}'}</M>: 유한체에서의 역원. 매 fold마다 벡터 길이 <M>{'n \\to n/2'}</M>.
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            매 라운드 벡터 길이가 반감 &rarr; <M>{'\\log n'}</M> 라운드 후 스칼라 등식 <M>{'\\langle a, b \\rangle = c'}</M> 검증.
          </p>
        </div>

        {/* 복잡도 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">복잡도</div>
          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div>Proof size: <M>{'2 \\log n + 2'}</M> (L, R 쌍 + final)</div>
            <div>Verifier: <M>{'O(n)'}</M> (MSM)</div>
            <div><M>{'n = 1024'}</M> &rarr; ~672 bytes</div>
            <div><M>{'n = 2^{20}'}</M> &rarr; ~1.3 KB</div>
          </div>
        </div>

        {/* 특성 + vs KZG */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">특성</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="text-emerald-600 dark:text-emerald-400">No trusted setup (transparent)</li>
              <li className="text-red-600 dark:text-red-400">Post-quantum 아님 (DLP 기반)</li>
              <li className="text-red-600 dark:text-red-400">Linear verifier</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">IPA vs KZG</div>
            <table className="w-full text-sm text-muted-foreground">
              <tbody>
                <tr className="border-b border-muted"><td className="py-1 pr-3"></td><td className="pr-3 font-medium">KZG</td><td className="font-medium">IPA</td></tr>
                <tr className="border-b border-muted"><td className="py-1 pr-3">Setup</td><td className="pr-3">Trusted</td><td>Transparent</td></tr>
                <tr className="border-b border-muted"><td className="py-1 pr-3">Verify</td><td className="pr-3"><M>{'O(1)'}</M></td><td><M>{'O(n)'}</M></td></tr>
                <tr><td className="py-1 pr-3">Proof</td><td className="pr-3"><M>{'O(1)'}</M></td><td><M>{'O(\\log n)'}</M></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 활용 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">활용</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2 text-center">Bulletproofs</div>
            <div className="rounded bg-muted/50 p-2 text-center">Halo/Halo2</div>
            <div className="rounded bg-muted/50 p-2 text-center">Mina Protocol</div>
            <div className="rounded bg-muted/50 p-2 text-center">Verkle Tree</div>
            <div className="rounded bg-muted/50 p-2 text-center">Monero</div>
          </div>
        </div>
      </div>
    </section>
  );
}
