const Step = ({ n, title, text }: { n: string; title: string; text: string }) => (
  <div className="min-w-0 rounded-lg border border-border bg-background p-4">
    <div className="text-xs font-semibold text-primary">{n}</div>
    <div className="mt-1 text-sm font-bold text-foreground">{title}</div>
    <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
  </div>
);

export function FvmExecutionViz() {
  return (
    <figure data-viz="fvm-execution-receipt" className="not-prose overflow-hidden rounded-xl border border-border bg-card p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-sm font-bold">한 message가 state root receipt가 되기까지</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
            화살표는 시간 순서이고 각 칸은 서로 바꿔 쓸 수 없는 검증 경계입니다.
          </p>
      </figcaption>
      <div className="grid min-w-0 gap-3 md:grid-cols-4">
        <Step n="01" title="Envelope admission" text="sender·nonce·value·gas limit와 network version을 고정합니다." />
        <Step n="02" title="Actor execution" text="WASM actor와 syscall이 nested sends를 만들고 gas를 소비합니다." />
        <Step n="03" title="Transactional state" text="성공한 호출만 staged writes·events를 남기고 abort한 scope는 되돌립니다." />
        <Step n="04" title="Receipt + root" text="exit code·return·gas와 flush된 state-root CID를 같은 실행에 묶습니다." />
      </div>
    </figure>
  );
}
