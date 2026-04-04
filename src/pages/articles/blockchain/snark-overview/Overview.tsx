import Math from '@/components/ui/math';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SNARK란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SNARK는 <strong>Succinct Non-interactive ARgument of Knowledge</strong>의 약자다
          <br />
          이름 자체가 핵심 성질 네 가지를 담고 있다
        </p>

        <div className="grid gap-4 sm:grid-cols-2 not-prose mt-6 mb-6">
          <div className="rounded-lg border p-4">
            <h4 className="font-semibold text-sm mb-2 text-sky-400">Succinct (간결성)</h4>
            <p className="text-sm leading-relaxed">
              증명 크기가 수백 바이트에 불과하다
              <br />
          검증 시간은 밀리초 단위 &mdash; 회로가 아무리 커도 증명 크기는 거의 일정하다
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-semibold text-sm mb-2 text-emerald-400">Non-interactive (비대화형)</h4>
            <p className="text-sm leading-relaxed">
              증명자가 증명을 한 번 보내면 끝이다
              <br />
          검증자와 여러 라운드를 주고받을 필요가 없다 &mdash; Fiat-Shamir 변환 덕분이다
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-semibold text-sm mb-2 text-violet-400">ARgument (논증)</h4>
            <p className="text-sm leading-relaxed">
              계산적으로 안전하다는 뜻이다 &mdash; 다항식 시간 안에 위조 증명을 만들 수 없다
              <br />
          정보 이론적 증명(proof)보다 약하지만 실용적으로 충분하다
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-semibold text-sm mb-2 text-amber-400">of Knowledge (지식 증명)</h4>
            <p className="text-sm leading-relaxed">
              증명자가 실제로 witness <Math>{'w'}</Math>를 &quot;알고 있음&quot;을 보장한다
              <br />
          추출기(extractor)가 증명에서 witness를 복원할 수 있다는 뜻이다
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">왜 중요한가</h3>
        <p>
          블록체인에서 모든 노드가 모든 트랜잭션을 재실행한다
          <br />
          SNARK를 쓰면 수백만 연산을 수백 바이트 증명 하나로 대체할 수 있다
        </p>
        <div className="grid gap-3 sm:grid-cols-2 not-prose mt-4 mb-6">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">확장성 (Scalability)</h4>
            <ul className="space-y-1 text-sm">
              <li>- zkRollup: L2에서 수천 트랜잭션 실행 후 L1에 증명만 제출</li>
              <li>- 검증 비용이 일정하므로 배치 크기를 늘려도 가스 비용이 거의 동일</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">프라이버시 (Privacy)</h4>
            <ul className="space-y-1 text-sm">
              <li>- 데이터를 공개하지 않고 &quot;올바르게 계산했음&quot;을 증명</li>
              <li>- Zcash: 송금 금액과 주소를 숨기면서 이중 지불 방지</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">핵심 제약: Trusted Setup</h3>
        <p>
          대부분의 SNARK는 <strong>trusted setup</strong>이 필요하다
          <br />
          setup 과정에서 생성되는 &quot;toxic waste&quot;가 노출되면 가짜 증명을 만들 수 있다
          <br />
          MPC 세레모니로 위험을 분산하지만 신뢰 가정이 완전히 사라지진 않는다
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          예외: STARK, Bulletproofs, Halo2(IPA 기반)는 trusted setup 없이 동작한다
        </p>
      </div>
    </section>
  );
}
