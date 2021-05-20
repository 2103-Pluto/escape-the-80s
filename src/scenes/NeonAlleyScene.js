import Ground from '../entity/Ground';
import Phaser from 'phaser'
import Bullet from '../entity/Bullet';
import MuzzleFlash from '../entity/MuzzleFlash';
import Heart from '../entity/Heart';
import Star from '../entity/Star';

const numberOfFrames = 3;

export default class NeonAlleyScene extends Phaser.Scene {
  constructor() {
    super('NeonAlleyScene');

    this.scene = this;
    this.level = 2;

    //bind functions
    this.createBackgroundElement = this.createBackgroundElement.bind(this);
    this.preloadSounds = this.preloadSounds.bind(this)
    this.preloadMap = this.preloadMap.bind(this)
    this.createMap = this.createMap.bind(this)
    this.createPhysics = this.createPhysics.bind(this)
    this.fire = this.fire.bind(this);
    this.createBulletGroup = this.createBulletGroup.bind(this)
    this.createHeartGroup = this.createHeartGroup.bind(this)
    this.createStarGroup = this.createStarGroup.bind(this)
    this.pickupStar = this.pickupStar.bind(this)
    this.pickupHeart = this.pickupHeart.bind(this)
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
    this.input.keyboard.enabled = false
    this.height = this.game.config.height;
    this.width = this.game.config.width;

     //---------->These shoulds be in order
    this.createSounds()
    this.createMap()
    this.scene.get('SinglePlayerSynthwaveScene').createPlayer(this) //create player
    this.player.score = this.initialScore
    this.player.health = this.initialHealth
    this.createStarGroup() //create star group
    this.createHeartGroup()
    this.scene.get('SinglePlayerSynthwaveScene').createScoreLabel(this)
    this.scene.get('SinglePlayerSynthwaveScene').createHealthLabel(this)
    this.createPhysics(this)
    this.setCamera(this) //set camera
    this.createBulletGroup(this)
    this.scene.get('SinglePlayerSynthwaveScene').pause(this)
    //<-----------

    const level1 = this.add.text(400, 300, 'LEVEL 2',{ fontFamily: '"Press Start 2P"' }).setFontSize(46).setOrigin(0.5, 0.5)

    const flashLevel1 = this.tweens.add({
      targets: level1,
      duration: 100,
      repeat: -1,
      alpha: 0,
      ease: Phaser.Math.Easing.Expo.InOut
    })

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        flashLevel1.stop()
        level1.setVisible(false)
      },
      loop: false
    })

    const speechBubble = this.scene.get('SinglePlayerSynthwaveScene').createSpeechBubble(50, 300, 250, 110, "1989?! Time flies when you're in the 80s", this)

    this.time.addEvent({
      delay: 3000,
      callback: () => {
        speechBubble.content.setVisible(false)
        speechBubble.bubble.setVisible(false)
        this.input.keyboard.enabled = true
      },
      loop: false
    })

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createBulletGroup(scene) {
    scene.bullets = scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
      allowGravity: false,
      maxSize: 40
    });

    scene.physics.add.overlap(
      scene.player,
      scene.bullets,
      scene.hit,
      null,
      scene
    );
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

    this.sound.pauseOnBlur = false;

    this.jumpSound = this.sound.add('jump');
    this.jumpSound.volume = 0.2;

    this.shootingSound = this.sound.add('shooting');
    this.shootingSound.volume = 0.03;

    this.screamSound = this.sound.add('scream');

    this.coinSound = this.sound.add('coin');
    this.coinSound.volume = 0.1;

    this.hurtSound = this.sound.add('hurt');
    this.hurtSound.volume = 0.3;

    this.powerUpSound = this.sound.add('power-up');
    this.powerUpSound.volume = 0.1;

    this.pauseSound = this.sound.add('pause')
    this.pauseSound.volume = 0.03;
  }

  createPhysics(scene) {
    scene.player.setCollideWorldBounds(true);
    scene.physics.add.collider(scene.player, scene.groundGroup)
  }

  showGameOverMenu(scene) {
    scene.scene.pause() //pause scene
    scene.backgroundSound.pause()  //pause music
    scene.scene.launch('GameOverMenuScene', { previousScene: scene })
    scene.scene.moveAbove(scene, 'GameOverMenuScene')
  }

  fire() {
    //--->testing mode
    this.player.decreaseHealth(1)
    console.log(this.player.health)
    //<---testing mode
    const offsetX = 60;
    const offsetY = 5.5;
    const bulletX =
      this.player.x + (this.player.facingLeft ? -offsetX : offsetX);
    const bulletY = this.player.isCrouching ? this.player.y + offsetY*3.1 : this.player.y - offsetY*1.2;
    const muzzleX =
      this.player.x + (this.player.facingLeft ? -offsetX*0.95 : offsetX*0.95);
    const muzzleY = this.player.isCrouching ? this.player.y + offsetY*3.1 : this.player.y - offsetY*1.2;

    //create muzzleFlash
    {this.muzzleFlash ? this.muzzleFlash.reset(muzzleX, muzzleY, this.player.facingLeft)
      : this.muzzleFlash = new MuzzleFlash(this, muzzleX, muzzleY, 'muzzleFlash', this.player.facingLeft)}
      // Get the first available laser object that has been set to inactive
      let bullet = this.bullets.getFirstDead();
      // Check if we can reuse an inactive laser in our pool of lasers
      if (!bullet) {
        // Create a laser bullet and scale the sprite down
        bullet = new Bullet(
          this,
          bulletX,
          bulletY,
          'bullet',
          this.player.facingLeft
        ).setScale(3);
        this.bullets.add(bullet);
      }
      // Reset this laser to be used for the shot
      bullet.reset(bulletX, bulletY, this.player.facingLeft);
  }

  setCamera(scene) {
    const desiredHeightLimit = 3*scene.height; //this is the height wanted to be the max
    scene.cameras.main.startFollow(scene.player);

    scene.cameras.main.setBounds(0, -desiredHeightLimit+scene.height, scene.width * numberOfFrames, desiredHeightLimit)
  }

  createHeartGroup() {
    this.hearts = this.physics.add.group({
      classType: Heart,
      runChildUpdate: true,
      allowGravity: false,
    })

    this.physics.add.overlap(
      this.hearts,
      this.player,
      this.pickupHeart,
      null,
      this
    )
  }

  createStarGroup() {
    this.stars = this.physics.add.group({
      classType: Star,
      runChildUpdate: true,
      allowGravity: false,
    })

    this.physics.add.overlap(
      this.stars,
      this.player,
      this.pickupStar,
      null,
      this
    )
  }

  pickupStar(player, star) {
    star.destroy()
    this.coinSound.play()
    this.player.increaseScore(1)
  }

  pickupHeart(player, heart) {
    heart.destroy()
    this.powerUpSound.play()
    this.player.increaseHealth(1)
  }

  update(time, delta) {
    this.player.update(time, this.cursors, this.jumpSound, this.fire, this.shootingSound);
    this.scene.get('SinglePlayerSynthwaveScene').updateHealth(this) //updates the pleyer's health displayed on scene
    this.scene.get('SinglePlayerSynthwaveScene').updateScore(this) //updates the pleyer's score displayed on scene
    if (this.muzzleFlash) this.muzzleFlash.update(delta) //updates muzzleFlash
  }

}
