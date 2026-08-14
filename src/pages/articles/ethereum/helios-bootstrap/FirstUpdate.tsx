export default function FirstUpdate({ title }: { title: string }) {
  return (
    <section id="first-update" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          초기화 직후에는 update의 signature period가 store의 current committee로 검증 가능한지 먼저 확인합니다. Update가 next committee와
          branch를 포함하면 이를 현재 trusted state에 결속해 다음 period를 준비하고, finality branch와 participation 조건을 충족한 경우에만
          finalized header를 전진시킵니다. 더 높은 slot이라는 이유만으로 모든 field를 한꺼번에 덮어쓰지 않습니다.
        </p>
        <p>
          Optimistic head는 더 빠르게 움직일 수 있지만 finalized head와 같은 확정성을 뜻하지 않습니다. Application이 잔액 표시에는 optimistic를,
          큰 가치 이전에는 finalized를 요구한다면 어느 head를 사용했는지 RPC receipt에 명시해야 합니다. 첫 update부터 이 정책이 없으면
          뒤의 sync loop가 올바르게 돌아도 caller가 서로 다른 확정성의 값을 혼동합니다.
        </p>
      </div>
    </section>
  );
}
