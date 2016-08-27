import { Player } from './player';
import { Illuminated } from './vendors/illuminated';
const { Lamp, Lighting, DarkMask, Vec2 } = Illuminated;

export function Scene(canvas) {
  const player = Player(0, 0);
  let targets = []; 
  let sprites = [player];

  let lightSources = [
    new Lamp({
      position: new Vec2(canvas.width / 2, canvas.height / 2),
      distance: 100,  
      diffuse: 0.8,  
      color: 'rgba(250,220,150,0.8)',  
      radius: 20,  
      samples: 1,  
    }),

    new Lamp({
      position: new Vec2(20, 30),
      color: "rgba(220,160,0,0.5)",
      radius: 0,
      samples: 1,
    }),

    new Lamp({
      position: new Vec2(200, 100),
      color: "rgba(0,0,255,0.5)",
      radius: 0,
      samples: 1,
    })
  ];
  window.Illuminated = Illuminated;
  window.lightSources = lightSources;

  let lightings = [
    new Lighting({
      light: lightSources[0],
      objects: []
    }),

    new Lighting({
      light: lightSources[1],
      objects: []
    }),
    new Lighting({
      light: lightSources[2],
      objects: []
    })
  ];

  let darkmask = new DarkMask({ 
    lights: lightSources
  })

  return {
    update,
    render,
    onMouseDown,
    onMouseMove
  };

  function update(timeElapsed) {
    player.update(timeElapsed);
  }

  function render(context) {
    player.render(context);

    //lightings.forEach(lighting => lighting.compute(context.canvas.width, context.canvas.height));
    darkmask.compute(context.canvas.width, context.canvas.height);

    renderLights(context);
    renderDark(context);
  }

  function onMouseDown(coordinates) {
    player.onMouseDown(coordinates);
  }

  function onMouseMove(coordinates) {
    if (targets.find((target) => target.contains(coordinates))) {
      canvas.classList.add('pointer');
    } else {
      canvas.classList.remove('pointer');
    }
  }

  function renderLights(context) {
    context.save();
    context.globalCompositeOperation = "lighter";

    // TODO: Make it work with the lightings to be able to cast shadows
    lightSources.forEach((lightSource) => {
      lightSource.render(context);
    });
    context.restore();
  }

  function renderDark(context) {
    context.save();
    context.globalCompositeOperation = "source-over";
    darkmask.render(context);
    context.restore();
  }
}
