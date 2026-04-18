import IncidentResponseViz from './viz/IncidentResponseViz';
import IncidentStagesViz from './viz/IncidentStagesViz';
import BackupRecoveryViz from './viz/BackupRecoveryViz';

export default function IncidentResponse() {
  return (
    <section id="incident-response" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">사고 대응과 백업/복구</h2>
      <IncidentResponseViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-4">침해사고 대응 4단계</h3>
        <p className="leading-7">
          침해사고(security incident)란 시스템의 기밀성, 무결성, 가용성이 손상되거나 손상될 위험이 있는 사건을 뜻한다.
          <br />
          VASP에서의 침해사고는 곧 이용자 자산 유출로 직결될 수 있으므로, 체계적인 대응 프로세스가 필수다.
        </p>
        <p className="leading-7">
          <strong>1단계 -- 탐지(Detection)</strong>: 이상 징후를 식별하는 단계다.
          IDS/IPS(침입탐지/방지시스템), 로그 모니터링, FDS(이상거래탐지시스템), 직원 신고 등 다양한 경로로 탐지한다.
          자동화 탐지 규칙과 수동 점검을 병행하여 탐지 사각지대를 최소화한다.
          <br />
          <strong>2단계 -- 초동대응(Containment)</strong>: 피해 확산을 막기 위해 침해 범위를 격리한다.
          해당 서버의 네트워크를 차단하고, 관련 계정을 잠금 처리하며, 핫월렛 출금을 일시 정지한다.
          이 단계의 핵심은 속도다 -- 격리가 늦어질수록 피해 규모가 기하급수적으로 증가한다.
          <br />
          <strong>3단계 -- 분석(Analysis)</strong>: 원인을 규명하는 단계다.
          침해 경로(attack vector), 영향 범위, 유출된 데이터 종류와 규모를 파악한다.
          포렌식(digital forensics) 전문 인력이 디스크 이미지, 메모리 덤프, 네트워크 패킷 로그를 분석한다.
          <br />
          <strong>4단계 -- 복구 및 재발방지(Recovery & Prevention)</strong>: 시스템을 정상 상태로 복원하고,
          동일한 공격이 재발하지 않도록 보안 체계를 보강한다.
          취약점 패치, 접근 정책 강화, 모니터링 규칙 추가, 전 직원 대상 보안 교육을 실시한다.
        </p>

        <IncidentStagesViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">내부 금융사고 대응</h3>
        <p className="leading-7">
          내부 금융사고는 내부자의 횡령, 비인가 출금, 시스템 오류로 인한 이중 출금 등을 포함한다.
          <br />
          사고 인지 즉시 해당 지갑의 출금 기능을 정지한다.
          핫월렛 서명 서버의 네트워크를 차단하거나, 서명 승인 큐를 동결하는 방식으로 추가 유출을 방지한다.
        </p>
        <p className="leading-7">
          인지 후 1시간 이내에 CCO(Chief Compliance Officer, 준법감시인)와 CISO(Chief Information Security Officer, 정보보호최고책임자)에게 보고한다.
          <br />
          보고를 받은 CCO는 SAR(Suspicious Activity Report, 의심활동보고서) 작성 여부를 판단하고,
          FIU(Financial Intelligence Unit, 금융정보분석원)에 보고가 필요하면 지체 없이 제출한다.
        </p>
        <p className="leading-7">
          내부감사팀이 사고 경위를 조사하며, 블록체인 분석업체와 협력하여 유출 자금의 이동 경로를 추적한다.
          <br />
          온체인 분석 도구로 자금이 흘러간 주소의 클러스터를 식별하고,
          해당 주소가 다른 거래소에 입금되면 동결 요청을 보낸다.
          <br />
          수사기관 공조가 필요한 경우 포렌식 보고서와 온체인 증거를 함께 제출한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">외부 금융사고 대응</h3>
        <p className="leading-7">
          외부 금융사고는 이용자 계정 탈취, 피싱을 통한 비인가 출금, 해킹 등 외부 공격에 의한 사고를 뜻한다.
          <br />
          FDS가 비정상 패턴(평소와 다른 IP, 단시간 대량 출금, 새벽 시간대 활동 등)을 감지하면 해당 거래를 자동 보류한다.
        </p>
        <p className="leading-7">
          보류 후 해당 이용자 계정을 즉시 정지하고, 등록된 연락처로 본인 확인을 시도한다.
          <br />
          본인이 아닌 것으로 확인되면 SAR을 작성하고, 수사기관에 피해 사실을 통보한다.
          <br />
          피해 고객 보호를 위해 보험 적용 여부를 확인하고, 보상 절차를 안내한다.
          <br />
          공격에 사용된 IP, 디바이스 핑거프린트, 악성코드 샘플 등을 수사기관과 공유하여 수사를 지원한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">재발방지 제도화</h3>
        <p className="leading-7">
          사고 후 일회성 조치로 끝내지 않고, 재발방지를 제도 수준에서 정착시켜야 한다.
        </p>
        <p className="leading-7">
          <strong>내부자 모니터링 강화</strong>: 임직원의 비정상 시스템 접근, 업무 외 시간 로그인, 대량 데이터 조회 패턴을
          상시 감시하는 UBA(User Behavior Analytics, 사용자 행위 분석) 체계를 도입한다.
          <br />
          <strong>핫월렛 자동 한도 조정</strong>: 이상 징후 감지 시 핫월렛 출금 한도를 자동으로 하향 조정하는 로직을 구현한다.
          평시 한도의 50%로 자동 축소하고, 보안팀 확인 후에만 원래 수준으로 복원한다.
          <br />
          <strong>AI 기반 FDS 고도화</strong>: 규칙 기반 탐지만으로는 새로운 유형의 공격을 놓칠 수 있다.
          머신러닝 모델을 FDS에 통합하여 이용자별 정상 행동 프로파일을 학습하고, 일탈 패턴을 실시간으로 탐지한다.
          <br />
          <strong>Mixer 블랙리스트</strong>: 자금세탁에 사용되는 Mixer(믹서, 자금 혼합 서비스) 주소를 블랙리스트로 관리한다.
          블랙리스트에 등록된 주소로의 출금은 자동 차단하고, 해당 주소에서 유입된 자금은 추가 심사를 거친다.
        </p>

        <BackupRecoveryViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">백업 정책</h3>
        <p className="leading-7">
          데이터 유실에 대비한 백업은 세 가지 대상으로 구분하여 관리한다.
        </p>
        <p className="leading-7">
          <strong>데이터베이스 백업</strong>: 매일 자동으로 전체 백업(full backup)을 수행하고, AWS S3 등 오브젝트 스토리지에 저장한다.
          최소 30일분을 보관하여 특정 시점으로의 복원(Point-in-Time Recovery)이 가능하도록 한다.
          <br />
          <strong>서버 설정 백업</strong>: 분기별로 서버 OS 설정, 애플리케이션 구성 파일, 방화벽 규칙, 인증서 등을 수동으로 백업한다.
          이 백업본은 물리적 금고에 보관하며, 재해 시 서버 재구축의 기준이 된다.
          <br />
          <strong>로그 백업</strong>: 시스템 로그, 접근 로그, 거래 로그를 매일 증분 백업(incremental backup)하여
          S3 또는 Glacier(장기 아카이브 스토리지)에 저장한다. 최소 6개월 보관하며,
          규제 요건에 따라 5년까지 연장하는 경우도 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">백업 절차 상세</h3>
        <p className="leading-7">
          백업 과정은 정해진 순서를 따른다.
          <br />
          먼저 NTP(Network Time Protocol, 네트워크 시간 프로토콜)로 모든 서버의 시간을 동기화한다.
          시간이 어긋나면 백업 파일의 타임스탬프가 불일치하여 복원 시점 판단에 혼란이 생긴다.
        </p>
        <p className="leading-7">
          최초에 전체 백업(full backup)을 1회 수행한 후, 이후부터는 크론(cron) 스케줄러로 증분 백업을 자동 실행한다.
          증분 백업은 이전 백업 이후 변경된 데이터만 저장하므로 저장 공간과 네트워크 대역폭을 절약한다.
          <br />
          백업 데이터 중 개인정보가 포함된 부분은 AES-256으로 암호화한 후 저장한다.
          암호화 키는 백업 데이터와 별도 위치에 보관하여, 백업 스토리지가 유출되더라도 복호화가 불가능하게 한다.
        </p>
        <p className="leading-7">
          소산백업(off-site backup)도 시행한다. 주 백업과 물리적으로 다른 지역(다른 IDC 또는 다른 AWS 리전)에
          동일한 백업본을 추가 보관한다.
          <br />
          이는 화재, 지진, 홍수 등 재해로 주 백업이 소실되는 최악의 시나리오에 대비하기 위함이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">복구 절차</h3>
        <p className="leading-7">
          복구는 대상에 따라 절차가 다르다.
        </p>
        <p className="leading-7">
          <strong>DB 복구</strong>: S3에서 해당 시점의 덤프 파일을 다운로드하고, 스테이징 환경에서 먼저 복원하여 데이터 무결성을 검증한다.
          검증이 완료되면 프로덕션 DB에 적용한다.
          복원 후에는 온체인 잔고와 DB 기록의 정합성을 재확인하여 불일치 항목이 없는지 점검한다.
          <br />
          <strong>시스템 복구</strong>: 서버 OS 전체를 복원해야 하는 경우 Clonezilla 등 디스크 이미징 도구로 사전에 만들어 둔
          시스템 이미지를 사용한다. 이미지에는 OS, 미들웨어, 기본 설정이 포함되어 있으므로 복원 후 애플리케이션 배포와
          시크릿 주입만 수행하면 서비스 재개가 가능하다.
        </p>
        <p className="leading-7">
          복구 후에는 RTO(Recovery Time Objective, 복구 목표 시간)와 RPO(Recovery Point Objective, 복구 목표 시점)
          달성 여부를 검토한다.
          <br />
          RTO는 서비스 중단부터 복구까지의 목표 시간이고, RPO는 복구 시점에서 허용 가능한 최대 데이터 손실량이다.
          VASP의 RTO는 통상 4시간 이내, RPO는 1시간 이내를 목표로 설정한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">취약점 점검</h3>
        <p className="leading-7">
          연 1회 이상 외부 전문기관에 의뢰하여 취약점 점검 및 모의해킹(penetration testing)을 실시한다.
          <br />
          점검 범위는 웹 애플리케이션, API, 네트워크 인프라, 모바일 앱, 스마트 컨트랙트(해당 시) 등 전 영역을 포함한다.
        </p>
        <p className="leading-7">
          점검 결과에서 발견된 취약점은 위험도에 따라 긴급(Critical), 높음(High), 중간(Medium), 낮음(Low)으로 분류한다.
          <br />
          긴급과 높음 등급은 30일 이내에 보완조치를 완료하고, 조치 결과를 보안 책임자에게 보고해야 한다.
          <br />
          보완조치 보고서에는 발견된 취약점의 상세 내용, 조치 방법, 조치 후 재점검 결과를 포함한다.
          <br />
          중간 이하 등급도 분기 내 조치를 완료하는 것을 원칙으로 하며, 잔존 위험(residual risk)이 있는 경우
          경영진에게 수용 여부를 보고하고 승인을 받는다.
        </p>
        <p className="leading-7">
          취약점 점검은 단발성 행사가 아니라 보안 개선의 순환 고리다.
          <br />
          점검 결과 기반으로 내년도 보안 투자 우선순위를 정하고, 다음 해 점검에서 이전 취약점의 재발 여부를 확인하는 방식으로
          지속적인 보안 수준 향상을 추구한다.
        </p>
      </div>
    </section>
  );
}
