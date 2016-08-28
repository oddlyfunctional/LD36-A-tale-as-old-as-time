import { Player } from './player';
import { Sprite } from './sprite';
import { Vector } from './vector';
import { Inventory } from './inventory';
import { InventoryItem } from './inventoryItem';
import { Rock } from './rock';
import { PileOfRocks } from './pileOfRocks';
import { Tiger } from './tiger';
import { Tree } from './tree';
import { TwigTrigger } from './twigTrigger';
import { Illuminated } from './vendors/illuminated';
const { Lamp, Lighting, DarkMask, Vec2 } = Illuminated;

export function Scene(canvas) {
  const scene = {
    constructor: Scene,
    update,
    render,
    onMouseDown,
    onMouseMove,
    findObjectsAt,
    add,
    remove,
    getPlayer,
    getTiger,
    getInventory,
    getCanvas,
    overlappingObjectsWith,
    lightSourcesInRadius
  };

  const FLOOR = 350;
  const player = Player(scene, 600, FLOOR);
  player.setTarget(Vector(1100, FLOOR));

  const inventory = Inventory(4);
  const pilesOfRocks = [
    PileOfRocks(scene, 1050, FLOOR),
    PileOfRocks(scene, 700, FLOOR)
  ];

  const twigTrigger = TwigTrigger(scene, 500, FLOOR);

  const lightSources = [
    createLightSource(1100, FLOOR - 150),
    createLightSource(700, FLOOR - 150),
    createLightSource(500, FLOOR - 150)
  ];
  const trees = lightSources.map(light => Tree(scene, light, light.position.x - 100, light.position.y - 150));

  let initialLightSource = lightSources[0];

  //let lightings = [
  //  new Lighting({
  //    light: lightSources[0],
  //    objects: []
  //  }),
  //];

  let darkmask = new DarkMask({ 
    lights: lightSources
  })

  const tiger = Tiger(scene, 0, FLOOR, player, lightSources);

  let targets = [twigTrigger].concat(pilesOfRocks); 
  let objects = trees.concat([player, tiger, twigTrigger]).concat(pilesOfRocks);

  return scene;

  function update(timeElapsed) {
    if (
      !initialLightSource.enabled &&
      Math.abs(initialLightSource.position.x - player.getCenterX()) < 100
    ) {
      initialLightSource.enabled = true;
    }

    inventory.concat(objects).forEach(object => object.update(timeElapsed));

    let distance = 90 + Math.sin(Date.now() * 0.001) * 10;
    lightSources.filter(light => light.enabled).forEach(light => light.distance = distance);
  }

  function render(context) {
    objects.forEach(sprite => sprite.render(context));

    //lightings.forEach(lighting => lighting.compute(context.canvas.width, context.canvas.height));
    darkmask.compute(context.canvas.width, context.canvas.height);

    renderLights(context);
    renderDark(context);

    inventory.forEach((item) => item.render(context));

    if (window.DEBUG) {
      context.save();
      context.font = "14px Monospace";
      context.fillStyle = "white";
      context.fillText("Player: " + player.getCenterVector().toString(), 10, 25);
      context.restore();
    }
  }

  function onMouseDown(coordinates) {
    let dragged = inventory.find(item => item.isDragging());
    if (dragged) {
      dragged.trigger('drop', coordinates);
    } else {
      let clicked = findObjectsAt(coordinates).filter(object => object.clickable)[0];
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
    lightSources.filter(light => light.enabled).forEach((lightSource) => {
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

  function createLightSource(x, y, enabled = false) {
    return new Lamp({
      position: new Vec2(x, y),
      distance: 0,
      color: 'rgba(250,220,100,0.8)',
      enabled
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

  function getPlayer() { return player; };
  function getTiger() { return tiger; };
  function getInventory() { return inventory; }
  function getCanvas() { return canvas; }

  function overlappingObjectsWith(sprite) {
    return objects.filter(object => object.overlaps(sprite));
  }

  function lightSourcesInRadius(position, radius) {
    return lightSources.filter(
      light => Math.abs(light.position.x - position.getX()) <= radius
    );
  }
}
