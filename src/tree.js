import { Sprite } from './sprite';

export function Tree(scene, lightSource, x, y) {
  const tree = Sprite(scene, './imgs/tree.png', x, y, 200, 300);

  return Object.assign({}, tree, {
    constructor: Tree,
    name: 'Tree',
    lightSource
  });
}
