{

let pollTask;

window.addEventListener('load', () => {
  const pollIntervalMs = 30;
  let lastHrefValue;
  const previousStackSize = 5;
  let ignoreNextNavigation = false;

  const previousButtonClass = 'tus-back-to-previous';
  const previousButtonDisabledClass = 'tus-back-to-previous--disabled';

  const previousStack = [];

  const previousButtonList = document.querySelectorAll('.' + previousButtonClass);

  const addToPreviousStack = (href) => {
    if (previousStack.length < previousStackSize) {
      previousStack.push(href);
      console.log('push' + href);
      return;
    }

    for (let i = 0; i < previousStackSize - 1; i++)
      previousStack[i] = previousStack[i + 1];
    previousStack[previousStackSize - 1] = href;
    console.log('shift and set ' + href);
  };

  const onPreviousClick = () => {
    const previousHref = previousStack.pop();
    console.log('popped ' + previousHref);

    if (previousHref && previousStack.length == 0) {
      console.log('adding disabled class');
      for (const previousButton of previousButtonList)
        previousButton.classList.add(previousButtonDisabledClass);
    }

    if (previousHref) {
      ignoreNextNavigation = true;
      window.location.href = previousHref;
      console.log('navigate ' + previousHref);
    }
  };

  for (const previousButton of previousButtonList) {
    previousButton.addEventListener('click', onPreviousClick);
    previousButton.classList.add(previousButtonDisabledClass);
  }

  const onHrefChange = (oldHref, newHref) => {
    if (ignoreNextNavigation) {
      ignoreNextNavigation = false;
      console.log('ignoring navigation');
      return;
    }

    addToPreviousStack(oldHref);

    console.log('removing disabled class');
    for (const previousButton of previousButtonList)
      previousButton.classList.remove(previousButtonDisabledClass);
  };

  const pollHandler = () => {
    const currentHrefValue = window.location.href;

    if (!lastHrefValue) {
      lastHrefValue = currentHrefValue;
      return;
    }

    if (lastHrefValue != currentHrefValue)
      onHrefChange(lastHrefValue, currentHrefValue);

    lastHrefValue = currentHrefValue;
  };

  pollTask = setInterval(pollHandler, pollIntervalMs);
});

window.addEventListener('unload', () => {
  if (pollTask) {
    clearInterval(pollTask);
    pollTask = undefined;
  }
});

}