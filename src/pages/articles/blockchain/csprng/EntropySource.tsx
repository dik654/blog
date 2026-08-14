import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";

export default function EntropySource() {
  return (
    <section id="entropy-source" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Entropy source: 가장 쉬운 추측을 기준으로 seed를 평가한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Entropy는 파일 크기나 sample 수가 아니라 공격자가 모르는 불확실성입니다. Timing jitter 1,024개를 모았다고 1,024-bit entropy가 생기지 않습니다. Sample들이 correlated하거나 VM host가 schedule을 관찰하고 있다면 가장 가능성 높은 raw sequence의 확률이 큽니다. Noise source model, digitization, restart behavior, conditioning과 continuous health tests를 하나의 pipeline으로 평가해야 합니다.
        </p>
      </div>
      <ExplainedFormula
        question="공격자가 한 번에 맞힐 가능성이 가장 큰 raw outcome으로부터 몇 bit를 보수적으로 셀까요?"
        idea="Shannon entropy의 평균 대신 가장 높은 확률 pmax 하나를 봅니다. 가장 쉬운 결과가 1/8 확률이라면 최악의 한 번 추측에 대해 3-bit보다 강하다고 말할 수 없습니다."
        formula={String.raw`H_\infty(X)=-\log_2\!\left(\max_x \Pr[X=x]\right)`}
        terms={[
          { symbol: "X", name: "raw-source random variable", description: "고정한 sampling window에서 관찰한 outcome입니다." },
          { symbol: "p_{\max}", name: "most likely outcome probability", description: "공격자 관점에서 가장 잘 맞힐 수 있는 값의 확률입니다." },
          { symbol: "H_\infty", name: "min-entropy", description: "최선의 단일 guess에 대응하는 보수적 bit 수입니다." },
        ]}
        assumptions={["확률은 실제 deployment 환경과 공격자의 side information을 반영한 source model에서 추정합니다.", "독립성을 검증하지 않은 sample의 min-entropy를 단순 합산하지 않습니다."]}
        interpretation="pmax=1/8이면 H∞=3 bits입니다. 128-bit key buffer에 이 source를 반복 복사해도 seed entropy는 3 bits를 넘지 않으며, hash conditioning은 entropy를 정돈할 수 있지만 새 entropy를 만들어내지 않습니다."
      />
      <ExplainedFormula
        question="h bit의 min-entropy만 가진 seed로 만든 256-bit key는 얼마나 강할까요?"
        idea="Generator output 길이가 길어져도 공격자는 가능한 seed를 열거해 key 후보를 재생성할 수 있습니다. Guessing work의 상한은 출력 길이가 아니라 seed의 실제 entropy와 DRBG security strength 중 작은 값에 묶입니다."
        formula={String.raw`b_{\mathrm{effective}}\le \min\!\left(H_\infty(S),\,b_{\mathrm{DRBG}},\,b_{\mathrm{key}}\right)`}
        terms={[
          { symbol: "S", name: "seed material", description: "Instantiate에 들어간 전체 entropy-bearing input입니다." },
          { symbol: "b_{DRBG}", name: "DRBG security strength", description: "선택한 mechanism·parameter가 목표로 하는 최대 strength입니다." },
          { symbol: "b_{key}", name: "key strength ceiling", description: "생성하려는 key algorithm의 독립적인 보안 상한입니다." },
        ]}
        assumptions={["공격자가 output이나 public key로 seed candidate를 판별할 수 있는 상황을 고려합니다.", "Entropy estimate가 deployment·boot·clone 상태에서 유효합니다."]}
        interpretation="8-bit seed로 256-bit key를 만들면 공격자는 256개 seed만 재생하면 됩니다. Output length를 늘리거나 statistical test를 통과해도 유효 보안 강도는 8 bits를 넘지 않습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>수집·conditioning·health test의 역할</h3>
        <p>
          Raw noise는 bias와 correlation을 가질 수 있으므로 approved conditioning function으로 고정 길이 seed material을 만듭니다. Conditioning은 분포를 다루기 쉽게 만들지만 source failure를 감추는 장치가 아닙니다. Repetition count와 adaptive proportion 같은 online health test는 갑자기 stuck된 source를 빠르게 검출하고 fail closed해야 하며, offline statistical suite의 합격만으로 entropy rate를 인증하지 않습니다.
        </p>
        <p>
          단일 CPU instruction·시간·PID·network event만 독립 source라고 가정하지 않습니다. 여러 source를 섞을 때도 “각각 64-bit”를 더하는 대신 하나가 다른 하나를 관찰·조작할 수 있는지 분석합니다. VM image를 복제하거나 process를 fork하면 DRBG state도 복제될 수 있으므로 OS의 fork safety와 reseed semantics를 확인하고, container마다 같은 image secret을 seed로 쓰지 않습니다.
        </p>
      </div>
      <div id="paper-nist-entropy-source" className="scroll-mt-24">
        <CitationBlock source="NIST SP 800-90B · Entropy Sources" href="https://csrc.nist.gov/pubs/sp/800/90/b/final" citeKey={3}>
          문제: Noise source가 실제로 제공하는 entropy를 모델링·검증하고 고장을 감지합니다. 기여: IID/non-IID min-entropy estimation, conditioning와 startup/continuous health test 요구를 정의합니다. 전제: raw data collection과 operating condition을 고정하고 문서화합니다. 근거 범위: entropy-source validation입니다. 비주장: DRBG algorithm의 generate security나 application key lifecycle을 대신하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
