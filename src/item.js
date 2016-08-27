export function Item(sprite, onClick) {
  let item = Object.assign({}, sprite, {
    trigger
  });

  return item;

  function trigger(event) {
    switch (event) {
      case 'click': onClick(item);
    }
  }
}
