import enemy from '../entity/Enemy';
import Heart from '../entity/Heart';
import Ground from '../entity/Ground';
import Bullet from '../entity/Bullet';
import Star from '../entity/Star';
import SoldierPlayer from '../entity/SoldierPlayer'
import Phaser from 'phaser'
import MuzzleFlash from '../entity/MuzzleFlash';

const numberOfFrames = 15;

export default class SinglePlayerSynthwaveScene extends Phaser.Scene {
  constructor() {
    super('SinglePlayerSynthwaveScene');

    this.scene = this;
    this.fire = this.fire.bind(this);
    this.hit = this.hit.bind(this);
    this.createBackgroundElement = this.createBackgroundElement.bind(this);

    this.createPlayer = this.createPlayer.bind(this);
    this.createAnimatedStar = this.createAnimatedStar.bind(this)
    this.createAnimatedHeart = this.createAnimatedHeart.bind(this);
    this.createScoreLabel = this.createScoreLabel.bind(this);
    this.createHealthLabel = this.createHealthLabel.bind(this);
  }

  init(data) {
    this.color = data.color; //initialize with chosen color
  }

  preloadSoldier() {
    this.load.spritesheet(`${this.color}SoldierRunning`, `assets/spriteSheets/${this.color}/Gunner_${this.color}_Run.png`, {
      frameWidth: 48,
      frameHeight: 39,
    })
    //Idle Soldier
    this.load.spritesheet(`${this.color}SoldierIdle`, `assets/spriteSheets/${this.color}/Gunner_${this.color}_Idle.png`, {
      frameWidth: 48,
      frameHeight: 39,
    })

    //Jumping Soldier
    this.load.spritesheet(`${this.color}SoldierJumping`, `assets/spriteSheets/${this.color}/Gunner_${this.color}_Jump.png`, {
      frameWidth: 48,
      frameHeight: 39,
    })

    //Dying Soldier
    this.load.spritesheet(`${this.color}SoldierDying`, `assets/spriteSheets/${this.color}/Gunner_${this.color}_Death.png`, {
      frameWidth: 48,
      frameHeight: 39,
    })
    this.load.image('bullet', 'assets/sprites/SpongeBullet.png');
    this.load.image('muzzleFlash', 'assets/sprites/MuzzleFlash.png');
  }

  preloadSounds() {
    this.load.audio('jump', 'assets/audio/jump.wav');
    this.load.audio('shooting', 'assets/audio/shooting.wav');
    this.load.audio('scream', 'assets/audio/scream.wav');
    this.load.audio('background-music', 'assets/audio/synthwave_scene/synthwave-palms.wav');
    this.load.audio('hurt', 'assets/audio/hurt.wav');
    this.load.audio('coin', 'assets/audio/coin.wav');
    this.load.audio('power-up', 'assets/audio/power-up.wav');
  }

  preloadMap() {
    this.load.image('ground', 'assets/sprites/ground-juan-test.png');
    this.load.image("sky", "assets/backgrounds/synthwave_scene/back.png");
    this.load.image("mountains", "assets/backgrounds/synthwave_scene/mountains.png");
    this.load.image("palms-back", "assets/backgrounds/synthwave_scene/palms-back.png");
    this.load.image("palms", "assets/backgrounds/synthwave_scene/palms.png");
    this.load.image("road", "assets/backgrounds/synthwave_scene/road.png");
  }

  preload() {
    this.preloadSoldier() //load all the soldier things
    this.preloadSounds() //load all sounds
    this.preloadMap() //preload background

    this.load.spritesheet('heart', 'assets/spriteSheets/heart.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image('brandon', 'assets/sprites/brandon.png');
    this.load.spritesheet('star', 'assets/spriteSheets/star.png', {
      frameWidth: 16,
      frameHeight: 16,
    })
  }

  createGround(tileWidth, count) {
    for (let i=0; i<count; i++) {
      this.groundGroup.create(i*tileWidth, this.height, 'road').setOrigin(0, 1).setScale(3.5).refreshBody();
    }
  }

  createBackgroundElement(imageWidth, texture, count, scrollFactor) {
    for (let i=0; i<count; i++) {
      this.add.image(i*imageWidth, this.height, texture).setOrigin(0, 1).setScale(3.5).setScrollFactor(scrollFactor)
    }
  }

  createMap() {
    this.add.image(this.width * 0.5, this.height * 0.46, 'sky').setOrigin(0.5).setScale(3.5).setScrollFactor(0)
    this.createBackgroundElement(504, 'mountains', 2*numberOfFrames, 0.15)
    this.createBackgroundElement(168, 'palms-back', 5*numberOfFrames, 0.3)
    this.createBackgroundElement(448, 'palms', 2*numberOfFrames, 0.45)

    this.groundGroup = this.physics.add.staticGroup({ classType: Ground });
    this.createGround(168, 5*numberOfFrames);
    this.physics.world.setBounds(0, null, this.width * numberOfFrames, this.height, true, true, false, false) //set world bounds only on sides
  }

  createAnimatedHeart(x, y, scene) {
    const heart = new Heart(scene, x, y, 'heart');
    heart.play("rotate-heart")
  }

  createAnimatedStar(x, y, scene) {
    //load star
      const star = new Star(scene, x, y, 'star').setScale(1.5)
      star.play('rotate-star')
    }

  createPlayer(scene) {
    scene.player = new SoldierPlayer(scene, 60, 400, `${scene.color}SoldierIdle`, scene.socket).setScale(2.78);
    scene.player.color = scene.color;
    scene.player.setCollideWorldBounds(true); //stop player from running off the edges
    scene.physics.add.collider(scene.player, scene.groundGroup)
  }

  setCamera(scene) {
    scene.cameras.main.startFollow(this.player);
    scene.cameras.main.setBounds(0, 0, this.width * numberOfFrames, this.height)
  }

  createScoreLabel(scene) {
    scene.add.image(35 , 55, 'star').setOrigin(0.5).setScale(1.2).setScrollFactor(0)
    scene.add.text(50, 55, "x", { fontFamily: '"Press Start 2P"' }).setFontSize(14).setOrigin(0, 0.45).setScrollFactor(0)
    scene.score = scene.add.text(65, 55, `${scene.player.score}`, { fontFamily: '"Press Start 2P"' }).setFontSize(14).setOrigin(0, 0.45).setScrollFactor(0)
  }

  createHealthLabel(scene) {
    scene.add.image(35, 30, 'heart').setOrigin(0.5).setScale(1.2).setScrollFactor(0)
    scene.add.text(50, 30, "x", { fontFamily: '"Press Start 2P"' }).setFontSize(14).setOrigin(0, 0.45).setScrollFactor(0)
    scene.health = scene.add.text(65, 30, `${scene.player.health}`, { fontFamily: '"Press Start 2P"' }).setFontSize(14).setOrigin(0, 0.45).setScrollFactor(0)
  }

  create() {
    this.height = this.game.config.height; //retrive width and height (careful--Has to be at the top of create)
    this.width = this.game.config.width;
    this.createSounds() //create all the sounds
    this.createMap() //Set up background
    this.createPlayer(this) //create player
    this.setCamera(this)
    this.createScoreLabel(this) //create score
    this.createHealthLabel(this) //create health

    this.cursors = this.input.keyboard.createCursorKeys();
    this.createAnimations();

    this.enemy = new enemy(this, 600, 400, 'brandon').setScale(.25)

    this.createAnimatedStar(600, 400, this); //create a star to test the Heart entity
    this.createAnimatedHeart(100, 500, this);
    this.createAnimatedHeart(120, 500, this);     //create a heart to test the Heart entity

    // ...
    this.physics.add.collider(this.enemy, this.groundGroup);
    this.physics.add.collider(this.enemy, this.player);

    // We're going to create a group for our lasers
    this.bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
      allowGravity: false,
      maxSize: 40     // Important! When an obj is added to a group, it will inherit
                          // the group's attributes. So if this group's gravity is enabled,
                          // the individual lasers will also have gravity enabled when they're
                          // added to this group
    });

    // When the laser collides with the enemy
    this.physics.add.overlap(
      this.bullets,
      this.enemy,
      this.hit,
      null,
      this
    );
  }

  createSounds() {
    this.game.sound.stopAll(); //mute the previous scene
    this.backgroundSound = this.sound.add('background-music'); //add background music for this level
    this.backgroundSound.setLoop(true);
    this.backgroundSound.volume = 0.1;
    this.backgroundSound.play();

    this.sound.pauseOnBlur = false; //prevent sound from cutting when you leave tab

    this.jumpSound = this.sound.add('jump');
    this.jumpSound.volume = 0.2;

    this.shootingSound = this.sound.add('shooting');
    this.shootingSound.volume = 0.03;

    this.screamSound = this.sound.add('scream');

    this.coinSound = this.sound.add('coin');
    this.coinSound.volume = 0.05;

    this.hurtSound = this.sound.add('hurt');
    this.hurtSound.volume = 0.3;

    this.powerUpSound = this.sound.add('power-up');
    this.powerUpSound.volume = 0.08;
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
    this.player.update(time, this.cursors, this.jumpSound, this.fire, this.shootingSound);
    this.updateHealth(this) //updates the pleyer's health displayed on scene
    this.updateScore(this) //updates the pleyer's score displayed on scene
    if (this.muzzleFlash) this.muzzleFlash.update(delta) //updates muzzleFlash

    this.enemy.update(this.screamSound);

  }

  updateHealth(scene) {
    if (scene.health.text !== scene.player.health.toString()) {
      scene.health.text = scene.player.health.toString()
    }
  }

  updateScore(scene) {
    if (scene.score.text !== scene.player.score.toString()) {
      scene.score.text = scene.player.score.toString()
    }
  }

  fire() {
    //testing mode
    // this.player.increaseHealth(1)
    // this.player.decreaseHealth(1)
    // this.player.increaseScore(1)
    // this.player.decreaseScore(1)
    // this.player.revive()
    // console.log("health ---> ", this.player.health)
    // console.log("score ---> ", this.player.score)
    // console.log("dead ---> ", this.player.dead)
    //testing mode
    const offsetX = 60;
    const offsetY = 5.5;
    const bulletX =
      this.player.x + (this.player.facingLeft ? -offsetX : offsetX);
    const bulletY = this.player.y + offsetY;
    const muzzleX =
      this.player.x + (this.player.facingLeft ? -offsetX*0.82 : offsetX*0.82);
      const muzzleY = this.player.y + offsetY*0.65;

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

  createAnimations() {
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers(`${this.color}SoldierRunning`),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers(`${this.color}SoldierJumping`),
      frameRate: 20,
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers(`${this.color}SoldierIdle`),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'die',
      frames: this.anims.generateFrameNumbers(`${this.color}SoldierDying`),
      frameRate: 10,
    });
    this.anims.create({
      key: 'rotate-star',
      frames: this.anims.generateFrameNumbers('star'),
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
    key: 'rotate-heart',
      frames: this.anims.generateFrameNumbers('heart'),
      frameRate: 10,
      repeat: -1
    });
  }

    // make the laser inactive and insivible when it hits the enemy
    hit(enemy, bullet) {
      bullet.setActive(false);
      bullet.setVisible(false);
    }

}
