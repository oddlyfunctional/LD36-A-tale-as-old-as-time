import { Sprite } from './sprite';
import { Vector } from './vector';
import { Body } from './body';

export function Player(scene, x, y) {
  const MINIMUM_DISTANCE_TO_TIGER = 100;
  const height = 80;
  y -= height;
  let sprite = Sprite(scene, './imgs/caveman.png', x, y, 60, height, 150, 200, {
    standing: {
      frames: [0],
      speed: 0
    },
    running: {
      frames: [0, 1],
      speed: 500,
      loop: true
    }
  });
  sprite.setAnimation('running');
  let body = Body(scene, sprite);
  let target, destinationCallback;

  return Object.assign({}, sprite, {
    constructor: Player,
    name: 'Myself',
    update,
    render,
    onMouseDown,
    trigger,
    setTarget
  });

  function update(timeElapsed) {
    let distanceToTiger = scene.getTiger().getCenterVector().subtract(sprite.getCenterVector());
    if (distanceToTiger.magnitude() <= MINIMUM_DISTANCE_TO_TIGER) {
      setTarget(sprite.getCenterVector().add(
        Vector(
          MINIMUM_DISTANCE_TO_TIGER * Math.sign(-distanceToTiger.getX()),
          0
        )
      ));
      if (!sprite.getSpeech()) {
        sprite.setSpeech('AHHHHHHHHH!');
      }
    }

    if (target) {
      if (Math.abs(target.subtract(sprite.getCenterVector()).getX()) < 2.0) {
        destinationCallback && destinationCallback();
        setTarget();
      } else {
        body.moveBy(body.movementTo(target));
      }

      if (sprite.getAnimation() == 'standing') {
        sprite.setAnimation('running');
      }
    } else {
      sprite.setAnimation('standing');
    }

    sprite.update(timeElapsed);
  }

  function render(context) {
    sprite.render(context);
  }

  function onMouseDown(coordinates) {
    setTarget(Vector(coordinates.x, coordinates.y));
  }

  function trigger() {}

  function setTarget(newTarget, newDestinationCallback) {
    target = newTarget;
    destinationCallback = newDestinationCallback;
  }
}
