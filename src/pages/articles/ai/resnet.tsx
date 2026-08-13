import Overview from "./resnet/Overview";
import SkipConnection from "./resnet/SkipConnection";
import Architecture from "./resnet/Architecture";
import Impact from "./resnet/Impact";

export default function ResNetArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <SkipConnection />
      <Architecture />
      <Impact />
    </div>
  );
}
