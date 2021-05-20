import Phaser from "phaser"

export default class Wall extends Phaser.Physics.Arcade.Sprite{
  constructor(scene, x , y, spritekey){
    this.scene = scene
    this.x = x
    this.y = y
    this.scene.add.existing.this
    this.hits = 20 // arbitrary health of the wall
    this.state1 = true // use these to manage which stage the wall is in relative to the health of the wall
    this.state2 = false
    this.state3 = false
  }
}
