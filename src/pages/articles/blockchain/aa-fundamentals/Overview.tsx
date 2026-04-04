import AAModelViz from './viz/AAModelViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EOA vs CA: Account Abstraction 필요성</h2>
      <div className="not-prose mb-8"><AAModelViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이더리움 계정은 EOA(Externally Owned Account)와 CA(Contract Account) 두 종류입니다.<br />
          EOA만이 트랜잭션을 개시할 수 있고, 반드시 ECDSA 서명이 필요합니다.<br />
          이 제약이 사용자 경험과 보안 모두에 한계를 만듭니다.
        </p>

        <h3>EOA의 한계</h3>
        <p className="leading-7">
          시드 구문 분실 시 자산 영구 손실. 서명 알고리즘 변경 불가.<br />
          가스비를 반드시 ETH로 지불. 단일 트랜잭션에 하나의 작업만 가능.<br />
          소셜 복구, 일일 한도 등 프로그래머블 보안 정책을 적용할 수 없습니다.
        </p>

        <h3>Account Abstraction (AA)</h3>
        <p className="leading-7">
          AA는 계정의 유효성 검증 로직을 프로그래밍 가능하게 합니다.<br />
          서명 알고리즘, 가스 지불 방식, 트랜잭션 배치를
          스마트 컨트랙트 레벨에서 커스터마이즈할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
