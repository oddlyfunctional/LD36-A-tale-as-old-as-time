import { Vector } from './vector';
import { Illuminated } from './vendors/illuminated';
const { Vec2, PolygonObject } = Illuminated;

export function Sprite(spritesheet, x, y, width, height) {
  let image = new Image();
  let loaded = false;
  image.onload = function() {
    loaded = true;
  };

  image.src = spritesheet;

  return {
    move,
    update,
    render,
    getX,
    getY,
    getCenterVector,
    contains,
    getOpaqueObject
  };

  function move(deltaX, deltaY) {
    x += deltaX;
    y += deltaY;
  }

  function update() {}

  function render(context) {
    if (!loaded) return;
    context.drawImage(image, x, y, width, height);
  }

  function getX() { return x; }
  function getY() { return y; }

  function getCenterVector() {
    return Vector(getX() + width / 2, getY() + height / 2);
  }

  function left() { return getX(); }
  function right() { return getX() + width; }
  function top() { return getY(); }
  function bottom() { return getY() + height; }

  function contains(point) {
    return point.x > left() && point.x < right() &&
           point.y > top() && point.y < bottom();
  }

  function getOpaqueObject() {
    var from = new Vec2(left(), top());
    var to = new Vec2(right(), bottom());
    return new PolygonObject({ points: [from, to] });
  }
}
