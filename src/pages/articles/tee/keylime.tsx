import Overview from './keylime/Overview';
import TPMAttestation from './keylime/TPMAttestation';
import AgentVerifier from './keylime/AgentVerifier';
import IMAIntegrity from './keylime/IMAIntegrity';
import PolicySystem from './keylime/PolicySystem';

export default function KeylimeArticle() {
  return (
    <>
      <Overview />
      <TPMAttestation />
      <AgentVerifier />
      <IMAIntegrity />
      <PolicySystem />
    </>
  );
}
