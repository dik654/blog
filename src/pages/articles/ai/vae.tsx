import FromAutoencoder from './vae/FromAutoencoder';
import PosteriorExplorer from './vae/PosteriorExplorer';
import ReparameterizationPath from './vae/ReparameterizationPath';
import ElboObjective from './vae/ElboObjective';
import TrainingAndGeneration from './vae/TrainingAndGeneration';
import LimitsAndHandoff from './vae/LimitsAndHandoff';

export default function VAEArticle() {
  return (
    <>
      <FromAutoencoder />
      <PosteriorExplorer />
      <ReparameterizationPath />
      <ElboObjective />
      <TrainingAndGeneration />
      <LimitsAndHandoff />
    </>
  );
}
