import Overview from './mcp-protocol/Overview';
import Architecture from './mcp-protocol/Architecture';
import Primitives from './mcp-protocol/Primitives';
import Transport from './mcp-protocol/Transport';
import Implementation from './mcp-protocol/Implementation';

export default function McpProtocolArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Architecture />
      <Primitives />
      <Transport />
      <Implementation />
    </div>
  );
}
