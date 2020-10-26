function copyToClipboard() {
  const fieldEl = document.getElementById("main-result");

  var textArea = document.createElement("textarea");
  textArea.value = fieldEl.textContent;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("Copy");
  textArea.remove();
}

function displayAbout() {
  const aboutEl = document.getElementById("about");

  aboutEl.style.display === "block" ?
    aboutEl.style.display = "none" :
    aboutEl.style.display = "block";
}
