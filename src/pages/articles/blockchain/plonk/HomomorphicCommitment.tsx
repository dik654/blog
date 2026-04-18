import M from '@/components/ui/math';
import HomomorphicViz from './viz/HomomorphicViz';

export default function HomomorphicCommitment() {
  return (
    <section id="homomorphic-commitment" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">동형 커밋먼트</h2>
      <div className="not-prose mb-8"><HomomorphicViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Pedersen Commitment</h3>
        <p><strong>은닉성(hiding)</strong>과 <strong>바인딩(binding)</strong>을 동시에 제공하는 커밋먼트 스킴이다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-sky-500/30 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">Pedersen Commitment</p>
            <M display>{'C = v \\cdot G + r \\cdot H'}</M>
            <p className="text-sm text-muted-foreground mt-2"><M>{'G, H'}</M>: 독립 생성자 (이산로그 관계 미지)</p>
            <div className="grid grid-cols-2 gap-3 text-sm mt-2">
              <div className="bg-muted/50 rounded p-2 text-center">
                <p className="text-emerald-400 font-medium">은닉성</p>
                <p className="text-muted-foreground"><M>{'r'}</M>이 랜덤이면 <M>{'v'}</M>를 알 수 없음</p>
              </div>
              <div className="bg-muted/50 rounded p-2 text-center">
                <p className="text-emerald-400 font-medium">바인딩</p>
                <p className="text-muted-foreground">다른 <M>{'(v\', r\')'}</M>로 같은 C 생성 불가</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">가법 동형성</h3>
        <p>커밋먼트의 덧셈이 <strong>값의 덧셈 커밋먼트</strong>와 같다. 암호화 상태에서 연산이 가능하다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-emerald-500/30 p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">가법 동형성 (Additive Homomorphism)</p>
            <M display>{'C_1 = v_1 \\cdot G + r_1 \\cdot H'}</M>
            <M display>{'C_2 = v_2 \\cdot G + r_2 \\cdot H'}</M>
            <div className="mt-2 rounded border border-sky-500/30 p-3">
              <p className="text-sm text-sky-400 font-medium mb-1">커밋 덧셈 = 값의 덧셈</p>
              <M display>{'C_1 + C_2 = (v_1 + v_2) \\cdot G + (r_1 + r_2) \\cdot H = \\text{Commit}(v_1 + v_2,\\; r_1 + r_2)'}</M>
              <p className="text-sm text-muted-foreground mt-1">→ 암호화 상태에서 연산 가능!</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">KZG의 동형 속성</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">KZG 동형성</p>
            <M display>{'[f]_1 = f(\\tau) \\cdot G_1 = \\sum f_i \\cdot [\\tau^i]_1'}</M>
            <div className="grid grid-cols-3 gap-3 text-sm mt-3">
              <div className="rounded border border-emerald-500/30 p-2 text-center">
                <p className="text-emerald-400 font-medium">가법 동형</p>
                <p className="text-muted-foreground"><M>{'[f+g]_1 = [f]_1 + [g]_1'}</M></p>
              </div>
              <div className="rounded border border-emerald-500/30 p-2 text-center">
                <p className="text-emerald-400 font-medium">스칼라 곱</p>
                <p className="text-muted-foreground"><M>{'[\\alpha \\cdot f]_1 = \\alpha \\cdot [f]_1'}</M></p>
              </div>
              <div className="rounded border border-rose-500/30 p-2 text-center">
                <p className="text-rose-400 font-medium">곱은 불가!</p>
                <p className="text-muted-foreground"><M>{'[f \\cdot g]_1 = ???'}</M></p>
              </div>
            </div>
            <div className="mt-3 rounded border border-amber-500/30 p-2">
              <p className="text-sm text-amber-400 font-medium">PLONK에서의 활용</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>linearization: 다항식 선형 결합 commit 재구성</li>
                <li>batch opening: <M>{'\\nu'}</M>로 결합 후 단일 검증</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">활용 사례</h3>
        <div className="not-prose my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-violet-500/30 p-4">
              <p className="font-semibold text-sm text-violet-400 mb-2">PLONK Verifier -- 커밋 재구성</p>
              <M display>{'[F]_1 = [r]_1 + \\nu \\cdot [a]_1 + \\nu^2 \\cdot [b]_1 + \\cdots'}</M>
              <p className="text-sm text-muted-foreground">→ 개별 commit으로 combined commit 재구성</p>
            </div>
            <div className="rounded-lg border border-sky-500/30 p-4">
              <p className="font-semibold text-sm text-sky-400 mb-2">Confidential Tx -- 잔액 검증</p>
              <M display>{'\\text{Commit}(\\text{in}_1) + \\text{Commit}(\\text{in}_2) = \\text{Commit}(\\text{out}_1) + \\text{Commit}(\\text{out}_2) + \\text{Commit}(\\text{fee})'}</M>
              <p className="text-sm text-muted-foreground">→ 값을 노출하지 않고 합계 검증</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
