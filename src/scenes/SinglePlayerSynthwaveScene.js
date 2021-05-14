import enemy from '../entity/Enemy';
import Heart from '../entity/Heart';
import Ground from '../entity/Ground';
import Bullet from '../entity/Bullet';
import Star from '../entity/Star';
import SoldierPlayer from '../entity/SoldierPlayer'
import Phaser from 'phaser'
import MuzzleFlash from '../entity/MuzzleFlash';
import Mario from '../entity/Mario'
import Goo from '../entity/Goo'
import Terminator from '../entity/Terminator'


const numberOfFrames = 15;

export default class SinglePlayerSynthwaveScene extends Phaser.Scene {
  constructor() {
    super('SinglePlayerSynthwaveScene');

    this.scene = this;
    this.fire = this.fire.bind(this);
    this.terminatorFire = this.terminatorFire.bind(this)
    this.hit = this.hit.bind(this);
    this.createBackgroundElement = this.createBackgroundElement.bind(this);
    //bind functions
    this.createPlayer = this.createPlayer.bind(this);
    this.createEnemies = this.createEnemies.bind(this)
    this.createAnimatedStar = this.createAnimatedStar.bind(this)
    this.createAnimatedHeart = this.createAnimatedHeart.bind(this);
    this.createScoreLabel = this.createScoreLabel.bind(this);
    this.createHealthLabel = this.createHealthLabel.bind(this);
    this.pickupStar = this.pickupStar.bind(this)
    this.createStarGroup = this.createStarGroup.bind(this)
    this.pickupHeart = this.pickupHeart.bind(this)
    this.fallInGoo = this.fallInGoo.bind(this)
    this.createGooGroup = this.createGooGroup.bind(this)
    this.createGoo = this.createGoo.bind(this)
    this.createHeartGroup = this.createHeartGroup.bind(this)
    this.createBulletGroup = this.createBulletGroup.bind(this)
    this.pause = this.pause.bind(this)
  }

  init(data) {
    this.color = data.color; //initialize with chosen color
  }

  preloadSoldier() {
    this.load.spritesheet(`${this.color}SoldierRunning`, `assets/spriteSheets/${this.color}/Gunner_${this.color}_Run.png`, {
      frameWidth: 48,
      frameHeight: 48,
    })
    //Idle Soldier
    this.load.spritesheet(`${this.color}SoldierIdle`, `assets/spriteSheets/${this.color}/Gunner_${this.color}_Idle.png`, {
      frameWidth: 48,
      frameHeight: 48,
    })

    //Jumping Soldier
    this.load.spritesheet(`${this.color}SoldierJumping`, `assets/spriteSheets/${this.color}/Gunner_${this.color}_Jump.png`, {
      frameWidth: 48,
      frameHeight: 48,
    })

    //Dying Soldier
    this.load.spritesheet(`${this.color}SoldierDying`, `assets/spriteSheets/${this.color}/Gunner_${this.color}_Death.png`, {
      frameWidth: 48,
      frameHeight: 48,
    })

    //Crouching Soldier
    this.load.spritesheet(`${this.color}SoldierCrouching`, `assets/spriteSheets/${this.color}/Gunner_${this.color}_Crouch.png`, {
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
    this.load.audio('pause', 'assets/audio/pause.wav');
    this.load.audio('mario-hit', 'assets/audio/mario_hurt.wav')
  }

  preloadMap() {
    this.load.tilemapTiledJSON('map', 'assets/SynthWave.json')  // THIS IS THE MAP
    this.load.image('ground', 'assets/sprites/ground-juan-test.png');
    this.load.image("sky", "assets/backgrounds/synthwave_scene/back.png");
    this.load.image("mountains", "assets/backgrounds/synthwave_scene/mountains.png");
    this.load.image("palms-back", "assets/backgrounds/synthwave_scene/palms-back.png");
    this.load.image("palms", "assets/backgrounds/synthwave_scene/palms.png");
    this.load.image("road", "assets/backgrounds/synthwave_scene/road.png");
    this.load.image("platform", "assets/sprites/platform.png")    ///THIS IS THE TILESET OF THE PLATFORM
  }

  preloadMario(){
    this.load.spritesheet('mario', 'assets/spriteSheets/mario_enemy.png', {
      frameWidth: 30,
      frameHeight: 37,
    });
  }




  preload() {
    this.preloadSoldier() //load all the soldier things
    this.preloadSounds() //load all sounds
    this.preloadMap() //preload background
    // this.preloadMario()

    this.load.spritesheet('heart', 'assets/spriteSheets/heart.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image('brandon', 'assets/sprites/brandon.png');
    this.load.spritesheet('star', 'assets/spriteSheets/star.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image('goo', 'assets/sprites/goo.png')

    this.preloadMario()

    this.load.spritesheet('terminator', 'assets/spriteSheets/terminator_gun.png', {
      frameWidth: 23,
      frameHeight: 32,
    });

  }

  createGround(tileWidth, count) {
    for (let i=0; i<count; i++) {
      let newGround = this.groundGroup.create(i*tileWidth, this.height, 'road').setOrigin(0, 1).setScale(3.5).refreshBody();
      newGround.body.allowGravity = false
      newGround.body.immovable = true
    }
  }

  createBackgroundElement(imageWidth, texture, count, scrollFactor) {
    for (let i=0; i<count; i++) {
      this.add.image(i*imageWidth, this.height, texture).setOrigin(0, 1).setScale(3.5).setScrollFactor(scrollFactor)
    }
  }

  createLayers(scene) {
    const map = this.make.tilemap({key: 'map'})
    const platformTileset = map.addTilesetImage('Platform', 'platform') // First name is form tiled, Second name is key above
    scene.platforms = map.createStaticLayer("Tile Layer 1", platformTileset, 0, -100)
    scene.heartsLayer = map.getObjectLayer('Heart_Layer')
    scene.gotHearts = this.createHeartsFromLayer(scene)
    scene.starsLayer = map.getObjectLayer('Star_Layer')
    scene.gotStars = this.createStarsFromLayer(scene)
    scene.gooLayer = map.getObjectLayer('Goo_Layer')
    scene.gotGoo = this.createGooFromLayer(scene)
  }

  createZoneLayers(scene){
    const map = this.make.tilemap({key: 'map'})
    scene.zonesOne = map.getObjectLayer('player_zones');
    scene.playerZones = this.getPlayerZones(scene.zonesOne)
  }

  createGooFromLayer(scene){
    const gooArr = scene.gooLayer.objects
    for(let i = 0; i < gooArr.length; i++){
      const currentGoo = gooArr[i]
      this.createGoo(currentGoo.x, currentGoo.y, scene)
    }
  }

  createStarsFromLayer(scene){
    const starsArr = scene.starsLayer.objects
    for (let i = 0; i < starsArr.length; i++){
      const currentStar = starsArr[i]
      this.createAnimatedStar(currentStar.x, currentStar.y, scene)
    }
  }

  createHeartsFromLayer(scene){
    const heartsArr = scene.heartsLayer.objects
    for (let i = 0; i < heartsArr.length; i++){
      const currentHeart = heartsArr[i]
      this.createAnimatedHeart(currentHeart.x, currentHeart.y, scene)
    }
  }

  getPlayerZones(zonesOne){
    const markers = zonesOne.objects;
    return {
        start : markers.find(zone => zone.name === 'startZone'),
        end : markers.find(zone => zone.name === 'endZone')
      }
  }

  createMap() {
    this.add.image(this.width * 0.5, this.height * 0.46, 'sky').setOrigin(0.5).setScale(3.5).setScrollFactor(0)
    this.createBackgroundElement(504, 'mountains', 2*numberOfFrames, 0.15)
    this.createBackgroundElement(168, 'palms-back', 5*numberOfFrames, 0.3)
    this.createBackgroundElement(448, 'palms', 2*numberOfFrames, 0.45)

    // this.groundGroup = this.physics.add.staticGroup({classType: Ground});
    this.groundGroup = this.physics.add.group()
    this.createGround(168, 5*numberOfFrames);
    this.physics.world.setBounds(0, null, this.width * numberOfFrames, this.height, true, true, false, false) //set world bounds only on sides
  }

  createAnimatedHeart(x, y, scene) {
    const heart = new Heart(scene, x, y, 'heart').setScale(1.5);
    heart.play("rotate-heart")
    this.hearts.add(heart)
  }

  createAnimatedStar(x, y, scene) {
    //load star
      const star = new Star(scene, x, y, 'star').setScale(1.5)
      star.play('rotate-star')
      scene.stars.add(star)
  }

  createGoo(x, y, scene) {
    const goo = new Goo(scene, x, y, 'goo').setScale(2.8) //we can custom this
    // goo.alpha = 0.8 //we can custom this
    scene.goos.add(goo)
  }

  createPlayer(scene) {
    scene.player = new SoldierPlayer(scene, scene.playerZones.start.x, scene.playerZones.start.y, `${scene.color}SoldierIdle`, scene.socket).setSize(28, 32).setOffset(12, 7).setScale(2.78);
    scene.player.color = scene.color;
  }

  createPhysics(scene){
    scene.player.setCollideWorldBounds(true); //stop player from running off the edges
    scene.physics.add.collider(scene.player, scene.groundGroup)
    scene.physics.add.collider(scene.player, scene.platforms, function() {
      scene.player.body.touching.down = true
    });
    scene.platformGroup = this.physics.add.group()
    scene.platforms.setCollisionBetween(1, 2)
  }

  createEnemies(scene, enemy, x, y, number){
    const enemies = {mario: Mario, terminator:Terminator}
    let enemyX = x
    let enemyY = y
    let type = enemies[enemy]
    let groupType = scene[`${enemy}s`]
    for(let i = 0; i<number; i++){
      let newEnemy = new type(scene, enemyX, enemyY, enemy).setScale(2.7)
      groupType.add(newEnemy)
      scene.physics.add.collider(newEnemy, scene.groundGroup);
      scene.physics.add.collider(newEnemy, scene.player, function(newEnemy, player){
        if (player.body.touching.right || player.body.touching.left){
          player.bounceOff()
          player.decreaseHealth(1)
        }
        else  {
          newEnemy.body.immovable = true
        }
      });
      enemyX+=50
    }
    return scene.mario
  }

  setCamera(scene) {
    scene.cameras.main.startFollow(this.player);
    //scene.cameras.main.setBounds(0, 0, this.width * numberOfFrames, this.height * 1.5)
  }

  createScoreLabel(scene) {
    scene.add.image(35 , 55, 'star').setOrigin(0.5).setScale(1.2).setScrollFactor(0)
    scene.add.text(50, 55, "x", { fontFamily: '"Press Start 2P"' }).setFontSize(14).setOrigin(0, 0.45).setScrollFactor(0)
    scene.score = scene.add.text(65, 55, `${scene.player.score}`, { fontFamily: '"Press Start 2P"' }).setFontSize(14).setOrigin(0, 0.5).setScrollFactor(0)
  }

  createHealthLabel(scene) {
    scene.add.image(35, 30, 'heart').setOrigin(0.5).setScale(1.2).setScrollFactor(0)
    scene.add.text(50, 30, "x", { fontFamily: '"Press Start 2P"' }).setFontSize(14).setOrigin(0, 0.45).setScrollFactor(0)
    scene.health = scene.add.text(65, 30, `${scene.player.health}`, { fontFamily: '"Press Start 2P"' }).setFontSize(14).setOrigin(0, 0.5).setScrollFactor(0)
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

  createGooGroup() {
    this.goos = this.physics.add.group({
      classType: Goo,
      runChildUpdate: true,
      allowGravity: false,
      immovable: true
    })

    this.physics.add.collider(
      this.goos,
      this.player,
      this.fallInGoo,
      null,
      this
    )
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

  createBulletGroup() {
    this.bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
      allowGravity: false,
      maxSize: 40
    });

    this.physics.add.overlap(
      this.bullets,
      this.marios,
      this.hit,
      null,
      this
    );
  }

  create() {
   // const scene = this

    // ALL THESE ('--->') NEED TO BE IN ORDER
    this.height = this.game.config.height; //retrive width and height (careful--Has to be at the top of create)
    this.width = this.game.config.width;
    this.createSounds() //create all the sounds
    this.createMap() //Set up background
    this.createZoneLayers(this)
    this.createPlayer(this) //create player
    this.createStarGroup() //create star group
    this.createHeartGroup() //create heart group
    this.createGooGroup() //create goo group
    this.createLayers(this)
    this.setCamera(this)
    this.createScoreLabel(this) //create score
    this.createHealthLabel(this) //create health
    this.marios=this.physics.add.group();
    this.terminators=this.physics.add.group()
    this.createBulletGroup() //create bullet group
    this.createPhysics(this)

    this.pause(this) //creates pause functionality
    // --->

    this.cursors = this.input.keyboard.createCursorKeys();
    this.createAnimations();

    //this.physics.add.collider(this.player, this.platforms)

    // this.enemy = new enemy(this, 600, 400, 'brandon').setScale(.25) UNCOMMENT TO TEST BRANDON

    // this.physics.add.collider(this.enemy, this.groundGroup)
    // this.physics.add.collider(this.enemy, this.player, function(){
    //   console.log('hit')
    // })




    this.createEnemies(this, 'mario', 800, 400, 3)
    this.createEnemies(this, 'mario', 1200, 400, 5)

    //this.createEnemies(this, 'terminator', 1800, 400, 1)
    this.terminator = new Terminator(this, 3000, 400, 'terminator').setScale(4.5)
    this.physics.add.collider(this.terminator, this.groundGroup);


    this.createAnimatedStar(400, 400, this); //create a star to test the Heart entity
    this.createAnimatedHeart(300, 500, this);
    this.createAnimatedHeart(320, 500, this);     //create a heart to test the Heart entity

    //this.createGoo(400, 566, this); //create goo to test it
   // this.createGoo(430, 566, this);
    //this.createGoo(460, 566, this);


    // ...
    //this.physics.add.collider(this.enemy, this.groundGroup);
    //this.physics.add.collider(this.enemy, this.player);
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
    this.coinSound.volume = 0.1;

    this.hurtSound = this.sound.add('hurt');
    this.hurtSound.volume = 0.3;

    this.powerUpSound = this.sound.add('power-up');
    this.powerUpSound.volume = 0.1;


    this.pauseSound = this.sound.add('pause')
    this.pauseSound.volume = 0.03;

    this.marioHitSound = this.sound.add('mario-hit');
    this.marioHitSound.volume = 0.3

  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
    const scene = this
    this.player.update(time, this.cursors, this.jumpSound, this.fire, this.shootingSound);
    this.updateHealth(this) //updates the pleyer's health displayed on scene
    this.updateScore(this) //updates the pleyer's score displayed on scene
    if (this.muzzleFlash) this.muzzleFlash.update(delta) //updates muzzleFlash

    this.marios.getChildren().forEach(function (mario) {
      mario.update(scene.marioHitSound)
    })
    this.terminators.getChildren().forEach(function (terminator) {
      terminator.update(this.terminatorFire)
    })
    this.terminator.update(time, delta, this.terminatorFire)


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

  terminatorFire() {
    const offsetX = 60;
    const offsetY = 5.5;
    const bulletX =
      this.terminator.x + (this.terminator.movingLeft ? -offsetX : offsetX);
    const bulletY = this.terminator.y + offsetY;
    const muzzleX =
      this.terminator.x + (this.terminator.movingLeft ? -offsetX*0.82 : offsetX*0.82);
      const muzzleY = this.terminator.y + offsetY*0.65;

    //create muzzleFlash
    {this.muzzleFlash ? this.muzzleFlash.reset(muzzleX, muzzleY, this.terminator.movingLeft)
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
          this.terminator.movingLeft
        ).setScale(3);
        this.bullets.add(bullet);
      }
      // Reset this laser to be used for the shot
      bullet.reset(bulletX, bulletY, this.terminator.movingLeft);

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
      key: 'crouch',
      frames: this.anims.generateFrameNumbers(`${this.color}SoldierCrouching`, {start:3}),
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
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('mario', { start: 5, end: 8 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: 'terminator-walk',
      frames: this.anims.generateFrameNumbers('terminator'),
      frameRate: 5,
      repeat: -1,
    });
  }

    // make the laser inactive and insivible when it hits the enemy
    hit(enemy, bullet) {

      bullet.setActive(false);
      //bullet.setVisible(false);
      enemy.destroy()
      bullet.destroy()
      //this.shootingSound.play()
      this.marioHitSound.play()

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

    fallInGoo(player, goo) {
      this.player.bounceOff()
      this.player.decreaseHealth(1)
    }

    showGameOverMenu(scene) {
      scene.scene.pause() //pause scene
      scene.backgroundSound.pause()  //pause music
      scene.scene.launch('GameOverMenuScene', { previousScene: scene })
      scene.scene.moveAbove(this, 'GameOverMenuScene')
    }

    pause(scene) {
      scene.input.keyboard.on('keydown-P', () => {
        scene.scene.pause()
        scene.backgroundSound.pause()
        scene.pauseSound.play()
        scene.scene.launch('PauseScene', { previousScene: scene })
        scene.scene.moveAbove(scene, 'PauseScene')
      })
    }
}
