import { InventoryItem } from './inventoryItem';
import { Sprite } from './sprite';
import { Vector } from './vector';
import { Projectile } from './projectile';
import { Tiger } from './tiger';

export function Rock(scene) {
  const MAX_DISTANCE = 300;
  const inventoryItem = InventoryItem(
    Sprite(scene, '/imgs/rock.png', null, null, 24, 24),
    onUse
  );

  return inventoryItem;

  function onUse(item, coordinates) {
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
    let difference = coordinates.x - projectileSprite.getCenterX();
    if (Math.abs(difference) > MAX_DISTANCE) {
      coordinates.x = projectileSprite.getCenterX() + MAX_DISTANCE * Math.sign(difference);
    }

    scene.add(
      Projectile(
        projectileSprite,
        Vector(coordinates.x, coordinates.y),
        () => {
          const hitObjects = scene.findObjectsAt(coordinates);
          const tiger = hitObjects.find(object => object.constructor == Tiger);
          if (tiger) {
            console.log("Hit the eye of the tiger!")
            tiger.setFleeing();
          }
        }
      )
    );

    scene.getInventory().remove(inventoryItem);
  }
}
