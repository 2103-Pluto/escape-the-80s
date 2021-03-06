/** @type {import("../typings/phaser")} */
/* The above loads the phaser.d.ts file so that VSCode has autocomplete for the Phaser API.
If you experience problems with autocomplete, try opening the phaser.d.ts file and scrolling up and down in it.
That may fix the problem -- some weird quirk with VSCode. A new typing file is released with
every new release of Phaser. Make sure it's up-to-date!

At some point, the typings will
be officially added to the official release so that all you'll have to do is do:

npm install @types/phaser

But this hasn't happened yet!
*/

// Bring in all the scenes
import 'phaser';
import config from './config/config'
import SynthwaveScene from './scenes/SynthwaveScene';
import NeonAlleyScene from './scenes/NeonAlleyScene';
import MoonlightScene from './scenes/MoonlightScene';
import SkyLineScene from './scenes/SkyLineScene';
import TitleScene from './scenes/TitleScene'
import PauseScene from './scenes/PauseScene'
import CreditsScene from './scenes/CreditsScene'
import MainMenuScene from './scenes/MainMenuScene'
import ControlsScene from './scenes/ControlsScene'
import HighScoresScene from './scenes/HighScoresScene'
import CharacterChoosingScene from './scenes/CharacterChoosingScene'
import StoryScene from './scenes/StoryScene'
import SaveScoreScene from './scenes/SaveScoreScene'
import LevelCompletedScene from './scenes/LevelCompletedScene'
import GameOverMenuScene from './scenes/GameOverMenuScene'
import SinglePlayerSynthwaveScene from './scenes/SinglePlayerSynthwaveScene'
import WaitingRoom from './scenes/WaitingRoom'
import CountdownScene from './scenes/CountdownScene'
import WaitingforPlayer from './scenes/MultiplayerWaitingScene'
import MultiplayerCompletedScene from './scenes/MultiplayerCompletedScene'
import RickRollScene from './scenes/RickRollScene'
import SettingsScene from './scenes/SettingsScene'


class Game extends Phaser.Game {
  constructor() {
    // Add the config file to the game
    super(config);

    // Add all the scenes
    // << ADD ALL SCENES HERE >>
    this.scene.add('SynthwaveScene', SynthwaveScene)
    this.scene.add('NeonAlleyScene', NeonAlleyScene)
    this.scene.add('MoonlightScene', MoonlightScene)
    this.scene.add('SkyLineScene', SkyLineScene)
    this.scene.add('TitleScene', TitleScene)
    this.scene.add('CreditsScene', CreditsScene)
    this.scene.add('MainMenuScene', MainMenuScene)
    this.scene.add('PauseScene', PauseScene)
    this.scene.add('LevelCompletedScene', LevelCompletedScene)
    this.scene.add('ControlsScene', ControlsScene)
    this.scene.add('HighScoresScene', HighScoresScene)
    this.scene.add('SettingsScene', SettingsScene)
    this.scene.add('CharacterChoosingScene', CharacterChoosingScene)
    this.scene.add('StoryScene', StoryScene)
    this.scene.add('GameOverMenuScene', GameOverMenuScene)
    this.scene.add('SaveScoreScene', SaveScoreScene)
    this.scene.add('SinglePlayerSynthwaveScene', SinglePlayerSynthwaveScene)
    this.scene.add('WaitingRoom', WaitingRoom)
    this.scene.add('CountdownScene', CountdownScene)
    this.scene.add("WaitingforPlayer", WaitingforPlayer)
    this.scene.add("MultiplayerCompletedScene", MultiplayerCompletedScene)

    this.scene.add('RickRollScene', RickRollScene)

    // Start the game with the titlescene
    this.scene.start('TitleScene')

  }
}
// Create new instance of game
window.onload = function () {
  window.game = new Game();
}
