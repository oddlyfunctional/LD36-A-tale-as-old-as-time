export function Projectile(sprite, target) {
  let x1 = sprite.getX(),
      y1 = sprite.getY(),
      x2 = target.getX(),
      y2 = target.getY();

  let distance = Math.abs(x2 - x1);
  let speedX = 10 * Math.sign(x2 - x1);
  let time = Math.abs(distance / speedX);
  let gravity = 1;
  let speedY = - time * gravity / 2;

  return Object.assign({}, sprite, {
    update
  });

  function update(timeElapsed) {
    if (Math.abs(x2 - sprite.getX()) < speedX * 2) { return; }
    sprite.move(speedX, speedY);
    speedY += gravity;

    sprite.update(timeElapsed);
  }
}
