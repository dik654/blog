import Overview from './sparse-autoencoder/Overview';
import ResidualStream from './sparse-autoencoder/ResidualStream';
import Polysemanticity from './sparse-autoencoder/Polysemanticity';
import SAEArchitecture from './sparse-autoencoder/SAEArchitecture';
import FeatureSteering from './sparse-autoencoder/FeatureSteering';
import Limitations from './sparse-autoencoder/Limitations';

export default function SparseAutoencoderArticle() {
  return (
    <>
      <Overview />
      <ResidualStream />
      <Polysemanticity />
      <SAEArchitecture />
      <FeatureSteering />
      <Limitations />
    </>
  );
}
