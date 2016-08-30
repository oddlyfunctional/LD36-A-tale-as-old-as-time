import { Sprite } from './sprite';
import { Trigger } from './trigger';
import { Rock } from './rock';

export function PileOfRocks(scene, x, y) {
  const triggerObject = Trigger(Sprite(scene, '/imgs/pile-of-rocks.png', x, y - 50, 100, 50), (trigger) => {
    scene.getPlayer().setTarget(
      trigger.getCenterVector(),
      () => {
        if (scene.getInventory().push(Rock(scene))) {
          scene.getPlayer().setSpeech("There is not a thing as too many rocks.");
        } else {
          scene.getPlayer().setSpeech("I can't carry any more rocks, they are too heavy. :(");
        }
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
