import { Sprite } from './sprite';
import { Body } from './body';
import { Vector } from './vector';

export function Tiger(scene, x, y, player, lightSources) {
  const height = 80;
  y -= height;
  let sprite = Sprite(scene, '/imgs/tiger.png', x, y, 120, height);
  let body = Body(scene, sprite, false, 6);

  const CHASING = 'chasing';
  const FLEEING = 'fleeing';
  let state = CHASING;
  const fleeTimeout = 2.0 * 1000;
  let startedFleeing;

  return Object.assign({}, sprite, {
    constructor: Tiger,
    update,
    setFleeing
  });

  function update(timeElapsed) {
    switch (state) {
      case CHASING:
        chase();
        break;
      case FLEEING:
        flee();
        break;
      default: throw new Error(`Unexpected state: ${state}`);
    }

    sprite.update(timeElapsed);
  }

  function chase() {
    let movement = body.movementTo(player.getCenterVector());
    let newCenter = movement.add(sprite.getCenterVector());

    if (
      !lightSources.filter(light => light.enabled).find(light => {
        let lightPosition = new Vector(light.position.x, light.position.y);
        let distance = Math.abs(lightPosition.getX() - newCenter.getX()) - radius(sprite);
        return distance - 20 < light.distance;
      })
    ) {
      body.moveBy(movement);
    }
  }

  function flee() {
    if (new Date() - startedFleeing > fleeTimeout) {
      setChasing();
    } else {
      let movement = body.movementTo(player.getCenterVector()).dotProduct(-1);
      body.moveBy(movement);
    }
  }

  function radius(sprite) {
    return (sprite.getWidth() / 2 + sprite.getHeight() / 2) / 2;
  }

  function setFleeing() {
    state = FLEEING;
    startedFleeing = new Date();
  }

  function setChasing() {
    state = CHASING;
  }
}
