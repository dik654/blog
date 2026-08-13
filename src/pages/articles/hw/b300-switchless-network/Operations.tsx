const checks = [
  ["지원", "firmware별 validated cable list와 vendor qualification 확인"],
  ["변경", "mlxconfig 전후 dump·cold power cycle·rollback window"],
  ["링크", "FEC·symbol error·MTU·temperature·cable length 관측"],
  ["RDMA", "GID index·RoCE version·GPU Direct RDMA·NUMA affinity 검증"],
  ["장애", "한 direct link failure가 해당 peer rail을 즉시 제거함"],
  [
    "확장",
    "8 port 한계·quadratic cable count를 넘으면 switched fabric으로 이동",
  ],
] as const;

export default function Operations() {
  return (
    <section id="operations" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        실험 구성과 지원되는 production fabric을 구분한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          sample DAC가 link-up되고 FEC가 협상됐다는 사실은 그 firmware에서
          동작했다는 evidence이지 NVIDIA가 해당 part number를 지원한다는 보장은
          아니다. 공식 user guide도 firmware별 validated cable 목록을 확인하도록
          요구한다. 비검증 cable·custom NCCL은 vendor support와 warranty 범위를
          바꿀 수 있다.
        </p>
        <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {checks.map(([name, detail]) => (
            <div key={name} className="rounded-lg border bg-card p-4">
              <strong className="text-sm">{name}</strong>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {detail}
              </p>
            </div>
          ))}
        </div>
        <p className="leading-7">
          switchless는 2–8 node의 정적인 실험 cluster에서 비용·납기와
          운영 복잡도를 맞바꾸는 선택지다. 한 direct link가 끊기면 switch가
          우회 경로를 찾아주지 않으므로 해당 peer rail을 communicator에서
          제거하거나 job을 중단하고 topology를 다시 구성해야 한다. Topology
          변경, oversubscription, 자동 장애 우회, 다수 tenant와 표준 support가
          중요해지면 Spectrum-X 또는 InfiniBand switched fabric이 운영상 더
          단순해진다.
        </p>
      </div>
    </section>
  );
}
