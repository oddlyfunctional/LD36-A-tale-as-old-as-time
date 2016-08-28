import { Tree } from './tree';

export function Projectile(scene, sprite, target, onHit) {
  let x1 = sprite.getX(),
      y1 = sprite.getY(),
      x2 = target.getX(),
      y2 = target.getY();

  let distance = Math.abs(x2 - x1);
  let speedX = 10 * Math.sign(x2 - x1);
  let time = Math.abs(distance / speedX);
  let gravity = 1;
  let speedY = - time * gravity / 2;

  const projectile = Object.assign({}, sprite, {
    constructor: Projectile,
    update
  });

  return projectile;

  function update(timeElapsed) {
    let hitObjects = scene.overlappingObjectsWith(sprite).filter(object => {
      return !object.isEqual(projectile) &&
             !object.isEqual(scene.getPlayer()) &&
             object.constructor !== Tree;
    });

    if (hitObjects.length || sprite.bottom() >= target.getY()) {
      onHit(hitObjects);
      sprite.destroy();
      return;
    }
    sprite.move(speedX, speedY);
    speedY += gravity;

    sprite.update(timeElapsed);
  }
}
