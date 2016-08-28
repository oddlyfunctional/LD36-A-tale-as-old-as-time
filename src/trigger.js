export function Trigger(sprite, onClick) {
  const self = Object.assign({}, sprite, {
    constructor: Trigger,
    clickable: true,
    trigger
  });

  return self;

  function trigger(event) {
    switch (event) {
      case 'click': onClick(self);
    }
  }
}
