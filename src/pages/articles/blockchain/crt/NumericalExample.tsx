import M from '@/components/ui/math';

export default function NumericalExample() {
  return (
    <section id="numerical" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">계산 방법</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          x ≡ a₁ (mod m₁), x ≡ a₂ (mod m₂)일 때,
          M = m₁·m₂로 놓고 각 모듈러의 "부분 역원"을 구한다.
        </p>

        <h3>4단계 알고리즘</h3>
        <M display>{'x = \\underbrace{a_1 \\cdot M_1 \\cdot y_1}_{\\text{첫 번째 부분 해}} + \\underbrace{a_2 \\cdot M_2 \\cdot y_2}_{\\text{두 번째 부분 해}} \\pmod{M}'}</M>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 mb-4 text-sm">
          {[
            { step: '①', label: '보조값 계산', formula: 'M₁ = M/m₁, M₂ = M/m₂', desc: '자신을 제외한 나머지 모듈러의 곱', color: 'text-indigo-500' },
            { step: '②', label: 'y₁ 역원', formula: 'M₁·y₁ ≡ 1 (mod m₁)', desc: '확장 유클리드 또는 Fermat 소정리로 계산', color: 'text-amber-500' },
            { step: '③', label: 'y₂ 역원', formula: 'M₂·y₂ ≡ 1 (mod m₂)', desc: '동일한 방법으로 두 번째 역원 계산', color: 'text-amber-500' },
            { step: '④', label: '합산', formula: 'x = Σ aᵢ·Mᵢ·yᵢ mod M', desc: '부분 해를 합산 후 mod M으로 범위 축소', color: 'text-emerald-500' },
          ].map((s) => (
            <div key={s.step} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className={`font-bold text-xs ${s.color}`}>{s.step} {s.label}</span>
              <div className="font-mono text-[11px] text-muted-foreground/70 mt-1">{s.formula}</div>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          aᵢ = 각 합동식의 나머지, Mᵢ = 자신 제외 모듈러 곱, yᵢ = Mᵢ의 modular inverse
        </p>

        <h3>수치 예시</h3>
        <p>x ≡ 2 (mod 3), x ≡ 3 (mod 5)</p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 mb-4 text-sm">
          <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 px-3 py-2">
            <p className="font-bold text-xs text-indigo-600 dark:text-indigo-400">① 보조값</p>
            <p className="text-xs text-muted-foreground mt-1">M = 3×5 = <strong>15</strong></p>
            <p className="text-xs text-muted-foreground">M₁ = 15/3 = <strong>5</strong>, M₂ = 15/5 = <strong>3</strong></p>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2">
            <p className="font-bold text-xs text-amber-600 dark:text-amber-400">②③ 역원</p>
            <p className="text-xs text-muted-foreground mt-1">5·y₁ ≡ 1 (mod 3) → 5·2=10≡1 → y₁ = <strong>2</strong></p>
            <p className="text-xs text-muted-foreground">3·y₂ ≡ 1 (mod 5) → 3·2=6≡1 → y₂ = <strong>2</strong></p>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2">
            <p className="font-bold text-xs text-emerald-600 dark:text-emerald-400">④ 합산</p>
            <p className="text-xs text-muted-foreground mt-1">x = 2·5·2 + 3·3·2 = 20+18 = 38</p>
            <p className="text-xs text-muted-foreground">38 mod 15 = <strong className="text-emerald-600 dark:text-emerald-400">8</strong> ✓</p>
          </div>
        </div>
      </div>
    </section>
  );
}
