import Overview from './resnet/Overview';
import VanishingGradient from './resnet/VanishingGradient';
import SkipConnection from './resnet/SkipConnection';
import ResidualComputation from './resnet/ResidualComputation';
import Architecture from './resnet/Architecture';
import Impact from './resnet/Impact';

export default function ResNetArticle() {
  return (
    <>
      <Overview />
      <VanishingGradient />
      <SkipConnection />
      <ResidualComputation />
      <Architecture />
      <Impact />
    </>
  );
}
