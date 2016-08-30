import { InventoryItem } from './inventoryItem';
import { Sprite } from './sprite';
import { Tree } from './tree';
import { Twig } from './twig';

export function Flint(scene) {
  const inventoryItem = InventoryItem(
    Sprite(scene, './imgs/flint.png', null, null, 50, 50),
    onUse
  );

  const flint = Object.assign({}, inventoryItem, {
    constructor: Flint,
    trigger
  });

  return flint;

  function onUse(item, coordinates) {
    const objects = scene.findObjectsAt(coordinates);
    const tree = objects.find(object => object.constructor == Tree);

    if (tree) {
      scene.getPlayer().setTarget(
        tree.getCenterVector(),
        () => {
          tree.lightSource.setEnabled(true);
          scene.getPlayer().setSpeech("Let there be light! Hmm, I like the sound of that.");
        }
      );
    }

    const twig = objects.find(object => object.constructor == Twig);
    if (twig) {
      twig.ignite();
    }
  }

  function trigger(event, coordinates) {
    inventoryItem.trigger(event, coordinates);

    switch (event) {
      case 'hover':
        let actionStatus = 'Use Lighter';

        if (flint.isDragging()) {
          const objectUnderCursor = scene.findObjectsAt(coordinates, true).find(object => object != flint);
          if (objectUnderCursor) {
            actionStatus += ` on ${objectUnderCursor.name}`;
          }
        }

        scene.setActionStatus(actionStatus);

        break;
    }
  }
}
