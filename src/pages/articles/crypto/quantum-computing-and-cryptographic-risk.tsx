import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";
import { Link } from "react-router-dom";

export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1 · 계산 방법이 바뀌면 어떤 보안 가정이 흔들릴까요</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">인터넷의 비밀과 서명은 남이 풀기 어려운 계산을 이용합니다. 계산 장치가 다른 규칙으로 움직이면 어려움의 크기도 바뀔 수 있습니다. 어떤 문제를 얼마나 빨리 푸는지 알아야 교체할 암호와 남길 암호를 판단할 수 있습니다.</p>
          <p className="leading-8">네 후보 중 하나를 찾는 작은 계산부터 시작합니다. 이어 15를 두 수의 곱으로 나누는 규칙을 보고 그 원리가 실제 공개키 암호의 어느 가정에 닿는지 연결합니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">먼저 장치 안을 감추고 입력과 관측 결과만 봅니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2 · 회로가 만든 상태를 측정하면 결과 하나가 나옵니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">입력은 준비한 상태와 그것을 바꾸는 연산 순서입니다. 출력은 마지막에 측정한 비트열입니다. 계산 중의 모든 후보를 한꺼번에 읽어 낼 수는 없습니다.</p>
          <p className="leading-8">
            같은 준비와 연산을 여러 번 반복하면 결과별 빈도를 얻습니다. 중간 상태를 설계해 원하는 결과가 자주 나오게 합니다.
          </p>
        </div>

        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">빈도를 만드는 중간 숫자를 네 후보로 줄여 살핍니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3 · 네 칸을 처음에는 똑같이 준비합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">00·01·10·11 네 후보 중 00이 정답이라고 놓습니다(가정). 각 후보에 0.5라는 중간값을 부여합니다. 이 값을 제곱한 0.25가 측정 확률이고 네 확률의 합은 1입니다.</p>
          <p className="leading-8">400회 반복하면 각 후보의 기대 횟수는 100회입니다. 기대 횟수는 실제 빈도를 정확히 보장하는 숫자가 아닙니다. 정답을 많이 얻으려면 이 네 중간값을 바꿔야 합니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">원하는 칸을 표시하는 일과 그 칸의 확률을 키우는 일을 나눕니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4 · 표시할 때는 부호만 바꾸고 다음 연산에서 차이를 키웁니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">첫 칸의 값만 −0.5로 바꿉니다. 나머지는 그대로 0.5입니다. 아직 네 값의 제곱은 모두 0.25이므로 측정 결과의 분포는 바뀌지 않았습니다.</p>
          <p className="leading-8">그다음 전체 평균을 기준으로 각 값을 반대편으로 옮깁니다. 이때 첫 칸과 다른 칸이 다르게 움직입니다. 부호 차이는 다음 연산에서 더하고 빼는 데 쓰입니다.</p>
        </div>
        <NumericPath title="같은 네 칸의 상태 변화" steps={[{"label": "준비", "value": "0.5씩 네 개", "detail": "확률은 0.25씩"}, {"label": "표시", "value": "첫 값만 −0.5", "detail": "측정 확률은 아직 같음"}, {"label": "평균에 반사", "value": "1·0·0·0", "detail": "첫 후보를 확률 1로 측정"}]} />

        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">부호를 곧바로 확률로 읽으면 이 작동 원리를 놓칩니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5 · 후보를 확인하는 계산도 비용에 포함해야 합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            후보가 조건을 만족하는지 계산한 뒤 정답으로 표시해야 합니다. 그 계산을 중간 상태를 함부로 측정하지 않는 형태로 만들어야 합니다. 정답을 공짜로 알려 주는 기계가 생기는 것은
            아닙니다.
          </p>
          <p className="leading-8">네 후보 사례에서는 한 번의 표시와 반사로 충분합니다. 큰 검색에서는 필요한 반복 수가 달라지고 상태 준비·판정·오류 수정의 비용도 듭니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">중간값과 연산의 이름을 붙이면 원 논문을 읽을 수 있습니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6 · 진폭은 확률이 아니며 상대 위상이 계산에 쓰입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">중간값을 진폭이라고 합니다. 일반적으로 복소수이고 측정 확률은 절댓값의 제곱입니다. 전체 확률이 1이 되도록 정규화합니다. 이번 예제는 이해를 위해 실수 진폭만 사용합니다.</p>
          <p className="leading-8">두 결과를 갖는 기본 상태 단위는 큐비트입니다. 두 큐비트의 공동 상태를 00·01·10·11 순서로 나타냈습니다. 여러 결과의 진폭을 함께 갖는 상태를 중첩, 진폭이 더해지거나 상쇄되는 효과를 간섭이라고 합니다.</p>
          <p className="leading-8">상태를 바꾸는 이상적 게이트는 전체 확률을 보존합니다. 여기서 다루는 순수 상태에서 얽힘은 여러 큐비트의 공동 상태를 각자의 상태 곱으로 나눌 수 없는 경우입니다. 그것만으로 메시지가 빛보다 빠르게 전달되지는 않습니다.</p>
          <p className="leading-8">실제 관측에서는 측정 기저와 반복 횟수를 함께 남깁니다. 다른 방향으로 측정하거나 결맞음이 사라진 장치에서는 여기서 계산한 확률과 다른 분포가 나올 수 있습니다.</p>
        </div>
<p className="mt-4 text-sm leading-7">수학을 더 확인하려면 <Link className="underline" to="/cs/ai/math-complex-numbers-oscillations#complex-plane">복소수</Link>와 <Link className="underline" to="/cs/ai/math-vectors-inner-products#norm">벡터의 길이</Link>를 이어 읽으세요.</p>
        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">이제 진폭을 실제로 한 단계씩 계산합니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7 · 한 번의 증폭을 네 숫자로 끝까지 계산합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">표시 직후 진폭은 [−0.5, 0.5, 0.5, 0.5]이고 평균은 0.25입니다. 평균의 두 배에서 각 값을 빼면 첫 칸은 0.5−(−0.5)=1, 나머지는 0.5−0.5=0입니다. 측정하면 00을 얻습니다.</p>
          <p className="leading-8">이 표시와 반사의 반복이 Grover 검색의 핵심입니다. 일반적인 비구조적 검색에서 필요한 판정 질의 수가 후보 수의 제곱근 규모로 줄어듭니다. 한 질의의 실제 회로 시간과 전체 경과 시간은 따로 계산해야 합니다.</p>
          <p className="leading-8">많이 반복할수록 항상 좋은 것은 아닙니다. 이 사례에서 두 번째 반복을 하면 [−1,0,0,0]의 평균 −0.25를 거쳐 [0.5,−0.5,−0.5,−0.5]가 됩니다. 정답 확률이 다시 0.25로 떨어집니다.</p>
        </div>

        <AlgorithmBlock title="네 후보의 Grover 반복 (의사코드)" input={["진폭 a=[0.5,0.5,0.5,0.5], 정답 판정 함수 f, 반복 횟수1"]} steps={[{"code": "각 x: f(x)=1이면 a[x] ← −a[x]", "note": "여기서는 f(00)=1로 둔 교육용 사례입니다. 판정 회로 비용을 생략한 모델입니다."}, {"code": "평균 μ ← 네 진폭의 합 / 4", "note": "부호 반전 뒤 μ=0.25입니다."}, {"code": "각 x: a[x] ← 2μ − a[x]", "note": "[1,0,0,0]이 됩니다. 실제 장치에서 진폭 목록을 읽어 평균을 계산하는 프로그램이 아니라 같은 선형 변환을 나타낸 의사코드입니다."}, {"code": "계산 기저로 측정", "note": "한 결과만 얻습니다. 이 이상적 사례의 결과는00입니다."}]} output="측정한 후보 하나, 반복 실험에서는 후보별 빈도" />
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">검색의 제곱근 개선과, 구조를 이용해 인수를 찾는 개선을 구별합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8 · 원 논문의 연산과 15의 반복 길이를 연결합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">인수분해의 작은 사례로 15와 밑 2를 고릅니다(가정). 2의 거듭제곱을 15로 나눈 나머지는 1·2·4·8·1입니다. 네 번 뒤 처음으로 돌아오므로 주기는 4입니다.</p>
          <p className="leading-8">주기의 절반인 2를 지수로 쓰면 4를 얻습니다. 4−1과 15의 최대공약수는 3이고 4+1과 15의 최대공약수는 5입니다. 3×5=15로 검산합니다. 이 부분은 일반 컴퓨터에서 하는 후처리입니다.</p>
          <p className="leading-8">Shor 알고리즘은 큰 수에서도 이 주기 정보를 얻는 양자 절차를 구성합니다. 주기를 상태의 위상에 기록하고 푸리에 변환과 측정으로 주기에 관한 값을 얻은 뒤 고전적으로 복원합니다. 나머지 반복을 이 예제처럼 하나씩 손으로 나열하는 방법과 비용 구조가 다릅니다.</p>
          <p className="leading-8">항상 한 번에 성공하지는 않습니다. 고른 밑이 서로소인지, 찾은 주기가 짝수인지, 마지막 최대공약수가 자명한 1이나 15인지 확인합니다. 큰 수의 회로와 오류 정정 비용까지 여기서 직접 실행한 것은 아닙니다.</p>
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">양자 부분도 같은 15와 밑 2로 좁혀 봅니다. 첫 기록 공간을 0부터255까지 똑같이 준비하고 각 지수 a에 대해 2ᵃ mod15를 둘째 공간에 기록합니다(가정). 256은 15² 이상·2×15² 미만인 2의 거듭제곱입니다. 설명을 위해 둘째 공간을 측정해1이 나온 가지를 고르면 첫 공간에는 0·4·8·…·252의64개 지수가 남습니다.</p>
          <p className="leading-8">양자 푸리에 변환은 이렇게 일정 간격으로 떨어진 진폭들을 위상이 다른 파동 성분으로 바꿉니다. 이 이상적 사례의 첫 공간을 측정하면 0·64·128·192 중 하나가 나옵니다. 64를 얻었다면 64/256=1/4에서 분모4를 주기 후보로 읽고 2⁴ mod15=1로 검산합니다. 그 뒤 앞의 최대공약수 계산을 적용합니다.</p>
          <p className="leading-8">128을 얻으면 128/256=1/2의 분모2가 후보입니다. 하지만 2² mod15=4라서 주기 검산에 실패합니다. 상태를 새로 준비해 회로를 다시 실행하거나 추가 후보를 검사해야 합니다. 큰 수에서는 측정 비율이 정확한 분수가 아닐 수 있어 연분수로 후보를 찾고 검산합니다. 중간 측정으로1인 가지만 남기는 설명은 원리 확인용이며, 그 가지를 무료로 선택할 수 있다는 주장이 아닙니다.</p>
        </div>
        <SourceApplication source="Grover · A fast quantum mechanical algorithm for database search" excerpt="inversion about average" application="평균 0.25의 두 배 0.5에서 각 진폭을 빼는 변환에 대응합니다. 음수 진폭을 확률처럼 버리면 이 계산이 사라집니다." />
        <CitationBlock source="Grover · A fast quantum mechanical algorithm for database search" citeKey={1} href="https://arxiv.org/abs/quant-ph/9605043">1996 원 논문. 검색 판정에 대한 질의 모형의 개선을 읽으며 아래 네 후보는 교육용 계산입니다.</CitationBlock>
        <SourceApplication source="Shor · Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms" excerpt="prime factorization and discrete logarithms" application="15의 반복 길이 4를 인수 3·5로 바꾸는 후처리와, 실제 큰 군에서 주기를 알아내는 양자 부분을 구분합니다." />
        <CitationBlock source="Shor · Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms" citeKey={2} href="https://arxiv.org/abs/quant-ph/9508027">1995 arXiv 원 논문. 인수분해·이산로그 알고리즘의 계산 모형과 후처리 범위를 확인합니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">수학적 절차가 있어도 실제 장치의 규모와 시간은 별도의 계산입니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9 · 2026년 논문은 회로 자원과 장치 가정을 함께 읽습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">2026년 Babbush 등의 연구는 secp256k1의 256비트 이산로그에 대해 논리 큐비트 1,200개 미만·Toffoli 게이트 9천만 개 미만인 구성과, 1,450개 미만·7천만 개 미만인 구성을 제시합니다. 공간과 연산 수를 맞바꾸는 두 선택지입니다.</p>
          <p className="leading-8">물리 오류율 10⁻³, 평면 연결 등의 초전도 장치 가정에서 50만 개 미만의 물리 큐비트와 분 단위 시간을 추정합니다. 이는 그런 장치를 실제로 만들고 암호를 해독했다는 보고가 아닙니다. 숨긴 회로에 관한 검증 자료와, 하드웨어가 가정대로 동작한다는 증거도 구분해야 합니다.</p>
          <p className="leading-8">논리 큐비트는 알고리즘이 다루는 계산 단위이며 실제 장치에서는 오류 정정으로 논리 오류율을 충분히 낮추어 구현합니다. 실제 잡음 있는 물리 큐비트 여러 개와 반복 검사를 이용해 그 동작을 지탱합니다. 필요한 배수는 오류율·정정 코드·연결·요구 정확도에 따라 달라집니다.</p>
          <p className="leading-8">서로 다른 논문에서 가장 작은 큐비트 수와 가장 짧은 시간만 골라 합칠 수는 없습니다. 소자 종류와 게이트 속도, 정정 일정이 다르면 존재하지 않는 기계의 사양이 됩니다.</p>
        </div>

        <SourceApplication source="Babbush 외 · §II.2와 초록의 물리 자원 조건" excerpt="fewer than half a million physical qubits" application="원문의 50만 개 미만은 물리 큐비트 수입니다. 앞의 논리 큐비트 1,200개와 같은 단위가 아닙니다. 지정 오류율·연결·정정 조건으로 대응시킨 추정이며, 네 후보 계산을 실제 칩에서 50만 번 실행한 수치도 아닙니다." />
        <CitationBlock source="Babbush 외 · 2026 ECDLP 자원 추정" citeKey={3} href="https://arxiv.org/abs/2603.28846v2">2026-04-15 수정된 v2를 2026-10-04 확인했습니다. §II.2의 논리·물리 자원 가정을 대조합니다. 저자는 v2에서 검증 자료의 영지식 증명 건전성을 해칠 수 있던 소프트웨어 오류를 수정했다고 명시합니다. 이 수정 여부와 실제 양자 하드웨어의 실현 여부는 별개입니다.</CitationBlock>
        <CitationBlock source="IBM Quantum Learning · Grover introduction" citeKey={4} href="https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/grover-algorithm/introduction">공식 강의의 제곱근 질의 개선과 실제 장치 비용 구별. 본문을 읽었으며 연결된 동영상 전체 시청을 주장하지 않습니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">이 구분을 실제로 교체할 암호의 목록에 적용합니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10 · 키 교환·서명·해시·광학 통신은 바꿔야 할 이유가 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">RSA의 인수분해 가정과 Diffie–Hellman·타원곡선 계열의 이산로그 가정은 Shor의 영향을 받습니다. ECDSA·BLS 서명과 이산로그 기반 증명·커밋도 각각 검토해야 합니다. 초기 설정에서 비밀을 삭제했더라도 공개 군 원소의 이산로그를 계산하는 능력이 생기는 문제는 남습니다.</p>
          <p className="leading-8">Grover의 검색 개선을 모든 암호의 보안 수치가 똑같이 절반이 된다는 규칙으로 쓰면 안 됩니다. 해시의 원상 찾기와 충돌 찾기는 다른 문제이고 병렬화·메모리·회로 비용도 다릅니다.</p>
          <p className="leading-8">장기간 비밀이어야 하는 통신은 지금 기록한 암호문을 미래에 푸는 상황을 고려합니다. 서명에서는 공개키 노출과 새로운 승인 위조가 문제입니다. 키만 바꾸고 인증서·펌웨어·복구·백업 경로에 예전 서명이 남아 있으면 전환이 끝난 것이 아닙니다.</p>
          <p className="leading-8">양자내성암호인 PQC는 일반 컴퓨터에서 계산합니다. 양자키분배인 QKD는 물리 신호로 공유 비밀을 만드는 별도 체계입니다. 아래 글에서 각각의 방정식·서명·통신 경로를 이어갑니다.</p>
        </div>
<p className="mt-4 leading-8"><Link className="underline" to="/cs/crypto/ml-kem-and-noisy-equations">오류를 섞은 키 합의</Link> · <Link className="underline" to="/cs/crypto/post-quantum-signatures">양자내성 서명</Link> · <Link className="underline" to="/cs/crypto/quantum-key-distribution">양자키분배</Link></p>
        <CitationBlock source="NIST · Post-Quantum Cryptography" citeKey={5} href="https://csrc.nist.gov/Projects/Post-Quantum-Cryptography">2026-10-04 확인. 표준화 상태는 최종 FIPS와 후보 선정·표준 작성 중인 상태를 나눠 읽습니다.</CitationBlock>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">다음 질문에서 계산상의 개선과 실제 보안 주장을 따로 판정해 보세요.</p>
        <ReviewPrompts questions={["진폭의 부호만 바꾸면 측정 확률이 왜 그대로일까요? (답: 4절)", "두 번째 증폭에서는 정답 확률이 어떻게 바뀔까요? (답: 7절)", "논리 큐비트 수가 같으면 실제 해독 시간도 같을까요? (답: 9절)"]} />
      </section>
    </div>
  );
}
