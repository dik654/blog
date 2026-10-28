const OPTIONS = [
  {
    option: "A · socket 기준",
    owner: "Process manager",
    behavior: "Port가 열리면 traffic 편입",
    risk: "Sync 중 replica에 요청이 들어갈 수 있음",
    status: "기각",
  },
  {
    option: "B · 검증 상태 기준",
    owner: "배포 플랫폼",
    behavior: "Sync·initial block·대표 조회 뒤 편입",
    risk: "Probe와 rollout 정책을 별도 구현해야 함",
    status: "제안",
  },
  {
    option: "C · 외부 fallback 자동화",
    owner: "Helios fallback 경로",
    behavior: "Initial sync 실패 시 외부 root 재선택",
    risk: "가용성 다수결을 trust로 오인할 수 있음",
    status: "기본 비활성",
  },
] as const;

export default function Decision() {
  return (
    <section id="decision" className="mb-16 scroll-mt-20">
      <h2 className="mb-3 text-2xl font-bold">결정과 재검토</h2>
      <p className="mb-6 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
        현재 선택은 성능 우위가 아니라 조기 traffic 편입과 신뢰 anchor 변경을 막는 최소 기준선입니다.
      </p>

      <div className="not-prose overflow-x-auto border-y border-border py-3" aria-label="Helios 시작 정책 대안 비교">
        <table className="w-full min-w-[48rem] border-collapse text-left text-xs leading-5">
          <thead>
            <tr className="text-muted-foreground">
              <th className="px-3 py-2">대안</th>
              <th className="px-3 py-2">상태 writer</th>
              <th className="px-3 py-2">Traffic 판정</th>
              <th className="px-3 py-2">주요 위험</th>
              <th className="px-3 py-2">현재 판정</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {OPTIONS.map((row) => (
              <tr key={row.option}>
                <td className="px-3 py-3 font-bold">{row.option}</td>
                <td className="px-3 py-3">{row.owner}</td>
                <td className="px-3 py-3">{row.behavior}</td>
                <td className="px-3 py-3">{row.risk}</td>
                <td className="px-3 py-3 font-bold text-primary">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <h3>ADR-HC-001 · proposed</h3>
        <p>
          <strong>[A]</strong> 첫 배포안은 Helios 0.12.0, 고정 network profile, 허용한 consensus·execution endpoint, 명시한
          checkpoint source, <code>strict_checkpoint_age=true</code>, 자동 external fallback 비활성입니다.
        </p>
        <p>
          Helios 내부 sync status와 initial block 확보를 확인하고, 같은 candidate에서 대표 proof-backed read가 성공한 뒤에만 배포 플랫폼이
          Service endpoint에 넣습니다. Helios가 sync 상태를 쓰고 배포 플랫폼이 traffic admission을 쓰므로 같은 상태를 두 controller가
          동시에 바꾸지 않습니다.
        </p>
        <h3>가설과 아직 없는 결과</h3>
        <p>
          가설은 “socket 기준 편입보다 검증 상태 기준 편입이 시작 중 잘못된 응답을 줄이면서 허용한 startup budget을 넘지 않는다”입니다.
          <strong>[O]</strong> 소스 검토로 socket과 sync가 분리된다는 사실은 확인했습니다. 그러나 <strong>[M]</strong> 실제 Pod의 startup
          p50·p95, proof-backed probe 시간, fallback 실패율은 아직 측정하지 않았습니다. 따라서 안정성 우위나 시작 시간의 수치는 주장하지
          않습니다.
        </p>
        <h3>실험·격리·되돌리기</h3>
        <p>같은 binary·network·endpoint와 고정 checkpoint로 다음 실패를 candidate namespace에서 재생합니다.</p>
        <ul>
          <li>Port 조기 개방과 오래된 checkpoint</li>
          <li>31·33-byte file과 checkpoint write 중단</li>
          <li>Wrong-network endpoint</li>
          <li>Unavailable·conflicting fallback</li>
        </ul>
        <p>
          Run마다 Config digest, checkpoint source, sync status, initial block, 대표 조회 결과와 Service 편입 시각을 기록합니다. 실패하면
          candidate만 traffic에서 빼고 이전 binary·redacted config·checkpoint backup 조합으로 되돌린 뒤 같은 probe를 다시 통과시킵니다.
        </p>
        <h3>채택과 결론을 다시 검토할 조건</h3>
        <p>
          모든 fixture에서 조기 편입이 없고 rollback 재진입이 성공한 뒤, 사전에 정한 startup budget을 만족해야 채택합니다. 잘못된 chain,
          오래된 anchor, 손상 file을 ready로 승격하거나 안전한 rollback이 없으면 기각합니다. Helios release, checkpoint format, network profile,
          endpoint API, 배포 플랫폼 또는 SLO가 바뀌면 이 ADR을 다시 검토합니다.
        </p>
      </div>
    </section>
  );
}
