import { InventoryItem } from './inventoryItem';
import { Sprite } from './sprite';

export function Flint(scene) {
  return InventoryItem(
    Sprite(scene, '/imgs/flint.png', null, null, 50, 50),
    onUse
  );

  function onUse() {
    console.log('and there be light');
  }
}
