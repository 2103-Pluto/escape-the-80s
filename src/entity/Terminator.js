import 'phaser';
import MuzzleFlash from './MuzzleFlash';
import Bullet from './Bullet';
//import { GetSpeed } from 'phaser/src/math';

export default class Terminator extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spritekey) {
    super(scene, x, y, spritekey);
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
    // << INITIALIZE PLAYER ATTRIBUTES HERE >>
    this.bulletHits = 0
    this.bulletDeath = 20
    this.name = 'terminator'
    

  }


  

  patrol(){
    const speed = 3
 
    this.leftDest = this.initialX-100
    this.rightDest = this.initialX+100

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

  // Check which controller button is being pushed and execute movement & animation
  update(time, delta, shootFn, shootingSound, playerX) {
    const dead = this.bulletHits===this.bulletDeath
    const playerIsNear = -400< (this.x - playerX) && (this.x - playerX) < 400
    this.patrol()
    if(!dead) this.anims.play('terminator-walk', true)
    
    
    if(!dead && playerIsNear && this.timeFromLastAttack + this.attackDelay <=time){
        shootFn(this)
        shootingSound.play()
        this.timeFromLastAttack = time
        this.attackDelay = this.getAttackDelay()
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
