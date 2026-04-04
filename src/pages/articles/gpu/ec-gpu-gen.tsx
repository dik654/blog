import Overview from './ec-gpu-gen/Overview';
import Codegen from './ec-gpu-gen/Codegen';
import BellpersonIntegration from './ec-gpu-gen/BellpersonIntegration';
import OpenclCuda from './ec-gpu-gen/OpenclCuda';

export default function EcGpuGenArticle() {
  return (
    <>
      <Overview />
      <Codegen />
      <BellpersonIntegration />
      <OpenclCuda />
    </>
  );
}
