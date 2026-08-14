import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { Link } from "react-router-dom";
import ErasureOverviewViz from "./viz/ErasureOverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Erasure coding은 같은 데이터를 복사하는 대신 복원에 필요한 정보를 나누어
        저장합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          세 저장소에 파일을 그대로 세 번 복사하면 한 저장소만 살아 있어도 읽을
          수 있지만 저장량은 원본의 3배입니다. Erasure coding은 원본을{" "}
          <em>k</em>개의 source symbol로 나눈 뒤 <em>n-k</em>개의 repair
          symbol을 계산합니다. Reed–Solomon처럼 MDS(Maximum Distance
          Separable)인 profile에서는 위치가 확인된 symbol 가운데 임의의{" "}
          <em>k</em>개를 모으면 원본을 복원할 수 있습니다.
        </p>
        <p>
          이 글은 600 MiB 파일을 <strong>(n=10,k=6)</strong> systematic
          profile로 저장하는 사례를 끝까지 사용합니다. 각 symbol이 100 MiB라면
          총 1,000 MiB를 저장하고, 위치를 아는 symbol 네 개가 사라져도 여섯 개로
          복원합니다. 여기서 “위치를 안다”는 말이 중요합니다. checksum으로 손상
          위치를 알아낸
          <strong>erasure</strong>와 어느 symbol이 틀렸는지 모르는{" "}
          <strong>error</strong>는 다른 복구 예산을 씁니다.
        </p>
        <p>
          유한체가 처음이라면 “정해진 개수 안에서 덧셈·곱셈·나눗셈이 다시 그
          집합 안에 머무는 계산 규칙”으로 먼저 읽으면 충분합니다. 자세한 계산은
          <Link to="/crypto/finite-field-theory"> 유한체 기초</Link>와{" "}
          <Link to="/crypto/lagrange">Lagrange 보간</Link>에서 확장합니다.
        </p>
      </div>
      <ContentBoundary article="erasure-coding" />
      <ErasureOverviewViz />

      <ExplainedFormula
        question="(10,6) code는 저장 공간을 얼마나 더 쓰고 몇 개의 erasure를 견딜까요?"
        idea="Code rate는 전체 encoded symbol 중 source 정보의 비율이고, extra overhead는 원본 대비 추가 저장량입니다. 두 비율의 분모가 다르므로 구분합니다."
        formula={String.raw`\begin{aligned}
R&=\frac{k}{n}\\[3pt]
O_{extra}&=\frac{n-k}{k}\\[3pt]
E_{max}&=n-k
\end{aligned}`}
        terms={[
          {
            symbol: "n",
            name: "Encoded symbol count",
            description: "Source와 repair를 합친 전체 symbol 수입니다.",
          },
          {
            symbol: "k",
            name: "Source symbol count",
            description: "원본 정보를 담는 독립 source symbol 수입니다.",
          },
          {
            symbol: "R",
            name: "Code rate",
            description: "전체 저장량 중 source 정보 비율입니다.",
          },
          {
            symbol: "O_{extra}",
            name: "Extra storage overhead",
            description:
              "원본 저장량을 기준으로 추가된 repair 저장량의 비율입니다.",
          },
          {
            symbol: "E_{max}",
            name: "Maximum erasures",
            description:
              "MDS와 올바른 symbol identity 아래에서 견디는 위치가 알려진 손실 수입니다.",
          },
        ]}
        assumptions={[
          "모든 symbol 크기가 같고 n개가 서로 다른 위치를 가집니다.",
          "임의의 k개 복원은 MDS profile·같은 field·같은 generator를 전제로 합니다.",
          "손상된 symbol을 정상 symbol로 잘못 받아들이는 error는 이 erasure 식으로 처리하지 않습니다.",
        ]}
        interpretation="n=10,k=6이면 R=0.6, extra overhead=4/6≈66.7%, Emax=4입니다. ‘repair가 전체의 40%’와 ‘원본보다 66.7% 더 저장’은 서로 다른 문장입니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Codec 이름보다 먼저 고정할 계약</h3>
        <ul>
          <li>
            object ID·source digest·symbol index·symbol byte length와 padding
            rule
          </li>
          <li>
            code family·field·(n,k)·systematic 여부·generator/profile version
          </li>
          <li>
            missing·corrupt·timeout을 구분하는 decoder outcome과 복원 뒤 전체
            object hash
          </li>
        </ul>
        <p>
          이 정보가 없으면 다른 object의 symbol이나 다른 version의 parity를
          섞어도 decoder가 이유를 설명하기 어렵습니다. Erasure coding은 기밀성도
          제공하지 않으므로 암호화·인증·access control은 별도 계층에서
          설계합니다.
        </p>
      </div>
    </section>
  );
}
