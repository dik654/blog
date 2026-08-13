import Overview from "./elliptic-curves/Overview";
import G1Curve from "./elliptic-curves/G1Curve";
import G1G2BN254 from "./elliptic-curves/G1G2BN254";

export default function EllipticCurves() {
  return (
    <>
      <Overview />
      <G1Curve />
      <G1G2BN254 />
    </>
  );
}
