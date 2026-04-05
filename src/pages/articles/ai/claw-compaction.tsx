import Overview from './claw-compaction/Overview';
import CompactPipeline from './claw-compaction/CompactPipeline';
import SummaryMerge from './claw-compaction/SummaryMerge';
import SummaryCompression from './claw-compaction/SummaryCompression';

export default function ClawCompactionArticle() {
  return (
    <>
      <Overview />
      <CompactPipeline />
      <SummaryMerge />
      <SummaryCompression />
    </>
  );
}
