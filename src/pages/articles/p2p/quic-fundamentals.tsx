import Overview from './quic-fundamentals/Overview';
import Handshake from './quic-fundamentals/Handshake';
import Streams from './quic-fundamentals/Streams';
import Migration from './quic-fundamentals/Migration';
import Security from './quic-fundamentals/Security';

export default function QuicFundamentalsArticle() {
  return (
    <>
      <Overview />
      <Handshake />
      <Streams />
      <Migration />
      <Security />
    </>
  );
}
