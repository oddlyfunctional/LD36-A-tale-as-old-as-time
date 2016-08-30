import { Sprite } from './sprite';
import { Body } from './body';
import { Vector } from './vector';

export function Tiger(scene, x, y, player, lightSources) {
  const MINIMUM_DISTANCE_TO_FIRE = 140;
  const height = 100;
  y -= height;
  let sprite = Sprite(scene, './imgs/tiger.png', x, y, 160, height, 400, 250, {
    standing: {
      frames: [0],
      speed: 0
    },

    leaping: {
      frames: [1, 2],
      speed: 300,
      loop: true
    }
  });
  sprite.setAnimation('leaping');
  let body = Body(scene, sprite, false, 6);

  const CHASING = 'chasing';
  const FLEEING = 'fleeing';
  let state = CHASING;
  const fleeTimeout = 2.0 * 1000;
  let startedFleeing;

  return Object.assign({}, sprite, {
    constructor: Tiger,
    name: 'Sabertooth Tiger',
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

    const closestLightSources = lightSources
    .filter(light => light.enabled)
    .sort(
      (l1, l2) => Math.abs(sprite.getX() - l1.position.x) - Math.abs(sprite.getX() - l2.position.x)
    );

    const closestLightSource = closestLightSources[0];

    if (closestLightSource) {
      let lightPosition = new Vector(closestLightSource.position.x, closestLightSource.position.y);
      let distance = Math.abs(lightPosition.getX() - newCenter.getX()) - radius(sprite);
      const difference = MINIMUM_DISTANCE_TO_FIRE - distance;
      if (difference > 6) {
        movement = movement.dotProduct(-1);
        sprite.setAnimation('standing');
      } else if (difference >= 0) {
        movement = movement.dotProduct(0);
        sprite.setAnimation('standing');
      } else {
        if (sprite.getAnimation() !== 'leaping') {
          sprite.setAnimation('leaping');
        }
      }
    }

    body.moveBy(movement);
    sprite.setFlipped(Math.sign(player.getX() - sprite.getX()));
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
    saySomething();
    sprite.setAnimation('leaping');
  }

  function setChasing() {
    state = CHASING;
  }

  function saySomething() {
    const noises = [
      "GROOOWL!",
      "GRRRAAAWR!",
      "meow!",
      "MRRRRGGGGGLLLL!"
    ];

    const noise = noises[Math.floor((Math.random() * 10 % noises.length))];
    sprite.setSpeech(noise);
  }
}
