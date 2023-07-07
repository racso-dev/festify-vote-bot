import { config } from './config.js';

// Fonction pour traverser le shadow DOM et trouver un élément
export const findElementInShadowRoot = async ({ page, elementHandle, selector }) => {
  const handle = await page.evaluateHandle(
    (element, selector) => {
      const findElement = (root) => {
        if (root.querySelector(selector)) {
          return root.querySelector(selector);
        }
        const shadowRoots = Array.from(root.querySelectorAll('*'))
          .map((e) => e.shadowRoot)
          .filter((e) => e);
        for (const shadowRoot of shadowRoots) {
          const result = findElement(shadowRoot);
          if (result) {
            return result;
          }
        }
      };
      return findElement(element.shadowRoot);
    },
    elementHandle,
    selector
  );
  return await handle.asElement();
};

// Fonction pour traverser le shadow DOM et récupérer tous les éléments correspondants
export const findAllElementsInShadowRoot = async ({ page, elementHandle, selector }) => {
  return await page.evaluate(
    (element, selector) => {
      const findAllElements = (root) => {
        let elements = Array.from(root.querySelectorAll(selector));
        const shadowRoots = Array.from(root.querySelectorAll('*'))
          .map((e) => e.shadowRoot)
          .filter((e) => e);
        for (const shadowRoot of shadowRoots) {
          const result = findAllElements(shadowRoot);
          if (result.length) {
            elements = elements.concat(result);
          }
        }
        return elements;
      };
      const elements = findAllElements(element.shadowRoot);
      return elements.map((el) => el.getAttribute('title').substring(9)); // Return titles directly
    },
    elementHandle,
    selector
  );
};

export const getDurationsOfCurrentSong = async (page, shadowHost) => {
  const progressBarFrame = await findElementInShadowRoot({
    page,
    elementHandle: shadowHost,
    selector: config.selectors.progressBarFrame,
  });
  const progressBar = await findElementInShadowRoot({
    page,
    elementHandle: shadowHost,
    selector: config.selectors.progressBar,
  });

  // On calcule un ratio de la longueur de la chanson en cours
  const progressBarRect = await progressBar.boundingBox();
  const progressBarFrameRect = await progressBarFrame.boundingBox();
  const current = progressBarRect.width;
  const total = progressBarFrameRect.width;
  const ratio = (current / total);

  // On récupère la durée de la chanson en cours en ms
  const durationRegex = /transform\s+(\d+)ms/;
  const progressBarStyleValue = await progressBar.evaluate((node) => node.getAttribute('style'));
  const match = durationRegex.exec(progressBarStyleValue);
  const currentSongTotalDuration = match ? parseInt(match[1]) : null;

  return { total: currentSongTotalDuration, remaining: ratio * currentSongTotalDuration };
}

export const getSongsList = async (page, shadowHost) => {
  return await findAllElementsInShadowRoot({
    page,
    elementHandle: shadowHost,
    selector: config.selectors.like,
  });
};

export const debugLogs = (...args) => {
  const delimiterLength = 50; // Define the length of your delimiter lines
  const delimiter = '-'.repeat(delimiterLength);
  const header = 'DEBUG';

  if (config.debug)
    console.log(
      `${delimiter}[${header}]${delimiter}\n`,
      ...args.map((arg) => JSON.stringify(arg, null, 4)),
      `\n${delimiter}${delimiter}${'-'.repeat(header.length + '[]'.length)}\n`
    );
};

export const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}