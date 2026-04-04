import Overview from './vdf/Overview';
import Construction from './vdf/Construction';
import Applications from './vdf/Applications';

export default function VDFArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Construction />
      <Applications />
    </div>
  );
}
