import Overview from './filecoin-storage-ops/Overview';
import SpWorkflow from './filecoin-storage-ops/SpWorkflow';
import SealingPipeline from './filecoin-storage-ops/SealingPipeline';
import SsdAndStorage from './filecoin-storage-ops/SsdAndStorage';
import PostAndIncidents from './filecoin-storage-ops/PostAndIncidents';

export default function FilecoinStorageOps() {
  return (
    <>
      <Overview />
      <SpWorkflow />
      <SealingPipeline />
      <SsdAndStorage />
      <PostAndIncidents />
    </>
  );
}
