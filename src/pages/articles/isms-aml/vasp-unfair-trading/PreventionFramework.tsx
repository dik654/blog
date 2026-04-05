export default function PreventionFramework() {
  return (
    <section id="prevention-framework" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">예방 체계와 준법감시</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-4">준법감시인의 역할</h3>
        <p className="leading-7">
          가상자산이용자보호법은 VASP에 준법감시인(Compliance Officer) 선임을 의무화한다.
          <br />
          준법감시인은 불공정거래 예방과 탐지의 최전선에 있는 핵심 직책이다.
          <br />
          구체적인 역할은 다음과 같다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">역할</th>
                <th className="text-left px-3 py-2 border-b border-border">내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">정책 수립</td>
                <td className="px-3 py-1.5 border-b border-border/30">불공정거래 방지 내부규정, 임직원 거래 제한 규정, 정보 관리 규정 수립</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">위반 조사</td>
                <td className="px-3 py-1.5 border-b border-border/30">내부 제보, 감시 시스템 알림, 외부 신고 접수 시 사실 확인 및 조사</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">이사회 보고</td>
                <td className="px-3 py-1.5 border-b border-border/30">불공정거래 위험 평가, 위반 사례, 제도 개선 사항을 정기적으로 보고</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">감사위 협력</td>
                <td className="px-3 py-1.5 border-b border-border/30">내부감사 부서와 공동으로 준법 점검, 감사 결과 후속 조치 이행 확인</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">감독기관 대응</td>
                <td className="px-3 py-1.5">금융위·금감원의 검사, 자료 요청, 조사에 대한 창구 역할</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          준법감시인은 경영진으로부터 독립적 지위를 보장받아야 한다.
          <br />
          준법감시인이 경영진의 눈치를 보면서 위반 사실을 덮거나 축소하면, 예방 체계 전체가 무력화된다.
          <br />
          이 때문에 법률은 준법감시인의 해임에 대한 보호 장치를 두고 있으며,
          준법감시인이 이사회에 직접 보고할 수 있는 경로를 보장한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">내부 감시 시스템</h3>
        <p className="leading-7">
          불공정거래를 사전에 탐지하려면 자동화된 감시 시스템이 필수다.
          <br />
          수작업 모니터링으로는 24시간 거래되는 수천 종의 가상자산을 감시할 수 없다.
        </p>

        <p className="leading-7">
          <strong>임직원 거래 모니터링</strong> -- 전 임직원의 가상자산 거래 내역을 실시간 또는 일일 기준으로 수집·분석한다.
          임직원이 사전 승인 없이 거래했거나, 미공개정보 공개 전후로 거래가 집중되면 알림이 발생한다.
          <br />
          <strong>비정상 패턴 감지</strong> -- 시세조종 유형별 패턴을 규칙(rule-based)과 통계 모델로 탐지한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">탐지 대상</th>
                <th className="text-left px-3 py-2 border-b border-border">탐지 규칙</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">스푸핑</td>
                <td className="px-3 py-1.5 border-b border-border/30">주문 생존 시간 < N초 + 취소율 > M% + 대량 주문</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">워시 트레이딩</td>
                <td className="px-3 py-1.5 border-b border-border/30">동일 IP/기기 지문에서 매수·매도 동시 발생</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">통정 매매</td>
                <td className="px-3 py-1.5 border-b border-border/30">특정 계정 쌍의 반복적 대칭 거래, 시간·가격 일치도 분석</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">펌프 앤 덤프</td>
                <td className="px-3 py-1.5">단기 급등(X분 내 Y% 이상) + SNS 언급량 급증 + 특정 계정의 대량 매도</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          규칙 기반 탐지의 한계를 보완하기 위해 머신러닝 모델을 병행하는 거래소가 늘고 있다.
          <br />
          과거 시세조종 사례의 거래 패턴을 학습시켜, 새로운 변종 수법도 탐지할 수 있도록 한다.
          <br />
          다만 오탐(false positive)이 많으면 조사 인력의 부담이 커지므로, 모델의 정밀도 관리가 중요하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">교육: 전 임직원 필수</h3>
        <p className="leading-7">
          불공정거래 방지 교육은 연 1회 이상 전 임직원에게 실시해야 한다.
          <br />
          신규 입사자는 입사 후 일정 기간 내(통상 1개월)에 별도 교육을 이수해야 한다.
          <br />
          교육 내용은 다음을 포함한다.
        </p>

        <p className="leading-7">
          <strong>법률 교육</strong> -- 가상자산이용자보호법 제10조의 금지 행위 유형, 처벌 수준, 최신 판례 및 제재 사례.
          <br />
          <strong>내부규정 교육</strong> -- 임직원 거래 제한 규정, 미공개정보 관리 규정, 정보 차단벽 운영 규정의 구체적 절차.
          <br />
          <strong>사례 교육</strong> -- 국내외 불공정거래 적발 사례를 분석하여, 어떤 행위가 위반에 해당하는지 구체적으로 이해시킨다.
          <br />
          <strong>신고 절차 교육</strong> -- 불공정거래를 인지하거나 의심할 때 어떤 경로로 신고해야 하는지, 신고자 보호 제도가 어떻게 운영되는지 안내한다.
        </p>

        <p className="leading-7">
          교육 이수 여부는 기록으로 남기며, 미이수자에게는 추가 교육을 실시하거나 업무 제한을 둘 수 있다.
          <br />
          교육이 형식적으로 흐르면 내부 통제의 실효성이 떨어지므로, 평가(퀴즈, 사례 분석)를 포함하는 것이 바람직하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">내부 신고와 신고자 보호</h3>
        <p className="leading-7">
          불공정거래는 외부 감시 시스템보다 내부 제보로 발견되는 경우가 많다.
          <br />
          동료의 이상 행동, 업무 중 접한 부정 징후를 신속하게 보고할 수 있는 채널이 있어야 한다.
        </p>

        <p className="leading-7">
          <strong>내부 신고 채널</strong> -- 준법감시인에게 직접 보고하는 전용 채널(이메일, 핫라인, 웹 양식)을 운영한다.
          익명 신고도 가능하도록 하여 신고의 심리적 장벽을 낮춘다.
          <br />
          <strong>신고자 보호(보복 금지)</strong> -- 신고자에 대한 인사상 불이익(해고, 전보, 승진 누락)을 금지한다.
          보복 행위가 확인되면 보복을 가한 자에 대해 징계 또는 법적 조치를 취한다.
          <br />
          <strong>익명성 보장</strong> -- 신고자의 신원은 조사가 완료될 때까지(필요시 그 이후에도) 비공개한다.
          조사 과정에서 신고자가 특정될 수 있는 정보는 최소 인원에게만 공유한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 내부 신고의 효과</strong><br />
          전 세계적으로 기업 부정행위의 43%가 내부 제보로 발견된다(ACFE 보고서 기준).
          <br />
          외부 감시보다 내부 인원이 이상 행동을 더 빨리, 더 정확하게 인지하기 때문이다.
          <br />
          신고 채널의 활성화와 신고자 보호는 "비용 대비 효과"가 가장 높은 불공정거래 예방 수단이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">위반 시 조치 절차</h3>
        <p className="leading-7">
          불공정거래 위반이 확인되면 내부적으로 다음 절차를 따른다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">단계</th>
                <th className="text-left px-3 py-2 border-b border-border">내용</th>
                <th className="text-left px-3 py-2 border-b border-border">담당</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">1. 초동 조치</td>
                <td className="px-3 py-1.5 border-b border-border/30">해당 임직원의 시스템 접근 즉시 차단, 거래 동결</td>
                <td className="px-3 py-1.5 border-b border-border/30">준법감시인 / IT팀</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">2. 내부 조사</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 이력, 정보 접근 로그, 통신 기록 등 증거 수집·분석</td>
                <td className="px-3 py-1.5 border-b border-border/30">준법감시인 / 법무팀</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">3. 인사 조치</td>
                <td className="px-3 py-1.5 border-b border-border/30">경위 중대성에 따라 경고, 감봉, 정직, 해고 등 인사징계</td>
                <td className="px-3 py-1.5 border-b border-border/30">인사위원회</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">4. 외부 신고</td>
                <td className="px-3 py-1.5 border-b border-border/30">형사 범죄에 해당하면 수사기관 신고, 행정 위반이면 금감원 보고</td>
                <td className="px-3 py-1.5 border-b border-border/30">법무팀 / 경영진</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">5. 재발 방지</td>
                <td className="px-3 py-1.5">원인 분석 후 규정·시스템·교육 보완</td>
                <td className="px-3 py-1.5">준법감시인</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          초동 조치의 속도가 중요하다 -- 위반자가 증거를 인멸하거나 추가 부정행위를 할 수 있으므로,
          의심이 확인되는 즉시 시스템 접근을 차단하고 관련 데이터를 보전(forensic preservation)해야 한다.
          <br />
          내부 조사와 별개로, 형사 범죄가 의심되면 수사기관 신고를 미루지 않아야 한다.
          내부 조사 완료를 기다리다 증거가 훼손되는 것보다, 수사기관과 동시 진행하는 것이 바람직하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">금융위·금감원의 외부 감시</h3>
        <p className="leading-7">
          VASP 내부 예방 체계 외에, 정부 차원의 외부 감시 체계가 작동한다.
        </p>

        <p className="leading-7">
          <strong>금융감독원 상시 감시체계</strong> -- 금융감독원은 가상자산 시장의 거래 데이터를 수집·분석하는 상시 감시체계를 운영한다.
          주요 거래소의 거래 데이터(호가, 체결, 주문 내역)를 실시간 또는 일일 기준으로 수집하여
          비정상 거래 패턴을 탐지한다.
          <br />
          <strong>시장감시위원회</strong> -- 불공정거래 혐의가 포착되면, 시장감시위원회가 심의하여 조사 개시 여부를 결정한다.
          조사 결과 위반이 확인되면 금융위원회에 제재 조치를 건의한다.
          <br />
          <strong>금융위원회 조사·제재</strong> -- 금융위원회는 VASP에 자료 제출을 요구하고, 관계자 출석을 요청할 수 있다.
          VASP는 이에 협조할 의무가 있으며, 거부 시 과태료가 부과된다.
          조사 결과에 따라 과징금 부과, 시정 명령, 임원 해임 권고, 업무 정지, 등록 취소 등의 조치가 가능하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">예방 체계의 전체 구조</h3>
        <p className="leading-7">
          불공정거래 예방은 단일 장치가 아니라, 여러 층위가 중첩된 방어 체계로 작동한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">층위</th>
                <th className="text-left px-3 py-2 border-b border-border">수단</th>
                <th className="text-left px-3 py-2 border-b border-border">목적</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">1. 제도적 예방</td>
                <td className="px-3 py-1.5 border-b border-border/30">임직원 거래 제한, 정보 차단벽, 자기발행 거래 금지</td>
                <td className="px-3 py-1.5 border-b border-border/30">불공정거래 기회 자체를 차단</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">2. 기술적 탐지</td>
                <td className="px-3 py-1.5 border-b border-border/30">자동 감시 시스템, 규칙 기반·AI 기반 패턴 탐지</td>
                <td className="px-3 py-1.5 border-b border-border/30">발생한 불공정거래를 신속 포착</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">3. 인적 통제</td>
                <td className="px-3 py-1.5 border-b border-border/30">준법감시인, 내부 신고, 정기 교육</td>
                <td className="px-3 py-1.5 border-b border-border/30">사람이 판단해야 하는 영역 보완</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">4. 내부 제재</td>
                <td className="px-3 py-1.5 border-b border-border/30">인사징계, 해고, 손해배상 청구</td>
                <td className="px-3 py-1.5 border-b border-border/30">위반 시 불이익으로 억제 효과</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">5. 외부 제재</td>
                <td className="px-3 py-1.5">형사처벌(징역·벌금), 과징금, 업무 정지</td>
                <td className="px-3 py-1.5">최종 방어선, 사회적 제재</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          각 층위는 독립적으로 작동하면서 서로 보완한다.
          <br />
          1층이 뚫리면 2층에서 탐지하고, 2층을 우회하면 3층(내부 제보)에서 발각되는 구조다.
          <br />
          모든 층위를 동시에 무력화하는 것은 극히 어려우므로, 중첩 방어가 실효성의 핵심이다.
          <br />
          VASP는 이 5개 층위를 모두 갖추고, 정기적으로 실효성을 점검하여 형식적 준수에 그치지 않도록 해야 한다.
        </p>

        <p className="text-sm border-l-2 border-blue-500/50 pl-3 mt-4">
          <strong>{'💡'} 형식적 준수 vs 실질적 준수</strong><br />
          규정과 시스템이 존재하지만 실제로는 작동하지 않는 상태를 "형식적 준수(paper compliance)"라 한다.
          <br />
          교육은 하지만 아무도 내용을 기억하지 못하고, 감시 시스템은 있지만 알림을 무시하고, 신고 채널은 있지만 아무도 사용하지 않는 상태다.
          <br />
          실질적 준수를 위해서는 경영진의 의지(tone at the top)가 가장 중요하다.
          경영진이 불공정거래에 무관심하면, 아무리 좋은 제도도 형식에 그친다.
        </p>

      </div>
    </section>
  );
}
