import { Trigger } from './trigger';
import { Sprite } from './sprite';
import { Twig } from './twig';

export function TwigTrigger(scene, x, y) {
  const trigger = Trigger(Sprite(scene, '/imgs/twig.png', x, y - 50, 30, 60), (item) => {
    scene.getPlayer().setTarget(
      item.getCenterVector(),
      () => {
        scene.remove(twigTrigger);
        scene.getInventory().push(Twig(scene));
      }
    );
  });

  const twigTrigger = Object.assign({}, trigger, {
    constructor: TwigTrigger
  });

  return twigTrigger;
}
