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
    this.socket = socket

    this.color = 'Blue' //defaultColor

    //firing features
    this.fireDelay = 140;
    this.lastFired = 0;

    //bind health and score changers
    this.increaseHealth = this.increaseHealth.bind(this)
    this.increaseScore = this.increaseScore.bind(this)
    this.decreaseHealth = this.decreaseHealth.bind(this)
    this.decreaseScore = this.decreaseScore.bind(this)
    this.revive = this.revive.bind(this)
  }

  updateMovement(cursors) {
    const cam = this.scene.cameras.main;
    const speed = 3;
    // Move left
    if (cursors.left.isDown) {
      if (!this.facingLeft) {
        this.flipX = !this.flipX;
        this.facingLeft = true;

      }
      this.setVelocityX(-360);
      cam.scrollX -= speed;
      if (this.body.touching.down) {
        this.play('run', true);
      }
    }
    // Move right
    else if (cursors.right.isDown) {
      if (this.facingLeft) {
        this.flipX = !this.flipX;
        this.facingLeft = false;
      }
      this.setVelocityX(360);
      cam.scrollX += speed;
      if (this.body.touching.down) {
        this.play('run', true);
      }
    }
    // Neutral (no movement)
    else {
      this.setVelocityX(0);
      this.play('idle', true);
    }

    //emit any movement
    let x = this.x
    let y = this.y
    if (
      this.oldPosition && (x!=this.oldPosition.x ||
      y!== this.oldPosition.y) && this.socket
    ) {
      this.socket.emit("playerMovement", {
        x: this.x,
        y: this.y
      })
    }
    this.oldPosition = {
      x: this.x,
      y: this.y
    }
  }

  update(time, cursors, jumpSound, shootingFn, shootingSound) {
    // << INSERT CODE HERE >>
    this.updateDying()
    if (!this.dead) {
      this.updateMovement(cursors)
      this.updateJump(cursors, jumpSound)
      this.updateInAir();
      this.updateShoot(time, cursors, shootingFn, shootingSound);
    }
  }

  updateDying() {
    if (this.dead) {
      this.play('die', true) //play dying animation
      if (this.anims.currentAnim.key === 'die' && this.anims.getProgress() > 0.6) {
        this.scene.scene.pause() //pause scene
        this.scene.backgroundSound.pause()  //pause music
        // this.scene.scene.launch('GameOverMenu')
        // this.scene.scene.moveAbove(this.scene, 'GameOverMenu')
      }
    }
  }

  updateJump(cursors, jumpSound) {
    if (cursors.up.isDown && this.body.touching.down) {
      this.setVelocityY(-600);
      jumpSound.play()
    }
  }

  updateInAir() {
    if (!this.body.touching.down) {
      this.play('jump');
    }
  }

  updateShoot(time, cursors, shootingFn, shootingSound) {
    if (cursors.space.isDown && time > this.lastFired) {
        // shootingSound.play();
        shootingFn()
        this.lastFired = time + this.fireDelay;
      }
  }

  increaseHealth(deltaHealth) {
    this.health = Math.min(5, this.health + deltaHealth);
    this.scene.powerUpSound.play() //play power up sound
  }

  increaseScore(deltaScore) {
    this.score += deltaScore;
    this.scene.coinSound.play() //play collecting coin sound
  }

  decreaseHealth(deltaHealth) {
    this.scene.cameras.main.shake(500, 0.004) //shake camera
    this.scene.hurtSound.play() //play hurt sound
    this.health = Math.max(0, this.health - deltaHealth);
    if (this.health === 0) this.dead = true;
  }

  decreaseScore(deltaScore) {
    this.score = Math.max(0, this.score - deltaScore);
  }

  revive() {
    this.dead = false;
    this.score = 0;
    this.health = 5;
  }
}
