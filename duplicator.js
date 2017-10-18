// content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      window.open(document.location.href + 'admin', '_blank', 'toolbar=yes, location=yes, status=yes, menubar=yes, scrollbars=yes');
    }
  }
);