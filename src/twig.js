import { InventoryItem } from './inventoryItem';
import { Sprite } from './sprite';
import { Flint } from './flint';
import { Tree } from './tree';

export function Twig(scene) {
  const inventoryItem = InventoryItem(
    Sprite(scene, '/imgs/twig.png', null, null, 30, 60),
    onUse
  );

  const twig = Object.assign({}, inventoryItem, {
    constructor: Twig,
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
    console.log("igniting");
  }
}
