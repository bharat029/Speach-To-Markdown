const listenBtn = document.querySelector('#main-content > button');
const editable = document.querySelector('#editable');
const markdown = document.querySelector('#markdown');
const recognise = new webkitSpeechRecognition();

recognise.onstart = (e) => {
  listenBtn.classList.remove("blue");
  listenBtn.classList.remove("lighten-2");
  listenBtn.classList.add("red");
};

recognise.onresult = (e) => {
  listenBtn.classList.remove("red");
  listenBtn.classList.add("blue");
  listenBtn.classList.add("lighten-2");
  textToMarkdown(e.results[0][0].transcript);
};

listenBtn.onclick = (e) => {
  recognise.start();
};

editable.onkeyup = (e) => {
  markdown.innerHTML = '';

  e.target.innerHTML.split('<br>').map((val, idx) => {
    textToMarkdown(val, true);
  });
}

const textToMarkdown = (text, editing) => {
  text = text.replace(/^heading level to/, 'heading level 2');
  headingRegEx = /heading level ([1-6]) (.*)/;
  ulRegEx = /point (.*)/;
  olRegEx = /point number ([0-9]+) (.*)/;
  heading  = text.match(headingRegEx);
  ul  = text.match(ulRegEx);
  ol  = text.match(olRegEx);
  
  if (!editing) {
    editable.innerHTML = editable.innerHTML + text  + '<br>';
  }

  if (heading !== null) {
    markdown.innerHTML = markdown.innerHTML + headingText(heading[1], heading[2])  + '<br>';
  } else if (ol !== null) {
    markdown.innerHTML = markdown.innerHTML + ol[1] + '. ' + capitalize(ol[2])  + '.<br>';
  } else if (ul !== null) {
    markdown.innerHTML = markdown.innerHTML + '- ' + capitalize(ul[1])  + '.<br>';
  } else if (text) {
    markdown.innerHTML = markdown.innerHTML + capitalize(text)  + '.<br>';
  }
}

const headingText = (level, headingContent) => {
  headingContent = capitalixeAll(headingContent);
  return `${'#'.repeat(parseInt(level))} ${headingContent}`;
}

const capitalixeAll = (sent) => {
  temp = sent.split(" ").map(capitalize);
  return temp.join(' ');
}

const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

