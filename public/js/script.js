function copyToClipboard() {
  const fieldEl = document.getElementById("main-result");

  var textArea = document.createElement("textarea");
  textArea.value = fieldEl.textContent;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("Copy");
  textArea.remove();
}
