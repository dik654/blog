const controls = [
  ["Capability", "요청에 필요한 tool과 resource만 바인딩"],
  ["Isolation", "ambient network·host filesystem·process 접근 차단"],
  ["Budget", "시간·메모리·CPU·tool call·출력 크기 제한"],
  ["Effects", "쓰기·외부 전송·삭제는 승인, idempotency와 transaction 적용"],
  ["Audit", "program, tool input/output, 권한 결정과 최종 effect 기록"],
] as const;

export default function Security() {
  return (
    <section id="security" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">샌드박스와 권한 경계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          모델이 만든 코드는 신뢰할 수 없는 입력이다. 문법이 맞고 typecheck를
          통과해도 무한 loop, 과도한 조회, 데이터 외부 전송, 반복 결제 같은
          의미적 위험은 남는다. 따라서 grammar·type checker는 실행 전 검증이고,
          sandbox·capability·effect policy가 실제 방어선이다.
        </p>

        <div data-viz="code-mode-security-control-cards" className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {controls.map(([title, body]) => (
            <div key={title} className="rounded-lg border bg-card p-4">
              <strong className="text-sm">{title}</strong>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>

        <h3 id="result-contract" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          데이터는 sandbox 안에 있어도 민감하다
        </h3>
        <p className="leading-7">
          중간 결과를 모델 context로 보내지 않는 것은 token과 노출 면적을
          줄이지만, 자동으로 privacy를 보장하지 않는다. sandbox memory, debug
          log, exception, tool trace와 최종 반환값에서 민감 정보가 새어 나올 수
          있다. 입력 단계의 목적 제한, 반환 schema, redaction과 보존 기한을 함께
          설계해야 한다.
        </p>

        <h3 id="effect-atomicity" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          실패는 부분 실행을 남긴다
        </h3>
        <p className="leading-7">
          다섯 개 쓰기 중 세 번째에서 실패하면 앞선 두 effect는 이미 발생했을 수
          있다. 읽기 program은 재시도해도 비교적 안전하지만, 쓰기는 dry-run,
          idempotency key, transaction 또는 보상 작업이 필요하다. “코드 한 번
          실행”은 tool call 여러 번의 원자성을 뜻하지 않는다.
        </p>
      </div>
    </section>
  );
}
