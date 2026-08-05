import Nonlinearity from './activation-functions/Nonlinearity';
import ActivationExplorer from './activation-functions/ActivationExplorer';
import ActivationFamilies from './activation-functions/ActivationFamilies';
import GradientFailure from './activation-functions/GradientFailure';
import ActivationSelection from './activation-functions/ActivationSelection';

export default function ActivationFunctionsArticle() {
  return (
    <>
      <Nonlinearity />
      <ActivationExplorer />
      <ActivationFamilies />
      <GradientFailure />
      <ActivationSelection />
    </>
  );
}
