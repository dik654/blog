import Overview from './tls-fundamentals/Overview';
import Handshake from './tls-fundamentals/Handshake';
import RecordProtocol from './tls-fundamentals/RecordProtocol';
import KeySchedule from './tls-fundamentals/KeySchedule';

export default function TLSFundamentalsArticle() {
  return (
    <>
      <Overview />
      <Handshake />
      <RecordProtocol />
      <KeySchedule />
    </>
  );
}
