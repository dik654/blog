export default function FirstUpdate({ title }: { title: string }) {
  return (
    <section id="first-update" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          S1이 생긴 뒤 처음 받은 update는 bootstrap이 만든 K를 실제 검증 key로 사용합니다. Signature period가 current committee로 검증 가능한지
          확인하고, next committee와 branch가 있다면 현재 trusted state에 묶습니다. Finality branch와 participation 조건을 충족한 field만
          전진시키므로 slot이 높다는 이유만으로 Store 전체를 덮어쓰지 않습니다.
        </p>
        <p>
          이 시점부터 책임은 <a href="/cs/blockchain/helios-consensus#overview">BLS 서명 검증</a>과
          <a href="/cs/blockchain/helios-update#overview">Store update 전이</a>로 넘어갑니다. Bootstrap 글이 확정하는 것은 첫 검증 key와 header의 출처이며,
          optimistic·finalized header가 이후 어떤 조건에서 달라지는지는 두 자식 글이 맡습니다.
        </p>
      </div>
    </section>
  );
}
