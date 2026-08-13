import Overview from "./math-matrices-svd/Overview";
import MatrixMap from "./math-matrices-svd/MatrixMap";
import Multiplication from "./math-matrices-svd/Multiplication";
import RankBasis from "./math-matrices-svd/RankBasis";
import Svd from "./math-matrices-svd/Svd";
import LowRank from "./math-matrices-svd/LowRank";
import Applications from "./math-matrices-svd/Applications";

export default function MathMatricesSvdArticle() {
  return (
    <>
      <Overview />
      <MatrixMap />
      <Multiplication />
      <RankBasis />
      <Svd />
      <LowRank />
      <Applications />
    </>
  );
}
