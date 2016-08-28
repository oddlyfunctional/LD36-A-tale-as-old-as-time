import { Sprite } from './sprite';
import { Item } from './item';
import { Rock } from './rock';

export function PileOfRocks(scene, x, y) {
  const item = Item(Sprite(scene, '/imgs/pile-of-rocks.png', x, y - 50, 100, 50), (item) => {
    scene.getPlayer().setTarget(
      item.getCenterVector(),
      () => {
        scene.getInventory().push(Rock(scene));
      }
    );
  });

  return Object.assign({}, item, {
    constructor: PileOfRocks
  });
}
