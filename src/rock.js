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
    Sprite(scene, './imgs/rock.png', null, null, 24, 24),
    onUse
  );

  const rock = Object.assign({}, inventoryItem, {
    constructor: Rock,
    name: 'Rock',
    trigger
  });

  return rock;

  function onUse(item, coordinates) {
    scene.getInventory().remove(rock);
    let player = scene.getPlayer();

    let anotherRock = scene
                        .findObjectsAt(coordinates)
                        .find(object => object.constructor === Rock && object !== item);

    if (anotherRock) {
      scene.getInventory().remove(anotherRock);
      scene.getInventory().push(Flint(scene));
      player.setSpeech('Two rocks are better than one.');
      return;
    }

    let projectileSprite = item.getSprite().copy();
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
            player.setSpeech('It hit the eye of the tiger!');
            tiger.setFleeing();
          }

          const pileOfRocks = hitObjects.find(object => object.constructor == PileOfRocks);
          if (pileOfRocks) {
            let lightSourcesNearby = scene.lightSourcesInRadius(pileOfRocks.getCenterVector(), 100);
            lightSourcesNearby.forEach(light => light.setEnabled(true));
          }
        }
      )
    );
  }

  function trigger(event, coordinates) {
    inventoryItem.trigger(event, coordinates);

    switch (event) {
      case 'hover':
        scene.setActionStatus(rock.isDragging() ? 'Throw Rock' : 'Use Rock');
        break;
    }
  }
}
