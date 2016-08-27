export function Body(sprite, speed = 3) {
  return {
    movementTo,
    moveBy
  };

  function movementTo(target) {
    let difference = target.subtract(sprite.getCenterVector());
    let direction = difference.normalize();
    let movement = direction.dotProduct(speed);

    return movement;
  }

  function moveBy(vector) {
    sprite.move(vector.getX(), vector.getY());
  }
}
