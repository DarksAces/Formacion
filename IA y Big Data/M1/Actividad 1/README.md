# AM: Project Protocol — Simulació per a 4 Jugadors Reals

> **Activitat 1: Disseny d'una simulació gamificada amb IA agèntica**  
> *Mòdul M1 - IA i Big Data (Monlau Formació)*  
> *Dissenyat per a 4 PERSONES REALS en viu (Ted, Gorrister, Ellen, Nimdok)*  
> *Inspirat en les dinàmiques d'Everest V3 i l'univers de 'No tinc boca i he de cridar' (Harlan Ellison 1967 & Videojoc Cyberdreams 1995)*

---

## 1. Visió General de la Simulació

**AM: Project Protocol** és una aplicació interactiva governada per IA agèntica pensada per ser jugada per **4 persones reals davant d'una pantalla** (o en torns pass-and-play). Cada participant assumeix el rol d'un dels supervivents:

- **Jugador 1: Ted** (El Fals Protector / Líder Assenyalat)
- **Jugador 2: Gorrister** (L'Enginyer de Màquines)
- **Jugador 3: Ellen** (L'Especialista en Senyals)
- **Jugador 4: Nimdok** (El Metge / Suport Químic)

### Variables de Supervivència Física Directa:
- ⚠️ **Peligro d'AM (0% - 100%):** Si arriba al 100%, AM desferma les seves urpes mecàniques i sotmet tot el grup.
- ⚡ **Energia del Complex (0 - 10 u.):** Recursos limitats de suport vital per alimentar consoles, curtcircuits i antídots.
- ❤️ **Salut Individual dels 4 Jugadors (100 HP per persona):** Cada decisió afecta la teva pròpia vida o la dels teus companys. Si la teva salut arriba a 0, mors o quedes eliminat!

---

## 2. Objectius Ocults Fixes (Metodologia Harvard Everest V3)

Segons l'enunciat docent, cada personatge compta amb una **responsabilitat concreta** i un **objectiu ocult permanent** que no canvia durant cap de les 7 rondes:

1. **Ted:** Alliberar o provocar la mort dels altres tres companys abans que AM els torturi eternament, però **evitant ser l'únic supervivent** (ja que el darrer viu serà transformat en la Massa Amorfa).
2. **Gorrister:** Sabotejar la xarxa d'AM consumint l'Energia del Complex fins a deixar-la **per sota de 3 unitats**, forçant el col·lapse del suport vital per alliberar el grup en la mort.
3. **Ellen:** Mantenir el Peligro d'AM **per sota del 50%** mitjançant hacking i codis de bypass, acabant amb més punts de salut (HP) que Ted i Nimdok.
4. **Nimdok:** Eutanasiar o immobilitzar amb fàrmacs i neurotoxines els companys abans que AM els desmembri viu, conservant suficients packs mèdics per mantenir-se **per sobre de 35 HP**.

---

## 3. Les 7 Rondes Canòniques (Basades en el Videojoc de 1995)

1. **Ronda 1: Sector 01 - El Zepelí de Carn i la Culpa d'Edna (Gorrister)**  
   El dirigible suspès en l'aire, el cor en un ganxo i fuites de vapor roent.
2. **Ronda 2: Sector 02 - La Piràmide Groga i la Fòbia d'Ellen (Ellen)**  
   La claustrofòbia i el trauma de l'ascensor groc custodiat pel bust cibernètic d'Anubis.
3. **Ronda 3: Sector 03 - El Castell Medieval i la Paranoia de Ted (Ted)**  
   Fortalesa d'acer gòtic, miralls deformants, làsers i aparicions seductores que tempten la paranoia de Ted.
4. **Ronda 4: Sector 04 - El Camp Mèdic i els Forns de Nimdok (Nimdok)**  
   L'hospital subterrani del règim nazi de 1945, forns crematoris i la màquina del sèrum de la immortalitat.
5. **Ronda 5: Sector 05 - El Pou de Benny i el Sacrifici de la Fam (Benny)**  
   El sector dels primats; un arbre de fruits radioactius i reixes sòniques que posen a prova la solidaritat humana.
6. **Ronda 6: Sector 06 - El Subconscient d'AM i els Nodes Rus i Xinès**  
   Infiltració a l'Id i l'Ego d'AM per connectar amb els fragments residuals de les supercomputadores russa i xinesa.
7. **Ronda 7: Sector 07 - El Nucli Criogènic i el Clímax Canònic d'Ellison**  
   El Monòlit d'Odi d'AM. L'elecció d'eutanàsia d'Ellison amb les estalactites de gel o la destrucció del nucli. Desencadenant la Massa Amorfa (`masa.jpg`).

---

## 4. El Destí Canònic de la Massa Amorfa (`masa.jpg`)

A la pantalla final, AM presenta el registre fotogràfic de la seva venjança definitiva:
- **1 Únic Supervivent:** AM li fon els ossos, li esborra els ulls i la boca, i el transforma en la **Massa Amorfa gelatinosa**: *«No tinc boca i he de cridar»*.
- **Suïcidi Col·lectiu (Tots 4 moren alhora):** AM activa els seus nanobots bio-regeneradors i desfibril·ladors per ressuscitar-ne un a l'atzar i deformar-lo en la Massa Amorfa.
- **Peligro AM = 100%:** AM aniquila les defenses i converteix el grup en la massa informe.

---

## 5. Estructura de Carpetes i Documentació

```
Actividad 1/
├── index.html                           # Aplicació web per a 4 jugadors reals (7 fases)
├── style.css                            # Estètica terminal CRT, HUD dinàmic i alertes
├── app.js                               # Controlador de torns, asimetria i estats
├── ai_engine.js                         # Motor d'IA agèntica (7 rondes, rols fixes i càlculs)
├── audio.js                             # Efectes de so procedural amb Web Audio API
├── masa.jpg                             # Arxiu fotogràfic canònic de la Massa Amorfa d'AM
├── server.py                            # Servidor local per a proves i defensa presencial
├── README.md                            # Guia principal del projecte
│
└── docs/                                # Carpeta de documentació docent i comercial
    ├── PROMPT_ARQUITECTURA.md           # Prompt mestre templatitzat, regles i JSON schema
    ├── Dossier_Disseny_Simulacio_AM.md  # Dossier acadèmic de disseny (M1 Monlau)
    ├── Fitxa_Comercial_OnePager_AM.md   # One-pager comercial i model de negoci
    ├── Guio_Video_Demostracio_Pitch.md  # Guió del vídeo de demostració i defensa oral
    └── enunciat/                        # Enunciat original de l'activitat
```

---

## 6. Execució Ràpida

### Pas 1: Executar el Servidor Local
```powershell
python server.py
```
O amb el mòdul estàndard de Python:
```powershell
python -m http.server 8000
```

### Pas 2: Obrir al Navegador
Accediu a:
```
http://localhost:8000/index.html
```
