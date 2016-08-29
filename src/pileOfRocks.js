import { Sprite } from './sprite';
import { Trigger } from './trigger';
import { Rock } from './rock';

export function PileOfRocks(scene, x, y) {
  const triggerObject = Trigger(Sprite(scene, '/imgs/pile-of-rocks.png', x, y - 50, 100, 50), (trigger) => {
    scene.getPlayer().setTarget(
      trigger.getCenterVector(),
      () => {
        scene.getInventory().push(Rock(scene));
      }
    );
  });

  const pileOfRocks = Object.assign({}, triggerObject, {
    constructor: PileOfRocks,
    name: 'Pile of Rocks',
    trigger
  });

  return pileOfRocks;

  function trigger(event, coordinates) {
    triggerObject.trigger(event, coordinates);

    switch (event) {
      case 'hover':
        scene.setActionStatus('Pick up Rock');
        break;
    }
  }
}
