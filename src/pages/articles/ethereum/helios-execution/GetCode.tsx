import GetCodeViz from './viz/GetCodeViz';

export default function GetCode() {
  return (
    <section id="get-code" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        eth_getCode 구현
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth: MDBX Bytecodes 테이블에서
          codeHash를 키로 바이트코드를 직접 읽는다.<br />
          Helios: 어카운트 증명에 포함된 codeHash를 검증한 뒤
          별도로 코드를 요청한다.
        </p>
        <p className="leading-7">
          위변조 방지: RPC가 반환한 코드에 대해
          keccak256(code) == proof.codeHash를 대조한다.<br />
          해시가 불일치하면 즉시 에러 — 악의적 RPC가
          다른 컨트랙트 코드를 주입하는 것을 방지한다.
        </p>
        <p className="leading-7">
          EOA(Externally Owned Account)의 경우
          codeHash는 EMPTY_CODE_HASH(keccak256(b""))이다.<br />
          이때 코드 요청을 생략하고 빈 Bytes를 반환한다.
        </p>
      </div>
      <div className="not-prose"><GetCodeViz /></div>
    </section>
  );
}
