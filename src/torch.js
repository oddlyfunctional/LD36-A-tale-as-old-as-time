import { InventoryItem } from './inventoryItem';
import { Sprite } from './sprite';
import { Illuminated } from './vendors/illuminated';
const { Lamp, Lighting, DarkMask, Vec2 } = Illuminated;

export function Torch(scene) {
  const inventoryItem = InventoryItem(
    Sprite(scene, './imgs/torch.png', null, null, 30, 60),
    onUse
  );

  const torch = Object.assign({}, inventoryItem, {
    constructor: Torch,
    update
  });

  const player = scene.getPlayer();
  const lightSource = new Lamp({
    position: new Vec2(player.getCenterX(), player.getCenterY()),
    distance: 0,
    color: 'rgba(250,220,100,0.8)',
    enabled: true
  });

  scene.getLightSources().push(lightSource);

  return torch;

  function onUse(item, coordinates) {}

  function update() {
    lightSource.position.x = player.getCenterX();
    lightSource.position.y = player.getCenterY();
  }
}
