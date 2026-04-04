import Overview from './tusk/Overview';
import AsyncProtocol from './tusk/AsyncProtocol';
import Comparison from './tusk/Comparison';

export default function TuskArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <AsyncProtocol />
      <Comparison />
    </div>
  );
}
