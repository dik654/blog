import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import CarrierCountViz from "./bands-and-doping/viz/CarrierCountViz";

/**
 * 반도체 기초 1편. MIT 6.012의 300 K n_i를 기준으로 1 cm³를 센다.
 * 도너·억셉터 10^16 cm^-3는 글에서 선언한 가정값이다.
 */
export default function BandsAndDopingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 실리콘인데 움직일 수 있는 전자가 달라집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            실리콘을 똑같이 1 cm³씩 두 조각 잘라 300 K에 둡니다. 첫 조각에는
            움직일 수 있는 전자가 약 10¹⁰개 있습니다. 둘째에는 약 10¹⁶개가
            있습니다. 백만 배 차이입니다. 두 조각의 모양과 온도를 같게 두고,
            둘째에 다른 원자를 섞었다고 가정했습니다. 이 작은 차이가 왜
            움직이는 전하의 수를 바꾸는지가 이 글의 질문입니다.
          </p>
          <p className="leading-7">
            이 숫자의 출처를 먼저 나눕니다. <strong>300 K 순수 실리콘의
            약 10¹⁰ cm⁻³</strong>는 MIT 6.012 강의 자료의 교육용 기준값입니다.
            둘째 조각에 10¹⁶ cm⁻³의 다른 원자를 넣어 거의 전부 작동하게 한다는
            조건은 <strong>이 글의 가정</strong>입니다. 이후의 10¹⁶과 10⁴도
            그 가정에서 계산한 값입니다.
          </p>
          <div className="not-prose my-8 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-bold">조각 A · 기준 상태</p>
              <p className="mt-2 leading-6">1 cm³ 안의 움직이는 음전하 약 10¹⁰개, 양전하처럼 셀 빈자리 약 10¹⁰개</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-bold">조각 B · 원자를 섞은 상태 (가정)</p>
              <p className="mt-2 leading-6">같은 1 cm³에서 움직이는 음전하 약 10¹⁶개, 빈자리 약 10⁴개</p>
            </div>
          </div>
          <p className="leading-7">
            아직 재료의 내부 그림은 접어 둡니다. 지금은 들어간 것이 원자 소량이고
            밖에서 보이는 것이 움직이는 전하의 수라는 것만 봅니다. 다음 절에서
            왜 처음부터 모든 전자가 똑같이 움직일 수 없는지부터 펼치겠습니다.
          </p>
          <p className="leading-7"><em>같은 실리콘에서 원자를 조금 바꿨을 뿐인데 움직이는 전하의 수가 백만 배 달라졌습니다. 이제 그 까닭을 보겠습니다.</em></p>
        </div>
      </section>

      <section id="states" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">움직일 수 있는 에너지 자리가 따로 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            실리콘 원자 하나의 전자만 그리면 왜 고체 전체가 전류를 흘리는지
            보이지 않습니다. 원자가 규칙적으로 많이 모인 결정에서는 전자가
            차지할 수 있는 에너지 자리가 모인 구간이 생깁니다. 그 구간 사이에는
            차지할 수 없는 간격도 있습니다. 아래 구간이 가득 차 있으면 작은
            전기장을 걸어도 그 안에서 옮겨 갈 빈자리가 부족합니다. 위 구간에
            올라온 전자는 움직일 자리가 있고, 아래에 남은 빈자리도 이동에
            참여합니다.
          </p>
          <p className="leading-7">
            가능한 자리의 묶음을 <strong>에너지띠</strong>, 그 사이의 간격을
            <strong>띠틈</strong>이라고 부릅니다. 순수한 실리콘의 띠틈은 300 K
            부근에서 약 1.1 eV라는 기준값으로 흔히 씁니다. 1 eV는 전하량
            1 e가 1 V 차이를 지날 때 주고받는 에너지입니다. 앞의 회로 글에서
            전압을 두 점 사이의 에너지 차이로 읽은 것과 연결됩니다.
          </p>
          <p className="leading-7">
            Wilson은 1931년 원문 460쪽에서 허용되는 에너지 구간과 그 사이의
            허용되지 않는 구간을 나누고, 낮은 구간이 가득 찬 상태에서는 작은
            전기장으로 전류를 만들기 어렵다고 설명합니다. 그가 적은 것은
            가능한 상태의 구조입니다. 이 글의 300 K 실리콘 전하 수는 그
            논문에서 가져온 측정값이 아닙니다.
          </p>
          <p className="leading-7"><em>가능한 에너지 자리와 빈자리를 나누면, 모든 전자가 곧바로 전류를 만드는 것은 아니라는 점이 드러납니다.</em></p>
        </div>
        <CitationBlock
          source="A. H. Wilson, ‘The Theory of Electronic Semi-Conductors,’ Proceedings of the Royal Society A 133 (1931), 458–491, 460쪽"
          citeKey={1}
          href="https://ethw-images.s3.us-east-va.perf.cloud.ovh.us/ieee/b/b4/P3_Proc._R._Soc._Lond._A-1931-Wilson-458-91.pdf"
        >
          원문 460쪽의 그림은 주기적인 결정에서 전자가 차지할 수 있는 에너지가
          띠로 갈리고 띠 사이에 유한한 간격이 있다는 설명입니다. 스캔의 해당
          쪽을 직접 읽었습니다. 현대의 실리콘 1.1 eV와 도핑 예제는 이 원문이
          측정한 결과로 적지 않습니다.
        </CitationBlock>
      </section>

      <section id="intrinsic" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">순수한 실리콘에서도 둘이 함께 생깁니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            온도가 0 K보다 높으면 일부 전자가 결합 상태를 떠나 움직일 수 있는
            상태로 올라갑니다. 전자가 떠난 결합에는 빈자리가 남습니다. 주변
            전자가 그 빈자리를 차례로 메우면 빈자리 자체가 반대쪽으로 움직이는
            것처럼 셀 수 있습니다. 이동하는 전자는 음전하를, 이 빈자리는
            양전하를 옮기는 역할을 합니다.
          </p>
          <p className="leading-7">
            이 빈자리를 <strong>정공</strong>이라 부릅니다. 전자와 정공은
            하나의 결합이 끊어질 때 짝으로 생기고 다시 만나 사라질 수 있습니다.
            외부에서 전하를 넣거나 빛을 비추지 않은 열평형의 순수 실리콘이라면
            두 농도는 같습니다. MIT 6.012 Lecture 2는 300 K 실리콘에서 그
            공통 농도를 약 10¹⁰ cm⁻³로 둡니다. 1 cm³ 안에 약 10¹⁰개라는
            뜻입니다.
          </p>
          <p className="leading-7">
            원자 자체는 약 5×10²²개/cm³라는 같은 강의의 수치와 비교하면,
            움직이는 전하의 수는 훨씬 적습니다. 이 비교는 모든 원자를
            움직이는 전하로 세지 않아야 하는 이유를 보여 줍니다. 온도를
            바꾸면 짝 생성도 달라지므로 10¹⁰이라는 숫자는 항상 고정된
            실리콘의 상수가 아닙니다.
          </p>
          <p className="leading-7"><em>기준 조각 A에서는 전자와 정공이 짝으로 생기므로 각각 약 10¹⁰개로 셉니다.</em></p>
        </div>
        <CitationBlock
          source="MIT OpenCourseWare 6.012, Lecture 2, Semiconductor Physics (2005), 강의안 4·6·9·11쪽"
          citeKey={2}
          href="https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2005/e1a94598c1fd641fc15636a9ad14de1a_lec2.pdf"
        >
          강의안은 실리콘 원자 밀도 5×10²² cm⁻³, 전자·정공의 짝 생성,
          300 K의 고유 전하 농도 약 10¹⁰ cm⁻³를 각각 제시합니다. 자료 자체가
          실리콘 결합 그림은 실제 전자와 정공이 여러 원자 자리에 퍼지는 모습을
          단순화한다고 경고합니다.
        </CitationBlock>
      </section>

      <section id="dopants" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한쪽 수를 늘려도 전하 장부는 맞습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이제 둘째 조각 B를 만듭니다. 실리콘 자리 일부에 인처럼 바깥 전자가
            하나 더 있는 원자를 넣습니다. 이 원자의 네 전자는 주변 실리콘과
            결합하고 남은 하나는 움직이는 상태로 풀리기 쉽습니다. 이렇게
            전자를 내놓는 원자를 <strong>도너</strong>라고 부릅니다. 반대로
            붕소처럼 바깥 전자가 하나 적은 원자는 결합의 빈자리를 만들기
            쉬워 <strong>억셉터</strong>라고 부릅니다.
          </p>
          <p className="leading-7">
            여기서는 1 cm³에 도너 10¹⁶개를 넣고 거의 모두 이온화한다고
            가정합니다. 그러면 움직이는 전자도 약 10¹⁶개가 됩니다. 전자가
            풀려나간 자리에는 움직이지 않는 양전하 도너 이온이 약 10¹⁶개
            남습니다. 둘을 함께 세면 멀리 떨어진 균일한 재료의 순전하는 거의
            0입니다. 전자를 백만 배로 늘린다고 재료 전체에 거대한 음전하를
            새로 만든 셈은 아닙니다.
          </p>
          <p className="leading-7">
            Shockley의 1949년 원문 435쪽 서론은 도너 농도와 억셉터 농도로
            실리콘·게르마늄의 n형과 p형을 구분하며, 한 결정 안에서 한쪽에서
            다른 쪽으로 바뀌면 접합이 된다고 시작합니다. 이 글의 10¹⁶개
            설정은 그 논문의 측정 수치가 아닙니다.
          </p>
          <p className="leading-7"><em>도너가 전자를 내놓아도 그 자리에 양전하 이온이 남아 벌크의 전하 장부가 맞습니다.</em></p>
        </div>
        <CitationBlock
          source="W. Shockley, ‘The Theory of p-n Junctions in Semiconductors and p-n Junction Transistors,’ Bell System Technical Journal 28 (1949), 435–489, 435쪽"
          citeKey={3}
          href="https://vtda.org/pubs/BSTJ/vol28-1949/articles/bstj28-3-435.pdf"
        >
          원문 435쪽 서론의 도너 N<sub>d</sub>와 억셉터 N<sub>a</sub>의 비교,
          그리고 p형·n형 경계의 설명을 스캔에서 확인했습니다. 아래의 300 K
          실리콘 계산은 MIT 강의 자료의 기준값에 이 글의 도핑 가정을 대입한
          교육용 예입니다.
        </CitationBlock>
      </section>

      <section id="count" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1 cm³의 양쪽 수를 끝까지 셉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            조각 B의 전자가 10¹⁶개인 것은 알았습니다. 그렇다면 정공은 순수한
            조각 A처럼 10¹⁰개로 남을까요? 열평형에서 같은 재료·온도라면 전자
            농도와 정공 농도의 곱은 순수 상태의 공통 농도를 제곱한 값입니다.
            짝을 만들고 다시 합치는 과정이 평형을 이루는 조건입니다.
          </p>
        </div>
        <ExplainedFormula
          question="전자 수가 늘어난 조각의 정공 수는 얼마입니까?"
          idea="같은 300 K 실리콘의 열평형에서는 양쪽 농도의 곱을 순수 상태의 농도 제곱과 맞춥니다."
          formula={String.raw`np=n_i^2,\qquad p=\frac{(10^{10})^2}{10^{16}}=10^4\;\mathrm{cm}^{-3}`}
          annotatedFormula={String.raw`\underbrace{np}_{\text{도핑한 조각}}=\underbrace{n_i^2}_{\text{순수한 조각}},\qquad p=\frac{(10^{10})^2}{10^{16}}=10^4\;\mathrm{cm}^{-3}`}
          operations={[{ expression: String.raw`\frac{n_i^2}{n}`, annotation: "순수 상태의 농도 곱을 늘어난 전자 농도로 나누어 남은 정공 농도를 구합니다." }]}
          terms={[
            { symbol: "n", name: "전자 농도", description: "조각 B에서 약 10¹⁶ cm⁻³입니다(가정)." },
            { symbol: "p", name: "정공 농도", description: "같은 부피에서 구할 소수 쪽의 농도입니다." },
            { symbol: "n_i", name: "순수 상태의 농도", description: "MIT 6.012의 300 K 실리콘 기준값 약 10¹⁰ cm⁻³입니다." },
          ]}
          assumptions={["같은 실리콘과 300 K를 비교합니다.", "빛이나 외부 주입이 없는 열평형과 비축퇴 근사를 둡니다.", "도너가 거의 전부 이온화하고 보상 도핑이 없다고 둡니다."]}
          interpretation="조각 B에는 전자가 약 10¹⁶ cm⁻³, 정공이 약 10⁴ cm⁻³입니다. 전자가 10¹²배 많습니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            전자가 많은 쪽을 <strong>다수 캐리어</strong>, 정공이 적은 쪽을
            <strong>소수 캐리어</strong>라고 부릅니다. 억셉터 10¹⁶ cm⁻³를
            넣은 조각에서는 역할이 뒤집혀 정공 약 10¹⁶개, 전자 약 10⁴개가
            됩니다(가정). 적은 쪽도 사라진 것이 아니므로 다음 접합 글에서
            그 이동을 다시 세어야 합니다.
          </p>
          <p className="leading-7">
            도너와 억셉터를 함께 넣으면 개수를 그대로 더하지 않습니다.
            예를 들어 1 cm³에 도너 10¹⁶개와 억셉터 2×10¹⁵개가 모두
            이온화한다면 순도너는 8×10¹⁵개입니다(가정). 전자는 약
            8×10¹⁵ cm⁻³, 정공은 10²⁰을 그 수로 나눈 약 1.25×10⁴ cm⁻³입니다.
            원자가 실제로 얼마나 이온화했는지도 확인해야 합니다.
          </p>
          <p className="leading-7"><em>조각 B의 10¹⁶과 10⁴는 따로 외운 수가 아닙니다. 두 수의 곱이 같은 온도의 평형값 10²⁰이 됩니다.</em></p>
        </div>
        <CarrierCountViz />
      </section>

      <section id="boundaries" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">전하 수만 알면 전류를 다 아는 것은 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            조각 B의 움직이는 전자가 백만 배라는 계산을 전도도도 정확히 백만
            배라는 말로 옮길 수 있을까요? 전류는 움직일 수 있는 수와, 같은
            전기장에서 각각 얼마나 잘 이동하는지가 함께 정합니다. 후자를
            <strong>이동도</strong>라고 부릅니다. 불순물을 넣으면 전하 수가
            늘지만 산란도 늘어 이동도가 달라질 수 있습니다.
          </p>
        </div>
        <ExplainedFormula
          question="농도만으로 전도도를 결정할 수 있습니까?"
          idea="전자와 정공의 수에 각자의 이동도를 곱해 전류 기여를 합칩니다."
          formula={String.raw`\sigma=q(n\mu_n+p\mu_p)`}
          annotatedFormula={String.raw`\sigma=q\left(\underbrace{n\mu_n}_{\text{전자 기여}}+\underbrace{p\mu_p}_{\text{정공 기여}}\right)`}
          operations={[{ expression: String.raw`n\mu_n+p\mu_p`, annotation: "전자와 정공의 수에 각자의 이동 능력을 곱해 더합니다." }]}
          terms={[
            { symbol: String.raw`\sigma`, name: "전도도", description: "전기장에 대한 전류 밀도의 비. 단위는 S/m입니다." },
            { symbol: "q", name: "전하 크기", description: "전자 전하의 크기 약 1.6×10⁻¹⁹ C입니다." },
            { symbol: String.raw`\mu_n,\mu_p`, name: "이동도", description: "전기장에 대한 전자와 정공의 속도 반응. 단위는 m²/(V·s)입니다." },
          ]}
          assumptions={["낮은 전기장에서 선형 응답을 봅니다.", "같은 온도와 같은 재료의 벌크 영역을 비교합니다.", "S/m를 얻으려면 cm⁻³로 적은 n과 p를 m⁻³로 변환합니다."]}
          interpretation="전자 농도가 같아도 이동도가 절반이면 전자 쪽 전도도 기여도 절반이 됩니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            온도를 바꾸면 순수 농도 10¹⁰ cm⁻³부터 달라집니다. 아주 낮은
            온도에는 넣은 원자가 전자를 충분히 풀어 놓지 못할 수 있습니다.
            높은 도핑에는 단순한 열평형 근사와 이동도 모델을 다시 살펴야
            합니다. 빛을 비추거나 큰 전류를 주입하면 전자와 정공의 농도 곱을
            앞의 평형값으로 고정해서도 안 됩니다.
          </p>
          <p className="leading-7">
            관측으로 확인할 때는 온도, 넣은 원자의 수, 실제 이동 전하 농도,
            전도도를 따로 잽니다. 농도가 예상과 다르면 이온화와 보상 도핑을,
            농도는 맞는데 전도도가 다르면 이동도와 산란을 먼저 봅니다.
          </p>
          <p className="leading-7"><em>농도 계산을 마쳤어도 전류를 알려면 전하가 얼마나 잘 움직이는지와 온도를 더 확인해야 합니다.</em></p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">두 영역을 붙이면 경계에서 무슨 일이 생길까요</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            도너를 넣은 영역에는 움직이는 전자가 많고, 억셉터를 넣은 영역에는
            정공이 많습니다. 다음에는 이 두 영역을 한 결정 안에서 맞닿게 해
            보겠습니다. 경계로 퍼져 간 전하와 뒤에 남은 고정 이온이
            <Link to="/electronics/circuits/lumped-circuit-and-conservation#small-circuit"> 전압과 전류</Link>를
            어떻게 바꾸는지가 소자 글의 출발점입니다.
          </p>
          <ol className="space-y-2 leading-7">
            <li>순수 상태에서 전자 하나가 움직이는 상태로 올라갈 때 함께 생기는 것은 무엇일까요? (답: 순수 상태 절)</li>
            <li>도너 10¹⁶ cm⁻³를 넣은 조각에 정공이 약 10⁴ cm⁻³인 이유는 무엇일까요? (답: 1 cm³ 세기 절)</li>
            <li>전자 수가 같아도 두 조각의 전도도가 다를 수 있는 이유는 무엇일까요? (답: 적용 범위 절)</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
