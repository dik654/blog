import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";
import { Link } from "react-router-dom";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs, fileTrees } from "./pq-sources/codeRefs";

export default function Article() {
  const sidebar = useCodeSidebar();
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1 · 처음 만난 두 컴퓨터가 같은 비밀을 만들려면</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">두 컴퓨터가 암호화 통신을 시작하려 합니다. 공개된 인터넷으로 오가는 것은 누구나 복사할 수 있습니다. 그래도 당사자 둘만 같은 비밀을 얻을 방법이 필요합니다.</p>
          <p className="leading-8">받는 쪽은 공개값을 먼저 보내고 보내는 쪽은 짧은 캡슐을 돌려줍니다. 둘이 만든 비밀이 같아지는 이유를 작은 숫자로 계산한 뒤 실제 표준과 C 코드를 읽습니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">일단 안쪽 수학을 감추고 무엇을 주고받는지 봅니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2 · 공개값 하나와 캡슐 하나로 같은 비밀에 도착합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">수신자는 자신만 보관할 값과 남에게 줄 값을 한 쌍으로 만듭니다. 송신자는 공개값과 새 난수를 이용해 비밀과 캡슐을 만듭니다. 수신자는 캡슐과 자신만 아는 값으로 비밀을 복원합니다.</p>
          <p className="leading-8">이 절차가 상대의 이름까지 확인해 주지는 않습니다. 중간에서 공개값을 다른 사람의 것으로 바꾸면 다른 상대와 비밀을 만들 수 있습니다. 신원 확인은 뒤에서 다시 연결합니다.</p>
        </div>
        <NumericPath title="공개 통신 위의 키 생성" steps={[{"label": "수신자", "value": "공개값 전송", "detail": "개인 비밀은 보관"}, {"label": "송신자", "value": "캡슐·공유 비밀 생성", "detail": "캡슐만 전송"}, {"label": "수신자", "value": "공유 비밀 복원", "detail": "본문 데이터는 다음 단계에서 보호"}]} />

        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">공통 항이 어떻게 지워지는지 아주 작은 계산을 준비합니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3 · 17로 나누는 작은 계산을 준비합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">모든 수를 17로 나눈 나머지로 계산합니다(가정). 공개 표 A의 두 행은 [2,3]과 [4,1]입니다. 비밀 s는 [1,2], 작은 오류 e는 [1,0]입니다.</p>
          <p className="leading-8">공개값 t의 첫 성분은 2×1+3×2+1=9, 둘째는 4×1+1×2+0=6입니다. 남에게 A와 t=[9,6]을 줍니다. 이 두 차원 예는 안전한 암호가 아니라 곱과 오류의 역할을 보여 주는 장난감입니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">받는 쪽의 비밀과 보내는 쪽의 새 비밀이 같은 큰 항을 만들게 합니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4 · 두 계산의 큰 부분은 같고 작은 차이만 남습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">보내는 쪽도 임시 비밀을 고릅니다. 공개 표를 뒤집어 곱한 값과, 공개값 t에 임시 비밀을 곱한 값을 함께 보냅니다. 각 값에는 작은 오류와 전달할 비트가 들어갑니다.</p>
          <p className="leading-8">수신자가 첫 값에 자기 비밀을 곱해 둘째 값에서 빼면 공통으로 들어간 큰 곱이 사라집니다. 남은 값이 0 근처인지 8 근처인지를 보고 비트 하나를 읽습니다.</p>
        </div>

        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">공개 방정식을 만들면서도 작은 오류를 넣는 이유를 확인합니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5 · 오류를 빼 버리면 풀기 쉬운 관계가 드러납니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            오류가 없다면 공개된 표와 결과로 비밀을 푸는 정확한 연립방정식이 됩니다. 차원이 충분히 클 때 작은 오류가 섞인 관계를 풀기 어렵다는 성질을 사용합니다. 아무 잡음을 많이
            넣는 방식은 아닙니다.
          </p>
          <p className="leading-8">오류는 공개 관계를 흐리게 하면서도 정상 수신자의 복원이 성공할 만큼 작아야 합니다. 너무 작거나 차원이 낮으면 공격이 쉬워질 수 있고 너무 크면 정상 복원도 깨집니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">이제 표·벡터·오류를 표준이 부르는 이름과 연결합니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6 · ML-KEM의 성분은 수 하나가 아니라 다항식입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">오류가 섞인 선형 관계를 학습하는 문제를 Learning with Errors, 줄여서 LWE라고 부릅니다. 앞의 표와 벡터는 역할을 보여 주기 위한 축소판입니다.</p>
          <p className="leading-8">격자는 몇 개의 기준 벡터를 정수 배수로 더해 만든 점들의 배열입니다. 작은 오류는 정확한 점에서 조금 벗어난 위치를 만듭니다. 이 그림은 이름을 이해하는 직관이며 모든 격자 문제가 어렵다는 뜻은 아닙니다.</p>
          <p className="leading-8">ML-KEM은 다항식을 성분으로 갖는 Module-LWE 구조를 씁니다. FIPS203의 다항식의 계수 개수 n은 256(차수255 이하), 계수의 나눗수 q는 3329이며 x의 256제곱+1로 다항식을 줄입니다. 모듈 차원 k는 2·3·4 중 하나입니다.</p>
          <p className="leading-8">공개 표는 짧은 씨앗에서 재생성하고 다항식 곱에는 NTT라는 변환을 이용합니다. 압축은 캡슐 크기를 줄이는 대신 복원 오차를 더합니다. 17의 예제는 다항식·압축·난수 분포를 모두 생략했습니다.</p>
          <p className="leading-8">KEM은 Key-Encapsulation Mechanism의 약자입니다. 새 공유 비밀을 만드는 기능이지 임의의 문서 전체를 직접 암호화하거나 작성자를 인증하는 서명 기능이 아닙니다.</p>
        </div>
<p className="mt-4 text-sm leading-7"><Link className="underline" to="/cs/crypto/finite-field-theory#prime-field">나머지 연산</Link>과 <Link className="underline" to="/cs/crypto/fft">NTT</Link>에서 아래 수학을 이어 확인할 수 있습니다.</p>
        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">축소 예제로 돌아와 캡슐의 두 값을 실제로 계산합니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7 · 6에서 16을 빼면 나머지 7, 따라서 비트1입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">송신자가 임시 r=[1,1]을 고르고 첫 부분의 오류 e1=[0,1], 둘째 오류 e2=0으로 놓습니다. A를 전치해 r에 곱하면 [6,4]이고 오류를 더한 첫 값 u는 [6,5]입니다.</p>
          <p className="leading-8">비트1을 8로 나타냅니다. 둘째 값 v는 t·r+8=9+6+8=23이므로 17로 나눈 나머지 6입니다. 보내는 값은 u=[6,5]와 v=6입니다.</p>
          <p className="leading-8">수신자는 s·u=1×6+2×5=16을 계산합니다. v−s·u는 −10이고 mod17에서 7입니다. 원 위의 거리로 비교하면 0보다 8에 가까워 비트1을 복원합니다.</p>
          <p className="leading-8">상쇄 뒤 오류는 e·r+e2−s·e1입니다. 이 사례에서는 1+0−2=−1이므로 중심8에서 하나 작은7이 남습니다. 이 등식의 상쇄는 정상 복원의 직관을 주며 암호의 안전성 증명은 아닙니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">실제 표준은 이 비트 복원만으로 끝내지 않습니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8 · 원문 코드는 복원 뒤 같은 캡슐을 다시 만들어 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">FIPS203의 내부 복원 절차는 캡슐에서 복원한 메시지와 공개 키의 해시로 후보 키와 재암호화 난수를 다시 만듭니다. 재생성한 캡슐이 받은 것과 같아야 정상 후보 키를 선택합니다.</p>
          <p className="leading-8">고정한 PQClean의 kem.c 146행은 메시지를 복원하고 150행은 후보 재료를 해시합니다. 153행은 재암호화, 155행은 캡슐 비교입니다. 158행은 비밀 z와 받은 캡슐에서 대체 키를 만들고 161행은 일치할 때만 정상 키를 복사합니다.</p>
          <p className="leading-8">우리 예제의 7→비트1은 이 경로의 첫 복원 단계에만 대응합니다. 실제 코드는 ML-KEM-768의 큰 다항식·압축·해시를 사용하므로 u=[6,5]를 C 함수에 넣는 테스트 벡터가 아닙니다.</p>
          <p className="leading-8">정상 길이의 부정한 캡슐을 처리할 때 내부 불일치 여부를 그대로 알려 주지 않는 방법이 암묵적 거절입니다. 바깥의 길이·키 검사 실패와 이 내부 처리까지 모두 같은 오류라고 뭉뚱그리면 안 됩니다.</p>
        </div>
<p className="mb-5 leading-8">이 C 함수는 길이 인자를 받지 않으며 정해진 길이의 버퍼와 검사된 키를 전제로 합니다. FIPS203 §7.3의 캡슐·복호 키 길이 및 키 안의 공개 키 해시 검사는 호출부나 라이브러리의 입력 경계에서 별도로 충족해야 합니다. 이 함수의 재암호화 비교를 표준의 전체 입력 검사라고 읽지 않습니다.</p>
        <CodeViewButton label="ML-KEM 복원·재암호화·키 선택 원문" onClick={() => sidebar.open("kemDec", codeRefs.kemDec)} />
        <SourceApplication source="FIPS 203 · Algorithm 18, Tables 2–3" excerpt="if ciphertexts do not match, “implicitly reject”" application="아래 코드의 fail이 재암호화 일치 여부이고, 불일치 시 rkprf가 만든 대체 키를 유지하는 경로에 대응합니다." />
        <CitationBlock source="FIPS 203 · Algorithm 18, Tables 2–3" citeKey={1} href="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.203.pdf">2024 최종 표준 §6·8. 2025-11-17 errata 안내가 있으므로 구현 시 최신 정정표도 확인합니다.</CitationBlock>
        <CitationBlock source="PQClean · ML-KEM-768 kem.c · 0586a824" citeKey={2} href="https://github.com/PQClean/PQClean/blob/0586a824fc0d49df0b6b6e9179d8d15d06d0974f/crypto_kem/ml-kem-768/clean/kem.c">136–163행의 원문 바이트와 라이선스를 코드 패널에 보존했습니다. 본문 사례의 작은 수는 이 코드의 파라미터가 아닙니다.</CitationBlock>
        <AlgorithmBlock title="캡슐에서 공유 비밀 복원 (의사코드)" input={["선택한 파라미터의 캡슐 c, 복호 키 dk; 표준의 바깥 입력 검사가 끝난 상태"]} steps={[{"code": "m′ ← 내부 복호(dk, c)", "note": "mod17 사례의7을 비트1로 읽는 일은 이 단계의 축소 모델입니다."}, {"code": "(K′, r′) ← G(m′ || 공개 키 해시)", "note": "후보 비밀과 재암호화 난수를 함께 유도합니다."}, {"code": "c′ ← 내부 암호화(공개 키, m′, r′)", "note": "받은 캡슐을 같은 절차로 재생성합니다."}, {"code": "K대체 ← J(z || c); c=c′일 때만 K′ 선택", "note": "내부 비교 결과가 외부로 새지 않도록 구현합니다. 조건 분기 표기는 논리 설명입니다."}]} output="32바이트 키; 상대 신원이나 이후 데이터의 인증 성공을 뜻하지 않음" />
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">같은 코드의 바이트 길이와 통신에서 맡는 역할을 대조합니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9 · 1,088바이트 캡슐은 32바이트 비밀을 위한 것입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">FIPS203 표3의 ML-KEM-768은 공개 키 1,184바이트, 복호 키 2,400바이트, 캡슐 1,088바이트, 공유 비밀 32바이트입니다. 이름의 768을 AES 키 길이나 양자 보안 비트 수로 읽지 않습니다.</p>
          <p className="leading-8">512·768·1024는 서로 다른 파라미터 묶음의 이름입니다. 각각 NIST 보안 범주1·3·5를 목표로 하며 자원 모형과 공격 종류를 무시한 단일 비트 숫자로 환산하지 않습니다.</p>
          <p className="leading-8">공유 비밀은 통신의 문맥과 함께 키 파생 절차에 들어가고 이후 대칭키 암호로 데이터를 보호합니다. 인증서·서명 등으로 공개 키의 상대를 확인하고 대화 기록과 선택한 알고리즘도 결속해야 합니다.</p>
          <p className="leading-8">FIPS203은 기능과 파라미터를, SP800-227은 KEM 사용의 조합과 검사를 읽는 출발점입니다. 표준을 읽은 사실이나 공개 구현의 존재가 특정 제품의 인증을 뜻하지 않습니다.</p>
        </div>

        <SourceApplication source="NIST SP 800-227 · Recommendations for KEMs" excerpt="establish a shared secret key over a public channel" application="전송하는 것은 본문 데이터 전체가 아니라 공유 비밀을 복원하게 하는 캡슐입니다. 이후 데이터 보호에는 별도 대칭키 암호가 필요합니다." />
        <CitationBlock source="NIST SP 800-227 · Recommendations for KEMs" citeKey={3} href="https://csrc.nist.gov/pubs/sp/800/227/final">2025-09-18 최종 권고. KEM의 기능과 이를 통신 프로토콜에 조합할 때 필요한 검사를 읽습니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">숫자 복원과 통신 보안이 실패하는 조건을 마지막으로 나눕니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10 · 작은 오류·정상 난수·인증된 상대가 모두 필요합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">작은 예에서 둘째 오류 e2를 −4로 바꾸면 남은 값은 7−4=3입니다. 8보다0에 가까워 비트0으로 잘못 읽습니다. 실제 표준은 분포·압축·파라미터를 함께 정해 복원 실패 가능성을 관리합니다.</p>
          <p className="leading-8">상대의 공개 키를 인증하지 않으면 공격자와 정상적으로 비밀을 만들 수 있습니다. 장기 복호 비밀키가 유출되면 저장된 캡슐도 다시 분석할 수 있으므로 전방 비밀성은 임시 키 사용과 삭제를 포함한 전체 프로토콜의 성질입니다.</p>
          <p className="leading-8">기존 방식과 PQC를 함께 쓰는 hybrid 구성도 두 바이트열을 아무렇게나 잇는 것으로 끝나지 않습니다. 결합 함수·인증·알고리즘 협상·하향 전환 방지를 명세대로 구성해야 합니다.</p>
          <p className="leading-8">실장에서는 난수 품질, 입력 검증, 일정한 실행 시간, 전력·오류 주입 등의 부채널을 확인합니다. 이 글은 고정 소스의 경로와 작은 산술을 확인했으며 실제 장치의 부채널 안전성이나 FIPS 준수 여부는 검증하지 않았습니다.</p>
        </div>

        <CitationBlock source="FIPS 203 최종본·정정 안내" citeKey={4} href="https://csrc.nist.gov/pubs/fips/203/final">2026-10-04 확인. 정정표 파일은 접근 제한으로 직접 읽지 못했으며 정정 내용을 추측하지 않습니다.</CitationBlock>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">캡슐의 숫자와 상대 인증을 구별할 수 있는지 확인해 보세요.</p>
        <ReviewPrompts questions={["공개값 [9,6]에서 오류를 왜 모두 없애지 않을까요? (답: 5절)", "캡슐을 다시 만들어 일치 여부를 보는 이유는 무엇일까요? (답: 8절)", "정상적으로 같은 키를 만들었는데 상대 인증은 실패할 수 있을까요? (답: 10절)"]} />
      </section>
      <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} />
    </div>
  );
}
