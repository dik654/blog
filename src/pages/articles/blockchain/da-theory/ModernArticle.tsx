import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { DAArchitectureViz, ErasureGridViz } from "./viz/ModernDAViz";

function Definition({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-muted-foreground">{children}</div>
    </div>
  );
}

export default function ModernDAArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">Data availability를 처음부터</p>
          <h2 className="text-3xl font-bold tracking-tight">Commitment가 맞는 것과 데이터를 받을 수 있는 것은 다르다</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          Data availability(DA)는 합의된 block이나 rollup batch의 원본 데이터를 참여자가 제때 얻을 수 있는지를 묻습니다. Hash나 KZG commitment가 맞다는 것은 “받은 조각이 약속된 데이터에 속한다”는 <strong>authenticity</strong>를 주지만, 나머지 조각이 network 어딘가에 실제로 남아 있다는 <strong>availability</strong>까지 증명하지는 않습니다. 실행 결과가 올바른지를 묻는 <strong>validity</strong>도 별도 문제입니다.
        </p>
        <p>
          도서관이 책의 지문(hash)을 게시했다고 생각해 봅시다. 내 손의 한 페이지가 그 책에 속하는지는 지문과 proof로 확인할 수 있지만, 나머지 페이지를 도서관이 숨겼다면 책 전체를 복원할 수 없습니다. DA protocol은 원본에 복원용 redundancy를 넣고, 무작위 위치를 여러 peer에게 요청하며, 충분한 조각을 모으면 reconstruction을 실제로 수행하는 방식으로 이 간극을 다룹니다.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <Definition title="Authenticity">받은 cell·blob이 commitment에 묶인 데이터인지 확인합니다. KZG proof나 Merkle proof가 이 질문에 답합니다.</Definition>
          <Definition title="Encoding validity">게시자가 정해진 Reed–Solomon 규칙으로 parity를 올바르게 만들었는지 확인합니다. 잘못 인코딩하면 표본은 진짜여도 복원이 실패할 수 있습니다.</Definition>
          <Definition title="Availability">정해진 시간과 peer 조건에서 reconstruction threshold만큼 데이터를 얻을 수 있는지 확인합니다. Sampling은 전제를 둔 확률적 evidence입니다.</Definition>
        </div>
        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6">
          <strong>먼저 구분할 결론:</strong> EIP-4844, PeerDAS, Celestia는 모두 blob 또는 share를 다루지만 같은 DAS 구조가 아닙니다. EIP-4844의 consensus node는 blob sidecar를 전부 받습니다. PeerDAS는 blob row마다 1D extension을 하고 column을 custody·sample합니다. Celestia의 원형 설계는 row와 column을 모두 늘리는 2D extended data square입니다.
        </aside>
      </section>

      <section id="erasure-code" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · 복원 가능한 데이터</p>
          <h2 className="mt-2 text-2xl font-bold">Reed–Solomon은 복사본이 아니라 다항식의 추가 평가값을 만든다</h2>
        </header>
        <p>
          가장 작은 toy example로 k=4개 source symbol을 생각하겠습니다. 유한체 위에서 이 네 값을 지나는 degree 3 이하 polynomial을 하나 정하고, 새로운 네 지점에서 값을 더 계산하면 n=8개 symbol이 됩니다. 올바른 서로 다른 네 평가값만 있으면 polynomial을 interpolation해 source를 복원할 수 있습니다. 이를 (n=8,k=4) code라고 부르며 code rate는 k/n=1/2, 원본 대비 extra overhead는 (n-k)/k=1입니다.
        </p>
        <p>
          “절반을 잃어도 된다”는 말에는 조건이 붙습니다. 어디가 비었는지 아는 erasure이고, 각 symbol의 index와 code profile이 맞으며, 손상된 값을 proof나 checksum으로 거절할 수 있어야 합니다. 위치를 모르는 잘못된 값(error)은 위치를 찾고 값도 고쳐야 하므로 같은 parity budget을 두 배로 사용합니다. 더 자세한 다항식·distance 설명은 <a className="text-primary underline-offset-4 hover:underline" href="/blockchain/erasure-coding#reed-solomon">Erasure coding 글</a>이 canonical owner입니다.
        </p>
        <ErasureGridViz />
      </section>

      <section id="eip4844" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · Proto-danksharding</p>
          <h2 className="mt-2 text-2xl font-bold">EIP-4844는 blob 운송과 가격 경계를 만들었지만 DAS는 아니다</h2>
        </header>
        <p>
          Type-3 blob transaction의 execution payload에는 blob 원문이 들어가지 않고 versioned hash 목록이 들어갑니다. Blob, KZG commitment와 proof는 consensus sidecar로 함께 전파됩니다. EVM contract는 blob byte를 직접 읽지 못하고 commitment에서 파생된 versioned hash와 point-evaluation 검증 경계를 사용합니다. 이 분리는 rollup data를 execution state에 영구 저장하는 비용을 피하면서도 transaction과 sidecar를 cryptographically binding합니다.
        </p>
        <ExplainedFormula
          question="EIP-4844 blob 하나의 payload byte 수는 어떻게 계산하는가?"
          idea={<>Blob은 4,096개의 field element slot으로 구성되고 각 slot은 32 bytes입니다. 두 protocol 상수를 곱하면 131,072 bytes, 즉 128 KiB가 됩니다. 이는 임의 파일 128 KiB를 그대로 넣는다는 뜻이 아니라 각 field element의 canonical encoding 제약을 따릅니다.</>}
          formula={String.raw`B_{blob}=4096\;\text{elements}\times32\;\text{bytes/element}=131072\;\text{bytes}=128\;\text{KiB}`}
          terms={[
            { symbol: "B_{blob}", name: "Blob byte length", description: "EIP-4844 blob 한 개의 고정 serialized byte 길이입니다." },
            { symbol: "4096", name: "Field elements", description: "FIELD_ELEMENTS_PER_BLOB로 정한 slot 개수입니다." },
            { symbol: "32", name: "Bytes per element", description: "BYTES_PER_FIELD_ELEMENT로 정한 각 slot의 byte 길이입니다." },
          ]}
          assumptions={["EIP-4844 blob serialization 상수를 사용합니다.", "Field element 값은 BLS modulus보다 작아야 하므로 모든 32-byte 문자열이 유효한 것은 아닙니다.", "Block당 blob target·maximum·fee schedule은 fork에 따라 바뀔 수 있어 별도로 version pin합니다."]}
          interpretation="Blob의 개별 크기는 고정이지만, 한 block이 허용하는 blob 수와 가격은 moving protocol parameter입니다. 운영 문서에는 확인한 fork와 날짜를 함께 남겨야 합니다."
        />
        <p>
          중요한 역사적 경계가 있습니다. EIP-4844 자체에서는 beacon node가 자신이 검증하는 blob sidecar 전체를 download합니다. 따라서 “EIP-4844에서 light node가 임의 cell 몇 개만 받아 availability를 확인한다”는 설명은 잘못입니다. 부분 custody와 sampling은 후속 PeerDAS protocol의 책임입니다.
        </p>
        <div id="paper-eip4844">
          <CitationBlock source="EIP-4844 · Shard Blob Transactions" citeKey={1} href="https://eips.ethereum.org/EIPS/eip-4844">
            <p><strong>문제:</strong> Rollup data를 EVM state보다 저렴하고 임시적인 consensus data로 운반해야 합니다.</p>
            <p><strong>기여:</strong> Blob transaction, sidecar, KZG commitment, versioned hash와 blob gas accounting 경계를 정의합니다.</p>
            <p><strong>전제와 범위:</strong> EIP-4844 serialization·verification semantics의 근거입니다. 후속 fork의 blob schedule, PeerDAS sampling, rollup data 자체의 validity를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="kzg" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 조각의 진위</p>
          <h2 className="mt-2 text-2xl font-bold">KZG proof는 cell이 commitment에 속함을 보이지만 availability를 만들지는 않는다</h2>
        </header>
        <p>
          KZG polynomial commitment는 큰 polynomial을 고정 길이 group element 하나에 묶고, 특정 point에서의 평가값이 맞다는 짧은 opening proof를 제공합니다. PeerDAS cell proof는 “이 cell의 값들이 원래 blob polynomial의 확장된 평가값과 일치한다”는 authenticity를 확인하는 데 쓰입니다. 검증에 성공해도 다른 column을 누가 보관하는지, 요청이 독립적인 peer로 갔는지, reconstruction threshold를 충족하는지는 알려 주지 않습니다.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Definition title="Proof가 말하는 것">Pinned setup과 commitment에 대해 제공된 cell/value가 일관됩니다. 잘못된 조각을 decoder 입력에서 제거할 수 있습니다.</Definition>
          <Definition title="Proof가 말하지 않는 것">숨겨진 나머지 조각의 존재, peer diversity, response deadline, 전체 encoding correctness, application execution validity는 별도 evidence가 필요합니다.</Definition>
        </div>
        <div id="paper-kzg">
          <CitationBlock source="Kate–Zaverucha–Goldberg · Constant-Size Commitments to Polynomials" citeKey={2} href="https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf">
            <p><strong>문제:</strong> Polynomial에 compact하게 commit하고 평가값을 짧은 proof로 열어야 합니다.</p>
            <p><strong>기여:</strong> Bilinear pairing과 structured reference를 이용한 constant-size polynomial commitment construction을 제시합니다.</p>
            <p><strong>전제와 범위:</strong> 논문의 security assumption과 trusted setup model 안의 commitment 근거이며, network availability나 PeerDAS 전체 protocol 안전성 주장은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="peerdas" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">04 · Ethereum PeerDAS</p>
          <h2 className="mt-2 text-2xl font-bold">Blob row를 1D로 두 배 늘리고, 모든 row의 같은 위치를 column으로 묶는다</h2>
        </header>
        <p>
          PeerDAS에서 block의 각 blob은 하나의 row처럼 취급되고 1D Reed–Solomon extension으로 두 배 길어집니다. 같은 column index의 cell을 모든 blob row에서 모은 것이 data column입니다. Node는 자신의 node ID로 정해진 custody column을 보관하고, block마다 다른 column을 peer에게 sampling합니다. 전체 column의 절반 이상을 얻으면 각 row의 polynomial을 interpolation해 extended matrix를 복원할 수 있습니다.
        </p>
        <p>
          따라서 PeerDAS를 “각 blob을 2D square로 만든다”고 설명하면 잘못입니다. 2D처럼 보이는 matrix는 여러 1D-extended blob row를 쌓아서 생기며, parity는 row 방향에만 추가됩니다. Sampling unit도 단일 random byte가 아니라 모든 blob row에 걸친 column입니다.
        </p>
        <div id="paper-peerdas">
          <CitationBlock source="EIP-7594 · PeerDAS" citeKey={3} href="https://eips.ethereum.org/EIPS/eip-7594">
            <p><strong>문제:</strong> 모든 beacon node가 모든 blob을 내려받는 대역폭 병목을 줄여야 합니다.</p>
            <p><strong>기여:</strong> 1D extension, cell KZG proof, data-column custody와 peer sampling protocol을 규정합니다.</p>
            <p><strong>전제와 범위:</strong> EIP-4844와 대상 consensus parameters를 고정한 PeerDAS 의미의 근거입니다. Celestia식 2D coding이나 단일 client의 toy 확률식과 같다는 주장은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="celestia" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">05 · Celestia식 2D DAS</p>
          <h2 className="mt-2 text-2xl font-bold">원본 square의 행과 열을 모두 확장한다</h2>
        </header>
        <p>
          Celestia 계열의 extended data square는 k×k source square에서 시작해 각 row를 2k로 늘리고, 그 결과의 각 column도 2k로 늘려 2k×2k square를 만듭니다. k=4라면 source 16 cells가 총 64 cells가 되므로 전체 code rate는 1/4입니다. 행과 열 양쪽에 복원 관계가 있어 light node는 여러 좌표를 sampling하고, full node는 충분한 share로 square를 reconstruct합니다.
        </p>
        <p>
          2D 구조의 장점은 withholding과 잘못된 encoding을 좌표·row·column proof로 다룰 수 있다는 점이지만, “몇 번 sample하면 안전하다”는 결론은 숨겨야 하는 최소 fraction, index 선택의 예측 불가능성, 요청 독립성, peer eclipse 방지, honest rebroadcast와 reconstruction threshold에 의존합니다. 그림의 1/4 rate를 PeerDAS의 1/2 row extension에 그대로 적용해서는 안 됩니다.
        </p>
        <div id="paper-celestia-2d">
          <CitationBlock source="Celestia App Specification · Data Structures" citeKey={4} href="https://celestiaorg.github.io/celestia-app/data_structures.html">
            <p><strong>문제:</strong> Namespaced block data를 light client가 sampling하고 full node가 복원할 수 있는 layout으로 commit해야 합니다.</p>
            <p><strong>기여:</strong> Data square, 2D Reed–Solomon extension과 namespaced Merkle commitment의 공식 application 구조를 설명합니다.</p>
            <p><strong>전제와 범위:</strong> 해당 Celestia app version의 data structure 근거입니다. 모든 DA network가 같은 2D layout이나 동일 sample threshold를 쓴다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="sampling" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">06 · 확률 읽기</p>
          <h2 className="mt-2 text-2xl font-bold">Sampling 성공률은 전제를 적었을 때만 의미가 있다</h2>
        </header>
        <ExplainedFormula
          question="전체의 f 비율이 숨겨졌을 때 s번 표본이 모두 숨김을 놓칠 확률은 얼마인가?"
          idea={<>한 번의 uniform sample이 숨겨지지 않은 영역에 떨어질 확률은 1-f입니다. 같은 조건에서 독립적으로 s번 모두 놓칠 확률은 이를 s번 곱합니다. f=1/2, s=10인 toy model에서는 1/2의 10제곱, 즉 1/1,024입니다.</>}
          formula={String.raw`P_{miss}=(1-f)^s,\qquad f=\tfrac12,\;s=10 \Rightarrow P_{miss}=\tfrac1{1024}\approx0.0977\%`}
          terms={[
            { symbol: "f", name: "Hidden fraction", description: "Reconstruction을 막으려고 공격자가 숨겨야 한다고 모델링한 전체 cell 비율입니다." },
            { symbol: "s", name: "Sample count", description: "Uniform·independent하다고 가정한 표본 요청 횟수입니다." },
            { symbol: "P_{miss}", name: "Miss probability", description: "모든 sample이 available 영역에만 떨어져 withholding을 놓칠 확률입니다." },
          ]}
          assumptions={["각 sample index가 공격자에게 미리 알려지지 않고 대상 전체에서 균등합니다.", "Sample 응답과 peer 경로가 충분히 독립적이며 eclipse·correlation을 별도로 통제합니다.", "숨김 fraction f가 reconstruction threshold와 encoding 구조에서 올바르게 도출되었습니다.", "유효한 proof, response deadline, honest rebroadcast 조건을 별도로 검사합니다."]}
          interpretation="10번 성공했을 때 detection probability는 약 99.9023%지만 보편적 protocol 보장은 아닙니다. 같은 peer가 모든 요청을 통제하거나 f가 잘못 정해지면 이 계산을 사용할 수 없습니다."
        />
        <div id="paper-fraud-da">
          <CitationBlock source="Al-Bassam et al. · Fraud and Data Availability Proofs" citeKey={5} href="https://arxiv.org/abs/1809.09044">
            <p><strong>문제:</strong> Light client가 전체 block을 받지 않고 data withholding과 invalid erasure encoding을 탐지해야 합니다.</p>
            <p><strong>기여:</strong> 2D erasure-coded Merkle tree, random sampling과 fraud proof를 결합하는 construction을 제시합니다.</p>
            <p><strong>전제와 범위:</strong> 논문에 명시된 2D coding·network·sampling model의 근거입니다. EIP-4844나 PeerDAS가 그대로 이 construction을 구현한다는 주장은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="comparison" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">07 · 비교와 배포</p>
          <h2 className="mt-2 text-2xl font-bold">차원을 세지 말고 encoding·sample·reconstruction contract를 기록한다</h2>
        </header>
        <DAArchitectureViz />
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-[780px] w-full text-sm">
            <thead className="bg-muted/50 text-left"><tr><th className="p-3">확인 질문</th><th className="p-3">실패 예</th><th className="p-3">필요한 evidence</th></tr></thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr><td className="p-3 font-medium text-foreground">조각이 commitment에 속하는가?</td><td className="p-3">bad KZG/Merkle proof</td><td className="p-3">proof verification outcome·commitment version</td></tr>
              <tr><td className="p-3 font-medium text-foreground">Encoding이 올바른가?</td><td className="p-3">invalid parity·wrong index</td><td className="p-3">reconstruction·fraud/validity proof·profile pin</td></tr>
              <tr><td className="p-3 font-medium text-foreground">제때 충분히 받는가?</td><td className="p-3">eclipse·correlated peers·timeout</td><td className="p-3">peer diversity·sample receipt·deadline·coverage</td></tr>
              <tr><td className="p-3 font-medium text-foreground">서비스에 배포 가능한가?</td><td className="p-3">restart 뒤 custody gap</td><td className="p-3">paired failure parity 뒤 bandwidth·CPU·p95</td></tr>
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-semibold">아티클만으로 통과해야 하는 10문제</h3>
        <p>
          기초 6문제는 DA·validity·authenticity 구분, (8,4) code 계산, EIP-4844 full-download 경계, PeerDAS 1D column, Celestia 2D square, KZG cell proof 경계를 다룹니다. 심화 4문제는 sampling miss 수치와 전제, 세 protocol의 같은 축 비교, eclipse·bad proof·wrong encoding의 adversarial matrix, pinned-version release gate입니다. 위 설명과 수치만으로 답안의 모든 항목을 만들 수 있어야 하며, moving blob schedule은 암기값이 아니라 fork-pinned 입력으로 처리합니다.
        </p>
        <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">Release gate:</strong> EIP/chain fork, cell layout, commitment setup·version, custody rule과 deadline을 먼저 고정합니다. 정상 fixture와 함께 withheld fraction, bad proof, wrong index, invalid parity, duplicate response, correlated peer, timeout, restart를 주입하고 authenticity·encoding·availability outcome이 같아진 뒤 bandwidth, reconstruction CPU, memory와 p95를 비교합니다.
        </aside>
      </section>
    </article>
  );
}
