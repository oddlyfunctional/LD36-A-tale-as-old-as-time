import { Sprite } from './sprite';
import { Vector } from './vector';
import { Body } from './body';

export function Player(scene, x, y) {
  const height = 80;
  y -= height;
  let sprite = Sprite(scene, '/imgs/caveman.png', x, y, 60, height);
  let body = Body(sprite);
  let target, destinationCallback;

  return Object.assign({}, sprite, {
    constructor: Player,
    update,
    render,
    onMouseDown,
    trigger,
    setTarget,
    setDestinationCallback
  });

  function update(timeElapsed) {
    if (target) {
      if (Math.abs(target.subtract(sprite.getCenterVector()).getX()) < 2.0) {
        target = undefined;
        destinationCallback && destinationCallback();
      } else {
        body.moveBy(body.movementTo(target));
        console.log('target', target.toString());
        console.log('movement', body.movementTo(target).toString());
      }
    }

    sprite.update(timeElapsed);
  }

  function render(context) {
    sprite.render(context);
  }

  function onMouseDown(coordinates) {
    target = Vector(coordinates.x, coordinates.y);
    setDestinationCallback();
  }

  function trigger() {}

  function setTarget(newTarget) { target = newTarget; }

  function setDestinationCallback(callback) {
    destinationCallback = callback;
  }
}
