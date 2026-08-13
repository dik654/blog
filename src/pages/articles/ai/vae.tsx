import Overview from "./vae/Overview";
import AEvsVAE from "./vae/AEvsVAE";
import ReparamTrick from "./vae/ReparamTrick";
import VAELoss from "./vae/VAELoss";
import Training from "./vae/Training";
import Applications from "./vae/Applications";

export default function VAEArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <AEvsVAE />
      <ReparamTrick />
      <VAELoss />
      <Training />
      <Applications />
    </div>
  );
}
