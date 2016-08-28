import { Sprite } from './sprite';
import { Trigger } from './trigger';
import { Rock } from './rock';

export function PileOfRocks(scene, x, y) {
  const trigger = Trigger(Sprite(scene, '/imgs/pile-of-rocks.png', x, y - 50, 100, 50), (trigger) => {
    scene.getPlayer().setTarget(
      trigger.getCenterVector(),
      () => {
        scene.getInventory().push(Rock(scene));
      }
    );
  });

  return Object.assign({}, trigger, {
    constructor: PileOfRocks
  });
}
