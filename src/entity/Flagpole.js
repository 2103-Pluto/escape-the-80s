import 'phaser'

export default class Flagpole extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, spritekey){
        super(scene, x, y, spritekey)
        this.scene = scene
        this.x = x
        this.y = y
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this)


    }
}
