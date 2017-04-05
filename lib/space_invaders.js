const GameView = require('./game_view');

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  canvas.height = 600;
  canvas.width = 900;

  const canvasSize = [canvas.width, canvas.height];
  const ctx        = canvas.getContext('2d');
  const gameView   = new GameView(ctx, canvasSize);

  gameView.welcome();

  const mainLogo           = document.getElementById('main-logo');
  const playGameButton     = document.getElementById('play-game');
  const gameOverImage      = document.getElementById('game-over');
  const menuButton         = document.getElementById('menu-button');
  const menuContainer      = document.getElementById('menu-container');
  const aboutButton        = document.getElementById('about-button');
  const about              = document.getElementById('about');
  const instructionsButton = document.getElementById('instructions-button');
  const instructions       = document.getElementById('instructions');
  const resumeButton       = document.getElementById('resume-button');
  const restartButton      = document.getElementById('restart-button');
  const closeAbout         = document.getElementById('close-about');
  const closeInstructions  = document.getElementById('close-instructions');
  const grunt              = document.getElementById('grunt-1');
  const soldier            = document.getElementById('soldier-1');
  const invader            = document.getElementById('invader-1');
  const ufo                = document.getElementById('ufo');
  const invaderInfo        = document.getElementById('invader-info');
  const audio              = document.getElementById('audio');
  const mute               = document.getElementById('mute');
  const splashInstruction  = document.getElementById('splash-instruction');

  audio.addEventListener('click', () => {
    if (audio.className === 'hide') {
      audio.className   = 'show';
      mute.className    = 'hide';
    } else {
      audio.className   = 'hide';
      mute.className    = 'show';
    }

    gameView.toggleAudio();
  });

  mute.addEventListener('click', () => {
    if (audio.className === 'hide') {
      audio.className   = 'show';
      mute.className    = 'hide';
    } else {
      audio.className   = 'hide';
      mute.className    = 'show';
    }

    gameView.toggleAudio();
  });

  playGameButton.addEventListener("click", () => {
    menuButton.className        =     '';
    playGameButton.className    = 'hide';
    mainLogo.className          = 'hide';
    gameOverImage.className     = 'hide';
    grunt.className             = 'hide';
    soldier.className           = 'hide';
    invader.className           = 'hide';
    ufo.className               = 'hide';
    invaderInfo.className       = 'hide';
    splashInstruction.className = 'hide';

    gameView.start();
  });

  menuButton.addEventListener("click", () => {
    gameView.pause();

    menuContainer.className = 'show';
    aboutButton.className = '';
    instructionsButton.className = '';
    resumeButton.className = '';
    restartButton.className = '';
  });

  closeAbout.addEventListener('click', () => {
    gameView.pause();

    about.className = 'hide';
    instructions.className = 'hide';
    closeAbout.className = 'hide';

    menuContainer.className = '';
    aboutButton.className = '';
    instructionsButton.className = '';
    resumeButton.className = '';
    restartButton.className = '';
  });

  aboutButton.addEventListener('click', () => {
    gameView.pause();

    menuContainer.className = 'hide';
    aboutButton.className = 'hide';
    instructionsButton.className = 'hide';
    resumeButton.className = 'hide';
    restartButton.className = 'hide';

    about.className = 'show';
    closeAbout.className = 'show';
  });

  closeInstructions.addEventListener('click', () => {
    gameView.pause();

    about.className = 'hide';
    instructions.className = 'hide';
    closeAbout.className = 'hide';

    menuContainer.className = 'show';
    aboutButton.className = '';
    instructionsButton.className = '';
    resumeButton.className = '';
    restartButton.className = '';
  });

  instructionsButton.addEventListener('click', () => {
    gameView.pause();

    menuContainer.className = 'hide';
    aboutButton.className = 'hide';
    instructionsButton.className = 'hide';
    resumeButton.className = 'hide';
    restartButton.className = 'hide';

    instructions.className = '';
    closeInstructions.className = '';
  });

  resumeButton.addEventListener('click', () => {
    menuContainer.className = 'hide';
    aboutButton.className = 'hide';
    instructionsButton.className = 'hide';
    resumeButton.className = 'hide';
    restartButton.className = 'hide';

    gameView.resume();
  });

  restartButton.addEventListener('click', () => {
    menuContainer.className = 'hide';
    aboutButton.className = 'hide';
    instructionsButton.className = 'hide';
    resumeButton.className = 'hide';
    restartButton.className = 'hide';

    gameView.restart();
  });

});
