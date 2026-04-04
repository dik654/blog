import Overview from './vae/Overview';
import AEvsVAE from './vae/AEvsVAE';
import EncoderComputation from './vae/EncoderComputation';
import ReparamTrick from './vae/ReparamTrick';
import DecoderComputation from './vae/DecoderComputation';
import VAELoss from './vae/VAELoss';
import LatentSpace from './vae/LatentSpace';
import Training from './vae/Training';
import Applications from './vae/Applications';

export default function VAEArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <AEvsVAE />
      <EncoderComputation />
      <ReparamTrick />
      <DecoderComputation />
      <VAELoss />
      <LatentSpace />
      <Training />
      <Applications />
    </div>
  );
}
