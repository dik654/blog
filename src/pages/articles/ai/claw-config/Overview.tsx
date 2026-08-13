const sources = [
  ["기본값", "프로그램이 동작할 수 있는 안전한 출발점"],
  ["사용자 설정", "계정 또는 장비 전반에 적용할 선택"],
  ["프로젝트 설정", "저장소와 함께 공유할 팀 규칙"],
  ["환경 변수", "배포 환경과 secret manager에서 주입할 값"],
  ["CLI 인자", "이번 실행에만 적용할 명시적 override"],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        설정은 여러 출처를 합치되 출처를 잃지 않아야 한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CLI 에이전트의 설정은 한 파일에서 끝나지 않습니다. 프로그램 기본값,
          사용자 설정, 프로젝트 설정, 환경 변수와 실행 인자가 같은 항목을 서로
          다르게 지정할 수 있습니다. Config loader의 역할은 값을 읽는 데 그치지
          않고, 우선순위를 일관되게 적용하고 최종 값이 어디에서 왔는지 설명하는
          것입니다.
        </p>
        <p>
          아래 순서는 분석한 구현을 이해하기 위한 일반적인 cascade이며, 실제
          항목별 예외는 코드에서 확인해야 합니다. 특히 권한을 넓히는 설정과 인증
          정보는 단순한 “마지막 값 우선”만으로 처리하지 않는 편이 안전합니다.
        </p>
      </div>

      <div className="not-prose my-6 grid gap-3 lg:grid-cols-5">
        {sources.map(([source, description], index) => (
          <div key={source} className="rounded-xl border bg-card p-4">
            <span className="text-xs text-muted-foreground">
              우선순위 {index + 1}
            </span>
            <strong className="mt-1 block text-sm">{source}</strong>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          병합과 검증은 별도 단계다
        </h3>
        <p>
          각 출처를 파싱한 뒤에는 필드 단위로 값을 합치고, 최종
          <code>AppConfig</code>를 만든 다음 교차 필드 제약을 검증해야 합니다.
          예를 들어 원격 공급자를 선택했는데 인증 정보가 없거나, read-only
          모드와 쓰기 전용 기능을 함께 켠 경우는 개별 필드의 타입만으로 발견하기
          어렵습니다. 오류 메시지에는 잘못된 값뿐 아니라 어느 설정 파일이나 환경
          변수에서 왔는지도 보여줘야 수정하기 쉽습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Secret과 일반 설정은 저장 경로가 다르다
        </h3>
        <p>
          API key나 OAuth token을 프로젝트 설정에 저장하면 저장소와 로그를 통해
          노출될 수 있습니다. 일반 옵션은 파일에 두더라도 secret은 OS keychain,
          환경 변수, 전용 secret store로 분리하고, 진단 출력에서는 값을
          마스킹해야 합니다. 원격 설정을 받아오는 경우에는 서명·TLS·캐시 만료와
          장애 시 fallback 정책도 필요합니다.
        </p>
        <p>
          다음에는 <strong>bootstrap</strong>에서 설정 출처를 발견하는 순서를,
          <strong>OAuth</strong>에서 인증 정보의 저장과 갱신을 확인하면 됩니다.
          마지막 <strong>remote config</strong>는 네트워크 실패와 로컬
          override가 동시에 있을 때 어떤 값을 선택하는지 다룹니다.
        </p>
      </div>
    </section>
  );
}
