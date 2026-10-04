import CryptoFoundationsViz from "../crypto-foundations-viz";

export default function PowerTable() {
  return (
    <section data-teach-level="4" id="power-table" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">7. 5가 나타난 위치를 찾고 한 바퀴의 길이를 검산합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          3절의 계산을 계속하면 x=0…15에서 1, 3, 9, 10, 13, 5, 15, 11, 16, 14, 8, 7, 4, 12, 2, 6을 얻습니다. 다음 곱셈에서 1로 돌아옵니다. 0 아닌 나머지 16개를 한 번씩 방문했으므로 g=3의 위수는 16입니다. Y=5는 다섯 번 곱한 위치에 있으며 21번도 같은 자리입니다. 답은 x≡5 mod 16으로 읽습니다.
        </p>
      </div>
      <CryptoFoundationsViz mode="power-cycle" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>작은 부분군에는 해가 없는 입력도 있습니다</h3>
        <p>
          g=4의 위수는 4입니다. Y=3에는 해가 없고 Y=13에는 x≡3 mod 4인 해가 있습니다. 큰 부분군을 쓰기로 한 프로토콜이 작은 위수의 입력을 받아 계산 결과를 노출하면 비밀 지수의 일부 나머지가 새어 나올 수 있습니다. 따라서 바이트 인코딩과 소속 부분군을 확인하고 항등원 1의 허용 여부도 따로 정합니다.
        </p>
        <h3>표의 ‘뒤섞임’은 security proof가 아닙니다</h3>
        <p>
          작은 표가 뒤섞여 보인다는 느낌은 보안 증명이 아닙니다. 곱셈과 비교만 허용한 공격과 숫자의 표현을 더 활용하는 공격은 비용이 다릅니다. 같은 부분군 위수라도 유한체의 곱셈군과 타원곡선군에 적용되는 최선의 알려진 공격이 같다고 볼 수 없습니다. 먼저 표의 절반씩을 만나는 공격을 같은 사례에 적용하겠습니다.
        </p>
      </div>
    </section>
  );
}
