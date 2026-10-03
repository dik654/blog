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
        <h2 className="mb-6 text-2xl font-bold">1 · 누가 이 파일을 승인했는지 공개적으로 확인하려면</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">펌웨어 파일을 배포한다고 해 봅시다. 사용자는 파일이 중간에 바뀌지 않았고 정해진 권한을 가진 사람이 승인했는지 확인해야 합니다. 비밀을 같이 나누는 방식만으로는 누구나 확인할 수 있는 증거가 되지 않습니다.</p>
          <p className="leading-8">작성자는 비밀 키로 서명을 만들고 검증자는 공개 키로 확인합니다. 양자컴퓨터를 고려한 서명은 이 관계를 다른 수학으로 구현합니다. 격자 계산과 해시 나무가 각각 무엇을 맡는지 살펴봅니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">먼저 서명 함수에 들어가고 나오는 것을 고정합니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2 · 메시지와 비밀 키를 넣고 서명 바이트를 받습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">입력은 승인할 메시지, 서명 용도를 구분하는 문맥, 비밀 키입니다. 출력은 서명입니다. 검증자는 메시지·문맥·공개 키·서명을 받아 통과 또는 거절을 결정합니다.</p>
          <p className="leading-8">
            통과는 그 공개 키에 대응하는 비밀 키로 정해진 바이트를 승인했다는 암호학적 관계입니다. 공개 키의 주인과 승인 권한, 내용의 사실 여부까지 자동으로 결정하지는 않습니다.
          </p>
        </div>

        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">비밀을 보내지 않고 같은 관계를 확인하는 작은 계산을 준비합니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3 · 비밀 [1,2]를 바로 보내지 않고 다른 값과 섞습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">모든 값을 17로 나눈다고 놓습니다(가정). 공개 표 A의 두 행은 [2,3]·[4,1], 비밀 s=[1,2], 작은 오류 e=[1,0]입니다. 공개 t=As+e는 [9,6]입니다.</p>
          <p className="leading-8">서명 때 새 마스크 y=[2,1]을 고르면 Ay=[7,9]입니다. 메시지와 이 약속을 함께 확인해 나온 challenge를 작은 예에서는 c=1이라고 놓습니다. 응답 z=y+cs는 [3,3]입니다.</p>
          <p className="leading-8">
            이 두 차원과 c=1로 계산을 따라가 봅니다. 실제 보안 수준이나 표준 서명을 재현하는 예제가 아닙니다.
          </p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">보낸 응답에서 공개값을 빼면 처음의 약속과 연결됩니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4 · 공개된 표로 확인하되 비밀 벡터는 전송하지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">검증자는 응답에 공개 표를 곱하고 challenge를 곱한 공개값을 뺍니다. 비밀이 들어 있는 큰 항은 상쇄되고 처음 만든 약속과 작은 오류가 남습니다.</p>
          <p className="leading-8">남은 값으로 약속의 필요한 부분을 복원하고 메시지와 함께 challenge를 다시 계산합니다. 서명 속 challenge와 같아야 통과합니다. 약속만 맞고 메시지가 바뀐 경우도 걸러야 합니다.</p>
        </div>
        <NumericPath title="승인 한 번의 계산" steps={[{"label": "서명자", "value": "새 마스크와 약속", "detail": "메시지에 challenge 결속"}, {"label": "공개할 응답", "value": "비밀과 마스크의 합", "detail": "크기·힌트 조건 검사"}, {"label": "검증자", "value": "약속 재구성", "detail": "같은 challenge인지 대조"}]} />

        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">왜 마스크·크기 검사·힌트가 함께 필요한지 봅니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5 · 비밀을 가렸더라도 공개값의 분포가 비밀을 말할 수 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">마스크를 더했다는 이유만으로 안전해지는 것은 아닙니다. 공개할 응답의 범위가 비밀에 따라 달라지면 많은 서명이 비밀에 관한 정보를 줄 수 있습니다. 허용 조건을 벗어난 후보는 버리고 새 후보를 만들어야 합니다.</p>
          <p className="leading-8">
            공개 키를 줄이려고 일부 낮은 정보를 버리면 경계에서는 검증자의 재계산 결과가 달라질 수 있습니다. 이 차이를 복원할 제한된 힌트가 필요합니다. 아무 정보나 더 넣는 것이
            아니라 형식과 개수까지 검사합니다.
          </p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">이 부품을 표준의 이름과 크기에 대응시킵니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6 · ML-DSA는 다항식의 응답을 검증합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">FIPS204의 ML-DSA는 CRYSTALS-Dilithium 계열에서 표준화한 서명입니다. 성분은 계수가256개인 다항식(차수255 이하)이고 계수는 8380417로 나눈 값입니다. 공개 표와 비밀, 마스크, challenge는 서로 다른 분포와 범위를 갖습니다.</p>
          <p className="leading-8">ML-DSA의 challenge는 작은 예의 정수1과 달리 제한된 개수의 ±1 계수를 가진 다항식입니다. 공개 키는 표를 복원할 씨앗과 반올림한 벡터를 담습니다. 서명은 challenge 요약·응답·힌트를 담습니다.</p>
          <p className="leading-8">서명자가 먼저 만든 약속의 높은 부분과 메시지 요약을 해시해 challenge를 만듭니다. 검증자는 서명으로 그 높은 부분을 재구성합니다. 원 논문에서 유래한 이름과 표준의 정확한 파라미터·인코딩을 함께 확인해야 합니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">표준의 큰 다항식을 읽기 전에 작은 상쇄를 마저 계산합니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7 · [15,15]에서 [9,6]을 빼면 [6,9]가 남습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">작은 예제의 z=[3,3]에 A를 곱하면 [15,15]입니다. c=1이므로 ct=[9,6]을 빼서 [6,9]를 얻습니다.</p>
          <p className="leading-8">서명자가 만든 Ay=[7,9]에서 ce=[1,0]을 빼도 [6,9]입니다. 검증자가 비밀 s를 직접 받지 않아도 처음 약속과 연결된 값을 계산한다는 사실을 확인했습니다.</p>
          <p className="leading-8">설명용으로4 단위 구간의 번호만 읽으면 [7,9]와 [6,9]는 모두 [1,2]입니다. 하지만 8이7로 바뀌면 구간2가1로 변합니다. 실제 표준의 분해·반올림·힌트는 이러한 경계 차이를 정해진 규칙으로 처리합니다. 이 임의의4 단위 규칙이 FIPS 알고리즘은 아닙니다.</p>
          <p className="leading-8">실제 검증은 응답 크기와 힌트를 먼저 확인하고 재구성한 높은 부분과 메시지에서 challenge를 다시 만듭니다. 단순히 Az−ct를 계산했다는 사실만으로 서명 검증이 끝나지 않습니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">이 계산과 거절 조건이 원문 코드 어디에 있는지 확인합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8 · 실제 코드는 후보를 여러 조건으로 걸러 냅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">PQClean 고정본의 sign.c 135행은 새 y를 뽑고 140행은 Ay를 계산합니다. 높은 부분과 메시지 요약을 해시해 challenge를 만들고 158–162행에서 z=y+cs1을 구성합니다.</p>
          <p className="leading-8">163행의 크기 검사에 걸리면 rej로 돌아갑니다. 작은 예에서 각 성분의 절댓값이4 미만이어야 한다고 가정하면 [3,3]은 통과하고 [4,3]은 실패합니다. 실제 코드는 GAMMA1−BETA와 다른 표준 상수를 사용합니다.</p>
          <p className="leading-8">검증 함수는 266행부터 context 길이·서명 길이·인코딩·응답 크기를 확인합니다. 공개 키·context·메시지로 같은 요약을 만들고 303행의 뺄셈과 309행의 힌트 적용으로 높은 부분을 재구성합니다. 마지막에 challenge를 다시 계산해 비교합니다.</p>
          <p className="leading-8">원문의 곱셈과 뺄셈은 NTT 표현과 역변환 사이에 있습니다. 수학의 한 곱셈과 C 함수 호출 하나를 무조건 일대일로 읽지 않습니다. 이 글은 코드 경로를 확인했으며 해당 C 전체를 제품 환경에서 실행·인증한 결과가 아닙니다.</p>
        </div>
<div className="flex flex-wrap gap-3"><CodeViewButton label="마스크·응답·거절·힌트 원문" onClick={() => sidebar.open("sign", codeRefs.sign)} /><CodeViewButton label="문맥·크기·challenge 검증 원문" onClick={() => sidebar.open("verify", codeRefs.verify)} /></div>
        <SourceApplication source="FIPS 204 · Algorithms 7–8, Table 2" excerpt="rejection sampling loop" application="작은 사례의 [4,3] 거절은 응답 크기 검사 역할을 보여 줍니다. 실제 임계값은 FIPS 파라미터와 코드의 GAMMA1−BETA입니다." />
        <CitationBlock source="FIPS 204 · Algorithms 7–8, Table 2" citeKey={1} href="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.204.pdf">ML-DSA 최종 표준. 서명·검증, domain context와 key/signature 크기를 대조합니다.</CitationBlock>
        <CitationBlock source="PQClean · ML-DSA-44 sign.c · 0586a824" citeKey={2} href="https://github.com/PQClean/PQClean/blob/0586a824fc0d49df0b6b6e9179d8d15d06d0974f/crypto_sign/ml-dsa-44/clean/sign.c">135–194행 생성과265–328행 검증을 보존했습니다. 난수·인코딩·일치 검사의 실제 순서를 읽습니다.</CitationBlock>
        <AlgorithmBlock title="ML-DSA 서명 검증의 순서 (의사코드)" input={["메시지 M, context, 공개 키 pk, 서명 σ; 선택한 표준 파라미터"]} steps={[{"code": "길이·형식·응답 크기·힌트 형식을 검사", "note": "허용하지 않는 인코딩은 거절합니다."}, {"code": "μ ← 공개 키·context·M을 결속한 요약", "note": "다른 문맥이나 메시지로 바뀌면 같은 승인이 아닙니다."}, {"code": "w′ ← A·z − c·2^d·t1; hint로 높은 부분 재구성", "note": "mod17 사례에서는 [15,15]−[9,6]=[6,9]에 대응하는 역할입니다."}, {"code": "재구성한 높은 부분과 μ로 challenge를 다시 만들고 비교", "note": "응답 관계와 메시지 결속을 모두 만족해야 합니다."}]} output="서명 통과 또는 거절; 메시지 내용의 진위나 설치 정책은 별도" />
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">다른 수학적 가정에 기대는 해시 기반 서명과 비교합니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9 · SLH-DSA는 해시 사슬을 많은 나무에 묶습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">해시 H를 네 번 적용한 H⁴(x)를 공개 끝값으로 놓습니다(가정). H²(x)를 보여 주면 검증자는 두 번 더 해시해 끝값을 확인할 수 있습니다. 그러나 이를 본 사람은 H³(x)도 만들 수 있습니다. 이 사슬 하나만으로 안전한 다회용 서명이 되지는 않습니다.</p>
          <p className="leading-8">실제 SLH-DSA는 여러 사슬의 숫자 표현에 checksum을 더하는 WOTS+와, 메시지 요약에서 선택한 비밀 요소를 인증하는 FORS를 사용합니다. 나무의 형제 해시들을 함께 주면 검증자가 선택된 잎에서 루트를 재계산할 수 있습니다. 여러 층의 나무인 hypertree는 하위 루트를 다음 층 서명에 연결합니다.</p>
          <p className="leading-8">도메인과 나무·층·위치별 주소를 해시에 결속해 다른 역할의 계산이 섞이지 않게 합니다. Stateless는 사용자가 다음 일회용 키 번호를 영속 카운터로 관리하는 방식이 아니라는 뜻이며 내부 일회용·제한 사용 요소를 무제한 재사용해도 된다는 뜻이 아닙니다.</p>
          <p className="leading-8">FIPS204 표2에서 ML-DSA-44의 공개 키는1,312바이트, 서명은2,420바이트입니다. FIPS205 표2의 SLH-DSA-128s는 공개 키32바이트, 서명7,856바이트입니다. 키가 작은 방식이 서명도 작다는 결론은 성립하지 않습니다.</p>
          <p className="leading-8">SLH-DSA의 s와 f는 작은 서명과 빠른 서명 쪽의 절충을 구분합니다. SHA2·SHAKE 및128·192·256 묶음도 확인해야 합니다. 실제 서명·검증 시간은 메시지와 구현, 장치 조건에서 측정합니다.</p>
        </div>

        <SourceApplication source="FIPS 205 · §6–10와 Table 2" excerpt="stateless hash-based digital signature algorithm" application="공개 루트까지 경로를 검증하는 구조에 대응합니다. 사용자가 일회용 키의 다음 번호를 전역 카운터로 관리하는 방식과 구분하지만 내부 요소의 사용 규칙이 사라지는 것은 아닙니다." />
        <CitationBlock source="FIPS 205 · §6–10와 Table 2" citeKey={3} href="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.205.pdf">SLH-DSA 최종 표준. WOTS+·FORS·hypertree의 역할과12개 파라미터 묶음의 크기를 확인합니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">알고리즘을 고른 다음에는 실제 권한 경로를 옮겨야 합니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10 · 서명 형식을 바꿔도 오래된 권한은 자동으로 사라지지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">같은 마스크를 다른 challenge에 재사용하면 두 응답의 차이에서 마스크가 사라집니다. 장난감 식의 차이는 (c1−c2)s입니다. 실제 구현에서도 난수·내부 nonce·재시도 규칙을 임의로 바꾸지 않습니다.</p>
          <p className="leading-8">문서 서명은 내용이 사실이라는 증거가 아닙니다. 펌웨어는 올바르게 서명된 구버전일 수도 있으므로 하향 설치 방지와 키 폐기를 함께 검사합니다. 인증서·계정 복구·관리자 업그레이드가 예전 서명에 의존한다면 그 경로도 옮겨야 합니다.</p>
          <p className="leading-8">2026-10-04 기준 FIPS204·205는 최종 표준입니다. Falcon 기반 FN-DSA와 HQC는 후속 표준화 중이며 최종 FIPS와 같은 상태로 나열하지 않습니다. FIPS204에는2026-07-31 정정 예정 안내가 있어 구현자는 최신 문서를 대조해야 합니다.</p>
          <p className="leading-8">일반 CPU에서 동작하는 양자내성 서명과 광학 장비로 비밀을 나누는 QKD는 역할이 다릅니다. 블록체인에서는 이 서명을 실제로 검증할 코드·비용·전송 한도와 복구 권한까지 확인해야 합니다.</p>
        </div>
<p className="mt-4 leading-8"><Link className="underline" to="/cs/blockchain/pq-account">실제 ERC-4337 계정에서 검증·nonce·복구 권한 옮기기</Link></p>
        <CitationBlock source="NIST PQC · 최신 표준화 상태" citeKey={4} href="https://csrc.nist.gov/Projects/Post-Quantum-Cryptography">2026-10-04 확인. FIPS203·204·205와 후속 Falcon·HQC 표준화 상태를 구분합니다.</CitationBlock>
        <CitationBlock source="FIPS 204 · 최신 정정 안내" citeKey={5} href="https://csrc.nist.gov/pubs/fips/204/final">2026-07-31 정정 예정 항목 안내가 추가됐습니다. 정정표 파일은 접근 제한으로 직접 열지 못했으며 구체 정정 내용을 추정하지 않습니다.</CitationBlock>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">서명 수학의 통과와 실제 서비스의 권한 이전을 따로 확인해 보세요.</p>
        <ReviewPrompts questions={["응답에 마스크를 더했는데도 후보를 버리는 이유는 무엇일까요? (답: 8절)", "공개 키가 작으면 서명도 작다고 볼 수 있을까요? (답: 9절)", "정상 서명된 구버전 펌웨어를 무조건 설치해도 될까요? (답: 10절)"]} />
      </section>
      <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} />
    </div>
  );
}
