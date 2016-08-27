import { Sprite } from './sprite';

export function InventoryItem(sprite, onUse) {
  let inventoryOffsetX = 100;
  let inventoryOffsetY = 300;
  let cellWidth = 100;
  let cellHeight = 100;
  let dragging = false;
  let index;

  let inventoryItem = Object.assign({}, sprite, {
    name: 'InventoryItem',
    setIndex,
    trigger,
    isDragging
  });

  return inventoryItem;

  function setIndex(newIndex) {
    index = newIndex;
    sprite.setCenterX(inventoryOffsetX + cellWidth * index + cellWidth / 2);
    sprite.setCenterY(inventoryOffsetY + cellHeight / 2);
  }

  function trigger(eventType, coordinates) {
    switch (eventType) {
      case 'click':
        dragging = true;
        break;
      case 'drop':
        dragging = false;
        setIndex(index);
        onUse(inventoryItem, coordinates);
        break;
      case 'mousemove':
        if (dragging) {
          sprite.setCenterX(coordinates.x);
          sprite.setCenterY(coordinates.y);
        }
        break;
    }
  }

  function isDragging() { return dragging; }
}
