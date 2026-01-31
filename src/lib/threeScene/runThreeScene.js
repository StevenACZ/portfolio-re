import { createParticleField } from "./createParticleField";
import { createThreeContext } from "./createThreeContext";

export function runThreeScene(canvasEl, { onLoaded } = {}) {
  let isRunning = false;
  let isInView = true;
  let frameId = null;
  let intersectionObserver = null;

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;

  const mouse = { x: 0, y: 0 };

  const context = createThreeContext(canvasEl, { isMobile });
  const particleField = createParticleField({ isMobile });
  context.scene.add(...particleField.meshes);

  const targetFps = particleField.config.targetFps || 60;
  const frameInterval = 1000 / targetFps;
  const updateRate = Math.max(1, particleField.config.updateRate || 1);

  let lastFrameTime = 0;
  let frameCount = 0;

  function tick(time) {
    if (!isRunning) return;
    frameId = requestAnimationFrame(tick);

    const delta = time - lastFrameTime;
    if (delta < frameInterval) return;
    lastFrameTime = time - (delta % frameInterval);

    frameCount += 1;
    if (frameCount % updateRate === 0) particleField.update(mouse);

    context.renderer.render(context.scene, context.camera);
  }

  function start() {
    if (isRunning) return;
    isRunning = true;
    frameId = requestAnimationFrame(tick);
  }

  function stop() {
    if (!isRunning) return;
    isRunning = false;
    if (frameId) cancelAnimationFrame(frameId);
    frameId = null;
  }

  function syncRunningState() {
    const shouldRun = isInView && document.visibilityState === "visible";
    if (shouldRun) start();
    else stop();
  }

  function handlePointerMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function handleResize() {
    context.resize();
  }

  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("resize", handleResize);

  if (typeof IntersectionObserver !== "undefined") {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        isInView = entries.some((e) => e.isIntersecting);
        syncRunningState();
      },
      { threshold: 0.01 }
    );
    intersectionObserver.observe(canvasEl);
  }

  document.addEventListener("visibilitychange", syncRunningState);

  window.setTimeout(() => onLoaded?.(), 100);
  syncRunningState();

  return () => {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("resize", handleResize);
    document.removeEventListener("visibilitychange", syncRunningState);

    intersectionObserver?.disconnect();
    intersectionObserver = null;

    stop();

    particleField.dispose();
    context.scene.clear();
    context.dispose();
  };
}
