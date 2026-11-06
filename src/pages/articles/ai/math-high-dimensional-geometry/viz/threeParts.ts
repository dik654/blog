import type { Group } from "three";
import type { Three, Vec3 } from "@/components/viz/Scene3DCanvas";

/** 3D 장면에서 함께 쓰는 막대·선·공 조각입니다. 글자는 canvas에 굽지 않고 HTML label로 올립니다. */
export function addRod(THREE: Three, root: Group, from: Vec3, to: Vec3, color: string, radius = 0.035, opacity = 1) {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const length = a.distanceTo(b);
  if (length < 1e-6) return;
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, length, 12),
    new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity }),
  );
  mesh.position.copy(a.clone().add(b).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
  root.add(mesh);
}

export function addArrow(THREE: Three, root: Group, from: Vec3, to: Vec3, color: string, radius = 0.035) {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const direction = b.clone().sub(a).normalize();
  const tip = 0.26;
  const neck = b.clone().sub(direction.clone().multiplyScalar(tip));
  addRod(THREE, root, from, [neck.x, neck.y, neck.z], color, radius);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(radius * 3, tip, 16), new THREE.MeshBasicMaterial({ color }));
  cone.position.copy(neck.clone().add(direction.clone().multiplyScalar(tip / 2)));
  cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
  root.add(cone);
}

export function addLine(THREE: Three, root: Group, points: readonly Vec3[], color: string, opacity = 1) {
  root.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points.map((point) => new THREE.Vector3(...point))),
      new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity }),
    ),
  );
}

export function addDashed(THREE: Three, root: Group, from: Vec3, to: Vec3, color: string) {
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...from), new THREE.Vector3(...to)]),
    new THREE.LineDashedMaterial({ color, dashSize: 0.1, gapSize: 0.08 }),
  );
  line.computeLineDistances();
  root.add(line);
}

export function addBall(THREE: Three, root: Group, at: Vec3, color: string, radius = 0.12) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 14), new THREE.MeshBasicMaterial({ color }));
  mesh.position.set(...at);
  root.add(mesh);
}
