import Ground from '../entity/Ground';
import Phaser from 'phaser'

const numberOfFrames = 3;

export default class NeonAlleyScene extends Phaser.Scene {
  constructor() {
    super('NeonAlleyScene');
    this.createBackgroundElement = this.createBackgroundElement.bind(this);
    this.preloadBackround = this.preloadBackround.bind(this)
    this.preloadMusic = this.preloadMusic.bind(this)
    this.createSounds = this.createSounds.bind(this)
  }

  init(data) {
    this.initialScore = data.score,
    this.initialHealth = data.health,
    this.color = data.color
  }
  
  preloadBackround() {
    this.load.image("back", "assets/backgrounds/neon_alley_scene/back.png");
    this.load.image("middle", "assets/backgrounds/neon_alley_scene/middle.png");
    this.load.image("front", "assets/backgrounds/neon_alley_scene/front.png");
    this.load.image("road", "assets/backgrounds/synthwave_scene/road.png");
  }
  
  preloadMusic() {
    this.load.audio('mfn-reagan', 'assets/audio/MoneyForNothingWReagan.wav');
    this.load.audio('mfn-no-reagan', 'assets/audio/MoneyForNothing-small.wav')
    this.load.audio('hurt', 'assets/audio/hurt.wav');
    this.load.audio('jump', 'assets/audio/jump.wav');
    this.load.audio('shooting', 'assets/audio/shooting.wav');
    this.load.audio('pause', 'assets/audio/pause.wav');
  }
  
  preload() {
    // Preload Sprites
    // << LOAD SPRITES HERE >>

    this.load.image('ground', 'assets/sprites/ground-juan-test.png');

    this.preloadBackround()
    // Preload Sounds
    // << LOAD SOUNDS HERE >>
    this.preloadMusic()
  }
  

  createGround(tileWidth, count) {
    const height = this.game.config.height;
    for (let i=0; i<count; i++) {
      this.groundGroup.create(i*tileWidth, height, 'road').setOrigin(0, 1).setScale(3.5).refreshBody();
    }
  }

  createBackgroundElement(imageWidth, texture, count, scrollFactor, posX, posY, height, factor) {
    for (let i=0; i<count; i++) {
      this.add.image(i*imageWidth*factor, height, texture).setOrigin(posX, posY).setScale(3.5).setScrollFactor(scrollFactor)
    }
  }
  
  createSounds() {
    this.backgroundMusic = this.sound.add('mfn-reagan')
    this.backgroundMusic.play()
    this.backgroundMusic.once('complete', function (backgroundMusic) {
      backgroundMusic = this.sound.add('mfn-no-reagan')
      backgroundMusic.volume = 0.1
      backgroundMusic.play()
    })
    
    //VOLUME
    this.volumeSpeaker = this.add
    .image(727, 35, "speakerOn")
    .setScrollFactor(0)
    .setScale(0.3);
    this.volumeUp = this.add
      .image(757, 35, "volumeUp")
      .setScrollFactor(0)
      .setScale(0.3);
    this.volumeDown = this.add
      .image(697, 35, "volumeDown")
      .setScrollFactor(0)
      .setScale(0.3);

    this.volumeUp.setInteractive();
    this.volumeDown.setInteractive();
    this.volumeSpeaker.setInteractive();

    this.volumeUp.on("pointerdown", () => {
      this.volumeUp.setTint(0xc2c2c2);

      let newVol = this.backgroundSound.volume + 0.1;
      this.backgroundSound.setVolume(newVol);
      if (this.backgroundSound.volume < 0.2) {
        this.volumeSpeaker.setTexture("speakerOn");
      }
      if (this.backgroundSound.volume >= 0.9) {
        this.volumeUp.setTint(0xff0000);
        this.volumeUp.disableInteractive();
      } else {
        this.volumeDown.clearTint();
        this.volumeDown.setInteractive();
      }
    });

    this.volumeDown.on("pointerdown", () => {
      this.volumeDown.setTint(0xc2c2c2);
      let newVol = this.backgroundSound.volume - 0.1;
      this.backgroundSound.setVolume(newVol);
      if (this.backgroundSound.volume <= 0.2) {
        this.volumeDown.setTint(0xff0000);
        this.volumeDown.disableInteractive();
        this.volumeSpeaker.setTexture("speakerOff");
      } else {
        this.volumeUp.clearTint();
        this.volumeUp.setInteractive();
      }
    });

    this.volumeDown.on("pointerup", () => {
      this.volumeDown.clearTint();
    });
    this.volumeUp.on("pointerup", () => {
      this.volumeUp.clearTint();
    });

    this.volumeSpeaker.on("pointerdown", () => {
      if (this.volumeSpeaker.texture.key === "speakerOn") {
        this.volumeSpeaker.setTexture("speakerOff");
        this.backgroundSound.setMute(true);
      } else {
        this.volumeSpeaker.setTexture("speakerOn");
        this.backgroundSound.setMute(false);
      }
    });
    
    this.sound.pauseOnBlur = false; //prevent sound from cutting when you leave tab

    this.jumpSound = this.sound.add('jump');
    this.jumpSound.volume = 0.2;

    this.shootingSound = this.sound.add('shooting');
    this.shootingSound.volume = 0.03;

    this.hurtSound = this.sound.add('hurt');
    this.hurtSound.volume = 0.3;
    
    this.pauseSound = this.sound.add('pause')
    this.pauseSound.volume = 0.03;

  }

  create() {
    //mute the previous scene
    this.game.sound.stopAll();

    //Set up background
    const width = this.game.config.width;
    const height = this.game.config.height;
    this.createBackgroundElement(128*3.5, 'back', 2, 0, 0, 0, 0, 1)
    this.createBackgroundElement(128*3.5, 'middle', 2*numberOfFrames, 0.25, 0, 1, height, 1)
    this.createBackgroundElement(176*3.5, 'front', 3, 0.5, 0, 1, height, 5)
    // this.createBackgroundElement(448, 'palms', 2*numberOfFrames, 0.75)

    this.groundGroup = this.physics.add.staticGroup({ classType: Ground });
    this.createGround(168, 5*numberOfFrames);

    // Create game entities
    // << CREATE GAME ENTITIES HERE >>

    // Create sounds
    // << CREATE SOUNDS HERE >>
   this.createSounds()
    // Create collisions for all entities
    // << CREATE COLLISIONS HERE >>
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>

  }


}
