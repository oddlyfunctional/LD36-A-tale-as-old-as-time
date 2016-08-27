export function Inventory(maxItems) {
  let items = [];

  return {
    push,
    concat,
    find,
    remove
  };

  function push(item) {
    if (items.length < maxItems) {
      items = items.concat([item]);
      calculateIndexes();
      return true;
    }
  }

  function concat(array) {
    return [].concat(array).concat(items);
  }

  function find(fn) {
    return items.find(fn);
  }

  function remove(item) {
    items = items.filter(i => i !== item);
    calculateIndexes();
  }

  function calculateIndexes() {
    items.forEach((item, index) => item.setIndex(index));
  }
}
