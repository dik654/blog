import Overview from "./math-differential-equations-numerical-solvers/Overview";
import InitialValue from "./math-differential-equations-numerical-solvers/InitialValue";
import EulerMethod from "./math-differential-equations-numerical-solvers/EulerMethod";
import Stability from "./math-differential-equations-numerical-solvers/Stability";
import HeunRungeKutta from "./math-differential-equations-numerical-solvers/HeunRungeKutta";
import OdeSdeBoundary from "./math-differential-equations-numerical-solvers/OdeSdeBoundary";
import Applications from "./math-differential-equations-numerical-solvers/Applications";

export default function DifferentialEquationsArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <InitialValue />
      <EulerMethod />
      <Stability />
      <HeunRungeKutta />
      <OdeSdeBoundary />
      <Applications />
    </div>
  );
}
