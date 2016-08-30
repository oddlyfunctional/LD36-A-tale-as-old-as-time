import { Sprite } from './sprite';

export function Tree(scene, lightSource, x, y) {
  const tree = Sprite(scene, './imgs/tree.png', x, y, 200, 300, 200, 300, {
    dry: {
      frames: [0],
      speed: 0
    },

    burning: {
      frames: [1, 2],
      speed: 1000,
      loop: true
    }
  });
  tree.setAnimation('dry');

  return Object.assign({}, tree, {
    constructor: Tree,
    name: 'Tree',
    lightSource
  });
}
