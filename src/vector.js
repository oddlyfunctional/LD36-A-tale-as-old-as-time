export function Vector(x, y) {
  return {
    getX,
    getY,
    magnitude,
    normalize,
    subtract,
    add,
    dotProduct,
    toString
  };

  function getX() { return x; }
  function getY() { return y; }

  function magnitude() {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  }

  function normalize() {
    if (magnitude() > 0) {
      return Vector(x / magnitude(), y / magnitude());
    }

    return Vector(0, 0);
  }

  function subtract(vector) {
    return Vector(x - vector.getX(), y - vector.getY());
  }

  function add(vector) {
    return Vector(x + vector.getX(), y + vector.getY());
  }

  function dotProduct(scalar) {
    return Vector(Math.round(x * scalar), Math.round(y * scalar));
  }

  function toString() {
    return `(${x}, ${y})`;
  }
}
