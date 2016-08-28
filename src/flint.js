import { InventoryItem } from './inventoryItem';
import { Sprite } from './sprite';
import { Tree } from './tree';

export function Flint(scene) {
  return InventoryItem(
    Sprite(scene, '/imgs/flint.png', null, null, 50, 50),
    onUse
  );

  function onUse(item, coordinates) {
    const tree = scene.findObjectsAt(coordinates).find(object => object.constructor == Tree);

    if (tree) {
      scene.getPlayer().setTarget(
        tree.getCenterVector(),
        () => {
          let lightSourcesNearby = scene.lightSourcesInRadius(tree.getCenterVector(), 100);
          lightSourcesNearby.forEach(light => light.enabled = true);
        }
      );
    }
  }
}
