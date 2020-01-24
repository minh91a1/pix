import World01Scene from "./Scenes/World01Scene.js";
import World02Scene from "./Scenes/World02Scene.js";

const config = {
  type: Phaser.AUTO,
  width: 285,
  height: 160,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  pixelArt: true,
  parent: "game-container",
  backgroundColor: "#1d212d",
  scene: [World01Scene, World02Scene],
  physics: {
    default: "arcade",
    
    arcade: {
      debug: 0,
      gravity: { y: 500 },
    }
  }
};

const game = new Phaser.Game(config);