import OptimizationSignal from './optimizers/OptimizationSignal';
import GradientNoise from './optimizers/GradientNoise';
import TrajectoryExplorer from './optimizers/TrajectoryExplorer';
import MomentumState from './optimizers/MomentumState';
import AdamState from './optimizers/AdamState';
import AdamWPractice from './optimizers/AdamWPractice';

export default function OptimizersArticle() {
  return (
    <>
      <OptimizationSignal />
      <GradientNoise />
      <TrajectoryExplorer />
      <MomentumState />
      <AdamState />
      <AdamWPractice />
    </>
  );
}
