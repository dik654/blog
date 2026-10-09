import Overview from "./onprem-k8s-inference-platform/Overview";
import ControlPlane from "./onprem-k8s-inference-platform/ControlPlane";
import ServiceGap from "./onprem-k8s-inference-platform/ServiceGap";
import GroupReplica from "./onprem-k8s-inference-platform/GroupReplica";
import FixedPool from "./onprem-k8s-inference-platform/FixedPool";
import PlatformGate from "./onprem-k8s-inference-platform/PlatformGate";

/**
 * 온프레미스 Kubernetes에서 모델 서버를 배치하고 요청을 나누는 순서
 *
 * 구성요소는 공개 문서에 적힌 구조까지만 다루고 구체 설정값은 권고하지 않는다.
 */
export default function OnpremK8sInferencePlatformArticle() {
  return (
    <div className="space-y-16">
      <Overview />
      <ControlPlane />
      <ServiceGap />
      <GroupReplica />
      <FixedPool />
      <PlatformGate />
    </div>
  );
}
