import Overview from "./field-arithmetic/Overview";
import PrimeRepr from "./field-arithmetic/PrimeRepr";
import Montgomery from "./field-arithmetic/Montgomery";
import OperatorOverload from "./field-arithmetic/OperatorOverload";
import FrScalar from "./field-arithmetic/FrScalar";

export default function FieldArithmetic() {
  return (
    <>
      <Overview />
      <PrimeRepr />
      <Montgomery />
      <OperatorOverload />
      <FrScalar />
    </>
  );
}
