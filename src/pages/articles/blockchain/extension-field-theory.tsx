import Overview from './extension-field-theory/Overview';
import Tower from './extension-field-theory/Tower';
import MinimalPoly from './extension-field-theory/MinimalPoly';
import Frobenius from './extension-field-theory/Frobenius';
import BN254Pairing from './extension-field-theory/BN254Pairing';
import MillerLoop from './extension-field-theory/MillerLoop';
import FinalExp from './extension-field-theory/FinalExp';

export default function ExtensionFieldTheory() {
  return (
    <div className="space-y-12">
      <Overview />
      <Tower />
      <MinimalPoly />
      <Frobenius />
      <BN254Pairing />
      <MillerLoop />
      <FinalExp />
    </div>
  );
}
