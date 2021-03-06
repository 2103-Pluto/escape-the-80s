import 'phaser'
import store from '../store'

export default class SoldierPlayer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, socket, color) {
    super(scene, x, y, spriteKey)
    this.scene = scene;
    this.score = 0; //player's score
    this.dead = false // variable to keep track of whether a player is dead
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.facingLeft = false;
    this.isCrouching = false;
    this.socket = socket
    this.color = color || 'Blue' //defaultColor
    this.bounceVelocity = 400;
    this.hasBeenHit = false;
    //track movements
    this.setPosition(x,y)
    this.moveState = {
      x: x,
      y: y,
      // facingLeft: this.facingLeft,
      left: false,
      right: false,
      up: false,
      down: false 
    }

    //firing features
    this.fireDelay = 140;
    this.lastFired = 0;

    //bind health and score changers
    this.increaseHealth = this.increaseHealth.bind(this)
    this.increaseScore = this.increaseScore.bind(this)
    this.decreaseHealth = this.decreaseHealth.bind(this)
    this.decreaseScore = this.decreaseScore.bind(this)
    this.emitMovement = this.emitMovement.bind(this)
    this.updateOtherPlayerMovement = this.updateOtherPlayerMovement.bind(this)
    this.updateOtherPlayerInAir = this.updateOtherPlayerInAir.bind(this)
    this.revive = this.revive.bind(this)
    this.initializeHealth = this.initializeHealth.bind(this)

    // this.body.setSize(5, 40, false)
    // this.body.setOffset(30, 30)
    this.bounceOff = this.bounceOff.bind(this)
    this.playDamageTween = this.playDamageTween.bind(this)

    this.bulletHits = 0
    this.bulletDeath = this.maxHealth


    this.initializeHealth()
  }

  initializeHealth() {
    const difficulty = store.getState().settings.campaignDifficulty;
    switch (difficulty) {
      case 'novice':
        this.maxHealth = 10
        break;
      case 'insane':
        this.maxHealth = 2
        break;
      default:
        this.maxHealth = 5
    }
    this.health = this.maxHealth; //player's health

  }

  updateMovement(cursors) {
    const cam = this.scene.cameras.main;
    const speed = 3;

    //crouching
    if (cursors.down.isDown){
      if (this.body.touching.down) {
        this.body.setVelocityX(0)
      }
      this.isCrouching = true
      this.body.setSize(16, 27)
      if (!this.facingLeft) {
        this.body.setOffset(17, 12)
      } else {
        this.body.setOffset(15, 12)
      }
      this.play(`${this.color}Crouch`, true)

      if(this.socket){
        this.moveState.x = this.x
        this.moveState.y = this.y
        this.moveState.left = false
        this.moveState.right = false
        this.moveState.up = false
        this.moveState.down = true

        this.emitMovement(this.moveState)
        }
    }
    // Move left
     else if (cursors.left.isDown) { // should else if after crouch is reintroduced
      this.isCrouching = false
      this.body.setSize(14, 32)
      if (!this.facingLeft) {

        this.flipX = !this.flipX;
        this.facingLeft = true;
        // this.moveState.facingLeft = true
        this.body.setOffset(19, 7)

      }
      this.setVelocityX(-300);
      cam.scrollX -= speed;
      if (this.body.onFloor()) {
        this.play(`${this.color}Run`, true);
      }
      if(this.socket){
      this.moveState.x = this.x
      this.moveState.y = this.y
      this.moveState.left = true
      this.moveState.right = false
      this.moveState.up = false

      this.emitMovement(this.moveState)
      }
    }
    // Move right
    else if (cursors.right.isDown) {
      this.isCrouching = false
      this.body.setSize(14, 32)
      if (this.facingLeft) {
        this.flipX = !this.flipX;
        this.facingLeft = false;
        this.body.setOffset(15, 7)
      }
      this.setVelocityX(300);
      cam.scrollX += speed;
      if (this.body.onFloor()) {
        this.play(`${this.color}Run`, true);
      }
      if(this.socket){
      this.moveState.x = this.x
      this.moveState.y=this.y
      this.moveState.right = true
      this.moveState.left = false
      this.moveState.up = false

      this.emitMovement(this.moveState)
      }
    }

    // Neutral (no movement)
    else {
      this.isCrouching = false
      this.setVelocityX(0);
      this.anims.play(`${this.color}Idle`, true);

      this.body.setSize(14, 32)
      if (!this.facingLeft) {
        this.body.setOffset(15, 7)
      } else {
        this.body.setOffset(19, 7)
      }
      if(this.socket &&
        (this.moveState.left===true ||
          this.moveState.right===true ||
          this.moveState.up===true ||
          this.moveState.down === true)){
      this.moveState.left = false
      this.moveState.right = false
      this.moveState.up = false
      this.moveState.down = false
      this.emitMovement(this.moveState)
      }
    }
  }


  updateOtherPlayerMovement(moveState) {

    const cam = this.scene.cameras.main;
    const speed = 3;


    //crouching
    if (moveState.down){
      this.isCrouching = true
      this.body.setSize(16, 27)
      if (!this.facingLeft) {
        this.body.setOffset(17, 12)
      } else {
        this.body.setOffset(15, 12)
      }
      this.play(`${this.color}Crouch`, true)

    }
    // Move left
    else if (moveState.left) {  // will be else if

      this.isCrouching = false
      this.body.setSize(14, 32)
      if (!this.facingLeft) {

        this.flipX = !this.flipX;
        this.facingLeft = true;
        // this.moveState.facingLeft = true
        this.body.setOffset(19, 7)

      }
      this.setVelocityX(-300);
      cam.scrollX -= speed;
      if (this.body.onFloor()) {
        this.play(`${this.color}Run`, true);
      }
      this.setPosition(moveState.x, moveState.y)
    }
    // Move right
    else if (moveState.right) {

      this.isCrouching = false
      this.body.setSize(14, 32)
      if (this.facingLeft) {
        this.flipX = !this.flipX;
        this.facingLeft = false;
        this.body.setOffset(15, 7)
      }
      this.setVelocityX(300);
      cam.scrollX += speed;
      if (this.body.onFloor()) {
        this.play(`${this.color}Run`, true);
      }
      this.setPosition(moveState.x, moveState.y)

    }
     // Neutral (no movement)
     else {
      this.isCrouching = false
      this.setVelocityX(0);
      this.anims.play(`${this.color}Idle`, true);

      this.body.setSize(14, 32)
      if (!this.facingLeft) {
        this.body.setOffset(15, 7)
      } else {
        this.body.setOffset(19, 7)
      }
    }


  }

  update(time, cursors, jumpSound, shootingFn, shootingSound) {
    // << INSERT CODE HERE >>
    this.updateDying()
    if (!this.dead && !this.hasBeenHit) {
      this.updateMovement(cursors)
      this.updateJump(cursors, jumpSound)
      this.updateInAir();
      this.updateShoot(time, cursors, shootingFn, shootingSound);
    }
    this.updateBulletHits()

    // Kill the playe if they fall bellow ground (outside of world bounds)
    if (this.y > this.scene.game.config.height) this.decreaseHealth(this.maxHealth)
  }

  updateDying() {
    if (this.dead) {
      this.play(`${this.color}Die`, true) //play dying animation
      if (this.anims.currentAnim.key === `${this.color}Die` && this.anims.getProgress() > 0.6) {
        this.scene.showGameOverMenu(this.scene);
      }
    }
  }

  updateBulletHits(){
    if(this.bulletHits===1){
      this.decreaseHealth(1)
      this.bulletHits=0
    }
  }

  updateJump(cursors, jumpSound) {
    if (cursors.up.isDown && this.body.onFloor()) {
      this.setVelocityY(-750);
      jumpSound.play()

      if(this.socket){
      this.moveState.up = true
      this.moveState.right = false
      this.moveState.left = false
      this.moveState.down = false
      this.emitMovement(this.moveState)
      }
    }
  }

  updateOtherPlayerJump(moveState, jumpSound) {
    if (moveState.up && this.body.onFloor()) {
      this.setVelocityY(-750);
      jumpSound.play()
    }
  }

  updateInAir() {
    if (!this.body.onFloor()) {
      this.play(`${this.color}Jump`);
    }
  }

  updateOtherPlayerInAir(){
    if (!this.body.onFloor()) {
      this.play(`${this.color}Jump`);
    }
  }

  updateShoot(time, cursors, shootingFn, shootingSound) {
    if (cursors.space.isDown && time > this.lastFired) {
        if(shootingSound!==null) shootingSound.play();
        shootingFn()
        this.lastFired = time + this.fireDelay;
      }
  }


  increaseHealth(deltaHealth) {
    this.health = Math.min(this.maxHealth, this.health + deltaHealth);
  }

  increaseScore(deltaScore) {
    this.score += deltaScore;
  }

  decreaseHealth(deltaHealth) {
    this.scene.cameras.main.shake(500, 0.004)
    this.scene.hurtSound.play()
    this.health = Math.max(0, this.health - deltaHealth);
    if (this.health === 0) this.dead = true
  }

  decreaseScore(deltaScore) {
    this.score = Math.max(0, this.score - deltaScore);
  }

  // The revive a
  revive() {
    this.dead = false;
    this.score = 0;
    this.health = this.maxHealth;
  }

  bounceOff(bounceLeft) {
    this.body.checkCollision.none = true;
    this.hasBeenHit = true;
    const hitAnim = this.playDamageTween();
    (bounceLeft) ?
    this.setVelocity(-this.bounceVelocity, -this.bounceVelocity)
    : this.setVelocity(this.bounceVelocity, -this.bounceVelocity)
    this.body.checkCollision.none = false;
    this.scene.time.addEvent({
      delay: 500,
      callback: () => {
        this.hasBeenHit = false;
        hitAnim.stop();
        this.clearTint();
      },
      loop: false
    })
  }

  playDamageTween() {
    return this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: -1,
      tint: 0xffffff
    })
  }

  emitMovement(cursors){
    this.socket.emit("playerMovement", cursors)
  }
}
