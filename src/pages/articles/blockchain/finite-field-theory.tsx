import Overview from './finite-field-theory/Overview';
import PrimeField from './finite-field-theory/PrimeField';
import PolynomialArithmetic from './finite-field-theory/PolynomialArithmetic';
import SchwartzZippel from './finite-field-theory/SchwartzZippel';
import ExtensionField from './finite-field-theory/ExtensionField';

export default function FiniteFieldTheory() {
  return (
    <div className="space-y-12">
      <Overview />
      <PrimeField />
      <PolynomialArithmetic />
      <SchwartzZippel />
      <ExtensionField />
    </div>
  );
}
