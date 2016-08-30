import { InventoryItem } from './inventoryItem';
import { Sprite } from './sprite';
import { Flint } from './flint';
import { Tree } from './tree';
import { Torch } from './torch';

export function Twig(scene) {
  const inventoryItem = InventoryItem(
    Sprite(scene, './imgs/twig.png', null, null, 30, 60),
    onUse
  );

  const twig = Object.assign({}, inventoryItem, {
    constructor: Twig,
    name: 'Twig',
    trigger,
    ignite
  });

  return twig;

  function onUse(item, coordinates) {
    const ignitionStarter = scene
                              .findObjectsAt(coordinates)
                              .find(object => {
                                return object.constructor == Flint ||
                                       object.constructor == Tree &&
                                       object.lightSource.enabled;
                              });

    if (ignitionStarter) {
      ignite();
    }
  }

  function ignite() {
    scene.getInventory().remove(twig);
    scene.getInventory().push(Torch(scene));
    scene.getPlayer().setSpeech("I am the lightbringer! I carry the Sun, fear me!");
  }

  function trigger(event, coordinates) {
    inventoryItem.trigger(event, coordinates);

    switch (event) {
      case 'hover':
        let actionStatus = 'Use Twig';

        if (twig.isDragging()) {
          const objectUnderCursor = scene.findObjectsAt(coordinates, true).find(object => object != twig);
          if (objectUnderCursor) {
            actionStatus += ` on ${objectUnderCursor.name}`;
          }
        }

        scene.setActionStatus(actionStatus);

        break;
    }
  }
}
