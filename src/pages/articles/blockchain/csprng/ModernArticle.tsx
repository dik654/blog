import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ContentBoundary from "@/components/articles/content-boundary";
import FlowRail from "../../world-systems/FlowRail";
import ReviewPrompts from "../../world-systems/ReviewPrompts";

export default function ModernCSPRNG(){return <article className="space-y-14">
 <section id="overview" data-teach-level="S" className="space-y-5"><h2 className="text-2xl font-bold">1. 길고 복잡한 문자열도 시작값을 알면 예측할 수 있습니다</h2>
  <p>서버가 비밀번호를 바꾸는 데 쓸 비밀 표를 만들려고 합니다. 문자열이 길고 숫자가 고르게 섞여 보여도 다른 사람이 다음 표를 계산할 수 있으면 계정을 보호하지 못합니다. 필요한 것은 모양이 아니라 공격자가 모르는 비밀입니다.</p>
  <p>암호용 난수 생성기는 처음 받은 예측하기 어려운 재료를 비밀 상태에 담고 긴 출력을 만듭니다. 이 글은 시작값 후보가 여덟 개뿐인 잘못된 서버를 따라가며 출력 길이·입력의 불확실성·상태 유출을 구분합니다.</p><ContentBoundary article="csprng" />
 </section>
 <section id="black-box" data-teach-level="B" className="space-y-5"><h2 className="text-2xl font-bold">2. 비밀 재료를 얻는 곳과 출력을 만드는 곳을 나눕니다</h2>
  <p>운영체제는 공격자가 쉽게 알 수 없는 사건에서 재료를 모읍니다. 생성기는 이를 받아 비밀 상태를 만들고 애플리케이션이 요청한 길이의 바이트를 돌려줍니다. 다음 요청에는 갱신한 상태를 사용합니다.</p>
  <p>애플리케이션은 반환된 바이트를 키나 토큰으로 사용합니다. 출력 뒤에도 생성기 안에 비밀 상태가 남습니다. 이 상태를 복사하거나 읽을 수 있는 사람은 일반적인 출력 관찰자보다 훨씬 많은 것을 알게 됩니다.</p>
 </section>
 <section id="case" data-teach-level="0" className="space-y-5"><h2 className="text-2xl font-bold">3. 시작값이 0부터 7까지면 긴 결과도 여덟 후보입니다</h2>
  <p>
            잘못 만든 서버가 0·1·2·3·4·5·6·7 중 하나를 같은 확률로 고르고 그 값을 한 바이트로 넣어 매번 32바이트를 출력한다고 합시다(가정). 실제로 고른 값은 3입니다.
            출력은 256비트지만 가능한 첫 출력은 많아야 여덟 개입니다.
          </p>
  <p>공격자가 시작 규칙과 생성 알고리즘을 알면 여덟 값을 모두 넣어 결과를 만들어 볼 수 있습니다. 관찰한 첫 출력과 맞는 후보를 찾으면 다음 출력도 같은 순서로 계산합니다. 파일에 32바이트가 들어 있다는 사실은 처음 모르는 값이 256비트였다는 뜻이 아닙니다.</p>
  <p>아래 실험에서 시작값 3의 첫 출력은 <code className="break-all">323e5e202f68ea77d88dbbd02dd0787f241a79d81ec20ae51d31d908385fafe5</code>입니다. 두 번째는 <code className="break-all">dbf1992042283c482ab1b9a0675176aef8a4baae702a0dc1e938110f0dbfea03</code>입니다. 둘 다 복잡해 보이지만 후보 여덟 개를 실행하면 찾을 수 있습니다.</p>
 </section>
 <section id="picture" data-teach-level="1" className="space-y-5"><h2 className="text-2xl font-bold">4. 출력은 늘어나도 새 비밀이 저절로 생기지는 않습니다</h2>
  <FlowRail title="같은 시작값 3의 두 출력" steps={[{actor:"시작 재료",movement:"후보 여덟 개 중 3을 고릅니다. 공격자도 후보 범위를 압니다.",receives:"모르는 선택 한 개"},{actor:"비밀 상태",movement:"정해진 계산으로 내부 값을 만들고 출력 뒤 갱신합니다.",receives:"3에서 결정되는 상태의 순서"},{actor:"출력 요청",movement:"첫 32바이트를 반환한 뒤 다음 32바이트를 계산합니다.",receives:"323e…와 dbf1…로 시작하는 값"}]} />
  <p>오른쪽 출력이 길어져도 왼쪽에 없던 비밀이 생기지는 않습니다. 반대로 충분히 좋은 비밀 입력을 가진 생성기는 공격자의 제한된 계산 능력으로 다음 결과를 찾기 어렵게 만드는 것을 목표로 합니다.</p>
 </section>
 <section id="need" data-teach-level="2" className="space-y-5"><h2 className="text-2xl font-bold">5. 다음 값 예측과 상태 복제는 서로 다른 실패입니다</h2>
  <p>처음 후보가 적으면 전체 시작값을 시험할 수 있습니다. 처음 재료가 좋아도 현재 상태를 훔치면 이후 계산을 따라갈 수 있습니다. 서버 두 개를 같은 상태로 복제하면 서로 다른 사용자에게 같은 비밀 표를 줄 수도 있습니다.</p>
  <p>그래서 충분한 비밀 재료, 상태 보호, 출력 뒤 갱신, 복제·재시작 처리, 새 재료를 받는 절차가 함께 필요합니다. 통계 검사에서 0과 1의 비율이 비슷하게 나왔다는 결과만으로 이 실패들을 배제할 수는 없습니다.</p>
 </section>
 <section id="names" data-teach-level="3" className="space-y-5"><h2 className="text-2xl font-bold">6. 비밀의 불확실성과 출력 생성에 이름을 붙입니다</h2>
  <p>처음 넣는 재료는 seed, 내부에 보관하는 값은 state입니다. 공격자가 모르는 불확실성을 엔트로피라고 부릅니다. 물리적인 잡음 등에서 그 불확실성을 공급하는 부분은 entropy source입니다. 입력을 다루기 좋은 형태로 정리하는 과정은 conditioning입니다.</p>
  <p>정해진 규칙으로 상태와 출력을 만드는 부분을 DRBG라고 부릅니다. 암호에 쓸 수 있는 의사난수 생성기를 넓게 CSPRNG라고 하며 그 목적은 예측을 계산상 어렵게 하는 것입니다. 긴 출력이 매 비트마다 새로운 물리적 사건에서 나왔다는 뜻은 아닙니다.</p>
  <p>초기 상태를 만드는 단계는 instantiate, 출력 요청은 generate, 새 비밀 재료를 받아 상태를 다시 섞는 단계는 reseed입니다. NIST SP 800-90A는 생성 알고리즘, 90B는 재료의 품질과 고장 검사를 다룹니다. 애플리케이션은 이를 직접 조립하기보다 운영체제의 안전한 난수 API를 사용하고 실패를 처리해야 합니다.</p>
 </section>
 <section id="entropy-source" data-teach-level="4" className="space-y-5"><h2 className="text-2xl font-bold">7. 가장 잘 맞힐 수 있는 한 번의 추측을 셉니다</h2>
  <p>여덟 시작값이 같은 확률이면 가장 유리한 한 번의 추측도 성공률은 1/8입니다. 공정한 비트 세 개의 경우의 수가 2³=8이므로 이 불확실성을 3비트로 표현할 수 있습니다. 어떤 값이 절반 확률로 나오면 그 값을 먼저 추측할 성공률은 1/2로 높아집니다.</p>
  <ExplainedFormula question="가장 흔한 값의 확률을 몇 비트로 표현하나요?" idea="가장 쉬운 한 번의 추측이 공정한 몇 비트를 맞히는 것과 같은 확률인지 계산합니다." formula={String.raw`p_{max}=\max_x\Pr[X=x],\qquad H_\infty(X)=-\log_2 p_{max}`} annotatedFormula={String.raw`\begin{aligned}p_{max}&=\underbrace{\max_x\Pr[X=x]}_{\text{최대 추측 확률}}\\H_\infty(X)&=-\log_2 p_{max}\end{aligned}`} operations={[{expression:String.raw`p_{max}=1/8`,annotation:["같은 확률의 여덟 후보에서는","어느 것을 먼저 골라도 1/8입니다."]},{expression:String.raw`-\log_2(1/8)=3`,annotation:["1/8=2⁻³이므로 3비트입니다.","32바이트 출력 길이와 다른 양입니다."]}]} terms={[{symbol:"X",name:"비밀 입력",description:"공격자가 아는 환경 정보를 반영한 시작값 분포입니다."},{symbol:"p_{max}",name:"최대 확률",description:"가장 먼저 추측할 값이 맞을 확률입니다."},{symbol:String.raw`H_\infty`,name:"최소 엔트로피",description:"가장 쉬운 단일 추측의 성공률을 비트로 표현한 값입니다."}]} assumptions={["이 절의 0~7 사례는 정확히 여덟 후보가 같은 확률이라는 가정입니다.","공격자가 추가로 아는 정보와 표본 사이의 의존성을 함께 고려합니다."]} interpretation="pmax=1/8만 안다고 전체 후보가 반드시 여덟 개라고 결론내릴 수는 없습니다. 하나의 확률이 1/8이고 나머지 확률이 아주 많은 값에 퍼진 분포도 가능합니다." />
  <p>따라서 최소 엔트로피를 모든 분포의 평균 탐색 횟수나 전체 후보 수와 동일시하지 않습니다. 본문의 여덟 후보 열거는 후보 집합까지 지정했기에 가능합니다. 가능한 값이 정확히 256개인 균등한 8비트 seed라면 같은 논리로 256번 안에 모두 시험할 수 있습니다. 256비트 출력이라고 2²⁵⁶개 입력이 생기지는 않습니다.</p>
  <p>입력 하나를 복사해 1,024개 표본으로 만들면 표본 수만 커집니다. 서로 독립인지 확인하지 않은 표본의 비트 수를 더해서는 안 됩니다. 해시로 정리해도 새 불확실성을 만들 수 없습니다. 잡음이 멈추거나 한 값으로 쏠리는 고장을 찾는 반복 횟수·비율 검사는 필요하지만 모든 공격자에 대한 예측 불가능성을 증명하지는 않습니다.</p>
  <div id="paper-nist-entropy-source"><CitationBlock source="NIST SP 800-90B · Entropy Sources" citeKey={1} href="https://csrc.nist.gov/pubs/sp/800/90/b/final">원천 모델·최소 엔트로피 추정·conditioning·지속적인 고장 검사의 범위를 확인했습니다. 실제 환경과 재시작 조건의 평가를 표본 수나 출력 길이로 대체하지 않습니다.</CitationBlock></div>
 </section>
 <section id="predictability" data-teach-level="4" className="space-y-5"><h2 className="text-2xl font-bold">8. 다음 비트를 60% 맞히면 절반보다 10%p 유리합니다</h2>
  <p>공격자가 앞에서 나온 비트들과 공개 정보를 보고 다음 비트를 맞힌다고 합시다. 독립적인 공정 비트라면 기준 성공률은 1/2입니다. 반복 가능한 공격에서 성공 확률이 0.60이라면 그 기준과의 차이는 0.10입니다(가정). 짧은 시험에서 우연히 열 번 중 여섯 번 맞힌 관찰과는 구별해야 합니다.</p>
  <ExplainedFormula question="공격자의 다음 비트 예측 능력을 무엇과 비교하나요?" idea="허용된 시간과 메모리로 이전 출력에서 얻는 이득을 공정 비트 추측의 성공률과 비교합니다." formula={String.raw`\operatorname{Adv}=\left|\Pr[A(Y_1,\ldots,Y_k)=Y_{k+1}]-\tfrac12\right|`} annotatedFormula={String.raw`\begin{aligned}p_A&=\underbrace{\Pr[A(Y_{1:k})=Y_{k+1}]}_{\text{이전 출력으로 예측}}\\\operatorname{Adv}&=\underbrace{|p_A-\tfrac12|}_{\text{공정 비트와의 차이}}\end{aligned}`} operations={[{expression:String.raw`|0.60-0.50|=0.10`,annotation:["가정한 공격 성공 확률의 차이는 0.10입니다.","유한한 표본의 관측 비율만으로 이 확률을 확정하지 않습니다."]}]} terms={[{symbol:"A",name:"예측 알고리즘",description:"정한 시간·메모리 범위 안에서 실행하는 공격입니다."},{symbol:"Y₁…Yₖ",name:"관찰한 출력",description:"이미 공개된 비트와 공격자가 아는 문맥입니다."},{symbol:"Yₖ₊₁",name:"다음 비트",description:"아직 보지 못한 예측 대상입니다."},{symbol:"p_A",name:"공격 성공 확률",description:"정한 실험에서 예측 알고리즘이 맞힐 확률입니다."},{symbol:"Adv",name:"예측 이득",description:"기준 성공률 1/2에서 벗어난 정도입니다."}]} assumptions={["확률은 비밀 입력·알고리즘의 무작위성 등 정한 실험 전체에 대해 계산합니다.","보안 매개변수에 따른 허용 공격과 무시할 수 있는 이득의 범위를 지정해야 합니다."]} interpretation="0과 1을 번갈아 쓰는 0101…도 비율은 절반이지만 다음 비트는 완전히 예측됩니다. 고르게 보이는 출력을 만드는 것과 비밀 상태 없이 예측하기 어려운 것은 다릅니다." />
  <div id="paper-rfc4086-randomness"><CitationBlock source="RFC 4086 · Randomness Requirements for Security" citeKey={2} href="https://www.rfc-editor.org/rfc/rfc4086.html">통계적인 외양과 공격자에게 알려진 환경 정보를 구분하는 근거입니다. 특정 운영체제 구현의 안전성을 일괄 보장하는 문서는 아닙니다.</CitationBlock></div>
 </section>
 <section id="source" data-teach-level="5/6" className="space-y-5"><h2 className="text-2xl font-bold">9. 실제 규격의 상태 갱신에 시작값 3을 넣습니다</h2>
  <p>NIST SP 800-90A Rev.1 §10.1.2의 HMAC_DRBG를 읽겠습니다. HMAC은 비밀 키와 자료를 받아 정해진 길이의 값을 계산하는 함수입니다. SHA-256을 쓰면 내부 K와 V는 각각 32바이트입니다. 같은 키와 자료에서는 같은 결과가 나오므로 비밀 입력과 상태 보호가 중요합니다.</p>
  <p>원문 초기화는 K를 모두 0인 바이트, V를 모두 1인 바이트로 시작합니다. 실제 seed_material은 entropy_input·nonce·personalization_string을 연결해 만듭니다. 아래 실험은 갱신 계산만 보려고 seed_material 자리에 한 바이트 0x03을 넣었습니다. 이 입력은 규격의 충분한 엔트로피·초기화 조건을 충족하지 않으며 승인된 난수 생성기로 사용할 수 없습니다.</p>
  <AlgorithmBlock title="SP 800-90A Rev.1 §§10.1.2.2–10.1.2.5에 따른 계산 순서" input={["교육용 seed_material=0x03, SHA-256, K=0x00 32개, V=0x01 32개"]} steps={[{code:"K = HMAC(K, V || 0x00 || seed_material)",note:"원문의 Update 첫 단계입니다. ||는 바이트 연결입니다."},{code:"V = HMAC(K, V)",note:"방금 갱신한 K를 사용합니다."},{code:"K = HMAC(K, V || 0x01 || seed_material); V = HMAC(K,V)",note:"입력 자료가 있으므로 0x01을 사용하는 두 번째 부분도 수행합니다."},{code:"reseed_counter = 1; V = HMAC(K,V); output = V",note:"추가 입력 없이 32바이트를 요청한 첫 generate입니다."},{code:"(K,V) = Update(빈 자료,K,V); reseed_counter += 1",note:"출력 뒤에도 상태를 갱신합니다. 빈 자료이면 Update의 0x01 부분은 생략합니다."}]} output="첫 출력 323e…afe5. 같은 상태에서 다음 요청을 진행하면 dbf1…ea03." />
  <p>초기 갱신 뒤 K는 <code>1d6c5843…c4264db</code>, V는 <code>7b8ea210…a984918</code>로 시작하고 끝납니다. 원문의 generate 순서에 이 상태를 넣으면 3절의 첫 출력이 나옵니다. 출력 뒤 갱신을 포함해 다음 요청을 처리하면 두 번째 출력이 나옵니다.</p>
  <p>
            이 과정을 별도 Python 교육용 구현으로 실행했습니다. 0~7을 각각 한 바이트로 넣어 얻은 첫 출력 여덟 개는 모두 달랐고 공개된 첫 출력과 일치한 후보는 3
            하나였습니다. 첫 요청 직후의 상태를 복사한 두 객체에서는 다음 출력이 정확히 같았습니다. 실제 운영체제 난수 구현이나 공식 인증 시험을 실행한 결과는 아닙니다.
          </p>
  <p>실제 원문에는 요청 길이·재시드 간격·추가 입력·예측 저항 요청에 따른 처리도 있습니다. 위 절차는 32바이트 한 번 요청과 빈 추가 입력의 경로를 설명한 것입니다. 생략된 검사를 없애도 된다는 의미가 아닙니다.</p>
  <div id="paper-nist-drbg"><CitationBlock source="NIST SP 800-90A Rev.1 · §10.1.2" citeKey={3} href="https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-90Ar1.pdf">원문의 초기화·Update·Generate 순서를 교육용 입력에 적용했습니다. 2026-10-04 공식 페이지는 Rev.1 Final과 Rev.2 Draft를 구분하며 이 글은 Rev.1의 식을 지정해 읽습니다.</CitationBlock></div>
 </section>
 <section id="state-lifecycle" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">10. 상태를 읽힌 뒤에는 새로 모르는 재료가 필요합니다</h2>
  <p>현재 상태에서 예전 상태를 거꾸로 찾기 어렵게 만들고 이전 값을 지웠다면 과거 출력 보호를 기대할 수 있습니다. 이것을 backtracking resistance라고 부릅니다. 그러나 현재 K·V를 읽은 공격자는 이후의 결정적인 계산을 그대로 따라갑니다. 과거 보호와 미래 회복은 다른 질문입니다.</p>
  <p>미래 출력을 다시 보호하려면 공격자가 모르는 새 재료를 받아 안전하게 reseed해야 합니다. 알려진 시각·프로세스 번호·컨테이너 이름만 추가해도 복사본과 출력은 달라질 수 있지만 상태를 아는 공격자에게 비밀이 생긴 것은 아닙니다. 상태를 갱신하는 연산만 반복해도 자동 회복되지 않습니다.</p>
  <p>가상머신 이미지·스냅샷·프로세스 복제에는 난수 상태도 들어갈 수 있습니다. 운영체제와 라이브러리가 복제·부팅·복구를 어떻게 처리하는지 확인해야 합니다. 출력이 두 번 달랐다는 시험은 중복을 찾는 데 도움이 되지만 상태를 모르는 공격자에 대한 보안 증명은 아닙니다.</p>
 </section>
 <section id="applications" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">11. 서명 비밀을 재사용하면 개인키 7까지 드러납니다</h2>
  <p>모든 난수 사용처가 같은 요구를 갖지는 않습니다. 개인키는 충분한 비밀량과 장기 보호가 필요합니다. 인증 암호화의 nonce는 방식에 따라 공개해도 되지만 같은 키 아래 중복되면 안 됩니다. 비밀번호 재설정 표는 추측 제한·만료·한 번 사용 규칙도 필요합니다.</p>
  <p>ECDSA의 임시 서명값 k는 비밀이어야 합니다. 같은 k로 두 메시지에 서명하면 공개된 서명만으로 k와 개인키를 풀 수 있습니다. 작은 곡선 y²=x³+2x+2 mod 17, 시작점 (5,1), 차수 n=19를 예로 들겠습니다(가정). 개인키 d=7, 임시값 k=3이면 3배 점은 (10,6)이므로 r=10입니다. 실제 보안용 곡선은 아닙니다.</p>
  <p>메시지에서 만든 정수 h₁=4·h₂=9를 사용하면 서명식 s=k⁻¹(h+rd) mod n에서 s₁=12·s₂=1이 나옵니다. 두 식에 k를 곱하고 빼면 같은 rd 항이 사라져 k(s₁−s₂)=h₁−h₂가 됩니다. 여기서 역원을 곱하면 k를 얻고 첫 식에 다시 넣어 d를 얻습니다.</p>
  <ExplainedFormula question="공개된 두 서명에서 k=3과 d=7을 어떻게 구하나요?" idea="같은 개인키·r 항을 먼저 제거해 임시값을 풀고, 그 임시값을 원래 서명식에 대입합니다." formula={String.raw`\begin{aligned}k&=(h_1-h_2)(s_1-s_2)^{-1}\pmod n\\d&=(s_1k-h_1)r^{-1}\pmod n\end{aligned}`} annotatedFormula={String.raw`\begin{aligned}k&=\underbrace{(4-9)11^{-1}}_{\text{차이에 역원을 곱함}}\\&=(-5)\cdot7\equiv3\pmod{19}\\d&=\underbrace{(12\cdot3-4)10^{-1}}_{\text{임시값을 원식에 대입}}\\&=32\cdot2\equiv7\pmod{19}\end{aligned}`} operations={[{expression:String.raw`(-5)\cdot7\bmod19=3`,annotation:["11×7 mod 19=1입니다.","서명 차이로 임시값 3을 얻습니다."]},{expression:String.raw`32\cdot2\bmod19=7`,annotation:["10×2 mod 19=1입니다.","첫 서명식에서 개인키 7을 복원합니다."]}]} terms={[{symbol:"h₁,h₂",name:"메시지 정수",description:"서명 규격의 해시 해석을 거친 공개값입니다. 예에서는 4·9입니다."},{symbol:"r,s₁,s₂",name:"서명 값",description:"같은 r=10과 두 서명 성분 12·1입니다."},{symbol:"k,d",name:"임시값과 개인키",description:"이번 계산으로 각각 3·7이 드러납니다."},{symbol:"n",name:"점의 차수",description:"서명 스칼라 연산은 19를 기준으로 합니다. 좌표의 mod 17과 다릅니다."}]} assumptions={["같은 키·같은 임시값의 두 서명이며 필요한 역원이 존재합니다.","실제 서명의 low-s 정규화·해시 처리·부호 규칙을 적용한 뒤 관계를 비교해야 합니다."]} interpretation="비밀 항이 사라져 k를 먼저 얻는 것이 핵심입니다. k가 완전히 같지 않아도 편향이나 일부 비트 누출이 많은 서명에 누적되면 공격 조건이 생길 수 있습니다." />
  <p>RFC 6979처럼 개인키와 메시지를 사용해 임시값을 결정적으로 만드는 검토된 방식도 있습니다. 이는 예측 가능한 시간이나 공개 카운터를 k로 쓰는 방식과 다릅니다. 라이브러리의 규격을 따르고 임시값과 내부 상태를 기록에 남기지 않습니다.</p>
  <CitationBlock source="RFC 6979 · §2.4, Deterministic DSA/ECDSA" citeKey={4} href="https://www.rfc-editor.org/rfc/rfc6979.html">서명식과 메시지·개인키를 사용한 임시값 생성의 범위를 확인했습니다. 작은 곡선의 두 서명과 키 복원은 별도 정수·점 연산으로 검산했습니다.</CitationBlock>
 </section>
 <section id="release" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">12. 부팅·복제·실패를 통과한 뒤 생성 속도를 봅니다</h2>
  <p>
            운영체제·런타임·라이브러리 버전과 사용하는 API를 기록하고 부팅 직후·프로세스 복제·이미지 복제·스냅샷 복구·재시드 실패를 각각 확인합니다. 요청 길이보다 적게 반환하는
            인터페이스라면 실제 받은 길이를 검사합니다. 실패했을 때 시각이나 약한 난수 함수로 대신 비밀을 만들지 않습니다.
          </p>
  <p>공식 시험값과 상태 전이 검사를 확인하고 중복 탐지와 사용처의 실패 검사도 연결합니다. 공개 counter nonce를 쓰는 방식은 충돌과 재시작 뒤 되돌아감까지 확인해야 합니다. 테스트의 고정 seed는 재현성에 쓰되 실제 비밀을 만드는 경로와 분리하고 로그·오류 덤프·관측 자료에 상태나 원시 비밀 재료를 남기지 않습니다.</p>
  <div id="paper-heninger-weak-keys"><CitationBlock source="Heninger et al. · Mining Your Ps and Qs (2012)" citeKey={5} href="https://www.usenix.org/conference/usenixsecurity12/technical-sessions/presentation/heninger">당시 인터넷의 TLS·SSH 공개키에서 공통 RSA 인수와 DSA 임시값 문제를 찾아 잘못된 난수가 실제 키 유출로 이어짐을 보인 연구입니다. 당시 표본의 결과를 현재 모든 운영체제의 실패율로 확대하지 않습니다.</CitationBlock></div>
  <ReviewPrompts questions={["시작값 후보가 정확히 여덟 개라면 출력 길이를 32바이트에서 늘렸을 때 후보 수는 어떻게 달라질까요? (답: 3절)","pmax=1/8이라는 사실만으로 전체 후보가 여덟 개라고 결론낼 수 있을까요? (답: 7절)","같은 임시값의 두 서명 s₁=12·s₂=1에서 개인키 항을 빼면 어떤 값부터 복원할 수 있을까요? (답: 11절)"]}/>
 </section>
 </article>;}
