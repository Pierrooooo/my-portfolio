/**
 * Découpe un élément texte en lignes, mots et/ou lettres
 * @param {HTMLElement} element - L'élément à découper
 * @param {Object} options - Options de découpage
 * @param {string} options.type - Type de split: 'lines', 'words', 'letters', 'lines,words', 'lines,words,letters', 'words,letters'
 * @param {string} options.lineClass - Classe CSS pour les lignes (défaut: 'line')
 * @param {string} options.wordClass - Classe CSS pour les mots (défaut: 'word')
 * @param {string} options.letterClass - Classe CSS pour les lettres (défaut: 'letter')
 * @returns {Object} Objet contenant les tableaux lines, words et/ou letters selon le type
 */
export function splitText(element, options = {}) {
  if (!element) {
    console.warn('splitText: element is null or undefined');
    return { lines: [], words: [], letters: [] };
  }

  const {
    type = 'words',
    lineClass = 'line',
    wordClass = 'word',
    letterClass = 'letter'
  } = options;

  const types = type.split(',').map(t => t.trim());
  const result = { lines: [], words: [], letters: [] };

  const needLines = types.includes('lines');
  const needWords = types.includes('words');
  const needLetters = types.includes('letters');

  if (needLetters && !needWords && !needLines) {
    result.letters = splitLetters(element, letterClass);
    return result;
  }

  if (needWords && !needLines) {
    result.words = splitWords(element, wordClass, needLetters, letterClass);
    
    if (needLetters) {
      result.words.forEach(word => {
        const wordLetters = Array.from(word.querySelectorAll(`.${letterClass}`));
        result.letters.push(...wordLetters);
      });
    }
    
    return result;
  }

  if (needLines) {
    result.lines = splitLines(
      element,
      lineClass,
      needWords,
      wordClass,
      needLetters,
      letterClass
    );

    if (needWords) {
      result.lines.forEach(line => {
        const lineWords = Array.from(line.querySelectorAll(`.${wordClass}`));
        result.words.push(...lineWords);
      });
    }

    if (needLetters) {
      result.lines.forEach(line => {
        const lineLetters = Array.from(line.querySelectorAll(`.${letterClass}`));
        result.letters.push(...lineLetters);
      });
    }

    return result;
  }

  return result;
}


function splitLetters(element, className) {
  const text = element.textContent;
  const letters = [];
  
  element.innerHTML = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const span = document.createElement('span');
    span.className = className;
    span.textContent = char;
    
    if (char === ' ') {
      span.innerHTML = '&nbsp;';
    }
    
    element.appendChild(span);
    letters.push(span);
  }

  return letters;
}

function splitWords(element, wordClassName, doSplitLetters, letterClassName) {
  const text = element.textContent;
  const words = text.split(/(\s+)/);
  const wordSpans = [];
  
  element.innerHTML = '';

  words.forEach(word => {
    if (word.trim() === '') {
      element.appendChild(document.createTextNode(word));
      return;
    }

    const span = document.createElement('span');
    span.className = wordClassName;
    span.textContent = word;
    
    element.appendChild(span);
    wordSpans.push(span);

    // FIX: Appel correct de splitLetters si besoin
    if (doSplitLetters) {
      splitLetters(span, letterClassName);  // Utilise la fonction, pas le paramètre
    }
  });

  return wordSpans;
}

function splitLines(
  element,
  lineClassName,
  doSplitWords,
  wordClassName,
  doSplitLetters,
  letterClassName
) {
  const originalText = element.textContent;
  
  // Wrap chaque mot dans un span temporaire pour détecter les lignes
  element.innerHTML = originalText
    .split(/\s+/)
    .map(word => `<span style="display: inline-block;">${word}</span>`)
    .join(' ');

  const tempSpans = Array.from(element.querySelectorAll('span'));
  const lines = [];
  let currentLine = [];
  let lastTop = null;

  tempSpans.forEach(span => {
    const rect = span.getBoundingClientRect();
    const top = rect.top;

    if (lastTop === null || Math.abs(top - lastTop) < 1) {
      currentLine.push(span.textContent);
    } else {
      lines.push(currentLine.join(' '));
      currentLine = [span.textContent];
    }

    lastTop = top;
  });

  if (currentLine.length > 0) {
    lines.push(currentLine.join(' '));
  }

  // Reconstruit avec les vraies divs de lignes
  element.innerHTML = '';
  const lineElements = [];

  lines.forEach(lineText => {
    const lineDiv = document.createElement('div');
    lineDiv.className = lineClassName;
    lineDiv.style.overflow = 'hidden';
    lineDiv.textContent = lineText;
    
    element.appendChild(lineDiv);
    lineElements.push(lineDiv);

    if (doSplitWords) {
      splitWords(lineDiv, wordClassName, doSplitLetters, letterClassName);
    }
  });

  return lineElements;
}