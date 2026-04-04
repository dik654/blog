import Overview from './cuda-sync-streams/Overview';
import Streams from './cuda-sync-streams/Streams';
import Events from './cuda-sync-streams/Events';
import MultiGpu from './cuda-sync-streams/MultiGpu';

export default function CudaSyncStreamsArticle() {
  return (
    <>
      <Overview />
      <Streams />
      <Events />
      <MultiGpu />
    </>
  );
}
