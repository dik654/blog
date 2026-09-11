import Overview from "./onprem-k8s-inference-platform/Overview";
import ServiceGap from "./onprem-k8s-inference-platform/ServiceGap";
import GroupReplica from "./onprem-k8s-inference-platform/GroupReplica";
import FixedPool from "./onprem-k8s-inference-platform/FixedPool";
import ControlPlane from "./onprem-k8s-inference-platform/ControlPlane";
import PlatformGate from "./onprem-k8s-inference-platform/PlatformGate";

/**
 * 온프레미스 추론 인프라는 라우팅 규칙이 설 자리를 만드는 일입니다
 *
 * 구성요소는 공개 문서에 적힌 구조까지만 다루고 구체 설정값은 권고하지 않는다.
 */
export default function OnpremK8sInferencePlatformArticle() {
  return (
    <div className="space-y-16">
      <Overview />
      <ServiceGap />
      <GroupReplica />
      <FixedPool />
      <ControlPlane />
      <PlatformGate />
    </div>
  );
}
