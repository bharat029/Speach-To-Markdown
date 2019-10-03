const btn = document.querySelector('#listen');
const content = document.querySelector('#content');

const recognise = new webkitSpeechRecognition();

recognise.onstart = (e) => {
  btn.style.background = 'red';
};

recognise.onresult = (e) => {
  btn.style.background = 'blue';
  content.textContent = e.results[0][0].transcript;
  speak(e.results[0][0].transcript);
};

btn.onclick = (e) => {
  recognise.start();
};

const speak = (msg) => {
  const speach = new SpeechSynthesisUtterance(msg);
  window.speechSynthesis.speak(speach);
};