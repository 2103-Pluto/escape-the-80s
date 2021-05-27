import Ground from '../entity/Ground';
import Phaser from 'phaser'
import Boss from '../entity/Boss'
import Bullet from '../entity/Bullet';
import MuzzleFlash from '../entity/MuzzleFlash';
import Heart from '../entity/Heart';
import Star from '../entity/Star';
import Bomb from '../entity/Bomb'
import Explosion from '../entity/Explosion';
import Wall from '../entity/Wall';
import store from '../store'
import { setPlayerVictory } from '../store/settings';
import Rock from '../entity/Rock'


const numberOfFrames = 3;

export default class NeonAlleyScene extends Phaser.Scene {
  constructor() {
    super('NeonAlleyScene');

    this.scene = this;
    this.level = 2;
    this.flagpoleIsUp = false;  //this is the variable to toggle when we want to end the game (player wins)
    this.bossAlive = true;

    //bind functions
    this.createBackgroundElement = this.createBackgroundElement.bind(this);
    this.preloadMusic = this.preloadMusic.bind(this)
    this.createSounds = this.createSounds.bind(this)
    this.preloadBoss = this.preloadBoss.bind(this)
    this.preloadColaBomb = this.preloadColaBomb.bind(this)
    this.createBoss = this.createBoss.bind(this)
    this.preloadMap = this.preloadMap.bind(this)
    this.createMap = this.createMap.bind(this)
    this.createPhysics = this.createPhysics.bind(this)
    this.createAnimations = this.createAnimations.bind(this)
    this.fire = this.fire.bind(this);
    this.bossFire = this.bossFire.bind(this)
    this.createBulletGroup = this.createBulletGroup.bind(this)
    this.createHeartGroup = this.createHeartGroup.bind(this)
    this.createStarGroup = this.createStarGroup.bind(this)
    this.pickupStar = this.pickupStar.bind(this)
    this.pickupHeart = this.pickupHeart.bind(this)
    this.createGround = this.createGround.bind(this)
    this.createBombGroup = this.createBombGroup.bind(this)
    this.hit = this.hit.bind(this);
    this.explodeFn = this.explodeFn.bind(this)
    this.createExplosionGroup = this.createExplosionGroup.bind(this)

    this.hitWall = this.hitWall.bind(this)
  }

  init(data) {
    this.initialScore = data.score,
    this.initialHealth = data.health,
    this.color = data.color
  }

  preloadMusic() {
    this.load.audio('mfn-reagan', 'assets/audio/clean-mfn.wav');
    this.load.audio('rick-roll-sound', 'assets/audio/rick-roll.wav');
  }


  preloadWall(){
    const wall1 = this.load.spritesheet("Wall1", "assets/spriteSheets/Wall/wall-state1.png", {
      frameWidth: 750,
      frameHeight: 250,
    });
    const wall2 = this.load.image("Wall2", "assets/spriteSheets/Wall/wall-state2.png", {
      frameWidth: 750,
      frameHeight: 250,
    });
    const wall3 = this.load.image("Wall3", "assets/spriteSheets/Wall/wall-state3.png", {
      frameWidth: 750,
      frameHeight: 250,
    });

    const wallAnim1 = this.load.spritesheet("wallAnim1", "assets/spriteSheets/Wall/wall-anim1.png", {
    frameWidth: 512,
    frameHeight: 512
    });
}


  preloadBoss() {
    this.load.spritesheet("Boss", "assets/spriteSheets/Boss/Original-Dimensions/Sprite-Sheet-trimmy.png", {
      frameWidth: 19,
      frameHeight: 48,
    })
    this.load.audio('boss-dead', 'assets/audio/i-aint-goin-nowhere.wav')
    this.load.audio('boss-mad', 'assets/audio/I-will-not-die-sober.wav')
  }

  preloadColaBomb() {
    this.load.image("coca-cola", "assets/sprites/coca-cola.png")
    this.load.spritesheet("explosion", "assets/spriteSheets/explosion-trimmy.png", {
      frameWidth: 76,
      frameHeight: 76
    })
    this.load.audio("bomb-drop", "assets/audio/bomb-drop.wav")
  }

  preloadMap() {
    this.load.image("back", "assets/backgrounds/neon_alley_scene/back.png");
    this.load.image("middle", "assets/backgrounds/neon_alley_scene/middle.png");
    this.load.image("front", "assets/backgrounds/neon_alley_scene/front.png");
  }

  preloadWallSounds(){
    this.load.audio("wallHit", "assets/audio/hittingWall.wav")
    // maybe find a wall crumbling sound
  }

  preload() {
    this.scene.get('TitleScene').displayLoadingBar(this, "I want my MTV!")
    this.preloadMap()
    this.preloadBoss()
    this.preloadMusic()
    this.preloadColaBomb()

    this.preloadWall()
    this.preloadWallSounds()
    this.load.spritesheet("berlinWall", "assets/spriteSheets/berlinWall.png",{
      frameWidth: 266,
      frameHeight: 65
    })
  }

  createBerlinWall(){
    const orange = this.add.image(200, 200, 'berlinWall').setOrigin(0,0).setScale(3)
    // console.log(orange)
    return orange
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
    this.backgroundSound.setLoop(true)
    this.backgroundSound.volume = 0.4
    this.backgroundSound.play()

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

    this.bombDropSound = this.sound.add('bomb-drop')
    this.bombDropSound.volume = 0.02

    this.bossDeathSound = this.sound.add('boss-dead')

    this.bossDeathSound.volume = 0.8


    this.bossMadSound = this.sound.add('boss-mad')
    this.bossMadSound.volume = 0.9
  }

  createBoss(scene, x, y, scale) {

    this.boss = new Boss(scene, x, y, "Boss").setScale(scale)
    scene.physics.add.collider(this.boss, this.groundGroup)
    scene.physics.add.collider(this.boss, this.player, function(b, p) {
      let bounceLeft = false
      if (b.x - p.x > 0) {
        bounceLeft = true
      }
      p.bounceOff(bounceLeft)
      p.decreaseHealth(1)
    })
  }

  createAnimations() {
    this.anims.create({
      key: 'boss-run',
      frames: this.anims.generateFrameNumbers('Boss'),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion'),
      frameRate: 10,
      repeat: 0
    })
    this.anims.create({
      key: 'hit-effect',
      frames: this.anims.generateFrameNumbers('wallAnim1'),
      frameRate: 5,
      repeat: 0
    })
  }


  createWall(scene, x, y){
    const wall = new Wall(scene, x, y, 'Wall1').setScale(.4).setSize(740, 250).setOffset(11, 0) //set size then set offset
    scene.physics.add.collider(wall, scene.player)

    // need to think about bullet colliders
    scene.wallGroup.getChildren().forEach((w) => {
      scene.physics.add.collider(w, wall, function() {
        const b1 = w.body;
        const b2 = wall.body;
        if (b1.y > b2.y) {
            b2.y += (b1.top - b2.bottom);
            b2.stop();
        }
        else {
            b1.y += (b2.top - b1.bottom);
            b1.stop();
        }
    })
    })
    scene.wallGroup.add(wall)
    scene.physics.add.collider(wall, scene.groundGroup, function(wall, ground) {
      const b1 = wall.body;
      const b2 = ground.body;
      if (b1.y > b2.y) {
          b2.y += (b1.top - b2.bottom);
          b2.stop();
      }
      else {
          b1.y += (b2.top - b1.bottom);
          b1.stop();
      }
  })
    wall.body.touching.down = true

  }

  createWallGroup(scene) {
    //make this group static to get rid of bug with the player vibrating on top of wall
    scene.wallGroup = scene.physics.add.staticGroup({
      classType: Wall,
      runChildUpdate: true,
      allowGravity: true,
      immovable: false
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
    this.createBoss(this, this.width*2.6, 400, 4)
    this.createAnimations()
    this.createWallGroup(this)
    this.createWall(this, 500, -100)
    // // //this.createWall(this, 500, 50)
    this.createWall(this, 500, 200)
    this.createWall(this, 500, 300)
    this.createWall(this, 500, 400)
    this.createWall(this, 797, -100)
  //  // this.createWall(this, 800, 100)
    this.createWall(this, 797, 200)
    this.createWall(this, 797, 300)
    this.createWall(this, 797, 400)
    // const blue = this.createBerlinWall()
    // console.log(blue)
    this.createBulletGroup(this)
    this.createBombGroup(this)
    this.createExplosionGroup(this)
    this.scene.get('SinglePlayerSynthwaveScene').pause(this)
    //<-----------
    this.wallHitSound = this.sound.add('wallHit')

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

    this.events.on('explodeFn', this.explodeFn, this)

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createBulletGroup(scene) {
    scene.bullets = scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
      allowGravity: false,
      maxSize: 40
    });

    scene.physics.add.collider(
      scene.boss,
      scene.bullets,
      scene.hit,
      null,
      scene
    )

    scene.physics.add.overlap(
      scene.wallGroup,
      scene.bullets,
      scene.hitWall,
      null,
      scene
    );
  }

  createBombGroup(scene) {
    scene.bombs = scene.physics.add.group({
      classType: Bomb,
      runChildUpdate: true,
      allowGravity: true,
      maxSize: 40
    });

    scene.physics.add.collider(
      scene.bombs,
      scene.groundGroup
    );
  }

  createExplosionGroup(scene) {
    scene.explosions = scene.physics.add.group({
      classType: Explosion,
      runChildUpdate: true,
      allowGravity: true,
      maxSize: 40,
    })

    scene.physics.add.overlap(
      scene.player,
      scene.explosions,
      scene.hit,
      null,
      scene
    )

    scene.physics.add.collider(
      scene.explosions,
      scene.groundGroup
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
    // scene.physics.add.collider(scene.groundGroup, scene.wallGroup)
    // <--- THE LINE ABOVE IS WHAT CAUSED THE RESTART BUG---> //
  }

  showGameOverMenu(scene) {
    scene.scene.pause() //pause scene
    scene.backgroundSound.pause()  //pause music
    scene.scene.launch('GameOverMenuScene', { previousScene: scene })
    scene.scene.moveAbove(scene, 'GameOverMenuScene')
  }

  fire() {
    const offsetX = 60;
    const offsetY = 5.5;
    const bulletX =
      this.player.x + (this.player.facingLeft ? -offsetX : offsetX);
    const bulletY = this.player.isCrouching ? this.player.y + offsetY*0.8 : this.player.y - offsetY*1.2;
    const muzzleX =
      this.player.x + (this.player.facingLeft ? -offsetX*0.95 : offsetX*0.95);
    const muzzleY = this.player.isCrouching ? this.player.y + offsetY*0.8 : this.player.y - offsetY*1.2;

    //create muzzleFlash
    {this.muzzleFlash ? this.muzzleFlash.reset(muzzleX, muzzleY, this.player.facingLeft)
      : this.muzzleFlash = new MuzzleFlash(this, muzzleX, muzzleY, 'muzzleFlash', this.player.facingLeft)}
      // Get the first available laser object that has been set to inactive
      let bullet = this.bullets.getFirstDead();
      // Check if we can reuse an inactive laser in our pool of lasers
      if (!bullet) {
        // Create a laser bullet and scale the sprite down
        if (this.color === 'Black') {
          bullet = new Bullet(
            this,
            bulletX,
            bulletY,
            'shot',
            this.player.facingLeft
          ).setScale(3);
        } else {
          bullet = new Bullet(
            this,
            bulletX,
            bulletY,
            'bullet',
            this.player.facingLeft
          ).setScale(2);
        }
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

  hit(enemy, bullet) {
    bullet.setActive(false);

    if(enemy.bulletHits===enemy.bulletDeath/2) {
      this.bossMadSound.play()
    }

    if(enemy.bulletHits===enemy.bulletDeath){
      enemy.destroy()
      this.bossDeathSound.play()
      this.bossAlive = false;

      // Points vary depending on difficulty of game/Unlock secret character if game beaten on 'insane'/'standard'
      const difficulty = store.getState().settings.campaignDifficulty;
      if (difficulty === 'novice') {
        this.player.increaseScore(50)
      } else if (difficulty === 'insane') {
        this.player.increaseScore(200)
        store.dispatch(setPlayerVictory(true))
      } else {
        this.player.increaseScore(100)
        store.dispatch(setPlayerVictory(true))
      }



      this.time.addEvent({
        delay: 4000,
        callback: () => this.flagpoleIsUp = true
      })
    } else {
      if (enemy === this.player) {
        let bounceLeft = false
        if (bullet.x - this.player.x > 0) {
          bounceLeft = true
        }
        enemy.bounceOff(bounceLeft)
        enemy.decreaseHealth(1)
      } else {
        if ((enemy.movingLeft && enemy.x - this.player.x < 0) || (!enemy.movingLeft && enemy.x - this.player.x > 0)) {
          enemy.bulletHits++
          enemy.playDamageTween()
        }
      }

    }
    bullet.destroy()
  }

  bossFire(boss) {
    const offsetX = 60;
    const offsetY = 5.5;
    const bombX = boss.x + (boss.movingLeft ? -offsetX : offsetX);
    const bombY = boss.y + offsetY;

    let bomb = this.bombs.getFirstDead()

    if (!bomb) {
      bomb = new Bomb(this, bombX, bombY, 'coca-cola', boss.movingLeft).setScale(2)
      this.bombs.add(bomb)
    }

    if (this.boss.movingLeft) {
    bomb.setVelocityX(-400)
    bomb.setVelocityY(-400)
    } else {
    bomb.setVelocityX(400)
    bomb.setVelocityY(-400)
    }


    this.time.addEvent({
      delay: 400,
      callback: () => {
        this.tweens.add({
          targets: bomb,
          duration: 100,
          repeat: -1,
          tint: 0xff0000
        })
      }
    })

    this.time.addEvent({
      delay: 600,
      callback: () => {
        this.events.emit('explodeFn', bomb.x, bomb.y + 10, bomb, this)
      }
    })

    bomb.reset(bombX, bombY, boss.movingLeft);
  }

  explodeFn(x, y, bomb, scene) {

    let explosion = this.explosions.getFirstDead()

    if(!explosion) {
      explosion = new Explosion (this, x, y, 'explosion').setScale(2)
      this.explosions.add(explosion)
    }

    bomb.destroy()
    scene.bombDropSound.play()
    explosion.play('explode')

    explosion.reset(x, y)
  }

  update(time, delta) {
    const scene = this
    this.player.update(time, this.cursors, this.jumpSound, this.fire, this.shootingSound);
    this.scene.get('SinglePlayerSynthwaveScene').updateHealth(this) //updates the pleyer's health displayed on scene
    this.scene.get('SinglePlayerSynthwaveScene').updateScore(this) //updates the pleyer's score displayed on scene
    if (this.muzzleFlash) this.muzzleFlash.update(delta) //updates muzzleFlash

    if (this.bossAlive) this.boss.update(time, delta, scene.bossFire, scene.player.x)

    this.updateWorldBounds()

    this.scene.get('SinglePlayerSynthwaveScene').updateLevelEnded(this)
  }
  hitWall(wall, bullet){
    bullet.setActive(false)
    const hitSound =this.wallHitSound
    hitSound.volume = 0.3
    wall.hits++
    if (wall.hits % 3 === 0){
      hitSound.play()
      const rockL = new Rock(this, wall.x - 100, wall.y, 'wallAnim1').setScale(.15)
      const rockR = new Rock(this, wall.x + 100, wall.y, 'wallAnim1').setScale(.15)
      rockL.setVelocityX(-300)
      rockL.setVelocityY(-400)
      rockR.setVelocityX(300)
      rockR.setVelocityY(-400)
      rockL.play('hit-effect')
      rockR.play('hit-effect')
    }
    if (wall.health/ 3 === wall.hits){
      this.game.textures.setTexture(wall, "Wall2").refreshBody()
    }
    if (wall.health * 2/3 === wall.hits){
      this.game.textures.setTexture(wall, "Wall3").refreshBody()
    }
    if (wall.health === wall.hits){
      wall.destroy()
      this.player.increaseScore(4)
      // add breaking sound
    }
    bullet.destroy()
  }

  updateWorldBounds() {
    const lowerBoundX = 2;
    const desiredHeightLimit = 3*this.height;

    if (this.player.x > this.width*lowerBoundX) {
      //reset bounds
      this.physics.world.setBounds(this.width*lowerBoundX, null, this.width, this.height, true, true, false, false)
      //reset camera
      this.cameras.main.setBounds(Math.min(this.player.x, this.width*lowerBoundX), -desiredHeightLimit+this.height, this.width, desiredHeightLimit)
    }
  }
}
