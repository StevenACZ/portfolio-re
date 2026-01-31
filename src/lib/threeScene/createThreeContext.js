import {
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} from "three";
import {
  CAMERA_CONFIG,
  LIGHT_CONFIG,
  SCENE_COLORS,
} from "../../config/threeScene";

export function createThreeContext(canvasEl, { isMobile }) {
  const scene = new Scene();

  const camera = new PerspectiveCamera(
    CAMERA_CONFIG.fov,
    window.innerWidth / window.innerHeight,
    CAMERA_CONFIG.near,
    CAMERA_CONFIG.far
  );
  camera.position.z = CAMERA_CONFIG.positionZ;

  const renderer = new WebGLRenderer({
    canvas: canvasEl,
    alpha: true,
    antialias: !isMobile,
  });

  const pixelRatioCap = isMobile ? 1.5 : 2;

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, pixelRatioCap)
    );
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioCap));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const ambientLight = new AmbientLight(
    SCENE_COLORS.ambientLight,
    LIGHT_CONFIG.ambient.intensity
  );

  const directionalLight = new DirectionalLight(
    SCENE_COLORS.directionalLight,
    LIGHT_CONFIG.directional.intensity
  );
  directionalLight.position.set(...LIGHT_CONFIG.directional.position);

  const pointLight = new PointLight(
    SCENE_COLORS.pointLight,
    LIGHT_CONFIG.point.intensity,
    LIGHT_CONFIG.point.distance
  );
  pointLight.position.set(...LIGHT_CONFIG.point.position);

  scene.add(ambientLight, directionalLight, pointLight);

  function dispose() {
    renderer?.dispose?.();
  }

  return { scene, camera, renderer, resize, dispose };
}
