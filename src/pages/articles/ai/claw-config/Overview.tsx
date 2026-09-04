import { CitationBlock } from "@/components/ui/citation";

const sources = [
  ["USER", "사용자 홈에서 읽은 낮은 우선순위의 파일 설정"],
  ["PROJECT", "프로젝트가 공유하는 파일 설정"],
  ["LOCAL", "현재 장비에만 두는 가장 높은 파일 우선순위"],
] as const;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        설정 loader의 핵심은 최종 값과 출처를 함께 남기는 것이다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          설정 파일은 프로그램의 동작을 바꾸는 JSON 문서입니다. 여러 파일이 같은
          값을 지정하면 나중 파일이 앞선 값을 덮을 수 있으므로, loader는 단순히
          JSON을 읽는 함수가 아닙니다. 발견 순서, 재귀 병합과 최종 값의 출처인
          <strong> provenance</strong>까지 함께 계산해야 합니다.
        </p>
        <p>
          이 글은 commit <code>b71afdd</code>를 고정해 읽습니다. 그 snapshot의
          <code>ConfigLoader</code>가 직접 관리하는 출처는 USER, PROJECT,
          LOCAL 세 종류이며, 발견된 파일을 낮은 우선순위부터 deep merge합니다.
          환경 변수와 CLI 인자는 더 바깥 실행 계층에서 적용할 수 있지만, 이 loader
          자체의 다섯 단계 cascade라고 주장하면 실제 코드보다 넓은 설명이 됩니다.
        </p>

        <div id="paper-claw-config-source" className="scroll-mt-24">
          <CitationBlock
            source="Claw Code config loader @ b71afdd"
            href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/config.rs"
            citeKey={1}
            type="code"
          >
            <p>
              <strong>문제:</strong> 여러 위치의 JSON 설정을 결정적인 순서로
              합치고 최종 field의 출처를 설명해야 합니다. <strong>기여:</strong>
              pinned source는 USER·PROJECT·LOCAL 발견 순서, recursive merge,
              winner·shadowed provenance를 구현합니다. <strong>전제:</strong>
              commit, 실행 directory, home/config path와 file bytes를 고정합니다.
              <strong> 근거 범위:</strong> 이 loader가 읽는 file source와 inspection
              결과입니다. <strong>일반화 금지:</strong> 모든 environment·CLI
              override, secret storage, schema validation과 권한 축소가 이 파일에서
              완결된다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </div>

      <div className="not-prose my-6 grid gap-4 sm:grid-cols-3">
        {sources.map(([source, description], index) => (
          <div key={source} className="min-w-0 rounded-lg border bg-card p-4">
            <span className="text-xs text-muted-foreground">
              파일 우선순위 {index + 1}
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
          <code>deep merge</code>는 object 안쪽의 field를 재귀적으로 합치고,
          scalar나 array처럼 더 쪼개지지 않는 값은 높은 우선순위 값으로 바꾸는
          규칙입니다. 그 뒤 최종 <code>AppConfig</code>를 만들고 교차 필드 제약을
          별도로 검증해야 합니다.
          예를 들어 원격 공급자를 선택했는데 인증 정보가 없거나, read-only
          모드와 쓰기 전용 기능을 함께 켠 경우는 개별 필드의 타입만으로 발견하기
          어렵습니다. 오류 메시지에는 잘못된 값뿐 아니라 어느 설정 파일이나 환경
          변수에서 왔는지도 보여줘야 수정하기 쉽습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Secret과 일반 설정은 저장 경로가 다르다
        </h3>
        <p>
          API key나 OAuth token을 프로젝트 설정에 저장하면 저장소와 로그를 통해 노출될 수 있습니다. 일반적인 hardening에서는 OS keychain이나 전용
          secret store를 사용하지만, 이 snapshot의 OAuth 구현은 별도 credentials JSON을 임시 파일에 쓴 뒤 rename합니다. 여기서는 “권장 저장
          방식”과 “현재 구현 방식”을 구분하고 진단 출력의 redaction·파일 권한·crash durability를 별도로 검증합니다.
        </p>
        <p>
          다음에는 <strong>bootstrap</strong>에서 설정 출처를 발견하는 순서를,
          <strong>OAuth</strong>에서 인증 정보의 저장과 갱신을 확인하면 됩니다.
          마지막 <strong>remote</strong>에서는 환경 변수로 upstream proxy를
          준비하는 현재 helper와, 별도 transport가 갖춰야 할 session protocol을
          구분합니다.
        </p>
      </div>
    </section>
  );
}
