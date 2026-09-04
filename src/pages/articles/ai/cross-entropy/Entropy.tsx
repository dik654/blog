import ExplainedFormula from "@/components/ui/explained-formula";

export default function Entropy({ title }: { title?: string }) {
  return (
    <section id="entropy" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title ?? "Entropy는 정보원 자체의 피할 수 없는 불확실성이다"}</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          실제 분포 P를 정확히 알고 그 분포에 맞는 code를 설계해도, 어떤 sample이 나올지는 관측 전까지 알 수 없다. Entropy는 P에서 나온 사건의 surprisal을
          다시 P로 평균내어 이 본질적인 불확실성을 잰다. 한 사건에 확률이 몰려 있으면 예측하기 쉬워 낮고 K개 사건이 균등하면 가장 높아져 log K가 된다.
        </p>
      </div>

      <div id="paper-shannon" className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4">
        <p className="text-xs font-bold text-primary">논문 해설 · A Mathematical Theory of Communication</p>
        <h3 className="mt-2 text-base font-bold">Entropy는 의미의 중요도가 아니라 source의 선택 불확실성을 잰다</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Shannon은 통신의 semantic meaning을 직접 점수화하지 않고 source가 어떤 symbol을 선택할지와 channel이 그 sequence를 얼마나 안정적으로
          전달할지를 수학적으로 분리했습니다. Discrete source의 entropy와 coding result는 source model·alphabet·긴 sequence라는 전제
          안에서 읽어야 하며 entropy가 문장의 진실성이나 인간에게 주는 의미를 재는다는 결론은 아닙니다.
        </p>
      </div>

      <ExplainedFormula
        question="실제 분포 P에서 결과 하나를 관측할 때 평균적으로 얼마나 많은 정보가 생기는가?"
        idea={<>각 사건이 주는 self-information −log P(x)를 그 사건의 실제 발생 확률 P(x)로 평균냅니다.</>}
        formula={String.raw`\begin{aligned}H(P)&=\mathbb E_{x\sim P}[-\log P(x)]\\[3pt]&=-\sum_xP(x)\log P(x)\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}H(P)&=\underbrace{\mathbb E_{x\sim P}[-\log P(x)]}_{\text{확률 가중 평균}}\\[3pt]&=\underbrace{-\sum_xP(x)\log P(x)}_{\text{로그 비용 변환}}\end{aligned}`}
        operations={[
          { expression: String.raw`\mathbb E_{x\sim P}[-\log P(x)]`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","각 사건이 주는 self-information −log","P(x)를 그 사건의 실제 발생 확률 P(x)로 평균냅니다."] },
          { expression: String.raw`-\sum_xP(x)\log P(x)`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","각 사건이 주는 self-information −log","P(x)를 그 사건의 실제 발생 확률 P(x)로 평균냅니다."] },
        ]}
        terms={[
          { symbol: "H(P)", name: "entropy", description: "분포 P가 가진 평균 불확실성입니다." },
          { symbol: "P(x)", name: "발생 확률", description: "사건의 빈도 가중치이면서 self-information을 정하는 값입니다." },
          { symbol: "-\\log P(x)", name: "self-information", description: "실제 분포를 기준으로 계산한 사건 x의 surprisal입니다." },
        ]}
        assumptions={["이 식은 discrete entropy입니다. Continuous differential entropy는 성질과 해석이 일부 다릅니다.", "0 log 0 항은 극한값 0으로 정의합니다."]}
        interpretation="Entropy는 모델이 못해서 생기는 loss가 아니다. P가 원래 가진 불확실성이므로 완벽한 모델 Q=P도 평균적으로 H(P)보다 낮은 cross-entropy를 만들 수 없습니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>평균 code length와 연결할 때 주의할 점</h3>
        <p>
          Shannon의 source coding theorem에서 entropy는 긴 symbol sequence를 lossless coding할 때 달성 가능한 평균 code
          length의 하한과 연결된다. 자주 나오는 symbol에 짧은 code를 배정하는 원리다. 다만 “문장 하나의 entropy”처럼 말하려면 alphabet,
          tokenization, 문맥에 대한 conditional distribution을 먼저 정해야 하며 differential entropy를 같은 방식으로 직접 해석해서도 안
          된다.
        </p>
        <p>
          숫자로 확인하면 경계가 더 분명하다. 공정한 동전
          <code>P=(0.5,0.5)</code>의 entropy는
          <code>−2·0.5·ln 0.5=ln 2≈0.693 nat</code>이고, 결과가 항상 앞면인
          <code>P=(1,0)</code>은 <code>0 nat</code>이다. K개 사건에서는 균등
          분포가 <code>ln K</code>로 가장 크지만, 이 결론은 discrete probability
          distribution을 고정한 경우의 비교다.
        </p>
      </div>
    </section>
  );
}
