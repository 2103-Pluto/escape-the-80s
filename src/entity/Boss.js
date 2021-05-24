import 'phaser';

export default class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.initialX = x
    this.x = this.initialX
    this.y = y
    this.movingLeft = false
    this.setPushable(false)
    this.timeFromLastAttack = 0
    this.attackDelay = this.getAttackDelay()
    this.playDamageTween = this.playDamageTween.bind(this)

    this.bulletHits = 0
    this.bulletDeath = 30
    this.name = 'Boss'
  }

  patrol(){
    const speed = 3

    this.leftDest = this.initialX-200
    this.rightDest = this.initialX+200

    if(this.x<=this.rightDest && this.movingLeft===false){

      this.x+=speed


    } else if(this.x>this.rightDest){
      this.movingLeft=true
      this.flipX = !this.flipX
    }

    if(this.x>=this.leftDest && this.movingLeft===true){
      this.x-=speed


    } else if (this.x<this.leftDest){
      this.movingLeft=false
      this.flipX = !this.flipX
    }

  }

  update(time, delta, shootFn, playerX) {
    const dead = this.bulletHits===this.bulletDeath
    const playerIsNear = playerX > this.scene.width*2
    if (playerIsNear) this.patrol()
    if(!dead) this.anims.play('boss-run', true)


    if (Math.floor(time) % 3 === 0) {
      if(!dead && playerIsNear && this.timeFromLastAttack + this.attackDelay <=time){
        shootFn(this)
        this.timeFromLastAttack = time
        this.attackDelay = this.getAttackDelay()
    }
    }

    if (Math.floor(time) % 11 === 0 && this.body.onFloor()) {
      this.body.setVelocityY(-900)
    }

  }

  getAttackDelay(){
    return Phaser.Math.Between(200, 400)
  }


  playDamageTween() {
    const hitAnim = this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: -1,
      tint: 0xff0000
    })

    this.scene.time.addEvent({
      delay: 250,
      callback: () => {
        this.hasBeenHit = false;
        hitAnim.stop();
        this.clearTint();
      },
      loop: false
    })
  }
}
