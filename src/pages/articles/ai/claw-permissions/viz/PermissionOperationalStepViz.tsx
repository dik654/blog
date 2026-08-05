const AXES = [
  ['정책 출처', '현재 core는 runtime config에서 allow·deny·ask 목록을 받는다.', 'user·project·managed source, precedence와 shadowed rule을 추적한다.'],
  ['설명 가능성', '현재 outcome은 Allow 또는 이유가 있는 Deny다.', '어떤 source와 rule이 이겼고 어떤 조건이 가려졌는지 보여 준다.'],
  ['interactive handoff', '동기 decide()는 Allow·Deny만 반환하며 error·timeout·audit 계약을 타입에 담지 않는다.', 'timeout·panic·UI 종료·headless 환경을 모두 Deny로 닫고 decision evidence를 남긴다.'],
  ['containment', '현재 policy는 authorization을 계산한다.', 'file handle boundary, process/network sandbox, descendant cleanup을 별도 강제한다.'],
  ['우회 운영', 'hook context가 요청 단위 guidance를 준다.', 'bypass scope·expiry·provenance·revocation과 managed kill switch를 둔다.'],
];

export default function PermissionOperationalStepViz() {
  return (
    <figure
      aria-label="현재 permission core와 production 운영 hardening의 차이"
      className="not-prose my-7 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">작은 authorization core 위에 운영 계약을 쌓는다</p>
      </figcaption>
      <div className="divide-y divide-border">
        {AXES.map(([axis, core, production]) => (
          <div
            key={axis}
            className="grid gap-3 px-4 py-4 md:grid-cols-[120px_minmax(0,1fr)_minmax(0,1fr)]"
          >
            <p className="text-sm font-semibold">{axis}</p>
            <div>
              <p className="text-xs font-medium text-muted-foreground">현재 core</p>
              <p className="mt-1 text-sm leading-relaxed">{core}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">production에서 추가</p>
              <p className="mt-1 text-sm leading-relaxed">{production}</p>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
