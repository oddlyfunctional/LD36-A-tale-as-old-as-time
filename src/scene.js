import { Player } from './player';
import { Item } from './item';
import { Sprite } from './sprite';
import { Inventory } from './inventory';
import { InventoryItem } from './inventoryItem';
import { Rock } from './rock';
import { Tiger } from './tiger';
import { Illuminated } from './vendors/illuminated';
const { Lamp, Lighting, DarkMask, Vec2 } = Illuminated;

export function Scene(canvas) {
  const scene = {
    update,
    render,
    onMouseDown,
    onMouseMove,
    findObjectsAt,
    add,
    remove,
    getPlayer,
    getInventory
  };

  const FLOOR = 200;
  const player = Player(scene, 0, FLOOR);
  const inventory = Inventory(4);
  const rock = Item(Sprite(scene, '/imgs/rock.png', 100, FLOOR - 24, 24, 24), (item) => {
    player.setTarget(item.getCenterVector());
    player.setDestinationCallback(() => {
      inventory.push(Rock(scene));
    });
  });

  let lightSources = [createLightSource(200, FLOOR)];

  //let lightings = [
  //  new Lighting({
  //    light: lightSources[0],
  //    objects: []
  //  }),
  //];

  let darkmask = new DarkMask({ 
    lights: lightSources
  })

  const tiger = Tiger(scene, 400, FLOOR, player, lightSources);

  let targets = [rock]; 
  let objects = [player, rock, tiger];

  return scene;

  function update(timeElapsed) {
    inventory.concat(objects).forEach(object => object.update(timeElapsed));
  }

  function render(context) {
    inventory.concat(objects).forEach(sprite => sprite.render(context));

    //lightings.forEach(lighting => lighting.compute(context.canvas.width, context.canvas.height));
    darkmask.compute(context.canvas.width, context.canvas.height);

    renderLights(context);
    renderDark(context);
  }

  function onMouseDown(coordinates) {
    let dragged = inventory.find(item => item.isDragging());
    if (dragged) {
      dragged.trigger('drop', coordinates);
    } else {
      let clicked = findObjectsAt(coordinates)[0];
      if (clicked) {
        clicked.trigger('click', coordinates);
      } else {
        player.onMouseDown(coordinates);
      }
    }
  }

  function onMouseMove(coordinates) {
    if (inventory.concat(targets).find((target) => target.contains(coordinates))) {
      canvas.classList.add('pointer');
    } else {
      canvas.classList.remove('pointer');
    }

    inventory.concat(objects).forEach(object => object.trigger('mousemove', coordinates));
  }

  function renderLights(context) {
    context.save();
    context.globalCompositeOperation = "lighter";

    // TODO: Make it work with the lightings to be able to cast shadows
    lightSources.forEach((lightSource) => {
      lightSource.render(context);
    });
    context.restore();
  }

  function renderDark(context) {
    context.save();
    context.globalCompositeOperation = "source-over";
    darkmask.render(context);
    context.restore();
  }

  function createLightSource(x, y) {
    return new Lamp({
      position: new Vec2(x, y),
      distance: 100,  
      color: 'rgba(250,220,150,0.8)'
    });
  }

  function findObjectsAt(coordinates) {
    return inventory
             .concat(objects)
             .filter(object => object !== player)
             .filter(object => object.contains(coordinates));
  }

  function add(object) {
    objects = objects.concat([object]);
  }

  function remove(object) {
    objects = objects.filter(obj => !obj.isEqual(object));
  }

  function getPlayer() { return player };

  function getInventory() { return inventory; }
}
