import { InventoryItem } from './inventoryItem';
import { Sprite } from './sprite';
import { Tree } from './tree';
import { Twig } from './twig';

export function Flint(scene) {
  const inventoryItem = InventoryItem(
    Sprite(scene, '/imgs/flint.png', null, null, 50, 50),
    onUse
  );

  const flint = Object.assign({}, inventoryItem, {
    constructor: Flint
  });

  return flint;

  function onUse(item, coordinates) {
    const objects = scene.findObjectsAt(coordinates);
    const tree = objects.find(object => object.constructor == Tree);

    if (tree) {
      scene.getPlayer().setTarget(
        tree.getCenterVector(),
        () => tree.lightSource.enabled = true
      );
    }

    const twig = objects.find(object => object.constructor == Twig);
    if (twig) {
      twig.ignite();
    }
  }
}
