import { InventoryItem } from './inventoryItem';
import { Sprite } from './sprite';
import { Vector } from './vector';
import { Projectile } from './projectile';
import { Tiger } from './tiger';
import { PileOfRocks } from './pileOfRocks';
import { Flint } from './flint';

export function Rock(scene) {
  const MAX_DISTANCE = 300;
  const inventoryItem = InventoryItem(
    Sprite(scene, '/imgs/rock.png', null, null, 24, 24),
    onUse
  );

  const rock = Object.assign({}, inventoryItem, {
    constructor: Rock
  });

  return rock;

  function onUse(item, coordinates) {
    scene.getInventory().remove(rock);

    let anotherRock = scene
                        .findObjectsAt(coordinates)
                        .find(object => object.constructor === Rock && object !== item);

    if (anotherRock) {
      scene.getInventory().remove(anotherRock);
      scene.getInventory().push(Flint(scene));
      return;
    }

    let projectileSprite = item.getSprite().copy();
    let player = scene.getPlayer();
    projectileSprite.setCenterX(player.getCenterX());
    projectileSprite.setCenterY(player.getCenterY() - 50);
    let difference = coordinates.x - projectileSprite.getCenterX();
    if (Math.abs(difference) > MAX_DISTANCE) {
      coordinates.x = projectileSprite.getCenterX() + MAX_DISTANCE * Math.sign(difference);
    }

    scene.add(
      Projectile(
        scene,
        projectileSprite,
        Vector(coordinates.x, coordinates.y),
        (hitObjects) => {
          //const hitObjects = scene.findObjectsAt(coordinates);
          const tiger = hitObjects.find(object => object.constructor == Tiger);
          if (tiger) {
            console.log("Hit the eye of the tiger!")
            tiger.setFleeing();
          }

          const pileOfRocks = hitObjects.find(object => object.constructor == PileOfRocks);
          if (pileOfRocks) {
            let lightSourcesNearby = scene.lightSourcesInRadius(pileOfRocks.getCenterVector(), 100);
            lightSourcesNearby.forEach(light => light.enabled = true);
          }
        }
      )
    );
  }
}
