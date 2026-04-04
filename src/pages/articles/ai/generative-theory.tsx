import Overview from './generative-theory/Overview';
import Likelihood from './generative-theory/Likelihood';
import Latent from './generative-theory/Latent';
import Implicit from './generative-theory/Implicit';

export default function GenerativeTheoryArticle() {
  return (
    <>
      <Overview />
      <Likelihood />
      <Latent />
      <Implicit />
    </>
  );
}
