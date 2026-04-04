import Overview from './drand/Overview';
import Protocol from './drand/Protocol';
import FilecoinIntegration from './drand/FilecoinIntegration';

export default function DrandArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Protocol />
      <FilecoinIntegration />
    </div>
  );
}
