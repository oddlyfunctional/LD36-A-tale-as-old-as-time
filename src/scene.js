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
import { Trigger } from './trigger';
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
    getLightSources,
    overlappingObjectsWith,
    lightSourcesInRadius,
    setActionStatus
  };

  const bgMusic = new Audio('./sounds/bgmusic.mp3');
  bgMusic.loop = true;
  bgMusic.play();

  const FLOOR = 350;
  const background = Sprite(scene, './imgs/background.png', 0, 0, canvas.width, canvas.height);
  const player = Player(scene, 600, FLOOR);
  player.setTarget(Vector(1100, FLOOR));
  player.setSpeech('AHHHHHHHHH!', 3000);
  let gameOver = false;
  let gameStarted = false;

  const inventory = Inventory(4);
  const pilesOfRocks = [
    PileOfRocks(scene, 1050, FLOOR),
    PileOfRocks(scene, 700, FLOOR)
  ];

  const twigTrigger = TwigTrigger(scene, 420, FLOOR + 20);

  const lightSources = [
    createLightSource(1100, FLOOR - 150),
    createLightSource(700, FLOOR - 150),
    createLightSource(500, FLOOR - 150)
  ];
  const trees = lightSources.map(light => Tree(scene, light, light.position.x - 100, light.position.y - 150));
  trees.forEach(tree => {
    const lightSource = tree.lightSource;
    lightSource.isEnabled = () => lightSource.enabled;
    lightSource.setEnabled = value => {
      lightSource.enabled = value;
      tree.setAnimation('burning');
    }
  });

  const initialLightSource = lightSources[0];
  const lightning = Sprite(scene, './imgs/lightning.png', 1050, 0, 100, 300);
  let lightningFinishedAt;
  const lightningDuration = 700;
  let actionStatus = 'Walk to';

  //let lightings = [
  //  new Lighting({
  //    light: lightSources[0],
  //    objects: []
  //  }),
  //];

  let darkmask = new DarkMask({
    lights: lightSources,
    color: 'rgba(0,0,0,0.7)'
  })

  const tiger = Tiger(scene, 0, FLOOR + 20, player, lightSources);

  let targets = [twigTrigger].concat(pilesOfRocks);
  let objects = trees.concat(pilesOfRocks).concat([twigTrigger, player, tiger]);

  return scene;

  function update(timeElapsed) {
    if (
      !initialLightSource.isEnabled() &&
      Math.abs(initialLightSource.position.x - player.getCenterX()) < 100
    ) {
      initialLightSource.setEnabled(true);
      player.setSpeech("WOW! Sun, is that you?");
      lightningFinishedAt = Date.now() + lightningDuration;
      gameStarted = true;
    }

    inventory.concat(objects).forEach(object => object.update(timeElapsed));

    let distance = 120 + Math.sin(Date.now() * 0.001) * 10;
    lightSources.filter(light => light.enabled).forEach(light => light.distance = distance);

    if (player.getX() < 100) {
      gameOver = true;
    }
  }

  function render(context) {
    if (gameOver) {
      context.fillStyle = "black";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.font = "14px Monospace";
      context.fillStyle = "white";
      const gameOverMessage1 = "And so that small hominid conquered the power of the Sun,";
      const gameOverMessage2 = "forever changing the fate of his tribe.";
      context.fillText(gameOverMessage1, canvas.width / 2 - gameOverMessage1.length / 2 * 10, canvas.height / 2 - 14);
      context.fillText(gameOverMessage2, canvas.width / 2 - gameOverMessage2.length / 2 * 10, canvas.height / 2 + 14);

      return;
    }

    background.render(context);
    objects.forEach(sprite => sprite.render(context));

    if (lightningFinishedAt) {
      if (Date.now() <= lightningFinishedAt) {
        lightning.render(context);
      }
    }

    //lightings.forEach(lighting => lighting.compute(context.canvas.width, context.canvas.height));
    darkmask.compute(context.canvas.width, context.canvas.height);

    renderLights(context);
    renderDark(context);

    inventory.forEach((item) => item.render(context));

    context.font = "14px Monospace";
    context.fillStyle = "white";
    context.fillText(actionStatus, canvas.width / 2 - (actionStatus.length / 2) * 14, 250);

    objects.forEach(object => object.renderUI(context));

    if (window.DEBUG) {
      context.save();

      context.font = "14px Monospace";
      context.fillStyle = "white";
      context.fillText("Player: " + player.getCenterVector().toString(), 10, 25);

      context.font = "14px Monospace";
      context.fillStyle = "white";
      context.fillText("Tiger: " + tiger.getCenterVector().toString(), 10, 40);

      context.restore();
    }
  }

  function onMouseDown(coordinates) {
    if (!gameStarted) { return; }

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
    if (!gameStarted) { return; }

    setActionStatus('Walk to');

    inventory
      .concat(objects)
      .filter((target) => target.contains(coordinates))
      .forEach(object => object.trigger('hover', coordinates));

    inventory
      .concat(objects)
      .forEach(object => object.trigger('mousemove', coordinates));
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

  function findObjectsAt(coordinates, includePlayer = false) {
    return inventory
             .concat(objects)
             .filter(object => includePlayer || object !== player)
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
  function getLightSources() { return lightSources; }

  function overlappingObjectsWith(sprite) {
    return objects.filter(object => object.overlaps(sprite));
  }

  function lightSourcesInRadius(position, radius) {
    return lightSources.filter(
      light => Math.abs(light.position.x - position.getX()) <= radius
    );
  }

  function setActionStatus(newActionStatus) {
    actionStatus = newActionStatus;
  }
}
