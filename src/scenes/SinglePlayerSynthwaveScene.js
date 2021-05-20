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
import Flagpole from '../entity/Flagpole'
import CharacterChoosingScene from './CharacterChoosingScene'
import StoryScene from './StoryScene'


const numberOfFrames = 13;

export default class SinglePlayerSynthwaveScene extends Phaser.Scene {
  constructor() {
    super('SinglePlayerSynthwaveScene');

    this.scene = this;
    this.level = 1;
    this.fire = this.fire.bind(this);
    this.terminatorFire = this.terminatorFire.bind(this)
    this.hit = this.hit.bind(this);
    this.hitPlatform = this.hitPlatform.bind(this)
    this.createBackgroundElement = this.createBackgroundElement.bind(this);
    this.flagpoleIsUp = false;
    this.touchingFlagpole = false;
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
    this.raiseFlagpole = this.raiseFlagpole.bind(this)
    this.createFlagpole = this.createFlagpole.bind(this)
    this.pause = this.pause.bind(this)
    this.createPhysics = this.createPhysics.bind(this)
    this.clearCharacterChoosing = this.clearCharacterChoosing.bind(this)
    this.createSpeechBubble = this.createSpeechBubble.bind(this)
    this.preloadSpeaker = this.preloadSpeaker.bind(this)

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
      frameHeight: 48,
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
    this.load.audio('mario-dead', 'assets/audio/mario_hurt.wav')
    this.load.audio('terminator-dead', 'assets/audio/be_back.wav')
    this.load.audio('celebration', 'assets/audio/celebration.wav')
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

  preloadSpeaker() {
    this.load.image("speakerOn", "assets/sprites/speaker_on.png");
    this.load.image("speakerOff", "assets/sprites/speaker_off.png");
    this.load.image("volumeUp", "assets/sprites/volume_up.png");
    this.load.image("volumeDown", "assets/sprites/volume_down.png");
  }

  preload() {
    //loading bar
    this.scene.get('TitleScene').displayLoadingBar(this, "where's the beef?")

    this.preloadSoldier() //load all the soldier things
    this.preloadSounds() //load all sounds
    this.preloadMap() //preload background
    // this.preloadMario()
    this.preloadSpeaker()

    this.load.spritesheet('heart', 'assets/spriteSheets/heart.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

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

    this.load.spritesheet('flagpole', 'assets/spriteSheets/flagpoles_sheet.png', {
      frameWidth: 31.6,
      frameHeight: 168
    })
  }

  createGround(tileWidth, count) {
    for (let i=0; i<count; i++) {
      let newGround = this.groundGroup.create(i*tileWidth, this.height, 'road').setOrigin(0, 1).setScale(3.5).refreshBody();
    }
  }

  createBackgroundElement(imageWidth, texture, count, scrollFactor) {
    for (let i=0; i<count; i++) {
      this.add.image(i*imageWidth, this.height, texture).setOrigin(0, 1).setScale(3.5).setScrollFactor(scrollFactor)
    }
  }

  createLayers(scene) {
    const map = this.make.tilemap({key: 'map'})
    //const groundTileset = map.addTilesetImage('Ground', 'road')
    //scene.ground = map.createStaticLayer('Ground', ground, 0, 0)
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
    scene.zonesT = map.getObjectLayer('Terminator_Spawn')
    scene.zonesM = map.getObjectLayer('Mario_Spawn')
    scene.terminatorSpawns = this.getTerminatorSpawns(scene)
    scene.marioSpawns = this.getMarioSpawns(scene)
  }

  getTerminatorSpawns(scene){
    const markers = scene.zonesT.objects
    return {
      t1: markers.find(m => m.name === 'Terminator1'),
      t2: markers.find(m => m.name === 'Terminator2')
    }
  }

  getMarioSpawns(scene){
    const markers = scene.zonesM.objects
   return {
      m1: markers.find(m => m.name === 'Mario1'),
      m2: markers.find(m => m.name === 'Mario2'),
      m3: markers.find(m => m.name === 'M3'),
      m4: markers.find(m => m.name === 'M4'),
      m5: markers.find(m => m.name === 'M5'),
      m6: markers.find(m => m.name === 'M6'),
    }
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
    this.sky = this.add.image(this.width * 0.5, this.height * 0.46, 'sky').setOrigin(0.5).setScale(3.5).setScrollFactor(0)
    this.createBackgroundElement(504, 'mountains', 2*numberOfFrames, 0.15)
    this.createBackgroundElement(168, 'palms-back', 5*numberOfFrames, 0.3)
    this.createBackgroundElement(448, 'palms', 2*numberOfFrames, 0.45)
    this.groundGroup = this.physics.add.staticGroup()
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
    const goo = new Goo(scene, x, y, 'goo').setScale(2) //we can custom this
    // goo.alpha = 0.8 //we can custom this
    scene.goos.add(goo)
  }

  createPlayer(scene) {
    scene.player = new SoldierPlayer(scene, scene.playerZones.start.x, scene.playerZones.start.y, `${scene.color}SoldierIdle`, scene.socket, scene.color).setSize(14, 32).setOffset(15, 7).setScale(2.78);
  }

  createPhysics(scene){
    scene.player.setCollideWorldBounds(true); //stop player from running off the edges
    scene.physics.add.collider(scene.player, scene.groundGroup)
    scene.physics.add.collider(scene.player, scene.platforms, function() {
      scene.player.body.touching.down = true
    });
    scene.platformGroup = this.physics.add.group()
    scene.platforms.setCollisionBetween(1, 2)
    scene.physics.add.collider(scene.flagpole, scene.groundGroup)
    scene.physics.add.overlap(scene.player, scene.flagpole, function() {
      if (!scene.touchingFlagpole){
        scene.touchingFlagpole = true;
        scene.raiseFlagpole(scene)
      }
    })
    scene.physics.add.overlap(scene.platforms, scene.bullets, scene.hitPlatform, null, scene)
  }
  hitPlatform(bullet, platform) {
    if (platform.index === 1) {
      bullet.setActive(false)
      bullet.destroy()
    }

  }

  createFlagpole(scene) {
    scene.flagpole = new Flagpole(scene, scene.playerZones.end.x + 300, 310, 'flagpole').setScale(2.78)
    scene.flagpole.body.setSize(2, 160)
    scene.flagpole.body.setOffset(16, 0)

    scene.flagpole.body.immovable = true
    scene.flagpole.body.allowGravity = false
  }


  createEnemies(scene, enemy, x, y, number, scale){
    const enemies = {mario: Mario, terminator:Terminator}
    let enemyX = x
    let enemyY = y
    let type = enemies[enemy]
    let groupType = scene[`${enemy}s`]
    for(let i = 0; i<number; i++){
      let newEnemy = new type(scene, enemyX, enemyY, enemy).setScale(scale)
      groupType.add(newEnemy)
      scene.physics.add.collider(newEnemy, scene.groundGroup);
      scene.physics.add.collider(newEnemy, scene.platforms)
      scene.physics.add.collider(newEnemy, scene.player, function(newEnemy, player){
        if (enemy==='mario' && newEnemy.body.touching.up){
            newEnemy.destroy()
           scene.marioDeathSound.play()
        }
        else {
          player.bounceOff()
          player.decreaseHealth(1)
        }
      });
      enemyX+=60 //if you create a troop of enemies, they'll be 50 pixels apart
    }
    return scene.mario
  }

  setCamera(scene) {
    const desiredHeightLimit = 3*this.height; //this is the height wanted to be the max
    scene.cameras.main.startFollow(this.player);

    scene.cameras.main.setBounds(0, -desiredHeightLimit+this.height, this.width * numberOfFrames, desiredHeightLimit)
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

  createBulletGroup(scene) {
    scene.bullets = scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
      allowGravity: false,
      maxSize: 40
    });

    scene.physics.add.overlap(
      scene.marios,
      scene.bullets,
      scene.hit,
      null,
      scene
    );

    scene.physics.add.overlap(
      scene.terminators,
      scene.bullets,
      scene.hit,
      null,
      scene
    );

    scene.physics.add.overlap(
      scene.player,
      scene.bullets,
      scene.hit,
      null,
      scene
    );
  }

  createSpeechBubble (x, y, width, height, quote, scene) {
    const bubbleWidth = width;
    const bubbleHeight = height;
    const bubblePadding = 10;
    const arrowHeight = bubbleHeight / 4;


    let bubble = scene.add.graphics({ x: x, y: y });

    //  Bubble shado
    bubble.fillStyle(0x222222, 0.5);
    bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

    //  Bubble color
    bubble.fillStyle(0xffffff, 1);

    //  Bubble outline line style
    bubble.lineStyle(4, 0x565656, 1);

    //  Bubble shape and outline
    bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

    //  Calculate arrow coordinates
    const point1X = Math.floor(bubbleWidth / 7);
    const point1Y = bubbleHeight;
    const point2X = Math.floor((bubbleWidth / 7) * 2);
    const point2Y = bubbleHeight;
    const point3X = Math.floor(bubbleWidth / 7);
    const point3Y = Math.floor(bubbleHeight + arrowHeight);

    //  Bubble arrow shadow
    bubble.lineStyle(4, 0x222222, 0.5);
    bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

    //  Bubble arrow fill
    bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    bubble.lineStyle(2, 0x565656, 1);
    bubble.lineBetween(point2X, point2Y, point3X, point3Y);
    bubble.lineBetween(point1X, point1Y, point3X, point3Y);

    const content = this.add.text(0, 0, quote, { fontFamily: '"Press Start 2P"', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });


    const b = content.getBounds();

    content.setPosition(bubble.x + (bubbleWidth / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));
    return {bubble, content}
}

clearCharacterChoosing() {
    this.scene.remove('CharacterChoosingScene')
    this.scene.remove('StoryScene')
    this.game.scene.add('CharacterChoosingScene', CharacterChoosingScene)
    this.game.scene.add('StoryScene', StoryScene)
  }

  create() {
   // const scene = this
   this.clearCharacterChoosing() //this clears player chosen from the CharacterSelectionScene so that we can choose again if we quit)
   // const scene = this
   console.log(this)
    // ALL THESE ('--->') NEED TO BE IN ORDER
    this.height = this.game.config.height; //retrive width and height (careful--Has to be at the top of create)
    this.width = this.game.config.width;
    this.createAnimations(); //create all animations
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
    this.createBulletGroup(this) //create bullet group
    this.createFlagpole(this)
    this.createPhysics(this)
    this.createSounds() //create all the sounds
    this.pause(this) //creates pause functionality
    // --->
    const level1 = this.add.text(400, 300, 'LEVEL 1',{ fontFamily: '"Press Start 2P"' }).setFontSize(46).setOrigin(0.5, 0.5)

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

    const speechBubble = this.createSpeechBubble(50, 300, 250, 110, "Holy crap, I'm in 1987! How did I get this gun???", this)

    this.time.addEvent({
      delay: 4000,
      callback: () => {
        speechBubble.content.setVisible(false)
        speechBubble.bubble.setVisible(false)
      },
      loop: false
    })

    this.cursors = this.input.keyboard.createCursorKeys();


    this.createEnemies(this, 'mario', this.marioSpawns.m1.x, this.marioSpawns.m1.y, 2, 2.7)
    this.createEnemies(this, 'mario', this.marioSpawns.m2.x, this.marioSpawns.m2.y, 5, 2.7)
    this.createEnemies(this, 'mario', this.marioSpawns.m3.x, this.marioSpawns.m3.y, 6, 2.7)
    this.createEnemies(this, 'mario', this.marioSpawns.m4.x, this.marioSpawns.m4.y, 2, 2.7)
    this.createEnemies(this, 'mario', this.marioSpawns.m5.x, this.marioSpawns.m5.y, 2, 2.7)
    this.createEnemies(this, 'mario', this.marioSpawns.m6.x, this.marioSpawns.m6.y, 2, 2.7)


    this.createEnemies(this, 'terminator', this.terminatorSpawns.t1.x, this.terminatorSpawns.t1.y, 1, 4.5)
    this.createEnemies(this, 'terminator', this.terminatorSpawns.t2.x, this.terminatorSpawns.t2.y, 1, 4.5)

  }

  createSounds() {
    this.game.sound.stopAll(); //mute the previous scene
    this.backgroundSound = this.sound.add('background-music'); //add background music for this level
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

    this.marioDeathSound = this.sound.add('mario-dead');
    this.marioDeathSound.volume = 0.3

    this.terminatorDeathSound = this.sound.add('terminator-dead');
    this.terminatorDeathSound.volume = 0.3


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
      mario.update(scene.marioDeathSound)
    })
    this.terminators.getChildren().forEach(function (terminator) {
      terminator.update(time, delta, scene.terminatorFire, scene.shootingSound, scene.player.x)
    })
    //this.terminator.update(time, delta, this.terminatorFire)
    this.updateLevelEnded(this)

  }

  updateLevelEnded(scene) {
    if (scene.flagpoleIsUp) {
      scene.sky.setTint(0x004c99)
      scene.time.delayedCall(200, () => {
        scene.scene.pause()
        scene.backgroundSound.pause()
        scene.scene.launch('LevelCompletedScene', {
          level: scene.level,
          score: scene.player.score,
          health: scene.player.health,
          color: scene.color,
          previousSceneName: scene.data.systems.config
        })
        scene.scene.moveAbove(scene, 'LevelCompletedScene')
      }, null, this)
    }
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

  terminatorFire(terminator) {
    const offsetX = 60;
    const offsetY = 5.5;
    const bulletX =
      terminator.x + (terminator.movingLeft ? -offsetX : offsetX);
    const bulletY = terminator.y + offsetY;
    const muzzleX =
      terminator.x + (terminator.movingLeft ? -offsetX*0.82 : offsetX*0.82);
      const muzzleY = terminator.y + offsetY*0.65;

    //create muzzleFlash
    {this.muzzleFlash ? this.muzzleFlash.reset(muzzleX, muzzleY, terminator.movingLeft)
      : this.muzzleFlash = new MuzzleFlash(this, muzzleX, muzzleY, 'muzzleFlash', terminator.movingLeft)}
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
          terminator.movingLeft
        ).setScale(3);
        this.bullets.add(bullet);
      }
      // Reset this laser to be used for the shot
      bullet.reset(bulletX, bulletY, terminator.movingLeft);

  }

  createAnimations() {
    this.anims.create({
      key: `${this.color}Run`,
      frames: this.anims.generateFrameNumbers(`${this.color}SoldierRunning`),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: `${this.color}Jump`,
      frames: this.anims.generateFrameNumbers(`${this.color}SoldierJumping`),
      frameRate: 20,
    });
    this.anims.create({
      key: `${this.color}Idle`,
      frames: this.anims.generateFrameNumbers(`${this.color}SoldierIdle`),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: `${this.color}Die`,
      frames: this.anims.generateFrameNumbers(`${this.color}SoldierDying`),
      frameRate: 10,
    });
    this.anims.create({
      key: `${this.color}Crouch`,
      frames: this.anims.generateFrameNumbers(`${this.color}SoldierCrouching`, {start:3}),
      repeat: 0
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
    this.anims.create({
      key: 'raise-flagpole',
      frames: this.anims.generateFrameNumbers('flagpole'),
      frameRate: 10,
      repeat: 0,
    })
  }

    // make the laser inactive and insivible when it hits the enemy
    hit(enemy, bullet) {
      const deathSounds = {
        mario: this.marioDeathSound,
        terminator: this.terminatorDeathSound
      }
      bullet.setActive(false);
      if(enemy!==this.player && enemy.bulletHits===enemy.bulletDeath){
        enemy.destroy()
        deathSounds[enemy.name].play()
        if (enemy.name === 'mario') {
          this.player.increaseScore(2)
        } else if (enemy.name === 'terminator') {
          this.player.increaseScore(10)
        }
      } else {
        enemy.bulletHits+=1
        if (enemy!==this.player) {
          enemy.playDamageTween()
        } else {
          enemy.bounceOff()
        }
      }
      bullet.destroy()
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

    raiseFlagpole(scene) {
      if (!this.flagpoleIsUp) {
        scene.flagpole.play("raise-flagpole", false)
      }
      scene.flagpole.on('animationcomplete-raise-flagpole', () => {
        this.flagpoleIsUp = true
      })
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
