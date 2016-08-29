import { Vector } from './vector';
import { Illuminated } from './vendors/illuminated';
const { Vec2, PolygonObject } = Illuminated;

export function Sprite(scene, spritesheet, x, y, width, height) {
  let flipped = 1;
  let image = new Image();
  let loaded = false;
  image.onload = function() {
    loaded = true;
  };

  image.src = spritesheet;

  const sprite = {
    constructor: Sprite,
    clickable: false,
    move,
    update,
    render,
    top,
    right,
    bottom,
    left,
    getX,
    getY,
    getCenterX,
    getCenterY,
    getWidth,
    getHeight,
    setCenterX,
    setCenterY,
    getCenterVector,
    contains,
    getOpaqueObject,
    trigger,
    copy,
    destroy,
    isEqual,
    getSprite,
    setFlipped,
    overlaps
  };

  return sprite;

  function move(deltaX, deltaY) {
    x += deltaX;
    y += deltaY;
  }

  function update() {}

  function render(context) {
    if (!loaded) return;
    context.save();
    context.translate(x, y);
    context.scale(flipped, 1);
    context.drawImage(image, 0, 0, width * flipped, height);

    if (window.DEBUG == true) {
      context.beginPath();
      context.lineWidth = "1";
      context.strokeStyle = "red";
      context.rect(0, 0, width * flipped, height);
      context.stroke();
    }
    context.restore();
  }

  function getX() { return x; }
  function getY() { return y; }
  function getCenterX() { return getCenterVector().getX(); }
  function getCenterY() { return getCenterVector().getY(); }
  function getWidth() { return width; }
  function getHeight() { return height; }

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

  function copy() {
    return Sprite(scene, spritesheet, x, y, width, height);
  }

  function destroy() {
    scene.remove(sprite);
  }

  function getSprite() {
    return sprite;
  }

  function isEqual(object) {
    return object.getSprite() == getSprite();
  }

  function setFlipped(newFlipped) {
    flipped = newFlipped || flipped;
  }

  function overlaps(sprite) {
    return !(sprite.right() < left() ||
             sprite.left() > right() ||
             sprite.bottom() < top() ||
             sprite.top() > bottom());
  }
}
