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
    name: 'Sprite',
    move,
    update,
    render,
    getX,
    getY,
    setCenterX,
    setCenterY,
    getCenterVector,
    contains,
    getOpaqueObject,
    trigger
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

  function setCenterX(centerX) {
    x = centerX - width / 2;
  }

  function setCenterY(centerY) {
    y = centerY - height / 2;
  }

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

  // TODO: Calculate opaque object for shadow-casting
  function getOpaqueObject() {
    var from = new Vec2(left(), top());
    var to = new Vec2(right(), bottom());
    return new PolygonObject({ points: [from, to] });
  }

  function trigger() {}
}
