import { Sprite } from './sprite';
import { Vector } from './vector';

export function Player(x, y, speed = 3) {
  let sprite = Sprite('/imgs/caveman.png', x, y, 60, 80);
  let target;

  return {
    update,
    render,
    onMouseDown,

    move: sprite.move,
    getX: sprite.getX,
    getY: sprite.getY,
    getCenterVector: sprite.getCenterVector,
    contains: sprite.contains,
    getOpaqueObject: sprite.getOpaqueObject
  };

  function update(timeElapsed) {
    if (target) {
      if (target.subtract(sprite.getCenterVector()).magnitude() < 2.0) {
        target = undefined;
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
  }
}
