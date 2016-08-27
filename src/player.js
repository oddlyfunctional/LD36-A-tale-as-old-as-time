import { Sprite } from './sprite';
import { Vector } from './vector';

export function Player(x, y, speed = 3) {
  let sprite = Sprite('/imgs/caveman.png', x, y, 60, 80);
  let target, destinationCallback;

  return Object.assign({}, sprite, {
    name: 'Player',
    update,
    render,
    onMouseDown,
    trigger,
    setTarget,
    setDestinationCallback
  });

  function update(timeElapsed) {
    if (target) {
      if (target.subtract(sprite.getCenterVector()).magnitude() < 2.0) {
        target = undefined;
        destinationCallback && destinationCallback();
      } else {
        let difference = target.subtract(sprite.getCenterVector());
        let direction = difference.normalize();
        let movement = direction.dotProduct(speed);

        sprite.move(movement.getX(), movement.getY());
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
