const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const createOscillator = (freq) => {
  const osc = audioCtx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = freq;
  osc.detune.value = 0;
  osc.start(audioCtx.currentTime);
  return osc;
};

const createGainNode = () => {
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0;
  gainNode.connect(audioCtx.destination);
  return gainNode;
};

const Note = function(freq) {
  this.oscillatorNode = createOscillator(freq);
  this.gainNode = createGainNode();
  this.oscillatorNode.connect(this.gainNode);

  this.tones = {
    'fireBullet': 880.00,
    'death': 1046.50
  };
};

Note.prototype.start = function() {
  this.gainNode.gain.value = 0.3;
};

Note.prototype.stop = function() {
  this.gainNode.gain.value = 0;
};

module.exports = Note;
