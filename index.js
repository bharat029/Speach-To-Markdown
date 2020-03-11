const listenBtn = document.querySelector('#listen');
const stopBtn = document.querySelector('#stop');
const clearBtn = document.querySelector('#clear');
const copyBtn = document.querySelector('#copy');
const downloadBtn = document.querySelector('#download');
const editable = document.querySelector('#editable');
const markdown = document.querySelector('#markdown');
const recognise = new webkitSpeechRecognition();

recognise.onstart = (e) => {
  listenBtn.classList.add("listening");
};

recognise.onresult = (e) => {
  listenBtn.classList.remove("listening");
  textToMarkdown(e.results[0][0].transcript);
};

const textToMarkdown = (text, editing) => {
  text = text.replace(/^heading level to/i, 'heading level 2');
  headingRegEx = /^heading level ([1-6]) (.*)$/i;
  ulRegEx = /^point (.*)$/i;
  olRegEx = /^point number ([0-9]+) (.*)$/i;
  heading  = text.match(headingRegEx);
  ul  = text.match(ulRegEx);
  ol  = text.match(olRegEx);
  
  if (!editing) {
    editable.value = editable.value + text  + '\n';
  }

  if (heading !== null) {
    markdown.value = markdown.value + headingText(heading[1], heading[2])  + '\n';
  } else if (ol !== null) {
    markdown.value = markdown.value + ol[1] + '. ' + capitalize(ol[2])  + '.\n';
  } else if (ul !== null) {
    markdown.value = markdown.value + '- ' + capitalize(ul[1])  + '.\n';
  } else if (text && text !== 0) {
    markdown.value = markdown.value + capitalize(text)  + '.\n';
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

listenBtn.onclick = (e) => {
  recognise.start();
};

editable.onkeyup = (e) => {
  markdown.value = '';

  e.target.value.split('\n').map((val, idx) => {
    textToMarkdown(val, true);
  });
}

stopBtn.onclick = (e) => {
  listenBtn.classList.remove("listening");
  recognise.stop()
}

clearBtn.onclick = (e) => {
  editable.value = '';
  markdown.value = '';
}

copyBtn.onclick = (e) => {
  const markdownTxt = markdown.value;
  const el = document.createElement('textarea');
  el.value = markdownTxt;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

downloadBtn.onclick = (e) => {
  let temp = markdown.value;
  let dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(temp)
  const link = document.createElement('a')
  link.setAttribute('href', dataStr)
  link.setAttribute('download', 'stm.md')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
