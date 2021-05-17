import Phaser from 'phaser'

export default class StoryScene extends Phaser.Scene {
  constructor() {
    super('StoryScene');
    
    //story array
    this.storyArr = [
      'Rex Schraeder was just a regular dude living in the third decade of the Twenty-First century.',
      'He liked to do what most dudes do: workout and tan. He had aspirations of joining corporate media.',
      'But life had other things in store…',
      'The morning of his big interview with Corporate Media Network (CMN), he woke up to find himself transported back to the year 1987.',
      'Help Rex escape the eighties and ace his interview.'
    ]
    this.renderStory = this.renderStory.bind(this)
    this.skipButton = this.skipButton.bind(this)
    this.nextButton = this.nextButton.bind(this)
    this.enableNext = this.enableNext.bind(this)
  }

  init(data) {
    this.color = data.color //retrieve color
  }
  
  renderStory(scene, index) {
    console.log(scene.story)
    
    scene.story.lineSpacing = 20
    const lines = scene.story.getWrappedText(scene.storyArr[index])
    const wrappedText = lines.join('\n')
    const length = wrappedText.length
    let i = 0
    
    scene.time.addEvent({
      callback: () => {
        scene.story.text += wrappedText[i]
        ++i
      },
      repeat: length - 1,
      delay: 75
    })
    scene.time.delayedCall(75 * scene.storyArr[index].length, scene.enableNext, null, this)
    
  }
  
  enableNext() {
    const scene = this
    this.next.setInteractive()
  }
  
  nextButton(scene) {
    scene.next = scene.add.text(400, 500, 'Start Story', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5, 0.5).setColor('#4DF3F5')
    
    scene.next.setInteractive()
    scene.next.on("pointerover", () => {
      scene.hoverIcon.setVisible(true);
      scene.next.setColor('#feff38')
      scene.hoverIcon.x = scene.next.x - scene.next.width + 5;
      scene.hoverIcon.y = scene.next.y;
    })
    scene.next.on("pointerout", () => {
      scene.hoverIcon.setVisible(false);
      scene.next.setColor('#4DF3F5')
    })
    
    let idx = -1;
    
    scene.next.on("pointerup", () => {
      idx++
      if (idx < scene.storyArr.length) {
        scene.hoverIcon.setVisible(false);
        scene.next.setColor('#4DF3F5')
        scene.next.text = 'Next'
        scene.story.text = ""
        scene.next.removeInteractive()
        scene.renderStory(scene, idx)
      } else {
        scene.skip.text = 'Play'
        scene.hoverIcon.setVisible(false)
        scene.next.destroy()
      }
    })
  }
  
  skipButton(scene) {
    scene.skip = scene.add.text(710, 40, 'Skip', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5, 0.5).setColor('#4DF3F5')
    scene.skip.setInteractive();
    scene.skip.on("pointerover", () => {
      scene.hoverIcon.setVisible(true);
      scene.skip.setColor('#feff38')
      scene.hoverIcon.x = scene.skip.x - scene.skip.width + 5;
      scene.hoverIcon.y = scene.skip.y;
    })
    scene.skip.on("pointerout", () => {
      scene.hoverIcon.setVisible(false);
      scene.skip.setColor('#4DF3F5')
    })
    scene.skip.on("pointerup", () => {
      scene.click.play();
      scene.scene.start('SinglePlayerSynthwaveScene', { color: scene.color });
    })

  }

  create() {
    
    this.sound.pauseOnBlur = false; //prevent sound from cutting when you leave tab
    
    //set height and width
    this.width = this.game.config.width;
    this.height = this.game.config.height;
    
    //add story
    // this.renderStory(this, 0)
    this.story = this.add.text(this.width*0.5, this.height*0.5, '', { fontFamily: '"Press Start 2P"' }).setFontSize(20).setOrigin(0.5, 0.5).setWordWrapWidth(600)
    
    //add next button
    this.nextButton(this)
    
    //add back
    this.scene.get('CreditsScene').createBack(this, 'CharacterChoosingScene');
    
    //add skip
    this.skipButton(this)

  }
}
