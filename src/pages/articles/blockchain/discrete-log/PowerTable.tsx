import CryptoFoundationsViz from "../crypto-foundations-viz";

export default function PowerTable() {
  return (
    <section id="power-table" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">작은 거듭제곱 표로 해·주기·실패 조건을 확인한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Mod 17의 nonzero multiplicative group은 order 16입니다. g=3의 거듭제곱은 x=0…15에서 모든 nonzero residue를 한 번씩 방문하므로 order 16의 generator입니다. y=5는 x=5에서 나오고, x=21도 같은 값을 내지만 21≡5 mod 16이므로 discrete log는 subgroup order를 법으로 읽습니다.
        </p>
      </div>
      <CryptoFoundationsViz mode="power-cycle" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Generator가 아니면 해의 범위가 달라집니다</h3>
        <p>
          g=4는 mod 17에서 4,16,13,1의 네 값만 순환해 order 4입니다. 따라서 Y=3에 대한 log base 4는 존재하지 않고 Y=13이라면 x≡3 mod 4인 여러
          정수 표현이 같은 group element를 냅니다. Protocol이 full group order를 기대하면서 작은-order input을 받아들이면 secret scalar의
          residue가 새어 나올 수 있으므로 public input의 canonical encoding·identity 금지·subgroup membership을 검증합니다.
        </p>
        <h3>표의 ‘뒤섞임’은 security proof가 아닙니다</h3>
        <p>
          작은 숫자에서 규칙이 눈에 안 보인다는 관찰은 학습 직관일 뿐입니다. 실제 비용은 group representation을 이용하는 알고리즘에 달려 있습니다. Generic
          group에서는 BSGS와 Pollard rho가 대략 √q scale을 만들지만 Fp*의 DLP에는 index calculus 계열이 group representation을
          활용합니다. 반면 적절한 elliptic-curve group에는 알려진 subexponential generic shortcut이 없습니다. 이 차이가 parameter size
          선택에 반영됩니다.
        </p>
      </div>
    </section>
  );
}
