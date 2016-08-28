import { Scene } from './scene';

window.DEBUG = true;
const canvas = document.getElementById('root');
const context = canvas.getContext('2d');
const scene = Scene(canvas);
const framesPerSecond = 30;
const frameRate = 1000 / framesPerSecond;

let nextFrame = Date.now() + frameRate;
function gameLoop() {
  let now = Date.now();
  if (now > nextFrame) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    scene.update();
    scene.render(context);

    nextFrame += frameRate;
  }

  window.requestAnimationFrame(window.gameLoop);
}

window.gameLoop = gameLoop;
canvas.addEventListener("mousedown", onMouseDown, false);
canvas.addEventListener('mousemove', onMouseMove, false);
gameLoop();

function onMouseDown(event) {
  scene.onMouseDown(getMousePos(canvas, event));
}

function onMouseMove(event) {
  scene.onMouseMove(getMousePos(canvas, event));
}

function getMousePos(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}
