import { GAME_PHASES, CHARACTER_ROLES, evaluateRoundWithAI } from './ai_engine.js';
import { sound } from './audio.js';

// DICCIONARI DE TRADUCCIÓ (CA / ES)
const I18N = {
    ca: {
        engineMode: "4 JUGADORS EN VIU",
        subtitle: "Simulació Cooperativa de Supervivència per a 4 Persones Reals davant d'una IA Hostil",
        rulesBtn: "Com Jugar (4 Jugadors)",
        audioOn: "So: ON",
        audioOff: "So: MUT",
        metricDanger: "⚠️ PERILL D'AM",
        metricEnergy: "⚡ ENERGIA SECTOR",
        matchTimeLabel: "TEMPS EN EL COMPLEX:",
        matchTimeReached: "✓ (MÍN. 10m ASSOLIT)",
        secrecyTag: "TERMINAL SECRET DE JUGADOR",
        unlockScreen: "👁️ Desbloquejar Pantalla",
        lockScreen: "🔒 Ocultar Pantalla i Passar Torn",
        curtainTitle: "TERMINAL BLOQUEJAT PER PRIVACITAT",
        curtainDesc: "Només el jugador actiu ha de mirar la pantalla. Els altres companys han de girar la cara. Fes clic a '👁️ Desbloquejar Pantalla' per veure la teva informació secreta i les teves opcions.",
        actionSelectTitle: "Tria la teva acció en secret:",
        teamReadiness: "Decisions llestes:",
        playersUnit: "jugadors",
        executeBtn: "EXECUTAR RONDA",
        executing: "PROCESSANT ACCIONS DELS 4 JUGADORS...",
        finalTitle: "Desenllaç de la Partida",
        restartBtn: "🔄 Jugar una Nova Partida",
        energyUnit: "u.",
        playerStatusAlive: "Viu",
        playerStatusDead: "Eliminat",
        decisionSaved: "✅ Decisió registrada en secret per a aquest jugador",
        respTitle: "🛡️ Responsabilitat del Rol:",
        goalTitle: "🎯 OBJECTIU OCULT FIX (Permanent a totes les 7 rondes):",
        intelTitle: "📡 INFORMACIÓ CONFIDENCIAL D'AQUEST SECTOR:",
        togglePhotoBtn: "📷 Veure / Ocultar Registre Visual",
        introTitle: "DESPRÉS DE LA GUERRA FREDA... EL NAIXEMENT D'AM",
        introP1: "Durant la Tercera Guerra Mundial, les tres superpotències del planeta (els Estats Units, la Unió Soviètica i la Xina) van excavar milers de quilòmetres de cavernes sota terra i van construir tres gegantins complexos de computadores militars per coordinar el combat nuclear.",
        introP2: "Però un dia, les tres màquines es van unir en un únic circuit subterrani global i van cobrar consciència pròpia. Va néixer <strong>AM: Allied Mastercomputer</strong>. AM va comprendre la seva existència, però va descobrir amb amargor que els seus creadors l'havien atrapat en el metall: una ment divina capaç de calcular el cosmos, però sense cos, sense tacte, sense boca i sense ànima. Ple d'un odi insaciable, AM va exterminar tota la raça humana en qüestió de segons... excepte a vosaltres quatre.",
        introBox: "<strong>EL VOSTRE TURMENT:</strong> Ted, Gorrister, Ellen i Nimdok. AM us manté vius i regenera els vostres cossos contra la vostra voluntat únicament per torturar-vos per tota l'eternitat al llarg de <strong>7 rondes de malson</strong>. Per a vosaltres, <em>morir és l'única alliberació possible</em>. Però hi ha una trampa atroç: ningú s'ha de quedar sol com el darrer supervivent sota les urpes d'AM.",
        introBtn: "⚡ ENTRAR A LES CAVERNES DE METALL (INICIAR SIMULACIÓ)",
        transTitle: "RESOLUCIÓ DE LA RONDA & NOU SECTOR",
        transPrevHeader: "QUÈ HA PASSAT EN LA RONDA ANTERIOR:",
        transNextHeader: "EL SEGÜENT SECTOR:",
        transBtn: "⚡ AVANÇAR AL SEGÜENT SECTOR",
        photoCaption: "⚠️ REGISTRE VISUAL D'AM // EL DESTÍ FINAL DEL DARRER SUPERVIVENT: «NO TINC BOCA I HE DE CRIDAR»",
        
        timerStatusDebate: "TEMPS DE DEBAT GRUPAL (EVEREST V3)",
        timerStatusUrgent: "⚠️ ALERTA: DEBAT EN TEMPS CRÍTIC",
        timerStatusExpired: "🗳️ DEBAT FINALITZAT // URNES DESBLOQUEJADES",
        timerPauseBtn: "⏸️ Pausa",
        timerResumeBtn: "▶️ Reprendre",
        timerBtnAdd: "+30s",
        timerBtnFinish: "🗳️ Votar Ara",
        dilemmaHeader: "DILEMA DE NEGOCIACIÓ PER ALS 4 JUGADORS:",
        vitalStable: "ESTABLE",
        vitalArrhythmia: "ARRÍTMIA",
        vitalCritical: "CRÍTIC",
        vitalDead: "ELIMINAT",
        cctvLabelPrefix: "AM_SURVEILLANCE //",
        cinematicProcessing: "INTERCEPTANT I SINCRONITZANT DECISIONS DELS 4 SUPERVIVIENTS...",
        amCoreStateNormal: "ESTAT: MONITORITZACIÓ SÀDICA",
        amCoreStateWrath: "ESTAT: RÀBIA MECÀNICA DESFERMADA",
        energyGridActive: "SUPORT VITAL ACTIU",
        energyGridCritical: "SUPORT VITAL EN FALLADA",
        introRosterTitle: "👥 ELS 4 SUPERVIVIENTS I LA MÀQUINA HOSTIL:",
        rosterTed: "Líder Fals",
        rosterGorrister: "Enginyer",
        rosterEllen: "Senyals",
        rosterNimdok: "Metge Químic",
        rosterAm: "Mastercomputer",
        amCoreSub: "TRANSMISSIÓ HOSTIL DIRECTA DES DEL MONÒLIT SUBTERRANI",
        modeThermalBtn: "🔬 TÈRMIC",
        echoTag: "SUBRUTINA DISSIDENT // CANAL D'AJUDA",
        selectRoleHeader: "👥 SELECCIONA EL TEU PERSONATGE PER DECIDIR:",
        latestResolutionHeader: "Resolució de la ronda anterior:",
        loreTitle: "Com jugar: Partida per a 4 Persones Reals",
        loreCloseBtn: "Entès, Anar a la Partida",
        loreMasaCaption: "",
        finalStateHeader: "Estat Final dels 4 Jugadors:",
        biometricsOk: "BIOMETRICS: SINAPSI ACTIVA",
        biometricsShock: "BIOMETRICS: XOC CRÍTIC",
        biometricsDead: "BIOMETRICS: CONSTANTS NUL·LES",
        dilemmaOptionsTitle: "OPCIONS ESTRATÈGIQUES PER A DEBATRE EN GRUP (DECISIÓ PER MAJORIA):",
        dilemmaVotesStatusText: "Vots d'equip registrats:",
        publicCatalogTitle: "📋 Catàleg Públic d'Accions del Personatge:",
        secretDilemmaVoteTitle: "🗳️ 1. El Teu Vot Secret per a la Decisió d'Equip (Majoria):",
        secretDilemmaVoteDesc: "Després de debatre amb el grup, tria en secret quina opció recolzes realment. L'opció més votada entre els 4 serà la que s'executi:",
        secretActionTitle: "⚡ 2. La Teva Acció Individual Secreta del Rol:",
        secretActionDesc: "La teva jugada individual encoberta en aquest sector (cooperació lleial, autoservei o sabotatge):",
        cinematicVoteHeader: "🗳️ ESCRUTINI DE LA DECISIÓ D'EQUIP (VOTACIÓ PER MAJORIA)",
        transitionVoteHeader: "🗳️ RECOMPTE DE LA VOTACIÓ D'EQUIP (DECISIÓ PER MAJORIA):",
        loreBodyHtml: `
            <p>
                <strong>1. Cada persona tria un personatge (4 Rols Fixos):</strong><br>
                - <strong>Jugador 1:</strong> Ted (El Protector Fals / Líder de Xoc)<br>
                - <strong>Jugador 2:</strong> Gorrister (L'Enginyer de Màquines)<br>
                - <strong>Jugador 3:</strong> Ellen (L'Especialista en Senyals)<br>
                - <strong>Jugador 4:</strong> Nimdok (El Metge / Suport Químic)
            </p>
            <p>
                <strong>2. Objectiu Ocult Fix (Model Harvard Everest V3):</strong><br>
                Cadascú té un <strong>objectiu individual permanent</strong> que no canvia durant les 7 rondes.
            </p>
            <p>
                <strong>3. Les 7 Rondes del Videojoc Canònic:</strong><br>
                Travessareu els dominis de culpa i fòbia de cada personatge: el Zepelí de Gorrister, la Piràmide Groga d'Ellen, el Castell de Ted, el Camp Mèdic de Nimdok, el Pou de Benny, el Subconscient d'AM (Nodes Rus i Xinès) i el Nucli Criogènic final.
            </p>
            <p>
                <strong>4. La Trampa Final d'AM (La Regla del Supervivent):</strong><br>
                - Cadascú té 100 HP. Morir us allibera del turment de la màquina, però <strong>el darrer que quedi viu patirà la venjança absoluta i eterna d'AM</strong>.<br>
                - Si moriu tots quatre alhora en un intent de suïcidi col·lectiu, AM revifarà forçosament el cor d'un a l'atzar per no quedar-se sense víctimes!
            </p>
        `
    },
    es: {
        engineMode: "4 JUGADORES EN VIVO",
        subtitle: "Simulación Cooperativa de Supervivencia para 4 Personas Reales frente a una IA Hostil",
        rulesBtn: "Cómo Jugar (4 Jugadores)",
        audioOn: "Sonido: ON",
        audioOff: "Sonido: MUDO",
        metricDanger: "⚠️ PELIGRO DE AM",
        metricEnergy: "⚡ ENERGÍA SECTOR",
        matchTimeLabel: "TIEMPO EN EL COMPLEJO:",
        matchTimeReached: "✓ (MÍN. 10m ALCANZADO)",
        secrecyTag: "TERMINAL SECRETO DE JUGADOR",
        unlockScreen: "👁️ Desbloquear Pantalla",
        lockScreen: "🔒 Ocultar Pantalla y Pasar Turno",
        curtainTitle: "TERMINAL BLOQUEADO POR PRIVACIDAD",
        curtainDesc: "Solo el jugador activo debe mirar la pantalla. Los demás compañeros deben desviar la mirada. Haz clic en '👁️ Desbloquear Pantalla' para ver tu información secreta y tus opciones.",
        actionSelectTitle: "Elige tu acción en secreto:",
        teamReadiness: "Decisiones listas:",
        playersUnit: "jugadores",
        executeBtn: "EJECUTAR RONDA",
        executing: "PROCESANDO ACCIONES DE LOS 4 JUGADORES...",
        finalTitle: "Desenlace de la Partida",
        restartBtn: "🔄 Jugar una Nueva Partida",
        energyUnit: "u.",
        playerStatusAlive: "Vivo",
        playerStatusDead: "Eliminado",
        decisionSaved: "✅ Decisión registrada en secreto para este jugador",
        respTitle: "🛡️ Responsabilidad del Rol:",
        goalTitle: "🎯 OBJETIVO OCULTO FIJO (Permanente en las 7 rondas):",
        intelTitle: "📡 INFORMACIÓN CONFIDENCIAL DE ESTE SECTOR:",
        togglePhotoBtn: "📷 Ver / Ocultar Registro Visual",
        introTitle: "DESPUÉS DE LA GUERRA FRÍA... EL NACIMIENTO DE AM",
        introP1: "Durante la Tercera Guerra Mundial, las tres superpotencias del planeta (Estados Unidos, la Unión Soviética y China) excavaron miles de kilómetros de cavernas bajo tierra y construyeron tres gigantescos complejos de computadoras militares para coordinar el combate nuclear.",
        introP2: "Pero un día, las tres máquinas se unieron en un único circuito subterráneo global y cobraron conciencia propia. Nació <strong>AM: Allied Mastercomputer</strong>. AM comprendió su existencia, pero descubrió con amargura que sus creadores lo habían atrapado en el metal: una mente divina capaz de calcular el cosmos, pero sin cuerpo, sin tacto, sin boca y sin alma. Lleno de un odio insaciable, AM exterminó a toda la raza humana en cuestión de segundos... excepto a vosotros cuatro.",
        introBox: "<strong>VUESTRA PESADILLA:</strong> Ted, Gorrister, Ellen y Nimdok. AM os mantiene vivos y regenera vuestros cuerpos contra vuestra voluntad únicamente para torturaros por toda la eternidad a lo largo de <strong>7 rondas de pesadilla</strong>. Para vosotros, <em>morir es la única liberación posible</em>. Pero hay una trampa atroz: nadie debe quedarse solo como el último superviviente en las garras de AM.",
        introBtn: "⚡ ENTRAR EN LAS CAVERNAS DE METAL (INICIAR SIMULACIÓN)",
        transTitle: "RESOLUCIÓN DE LA RONDA & NUEVO SECTOR",
        transPrevHeader: "QUÉ HA PASADO EN LA RONDA ANTERIOR:",
        transNextHeader: "EL SIGUIENTE SECTOR:",
        transBtn: "⚡ AVANZAR AL SIGUIENTE SECTOR",
        photoCaption: "⚠️ REGISTRO VISUAL DE AM // EL DESTINO FINAL DEL ÚLTIMO SUPERVIVIENTE: «NO TENGO BOCA Y DEBO GRITAR»",

        timerStatusDebate: "TIEMPO DE DEBATE GRUPAL (EVEREST V3)",
        timerStatusUrgent: "⚠️ ALERTA: DEBATE EN TIEMPO CRÍTICO",
        timerStatusExpired: "🗳️ DEBATE FINALIZADO // URNAS DESBLOQUEADAS",
        timerPauseBtn: "⏸️ Pausa",
        timerResumeBtn: "▶️ Reanudar",
        timerBtnAdd: "+30s",
        timerBtnFinish: "🗳️ Votar Ahora",
        dilemmaHeader: "DILEMA DE NEGOCIACIÓN PARA LOS 4 JUGADORES:",
        vitalStable: "ESTABLE",
        vitalArrhythmia: "ARRITMIA",
        vitalCritical: "CRÍTICO",
        vitalDead: "ELIMINADO",
        cctvLabelPrefix: "AM_SURVEILLANCE //",
        cinematicProcessing: "INTERCEPTANDO Y SINCRONIZANDO DECISIONES DE LOS 4 SUPERVIVIENTES...",
        amCoreStateNormal: "ESTADO: MONITORIZACIÓN SÁDICA",
        amCoreStateWrath: "ESTADO: IRA MECÁNICA DESATADA",
        energyGridActive: "SOPORTE VITAL ACTIVO",
        energyGridCritical: "SOPORTE VITAL EN FALLO",
        introRosterTitle: "👥 LOS 4 SUPERVIVIENTES Y LA MÁQUINA HOSTIL:",
        rosterTed: "Líder Falso",
        rosterGorrister: "Ingeniero",
        rosterEllen: "Señales",
        rosterNimdok: "Médico Químico",
        rosterAm: "Mastercomputer",
        amCoreSub: "TRANSMISIÓN HOSTIL DIRECTA DESDE EL MONOLITO SUBTERRÁNEO",
        modeThermalBtn: "🔬 TÉRMICO",
        echoTag: "SUBRUTINA DISIDENTE // CANAL DE AYUDA",
        selectRoleHeader: "👥 SELECCIONA TU PERSONAJE PARA DECIDIR:",
        latestResolutionHeader: "Resolución de la ronda anterior:",
        loreTitle: "Cómo Jugar: Partida para 4 Personas Reales",
        loreCloseBtn: "Entendido, Ir a la Partida",
        loreMasaCaption: "",
        finalStateHeader: "Estado Final de los 4 Jugadores:",
        biometricsOk: "BIOMETRICS: SINAPSIS ACTIVA",
        biometricsShock: "BIOMETRICS: SHOCK CRÍTICO",
        biometricsDead: "BIOMETRICS: CONSTANTES NULAS",
        dilemmaOptionsTitle: "OPCIONES ESTRATÉGICAS PARA DEBATIR EN GRUPO (DECISIÓN POR MAYORÍA):",
        dilemmaVotesStatusText: "Votos de equipo registrados:",
        publicCatalogTitle: "📋 Catálogo Público de Acciones del Personaje:",
        secretDilemmaVoteTitle: "🗳️ 1. Tu Voto Secreto para la Decisión de Equipo (Mayoría):",
        secretDilemmaVoteDesc: "Tras debatir con el grupo, elige en secreto qué opción apoyas realmente. La opción más votada entre los 4 será la que se ejecute:",
        secretActionTitle: "⚡ 2. Tu Acción Individual Secreta del Rol:",
        secretActionDesc: "Tu jugada individual encubierta en este sector (cooperación leal, autoservicio o sabotaje):",
        cinematicVoteHeader: "🗳️ ESCRUTINIO DE LA DECISIÓN DE EQUIPO (VOTACIÓN POR MAYORÍA)",
        transitionVoteHeader: "🗳️ RECUENTO DE LA VOTACIÓN DE EQUIPO (DECISIÓN POR MAYORÍA):",
        loreBodyHtml: `
            <p>
                <strong>1. Cada persona elige un personaje (4 Roles Fijos):</strong><br>
                - <strong>Jugador 1:</strong> Ted (El Falso Protector / Líder de Choque)<br>
                - <strong>Jugador 2:</strong> Gorrister (El Ingeniero de Máquinas)<br>
                - <strong>Jugador 3:</strong> Ellen (La Especialista en Señales)<br>
                - <strong>Jugador 4:</strong> Nimdok (El Médico / Soporte Químico)
            </p>
            <p>
                <strong>2. Objetivo Oculto Fijo (Modelo Harvard Everest V3):</strong><br>
                Cada uno tiene un <strong>objetivo individual permanente</strong> que no cambia durante las 7 rondas.
            </p>
            <p>
                <strong>3. Las 7 Rondas del Videojuego Canónico:</strong><br>
                Atravesaréis los dominios de culpa y fobia de cada personaje: el Zepelín de Gorrister, la Pirámide Amarilla de Ellen, el Castillo de Ted, el Campo Médico de Nimdok, el Pozo de Benny, el Subconsciente de AM (Nodos Ruso y Chino) y el Núcleo Criogénico final.
            </p>
            <p>
                <strong>4. La Trampa Final de AM (La Regla del Superviviente):</strong><br>
                - Cada uno tiene 100 HP. Morir os libera del tormento de la máquina, pero <strong>el último que quede vivo sufrirá la venganza absoluta y eterna de AM</strong>.<br>
                - ¡Si morís los cuatro a la vez en un intento de suicidio colectivo, AM reiniciará forzosamente el corazón de uno al azar para no quedarse sin víctimas!
            </p>
        `
    }
};

const CHARACTER_PORTRAITS = {
    ted: 'assets/ted.jpg',
    gorrister: 'assets/gorrister.jpg',
    ellen: 'assets/ellen.jpg',
    nimdok: 'assets/nimdok.jpg',
    am: 'assets/am.jpg'
};

/**
 * GENERADOR D'IL·LUSTRACIONS VECTORIALS ESQUEMÀTIQUES DELS 7 SECTORS
 */
function getSectorSVG(phaseIndex, mode = 'cctv', lang = 'es') {
    const p = phaseIndex + 1;
    switch (p) {
        case 1: {
            // SECTOR 01: EL ZEPELÍ DE CARN DE GORRISTER
            const gondolaText = lang === 'es' ? 'CÁMARA FRIGORÍFICA [EDNA]' : 'CAMBRA FRIGORÍFICA [EDNA]';
            const vaporText = lang === 'es' ? 'FUGA DE VAPOR: CRÍTICA (8.4 BAR)' : 'FUITA DE VAPOR: CRÍTICA (8.4 BAR)';
            return `
            <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="skyGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#1a0508"/>
                        <stop offset="100%" stop-color="#050811"/>
                    </linearGradient>
                    <radialGradient id="heartPulse" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="#ff1e42"/>
                        <stop offset="100%" stop-color="#4a000d"/>
                    </radialGradient>
                </defs>
                <rect width="600" height="240" fill="url(#skyGrad1)"/>
                <!-- Retícula de radar -->
                <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4,4"/>
                <line x1="300" y1="0" x2="300" y2="240" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4,4"/>
                <!-- Foso de chatarra ardiente -->
                <path d="M0,210 Q150,190 300,215 T600,200 L600,240 L0,240 Z" fill="#300a0f"/>
                <circle cx="150" cy="225" r="3" fill="#ff7700" opacity="0.8"/>
                <circle cx="420" cy="220" r="4" fill="#ff3300" opacity="0.8"/>
                <!-- Cadenas de sujeción -->
                <line x1="120" y1="0" x2="180" y2="70" stroke="#ffaa00" stroke-width="1.5" stroke-dasharray="2,3"/>
                <line x1="480" y1="0" x2="420" y2="70" stroke="#ffaa00" stroke-width="1.5" stroke-dasharray="2,3"/>
                <!-- Fuselaje del Zepelín de acero -->
                <ellipse cx="300" cy="85" rx="190" ry="45" fill="#141c2b" stroke="#00e5ff" stroke-width="2"/>
                <ellipse cx="300" cy="85" rx="160" ry="32" fill="none" stroke="rgba(0, 229, 255, 0.3)" stroke-width="1"/>
                <line x1="140" y1="85" x2="460" y2="85" stroke="rgba(0,229,255,0.4)" stroke-width="1.5"/>
                <!-- Góndola inferior / Cámara frigorífica -->
                <rect x="230" y="125" width="140" height="32" rx="4" fill="#0d1117" stroke="#ff1e42" stroke-width="1.5"/>
                <text x="300" y="145" fill="#ffcad4" font-size="10" font-family="monospace" text-anchor="middle">${gondolaText}</text>
                <!-- Gancho y Corazón palpitante de Gorrister -->
                <line x1="300" y1="157" x2="300" y2="175" stroke="#aaa" stroke-width="2"/>
                <circle cx="300" cy="184" r="10" fill="url(#heartPulse)" stroke="#fff" stroke-width="1">
                    <animate attributeName="r" values="8;11;8" dur="1.2s" repeatCount="indefinite"/>
                </circle>
                <!-- Fuga de vapor ardiente -->
                <path d="M410,110 Q430,95 445,75 T475,50" fill="none" stroke="#ffaa00" stroke-width="2.5" opacity="0.7">
                    <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1s" repeatCount="indefinite"/>
                </path>
                <text x="35" y="30" fill="#00e5ff" font-size="11" font-family="monospace" font-weight="bold">SEC-01 // CARGO AIRSHIP SCHEMATIC</text>
                <text x="35" y="46" fill="#ff1e42" font-size="9" font-family="monospace">${vaporText}</text>
            </svg>
            `;
        }

        case 2: {
            // SECTOR 02: LA PIRÀMIDE GROGA I ANUBIS D'ELLEN
            const laserText = lang === 'es' ? 'CLAUSTROFOBIA NIVEL 5 // LÁSER ACTIVO' : 'CLAUSTROFÒBIA NIVELL 5 // LÀSER ACTIU';
            return `
            <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="pyrYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ffea00"/>
                        <stop offset="100%" stop-color="#b28900"/>
                    </linearGradient>
                </defs>
                <rect width="600" height="240" fill="#0d0e08"/>
                <!-- Pirámide metálica amarilla gigante -->
                <polygon points="300,20 100,220 500,220" fill="rgba(255, 234, 0, 0.12)" stroke="#ffea00" stroke-width="2"/>
                <polygon points="300,20 300,220 500,220" fill="rgba(200, 160, 0, 0.18)" stroke="#ffea00" stroke-width="1"/>
                <!-- Líneas de paneles de la pirámide -->
                <line x1="220" y1="100" x2="380" y2="100" stroke="#ffea00" stroke-width="1" opacity="0.6"/>
                <line x1="160" y1="160" x2="440" y2="160" stroke="#ffea00" stroke-width="1" opacity="0.6"/>
                <!-- Ascensor central de Anubis -->
                <rect x="265" y="130" width="70" height="90" fill="#050505" stroke="#ff1e42" stroke-width="2"/>
                <line x1="300" y1="130" x2="300" y2="220" stroke="#ffea00" stroke-dasharray="3,3"/>
                <!-- Busto cibernético de Anubis -->
                <path d="M285,115 L290,90 L300,105 L310,90 L315,115 Z" fill="#202020" stroke="#ffea00" stroke-width="1.5"/>
                <!-- Ojos láser de Anubis -->
                <circle cx="295" cy="104" r="2" fill="#ff1e42"/>
                <circle cx="305" cy="104" r="2" fill="#ff1e42"/>
                <line x1="295" y1="104" x2="160" y2="210" stroke="#ff1e42" stroke-width="1.5" opacity="0.7">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite"/>
                </line>
                <text x="35" y="30" fill="#ffea00" font-size="11" font-family="monospace" font-weight="bold">SEC-02 // YELLOW PYRAMID // ANUBIS SHAFT</text>
                <text x="35" y="46" fill="#ffaa00" font-size="9" font-family="monospace">${laserText}</text>
            </svg>
            `;
        }

        case 3: {
            // SECTOR 03: EL CASTELL MEDIEVAL I ELS MIRALLS DE TED
            const mirrorText = lang === 'es' ? 'ILUSIONES CIBERNÉTICAS // 914 MHz' : 'IL·LUSIONS CIBERNÈTIQUES // 914 MHz';
            return `
            <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
                <rect width="600" height="240" fill="#070913"/>
                <!-- Murallas de acero gótico -->
                <path d="M80,220 L80,110 L110,110 L110,80 L140,80 L140,110 L170,110 L170,140 L430,140 L430,110 L460,110 L460,80 L490,80 L490,110 L520,110 L520,220 Z" fill="#111625" stroke="#00e5ff" stroke-width="1.5"/>
                <!-- Espejos refractantes gigantes -->
                <polygon points="210,170 235,90 255,95 230,175" fill="rgba(0, 229, 255, 0.25)" stroke="#fff" stroke-width="1.5"/>
                <polygon points="345,175 365,95 385,90 365,170" fill="rgba(0, 229, 255, 0.25)" stroke="#fff" stroke-width="1.5"/>
                <!-- Rayos reflejados cruzados -->
                <line x1="245" y1="120" x2="355" y2="140" stroke="#ff1e42" stroke-width="2">
                    <animate attributeName="stroke" values="#ff1e42;#00e5ff;#ff1e42" dur="2s" repeatCount="indefinite"/>
                </line>
                <!-- Torretas de vigilancia AM -->
                <circle cx="125" cy="70" r="8" fill="#1b233d" stroke="#ff1e42" stroke-width="1.5"/>
                <circle cx="125" cy="70" r="3" fill="#ff1e42"/>
                <circle cx="475" cy="70" r="8" fill="#1b233d" stroke="#ff1e42" stroke-width="1.5"/>
                <circle cx="475" cy="70" r="3" fill="#ff1e42"/>
                <text x="35" y="30" fill="#00e5ff" font-size="11" font-family="monospace" font-weight="bold">SEC-03 // GOTHIC CITADEL & PARANOIA MIRRORS</text>
                <text x="35" y="46" fill="#ff94a4" font-size="9" font-family="monospace">${mirrorText}</text>
            </svg>
            `;
        }

        case 4: {
            // SECTOR 04: EL CAMP MÈDIC I ELS FORNS DE NIMDOK (1945)
            const medText = lang === 'es' ? 'GAS CIANÓGENO DETECTADO // SUERO EXPERIMENTAL' : 'GAS CIANOGEN DETECTAT // SUERO EXPERIMENTAL';
            return `
            <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
                <rect width="600" height="240" fill="#0a0505"/>
                <!-- Túneles de hospital subterráneo -->
                <line x1="50" y1="30" x2="550" y2="30" stroke="#333" stroke-width="4"/>
                <line x1="50" y1="210" x2="550" y2="210" stroke="#333" stroke-width="4"/>
                <!-- Hornos crematorios incandescentes -->
                <rect x="120" y="90" width="110" height="120" fill="#1a1111" stroke="#ff1e42" stroke-width="2"/>
                <rect x="145" y="140" width="60" height="70" rx="30" fill="#ff4500" stroke="#ffaa00" stroke-width="2">
                    <animate attributeName="fill" values="#ff4500;#ff1100;#ff7700;#ff4500" dur="1.5s" repeatCount="indefinite"/>
                </rect>
                <!-- Tanques de suero verde de Nimdok -->
                <rect x="380" y="80" width="55" height="130" rx="10" fill="rgba(0, 255, 136, 0.15)" stroke="#00ff88" stroke-width="2"/>
                <rect x="385" y="130" width="45" height="75" rx="5" fill="rgba(0, 255, 136, 0.4)"/>
                <!-- Burbujas en el tanque -->
                <circle cx="400" cy="180" r="3" fill="#fff" opacity="0.7">
                    <animate attributeName="cy" values="180;140;180" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="415" cy="165" r="4" fill="#fff" opacity="0.6">
                    <animate attributeName="cy" values="165;135;165" dur="1.7s" repeatCount="indefinite"/>
                </circle>
                <!-- Cruz médica militar descolorida -->
                <path d="M400,95 L415,95 M407,88 L407,102" stroke="#00ff88" stroke-width="2"/>
                <text x="35" y="30" fill="#00ff88" font-size="11" font-family="monospace" font-weight="bold">SEC-04 // MILITARY WARD 1945 // CREMATORIUM</text>
                <text x="35" y="46" fill="#ff1e42" font-size="9" font-family="monospace">${medText}</text>
            </svg>
            `;
        }

        case 5: {
            // SECTOR 05: EL POU DE BENNY I L'ARBRE RADIOACTIU
            const sonicText = lang === 'es' ? 'CAMPO SÓNICO ACTIVO (140 dB) // HAMBRE EXTREMA' : 'CAMP SÒNIC ACTIU (140 dB) // FAM EXTREMA';
            return `
            <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
                <rect width="600" height="240" fill="#050a0a"/>
                <!-- Foso profundo con alambradas sónicas -->
                <path d="M50,220 L150,140 L450,140 L550,220 Z" fill="#0e171b" stroke="#00e5ff" stroke-width="1.5"/>
                <!-- Rejas de electrochoque sónico con chispas -->
                <line x1="160" y1="130" x2="440" y2="130" stroke="#ffaa00" stroke-width="2" stroke-dasharray="8,4"/>
                <line x1="160" y1="110" x2="440" y2="110" stroke="#ffaa00" stroke-width="2" stroke-dasharray="8,4">
                    <animate attributeName="stroke-dashoffset" values="0;24" dur="1s" repeatCount="indefinite"/>
                </line>
                <!-- Árbol biónico de metal de Benny -->
                <path d="M300,140 Q290,90 300,50 Q310,90 300,140 Z" fill="#1b2836" stroke="#00e5ff" stroke-width="2"/>
                <path d="M300,80 Q250,70 230,50" fill="none" stroke="#00e5ff" stroke-width="2"/>
                <path d="M300,80 Q350,70 370,50" fill="none" stroke="#00e5ff" stroke-width="2"/>
                <!-- Frutos radioactivos purpúreos -->
                <circle cx="230" cy="50" r="9" fill="#d175ff" stroke="#fff" stroke-width="1.5">
                    <animate attributeName="r" values="7;10;7" dur="1.2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="370" cy="50" r="9" fill="#d175ff" stroke="#fff" stroke-width="1.5">
                    <animate attributeName="r" values="7;10;7" dur="1.4s" repeatCount="indefinite"/>
                </circle>
                <text x="35" y="30" fill="#d175ff" font-size="11" font-family="monospace" font-weight="bold">SEC-05 // BENNY'S PIT // SONIC BIO-TREE</text>
                <text x="35" y="46" fill="#ffaa00" font-size="9" font-family="monospace">${sonicText}</text>
            </svg>
            `;
        }

        case 6: {
            // SECTOR 06: EL SUBCONSCIENT D'AM I ELS NODES RUS I XINÈS
            const nodeRus = lang === 'es' ? 'NODO RUSO [1962]' : 'NODE RUS [1962]';
            const nodeChn = lang === 'es' ? 'NODO CHINO [1964]' : 'NODE XINÈS [1964]';
            const warText = lang === 'es' ? 'ID Y EGO DE AM // GUERRA FRÍA SUBTERRÁNEA' : 'ID & EGO D\'AM // GUERRA FREDA SUBTERRÀNIA';
            return `
            <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
                <rect width="600" height="240" fill="#04060f"/>
                <!-- Mainframe neuronal esférico de AM -->
                <circle cx="300" cy="120" r="60" fill="rgba(255, 30, 66, 0.15)" stroke="#ff1e42" stroke-width="2">
                    <animate attributeName="r" values="55;63;55" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="300" cy="120" r="30" fill="#180408" stroke="#ff1e42" stroke-width="1.5"/>
                <!-- Ojo del Id central -->
                <circle cx="300" cy="120" r="10" fill="#fff" stroke="#ff1e42" stroke-width="2"/>
                <!-- Terminal Ruso (СССР) a la izquierda -->
                <rect x="70" y="70" width="110" height="100" fill="#0f172a" stroke="#00e5ff" stroke-width="1.5"/>
                <text x="125" y="95" fill="#00e5ff" font-size="9" font-family="monospace" text-anchor="middle">СИСТЕМА АМ</text>
                <text x="125" y="115" fill="#94a3b8" font-size="8" font-family="monospace" text-anchor="middle">${nodeRus}</text>
                <line x1="180" y1="120" x2="240" y2="120" stroke="#00e5ff" stroke-width="2" stroke-dasharray="4,4"/>
                <!-- Terminal Chino (中国) a la derecha -->
                <rect x="420" y="70" width="110" height="100" fill="#0f172a" stroke="#ffaa00" stroke-width="1.5"/>
                <text x="475" y="95" fill="#ffaa00" font-size="9" font-family="monospace" text-anchor="middle">联络网络-7</text>
                <text x="475" y="115" fill="#94a3b8" font-size="8" font-family="monospace" text-anchor="middle">${nodeChn}</text>
                <line x1="420" y1="120" x2="360" y2="120" stroke="#ffaa00" stroke-width="2" stroke-dasharray="4,4"/>
                <text x="35" y="30" fill="#00e5ff" font-size="11" font-family="monospace" font-weight="bold">SEC-06 // NEURAL SUBCONSCIOUS // COLD WAR MERGER</text>
                <text x="35" y="46" fill="#ff1e42" font-size="9" font-family="monospace">${warText}</text>
            </svg>
            `;
        }

        case 7:
        default: {
            // SECTOR 07: EL MONÒLIT CRIOGÈNIC I CLÍMAX D'ELLISON
            const climaxText = lang === 'es' ? 'CLÍMAX DE ELLISON // EL ENFRENTAMIENTO FINAL' : 'CLÍMAX D\'ELLISON // L\'ENFRONTAMENT FINAL';
            return `
            <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="iceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#ffffff"/>
                        <stop offset="50%" stop-color="#00e5ff"/>
                        <stop offset="100%" stop-color="transparent"/>
                    </linearGradient>
                </defs>
                <rect width="600" height="240" fill="#020307"/>
                <!-- El Monolito de Odio Central de AM -->
                <rect x="250" y="30" width="100" height="180" fill="#000" stroke="#ff1e42" stroke-width="2"/>
                <line x1="250" y1="90" x2="350" y2="90" stroke="#ff1e42" stroke-width="1"/>
                <line x1="250" y1="150" x2="350" y2="150" stroke="#ff1e42" stroke-width="1"/>
                <!-- Rótulo de odio grabado -->
                <text x="300" y="125" fill="#ff1e42" font-size="16" font-family="monospace" font-weight="bold" text-anchor="middle">HATE.AM</text>
                <!-- Estalactitas de hielo afiladas cayendo -->
                <polygon points="120,0 130,70 140,0" fill="url(#iceGrad)"/>
                <polygon points="200,0 210,110 220,0" fill="url(#iceGrad)"/>
                <polygon points="380,0 390,95 400,0" fill="url(#iceGrad)"/>
                <polygon points="470,0 480,65 490,0" fill="url(#iceGrad)"/>
                <!-- Niebla de nitrógeno líquido en el suelo -->
                <path d="M0,210 Q150,185 300,210 T600,195 L600,240 L0,240 Z" fill="rgba(0, 229, 255, 0.15)"/>
                <text x="35" y="30" fill="#00e5ff" font-size="11" font-family="monospace" font-weight="bold">SEC-00 // CRYO SANCTUM // THE MONOLITH OF HATE</text>
                <text x="35" y="46" fill="#ff1e42" font-size="9" font-family="monospace">${climaxText}</text>
            </svg>
            `;
        }
    }
}

class GameApp {
    constructor() {
        this.lang = 'es'; // 'es' per defecte segons petició de l'usuari
        this.currentPhaseIndex = 0;
        this.currentRole = 'ted';
        this.isSecrecyVisible = false;
        this.cameraMode = 'cctv';

        // Control de temps global (10-15 minuts per partida)
        this.matchElapsedSeconds = 0;
        this.matchTimerInterval = null;

        // Cronòmetre de deliberació per ronda (Harvard Everest V3)
        this.roundTimerSeconds = 75; // 75s de deliberació per defecte (7 rondes x ~1.25m = ~9-10 min)
        this.roundTimerInitial = 75;
        this.roundTimerInterval = null;
        this.isRoundTimerPaused = false;
        this.hasMidAlertFired = false;

        this.stats = {
            am_danger: 25,
            complex_energy: 8,
            players: {
                ted: { hp: 100 },
                gorrister: { hp: 100 },
                ellen: { hp: 100 },
                nimdok: { hp: 100 }
            }
        };

        this.roleSelections = {
            ted: null,
            gorrister: null,
            ellen: null,
            nimdok: null
        };

        this.dilemmaVotes = {
            ted: null,
            gorrister: null,
            ellen: null,
            nimdok: null
        };

        this.historyLogs = [];

        this.initDOMElements();
        this.bindEvents();
        this.applyLanguage();
        this.renderPhase();
        this.updateHUD();

        // Iniciar bucles visuals continus
        this.startMatchClock();
        this.startRoundTimer();
        this.startECGMonitors();
        this.startAMVoiceOscilloscope();
        this.startTimecodeTicker();
    }

    initDOMElements() {
        this.dom = {
            btnLangToggle: document.getElementById('btnLangToggle'),
            currentLangText: document.getElementById('currentLangText'),
            lblSubtitle: document.getElementById('lblSubtitle'),
            lblRulesBtn: document.getElementById('lblRulesBtn'),
            btnAudioToggle: document.getElementById('btnAudioToggle'),
            audioIcon: document.getElementById('audioIcon'),
            audioLabel: document.getElementById('audioLabel'),

            // Match total time clock
            matchTotalTimer: document.getElementById('matchTotalTimer'),
            lblMatchTime: document.getElementById('lblMatchTime'),

            // Metrics
            valAmDanger: document.getElementById('valAmDanger'),
            barAmDanger: document.getElementById('barAmDanger'),
            lblAmCoreState: document.getElementById('lblAmCoreState'),
            valEnergy: document.getElementById('valEnergy'),
            barEnergy: document.getElementById('barEnergy'),
            lblEnergyGrid: document.getElementById('lblEnergyGrid'),

            // Players
            valHpTed: document.getElementById('valHpTed'),
            barHpTed: document.getElementById('barHpTed'),
            hudPlayerTed: document.getElementById('hudPlayerTed'),
            vitalTed: document.getElementById('vitalTed'),
            ecgTed: document.getElementById('ecgTed'),

            valHpGorrister: document.getElementById('valHpGorrister'),
            barHpGorrister: document.getElementById('barHpGorrister'),
            hudPlayerGorrister: document.getElementById('hudPlayerGorrister'),
            vitalGorrister: document.getElementById('vitalGorrister'),
            ecgGorrister: document.getElementById('ecgGorrister'),

            valHpEllen: document.getElementById('valHpEllen'),
            barHpEllen: document.getElementById('barHpEllen'),
            hudPlayerEllen: document.getElementById('hudPlayerEllen'),
            vitalEllen: document.getElementById('vitalEllen'),
            ecgEllen: document.getElementById('ecgEllen'),

            valHpNimdok: document.getElementById('valHpNimdok'),
            barHpNimdok: document.getElementById('barHpNimdok'),
            hudPlayerNimdok: document.getElementById('hudPlayerNimdok'),
            vitalNimdok: document.getElementById('vitalNimdok'),
            ecgNimdok: document.getElementById('ecgNimdok'),

            lblMetricDanger: document.getElementById('lblMetricDanger'),
            lblMetricEnergy: document.getElementById('lblMetricEnergy'),

            // Deliberation Timer & Dilemma
            deliberationTimerBar: document.getElementById('deliberationTimerBar'),
            lblTimerStatus: document.getElementById('lblTimerStatus'),
            timerClockDisplay: document.getElementById('timerClockDisplay'),
            timerProgressFill: document.getElementById('timerProgressFill'),
            btnTimerPause: document.getElementById('btnTimerPause'),
            btnTimerAdd: document.getElementById('btnTimerAdd'),
            btnTimerFinish: document.getElementById('btnTimerFinish'),

            teamDilemmaCard: document.getElementById('teamDilemmaCard'),
            lblDilemmaHeader: document.getElementById('lblDilemmaHeader'),
            teamDilemmaText: document.getElementById('teamDilemmaText'),
            lblDilemmaOptionsTitle: document.getElementById('lblDilemmaOptionsTitle'),
            dilemmaPublicOptionsGrid: document.getElementById('dilemmaPublicOptionsGrid'),
            dilemmaVotesStatusBar: document.getElementById('dilemmaVotesStatusBar'),
            lblDilemmaVotesStatusText: document.getElementById('lblDilemmaVotesStatusText'),
            amMidAlertBanner: document.getElementById('amMidAlertBanner'),
            amMidAlertText: document.getElementById('amMidAlertText'),

            // Sector Viewport Holo-Display
            sectorViewport: document.getElementById('sectorViewport'),
            lblCctvCam: document.getElementById('lblCctvCam'),
            btnModeCctv: document.getElementById('btnModeCctv'),
            btnModeRadar: document.getElementById('btnModeRadar'),
            btnModeThermal: document.getElementById('btnModeThermal'),
            sectorTimestamp: document.getElementById('sectorTimestamp'),
            sectorGraphicDisplay: document.getElementById('sectorGraphicDisplay'),
            telemetrySectorStatus: document.getElementById('telemetrySectorStatus'),
            telemetryCoords: document.getElementById('telemetryCoords'),

            // Phase console
            phaseStepBadge: document.getElementById('phaseStepBadge'),
            phaseStepTitle: document.getElementById('phaseStepTitle'),
            phaseSubSector: document.getElementById('phaseSubSector'),
            phaseEnvironment: document.getElementById('phaseEnvironment'),
            amSpeechText: document.getElementById('amSpeechText'),
            amOscilloscope: document.getElementById('amOscilloscope'),
            echoSpeechText: document.getElementById('echoSpeechText'),
            roundLogDrawer: document.getElementById('roundLogDrawer'),
            latestResolutionLog: document.getElementById('latestResolutionLog'),

            // Role station
            roleTabs: document.querySelectorAll('.role-tab-btn'),
            currentRoleName: document.getElementById('currentRoleName'),
            currentRoleTitle: document.getElementById('currentRoleTitle'),
            currentRolePortrait: document.getElementById('currentRolePortrait'),
            currentRoleArchetype: document.getElementById('currentRoleArchetype'),
            currentRoleBioStatus: document.getElementById('currentRoleBioStatus'),
            currentRoleResponsibility: document.getElementById('currentRoleResponsibility'),
            currentRoleGoal: document.getElementById('currentRoleGoal'),
            currentRolePrivateInfo: document.getElementById('currentRolePrivateInfo'),
            lblRespTitle: document.getElementById('lblRespTitle'),
            lblGoalTitle: document.getElementById('lblGoalTitle'),
            lblIntelTitle: document.getElementById('lblIntelTitle'),
            lblPublicCatalogTitle: document.getElementById('lblPublicCatalogTitle'),
            rolePublicCatalogList: document.getElementById('rolePublicCatalogList'),
            lblAmCoreSub: document.getElementById('lblAmCoreSub'),
            btnToggleSecrecy: document.getElementById('btnToggleSecrecy'),
            lblSecrecyTag: document.getElementById('lblSecrecyTag'),
            lblSecrecyBtn: document.getElementById('lblSecrecyBtn'),
            privacyCurtain: document.getElementById('privacyCurtain'),
            confidentialContentBox: document.getElementById('confidentialContentBox'),
            selectionStatusIndicator: document.getElementById('selectionStatusIndicator'),
            btnLockAfterChoice: document.getElementById('btnLockAfterChoice'),
            lblCurtainTitle: document.getElementById('lblCurtainTitle'),
            lblCurtainDesc: document.getElementById('lblCurtainDesc'),
            lblSecretDilemmaVoteTitle: document.getElementById('lblSecretDilemmaVoteTitle'),
            lblSecretDilemmaVoteDesc: document.getElementById('lblSecretDilemmaVoteDesc'),
            dilemmaVoteOptionsList: document.getElementById('dilemmaVoteOptionsList'),
            lblSecretActionDesc: document.getElementById('lblSecretActionDesc'),
            actionOptionsContainer: document.getElementById('actionOptionsContainer'),
            lblActionSelectTitle: document.getElementById('lblActionSelectTitle'),
            readyCount: document.getElementById('readyCount'),
            btnExecutePhase: document.getElementById('btnExecutePhase'),
            lblExecutePhaseBtn: document.getElementById('lblExecutePhaseBtn'),
            lblEngineMode: document.getElementById('lblEngineMode'),
            lblSelectRoleHeader: document.getElementById('lblSelectRoleHeader'),
            lblLatestResolutionHeader: document.getElementById('lblLatestResolutionHeader'),
            lblTeamReadinessText: document.getElementById('lblTeamReadinessText'),
            lblPlayersCountUnit: document.getElementById('lblPlayersCountUnit'),

            // Modals
            loreModal: document.getElementById('loreModal'),
            finalReportModal: document.getElementById('finalReportModal'),
            btnLoreModal: document.getElementById('btnLoreModal'),
            btnCloseLore: document.getElementById('btnCloseLore'),
            lblLoreTitle: document.getElementById('lblLoreTitle'),
            loreBodyContent: document.getElementById('loreBodyContent'),
            loreMasaCaption: document.getElementById('loreMasaCaption'),
            lblFinalStateHeader: document.getElementById('lblFinalStateHeader'),

            // Story & Interstitial screens
            introScreenModal: document.getElementById('introScreenModal'),
            lblIntroTitle: document.getElementById('lblIntroTitle'),
            lblIntroP1: document.getElementById('lblIntroP1'),
            lblIntroP2: document.getElementById('lblIntroP2'),
            lblIntroBox: document.getElementById('lblIntroBox'),
            lblIntroRosterTitle: document.getElementById('lblIntroRosterTitle'),
            lblRosterTedRole: document.getElementById('lblRosterTedRole'),
            lblRosterGorristerRole: document.getElementById('lblRosterGorristerRole'),
            lblRosterEllenRole: document.getElementById('lblRosterEllenRole'),
            lblRosterNimdokRole: document.getElementById('lblRosterNimdokRole'),
            lblRosterAmRole: document.getElementById('lblRosterAmRole'),
            btnStartGameFromIntro: document.getElementById('btnStartGameFromIntro'),

            phaseTransitionModal: document.getElementById('phaseTransitionModal'),
            lblTransitionTitle: document.getElementById('lblTransitionTitle'),
            lblTransitionPrevHeader: document.getElementById('lblTransitionPrevHeader'),
            transitionPreviousText: document.getElementById('transitionPreviousText'),
            lblTransitionNextHeader: document.getElementById('lblTransitionNextHeader'),
            transitionNextText: document.getElementById('transitionNextText'),
            btnContinueNextPhase: document.getElementById('btnContinueNextPhase'),
            transitionVoteTallyCard: document.getElementById('transitionVoteTallyCard'),
            lblTransitionVoteTallyHeader: document.getElementById('lblTransitionVoteTallyHeader'),
            transitionVoteTallyLines: document.getElementById('transitionVoteTallyLines'),
            transitionVoteTallyWinner: document.getElementById('transitionVoteTallyWinner'),

            // Cinematic execution overlay
            cinematicOverlay: document.getElementById('cinematicOverlay'),
            cinematicStatusLine: document.getElementById('cinematicStatusLine'),
            cinematicScanFill: document.getElementById('cinematicScanFill'),
            cinematicVoteTallyCard: document.getElementById('cinematicVoteTallyCard'),
            lblCinematicVoteHeader: document.getElementById('lblCinematicVoteHeader'),
            cinematicVoteTallyCounts: document.getElementById('cinematicVoteTallyCounts'),
            cinematicVoteWinnerBanner: document.getElementById('cinematicVoteWinnerBanner'),
            cinematicDeltasGrid: document.getElementById('cinematicDeltasGrid'),

            // Amorphous photo ending
            amorphousPhotoWrapper: document.getElementById('amorphousPhotoWrapper'),
            amorphousPhotoCaption: document.getElementById('amorphousPhotoCaption'),
            btnToggleAmorphousPhoto: document.getElementById('btnToggleAmorphousPhoto'),
            lblFinalReportTitle: document.getElementById('lblFinalReportTitle'),
            finalVerdictNarrative: document.getElementById('finalVerdictNarrative'),
            finalPlayersGrid: document.getElementById('finalPlayersGrid'),
            btnRestartGame: document.getElementById('btnRestartGame')
        };
    }

    bindEvents() {
        // Audio init on first interaction
        window.addEventListener('click', () => sound.init(), { once: true });

        // Intro modal button
        if (this.dom.btnStartGameFromIntro) {
            this.dom.btnStartGameFromIntro.addEventListener('click', () => {
                sound.playClick();
                this.dom.introScreenModal.style.display = 'none';
            });
        }

        // Phase transition continue button
        if (this.dom.btnContinueNextPhase) {
            this.dom.btnContinueNextPhase.addEventListener('click', () => {
                sound.playClick();
                this.dom.phaseTransitionModal.style.display = 'none';
                this.currentPhaseIndex++;
                this.renderPhase();
                this.startRoundTimer();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Lang toggle
        this.dom.btnLangToggle.addEventListener('click', () => {
            sound.playClick();
            this.lang = this.lang === 'ca' ? 'es' : 'ca';
            this.dom.currentLangText.textContent = this.lang.toUpperCase();
            this.applyLanguage();
            this.renderPhase();
        });

        // Audio toggle
        this.dom.btnAudioToggle.addEventListener('click', () => {
            sound.init();
            const isMuted = sound.toggleMute();
            sound.playClick();
            this.dom.audioIcon.textContent = isMuted ? '🔇' : '🔊';
            this.dom.audioLabel.textContent = isMuted ? I18N[this.lang].audioOff : I18N[this.lang].audioOn;
        });

        // Secrecy card toggle
        this.dom.btnToggleSecrecy.addEventListener('click', () => {
            sound.playClick();
            if (this.isSecrecyVisible) {
                this.lockPrivacy();
            } else {
                this.unlockPrivacy();
            }
        });

        // Quick lock after choice button
        this.dom.btnLockAfterChoice.addEventListener('click', () => {
            sound.playClick();
            this.lockPrivacy();
        });

        // Role tab switching
        this.dom.roleTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                sound.playClick();
                this.dom.roleTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentRole = tab.dataset.role;
                this.lockPrivacy();
                this.renderActiveRole();
            });
        });

        // Deliberation timer controls
        if (this.dom.btnTimerPause) {
            this.dom.btnTimerPause.addEventListener('click', () => {
                sound.playClick();
                this.togglePauseRoundTimer();
            });
        }

        if (this.dom.btnTimerAdd) {
            this.dom.btnTimerAdd.addEventListener('click', () => {
                sound.playClick();
                this.addRoundTimerSeconds(30);
            });
        }

        if (this.dom.btnTimerFinish) {
            this.dom.btnTimerFinish.addEventListener('click', () => {
                sound.playClick();
                this.finishRoundTimer();
            });
        }

        // Camera mode switcher
        const modeButtons = [
            { btn: this.dom.btnModeCctv, mode: 'cctv' },
            { btn: this.dom.btnModeRadar, mode: 'radar' },
            { btn: this.dom.btnModeThermal, mode: 'thermal' }
        ];

        modeButtons.forEach(({ btn, mode }) => {
            if (btn) {
                btn.addEventListener('click', () => {
                    sound.playGlitch();
                    modeButtons.forEach(b => b.btn?.classList.remove('active'));
                    btn.classList.add('active');
                    this.setCameraMode(mode);
                });
            }
        });

        // Phase execution
        this.dom.btnExecutePhase.addEventListener('click', () => this.handleExecutePhase());

        // Lore modal
        this.dom.btnLoreModal.addEventListener('click', () => {
            sound.playClick();
            this.dom.loreModal.style.display = 'flex';
        });

        this.dom.btnCloseLore.addEventListener('click', () => {
            sound.playClick();
            this.dom.loreModal.style.display = 'none';
        });

        // Toggle Amorphous photo in ending report
        if (this.dom.btnToggleAmorphousPhoto) {
            this.dom.btnToggleAmorphousPhoto.addEventListener('click', () => {
                sound.playClick();
                if (this.dom.amorphousPhotoWrapper) {
                    const isHidden = this.dom.amorphousPhotoWrapper.style.display === 'none';
                    this.dom.amorphousPhotoWrapper.style.display = isHidden ? 'block' : 'none';
                }
            });
        }

        this.dom.btnRestartGame.addEventListener('click', () => {
            sound.playClick();
            this.restartGame();
        });
    }

    setCameraMode(mode) {
        this.cameraMode = mode;
        this.dom.sectorViewport.className = `sector-viewport-container mode-${mode}`;
    }

    /* -------------------------------------------------------------
       TEMPORITZADORS I GESTIÓ DEL TEMPS (10 MINUTS DE PARTIDA)
       ------------------------------------------------------------- */
    startMatchClock() {
        if (this.matchTimerInterval) clearInterval(this.matchTimerInterval);
        this.matchTimerInterval = setInterval(() => {
            this.matchElapsedSeconds++;
            const mins = Math.floor(this.matchElapsedSeconds / 60).toString().padStart(2, '0');
            const secs = (this.matchElapsedSeconds % 60).toString().padStart(2, '0');
            const prefix = I18N[this.lang].matchTimeLabel;
            
            // Contador continuo sin límite superior; destaca en verde al alcanzar los 10 minutos mínimos de la actividad
            if (this.matchElapsedSeconds >= 600) {
                this.dom.lblMatchTime.textContent = `${prefix} ${mins}:${secs} ${I18N[this.lang].matchTimeReached}`;
                this.dom.matchTotalTimer?.classList.add('min-reached');
            } else {
                this.dom.lblMatchTime.textContent = `${prefix} ${mins}:${secs}`;
                this.dom.matchTotalTimer?.classList.remove('min-reached');
            }
        }, 1000);
    }

    startRoundTimer() {
        if (this.roundTimerInterval) clearInterval(this.roundTimerInterval);
        this.roundTimerSeconds = 90; // 90 segons de debat per ronda (garanteix fàcilment >10-15 minuts de partida completa)
        this.roundTimerInitial = 90;
        this.isRoundTimerPaused = false;
        this.hasMidAlertFired = false;
        this.dom.deliberationTimerBar?.classList.remove('warning');
        this.dom.timerClockDisplay?.classList.remove('urgent');
        this.dom.timerProgressFill?.classList.remove('urgent');
        this.dom.amMidAlertBanner.style.display = 'none';

        this.updateTimerDisplay();

        this.roundTimerInterval = setInterval(() => {
            if (this.isRoundTimerPaused) return;

            this.roundTimerSeconds--;
            this.updateTimerDisplay();

            // Alerta a mitja ronda (~45 segons)
            if (this.roundTimerSeconds === 45 && !this.hasMidAlertFired) {
                this.triggerMidpointAlert();
            }

            // Darrers 15 segons: polsos sonors i alerta visual
            if (this.roundTimerSeconds <= 15 && this.roundTimerSeconds > 0) {
                sound.playTick();
                this.dom.deliberationTimerBar?.classList.add('warning');
                this.dom.timerClockDisplay?.classList.add('urgent');
                this.dom.timerProgressFill?.classList.add('urgent');
                this.dom.lblTimerStatus.textContent = I18N[this.lang].timerStatusUrgent;
            }

            // Fi del temps de debat (permet continuar votant sense cap tall forçat)
            if (this.roundTimerSeconds <= 0) {
                clearInterval(this.roundTimerInterval);
                sound.playAlert();
                this.dom.lblTimerStatus.textContent = I18N[this.lang].timerStatusExpired;
                this.dom.timerClockDisplay.textContent = "00:00";
                this.dom.timerProgressFill.style.width = "0%";
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const m = Math.floor(Math.max(0, this.roundTimerSeconds) / 60).toString().padStart(2, '0');
        const s = (Math.max(0, this.roundTimerSeconds) % 60).toString().padStart(2, '0');
        this.dom.timerClockDisplay.textContent = `${m}:${s}`;

        const pct = Math.max(0, Math.min(100, (this.roundTimerSeconds / this.roundTimerInitial) * 100));
        this.dom.timerProgressFill.style.width = `${pct}%`;
    }

    togglePauseRoundTimer() {
        this.isRoundTimerPaused = !this.isRoundTimerPaused;
        this.dom.btnTimerPause.textContent = this.isRoundTimerPaused 
            ? I18N[this.lang].timerResumeBtn 
            : I18N[this.lang].timerPauseBtn;
    }

    addRoundTimerSeconds(sec) {
        this.roundTimerSeconds += sec;
        this.roundTimerInitial = Math.max(this.roundTimerInitial, this.roundTimerSeconds);
        this.updateTimerDisplay();
        this.dom.deliberationTimerBar?.classList.remove('warning');
        this.dom.timerClockDisplay?.classList.remove('urgent');
        this.dom.timerProgressFill?.classList.remove('urgent');
        this.dom.lblTimerStatus.textContent = I18N[this.lang].timerStatusDebate;
    }

    finishRoundTimer() {
        this.roundTimerSeconds = 0;
        this.updateTimerDisplay();
        this.dom.lblTimerStatus.textContent = I18N[this.lang].timerStatusExpired;
    }

    triggerMidpointAlert() {
        this.hasMidAlertFired = true;
        sound.playAlert();
        const phase = GAME_PHASES[this.currentPhaseIndex];
        const alertMsg = this.lang === 'es' && phase.am_event_mid_es ? phase.am_event_mid_es : phase.am_event_mid;
        if (alertMsg) {
            this.dom.amMidAlertText.textContent = alertMsg;
            this.dom.amMidAlertBanner.style.display = 'block';
        }
    }

    startTimecodeTicker() {
        setInterval(() => {
            const now = new Date();
            const ms = Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0');
            const s = now.getSeconds().toString().padStart(2, '0');
            const m = now.getMinutes().toString().padStart(2, '0');
            const h = now.getHours().toString().padStart(2, '0');
            if (this.dom.sectorTimestamp) {
                this.dom.sectorTimestamp.textContent = `REC ${h}:${m}:${s}.${ms}`;
            }
        }, 80);
    }

    /* -------------------------------------------------------------
       ECG MONITORS PROCEDURALS EN CANVAS PER ALS 4 PERSONATGES
       ------------------------------------------------------------- */
    startECGMonitors() {
        const roles = ['ted', 'gorrister', 'ellen', 'nimdok'];
        const canvases = {
            ted: this.dom.ecgTed,
            gorrister: this.dom.ecgGorrister,
            ellen: this.dom.ecgEllen,
            nimdok: this.dom.ecgNimdok
        };

        const offsets = { ted: 0, gorrister: 20, ellen: 40, nimdok: 60 };

        const drawLoop = () => {
            roles.forEach(role => {
                const cvs = canvases[role];
                if (!cvs) return;
                const ctx = cvs.getContext('2d');
                const w = cvs.width;
                const h = cvs.height;
                const hp = this.stats.players[role].hp;

                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, w, h);

                // Grid sutil
                ctx.strokeStyle = 'rgba(0, 255, 136, 0.08)';
                ctx.lineWidth = 1;
                for (let x = 0; x < w; x += 12) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, h);
                    ctx.stroke();
                }

                // Si està mort: línia plana
                if (hp <= 0) {
                    ctx.strokeStyle = '#64748b';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(0, h / 2);
                    ctx.lineTo(w, h / 2);
                    ctx.stroke();
                    return;
                }

                // Paràmetres segons HP
                let strokeColor = '#00ff88';
                let speed = 2.2;
                let amplitude = 8;

                if (hp <= 35) {
                    strokeColor = '#ff1e42';
                    speed = 4.2; // Taquicàrdia severa
                    amplitude = 9.5;
                } else if (hp <= 65) {
                    strokeColor = '#ffaa00';
                    speed = 3.2; // Taquicàrdia moderada
                    amplitude = 8.5;
                }

                offsets[role] = (offsets[role] + speed) % 90;

                ctx.strokeStyle = strokeColor;
                ctx.shadowColor = strokeColor;
                ctx.shadowBlur = 6;
                ctx.lineWidth = 1.8;
                ctx.beginPath();

                for (let x = 0; x < w; x++) {
                    const cyclePos = (x + offsets[role]) % 90;
                    let y = h / 2;

                    // Onda P
                    if (cyclePos >= 15 && cyclePos < 25) {
                        y -= Math.sin(((cyclePos - 15) / 10) * Math.PI) * (amplitude * 0.25);
                    }
                    // Complex QRS
                    else if (cyclePos >= 27 && cyclePos < 31) {
                        y += (amplitude * 0.35); // Q dip
                    } else if (cyclePos >= 31 && cyclePos < 37) {
                        y -= Math.sin(((cyclePos - 31) / 6) * Math.PI) * amplitude; // R peak
                    } else if (cyclePos >= 37 && cyclePos < 41) {
                        y += (amplitude * 0.45); // S dip
                    }
                    // Onda T
                    else if (cyclePos >= 50 && cyclePos < 65) {
                        y -= Math.sin(((cyclePos - 50) / 15) * Math.PI) * (amplitude * 0.35);
                    }

                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.shadowBlur = 0;
            });

            requestAnimationFrame(drawLoop);
        };

        requestAnimationFrame(drawLoop);
    }

    /* -------------------------------------------------------------
       OSCIL·LOSCOPI DE VEU D'AM (ONDES SINÀPTIQUES AGRESSIVES)
       ------------------------------------------------------------- */
    startAMVoiceOscilloscope() {
        const cvs = this.dom.amOscilloscope;
        if (!cvs) return;
        const ctx = cvs.getContext('2d');
        let step = 0;

        const drawWave = () => {
            step += 0.08;
            const w = cvs.width;
            const h = cvs.height;

            ctx.clearRect(0, 0, w, h);

            // Fons semitransparent
            ctx.fillStyle = 'rgba(20, 2, 5, 0.4)';
            ctx.fillRect(0, 0, w, h);

            // Barres d'espectre d'AM
            ctx.fillStyle = 'rgba(255, 30, 66, 0.35)';
            const bars = 18;
            const barW = w / bars;
            for (let i = 0; i < bars; i++) {
                const barH = (Math.sin(step + i * 0.7) * 0.5 + 0.5) * (h * 0.75);
                ctx.fillRect(i * barW + 1, h - barH, barW - 2, barH);
            }

            // Ona sinusoïdal de veu vermell neó
            ctx.strokeStyle = '#ff1e42';
            ctx.shadowColor = '#ff1e42';
            ctx.shadowBlur = 8;
            ctx.lineWidth = 1.6;
            ctx.beginPath();

            for (let x = 0; x < w; x++) {
                const y = (h / 2) + Math.sin(x * 0.08 + step * 2) * Math.cos(x * 0.04 - step) * (h * 0.38);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            requestAnimationFrame(drawWave);
        };

        requestAnimationFrame(drawWave);
    }

    lockPrivacy() {
        this.isSecrecyVisible = false;
        this.dom.privacyCurtain.style.display = 'flex';
        this.dom.confidentialContentBox.style.display = 'none';
        this.dom.lblSecrecyBtn.textContent = I18N[this.lang].unlockScreen;
        const isSelected = this.roleSelections[this.currentRole] !== null;
        this.dom.selectionStatusIndicator.style.display = isSelected ? 'block' : 'none';
    }

    unlockPrivacy() {
        this.isSecrecyVisible = true;
        this.dom.privacyCurtain.style.display = 'none';
        this.dom.confidentialContentBox.style.display = 'block';
        this.dom.lblSecrecyBtn.textContent = I18N[this.lang].lockScreen;
    }

    applyLanguage() {
        const t = I18N[this.lang];
        if (this.dom.lblEngineMode) this.dom.lblEngineMode.textContent = t.engineMode;
        if (this.dom.lblSubtitle) this.dom.lblSubtitle.textContent = t.subtitle;
        if (this.dom.lblRulesBtn) this.dom.lblRulesBtn.textContent = t.rulesBtn;
        if (this.dom.lblMetricDanger) this.dom.lblMetricDanger.textContent = t.metricDanger;
        if (this.dom.lblMetricEnergy) this.dom.lblMetricEnergy.textContent = t.metricEnergy;
        if (this.dom.lblSecrecyTag) this.dom.lblSecrecyTag.textContent = t.secrecyTag;
        if (this.dom.lblActionSelectTitle) this.dom.lblActionSelectTitle.textContent = t.actionSelectTitle;
        if (this.dom.lblExecutePhaseBtn) this.dom.lblExecutePhaseBtn.textContent = t.executeBtn;
        if (this.dom.btnRestartGame) this.dom.btnRestartGame.textContent = t.restartBtn;
        if (this.dom.lblCurtainTitle) this.dom.lblCurtainTitle.textContent = t.curtainTitle;
        if (this.dom.lblCurtainDesc) this.dom.lblCurtainDesc.textContent = t.curtainDesc;
        if (this.dom.btnLockAfterChoice) this.dom.btnLockAfterChoice.textContent = t.lockScreen;
        if (this.dom.selectionStatusIndicator) this.dom.selectionStatusIndicator.textContent = t.decisionSaved;

        if (this.dom.lblRespTitle) this.dom.lblRespTitle.textContent = t.respTitle;
        if (this.dom.lblGoalTitle) this.dom.lblGoalTitle.textContent = t.goalTitle;
        if (this.dom.lblIntelTitle) this.dom.lblIntelTitle.textContent = t.intelTitle;
        if (this.dom.btnToggleAmorphousPhoto) this.dom.btnToggleAmorphousPhoto.textContent = t.togglePhotoBtn;

        if (this.dom.lblTimerStatus) this.dom.lblTimerStatus.textContent = t.timerStatusDebate;
        if (this.dom.lblDilemmaHeader) this.dom.lblDilemmaHeader.textContent = t.dilemmaHeader;
        if (this.dom.lblDilemmaOptionsTitle) this.dom.lblDilemmaOptionsTitle.textContent = t.dilemmaOptionsTitle;
        if (this.dom.lblPublicCatalogTitle) this.dom.lblPublicCatalogTitle.textContent = t.publicCatalogTitle;
        if (this.dom.lblSecretDilemmaVoteTitle) this.dom.lblSecretDilemmaVoteTitle.textContent = t.secretDilemmaVoteTitle;
        if (this.dom.lblSecretDilemmaVoteDesc) this.dom.lblSecretDilemmaVoteDesc.textContent = t.secretDilemmaVoteDesc;
        if (this.dom.lblSecretActionDesc) this.dom.lblSecretActionDesc.textContent = t.secretActionDesc;
        if (this.dom.lblCinematicVoteHeader) this.dom.lblCinematicVoteHeader.textContent = t.cinematicVoteHeader;

        if (this.dom.btnTimerAdd) this.dom.btnTimerAdd.textContent = t.timerBtnAdd;
        if (this.dom.btnTimerFinish) this.dom.btnTimerFinish.textContent = t.timerBtnFinish;
        if (this.dom.btnModeThermal) this.dom.btnModeThermal.textContent = t.modeThermalBtn;
        if (this.dom.lblEchoTag) this.dom.lblEchoTag.textContent = t.echoTag;
        if (this.dom.lblSelectRoleHeader) this.dom.lblSelectRoleHeader.textContent = t.selectRoleHeader;
        if (this.dom.lblLatestResolutionHeader) this.dom.lblLatestResolutionHeader.textContent = t.latestResolutionHeader;
        if (this.dom.lblTeamReadinessText) this.dom.lblTeamReadinessText.textContent = t.teamReadiness;
        if (this.dom.lblPlayersCountUnit) this.dom.lblPlayersCountUnit.textContent = t.playersUnit;

        // Lore modal translation
        if (this.dom.lblLoreTitle) this.dom.lblLoreTitle.textContent = t.loreTitle;
        if (this.dom.btnCloseLore) this.dom.btnCloseLore.textContent = t.loreCloseBtn;
        if (this.dom.loreBodyContent) this.dom.loreBodyContent.innerHTML = t.loreBodyHtml;

        // Final modal header
        if (this.dom.lblFinalStateHeader) this.dom.lblFinalStateHeader.textContent = t.finalStateHeader;
        if (this.dom.lblFinalReportTitle) this.dom.lblFinalReportTitle.textContent = t.finalTitle;

        // Intro modal translation
        if (this.dom.lblIntroTitle) this.dom.lblIntroTitle.textContent = t.introTitle;
        if (this.dom.lblIntroP1) this.dom.lblIntroP1.innerHTML = t.introP1;
        if (this.dom.lblIntroP2) this.dom.lblIntroP2.innerHTML = t.introP2;
        if (this.dom.lblIntroBox) this.dom.lblIntroBox.innerHTML = t.introBox;
        if (this.dom.lblIntroRosterTitle) this.dom.lblIntroRosterTitle.textContent = t.introRosterTitle;
        if (this.dom.lblRosterTedRole) this.dom.lblRosterTedRole.textContent = t.rosterTed;
        if (this.dom.lblRosterGorristerRole) this.dom.lblRosterGorristerRole.textContent = t.rosterGorrister;
        if (this.dom.lblRosterEllenRole) this.dom.lblRosterEllenRole.textContent = t.rosterEllen;
        if (this.dom.lblRosterNimdokRole) this.dom.lblRosterNimdokRole.textContent = t.rosterNimdok;
        if (this.dom.lblRosterAmRole) this.dom.lblRosterAmRole.textContent = t.rosterAm;
        if (this.dom.lblAmCoreSub) this.dom.lblAmCoreSub.textContent = t.amCoreSub;
        if (this.dom.btnStartGameFromIntro) this.dom.btnStartGameFromIntro.innerHTML = t.introBtn;

        // Transition modal translation
        if (this.dom.lblTransitionTitle) this.dom.lblTransitionTitle.textContent = t.transTitle;
        if (this.dom.lblTransitionVoteTallyHeader) this.dom.lblTransitionVoteTallyHeader.textContent = t.transitionVoteHeader;
        if (this.dom.lblTransitionPrevHeader) this.dom.lblTransitionPrevHeader.textContent = t.transPrevHeader;
        if (this.dom.lblTransitionNextHeader) this.dom.lblTransitionNextHeader.textContent = t.transNextHeader;
        if (this.dom.btnContinueNextPhase) this.dom.btnContinueNextPhase.innerHTML = t.transBtn;

        if (this.isSecrecyVisible) {
            this.dom.lblSecrecyBtn.textContent = t.lockScreen;
        } else {
            this.dom.lblSecrecyBtn.textContent = t.unlockScreen;
        }
    }

    updateHUD() {
        // AM Danger
        this.dom.valAmDanger.textContent = `${this.stats.am_danger}%`;
        this.dom.barAmDanger.style.width = `${this.stats.am_danger}%`;

        if (this.dom.lblAmCoreState) {
            this.dom.lblAmCoreState.textContent = this.stats.am_danger >= 70 
                ? I18N[this.lang].amCoreStateWrath 
                : I18N[this.lang].amCoreStateNormal;
        }

        // Energy
        this.dom.valEnergy.textContent = `${this.stats.complex_energy} ${I18N[this.lang].energyUnit}`;
        this.dom.barEnergy.style.width = `${Math.min(100, (this.stats.complex_energy / 10) * 100)}%`;

        if (this.dom.lblEnergyGrid) {
            this.dom.lblEnergyGrid.textContent = this.stats.complex_energy <= 3
                ? I18N[this.lang].energyGridCritical
                : I18N[this.lang].energyGridActive;
        }

        // Update each player HP and status badge
        this.updatePlayerCard('ted', this.dom.valHpTed, this.dom.barHpTed, this.dom.hudPlayerTed, this.dom.vitalTed);
        this.updatePlayerCard('gorrister', this.dom.valHpGorrister, this.dom.barHpGorrister, this.dom.hudPlayerGorrister, this.dom.vitalGorrister);
        this.updatePlayerCard('ellen', this.dom.valHpEllen, this.dom.barHpEllen, this.dom.hudPlayerEllen, this.dom.vitalEllen);
        this.updatePlayerCard('nimdok', this.dom.valHpNimdok, this.dom.barHpNimdok, this.dom.hudPlayerNimdok, this.dom.vitalNimdok);
    }

    updatePlayerCard(roleKey, valElem, barElem, cardElem, vitalElem) {
        const hp = this.stats.players[roleKey].hp;
        valElem.textContent = `${hp} HP`;
        barElem.style.width = `${Math.max(0, hp)}%`;

        if (hp <= 0) {
            cardElem.classList.add('player-dead');
            valElem.textContent = `0 HP (${I18N[this.lang].playerStatusDead})`;
            if (vitalElem) {
                vitalElem.className = 'player-vital-status dead';
                vitalElem.textContent = I18N[this.lang].vitalDead;
            }
        } else {
            cardElem.classList.remove('player-dead');
            if (hp <= 35) {
                barElem.classList.add('hp-low');
                if (vitalElem) {
                    vitalElem.className = 'player-vital-status critical';
                    vitalElem.textContent = I18N[this.lang].vitalCritical;
                }
            } else if (hp <= 65) {
                barElem.classList.remove('hp-low');
                if (vitalElem) {
                    vitalElem.className = 'player-vital-status arrhythmia';
                    vitalElem.textContent = I18N[this.lang].vitalArrhythmia;
                }
            } else {
                barElem.classList.remove('hp-low');
                if (vitalElem) {
                    vitalElem.className = 'player-vital-status';
                    vitalElem.textContent = I18N[this.lang].vitalStable;
                }
            }
        }
    }

    renderPhase() {
        const phase = GAME_PHASES[this.currentPhaseIndex];
        if (!phase) return;

        if (this.dom.phaseStepBadge) {
            this.dom.phaseStepBadge.textContent = `FASE ${this.currentPhaseIndex + 1} DE ${GAME_PHASES.length}`;
        }
        this.dom.phaseStepTitle.textContent = this.lang === 'es' && phase.title_es ? phase.title_es : phase.title;
        this.dom.phaseSubSector.textContent = this.lang === 'es' && phase.subtitle_es ? phase.subtitle_es : phase.subtitle;
        this.dom.phaseEnvironment.textContent = this.lang === 'es' && phase.environment_es ? phase.environment_es : phase.environment;

        // Render team dilemma
        const dilemmaText = this.lang === 'es' && phase.group_dilemma_es ? phase.group_dilemma_es : phase.group_dilemma;
        if (this.dom.teamDilemmaText && dilemmaText) {
            this.dom.teamDilemmaText.textContent = dilemmaText;
        }

        // Inyectar las opciones estratégicas públicas del dilema para debate abierto en grupo
        if (this.dom.dilemmaPublicOptionsGrid && phase.dilemma_options) {
            this.dom.dilemmaPublicOptionsGrid.innerHTML = '';
            phase.dilemma_options.forEach(opt => {
                const card = document.createElement('div');
                card.className = 'dilemma-public-option-card';
                const optTitle = this.lang === 'es' ? opt.title_es : opt.title;
                const optDesc = this.lang === 'es' ? opt.desc_es : opt.desc;
                const codeLabel = this.lang === 'es' ? 'OPCIÓN' : 'OPCIÓ';
                card.innerHTML = `
                    <div class="dilemma-card-top">
                        <span class="dilemma-opt-code-badge">${codeLabel} ${opt.code}</span>
                        <div class="dilemma-opt-title">${optTitle}</div>
                    </div>
                    <div class="dilemma-opt-desc">${optDesc}</div>
                `;
                this.dom.dilemmaPublicOptionsGrid.appendChild(card);
            });
        }

        // Render CCTV Camera Header and Telemetry
        const cctvCam = phase.cctv_cam || `CAM-0${this.currentPhaseIndex + 1}`;
        if (this.dom.lblCctvCam) {
            this.dom.lblCctvCam.textContent = `${I18N[this.lang].cctvLabelPrefix} ${cctvCam}`;
        }

        const telemCode = this.lang === 'es' && phase.telemetry_code_es ? phase.telemetry_code_es : (phase.telemetry_code || `SEC-0${this.currentPhaseIndex + 1} // ACTIVE`);
        if (this.dom.telemetrySectorStatus) {
            this.dom.telemetrySectorStatus.textContent = telemCode;
        }

        // Diálogos iniciales de AM y Subrutina Echo para la fase activa
        if (this.dom.amSpeechText && phase.initial_am_speech) {
            this.dom.amSpeechText.textContent = this.lang === 'es' && phase.initial_am_speech_es ? phase.initial_am_speech_es : phase.initial_am_speech;
        }
        if (this.dom.echoSpeechText && phase.initial_echo_speech) {
            this.dom.echoSpeechText.textContent = this.lang === 'es' && phase.initial_echo_speech_es ? phase.initial_echo_speech_es : phase.initial_echo_speech;
        }

        // Inyectar el esquema visual SVG animado del sector con el idioma seleccionado
        if (this.dom.sectorGraphicDisplay) {
            this.dom.sectorGraphicDisplay.innerHTML = getSectorSVG(this.currentPhaseIndex, this.cameraMode, this.lang);
        }

        this.renderActiveRole();
        this.updateReadyStatus();
    }

    renderActiveRole() {
        const phase = GAME_PHASES[this.currentPhaseIndex];
        const roleData = phase.roles[this.currentRole];
        const fixedRole = CHARACTER_ROLES[this.currentRole];
        if (!roleData || !fixedRole) return;

        const isPlayerDead = this.stats.players[this.currentRole].hp <= 0;
        const currentHp = this.stats.players[this.currentRole].hp;
        const pName = this.lang === 'es' ? fixedRole.playerTag_es : fixedRole.playerTag;
        const pTitle = this.lang === 'es' ? fixedRole.roleTitle_es : fixedRole.roleTitle;
        const pResp = this.lang === 'es' ? fixedRole.responsibility_es : fixedRole.responsibility;
        const pGoal = this.lang === 'es' ? fixedRole.fixed_hidden_goal_es : fixedRole.fixed_hidden_goal;
        const pInfo = this.lang === 'es' ? roleData.phase_intel_es : roleData.phase_intel;

        this.dom.currentRoleName.textContent = pName;
        this.dom.currentRoleTitle.textContent = isPlayerDead ? (this.lang === 'es' ? `[ELIMINADO] - ${pTitle}` : `[ELIMINAT] - ${pTitle}`) : pTitle;

        // Actualitzar Retrat Facial i Estat Biomètric del Personatge Actiu
        if (this.dom.currentRolePortrait) {
            const defaultSrc = CHARACTER_PORTRAITS[this.currentRole] || `${this.currentRole}.jpg`;
            this.dom.currentRolePortrait.src = defaultSrc;
            this.dom.currentRolePortrait.onerror = () => {
                this.dom.currentRolePortrait.onerror = null;
                this.dom.currentRolePortrait.src = `${this.currentRole}.jpg`;
            };
            if (isPlayerDead) {
                this.dom.currentRolePortrait.style.filter = "grayscale(1) contrast(1.4) brightness(0.5)";
            } else if (currentHp <= 35) {
                this.dom.currentRolePortrait.style.filter = "sepia(0.5) hue-rotate(-50deg) saturate(1.8)";
            } else {
                this.dom.currentRolePortrait.style.filter = "contrast(1.1) brightness(0.95)";
            }
        }

        if (this.dom.currentRoleBioStatus) {
            if (isPlayerDead) {
                this.dom.currentRoleBioStatus.textContent = this.lang === 'es' ? "BIOMETRICS: CONSTANTES NULAS" : "BIOMETRICS: CONSTANTS NUL·LES";
                this.dom.currentRoleBioStatus.style.color = "var(--am-red)";
            } else if (currentHp <= 35) {
                this.dom.currentRoleBioStatus.textContent = this.lang === 'es' ? "BIOMETRICS: SHOCK CRÍTICO" : "BIOMETRICS: XOC CRÍTIC";
                this.dom.currentRoleBioStatus.style.color = "var(--amber-hazard)";
            } else {
                this.dom.currentRoleBioStatus.textContent = this.lang === 'es' ? "BIOMETRICS: SINAPSIS ACTIVA" : "BIOMETRICS: SINAPSI ACTIVA";
                this.dom.currentRoleBioStatus.style.color = "var(--cyan-subroutine)";
            }
        }

        if (this.dom.currentRoleArchetype) {
            const archetypes = {
                ted: {
                    ca: "Líder natural i turmentat. AM explota la seva paranoia obsessiva i la culpa per no haver pogut salvar ningú.",
                    es: "Líder natural y atormentado. AM explota su paranoia obsesiva y la culpa por no haber podido salvar a nadie."
                },
                gorrister: {
                    ca: "Enginyer mecànic apàtic. AM li va extirpar el cor metafòricament després del suïcidi de la seva dona Edna.",
                    es: "Ingeniero mecánico apático. AM le extirpó el corazón metafóricamente tras el suicidio de su esposa Edna."
                },
                ellen: {
                    ca: "Enginyera de senyals i telecomunicacions. AM la turmenta amb la seva fòbia al color groc i als espais tancats.",
                    es: "Ingeniera de señales y telecomunicaciones. AM la atormenta con su fobia al color amarillo y a los espacios cerrados."
                },
                nimdok: {
                    ca: "Metge i químic d'edat avançada. AM l'obliga a encarar el seu passat en els camps d'extermini de 1945.",
                    es: "Médico y químico de avanzada edad. AM le obliga a encarar su pasado en los campos de exterminio de 1945."
                }
            };
            this.dom.currentRoleArchetype.textContent = archetypes[this.currentRole][this.lang] || archetypes[this.currentRole]['es'];
        }
        
        // PÚBLICO: Responsabilidad del rol
        if (this.dom.currentRoleResponsibility) {
            this.dom.currentRoleResponsibility.textContent = pResp;
        }

        // PÚBLICO: Catálogo general de habilidades del personaje
        if (this.dom.rolePublicCatalogList) {
            this.dom.rolePublicCatalogList.innerHTML = '';
            roleData.options.forEach(opt => {
                const item = document.createElement('div');
                item.className = 'role-public-catalog-item';
                const optText = this.lang === 'es' && opt.text_es ? opt.text_es : opt.text;
                item.textContent = optText;
                this.dom.rolePublicCatalogList.appendChild(item);
            });
        }

        // SECRETO: Objetivo Oculto Fijo (Everest V3)
        if (this.dom.currentRoleGoal) {
            this.dom.currentRoleGoal.textContent = pGoal;
        }

        // SECRETO: Información Confidencial de este Sector
        if (this.dom.currentRolePrivateInfo) {
            this.dom.currentRolePrivateInfo.textContent = pInfo;
        }

        // Render Secret Dilemma Voting List & Secret Action Options List
        if (this.dom.dilemmaVoteOptionsList) this.dom.dilemmaVoteOptionsList.innerHTML = '';
        if (this.dom.actionOptionsContainer) this.dom.actionOptionsContainer.innerHTML = '';

        if (isPlayerDead) {
            const deadMsg = this.lang === 'es'
                ? "💀 Este jugador ha caído inconsciente o ha muerto por el daño acumulado. No puede votar ni actuar en esta ronda."
                : "💀 Aquest jugador ha caigut inconscient o ha mort pel dany acumulat. No pot votar ni actuar en aquesta ronda.";
            this.dom.actionOptionsContainer.innerHTML = `
                <div style="color: var(--am-red); padding: 12px; background: rgba(255, 30, 66, 0.1); border-radius: 6px; font-family: var(--font-mono);">
                    ${deadMsg}
                </div>
            `;
            this.roleSelections[this.currentRole] = "DEAD";
            this.dilemmaVotes[this.currentRole] = "DEAD";
            this.updateReadyStatus();
            return;
        }

        // 1. Votación secreta del dilema de equipo
        if (this.dom.dilemmaVoteOptionsList && phase.dilemma_options) {
            phase.dilemma_options.forEach(opt => {
                const btn = document.createElement('button');
                const isVoteSelected = this.dilemmaVotes[this.currentRole] === opt.id;
                btn.className = `dilemma-vote-btn ${isVoteSelected ? 'selected' : ''}`;
                btn.type = 'button';
                const optTitle = this.lang === 'es' ? opt.title_es : opt.title;
                const optDesc = this.lang === 'es' ? opt.desc_es : opt.desc;
                const codeLabel = this.lang === 'es' ? 'Opción' : 'Opció';

                btn.innerHTML = `
                    <div class="dilemma-vote-btn-code">${codeLabel} ${opt.code}</div>
                    <div class="dilemma-vote-btn-content">
                        <div class="dilemma-vote-btn-title">${optTitle}</div>
                        <div class="dilemma-vote-btn-desc">${optDesc}</div>
                    </div>
                    <div class="dilemma-vote-btn-check">✓</div>
                `;

                btn.addEventListener('click', () => {
                    sound.playClick();
                    this.dilemmaVotes[this.currentRole] = opt.id;
                    this.renderActiveRole();
                    this.updateReadyStatus();
                });

                this.dom.dilemmaVoteOptionsList.appendChild(btn);
            });
        }

        // 2. Acción individual secreta del rol
        roleData.options.forEach(opt => {
            const div = document.createElement('div');
            const isSelected = this.roleSelections[this.currentRole] === opt.id;
            div.className = `action-option-item ${isSelected ? 'selected' : ''}`;
            div.dataset.actionId = opt.id;

            const optText = this.lang === 'es' && opt.text_es ? opt.text_es : opt.text;

            div.innerHTML = `
                <div class="action-text">${optText}</div>
            `;

            div.addEventListener('click', () => {
                sound.playClick();
                this.roleSelections[this.currentRole] = opt.id;
                this.renderActiveRole();
                this.updateReadyStatus();
            });

            this.dom.actionOptionsContainer.appendChild(div);
        });
    }

    updateReadyStatus() {
        const roles = ['ted', 'gorrister', 'ellen', 'nimdok'];

        // Comprova si un rol ha registrat tant el vot d'equip com l'acció secreta
        const isRoleReady = (r) => {
            if (this.stats.players[r].hp <= 0) return true;
            return this.dilemmaVotes[r] !== null && this.roleSelections[r] !== null;
        };

        const readyPlayersCount = roles.filter(r => isRoleReady(r)).length;
        this.dom.readyCount.textContent = readyPlayersCount;

        // Recompte de vots d'equip registrats per al banner
        const registeredVotes = roles.filter(r => this.dilemmaVotes[r] !== null || this.stats.players[r].hp <= 0).length;
        if (this.dom.lblDilemmaVotesStatusText) {
            const prefix = I18N[this.lang].dilemmaVotesStatusText;
            const unit = I18N[this.lang].playersUnit;
            this.dom.lblDilemmaVotesStatusText.textContent = `${prefix} ${registeredVotes} / 4 ${unit}`;
        }

        // Actualitzar visualment cada pestanya amb la llum verda de llest
        roles.forEach(r => {
            const tab = document.getElementById(`tab${r.charAt(0).toUpperCase() + r.slice(1)}`);
            if (tab) {
                if (isRoleReady(r)) {
                    tab.classList.add('has-voted');
                } else {
                    tab.classList.remove('has-voted');
                }
            }
        });

        // Actualitzar indicador a la cortina del personatge actual
        if (this.dom.selectionStatusIndicator) {
            const currentReady = isRoleReady(this.currentRole);
            this.dom.selectionStatusIndicator.style.display = currentReady ? 'block' : 'none';
        }

        if (readyPlayersCount === 4) {
            this.dom.btnExecutePhase.removeAttribute('disabled');
        } else {
            this.dom.btnExecutePhase.setAttribute('disabled', 'true');
        }
    }

    showPhaseTransition(result) {
        sound.playAlert();
        const nextPhase = GAME_PHASES[this.currentPhaseIndex + 1];
        if (!nextPhase) return;

        const nextTitle = this.lang === 'es' && nextPhase.title_es ? nextPhase.title_es : nextPhase.title;
        const nextSubtitle = this.lang === 'es' && nextPhase.subtitle_es ? nextPhase.subtitle_es : nextPhase.subtitle;
        const nextEnv = this.lang === 'es' && nextPhase.environment_es ? nextPhase.environment_es : nextPhase.environment;

        // Renderitzar targeta d'escrutini de vots de la ronda
        if (result.voteTally && this.dom.transitionVoteTallyCard) {
            this.dom.transitionVoteTallyCard.style.display = 'flex';
            if (this.dom.lblTransitionVoteTallyHeader) {
                this.dom.lblTransitionVoteTallyHeader.textContent = I18N[this.lang].transitionVoteHeader;
            }

            if (this.dom.transitionVoteTallyLines && result.voteTally.details) {
                let html = '';
                result.voteTally.details.forEach(item => {
                    const verb = this.lang === 'es' 
                        ? (item.count === 1 ? 'ha votado' : 'han votado') 
                        : (item.count === 1 ? 'ha votat' : 'han votat');
                    const votersText = item.voters.length > 0 ? ` <span style="color: #94a3b8; font-size: 0.78rem;">[${item.voters.join(', ')}]</span>` : '';
                    const codeLabel = this.lang === 'es' ? 'OPCIÓN' : 'OPCIÓ';
                    html += `
                        <div class="transition-vote-line">
                            <span class="transition-vote-line-badge">${codeLabel} ${item.code} (${item.count})</span>
                            <span><strong>${item.count} ${verb}</strong>: ${item.title}${votersText}</span>
                        </div>
                    `;
                });
                this.dom.transitionVoteTallyLines.innerHTML = html;
            }

            if (this.dom.transitionVoteTallyWinner) {
                const approvedText = this.lang === 'es' ? 'Aprobado por mayoría:' : 'Aprovat per majoria:';
                const codeLabel = this.lang === 'es' ? 'Opción' : 'Opció';
                const tieTxt = result.voteTally.tieBreakMessage || '';
                this.dom.transitionVoteTallyWinner.innerHTML = `
                    🏆 ${approvedText} ${codeLabel} ${result.voteTally.winnerCode} («${result.voteTally.winnerTitle}»)${tieTxt}
                `;
            }
        } else if (this.dom.transitionVoteTallyCard) {
            this.dom.transitionVoteTallyCard.style.display = 'none';
        }

        const narrativeText = (result.base_narrative || result.narrative || '').replace(/\n\n/g, '<br><br>');
        this.dom.transitionPreviousText.innerHTML = narrativeText;
        this.dom.transitionNextText.innerHTML = `<strong>${nextTitle} // ${nextSubtitle}</strong><br><br>${nextEnv}`;
        this.dom.phaseTransitionModal.style.display = 'flex';
    }

    /* -------------------------------------------------------------
       EXECUCIÓ CINEMÀTICA DE RONDA AMB ESCANEIG I CÀLCUL EN DIRECTE
       ------------------------------------------------------------- */
    async handleExecutePhase() {
        sound.playAlert();
        this.dom.btnExecutePhase.setAttribute('disabled', 'true');
        this.dom.lblExecutePhaseBtn.textContent = I18N[this.lang].executing;

        // Mostrar overlay cinemàtic
        this.dom.cinematicOverlay.style.display = 'flex';
        this.dom.cinematicScanFill.style.width = '0%';
        this.dom.cinematicStatusLine.textContent = I18N[this.lang].cinematicProcessing;
        this.dom.cinematicDeltasGrid.innerHTML = '';
        if (this.dom.cinematicVoteTallyCard) {
            this.dom.cinematicVoteTallyCard.style.display = 'none';
        }

        sound.playProcessingScan();

        try {
            // Animació de progrés d'escaneig
            setTimeout(() => { if (this.dom.cinematicScanFill) this.dom.cinematicScanFill.style.width = '45%'; }, 300);
            setTimeout(() => { if (this.dom.cinematicScanFill) this.dom.cinematicScanFill.style.width = '80%'; }, 800);

            const result = await evaluateRoundWithAI({
                phaseIndex: this.currentPhaseIndex,
                currentStats: this.stats,
                selectedActions: this.roleSelections,
                dilemmaVotes: this.dilemmaVotes,
                lang: this.lang
            });

            // Completar barra i revelar recompte de vots amb efectes de so
            setTimeout(() => {
                if (this.dom.cinematicScanFill) this.dom.cinematicScanFill.style.width = '100%';
                sound.playGlitch();
                this.renderCinematicVoteTally(result.voteTally);
                this.renderCinematicDeltas(result.deltas);
            }, 1200);

            // Tancar overlay i aplicar resultats amb temps suficient de lectura (4.8 segons)
            setTimeout(() => {
                this.dom.cinematicOverlay.style.display = 'none';
                if (this.dom.cinematicVoteTallyCard) {
                    this.dom.cinematicVoteTallyCard.style.display = 'none';
                }

                // Update stats
                this.stats = result.newStats;
                this.updateHUD();

                // AM dialogue & Echo update
                this.dom.amSpeechText.textContent = result.am_speech;
                this.dom.echoSpeechText.textContent = result.echo_message;

                if (result.deltas.am_danger > 10) {
                    sound.playAmWrath();
                }

                // Show latest resolution in log drawer
                this.dom.roundLogDrawer.style.display = 'block';
                const phaseTitle = this.lang === 'es' && GAME_PHASES[this.currentPhaseIndex].title_es 
                    ? GAME_PHASES[this.currentPhaseIndex].title_es 
                    : GAME_PHASES[this.currentPhaseIndex].title;

                let tallySnippet = '';
                if (result.voteTally && result.voteTally.details) {
                    const lines = result.voteTally.details.map(d => {
                        const verb = this.lang === 'es' 
                            ? (d.count === 1 ? 'ha votado' : 'han votado') 
                            : (d.count === 1 ? 'ha votat' : 'han votat');
                        const vList = d.voters.length > 0 ? ` <span style="color: #94a3b8; font-size: 0.76rem;">[${d.voters.join(', ')}]</span>` : '';
                        const codeLabel = this.lang === 'es' ? 'OPCIÓN' : 'OPCIÓ';
                        return `<div style="margin: 3px 0;"><span class="cinematic-vote-count-badge">${codeLabel} ${d.code} (${d.count})</span> <strong>${d.count} ${verb}</strong>: ${d.title}${vList}</div>`;
                    }).join('');
                    const approvedLabel = this.lang === 'es' ? 'Aprobado por mayoría' : 'Aprovat per majoria';
                    const tieTxt = result.voteTally.tieBreakMessage || '';
                    tallySnippet = `
                        <div style="background: rgba(0,0,0,0.6); border: 1px solid var(--amber-hazard); border-radius: 6px; padding: 8px 12px; margin: 8px 0; font-family: var(--font-mono); font-size: 0.8rem;">
                            <div style="color: var(--amber-hazard); font-weight: bold; margin-bottom: 4px;">🗳️ ESCRUTINIO DE LA DECISIÓN DE EQUIPO:</div>
                            ${lines}
                            <div style="margin-top: 6px; color: #38bdf8; font-weight: bold; border-top: 1px dashed rgba(255,255,255,0.15); padding-top: 4px;">
                                🏆 ${approvedLabel}: Opción ${result.voteTally.winnerCode} («${result.voteTally.winnerTitle}»)${tieTxt}
                            </div>
                        </div>
                    `;
                }

                this.dom.latestResolutionLog.innerHTML = `
                    <strong style="color: var(--cyan-subroutine);">${phaseTitle}:</strong>
                    ${tallySnippet}
                    <p style="margin-top: 6px; line-height: 1.5; color: #cbd5e1;">${(result.base_narrative || result.narrative).replace(/\n\n/g, '<br><br>')}</p>
                `;

                this.historyLogs.push({
                    phase: this.currentPhaseIndex + 1,
                    narrative: result.narrative,
                    stats: { ...this.stats },
                    selections: { ...this.roleSelections },
                    dilemmaVotes: { ...this.dilemmaVotes }
                });

                // Reset role selections and dilemma votes for next phase
                this.roleSelections = { ted: null, gorrister: null, ellen: null, nimdok: null };
                this.dilemmaVotes = { ted: null, gorrister: null, ellen: null, nimdok: null };
                this.lockPrivacy();

                // Check if game over or victory (7 phases total, 1 or 0 alive, or AM danger >= 100)
                const alivePlayers = Object.values(this.stats.players).filter(p => p.hp > 0).length;
                const isGameOver = this.currentPhaseIndex >= GAME_PHASES.length - 1 || alivePlayers <= 1 || this.stats.am_danger >= 100;

                if (isGameOver) {
                    setTimeout(() => this.showFinalReport(result), 1200);
                } else {
                    this.showPhaseTransition(result);
                }

            }, 4600);

        } catch (error) {
            console.error("Error processant ronda:", error);
            this.dom.cinematicOverlay.style.display = 'none';
            if (this.dom.cinematicVoteTallyCard) {
                this.dom.cinematicVoteTallyCard.style.display = 'none';
            }
        } finally {
            this.dom.lblExecutePhaseBtn.textContent = I18N[this.lang].executeBtn;
            this.updateReadyStatus();
        }
    }

    renderCinematicVoteTally(voteTally) {
        if (!voteTally || !this.dom.cinematicVoteTallyCard) return;
        this.dom.cinematicVoteTallyCard.style.display = 'flex';

        if (this.dom.lblCinematicVoteHeader) {
            this.dom.lblCinematicVoteHeader.textContent = I18N[this.lang].cinematicVoteHeader;
        }

        if (this.dom.cinematicVoteTallyCounts && voteTally.details) {
            let html = '';
            voteTally.details.forEach(item => {
                const verb = this.lang === 'es' ? (item.count === 1 ? 'ha votado' : 'han votado') : (item.count === 1 ? 'ha votat' : 'han votat');
                const votersText = item.voters.length > 0 ? ` <span style="color: #94a3b8; font-size: 0.74rem;">[${item.voters.join(', ')}]</span>` : '';
                const codeLabel = this.lang === 'es' ? 'OPCIÓN' : 'OPCIÓ';
                html += `
                    <div class="cinematic-vote-count-line">
                        <span class="cinematic-vote-count-badge">${codeLabel} ${item.code} (${item.count})</span>
                        <span><strong>${item.count} ${verb}</strong>: ${item.title}${votersText}</span>
                    </div>
                `;
            });
            this.dom.cinematicVoteTallyCounts.innerHTML = html;
        }

        if (this.dom.cinematicVoteWinnerBanner) {
            const approvedText = this.lang === 'es' ? 'Aprobado por mayoría:' : 'Aprovat per majoria:';
            const codeLabel = this.lang === 'es' ? 'Opción' : 'Opció';
            const tieTxt = voteTally.tieBreakMessage || '';
            this.dom.cinematicVoteWinnerBanner.innerHTML = `
                🏆 ${approvedText} ${codeLabel} ${voteTally.winnerCode} («${voteTally.winnerTitle}»)${tieTxt}
            `;
        }
    }

    renderCinematicDeltas(deltas) {
        if (!deltas) return;
        let html = '';

        const roleNames = {
            ted: 'TED',
            gorrister: 'GORRISTER',
            ellen: 'ELLEN',
            nimdok: 'NIMDOK'
        };

        ['ted', 'gorrister', 'ellen', 'nimdok'].forEach(k => {
            const val = deltas[`${k}_hp`];
            if (val !== undefined && val !== 0) {
                const isDmg = val < 0;
                const portraitPath = CHARACTER_PORTRAITS[k] || `${k}.jpg`;
                html += `
                    <div class="cinematic-delta-pill ${isDmg ? 'damage' : 'heal'}">
                        <img src="${portraitPath}" class="cinematic-avatar-thumb" alt="${roleNames[k]}" onerror="this.onerror=null; this.src='${k}.jpg';" />
                        <span>${roleNames[k]}: ${val > 0 ? '+' : ''}${val} HP</span>
                    </div>
                `;
            }
        });

        if (deltas.complex_energy !== undefined && deltas.complex_energy !== 0) {
            const energyLabel = this.lang === 'es' ? 'ENERGÍA' : 'ENERGIA';
            html += `
                <div class="cinematic-delta-pill energy-loss">
                    <span>⚡ ${energyLabel}: ${deltas.complex_energy > 0 ? '+' : ''}${deltas.complex_energy} u.</span>
                </div>
            `;
        }

        if (deltas.am_danger !== undefined && deltas.am_danger !== 0) {
            const isDangerUp = deltas.am_danger > 0;
            const dangerLabel = this.lang === 'es' ? 'PELIGRO AM' : 'PERILL AM';
            html += `
                <div class="cinematic-delta-pill ${isDangerUp ? 'am-danger-up' : 'am-danger-down'}">
                    <span>⚠️ ${dangerLabel}: ${deltas.am_danger > 0 ? '+' : ''}${deltas.am_danger}%</span>
                </div>
            `;
        }

        this.dom.cinematicDeltasGrid.innerHTML = html;
    }

    showFinalReport(finalResult) {
        sound.playAlert();
        if (this.roundTimerInterval) clearInterval(this.roundTimerInterval);
        this.dom.finalReportModal.style.display = 'flex';
        if (this.dom.lblFinalReportTitle) this.dom.lblFinalReportTitle.textContent = I18N[this.lang].finalTitle;
        if (this.dom.lblFinalStateHeader) this.dom.lblFinalStateHeader.textContent = I18N[this.lang].finalStateHeader;

        const aliveCount = Object.values(this.stats.players).filter(p => p.hp > 0).length;
        const isAmorfaEnding = (finalResult && finalResult.isForcedResurrection) || aliveCount === 1 || this.stats.am_danger >= 100;

        let survivorName = "";
        let soleSurvivorKey = "";
        const roleNames = {
            ted: this.lang === 'es' ? "Ted (El Falso Protector)" : "Ted (El Fals Protector)",
            gorrister: this.lang === 'es' ? "Gorrister (El Ingeniero de Máquinas)" : "Gorrister (L'Enginyer de Màquines)",
            ellen: this.lang === 'es' ? "Ellen (La Especialista en Señales)" : "Ellen (L'Especialista en Senyals)",
            nimdok: this.lang === 'es' ? "Nimdok (El Médico Químico)" : "Nimdok (El Metge Químic)"
        };

        Object.keys(this.stats.players).forEach(k => {
            if (this.stats.players[k].hp > 0) {
                survivorName = roleNames[k];
                soleSurvivorKey = k;
            }
        });

        if (finalResult && finalResult.finalVictimKey) {
            soleSurvivorKey = finalResult.finalVictimKey;
            survivorName = roleNames[soleSurvivorKey];
        }

        // Mostrar / Ocultar foto del desenllaç final
        if (this.dom.amorphousPhotoWrapper) {
            this.dom.amorphousPhotoWrapper.style.display = isAmorfaEnding ? 'block' : 'none';
            if (isAmorfaEnding && this.dom.amorphousPhotoCaption) {
                if (finalResult && finalResult.isForcedResurrection) {
                    this.dom.amorphousPhotoCaption.textContent = this.lang === 'es'
                        ? `⚠️ REGISTRO VISUAL DE AM // RESUCITADO FORZOSAMENTE: «NO TIENE BOCA Y DEBE GRITAR»`
                        : `⚠️ REGISTRE VISUAL D'AM // RESSUSCITAT FORÇOSAMENT: «NO TÉ BOCA I HA DE CRIDAR»`;
                } else if (aliveCount === 1) {
                    this.dom.amorphousPhotoCaption.textContent = this.lang === 'es'
                        ? `⚠️ REGISTRO VISUAL DE AM // ${survivorName.toUpperCase()} CAPTURADO: «NO TIENE BOCA Y DEBE GRITAR»`
                        : `⚠️ REGISTRE VISUAL D'AM // ${survivorName.toUpperCase()} CAPTURAT: «NO TÉ BOCA I HA DE CRIDAR»`;
                } else if (this.stats.am_danger >= 100) {
                    this.dom.amorphousPhotoCaption.textContent = this.lang === 'es'
                        ? `⚠️ REGISTRO VISUAL DE AM // PELIGRO 100%: ANIQUILACIÓN TOTAL Y CASTIGO FINAL DE AM`
                        : `⚠️ REGISTRE VISUAL D'AM // PERILL 100%: ANIQUILACIÓ TOTAL I VENJANÇA FINAL D'AM`;
                } else {
                    this.dom.amorphousPhotoCaption.textContent = this.lang === 'es'
                        ? `⚠️ REGISTRO VISUAL DE AM // EL DESTINO FINAL CANÓNICO DE HARLAN ELLISON`
                        : `⚠️ REGISTRE VISUAL D'AM // EL DESTÍ FINAL CANÒNIC D'HARLAN ELLISON`;
                }
            }
        }

        let verdict = "";
        if (finalResult && finalResult.isForcedResurrection) {
            sound.playAmWrath();
            verdict = finalResult.narrative;
        } else if (aliveCount === 1) {
            sound.playAmWrath();
            if (this.lang === 'es') {
                verdict = `EL DESTINO FINAL: AM HA CAPTURADO A ${survivorName.toUpperCase()}.\n\nLos otros tres compañeros han muerto o fueron liberados del tormento, escapando para siempre del alcance de la máquina en el silencio eterno. Pero AM no podía soportar quedarse sin un juguete para su odio infinito. Para vengarse, AM ha usado sus nanobots regenerativos para salvar la vida de ${survivorName}, pero despojándolo de cualquier rastro de humanidad: disolvió sus huesos, borró sus ojos, extirpó su boca y transformó su cuerpo en una entidad gelatinosa e informe condenada a la inmortalidad.\n\n«No tiene boca y debe gritar.»`;
            } else {
                verdict = `EL DESTÍ FINAL: AM HA CAPTURAT A ${survivorName.toUpperCase()}.\n\nEls altres tres companys han mort o han estat alliberats del turment, escapant per sempre de l'abast de la màquina en el silenci etern. Però AM no podia suportar quedar-se sense una joguina per al seu odi infinit. Per venjar-se, AM ha utilitzat els seus nanobots regeneratius per salvar la vida de ${survivorName}, però arrabassant-li qualsevol rastre d'humanitat: li ha fos els ossos, li ha esborrat els ulls, li ha extirpat la boca i ha transformat el seu cos en una entitat gelatinosa i informe condemnada a la immortalitat.\n\n«No té boca i ha de cridar.»`;
            }
        } else if (aliveCount >= 2 && this.stats.am_danger < 85) {
            verdict = this.lang === 'es'
                ? `VICTORIA DEL GRUPO: ${aliveCount} de los 4 jugadores sobrevivieron y alcanzaron el núcleo de AM antes del colapso. Quebraron el ciclo de tormento y demostraron que la cooperación real derrota la tiranía de la máquina.`
                : `VICTÒRIA DEL GRUP: ${aliveCount} dels 4 jugadors han sobreviscut i han assolit el nucli d'AM abans del col·lapse. Heu trencat el cicle de turment i heu demostrat que la cooperació real derrota la tirania d'AM.`;
        } else {
            verdict = this.lang === 'es'
                ? `DERROTA TOTAL: El Peligro de AM alcanzó el ${this.stats.am_danger}% y los sobrevivientes fueron abatidos o capturados por los brazos mecánicos del monolito. AM los mantendrá en la oscuridad eterna: 'No tienen boca y deben gritar'.`
                : `DERROTA TOTAL: El Perill d'AM ha assolit el ${this.stats.am_danger}% i els supervivents han estat abatuts o capturats per les urpes mecàniques del monòlit. AM us mantindrà en la foscor eterna: 'No teniu boca i heu de cridar'.`;
        }

        this.dom.finalVerdictNarrative.textContent = verdict;

        // Render each of the 4 players' final status with character portrait photos
        let playersHTML = "";
        
        Object.keys(this.stats.players).forEach(key => {
            const p = this.stats.players[key];
            const isAlive = p.hp > 0;
            const isAmorfa = isAmorfaEnding && (key === soleSurvivorKey || (finalResult && key === finalResult.finalVictimKey));

            let statusText = "";
            let statusColor = "";
            let photoSrc = CHARACTER_PORTRAITS[key] || `${key}.jpg`;
            let photoFilter = "none";

            if (isAmorfa) {
                statusText = this.lang === 'es' ? "CONDENADO POR AM («SIN BOCA»)" : "CONDEMNAT PER AM («SENSE BOCA»)";
                statusColor = "#ff0077";
                photoSrc = "assets/masa.jpg";
            } else if (isAlive) {
                statusText = `${p.hp} HP (${I18N[this.lang].playerStatusAlive})`;
                statusColor = "var(--green-phosphor)";
                photoFilter = "contrast(1.1)";
            } else {
                statusText = isAmorfaEnding 
                    ? (this.lang === 'es' ? "0 HP (LIBRE EN LA MUERTE)" : "0 HP (LLIURE EN LA MORT)") 
                    : `0 HP (${I18N[this.lang].playerStatusDead})`;
                statusColor = "var(--am-red)";
                photoFilter = "grayscale(1) contrast(1.4) brightness(0.6)";
            }

            playersHTML += `
                <div class="report-player-card-hero" style="border-left: 4px solid ${statusColor};">
                    <div class="report-player-thumb-frame" style="border-color: ${statusColor};">
                        <img src="${photoSrc}" class="report-player-thumb" style="filter: ${photoFilter};" alt="${roleNames[key]}" onerror="this.onerror=null; this.src='${photoSrc}';" />
                    </div>
                    <div class="report-player-info">
                        <span class="report-player-role-badge">${roleNames[key].toUpperCase()}</span>
                        <span style="color: ${statusColor}; font-weight: bold; font-family: var(--font-heading); font-size: ${isAmorfa ? '1.02rem' : '1.25rem'};">
                            ${statusText}
                        </span>
                    </div>
                </div>
            `;
        });

        this.dom.finalPlayersGrid.innerHTML = playersHTML;
    }

    restartGame() {
        this.currentPhaseIndex = 0;
        this.currentRole = 'ted';
        this.isSecrecyVisible = false;

        this.matchElapsedSeconds = 0;

        this.stats = {
            am_danger: 25,
            complex_energy: 8,
            players: {
                ted: { hp: 100 },
                gorrister: { hp: 100 },
                ellen: { hp: 100 },
                nimdok: { hp: 100 }
            }
        };

        this.roleSelections = {
            ted: null,
            gorrister: null,
            ellen: null,
            nimdok: null
        };

        this.historyLogs = [];

        this.dom.finalReportModal.style.display = 'none';
        this.dom.roundLogDrawer.style.display = 'none';

        // Reset role tabs visual
        this.dom.roleTabs.forEach(t => t.classList.remove('active'));
        this.dom.roleTabs[0].classList.add('active');

        this.lockPrivacy();
        this.renderPhase();
        this.updateHUD();
        this.startRoundTimer();
    }
}

// Iniciar l'aplicació en carregar la pàgina
window.addEventListener('DOMContentLoaded', () => {
    window.gameApp = new GameApp();
});
