import { Vector } from './vector';

export function Body(scene, sprite, boundToCamera = true, speed = 3) {
  return {
    movementTo,
    moveBy
  };

  function movementTo(target) {
    let difference = target.subtract(sprite.getCenterVector());
    // let direction = difference.normalize();
    // let movement = direction.dotProduct(speed);
    let deltaX = speed * Math.sign(difference.getX());

    return Vector(deltaX, 0);
  }

  function moveBy(vector) {
    if (sprite.right() + vector.getX() > scene.getCanvas().width) { return; }

    sprite.move(vector.getX(), vector.getY());
    sprite.setFlipped(Math.sign(vector.getX()));
  }
}
