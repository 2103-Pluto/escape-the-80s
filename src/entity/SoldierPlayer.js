import 'phaser'

export default class SoldierPlayer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, socket /*, color */) {
    super(scene, x, y, spriteKey)
    this.scene = scene;
    this.score = 0; //player's score
    this.health = 5; //player's health
    this.dead = false // variable to keep track of whether a player is dead
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.facingLeft = false;
    this.isCrouching = false;
    this.socket = socket
    this.color = 'Blue' //defaultColor
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

    // this.body.setSize(5, 40, false)
    // this.body.setOffset(30, 30) //testing
    this.bounceOff = this.bounceOff.bind(this)
    this.playDamageTween = this.playDamageTween.bind(this)

    this.bulletHits = 0
    this.bulletDeath = 5
  }

  updateMovement(cursors) {
    const cam = this.scene.cameras.main;
    const speed = 3;
    
    //crouching
    if (cursors.down.isDown){
      this.isCrouching = true
      if (!this.facingLeft) {
        this.body.setSize(16, 27).setOffset(17, 12)
      } else {
        this.body.setSize(16, 27).setOffset(15, 12)
      }
      this.setVelocityX(0)
      this.play('crouch', true)

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
    else if (cursors.left.isDown) {
      this.isCrouching = false
      if (!this.facingLeft) {
        
        this.flipX = !this.flipX;
        this.facingLeft = true;
        // this.moveState.facingLeft = true
        this.body.setOffset(19, 7)
        
      }
      this.setVelocityX(-300);
      cam.scrollX -= speed;
      if (this.body.onFloor()) {
        this.play('run', true);
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
      if (this.facingLeft) {
        this.flipX = !this.flipX;
        this.facingLeft = false;
        this.body.setOffset(15, 7)
      }
      this.setVelocityX(300);
      cam.scrollX += speed;
      if (this.body.onFloor()) {
        this.play('run', true);
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
      this.anims.play('idle', true);

      this.body.setSize(14, 32)
      if (!this.facingLeft) {
        this.body.setOffset(15, 7)
      } else {
        this.body.setOffset(19, 7)
      }
      if(this.socket){
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
      this.setVelocityX(0)
      this.play('crouch', true)
      
    }
    // Move left
   else if (moveState.left) {
      if (!this.facingLeft) {
        this.flipX = !this.flipX;
        this.facingLeft = true;
        this.body.setOffset(19, 7)
      }
      this.setVelocityX(-300);
      cam.scrollX -= speed;
      if (this.body.onFloor()) {
        this.play('run', true);
        
      }
      this.setPosition(moveState.x, moveState.y)
    }
    // Move right
    else if (moveState.right) {
      
      if (this.facingLeft) {
        this.flipX = !this.flipX;
        this.facingLeft = false;
        this.body.setOffset(15, 7)
      }
      this.setVelocityX(300);
      
      cam.scrollX += speed;
      if (this.body.onFloor()) {
        this.play('run', true);
      }
      this.setPosition(moveState.x, moveState.y)

    }
     // Neutral (no movement)
     else {
      this.setVelocityX(0);
      // Whenever Josh is not moving, use the idleUnarmed animation
        this.anims.play('idle', true);
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
  }

  updateDying() {
    if (this.dead) {
      this.play('die', true) //play dying animation
      if (this.anims.currentAnim.key === 'die' && this.anims.getProgress() > 0.6) {
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
      this.play('jump');
    }
  }

  updateOtherPlayerInAir(){
    if (!this.body.onFloor()) {
      this.play('jump');
    }
  }

  updateShoot(time, cursors, shootingFn, shootingSound) {
    if (cursors.space.isDown && time > this.lastFired) {
        shootingSound.play();
        shootingFn()
        this.lastFired = time + this.fireDelay;
      }
  }

  increaseHealth(deltaHealth) {
    this.health = Math.min(5, this.health + deltaHealth);
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
    this.health = 5;
  }

  bounceOff() {
    this.body.checkCollision.none = true;
    this.hasBeenHit = true;
    const hitAnim = this.playDamageTween();
    this.facingLeft ?
    this.setVelocity(this.bounceVelocity, -this.bounceVelocity)
    : this.setVelocity(-this.bounceVelocity, -this.bounceVelocity)
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
