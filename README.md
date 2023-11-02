# Cloner et Exécuter le Dépôt AlloMedia

Dans ce README, nous vous guiderons à travers le processus de clonage du dépôt AlloMedia, qui est une application de services de livraison. Nous vous montrerons également comment le configurer et exécuter le serveur et la base de données. Commençons !

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre système :

- [Git : Installez Git](lien_vers_l_installation_de_Git)
- [Node.js [18] et npm : Installez Node.js et npm](lien_vers_l_installation_de_Node.js)

## Cloner le Dépôt

Pour cloner le dépôt AlloMedia, suivez les étapes ci-dessous :

1. Ouvrez votre terminal ou votre invite de commande.

2. Clonez le dépôt en utilisant la commande suivante :

```bash
git clone https://github.com/medabra/AlloMedia.git
```
1 .Accédez au projet en utilisant la commande suivante :
```
cd alloMedia
```
##Installer les Dépendances
Maintenant que vous êtes dans le répertoire du projet, vous devez installer les dépendances du projet. Exécutez la commande suivante pour télécharger et installer tous les modules Node.js nécessaires et les packages spécifiés dans le fichier package.json :
```
npm install
```
##Lancer le Serveur et la Base de Données
Une fois les dépendances installées, vous pouvez démarrer le serveur en exécutant la commande suivante :
```
npm run dev
```
Cela lancera l'application AlloMedia Express, et vous devriez voir une sortie indiquant que le serveur est en cours d'exécution.

Votre base de données peut également nécessiter un démarrage ou une configuration séparée, en fonction de la configuration du projet. Veuillez consulter la documentation ou le README du projet pour des instructions spécifiques sur la configuration et le démarrage de la base de données.

C'est tout ! Vous avez cloné avec succès le dépôt AlloMedia Express, installé les dépendances nécessaires et démarré le serveur. Vous pouvez maintenant accéder et interagir avec l'application en ouvrant un navigateur web et en accédant à l'adresse appropriée (par exemple, http://localhost:3000). Profitez de l'application de livraison AlloMedia !

### Build Docker Image
***
To build the Docker image, follow these steps:

```bash
docker build -t front-image .
```
## Run Docker Container
***
To run the Docker container, use the following command:

```bash
docker run -p 5173:5173 --name front-container front-image
```
### License
***
```sql
You can copy and paste this code into your README.md file on GitHub, and then customize it with your specific project details and any additional sections you'd like to include.
```
