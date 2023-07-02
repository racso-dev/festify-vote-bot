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

export const likeSong = async (page, shadowHost, song, songsList) => {
  // Parcourir les titres de chanson et voter pour la chanson demandée
  console.log('Song', song, songsList);
  for (const title of songsList) {
    debugLogs('Songs list', songsList, 'Song', song);

    if (title.includes(song)) {
      debugLogs('Song found', true, 'Song title', title);
      // Find the song in the shadow DOM and vote for it
      const likeSongElement = await findElementInShadowRoot({
        page,
        elementHandle: shadowHost,
        selector: config.selectors.song(title),
      });
      debugLogs('Like song element handle', likeSongElement);
      // const likeSongElement = await likeSongElementHandle.asElement();
      if (likeSongElement) {
        debugLogs('Like song element', likeSongElement);
        await likeSongElement.click();
        break;
      }
      debugLogs('Like song element', likeSongElement);
    }
  }
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
