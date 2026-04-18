import AiFdsViz from './viz/AiFdsViz';
import AiScoringViz from './viz/AiScoringViz';
import ModelGovernanceViz from './viz/ModelGovernanceViz';

export default function AiFds() {
  return (
    <section id="ai-fds" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AI 기반 FDS 고도화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          규칙 기반 FDS는 "알려진 수법"만 잡을 수 있다.<br />
          규칙을 정의하지 않은 새로운 패턴은 탐지하지 못하고,
          규칙 수가 늘어날수록 규칙 간 충돌과 오탐(False Positive)이 급증한다.<br />
          이 한계를 돌파하기 위해 AI 기반 FDS가 도입되고 있다.
        </p>

        <AiFdsViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">규칙 기반의 구조적 한계</h3>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">한계</th>
                <th className="text-left px-3 py-2 border-b border-border">원인</th>
                <th className="text-left px-3 py-2 border-b border-border">결과</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">새 수법 미탐지</td>
                <td className="px-3 py-1.5 border-b border-border/30">미리 정의하지 않은 패턴은 규칙에 존재하지 않음</td>
                <td className="px-3 py-1.5 border-b border-border/30">미탐(False Negative) 증가 — 실제 세탁 거래 놓침</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">높은 오탐률</td>
                <td className="px-3 py-1.5 border-b border-border/30">임계값 기반이라 정상 대량 거래도 경보 유발</td>
                <td className="px-3 py-1.5 border-b border-border/30">AML 담당자의 분석 시간 낭비, "경보 피로" 발생</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">규칙 폭증</td>
                <td className="px-3 py-1.5 border-b border-border/30">새 유형 대응 시마다 규칙 추가 → 수백~수천 개로 증가</td>
                <td className="px-3 py-1.5 border-b border-border/30">규칙 간 충돌, 유지보수 비용 급증, 성능 저하</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">적응형 회피</td>
                <td className="px-3 py-1.5">세탁 조직이 규칙의 임계값을 파악 후 우회</td>
                <td className="px-3 py-1.5">규칙 공개/유출 시 전체 탐지 체계가 무력화</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          특히 "적응형 회피"가 규칙 기반의 가장 치명적인 약점.<br />
          세탁 조직은 소액 테스트 거래를 통해 거래소의 규칙 임계값을 역추정한다.<br />
          예: 999만 원(1천만 원 바로 아래)이 경보를 트리거하는지 확인한 후 금액을 조정.<br />
          AI 모델은 고정된 임계값이 아니라 맥락(context)을 종합 판단하므로 이러한 회피에 강하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">머신러닝 모델 — 이상치 탐지</h3>
        <p>
          AI 기반 FDS의 핵심은 이상치 탐지(Anomaly Detection).<br />
          "정상 거래의 분포"를 학습한 뒤, 그 분포에서 크게 벗어나는 거래를 이상으로 분류한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">모델</th>
                <th className="text-left px-3 py-2 border-b border-border">원리</th>
                <th className="text-left px-3 py-2 border-b border-border">FDS 적용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">Isolation Forest</td>
                <td className="px-3 py-1.5 border-b border-border/30">랜덤 분할로 데이터를 격리 — 이상치는 적은 분할로 격리됨</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 금액·빈도·시간 등 수치형 특성에서 이상 패턴 탐지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">Autoencoder</td>
                <td className="px-3 py-1.5 border-b border-border/30">입력을 압축 후 복원 — 정상 데이터는 잘 복원, 이상 데이터는 복원 오류 큼</td>
                <td className="px-3 py-1.5 border-b border-border/30">복합 특성(거래+행동+네트워크)의 비선형 패턴 탐지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">XGBoost / LightGBM</td>
                <td className="px-3 py-1.5 border-b border-border/30">의사결정 트리 앙상블 — 특성(feature) 중요도를 자동 학습</td>
                <td className="px-3 py-1.5 border-b border-border/30">과거 STR 데이터로 지도 학습, 의심 확률 산출</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">GNN(Graph Neural Network)</td>
                <td className="px-3 py-1.5">그래프 구조에서 노드/엣지의 특성을 학습</td>
                <td className="px-3 py-1.5">거래 네트워크에서 의심 커뮤니티(지갑 군집) 탐지</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Isolation Forest와 Autoencoder는 비지도 학습(Unsupervised) — 라벨(정상/의심)이 없어도 학습 가능.<br />
          이상 거래는 전체 거래의 극소수(0.01% 미만)이므로 라벨 데이터가 부족한 환경에서 비지도 모델이 유리하다.<br />
          XGBoost/LightGBM은 지도 학습(Supervised) — 과거 확정된 STR 건을 학습 데이터로 사용하여 정밀도를 높인다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">그래프 분석 — 네트워크 기반 탐지</h3>
        <p>
          개별 거래 분석만으로는 한계가 있다 — 세탁은 본질적으로 "네트워크" 행위이기 때문.<br />
          하나의 세탁 조직은 수십~수백 개의 주소를 동시에 운영하며, 이들 간의 자금 흐름이 특정 패턴을 형성한다.
        </p>
        <p>
          GNN(Graph Neural Network)은 거래 그래프에서 이러한 구조적 패턴을 학습한다.<br />
          각 노드(주소)의 로컬 특성(거래량, 빈도, 잔액)과 이웃 노드와의 관계(거래 방향, 금액 비율)를 함께 학습하여
          개별 분석으로는 발견하기 어려운 "의심 커뮤니티"를 식별한다.
        </p>
        <p>
          예: 10개의 주소가 각각 독립적으로 보면 정상이지만, 이들 간의 순환 거래 패턴(A→B→C→...→A)이 감지되면
          세탁을 위한 자금 순환(Round-tripping) 의심으로 분류된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실시간 스코어링</h3>
        <p>
          AI 모델의 추론 결과는 실시간 위험 점수(Risk Score)로 변환되어 각 거래에 부여된다.<br />
          스코어링 파이프라인의 구조:
        </p>
        <ul>
          <li><strong>특성 추출(Feature Extraction)</strong> — 거래 데이터에서 수백 개의 특성을 실시간 계산. 거래 금액, 빈도, 시간대, 상대방 위험도, 누적 패턴 등</li>
          <li><strong>모델 추론(Inference)</strong> — 추출된 특성을 학습된 모델에 입력하여 위험 확률 산출. 지연시간(latency) 100ms 이내가 목표</li>
          <li><strong>점수 매핑(Score Mapping)</strong> — 확률값을 0~100 점수로 변환. 70점 이상 "높음", 40~69 "중간", 39 이하 "낮음" (임계값은 거래소별 상이)</li>
          <li><strong>경보 연동</strong> — 점수에 따라 FDS 경보 자동 생성, 심각도별 담당자 자동 배정</li>
        </ul>

        <p>
          국내 주요 거래소들의 AI FDS는 모든 입출금 시도를 실시간으로 검사하며,
          특정 조건이 아닌 "패턴"을 분석하여 새로운 유형의 이상 거래를 탐지한다.<br />
          이를 통해 누적 수천억 원 규모의 가상자산 관련 범죄를 차단한 실적이 보고되고 있다.
        </p>

        <AiScoringViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">블랙리스트 자동 갱신</h3>
        <p>
          FDS의 효과는 블랙리스트의 최신성에 직결된다.<br />
          갱신 대상:
        </p>
        <ul>
          <li><strong>OFAC SDN 리스트</strong> — 미 재무부가 지정하는 제재 대상 주소. 수시 갱신되며 거래소는 즉시 반영해야 함</li>
          <li><strong>FATF 고위험국 목록</strong> — 자금세탁 방지 체계가 미흡한 국가 목록. 해당 국가 연관 거래에 EDD 적용</li>
          <li><strong>분석 업체 위협 인텔리전스</strong> — 블록체인 분석 도구가 식별한 새로운 믹서 주소, 스캠 주소, 해킹 피해 주소 등</li>
          <li><strong>내부 블랙리스트</strong> — 자체 조사에서 확인된 의심 주소, 타 VASP에서 공유받은 위험 주소</li>
        </ul>
        <p>
          갱신 주기가 느리면 새로 등재된 제재 주소와의 거래를 놓칠 수 있다.<br />
          최선의 관행은 실시간 API 연동 — 블랙리스트 변경 즉시 FDS에 반영되는 구조.<br />
          최소 기준으로는 일 1회 갱신을 권고하지만, OFAC 갱신은 예고 없이 수시로 이루어지므로 실시간이 이상적.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">모델 검증과 거버넌스</h3>
        <p>
          AI 모델은 배포 후에도 지속적으로 성능을 모니터링하고 검증해야 한다.<br />
          금융 규제 관점에서 모델의 "설명 가능성(Explainability)"이 핵심 요구사항.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">검증 항목</th>
                <th className="text-left px-3 py-2 border-b border-border">내용</th>
                <th className="text-left px-3 py-2 border-b border-border">주기</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">성능 지표 점검</td>
                <td className="px-3 py-1.5 border-b border-border/30">정밀도(Precision), 재현율(Recall), F1-Score, 오탐률 추이</td>
                <td className="px-3 py-1.5 border-b border-border/30">월 1회</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">데이터 드리프트 감지</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 패턴 변화로 모델의 학습 데이터 분포와 현실 괴리 확인</td>
                <td className="px-3 py-1.5 border-b border-border/30">월 1회</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">설명 가능성 테스트</td>
                <td className="px-3 py-1.5 border-b border-border/30">SHAP/LIME으로 개별 예측의 주요 근거 확인 가능 여부 검증</td>
                <td className="px-3 py-1.5 border-b border-border/30">분기 1회</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">편향 검사</td>
                <td className="px-3 py-1.5 border-b border-border/30">특정 고객군(국적, 거래규모 등)에 편향된 탐지가 없는지 확인</td>
                <td className="px-3 py-1.5 border-b border-border/30">반기 1회</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">모델 재학습</td>
                <td className="px-3 py-1.5">새로운 STR 데이터, 변경된 세탁 수법 반영하여 모델 업데이트</td>
                <td className="px-3 py-1.5">연 1회 이상</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          "왜 이 거래가 의심스러운지" 설명할 수 없는 모델은 규제 검사에서 적정성을 인정받기 어렵다.<br />
          XAI(Explainable AI) 기법 — SHAP(SHapley Additive exPlanations)은 각 특성이 예측에 기여한 정도를 수치로 보여주고,
          LIME(Local Interpretable Model-agnostic Explanations)은 개별 예측 주변의 로컬 근사 모델을 생성하여 판단 근거를 설명한다.
        </p>

        <p>
          모델 거버넌스의 원칙: "사람이 최종 판단하고, AI는 판단의 근거를 제공한다."<br />
          AI가 경보를 발생시키면 AML 담당자가 근거를 확인하고, 준법감시인이 최종 의사결정한다.<br />
          AI가 자동으로 계정을 정지하는 것은 오탐 시 이용자 피해를 초래하므로 신중해야 한다 —
          다만 OFAC 제재 주소와의 직접 거래처럼 명백한 경우에는 자동 차단이 허용된다.
        </p>

        <ModelGovernanceViz />

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} AI FDS의 다음 단계 — 블록체인 인텔리전스 에이전트</strong><br />
          2026년 현재 블록체인 분석 업계에서 가장 주목받는 기술은 AI 에이전트.<br />
          수백만 건의 과거 조사 데이터로 학습된 에이전트가 자연어 질의에 응답하고,
          자동으로 거래 경로를 추적하며, 의심 패턴을 사전 식별한다.<br />
          결정론적 모드(규제 검증용)와 탐색적 모드(새 위협 발견용)를 구분하여 운영한다.
        </p>

        <p className="text-sm border-l-2 border-blue-500/50 pl-3 mt-4">
          <strong>{'💡'} 기술과 조직의 균형</strong><br />
          아무리 정교한 AI FDS를 갖춰도 경보를 분석하는 사람의 역량이 부족하면 오탐만 쌓인다.<br />
          반대로 사람이 아무리 유능해도 시스템 없이는 24시간 거래량을 감당할 수 없다.<br />
          기술(FDS/AI)과 인적 역량(교육/조직)의 균형이 AML 체계의 성숙도를 결정한다.<br />
          연 1회 이상 전사 교육, AML 담당자 반기 1회 심화 교육, 모의 시뮬레이션 훈련이 필수.
        </p>

      </div>
    </section>
  );
}
