# Correcció de Z1 4+2

Repositori: castatslab/app. Base consultada: cb051f6a6742dd0fa8c8f1220d9701af96bbe703.
Branca local: fix/z1-4-2-cycle.

## Ambigüitat documentada i acordada abans del canvi

El motor passa directament a RECEPCIO quan serveix el rival, sense un esdeveniment independent de servei executat. L'usuari ha confirmat que RECEPCIO s'interpreta com a servei rival ja executat. No s'afegeixen controls ni fases al motor. La valoració de col·locació avança a ATAC; aquest és el moment de retorn visual a Z1.

## Canvi

La tàctica existent penetration-z1 només presenta la geometria 4+2 en RECEPCIO i COLLOCACIO. En SERVEI, ATAC, DEFENSA i BLOQUEIG presenta 3+3. Després de servei propi jugable, Z1 es queda al darrere fins a COLLOCACIO. Cada nova recuperació torna a activar COLLOCACIO i la penetració.

La jugadora es continua obtenint de court['1'], sense identitat fixa. L'intercanvi visual existent evita duplicacions i manté les zones reglamentàries. No es modifica el motor, les estadístiques, el Pas 4, les rotacions ni les dades de partits. Habitual 3+3 manté el comportament.

## Validació

- Node: 7 proves, 7 correctes, 0 errors. Inclou servei propi 1/2, servei rival, retorn després de col·locar, nova recuperació, sis rotacions, substitució en cinc fases, Desfer, recàrrega, cadenats i Habitual 3+3.
- Playwright/Chromium: proves locals amb dades sintètiques en 1440x900, 844x390 i 390x844. Comproven fases, geometria, persistència, Desfer, dades intactes i desactivació de la tàctica. S'hi afegeix comprovació d'identitats úniques i absència de solapaments.
- git diff --check.

## Preparació de la còpia

El proxy de l'entorn impedeix git clone. S'han recuperat els 118 fitxers de text del repositori amb el connector de GitHub i s'ha creat una branca sobre aquesta instantània local, sense historial remot. Els recursos binaris no s'han descarregat; la prova de navegador comprova la geometria i el comportament amb els HTML, CSS i scripts del repositori. No és una revisió de les imatges de fons.

No s'ha fet push, merge ni desplegament. El pedaç només inclou els fitxers modificats; no inclou dades de partits.

Resultat final: les tres proves de navegador passen també amb detecció de solapaments. El pedaç supera git apply --check contra els quatre fitxers originals recuperats de GitHub. Les 7 proves Node passen. git diff --check sense incidències.
