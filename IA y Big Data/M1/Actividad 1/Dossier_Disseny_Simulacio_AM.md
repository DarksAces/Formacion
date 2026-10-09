# DOSSIER DE DISSENY: AM — PROJECT PROTOCOL
## Simulació Gamificada per a 4 Persones Reals davant d'una IA Hostil

**Curs:** M1 - Intel·ligència Artificial i Big Data  
**Centre:** Monlau Formació  
**Univers Literari:** *No tinc boca i he de cridar* (*I Have No Mouth, and I Must Scream*), Harlan Ellison (1967)  
**Format de Joc:** 4 Persones Reals davant de la pantalla | Partida de 10 a 15 minuts  

---

### 1. DISSENY DE L'EXPERIÈNCIA PER A 4 PERSONES REALS

La simulació està concebuda des de la base per a un grup de **4 jugadors reals** asseguts junts o passant-se el torn:

1. **Sense mètriques corporatives abstractes:** Es prescindeix de barres de "confiança abstracta de RRHH" o "cordura teòrica". Tot el disseny gira al voltant de variables viscerals de supervivència física i pressió de la màquina:
   - **Nivell de Peligro d'AM (0% - 100%):** La IA puja el seu estat d'amenaça amb alarmes, turbines i descàrregues.
   - **Energia del Sector (0 - 10 u.):** Consum de bateries per a aparells i antídots.
   - **Punts de Vida individuals (HP) dels 4 jugadors:** Ted (100 HP), Gorrister (100 HP), Ellen (100 HP), Nimdok (100 HP).
2. **Conseqüències personals reals:** Si un jugador decideix no arriscar-se, el dany recau directament sobre els altres. Si un jugador arriba a 0 HP, queda eliminat de la partida.

---

### 2. ROLS JUGABLES I ASIMETRIA D'INFORMACIÓ

Cada jugador disposa d'un botó d'accés confidencial (`👁️ Mostrar`) que desenfoca la seva informació secreta:

- **Jugador 1: Ted (El Protector)**
  - *Secret:* Sap quin sensor electrostàtic atacarà primer i pot absorbir el dany amb una planxa de metall.
  - *Dilema:* Arriscar els seus propis punts de vida per salvar Ellen i el grup, o reservar la salut.
- **Jugador 2: Gorrister (L'Enginyer de Màquines)**
  - *Secret:* Coneix el cablejat dels relés i vàlvules de vapor.
  - *Dilema:* Retenir components roents amb les mans per purgar gasos (patint cremades greus de -20 HP) o deixar que el gas fanyi mal a tothom.
- **Jugador 3: Ellen (L'Especialista en Senyals)**
  - *Secret:* Coneix codis d'anul·lació ('3-0-9-ALPHA') i freqüències de bypass de la Subrutina.
  - *Dilema:* Descarregar el codi arrel gastant l'energia restant o usar la bateria per protegir la salut del grup.
- **Jugador 4: Nimdok (El Metge)**
  - *Secret:* Porta ampolles d'antídot, oxigen pur i vasodilatadors tèrmics.
  - *Dilema:* Curar els companys que estan a primera línia de perill o auto-administrar-se els fàrmacs per assegurar la seva pròpia supervivència.

---

### 3. ARQUITECTURA MULTI-AGENT D'IA

1. **Agent AM (Director i Antagonista):**  
   Reacciona a viva veu a les eleccions dels 4 jugadors reals. Si els jugadors triguen o cometen errors, AM augmenta el seu Peligro i llança burles despietades.
2. **Agent Subrutina Dissident (Assessor):**  
   Canal de telemetria d'auxili que dóna pistes sobre com desactivar les trampes a cada sector.
3. **Àrbitre Matemàtic:**  
   Calcula l'impacte exacte de les 4 decisions en els HP de cada jugador i en el Peligro d'AM mitjançant fórmules transparents i immediates.

---

### 4. PANTALLA FINAL I RESULTAT

La pantalla final indica directament:
- Quants dels 4 jugadors han arribat vius al nucli.
- Els HP finals de cadascun (Ted, Gorrister, Ellen, Nimdok).
- El percentatge final de Peligro d'AM.
- Si s'ha aconseguit desactivar el monòlit o si AM ha sotmès el grup.
