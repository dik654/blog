import Overview from './pos-theory/Overview';
import PoR from './pos-theory/PoR';
import PoRep from './pos-theory/PoRep';
import PoSt from './pos-theory/PoSt';

export default function PosTheoryArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <PoR />
      <PoRep />
      <PoSt />
    </div>
  );
}
