import Ground from '../entity/Ground';
import Phaser from 'phaser'

const numberOfFrames = 15;

export default class SkyLineScene extends Phaser.Scene {
  constructor() {
    super('SkyLineScene');

    this.createBackgroundElement = this.createBackgroundElement.bind(this);
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITES HERE >>

    this.load.image('ground', 'assets/sprites/ground-juan-test.png');

    //preload background
    this.load.image("back", "assets/backgrounds/sky_line_scene/back.png");
    this.load.image("front", "assets/backgrounds/sky_line_scene/front.png");
    this.load.image("mid", "assets/backgrounds/sky_line_scene/mid.png");
    this.load.image("road", "assets/backgrounds/synthwave_scene/road.png");

    // Preload Sounds
    // << LOAD SOUNDS HERE >>
    this.load.audio('background-music', 'assets/audio/sky_line_scene/sky-lines.wav');
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
      this.add.image(i*imageWidth, 0, texture).setOrigin(0, 0).setScale(3.5).setScrollFactor(scrollFactor)
    }
  }

  create() {
    //mute the previous scene
    this.game.sound.stopAll();

    //Set up background
    const width = this.game.config.width;
    const height = this.game.config.height;
    this.createBackgroundElement(64*3.5, 'back', 4*numberOfFrames, 0)
    this.createBackgroundElement(192*3.5, 'mid', 2*numberOfFrames, 0.15)
    this.createBackgroundElement(272*3.5, 'front', 1*numberOfFrames, 0.3)

    this.groundGroup = this.physics.add.staticGroup({ classType: Ground });
    this.createGround(168, 5*numberOfFrames);


    // Create sounds
    // << CREATE SOUNDS HERE >>
    this.backgroundSound = this.sound.add('background-music'); //add background music for this level
    this.backgroundSound.setLoop(true);
    this.backgroundSound.volume = 0.1;
    this.backgroundSound.play();

    this.sound.pauseOnBlur = false; //prevent sound from cutting when you leave tab
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {

  }

}
