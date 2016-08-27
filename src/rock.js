import { InventoryItem } from './inventoryItem';
import { Sprite } from './sprite';

export function Rock(scene) {
  return InventoryItem(
    Sprite('/imgs/rock.png', null, null, 24, 24),
    (item, coordinates) => {
      let object = scene
                     .findObjectsAt(coordinates)
                     .filter(object => object !== item)[0];

      if (object != null) {
        console.log("rock encountered object: ", object, item);
      }
    }
  )
}
