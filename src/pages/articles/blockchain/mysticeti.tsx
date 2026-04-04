import Overview from './mysticeti/Overview';
import UncertifiedDAG from './mysticeti/UncertifiedDAG';
import FastPath from './mysticeti/FastPath';
import Comparison from './mysticeti/Comparison';

export default function MysticetiArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <UncertifiedDAG />
      <FastPath />
      <Comparison />
    </div>
  );
}
