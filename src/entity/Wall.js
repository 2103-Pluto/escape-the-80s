import Phaser from "phaser"

export default class Wall extends Phaser.Physics.Arcade.Sprite{
  constructor(scene, x , y, spritekey){
    super(scene, x, y, spritekey)
    this.scene = scene
    this.x = x
    this.y = y
    this.spritekey = spritekey
    this.scene.add.existing(this)
    this.health = 30 // MUST BE DIVISIBLE BY 3
    this.hits = 0
    this.state1 = true // use these to manage which stage the wall is in relative to the health of the wall
    this.state2 = false
    this.state3 = false
    this.phaseTransition = this.phaseTransition.bind(this)
  }


  update(time, delta){
    this.phaseTransition()
  }

  phaseTransition(){
    if (this.health/ 3 === this.hits){
      this.state1 = false
      this.state2 = true
      // add wallcrumbling sound
    }
    if (this.health * 2/3 === this.hits){
      this.state2 = false
      this.state3 = true
      // add wall crumbling sound
    }
  }
}
