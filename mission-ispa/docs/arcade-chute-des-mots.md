# Intégration Arcade : Chute des Mots

Ce document décrit l'intégration du mini-jeu autonome "Chute des mots" au sein du moteur de Mission ISPA.

## 1. URL et Paramètres d'Intégration
Le jeu est chargé dans une `iframe` via l'URL configurée par la variable d'environnement `VITE_CHUTE_DES_MOTS_URL` (fallback: `https://jeu-verbes.vercel.app/`).

Les paramètres URL utilisés sont :
- `contentMode=tenses` : Active le mode des temps verbaux.
- `cefrLevel=B2` : Définit le niveau de difficulté.
- `playMode=game` : Lance le mode de jeu standard.
- `wordsPerGame=30` : Nombre de mots dans une partie.
- `missionId=arcade-chute-des-mots-b2-temps-niveau-3` : ID de la mission ciblée.
- `integrationMode=1` : Indique au mini-jeu de se comporter comme une application intégrée (envoie de postMessage).
- `minAccuracy=70` : Le pourcentage minimum de réussite requis.
- `allowColumnDeath=false` : Empêche la fin de partie prématurée en cas de colonne pleine.
- `autostart=1` : Démarre le jeu automatiquement sans passer par le menu d'accueil.

## 2. Contrat de communication (postMessage)
Le mini-jeu envoie un événement `message` à la fenêtre parente (Mission ISPA) avec un objet JSON :

```json
{
  "type": "chute-des-mots:complete",
  "payload": {
    "missionId": "arcade-chute-des-mots-b2-temps-niveau-3",
    "contentMode": "tenses",
    "cefrLevel": "B2",
    "score": 1450,
    "accuracy": 85,
    "success": true,
    ...
  }
}
```

## 3. Condition de Validation de la Mission
Mission ISPA écoute ce message dans le composant `ChuteDesMotsIntegration.tsx`. La mission n'est validée et marquée comme terminée dans le store `Zustand` que si **TOUTES** ces conditions sont remplies :
1. `payload.missionId === "arcade-chute-des-mots-b2-temps-niveau-3"`
2. `payload.contentMode === "tenses"`
3. `payload.cefrLevel === "B2"`
4. `payload.success === true` (ou en fallback, `accuracy >= 70`).

## 4. Modification des Paramètres
Si l'équipe pédagogique souhaite abaisser le seuil de réussite (par exemple, 60 %), il faut :
1. Modifier la constante `MIN_ACCURACY` dans `src/components/arcade/ChuteDesMotsIntegration.tsx`.
2. Mettre à jour le texte de description dans `src/data/missions.ts` et `src/data/arcadeGames.ts` pour refléter la nouvelle exigence.
