import Ground from '../entity/Ground';
import Phaser from 'phaser'

const numberOfFrames = 15;

export default class MoonlightScene extends Phaser.Scene {
  constructor() {
    super('MoonlightScene');

    this.createBackgroundElement = this.createBackgroundElement.bind(this);
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITES HERE >>
    this.load.image('ground', 'assets/sprites/ground-juan-test.png');

    //preload background
    this.load.image("back", "assets/backgrounds/moonlight_scene/back.png");
    this.load.image("far", "assets/backgrounds/moonlight_scene/far.png");
    this.load.image("middle", "assets/backgrounds/moonlight_scene/middle.png");
    this.load.image("near", "assets/backgrounds/moonlight_scene/near.png");
    this.load.image("front", "assets/backgrounds/moonlight_scene/front.png");
    this.load.image("road", "assets/backgrounds/synthwave_scene/road.png");

    // Preload Sounds
    // << LOAD SOUNDS HERE >>
    this.load.audio('background-music', 'assets/audio/moonlight_scene/moonlight.wav');
  }

  createGround(tileWidth, count) {
    const height = this.game.config.height;
    for (let i=0; i<count; i++) {
      this.groundGroup.create(i*tileWidth, height, 'road').setOrigin(0, 1).setScale(3.5).refreshBody();
    }
  }

  createBackgroundElement(imageWidth, texture, count, scrollFactor) {
    const height = this.game.config.height;
    for (let i=0; i<count; i++) {
      this.add.image(i*imageWidth, height*10/11, texture).setOrigin(0, 1).setScale(3.5).setScrollFactor(scrollFactor)
    }
  }

  create() {
    //mute the previous scene
    this.game.sound.stopAll();

    //Set up background
    const width = this.game.config.width;
    const height = this.game.config.height;
    this.add.image(width * 0.5, height * 0.46, 'back').setOrigin(0.5).setScale(3.5).setScrollFactor(0)
    this.createBackgroundElement(32*3.5, 'far', 8*numberOfFrames, 0.1)
    this.createBackgroundElement(96*3.5, 'middle', 3*numberOfFrames, 0.2)
    this.createBackgroundElement(112*3.5, 'near', 2*numberOfFrames, 0.3)
    this.createBackgroundElement(96*3.5, 'front', 3*numberOfFrames, 0.4)

    this.groundGroup = this.physics.add.staticGroup({ classType: Ground });
    this.createGround(168, 5*numberOfFrames);

    // Create game entities
    // << CREATE GAME ENTITIES HERE >>
    // Create sounds
    // << CREATE SOUNDS HERE >>
    this.backgroundSound = this.sound.add('background-music'); //add background music for this level
    this.backgroundSound.setLoop(true);
    this.backgroundSound.volume = 0.1;
    this.backgroundSound.play();

    this.sound.pauseOnBlur = false; //prevent sound from cutting when you leave tab

    // Create collisions for all entities
    // << CREATE COLLISIONS HERE >>
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>

  }


}
