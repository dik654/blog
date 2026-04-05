export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">백업 전략 설계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-4">ISMS 2.12 요구사항</h3>
        <p className="leading-7">
          ISMS-P 인증 기준 2.12는 "재해복구"를 다룬다.
          <br />
          핵심 요구는 세 가지다 -- 중요 정보와 시스템에 대한 백업 정책을 수립할 것, 백업 데이터의 안전한 보관과 복구 절차를 마련할 것, 정기적으로 복구 테스트를 수행할 것.
          <br />
          백업은 단순히 "데이터를 복사해 두는 행위"가 아니라, 조직의 업무 연속성(Business Continuity)을 보장하는 전략적 활동이다.
        </p>
        <p className="leading-7">
          백업 정책이 없으면 랜섬웨어 감염, 하드웨어 장애, 자연재해, 운영자 실수 등 단 한 번의 사고로 전체 데이터를 영구 손실할 수 있다.
          <br />
          특히 가상자산 사업자는 이용자의 거래 기록과 자산 정보를 보관해야 할 법적 의무가 있으므로, 데이터 손실은 곧 규제 위반으로 이어진다.
          <br />
          백업 정책은 "무엇을, 얼마나 자주, 어디에, 얼마나 오래" 보관할 것인지를 명확히 정의해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">백업 대상 3분류</h3>
        <p className="leading-7">
          백업 대상은 크게 정보자원, 구성정보, 로그정보 세 가지로 분류한다.
          <br />
          정보자원은 실제 업무 데이터를 담고 있는 자산으로, 서버의 데이터베이스, 애플리케이션 바이너리, 방화벽/IDS 설정과 로그가 포함된다.
          이 중 DB는 손실 시 복구 불가능한 핵심 자산이므로 가장 높은 빈도로 백업한다.
        </p>
        <p className="leading-7">
          구성정보는 시스템을 현재 상태로 재구성하기 위해 필요한 설정값 일체를 말한다.
          <br />
          OS 계정 목록, 네트워크 설정(/etc/network), 서비스 설정 파일(/etc/nginx, /etc/mysql), 방화벽 룰셋, 크론탭(crontab) 스케줄이 해당한다.
          구성정보가 없으면 하드웨어를 교체하더라도 서비스를 동일하게 복원할 수 없다.
        </p>
        <p className="leading-7">
          로그정보는 시스템 접속 기록, 변경 이력, 관리자 행위 로그를 포함한다.
          <br />
          로그는 침해사고 발생 시 타임라인을 재구성하는 핵심 증거이자, 내부 감사와 외부 심사에서 요구하는 필수 기록이다.
          로그가 유실되면 사고 원인 분석이 불가능해지고, ISMS 인증 심사에서 중대 결함으로 판정될 수 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">RTO와 RPO</h3>
        <p className="leading-7">
          RTO(Recovery Time Objective, 복구 시간 목표)는 사고 발생 후 서비스를 복구하기까지 허용되는 최대 시간이다.
          <br />
          예를 들어 RTO가 4시간이면, 사고 발생 후 4시간 이내에 정상 서비스가 재개되어야 한다.
          RTO가 짧을수록 고가용성(High Availability) 인프라가 필요하므로 비용이 증가한다.
        </p>
        <p className="leading-7">
          RPO(Recovery Point Objective, 복구 시점 목표)는 데이터 손실을 허용하는 최대 시간 범위다.
          <br />
          RPO가 1시간이면, 최대 1시간 분량의 데이터 손실까지만 허용한다는 뜻이다.
          RPO가 0에 가까울수록 실시간 복제(real-time replication)가 필요하여 인프라 비용이 급증한다.
          <br />
          RTO와 RPO는 업무 영향 분석(BIA, Business Impact Analysis)을 통해 서비스별로 차등 설정한다.
          핵심 거래 시스템은 RTO 1시간/RPO 15분, 내부 관리 시스템은 RTO 24시간/RPO 4시간처럼 중요도에 따라 다르게 적용한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">3-2-1 규칙</h3>
        <p className="leading-7">
          3-2-1 규칙은 백업 전략의 기본 원칙으로, 업계에서 가장 널리 통용된다.
          <br />
          3개의 데이터 복사본을 유지한다 -- 원본 1개와 백업 2개.
          2가지 이상의 서로 다른 저장 매체에 보관한다 -- 예를 들어 클라우드 스토리지와 외장 하드디스크.
          1개 이상의 복사본을 물리적으로 떨어진 장소(오프사이트, off-site)에 보관한다.
        </p>
        <p className="leading-7">
          같은 건물에 모든 백업을 두면 화재, 침수, 지진 같은 물리적 재해에 원본과 백업이 동시에 파괴될 수 있다.
          <br />
          오프사이트 보관은 이 위험을 해소하기 위한 최소한의 조치다.
          클라우드 리전(region)을 다르게 설정하거나, 물리적으로 다른 도시의 데이터센터에 복사본을 두는 방식으로 구현한다.
          <br />
          3-2-1 규칙을 충족하면 단일 장애점(single point of failure)으로 인한 전체 데이터 손실 가능성이 극히 낮아진다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">백업 유형</h3>
        <p className="leading-7">
          전체백업(Full Backup)은 대상 데이터 전체를 매번 복사하는 방식이다.
          복원이 단순하고 빠르지만, 데이터 양이 크면 백업 시간과 저장 공간이 많이 소요된다.
        </p>
        <p className="leading-7">
          증분백업(Incremental Backup)은 마지막 백업(전체 또는 증분) 이후 변경된 데이터만 복사한다.
          <br />
          백업 속도가 빠르고 저장 공간도 적게 쓰지만, 복원 시 전체백업 + 모든 증분백업을 순서대로 적용해야 하므로 복원 과정이 복잡하다.
          증분 체인(chain)이 길어지면 중간 하나가 손상되었을 때 이후 전체를 복원할 수 없는 위험이 있다.
        </p>
        <p className="leading-7">
          차등백업(Differential Backup)은 마지막 전체백업 이후 변경된 모든 데이터를 복사한다.
          <br />
          증분백업보다 저장 공간을 더 사용하지만, 복원 시 전체백업 + 최신 차등백업 하나만 있으면 되므로 복원이 단순하다.
          <br />
          일반적으로 주 1회 전체백업 + 매일 증분백업(또는 차등백업) 조합이 공간 효율과 복원 편의의 균형점으로 채택된다.
        </p>
      </div>
    </section>
  );
}
