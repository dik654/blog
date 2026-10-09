import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

// 교육용 측정 기록입니다. 실험 데이터나 보안 인증 결과가 아닙니다.
const signals = [
  [1, 0, "+", "+", 0, "보관"],
  [2, 1, "×", "×", 1, "검사 공개"],
  [3, 0, "+", "×", 1, "제외"],
  [4, 1, "×", "×", 1, "보관"],
  [5, 0, "+", "+", 1, "보관 · 오류"],
  [6, 1, "×", "+", 0, "제외"],
  [7, 1, "+", "+", 1, "보관"],
  [8, 1, "×", "×", 1, "보관"],
  [9, 0, "+", "×", 0, "제외"],
  [10, 0, "×", "×", 0, "검사 공개"],
  [11, 1, "+", "×", 0, "제외"],
  [12, 0, "×", "×", 0, "보관"],
] as const;

export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 멀리 떨어진 두 사람이 같은 비밀을 만들려면</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">통신 내용을 잠그려면 양쪽이 함께 아는 비밀이 필요합니다. 빛을 보내고 측정한 기록에서 그 비밀을 만들 수 있습니다. 중간에서 신호를 읽는 행위가 측정 결과를 바꿀 수 있다는 성질을 이용합니다.</p>
          <p className="leading-8">측정값이 같다는 사실만으로 충분하지는 않습니다. 남이 얼마나 알아냈을지 계산하고 정보를 공개하며 틀린 부분을 맞춘 뒤, 남은 비밀의 양에 맞춰 결과를 줄여야 합니다. 충분히 남지 않으면 이번 통신에서는 키를 만들지 않습니다.</p>
        </div>
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">먼저 빛이 다니는 길과, 측정 기록을 비교하는 길을 나눠 봅니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 신호를 보내는 장치 뒤에 기록을 거르는 장치가 있습니다</h2>
        <NumericPath title="공유 비밀을 만들기 위한 네 역할" steps={[
          { label: "신호 준비", value: "무작위 값", detail: "빛에 값을 담아 보냅니다." },
          { label: "신호 측정", value: "상대의 기록", detail: "받은 빛을 재고 결과를 적습니다." },
          { label: "기록 비교", value: "남길 후보", detail: "일부를 버리고 오류를 검사합니다." },
          { label: "비밀 추출", value: "짧은 결과 또는 중단", detail: "알려진 정보를 빼고 남는 길이를 정합니다." },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">빛을 재는 일은 전용 장치가 맡습니다. 이후의 비교와 계산은 보통의 통신과 컴퓨터로 합니다. 비교 메시지를 남이 읽는 것은 허용해도, 상대를 사칭하거나 내용을 바꾸도록 허용해서는 안 됩니다.</p>
        </div>
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">12번 보낸 기록을 펼치면 무엇을 버리고 무엇을 검사하는지 보입니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 12번 보내서 8개를 남기고, 그중 2개를 공개합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">보내는 사람 A와 받는 사람 B가 빛 신호 12개를 주고받습니다(가정). 신호마다 무작위로 고른 0 또는 1을 담습니다. 두 사람은 각자 + 또는 ×라는 두 방향 묶음 중 하나를 무작위로 고릅니다. 검출과 측정 기록을 정한 다음 방향을 비교합니다. 같은 묶음을 쓴 기록만 남깁니다.</p>
          <p className="leading-8">아래는 설명을 위해 만든 결과입니다. 12개가 모두 검출됐고 같은 묶음을 쓴 8개 중 1개에 오류가 생겼다고 놓았습니다. 실제 실험의 거리·속도·잡음을 측정한 표는 아닙니다.</p>
        </div>
        <figure className="my-7">
          <figcaption className="mb-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">가정 기록 · +/×는 방향 선택, 0/1은 값입니다. 오른쪽 처리는 기저 비교와 검사 표본 선택 후의 결과입니다. 오류 위치는 독자를 위해 함께 표시했습니다.</figcaption>
          <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700">
            <table className="w-full min-w-[620px] text-center text-sm">
              <thead className="bg-neutral-100 dark:bg-neutral-900"><tr>{["신호 번호", "A 값", "A 방향", "B 방향", "B 값", "처리"].map((label) => <th className="px-4 py-3 font-semibold" key={label}>{label}</th>)}</tr></thead>
              <tbody>{signals.map((row) => <tr key={row[0]} className="border-t border-neutral-200 dark:border-neutral-700">{row.map((cell, index) => <td key={index} className="px-4 py-3">{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </figure>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">방향이 같은 8개 중 무작위 검사 대상으로 2번과 10번이 뽑혔다고 놓습니다. 두 값은 모두 일치하지만 공개했으므로 비밀 후보에서 뺍니다.</p>
          <p className="leading-8">표에서 보관으로 표시한 신호를 위에서부터 읽으면 나머지 6개가 남습니다. A의 기록은 010110, B의 기록은 011110입니다. 비트열의 순서는 원래 신호 번호의 순서를 유지합니다.</p>
          <p className="leading-8">검사한 2개가 맞아도 남은 기록의 세 번째 값은 다릅니다. 검사한 두 값만으로 나머지 값의 일치 여부를 알 수는 없습니다.</p>
        </div>
        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">방향을 왜 두 가지로 나누는지 빛을 재는 단계만 열어 봅니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 같은 방향으로 재면 읽히고, 다른 방향이면 결과가 갈립니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">+에서는 가로를 0, 세로를 1로 정합니다. ×에서는 가로에서 45° 기울인 방향을 0, 135° 방향을 1로 정합니다. 이 각도는 빛이 진행하는 방향에 수직인 평면에서 두 장치가 맞춘 기준입니다.</p>
          <p className="leading-8">이상적인 장치에서 가로 신호를 +로 재면 0을 얻습니다. 같은 신호를 ×로 재면 0과 1이 각각 절반의 확률로 나옵니다. 신호 하나에서 두 방향의 답을 모두 확실하게 읽어 낼 수는 없습니다.</p>
        </div>
        <NumericPath title="가로로 준비한 신호 하나를 측정하는 두 선택" steps={[
          { label: "무엇을 보냈나", value: "가로 · 값 0", detail: "진행 방향에 수직인 평면에서 준비합니다." },
          { label: "같은 묶음으로 재면", value: "+ → 0", detail: "이상적인 조건에서 확정됩니다." },
          { label: "다른 묶음으로 재면", value: "× → 0 또는 1", detail: "각각 1/2 확률입니다." },
        ]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">서로 다른 방향으로 잰 값을 버리는 이유를 이제 설명할 수 있습니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 같은 방향으로 잰 값도 바로 비밀로 쓸 수는 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">3번처럼 방향이 다르면 B의 값은 A의 값을 안정적으로 전달하지 못합니다. 우연히 값이 같은 9번도 버립니다. 값을 먼저 대조해 같은 것만 고르면 어떤 값을 보냈는지 드러내기 때문입니다. 두 방향을 똑같은 확률로 골랐다면 일치율의 기대값은 1/2이지만 이번처럼 8/12가 나올 수도 있습니다.</p>
          <p className="leading-8">5번처럼 방향은 맞고 값이 다르면 전송 잡음이나 중간 개입을 살펴야 합니다. 오류만 보고 원인을 단정할 수는 없습니다. 일부 값을 공개해 상태를 추정하고 남은 값의 차이는 추가 정보를 주고받아 고칩니다.</p>
          <p className="leading-8">오류를 고치려고 보낸 정보도 남이 읽습니다. 그래서 고친 6개를 그대로 비밀이라고 부를 수 없습니다. 공격자가 알 수 있는 양을 반영해 더 짧게 추출해야 합니다. 공개 대화를 주고받을 때는 상대가 진짜 B인지도 확인해야 합니다. 사칭자가 양쪽에서 따로 대화를 이어 가면 빛의 성질만으로는 상대의 신원을 알아낼 수 없습니다.</p>
        </div>
        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">각 단계가 해결하는 문제를 기억한 채 공식 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. BB84는 신호와 공개 대화를 함께 쓰는 키 분배 절차입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">물리 신호와 후처리로 공유 키를 만드는 체계를 양자키분배, QKD라고 합니다. 두 방향 묶음으로 값을 준비하고 재는 대표 절차가 BB84입니다. A와 B는 논문에서 보통 Alice와 Bob, 공격자는 Eve라고 부릅니다.</p>
        </div>
        <dl className="my-6 divide-y divide-neutral-200 rounded-xl border border-neutral-200 px-5 dark:divide-neutral-700 dark:border-neutral-700">
          {[
            ["방향을 정해 값을 구별하는 기준", "기저(basis)입니다. 이번 +와 ×가 두 기저입니다."],
            ["검출된 기록 중 기저가 맞는 것만 선택", "기저 선별(sifting)입니다. 실제 키용·검사용 기저 배치는 프로토콜마다 다릅니다."],
            ["일부 공개값의 불일치 비율로 상태 추정", "매개변수 추정(parameter estimation)입니다. 비트 오류율인 QBER도 여기에 들어갑니다."],
            ["서로 다른 기록을 같게 고침", "오류 정정(error correction), 또는 정보 조정입니다. 같아졌는지 별도로 검증합니다."],
            ["공격자가 모르는 부분을 더 짧게 추출", "프라이버시 증폭(privacy amplification)입니다. 공개 난수로 고른 추출 함수를 사용합니다."],
            ["대화 상대와 메시지 변경 여부 확인", "인증(authentication)입니다. 미리 공유한 비밀이나 서명으로 통신 기록을 보호합니다."],
            ["일반 컴퓨터에서 양자 공격을 고려한 암호 계산", "양자내성암호(PQC)입니다. 키 합의와 서명은 각각 다른 일을 합니다."],
            ["멀리 떨어진 장치의 결과가 미리 정한 답으로 설명되는지 검사", "Bell 부등식은 측정 선택이 독립적이고 측정 중 답을 주고받지 않는 조건에서 그런 상관관계의 한계를 나타냅니다."],
          ].map(([role, name]) => <div key={role} className="py-4"><dt className="font-semibold">{role}</dt><dd className="mt-2 text-sm leading-7">{name}</dd></div>)}
        </dl>
        <p className="leading-8">측정 확률의 기초는 <Link className="underline" to="/cs/crypto/quantum-computing-and-cryptographic-risk#names">진폭과 측정</Link>에서 이어집니다. 여기서는 두 기저의 결과가 절반씩 갈린다는 조건을 사용합니다.</p>
        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">이제 남은 6비트의 차이를 실제 공개 메시지로 고쳐 봅니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 010110과 011110을 맞추면 무엇이 공개될까요</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">6비트의 자리를 왼쪽부터 1~6이라고 부릅니다. 여러 자리에서 1의 개수가 홀수면 1, 짝수면 0을 내는 계산을 XOR이라고 합니다. 이 결과가 묶음의 패리티입니다. 오류가 최대 1개라는 교육용 가정에서 세 묶음을 비교해 위치를 찾겠습니다.</p>
        </div>
        <div className="my-6 overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700">
          <table className="w-full min-w-[600px] text-sm"><thead className="bg-neutral-100 dark:bg-neutral-900"><tr>{["비교할 자리", "A: 010110", "B: 011110", "차이"].map((x) => <th key={x} className="px-4 py-3 text-left">{x}</th>)}</tr></thead><tbody>
            <tr><td className="px-4 py-3">1·3·5</td><td className="px-4 py-3">0⊕0⊕1=1</td><td className="px-4 py-3">0⊕1⊕1=0</td><td className="px-4 py-3">1</td></tr>
            <tr><td className="px-4 py-3">2·3·6</td><td className="px-4 py-3">1⊕0⊕0=1</td><td className="px-4 py-3">1⊕1⊕0=0</td><td className="px-4 py-3">1</td></tr>
            <tr><td className="px-4 py-3">4·5·6</td><td className="px-4 py-3">1⊕1⊕0=0</td><td className="px-4 py-3">1⊕1⊕0=0</td><td className="px-4 py-3">0</td></tr>
          </tbody></table>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">A가 공개하는 값은 110입니다. B의 값 000과 다르게 나온 묶음은 첫째·둘째입니다. 두 묶음에 함께 들어가고 셋째에는 없는 자리가 3이므로, B는 세 번째 1을 0으로 고칩니다. 결과는 양쪽 모두 010110입니다. 실제 통신에서는 오류 개수를 미리 알 수 없으므로 오류 정정 뒤 일치 검증도 필요합니다.</p>
          <p className="leading-8">Eve도 110을 읽었습니다. 여섯 값 자체를 전부 공개하지는 않았지만 세 관계식을 알려 줬습니다. 세 식은 독립이므로 균등한 6비트의 가능성 64개를 8개로 줄입니다. Eve가 그 밖의 정보를 전혀 모른다는 낙관적 가정에서도 남는 불확실성은 3비트입니다. 추가 검증 메시지의 유출도 따로 계산해야 합니다.</p>
          <p className="leading-8">압축 연산만 예로 들면, 3·4·5번의 XOR과 3·5·6번의 XOR은 각각 0과 1입니다. 6비트에서 01이라는 2비트를 얻었습니다. 이는 무작위 2×6 이진 행렬로 정하는 해시 가족에서 고른 한 예입니다(가정). 공개한 행렬 자체를 비밀로 둘 필요는 없지만 출력 길이가 안전한지는 아직 증명하지 않았습니다.</p>
          <p className="leading-8">기저 목록, 검사 번호·값, 정정 메시지, 압축 함수 선택을 이번 세션과 상대 신원에 묶어 인증합니다. 마지막 확인에 실패하면 키를 내보내지 않습니다. 인증은 설명의 마지막에 점검하더라도 실제로는 공개 대화 전체를 보호해야 합니다.</p>
        </div>
        <CitationBlock source="ITU-T X.1711 · §7.4, §8.2, Appendix IV" citeKey={1} href="https://www.itu.int/epublications/publication/itu-t-x-1711-2026-03-framework-of-quantum-key-distribution-qkd-protocols-in-qkd-networks">정정·검증·추출의 역할을 대조했습니다. 12개 신호와 세 패리티는 이 글의 가정 예제이며 표준의 성능 시험이 아닙니다.</CitationBlock>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">이제 도청이 오류로 나타나는 조건과, 작은 검사가 놓치는 경우를 계산합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 25% 오류는 특정 도청 모형의 조건부 확률입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">Eve가 모든 신호를 가로채 무작위 기저로 측정하고 얻은 상태를 다시 보낸다고 놓습니다. 이를 intercept-resend라고 합니다. 이상적인 단일 광자와 독립적인 기저 선택, 다른 잡음이 없는 조건을 둡니다. A와 B의 기저가 같은 기록만 보겠습니다.</p>
          <p className="leading-8">Eve의 기저가 틀릴 확률은 1/2입니다. 그때 B가 A와 다른 값을 얻을 확률도 1/2입니다. Eve의 기저가 맞은 경우에는 이 모형에서 오류가 생기지 않습니다.</p>
        </div>
        <ExplainedFormula
          question="남긴 기록에서 도청 때문에 값이 다를 확률은 얼마인가요?"
          idea="A와 B의 기저 일치를 먼저 조건으로 고정하고 Eve가 틀린 기저를 고르는 경우의 기여만 셉니다."
          formula={String.raw`P(B\ne A\mid a=b)=\frac12\times\frac12=\frac14`}
          annotatedFormula={String.raw`P(B\ne A\mid a=b)=\underbrace{\frac12}\times\underbrace{\frac12}=\frac14`}
          operations={[
            { expression: String.raw`\frac12`, annotation: "Eve가 A와 다른 기저를 고를 확률" },
            { expression: String.raw`\frac12\times\frac12`, annotation: "그 경우 B의 값이 틀릴 조건부 확률을 곱함" },
          ]}
          terms={[
            { symbol: "A,B", name: "송신·수신 비트", description: "서로 비교할 0 또는 1의 값입니다." },
            { symbol: "a=b", name: "기저 일치 조건", description: "전체 전송 신호가 아니라 선별된 기록을 분모로 삼습니다." },
          ]}
          assumptions={["모든 신호를 가로채 다시 보내는 지정 모형이며 일반 공격의 보편 오류율이 아닙니다.", "단일 광자·이상적 장치·독립적인 균등 기저·추가 잡음 없음의 조건입니다."]}
          interpretation="기저가 일치한 기록의 기대 오류율은 25%입니다. 특정 12회 결과에서 정확히 25%가 나와야 한다는 뜻은 아닙니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">이 독립 공격 모형에서 검사 2개가 우연히 모두 맞을 확률은 (3/4)²=9/16, 즉 56.25%입니다. 검사 2개만으로 도청이 없었다고 결론 내리기 어렵습니다. 일반 공격이나 장치 잡음에 이 확률을 그대로 적용할 수는 없습니다.</p>
          <p className="leading-8">앞의 실제 표는 또 다른 계산입니다. 8개 중 오류 1개가 고정된 상태에서 중복 없이 2개를 무작위로 뽑으면, 오류를 피하는 경우는 21/28=75%입니다. 공격 모형의 확률과 이미 주어진 기록을 뽑는 확률은 서로 다른 질문입니다.</p>
        </div>
        <SourceApplication source="Bennett–Brassard · 1984 원문 p.177" excerpt="publicly comparing some of the bits" application="2번과 10번의 값을 공개해 비교하는 단계입니다. 공개한 두 값은 비밀 후보에서 제외합니다. 원문의 직관에 더해 실제 보안 주장은 표본 수와 허용 실패 확률을 명시해야 합니다." />
        <div id="paper-bb84" className="scroll-mt-20"><CitationBlock source="BB84 · Quantum cryptography: Public key distribution and coin tossing" citeKey={2} href="https://arxiv.org/abs/2003.06557">저자가 올린 1984년 원문 스캔 p.175~177. 측정 기저, 가로채기·재전송의 1/4 불일치, 공개 검사와 인증을 확인했습니다.</CitationBlock></div>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">오류 검사는 남길 키의 길이를 정하기 위한 입력입니다. 그 길이를 정하는 원문 식을 읽습니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 남은 6비트를 2비트로 줄여도 보안 증명은 별도로 필요합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">Tomamichel 등의 유한 키 분석은 공격자가 가진 정보와 공개 대화까지 고려해 추출 길이를 정합니다. 원문의 X는 정정할 비트열, E′는 공격자의 양자 정보와 공개 대화를 합친 정보입니다. 남은 비밀의 양을 최소 엔트로피라는 값으로 나타냅니다.</p>
          <p className="leading-8">먼저 세 패리티 외에는 아무것도 새지 않았고 원래 여섯 값이 완전히 균등했다고 가정해 봅니다. 이때 공격자는 8개 후보 중 하나를 맞혀야 하므로 최선의 성공 확률은 1/8입니다. 그 역수의 밑 2 로그인 3이 최소 엔트로피입니다. 실제 QKD에서는 이 값을 관측값·장치 모형·보안 증명으로 아래에서 보장해야 합니다.</p>
        </div>
        <SourceApplication source="Tight Finite-Key Analysis · Methods, 식 (6) 앞뒤" excerpt="including the classical communication sent by Alice and Bob over the authenticated channel" application="공개 패리티 110을 E′에 포함합니다. Alice와 Bob의 기록이 같아졌어도 공격자의 후보는 이미 64개에서 8개로 줄었습니다. 인증된 대화도 읽을 수 있다는 점이 계산에 남습니다." />
        <ExplainedFormula
          question="추출한 키가 균등하고 비밀인 이상적 키에 얼마나 가까운지 무엇으로 제한하나요?"
          idea="양자 정보를 가진 공격자까지 포함한 추출 정리는 남은 비밀의 양보다 충분히 짧은 출력을 요구합니다. 다음은 원문 식 (6)의 보안 오차 상계 표현입니다."
          formula={String.raw`\Delta\le 2\varepsilon+\frac12\sqrt{2^{\ell-H_{\min}^{\varepsilon}(X\mid E')}}`}
          annotatedFormula={String.raw`\Delta\le\underbrace{2\varepsilon}+\underbrace{\frac12\sqrt{2^{\ell-H_{\min}^{\varepsilon}(X\mid E')}}}`}
          operations={[
            { expression: String.raw`\ell-H_{\min}^{\varepsilon}(X\mid E')`, annotation: "출력 길이에서 보장된 비밀의 양을 빼서 압축 여유를 계산" },
            { expression: String.raw`\frac12\sqrt{2^{\ell-H_{\min}^{\varepsilon}(X\mid E')}}`, annotation: "압축 여유를 이상적 비밀 키와의 거리 상계로 바꿈" },
            { expression: String.raw`2\varepsilon`, annotation: "드문 불리한 상태를 근사하며 허용한 오차를 더함" },
          ]}
          terms={[
            { symbol: String.raw`\ell`, name: "출력 길이", description: "최종 키의 비트 수입니다. 시연에서는 2입니다." },
            { symbol: String.raw`H_{\min}^{\varepsilon}(X\mid E')`, name: "보장할 비밀의 양", description: "공격자의 정보를 조건으로 한 완화 최소 엔트로피입니다. 단위는 비트입니다." },
            { symbol: String.raw`\varepsilon,\Delta`, name: "보안 오차", description: "ε는 근사에 쓰는 매개변수입니다. Δ는 실제 키와 이상적 비밀 키의 거리이며 우변으로 상한을 제한합니다. 오류 비트의 비율과 다릅니다." },
          ]}
          assumptions={["독립적인 균등 난수로 고른 2-universal 해시 가족과 유효한 엔트로피 하한을 사용합니다.", "통과 확률·표본 추정·정정 검증·인증의 오차를 전체 프로토콜에서 함께 계산해야 합니다."]}
          interpretation="낙관적으로 ε=0, 비밀의 양=3, 출력 길이=2를 넣어도 이 식의 상계는 약 0.354입니다. 예를 들어 목표 10⁻⁶을 이 계산으로 증명할 수 없습니다. 상계가 크다는 사실만으로 실제 공격 성공률이 0.354라고 단정하지 않습니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">이번 12신호 예제에서는 충분한 엔트로피 하한과 작은 전체 보안 오차를 입증하지 않았습니다. 01은 압축 연산의 시연값으로만 남기고 실제 키 출력은 0비트, 즉 중단으로 처리합니다. 보안 증명에 맞는 더 큰 표본과 장치 조건으로 다시 실행해야 합니다.</p>
          <p className="leading-8">이 논문의 구체적인 키 길이 식 (2)는 키용·검사용 기저를 구분한 프로토콜에 속합니다. 두 기저를 섞어 선별한 이 교육용 표를 그 식에 그대로 대입하지 않았습니다. 공개한 검사 비트를 빼는 일과, 검사 결과에서 미공개 부분의 정보를 추정하는 일도 별개입니다.</p>
        </div>
        <AlgorithmBlock
          title="12개 신호를 처리하고 이번 키 출력을 중단하는 교육용 의사코드"
          input={[
            "3절의 측정 기록 12개와 A·B의 기저 목록",
            "이 세션의 상대 인증 수단과 공개 대화 기록",
            "단일 오류 가정의 시연용 정정·압축 함수; 실제 엔트로피 하한 증명은 없음",
          ]}
          steps={[
            { code: "require_authenticated_transcript()", note: "모든 공개 메시지의 출처와 변경 여부를 확인합니다. 인증 실패가 생기면 즉시 중단합니다." },
            { code: "sifted = select_same_basis(records) // 12 → 8", note: "값을 공개해 고르지 않고 기저가 같은 번호를 원래 순서로 남깁니다." },
            { code: "test = publish_values(sifted, [2, 10]) // 불일치 0", note: "이 번호가 무작위로 뽑힌 이번 사례를 재생합니다. 매번 같은 두 번호를 고르는 규칙이 아닙니다." },
            { code: "remaining = remove_test(sifted) // 8 → 6", note: "A는 010110, B는 011110입니다. 공개한 검사값은 후보에서 제외합니다." },
            { code: "publish_parity(110); correct_B(3) // 양쪽 010110", note: "오류가 최대 1개라는 가정에서만 위치 3을 고칩니다. 독립 관계 3개의 누출을 기록하고 추가 검증 누출도 계산해야 합니다." },
            { code: "demo_hash(010110) = 01 // 키로 승인하지 않음", note: "앞에서 고른 이진 행렬의 압축 연산만 재현합니다. 출력 2비트가 안전하다는 판정은 아닙니다." },
            { code: "if entropy_proof_missing: abort; approved_key_bits = 0", note: "이번 입력에는 실제 QKD의 엔트로피 하한과 전체 보안 오차 증명이 없습니다. 인증된 최종 대화까지 확인하더라도 이 부족분을 대신할 수 없습니다." },
          ]}
          output="선별 8개 → 미공개 후보 6비트 → 압축 시연 01; 실제 키 승인 0비트(중단)"
        />
        <div id="paper-finite-key" className="scroll-mt-20"><CitationBlock source="Tomamichel·Lim·Gisin·Renner · Tight Finite-Key Analysis for Quantum Cryptography" citeKey={3} href="https://arxiv.org/html/1103.4130v2">2012 원문 Table I와 Methods 식 (6)·(7), Supplementary 식 (S2)를 읽습니다. 공개 누출·검증·추출을 분리하며, 원문의 Δ 표현은 보장하는 거리의 상계로 풀어 적었습니다.</CitationBlock></div>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">이 계산을 실제 장비에 적용하려면 장치에 관한 가정도 확인해야 합니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 장치·중계소·인증이 바뀌면 보안 주장도 다시 정합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">첫째는 광원입니다. 약한 레이저 펄스에는 광자가 없거나 여러 개일 수 있습니다. 여러 광자의 일부를 빼내는 공격은 이상적인 단일 광자 표만으로 평가할 수 없습니다. 밝기를 달리한 시험 신호를 섞는 decoy-state 방식은 검출 통계를 비교해 단일 광자 성분의 기여와 오류를 제한합니다. 밝기 선택과 상태 준비의 가정도 검증해야 합니다.</p>
          <p className="leading-8">
            둘째는 검출기입니다. MDI, 즉 측정 장치 독립 QKD에서는 양쪽이 신호를 보내고 가운데의 측정 발표로 기록을 고릅니다. 측정소를 신뢰하지 않아도 되는 증명을 쓰지만 양끝의
            상태 준비와 난수·인증까지 신뢰가 사라지지는 않습니다.
          </p>
          <p className="leading-8">DI, 즉 장치 독립 QKD는 여러 측정 선택에서 나타나는 상관관계를 검사합니다. Bell 부등식 위반으로 장치 내부 모형에 대한 의존을 줄입니다. 독립적인 비밀 난수, 실험실 정보 유출 방지, 인증과 신뢰할 후처리, 유한 표본 분석은 여전히 필요합니다. MDI와 DI를 같은 말로 쓰면 믿어야 할 장치를 잘못 고릅니다.</p>
        </div>
        <div id="paper-decoy" className="scroll-mt-20"><CitationBlock source="Lo·Ma·Chen · Decoy State Quantum Key Distribution" citeKey={4} href="https://arxiv.org/abs/quant-ph/0411004">2005 원 논문의 강도별 통계와 단일 광자 기여 추정을 사용합니다. 이 글은 특정 상용 광원의 누출이나 키율을 측정하지 않았습니다.</CitationBlock></div>
        <div id="paper-mdi" className="scroll-mt-20"><CitationBlock source="Lo·Curty·Qi · Measurement-device-independent quantum key distribution" citeKey={5} href="https://arxiv.org/abs/1109.1473">2012 원 논문. 측정소에 대한 신뢰 제거와 양끝 광원 가정을 구별합니다.</CitationBlock></div>
        <div id="paper-di" className="scroll-mt-20"><CitationBlock source="Zhang 외 · A device-independent quantum key distribution system for distant users" citeKey={6} href="https://www.nature.com/articles/s41586-022-04891-y">2022 실험 논문의 DIQKD protocol 가정 목록을 확인했습니다. 논문의 점근적 키율을 유한 블록의 실제 산출 키율로 옮기지 않습니다.</CitationBlock></div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">셋째는 운영 경로입니다. 손실·잡음·시간 동기·검출 효율에 따라 남는 기록이 줄어듭니다. 거리를 늘릴 때 중간 지점에서 키를 받아 다시 전달하는 신뢰 중계 방식을 쓰면 그 지점의 보안도 필요합니다. 이는 키를 알 필요가 없는 MDI 측정소와 역할이 다릅니다. 신호나 대화를 막는 공격은 통신을 중단시킬 수 있습니다.</p>
          <p className="leading-8">미국 NSA는 위에서 본 장치와 운영의 한계를 들어 국가안보시스템인 NSS에 QKD를 권고하지 않는다고 설명합니다. 장치 검증과 신뢰 중계, 비용, 서비스 거부가 주요 쟁점입니다.</p>
          <p className="leading-8">이 의견은 NSS의 조달·운영에 관한 것이므로 모든 국가·용도에 적용되는 금지로 읽을 수는 없습니다. 같은 페이지의 오래된 NIST 표준화 진행 설명은 현재 상태의 근거로 쓰지 않습니다.</p>
        </div>
        <CitationBlock source="NSA · QKD and Quantum Cryptography" citeKey={7} href="https://www.nsa.gov/Cybersecurity/Quantum-Key-Distribution-QKD-and-Quantum-Cryptography-QC/">2026-10-04 확인. NSS 대상 결론과 구현·신뢰 중계·가용성 한계에 한정해 읽었습니다.</CitationBlock>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">마지막은 상대 인증입니다. ITU-T X.1711은 2026년 3월 승인된 권고(ITU 권고 목록의 판 표기 03/26 기준, 승인 일자는 확인하지 못함)이며 §7.2.2는 공개 대화의 출처와 무결성 확인을 요구합니다. 미리 공유한 키로 메시지를 인증하거나, 양자내성 서명으로 상대를 인증할 수 있습니다. 후자를 택하면 인증에는 해당 서명의 계산상 가정이 들어갑니다. 키 생성 장치만으로 모든 보안이 정보이론적으로 보장되는 것은 아닙니다.</p>
          <p className="leading-8">인증용 비밀을 소비하는 방식에서는 다음 실행에 남겨 둘 몫도 고려합니다. 키를 얻은 뒤에는 암호화 알고리즘·키 보관·재사용 방지·삭제가 필요합니다. QKD가 응용 데이터의 암호화나 공개 서명 자체를 대신하지는 않습니다.</p>
        </div>
        <div id="paper-x1711" className="scroll-mt-20"><CitationBlock source="ITU-T X.1711 (03/2026) · §1, §7.2.2 Note 4" citeKey={8} href="https://www.itu.int/rec/T-REC-X.1711">§7.2.2의 PQC 인증 결합과 현재 판을 대조했습니다. §1은 개별 보안 증명·구현 보안을 이 프레임워크의 규정 범위에서 제외하므로 제품 안전 인증서로 읽지 않습니다.</CitationBlock></div>
        <p className="leading-8">일반 네트워크의 키 합의는 <Link className="underline" to="/cs/crypto/ml-kem-and-noisy-equations">ML-KEM</Link>, 인증 서명은 <Link className="underline" to="/cs/crypto/post-quantum-signatures">양자내성 서명</Link>으로 이어집니다. 계정 승인 정책까지 바꾸는 사례는 <Link className="underline" to="/cs/blockchain/pq-account">양자내성 계정 이전</Link>에서 다룹니다.</p>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">다음 질문에서 측정 결과, 보안 증명, 통신 상대의 신뢰를 각각 판정해 보세요.</p>
        <ReviewPrompts questions={["검사한 2비트가 모두 맞으면 남은 6비트도 같다고 볼 수 있을까요? (답: 3절)", "패리티 110을 공개하고 값을 맞췄다면 왜 6비트를 그대로 키로 쓰지 않을까요? (답: 7절)", "가운데 측정소를 신뢰하지 않는 MDI를 쓰면 상대 인증도 없앨 수 있을까요? (답: 10절)"]} />
      </section>
    </div>
  );
}
