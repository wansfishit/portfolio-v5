// Programmatic Web Audio Synthesizer for Retro Click Sounds
// 100% asset-free, no downloads, instant loading, lag-free.

export const playClickSound = () => {
  const enabled = localStorage.getItem("soundEnabled") === "true";
  if (!enabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Quick high-pitch frequency sweep
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);
    
    // Sharp decay envelope
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {}
};

export const playKeySound = () => {
  const enabled = localStorage.getItem("soundEnabled") === "true";
  if (!enabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Slightly lower, faster sweep for typings
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03);
    
    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch (e) {}
};

export const playHoverSound = () => {
  const enabled = localStorage.getItem("soundEnabled") === "true";
  if (!enabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Very subtle, high-pitch pop for hovers
    osc.frequency.setValueAtTime(2000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.02);
    
    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch (e) {}
};
