export function Item(sprite, onClick) {
  let item = Object.assign({}, sprite, {
    constructor: Item,
    trigger
  });

  return item;

  function trigger(event) {
    switch (event) {
      case 'click': onClick(item);
    }
  }
}
