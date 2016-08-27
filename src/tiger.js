import { Sprite } from './sprite';
import { Body } from './body';
import { Vector } from './vector';

export function Tiger(scene, x, y, player, lightSources) {
  let sprite = Sprite(scene, '/imgs/tiger.png', x, y, 120, 80);
  let body = Body(sprite, 6);

  return Object.assign({}, sprite, {
    update
  });

  function update(timeElapsed) {
    let movement = body.movementTo(player.getCenterVector());
    let newCenter = movement.add(sprite.getCenterVector());

    if (
      !lightSources.find(light => {
        let lightPosition = new Vector(light.position.x, light.position.y);
        let distance = lightPosition.subtract(newCenter).magnitude() - radius(sprite);
        return distance < light.distance;
      })
    ) {
      body.moveBy(movement);
    }

    sprite.update(timeElapsed);
  }

  function radius(sprite) {
    return (sprite.getWidth() / 2 + sprite.getHeight() / 2) / 2;
  }
}
