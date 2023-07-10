# Festify Vote Bot

Festify Vote Bot est un bot vous permettant de prendre le contrôle d'un Festify qui ne nécessite pas d'authentification. L'application utilise Puppeteer pour simuler les interactions d'un utilisateur dans un navigateur, vous permettant de voter pour une chanson spécifique sur Festify.

## Prérequis

Pour exécuter ce projet, vous devez avoir Node.js installé sur votre machine.

## Installation

Pour installer les dépendances nécessaires, exécutez :

```bash
pnpm install
```

## Utilisation

L'application est personnalisable via des options en ligne de commande. Vous pouvez utiliser les options suivantes :  

```sh
--url / -u : L'URL de la page Festify où le bot doit voter.  
--capacity / -c : Spécifie la capacité de votes du bot. La valeur par défaut est 1.  
--stealth / -s : Active le mode furtif, qui permet d'envoyer tous les votes en même temps dans les 5 dernières secondes de la musique en cours. La valeur par défaut est false.  
--debug / -d : Active le mode de débogage, qui affiche des journaux de débogage supplémentaires. La valeur par défaut est false.  
--headless / -h : Fait fonctionner le navigateur en mode sans tête, c'est-à-dire sans interface utilisateur graphique. La valeur par défaut est false.  
--timeOut : Le délai en millisecondes à attendre avant que le bot n'essaye d'interagir avec la page. La valeur par défaut est 5000.  
```

Par exemple, pour démarrer le bot avec une capacité de votes spécifiée, exécutez :

```bash
pnpm start --url "https://festify.us/party/-NZQ2V0x0qyFqyUzBFKe" --capacity 10
```

Une fois l'initialisation de tous les slaves terminée, il vous sera alors demandé de choisir une chanson ainsi que de renseigner un nombre de vote. Une fois ces informations renseignées, le bot se chargera de voter pour la chanson choisie.
