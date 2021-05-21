import Ground from '../entity/Ground';
import Phaser from 'phaser'
import Boss from '../entity/Boss'
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
    this.flagpoleIsUp = false;  //this is the variable to toggle when we want to end the game (player wins)

    //bind functions
    this.createBackgroundElement = this.createBackgroundElement.bind(this);
    this.preloadMusic = this.preloadMusic.bind(this)
    this.createSounds = this.createSounds.bind(this)
    this.preloadBoss = this.preloadBoss.bind(this)
    this.preloadColaBomb = this.preload.bind(this)
    this.createBoss = this.createBoss.bind(this)
    this.preloadMap = this.preloadMap.bind(this)
    this.createMap = this.createMap.bind(this)
    this.createPhysics = this.createPhysics.bind(this)
    this.fire = this.fire.bind(this);
    this.createBulletGroup = this.createBulletGroup.bind(this)
    this.createHeartGroup = this.createHeartGroup.bind(this)
    this.createStarGroup = this.createStarGroup.bind(this)
    this.pickupStar = this.pickupStar.bind(this)
    this.pickupHeart = this.pickupHeart.bind(this)
    this.createGround = this.createGround.bind(this)
  }

  init(data) {
    this.initialScore = data.score,
    this.initialHealth = data.health,
    this.color = data.color
  }

  preloadMusic() {
    this.load.audio('mfn-reagan', 'assets/audio/MoneyForNothingWReagan.wav');
    this.load.audio('mfn-no-reagan', 'assets/audio/MoneyForNothing-small.wav');
    this.load.audio('rick-roll-sound', 'assets/audio/rick-roll.wav');
  }

  preloadBoss() {
    this.load.spritesheet("Boss", "assets/spriteSheets/Boss/Original-Dimensions/Sprite-Sheet-trimmy.png", {
      frameWidth: 19,
      frameHeight: 48,
    })
  }

  preloadColaBomb() {
    this.load.image("coca-cola", "assets/sprites/coca-cola.png")
    this.load.image("explosion", "assets/spriteSheets/explosion.png")
  }

  preloadMap() {
    this.load.image("back", "assets/backgrounds/neon_alley_scene/back.png");
    this.load.image("middle", "assets/backgrounds/neon_alley_scene/middle.png");
    this.load.image("front", "assets/backgrounds/neon_alley_scene/front.png");
  }

  preload() {
    this.scene.get('TitleScene').displayLoadingBar(this, "I want my MTV!")
    this.preloadMap()
    this.preloadBoss()
    this.preloadMusic()
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

  createSounds() {
    this.game.sound.stopAll()
    this.backgroundSound = this.sound.add('mfn-reagan')
    this.backgroundSound.play()
    this.backgroundSound.once('complete', function (backgroundSound) {
      backgroundSound = this.sound.add('mfn-no-reagan')
      backgroundSound.volume = 0.1
      backgroundSound.play()
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

  createBoss(scene, x, y, scale) {
    let boss = new Boss(scene, x, y, scale)

    scene.physics.add.collider(boss, scene.groundGroup)
    scene.physics.add.collider(boss, scene.player, function(b, p) {
      p.bounceOff()
      p.decreaseHealth(1)
    })
  }

  create() {
    this.input.keyboard.enabled = false
    this.height = this.game.config.height;
    this.width = this.game.config.width;

     //---------->These shoulds be in order
    this.createMap()
    this.createSounds()
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

    const level1 = this.add.text(400, 200, 'LEVEL 2',{ fontFamily: '"Press Start 2P"' }).setFontSize(46).setOrigin(0.5, 0.5)

    const flashLevel1 = this.tweens.add({
      targets: level1,
      duration: 200,
      repeat: -1,
      alpha: 0,
      ease: Phaser.Math.Easing.Expo.InOut
    })

    this.time.addEvent({
      delay: 2000,
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
    this.back1 = this.add.image(0*128*3.5*1, 0, 'back').setOrigin(0, 0).setScale(3.5).setScrollFactor(0)
    this.back2 = this.add.image(1*128*3.5*1, 0, 'back').setOrigin(0, 0).setScale(3.5).setScrollFactor(0)

    this.createBackgroundElement(128*3.5, 'middle', 2*numberOfFrames, 0.25, 0, 1, this.height, 1)
    this.createBackgroundElement(176*3.5, 'front', 3, 0.5, 0, 1, this.height, 5)
    // this.createBackgroundElement(448, 'palms', 2*numberOfFrames, 0.75)

    this.groundGroup = this.physics.add.staticGroup();
    this.createGround(168, 5*numberOfFrames);
    this.physics.world.setBounds(0, null, this.width * numberOfFrames, this.height, true, true, false, false)
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
    //---> testing mode
    this.player.decreaseHealth(1)
    this.flagpoleIsUp = true;
    //<--- testing mode
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

    this.scene.get('SinglePlayerSynthwaveScene').updateLevelEnded(this)
  }

}
