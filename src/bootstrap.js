import { Scene } from './scene';

const canvas = document.getElementById('root');
const context = canvas.getContext('2d');
const scene = Scene(canvas);
const framesPerSecond = 60;
const millisecondsBetweenFrames = 1000 / framesPerSecond;

let lastFrame = new Date();
function gameLoop() {
  let timeElapsed = new Date() - lastFrame;

  if (timeElapsed > millisecondsBetweenFrames) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    scene.update(timeElapsed);
    scene.render(context);

    lastFrame = new Date();
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
