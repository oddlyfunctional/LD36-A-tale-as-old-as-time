import { Trigger } from './trigger';
import { Sprite } from './sprite';
import { Twig } from './twig';

export function TwigTrigger(scene, x, y) {
  const triggerObject = Trigger(Sprite(scene, '/imgs/twig.png', x, y - 50, 30, 60), (item) => {
    scene.getPlayer().setTarget(
      item.getCenterVector(),
      () => {
        scene.remove(twigTrigger);
        scene.getInventory().push(Twig(scene));
      }
    );
  });

  const twigTrigger = Object.assign({}, triggerObject, {
    constructor: TwigTrigger,
    name: 'Twig',
    trigger
  });

  return twigTrigger;

  function trigger(event) {
    triggerObject.trigger(event);

    switch (event) {
      case 'hover':
        scene.setActionStatus('Pick up Twig');
        break;
    }
  }
}
