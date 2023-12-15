window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true,
    macros: {
      // Sorry, but I really just want to get on with life...
      rectangle: '{\\sqsubset \\! \\sqsupset}'
    },
    packages: {
      '[+]': [
        'mathtools'
      ]
    }
  },
  loader: {
    load: [
      '[tex]/mathtools'
    ]
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex"
  }
};

document$.subscribe(() => {
  MathJax.typesetPromise()
});