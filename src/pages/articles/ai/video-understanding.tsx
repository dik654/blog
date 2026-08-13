import Overview from "./video-understanding/Overview";
import Sampling from "./video-understanding/Sampling";
import CNN3D from "./video-understanding/CNN3D";
import VideoTransformer from "./video-understanding/VideoTransformer";

export default function VideoUnderstandingArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Sampling />
      <CNN3D />
      <VideoTransformer />
    </div>
  );
}
