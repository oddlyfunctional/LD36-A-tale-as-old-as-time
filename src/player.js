import { Sprite } from './sprite';
import { Vector } from './vector';
import { Body } from './body';

export function Player(scene, x, y) {
  const MINIMUM_DISTANCE_TO_TIGER = 130;
  const height = 80;
  y -= height;
  let sprite = Sprite(scene, '/imgs/caveman.png', x, y, 60, height);
  let body = Body(sprite);
  let target, destinationCallback;

  const FLEEING = 'fleeing';
  const CONTROLLING = 'controlling';
  let state = CONTROLLING;
  const fleeTimeout = 1.5 * 1000;
  let startedFleeing;

  return Object.assign({}, sprite, {
    constructor: Player,
    update,
    render,
    onMouseDown,
    trigger,
    setTarget,
    setDestinationCallback
  });

  function update(timeElapsed) {
    let distanceToTiger = scene.getTiger().getCenterVector().subtract(sprite.getCenterVector());
    if (distanceToTiger.magnitude() <= MINIMUM_DISTANCE_TO_TIGER) {
      setTarget();
      state = FLEEING;
      startedFleeing = new Date();
    }

    switch (state) {
      case CONTROLLING:
        control();
        break;
      case FLEEING:
        flee();
        break;
      default: throw new Error(`Unexpected state: ${state}`);
    }

    sprite.update(timeElapsed);
  }

  function render(context) {
    sprite.render(context);
  }

  function onMouseDown(coordinates) {
    setTarget(Vector(coordinates.x, coordinates.y));
    setDestinationCallback();
  }

  function trigger() {}

  function setTarget(newTarget) { target = newTarget; }

  function setDestinationCallback(callback) {
    destinationCallback = callback;
  }

  function control() {
    if (!target) { return; }

    if (Math.abs(target.subtract(sprite.getCenterVector()).getX()) < 2.0) {
      setTarget();
      destinationCallback && destinationCallback();
    } else {
      body.moveBy(body.movementTo(target));
    }
  }

  function flee() {
    if (new Date() - startedFleeing > fleeTimeout) {
      state = CONTROLLING;
    } else {
      let movement = body.movementTo(scene.getTiger().getCenterVector()).dotProduct(-1);
      body.moveBy(movement);
    }
  }
}
