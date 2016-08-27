import { InventoryItem } from './inventoryItem';
import { Sprite } from './sprite';
import { Vector } from './vector';
import { Projectile } from './projectile';

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

      let projectileSprite = item.getSprite().copy();
      let player = scene.getPlayer();
      projectileSprite.setCenterX(player.getCenterX());
      projectileSprite.setCenterY(player.getCenterY());

      scene.add(
        Projectile(
          projectileSprite,
          Vector(coordinates.x, coordinates.y)
        )
      );
    }
  )
}
