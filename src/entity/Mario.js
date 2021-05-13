import 'phaser';
//import { GetSpeed } from 'phaser/src/math';

export default class Mario extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spritekey) {
    super(scene, x, y, spritekey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.initialX = x
    this.x = this.initialX
    this.y = y
    this.movingLeft = false
    // << INITIALIZE PLAYER ATTRIBUTES HERE >>
    
  }


  

  patrol(){
    const speed = 1
 
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
  update() {
    this.patrol()
    this.anims.play('walk', true)
  
  }
}
