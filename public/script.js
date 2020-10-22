document.getElementById("main-form").addEventListener("submit", (e) => {
  e.preventDefault();

  fetch("/generate", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      url: document.getElementById("main-form-input").value,
    }),
  })
    .then((res) => res.json())
    .then(() => location.reload());
});

function copyToClipboard() {
  const fieldEl = document.getElementById("main-result");

  var textArea = document.createElement("textarea");
  textArea.value = fieldEl.textContent;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("Copy");
  textArea.remove();
}
