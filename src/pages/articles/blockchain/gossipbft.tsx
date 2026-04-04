import Overview from './gossipbft/Overview';
import Protocol from './gossipbft/Protocol';
import FilecoinIntegration from './gossipbft/FilecoinIntegration';

export default function GossipBFTArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Protocol />
      <FilecoinIntegration />
    </div>
  );
}
