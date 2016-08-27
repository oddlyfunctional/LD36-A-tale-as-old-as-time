export function Inventory(maxItems) {
  let items = [];

  return {
    push,
    concat,
    find
  };

  function push(item) {
    if (items.length < maxItems) {
      items.push(item);
      item.setIndex(items.length - 1);
      return true;
    }
  }

  function concat(array) {
    return [].concat(array).concat(items);
  }

  function find(fn) {
    return items.find(fn);
  }
}
