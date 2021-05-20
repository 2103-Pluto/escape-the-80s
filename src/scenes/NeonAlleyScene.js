import Ground from '../entity/Ground';
import Phaser from 'phaser'
import SoldierPlayer from '../entity/SoldierPlayer'

const numberOfFrames = 3;

export default class NeonAlleyScene extends Phaser.Scene {
  constructor() {
    super('NeonAlleyScene');

    //bind functions
    this.createBackgroundElement = this.createBackgroundElement.bind(this);
    this.preloadSounds = this.preloadSounds.bind(this)
    this.preloadMap = this.preloadMap.bind(this)
    this.createMap = this.createMap.bind(this)
    this.createPhysics = this.createPhysics.bind(this)
  }

  init(data) {
    this.initialScore = data.score,
    this.initialHealth = data.health,
    this.color = data.color
  }

  preloadSounds() {
    this.load.audio('background-music-neon-alley', 'assets/audio/neon_alley_scene/neon-alley.wav');
  }

  preloadMap() {
    this.load.image("back", "assets/backgrounds/neon_alley_scene/back.png");
    this.load.image("middle", "assets/backgrounds/neon_alley_scene/middle.png");
    this.load.image("front", "assets/backgrounds/neon_alley_scene/front.png");
  }

  preload() {
    this.scene.get('TitleScene').displayLoadingBar(this, "I want my MTV!")
    this.preloadSounds();
    this.preloadMap()
  }

  createGround(tileWidth, count) {
    for (let i=0; i<count; i++) {
      this.groundGroup.create(i*tileWidth, this.height, 'road').setOrigin(0, 1).setScale(3.5).refreshBody();
    }
  }

  createBackgroundElement(imageWidth, texture, count, scrollFactor, posX, posY, height, factor) {
    for (let i=0; i<count; i++) {
      this.add.image(i*imageWidth*factor, height, texture).setOrigin(posX, posY).setScale(3.5).setScrollFactor(scrollFactor)
    }
  }

  create() {
    this.height = this.game.config.height;
    this.width = this.game.config.width;

     //---------->These shoulds be in order
    this.createSounds()
    this.createMap()
    this.createPlayer(this)
    this.createPhysics(this)
    //<-----------
  }

  createMap() {
    this.createBackgroundElement(128*3.5, 'back', 2, 0, 0, 0, 0, 1)
    this.createBackgroundElement(128*3.5, 'middle', 2*numberOfFrames, 0.25, 0, 1, this.height, 1)
    this.createBackgroundElement(176*3.5, 'front', 3, 0.5, 0, 1, this.height, 5)
    // this.createBackgroundElement(448, 'palms', 2*numberOfFrames, 0.75)

    this.groundGroup = this.physics.add.staticGroup();
    this.createGround(168, 5*numberOfFrames);
    this.physics.world.setBounds(0, null, this.width * numberOfFrames, this.height, true, true, false, false)
  }

  createSounds() {
    //mute the previous scene
    this.game.sound.stopAll();
    this.backgroundSound = this.sound.add('background-music-neon-alley');
    //add background music for this level
    this.backgroundSound.setLoop(true);
    this.backgroundSound.volume = 0.1;
    this.backgroundSound.play();

    this.sound.pauseOnBlur = false;
  }

  createPhysics(scene) {
    scene.player.setCollideWorldBounds(true);
    scene.physics.add.collider(scene.player, scene.groundGroup)
  }

  createPlayer(scene) {
    scene.player = new SoldierPlayer(scene, 200, 310, `${scene.color}SoldierIdle`, scene.socket, scene.color).setSize(14, 32).setOffset(15, 7).setScale(2.78);
  }

}
