export default function ColdWalletPolicy() {
  return (
    <section id="cold-wallet-policy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">콜드월렛 80% 보관 규정</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-4">법적 요구사항</h3>
        <p className="leading-7">
          가상자산이용자보호법 시행령은 이용자 가상자산의 경제적 가치 총합 중 80% 이상을 콜드월렛에 보관하도록 규정한다.
          <br />
          콜드월렛(Cold Wallet)은 인터넷과 물리적으로 분리된 저장 장치에 개인키를 보관하는 방식을 뜻한다.
          <br />
          초기 입법예고 당시에는 70%였으나, 해킹 사고의 심각성을 고려해 80%로 상향되었다.
          <br />
          이 비율은 "수량" 기준이 아니라 "경제적 가치" 기준이라는 점이 핵심이다.
          비트코인 1개와 소액 알트코인 10만 개의 가치가 같을 수 있으므로, 단순 수량 비율로는 실질적 보호가 되지 않는다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">경제적 가치 산정 방법</h3>
        <p className="leading-7">
          80% 비율의 기준이 되는 "경제적 가치"는 다음과 같이 산정한다.
        </p>

        <div className="not-prose bg-muted/20 rounded-lg p-4 my-4 text-sm">
          <p className="font-medium mb-2">산정 공식</p>
          <p className="font-mono">
            경제적 가치 = 종류별 (총수량 x 최근 1년 1일 평균 원화환산액)의 합계
          </p>
        </div>

        <p className="leading-7">
          "최근 1년 1일 평균 원화환산액"은 전월 말일 기준으로 직전 1년간의 일별 종가 평균을 뜻한다.
          <br />
          단기 급등락에 의한 왜곡을 방지하기 위해 1년 평균을 사용한다.
          <br />
          예를 들어 특정 코인이 한 달간 10배 폭등했더라도, 1년 평균에는 완만하게 반영되므로 콜드월렛 비율 계산이 안정적이다.
          <br />
          반대로 급락 시에도 비율이 급변하지 않아, 사업자가 매일 대량 이동을 하지 않아도 되는 구조다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">월초 재산정 절차</h3>
        <p className="leading-7">
          VASP는 매월 초 5영업일 이내에 콜드월렛 보관 비율을 재산정해야 한다.
          <br />
          절차는 다음 순서를 따른다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">단계</th>
                <th className="text-left px-3 py-2 border-b border-border">내용</th>
                <th className="text-left px-3 py-2 border-b border-border">기한</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">1. 수량 집계</td>
                <td className="px-3 py-1.5 border-b border-border/30">종류별 이용자 위탁 가상자산의 총수량 확인</td>
                <td className="px-3 py-1.5 border-b border-border/30">전월 말 기준</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">2. 가치 산정</td>
                <td className="px-3 py-1.5 border-b border-border/30">총수량 x 최근 1년 일평균 원화환산액</td>
                <td className="px-3 py-1.5 border-b border-border/30">전월 말 기준</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">3. 비율 계산</td>
                <td className="px-3 py-1.5 border-b border-border/30">콜드월렛 보관 가치 / 전체 경제적 가치</td>
                <td className="px-3 py-1.5 border-b border-border/30">매월 초</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">4. 미달 시 조치</td>
                <td className="px-3 py-1.5">핫월렛에서 콜드월렛으로 즉시 이동</td>
                <td className="px-3 py-1.5">5영업일 이내</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          재산정 결과 80% 미만이면 즉시 보완 조치를 취해야 한다.
          <br />
          "즉시"는 물리적으로 가능한 최단 시간을 뜻하며, 핫월렛에서 콜드월렛으로의 전송에는 다중서명 승인이 필요하므로 실무적으로 수 시간~1영업일이 소요된다.
          <br />
          재산정 기록은 내부 문서로 보관하여, 감독 기관의 검사 시 제출할 수 있어야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">콜드월렛 물리적 관리</h3>
        <p className="leading-7">
          콜드월렛의 핵심은 개인키가 네트워크에 노출되지 않는 것이다.
          <br />
          물리적 관리 방법은 크게 두 가지로 나뉜다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">방식</th>
                <th className="text-left px-3 py-2 border-b border-border">장점</th>
                <th className="text-left px-3 py-2 border-b border-border">단점</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">HSM(Hardware Security Module)</td>
                <td className="px-3 py-1.5 border-b border-border/30">FIPS 140-2 인증, 키 추출 불가, 감사 로그 내장</td>
                <td className="px-3 py-1.5 border-b border-border/30">고가, 전용 인프라 필요</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">에어갭(Air-gapped) 장치 + 금고</td>
                <td className="px-3 py-1.5">네트워크 완전 차단, 저비용</td>
                <td className="px-3 py-1.5">서명 시 물리적 이동 필요, 속도 느림</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          HSM(Hardware Security Module)은 암호 연산을 수행하는 전용 하드웨어로, 내부에 저장된 키를 외부로 추출할 수 없게 설계되어 있다.
          <br />
          FIPS 140-2(미국 연방정보처리 표준)는 암호 모듈의 보안 수준을 4단계로 평가하는 인증 체계다. 레벨 3 이상이면 물리적 침투 시도 시 키를 자동 삭제한다.
          <br />
          에어갭 장치는 USB 드라이브나 전용 하드웨어 월렛을 인터넷에 연결하지 않은 채 사용하는 방식이다.
          트랜잭션 서명 시 QR코드나 마이크로SD를 통해 데이터를 물리적으로 전달한다.
          <br />
          두 방식 모두 개인키가 보관된 장소는 물리적 안전장소(금고, 보안실)에 위치해야 한다.
          출입 기록, CCTV 녹화, 이중 잠금이 기본 요건이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">다중서명(Multi-sig) 필수 적용</h3>
        <p className="leading-7">
          콜드월렛 자산의 이동에는 반드시 2인 이상의 서명이 필요하다.
          <br />
          다중서명(Multi-sig)은 하나의 트랜잭션을 실행하기 위해 복수의 개인키가 서명해야 하는 구조다.
          <br />
          예를 들어 3-of-5 구성이면, 5명의 키 보유자 중 3명 이상이 서명해야 전송이 실행된다.
          한 명이 매수당하거나 키를 분실해도 자산은 안전하다.
          <br />
          키 보유자는 서로 다른 부서 또는 물리적으로 다른 장소에 분산 배치하는 것이 원칙이다.
          동일 장소에 모든 키가 있으면 물리적 강탈이나 자연재해에 취약해진다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">콜드 -> 핫 전송 절차</h3>
        <p className="leading-7">
          이용자 출금 요청이 급증하면 핫월렛(Hot Wallet) 잔고가 부족해질 수 있다.
          이때 콜드월렛에서 핫월렛으로 자산을 보충하는 절차가 필요하다.
          <br />
          이 전송은 임의로 실행할 수 없으며, 사전에 수립된 절차서에 따라 진행한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">단계</th>
                <th className="text-left px-3 py-2 border-b border-border">담당</th>
                <th className="text-left px-3 py-2 border-b border-border">내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">1. 전송 요청</td>
                <td className="px-3 py-1.5 border-b border-border/30">운영팀</td>
                <td className="px-3 py-1.5 border-b border-border/30">핫월렛 잔고 부족 확인 후 전송 요청서 작성</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">2. 승인</td>
                <td className="px-3 py-1.5 border-b border-border/30">책임자(CISO 등)</td>
                <td className="px-3 py-1.5 border-b border-border/30">전송 금액·사유 확인 후 승인</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">3. 다중서명</td>
                <td className="px-3 py-1.5 border-b border-border/30">키 보유자 2인+</td>
                <td className="px-3 py-1.5 border-b border-border/30">에어갭 환경에서 트랜잭션 서명</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">4. 전송 및 검증</td>
                <td className="px-3 py-1.5">운영팀</td>
                <td className="px-3 py-1.5">온체인 컨펌 확인 + 내부 로그 기록</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          전송 후에는 콜드월렛 비율을 재확인하여 80% 미만으로 떨어지지 않았는지 점검한다.
          <br />
          비율이 미달되면 추가 전송을 중지하고, 이용자 출금에 대해 일시적 제한을 걸 수 있다.
          <br />
          모든 전송 기록(요청서, 승인 이력, 트랜잭션 해시)은 5년간 보관한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">예외: 금융위 별도 지정 비율</h3>
        <p className="leading-7">
          특수한 상황에서는 금융위원회가 80%와 다른 비율을 지정할 수 있다.
          <br />
          해킹으로 대량 유출이 발생하거나, 임직원 횡령이 확인되거나, 사업 폐지 절차에 돌입한 경우 등이 해당한다.
          <br />
          이때 금융위는 이용자 자산 보호를 위해 "전량 콜드월렛 보관" 또는 "출금 전면 중지" 같은 더 강력한 조치를 명할 수 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">핫월렛 운영 원칙</h3>
        <p className="leading-7">
          콜드월렛이 전체의 80% 이상이므로, 핫월렛은 최대 20%까지만 보관할 수 있다.
          <br />
          핫월렛은 즉시 출금을 처리하기 위해 필요하지만, 온라인 상태이므로 상시 공격 표면(attack surface)이 된다.
          <br />
          핫월렛 운영 시 적용하는 원칙은 다음과 같다.
        </p>

        <p className="leading-7">
          <strong>일일 출금 한도 설정</strong> -- 핫월렛에서 하루에 출금할 수 있는 최대 금액을 정해둔다.
          비정상적 대량 출금이 발생하면 한도에서 차단되어, 해킹 시 피해를 제한할 수 있다.
          <br />
          <strong>긴급 차단(Kill Switch)</strong> -- 이상 징후 감지 시 핫월렛의 모든 전송을 즉시 중지하는 메커니즘이다.
          자동 탐지 시스템 또는 수동 트리거로 발동하며, 차단 후 원인 조사가 완료되기 전까지 재개하지 않는다.
          <br />
          <strong>잔고 최소화</strong> -- 핫월렛에는 당일 예상 출금량의 1.5~2배 정도만 유지한다.
          남는 금액은 주기적으로(예: 매 4시간) 콜드월렛으로 회수(sweep)한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 핫/콜드 비율과 보험의 관계</strong><br />
          법 제8조의 손해배상 준비금(보험 또는 적립금) 산정 기준은 "콜드월렛 보관분을 제외한 나머지"를 기준으로 한다.
          <br />
          즉, 핫월렛 비율이 높을수록 보험료 또는 적립금 부담이 커진다.
          <br />
          80% 콜드월렛 규정을 넘어서 더 많이 콜드 보관할수록 보험 비용이 줄어드는 경제적 인센티브가 내장된 구조다.
        </p>

      </div>
    </section>
  );
}
