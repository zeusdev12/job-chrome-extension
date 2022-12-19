const JSESSIONID_REGEX = new RegExp('JSESSIONID=["]*(.*?)["]*;');

setCsrfToken()
setInterval(() => {
  setCsrfToken()
}, 5000)


function setCsrfToken() {
  if (document.cookie.match(JSESSIONID_REGEX)) {
    var csrf_token = document.cookie.match(JSESSIONID_REGEX)[1];
    chrome.storage.local.set({ 'csrf_token': csrf_token });
  }
}