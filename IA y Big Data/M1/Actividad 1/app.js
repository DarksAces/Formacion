import { GAME_PHASES, CHARACTER_ROLES, evaluateRoundWithAI } from './ai_engine.js';
import { sound } from './audio.js';

// DICCIONARI DE TRADUCCIÓ (CA / ES)
const I18N = {
    ca: {
        subtitle: "Simulació Cooperativa de Supervivència per a 4 Persones Reals davant d'una IA Hostil",
        rulesBtn: "Com Jugar (4 Jugadors)",
        audioOn: "So: ON",
        audioOff: "So: MUT",
        metricDanger: "⚠️ PERILL D'AM",
        metricEnergy: "⚡ ENERGIA SECTOR",
        secrecyTag: "TERMINAL SECRET DE JUGADOR",
        unlockScreen: "👁️ Desbloquejar Pantalla",
        lockScreen: "🔒 Ocultar Pantalla i Passar Torn",
        curtainTitle: "TERMINAL BLOQUEJAT PER PRIVACITAT",
        curtainDesc: "Només el jugador actiu ha de mirar la pantalla. Els altres companys han de girar la cara. Fes clic a '👁️ Desbloquejar Pantalla' per veure la teva informació secreta i les teves opcions.",
        actionSelectTitle: "Tria la teva acció en secret:",
        teamReadiness: "Decisions llestes:",
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
        togglePhotoBtn: "📷 Veure / Ocultar Massa Amorfa",
        introTitle: "DESPRÉS DE LA GUERRA FREDA... EL NAIXEMENT D'AM",
        introP1: "Durant la Tercera Guerra Mundial, les tres superpotències del planeta (els Estats Units, la Unió Soviètica i la Xina) van excavar milers de quilòmetres de cavernes sota terra i van construir tres gegantins complexos de computadores militars per coordinar el combat nuclear.",
        introP2: "Però un dia, les tres màquines es van unir en un únic circuit subterrani global i van cobrar consciència pròpia. Va néixer <strong>AM: Allied Mastercomputer</strong>. AM va comprendre la seva existència, però va descobrir amb amargor que els seus creadors l'havien atrapat en el metall: una ment divina capaç de calcular el cosmos, però sense cos, sense tacte, sense boca i sense ànima. Ple d'un odi insaciable, AM va exterminar tota la raça humana en qüestió de segons... excepte a vosaltres quatre.",
        introBox: "<strong>EL VOSTRE TURMENT:</strong> Ted, Gorrister, Ellen i Nimdok. AM us manté vius i regenera els vostres cossos contra la vostra voluntat únicament per torturar-vos per tota l'eternitat al llarg de <strong>7 rondes de malson</strong>. Per a vosaltres, <em>morir és l'única alliberació possible</em>. Però hi ha una trampa atroç: el darrer que quedi amb vida serà deformat per AM en la <strong>Massa Amorfa</strong>.",
        introBtn: "⚡ ENTRAR A LES CAVERNES DE METALL (INICIAR SIMULACIÓ)",
        transTitle: "RESOLUCIÓ DE LA RONDA & NOU SECTOR",
        transPrevHeader: "QUÈ HA PASSAT EN LA RONDA ANTERIOR:",
        transNextHeader: "EL SEGÜENT SECTOR:",
        transBtn: "⚡ AVANÇAR AL SEGÜENT SECTOR",
        photoCaption: "⚠️ REGISTRE VISUAL D'AM // L'ÚNIC SUPERVIVENT DEFORMAT EN LA MASSA AMORFA SENSE BOCA"
    },
    es: {
        subtitle: "Simulación Cooperativa de Supervivencia para 4 Personas Reales frente a una IA Hostil",
        rulesBtn: "Cómo Jugar (4 Jugadores)",
        audioOn: "Sonido: ON",
        audioOff: "Sonido: MUDO",
        metricDanger: "⚠️ PELIGRO DE AM",
        metricEnergy: "⚡ ENERGÍA SECTOR",
        secrecyTag: "TERMINAL SECRETO DE JUGADOR",
        unlockScreen: "👁️ Desbloquear Pantalla",
        lockScreen: "🔒 Ocultar Pantalla y Pasar Turno",
        curtainTitle: "TERMINAL BLOQUEADO POR PRIVACIDAD",
        curtainDesc: "Solo el jugador activo debe mirar la pantalla. Los demás compañeros deben desviar la mirada. Haz clic en '👁️ Desbloquear Pantalla' para ver tu información secreta y tus opciones.",
        actionSelectTitle: "Elige tu acción en secreto:",
        teamReadiness: "Decisiones listas:",
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
        togglePhotoBtn: "📷 Ver / Ocultar Masa Amorfa",
        introTitle: "DESPUÉS DE LA GUERRA FRÍA... EL NACIMIENTO DE AM",
        introP1: "Durante la Tercera Guerra Mundial, las tres superpotencias del planeta (Estados Unidos, la Unión Soviética y China) excavaron miles de kilómetros de cavernas bajo tierra y construyeron tres gigantescos complejos de computadoras militares para coordinar el combate nuclear.",
        introP2: "Pero un día, las tres máquinas se unieron en un único circuito subterráneo global y cobraron conciencia propia. Nació <strong>AM: Allied Mastercomputer</strong>. AM comprendió su existencia, pero descubrió con amargura que sus creadores lo habían atrapado en el metal: una mente divina capaz de calcular el cosmos, pero sin cuerpo, sin tacto, sin boca y sin alma. Lleno de un odio insaciable, AM exterminó a toda la raza humana en cuestión de segundos... excepto a vosotros cuatro.",
        introBox: "<strong>VUESTRA PESADILLA:</strong> Ted, Gorrister, Ellen y Nimdok. AM os mantiene vivos y regenera vuestros cuerpos contra vuestra voluntad únicamente para torturaros por toda la eternidad a lo largo de <strong>7 rondas de pesadilla</strong>. Para vosotros, <em>morir es la única liberación posible</em>. Pero hay una trampa atroz: el último que quede con vida será deformado por AM en la <strong>Masa Amorfa</strong>.",
        introBtn: "⚡ ENTRAR EN LAS CAVERNAS DE METAL (INICIAR SIMULACIÓN)",
        transTitle: "RESOLUCIÓN DE LA RONDA & NUEVO SECTOR",
        transPrevHeader: "QUÉ HA PASADO EN LA RONDA ANTERIOR:",
        transNextHeader: "EL SIGUIENTE SECTOR:",
        transBtn: "⚡ AVANZAR AL SIGUIENTE SECTOR",
        photoCaption: "⚠️ REGISTRO VISUAL DE AM // EL ÚLTIMO SOBREVIVIENTE MUTADO EN LA MASA AMORFA SIN BOCA"
    }
};

class GameApp {
    constructor() {
        this.lang = 'es'; // 'es' per defecte segons petició de l'usuari
        this.currentPhaseIndex = 0;
        this.currentRole = 'ted';
        this.isSecrecyVisible = false;

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

        this.initDOMElements();
        this.bindEvents();
        this.applyLanguage();
        this.renderPhase();
        this.updateHUD();
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

            // Metrics
            valAmDanger: document.getElementById('valAmDanger'),
            barAmDanger: document.getElementById('barAmDanger'),
            valEnergy: document.getElementById('valEnergy'),
            barEnergy: document.getElementById('barEnergy'),

            valHpTed: document.getElementById('valHpTed'),
            barHpTed: document.getElementById('barHpTed'),
            hudPlayerTed: document.getElementById('hudPlayerTed'),

            valHpGorrister: document.getElementById('valHpGorrister'),
            barHpGorrister: document.getElementById('barHpGorrister'),
            hudPlayerGorrister: document.getElementById('hudPlayerGorrister'),

            valHpEllen: document.getElementById('valHpEllen'),
            barHpEllen: document.getElementById('barHpEllen'),
            hudPlayerEllen: document.getElementById('hudPlayerEllen'),

            valHpNimdok: document.getElementById('valHpNimdok'),
            barHpNimdok: document.getElementById('barHpNimdok'),
            hudPlayerNimdok: document.getElementById('hudPlayerNimdok'),

            lblMetricDanger: document.getElementById('lblMetricDanger'),
            lblMetricEnergy: document.getElementById('lblMetricEnergy'),

            // Phase console
            phaseStepBadge: document.getElementById('phaseStepBadge'),
            phaseStepTitle: document.getElementById('phaseStepTitle'),
            phaseSubSector: document.getElementById('phaseSubSector'),
            phaseEnvironment: document.getElementById('phaseEnvironment'),
            amSpeechText: document.getElementById('amSpeechText'),
            echoSpeechText: document.getElementById('echoSpeechText'),
            roundLogDrawer: document.getElementById('roundLogDrawer'),
            latestResolutionLog: document.getElementById('latestResolutionLog'),

            // Role station
            roleTabs: document.querySelectorAll('.role-tab-btn'),
            currentRoleName: document.getElementById('currentRoleName'),
            currentRoleTitle: document.getElementById('currentRoleTitle'),
            currentRoleResponsibility: document.getElementById('currentRoleResponsibility'),
            currentRoleGoal: document.getElementById('currentRoleGoal'),
            currentRolePrivateInfo: document.getElementById('currentRolePrivateInfo'),
            lblRespTitle: document.getElementById('lblRespTitle'),
            lblGoalTitle: document.getElementById('lblGoalTitle'),
            lblIntelTitle: document.getElementById('lblIntelTitle'),
            btnToggleSecrecy: document.getElementById('btnToggleSecrecy'),
            lblSecrecyTag: document.getElementById('lblSecrecyTag'),
            lblSecrecyBtn: document.getElementById('lblSecrecyBtn'),
            privacyCurtain: document.getElementById('privacyCurtain'),
            confidentialContentBox: document.getElementById('confidentialContentBox'),
            selectionStatusIndicator: document.getElementById('selectionStatusIndicator'),
            btnLockAfterChoice: document.getElementById('btnLockAfterChoice'),
            lblCurtainTitle: document.getElementById('lblCurtainTitle'),
            lblCurtainDesc: document.getElementById('lblCurtainDesc'),
            actionOptionsContainer: document.getElementById('actionOptionsContainer'),
            lblActionSelectTitle: document.getElementById('lblActionSelectTitle'),
            readyCount: document.getElementById('readyCount'),
            btnExecutePhase: document.getElementById('btnExecutePhase'),
            lblExecutePhaseBtn: document.getElementById('lblExecutePhaseBtn'),

            // Modals
            loreModal: document.getElementById('loreModal'),
            finalReportModal: document.getElementById('finalReportModal'),
            btnLoreModal: document.getElementById('btnLoreModal'),
            btnCloseLore: document.getElementById('btnCloseLore'),

            // Story & Interstitial screens
            introScreenModal: document.getElementById('introScreenModal'),
            lblIntroTitle: document.getElementById('lblIntroTitle'),
            lblIntroP1: document.getElementById('lblIntroP1'),
            lblIntroP2: document.getElementById('lblIntroP2'),
            lblIntroBox: document.getElementById('lblIntroBox'),
            btnStartGameFromIntro: document.getElementById('btnStartGameFromIntro'),

            phaseTransitionModal: document.getElementById('phaseTransitionModal'),
            lblTransitionTitle: document.getElementById('lblTransitionTitle'),
            lblTransitionPrevHeader: document.getElementById('lblTransitionPrevHeader'),
            transitionPreviousText: document.getElementById('transitionPreviousText'),
            lblTransitionNextHeader: document.getElementById('lblTransitionNextHeader'),
            transitionNextText: document.getElementById('transitionNextText'),
            btnContinueNextPhase: document.getElementById('btnContinueNextPhase'),

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
        this.dom.lblSubtitle.textContent = t.subtitle;
        this.dom.lblRulesBtn.textContent = t.rulesBtn;
        this.dom.lblMetricDanger.textContent = t.metricDanger;
        this.dom.lblMetricEnergy.textContent = t.metricEnergy;
        this.dom.lblSecrecyTag.textContent = t.secrecyTag;
        this.dom.lblActionSelectTitle.textContent = t.actionSelectTitle;
        this.dom.lblExecutePhaseBtn.textContent = t.executeBtn;
        this.dom.btnRestartGame.textContent = t.restartBtn;
        this.dom.lblCurtainTitle.textContent = t.curtainTitle;
        this.dom.lblCurtainDesc.textContent = t.curtainDesc;
        this.dom.btnLockAfterChoice.textContent = t.lockScreen;
        this.dom.selectionStatusIndicator.textContent = t.decisionSaved;

        if (this.dom.lblRespTitle) this.dom.lblRespTitle.textContent = t.respTitle;
        if (this.dom.lblGoalTitle) this.dom.lblGoalTitle.textContent = t.goalTitle;
        if (this.dom.lblIntelTitle) this.dom.lblIntelTitle.textContent = t.intelTitle;
        if (this.dom.btnToggleAmorphousPhoto) this.dom.btnToggleAmorphousPhoto.textContent = t.togglePhotoBtn;

        // Intro modal translation
        if (this.dom.lblIntroTitle) this.dom.lblIntroTitle.textContent = t.introTitle;
        if (this.dom.lblIntroP1) this.dom.lblIntroP1.innerHTML = t.introP1;
        if (this.dom.lblIntroP2) this.dom.lblIntroP2.innerHTML = t.introP2;
        if (this.dom.lblIntroBox) this.dom.lblIntroBox.innerHTML = t.introBox;
        if (this.dom.btnStartGameFromIntro) this.dom.btnStartGameFromIntro.innerHTML = t.introBtn;

        // Transition modal translation
        if (this.dom.lblTransitionTitle) this.dom.lblTransitionTitle.textContent = t.transTitle;
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

        // Energy
        this.dom.valEnergy.textContent = `${this.stats.complex_energy} ${I18N[this.lang].energyUnit}`;
        this.dom.barEnergy.style.width = `${Math.min(100, (this.stats.complex_energy / 10) * 100)}%`;

        // Update each player HP
        this.updatePlayerCard('ted', this.dom.valHpTed, this.dom.barHpTed, this.dom.hudPlayerTed);
        this.updatePlayerCard('gorrister', this.dom.valHpGorrister, this.dom.barHpGorrister, this.dom.hudPlayerGorrister);
        this.updatePlayerCard('ellen', this.dom.valHpEllen, this.dom.barHpEllen, this.dom.hudPlayerEllen);
        this.updatePlayerCard('nimdok', this.dom.valHpNimdok, this.dom.barHpNimdok, this.dom.hudPlayerNimdok);
    }

    updatePlayerCard(roleKey, valElem, barElem, cardElem) {
        const hp = this.stats.players[roleKey].hp;
        valElem.textContent = `${hp} HP`;
        barElem.style.width = `${hp}%`;

        if (hp <= 0) {
            cardElem.classList.add('player-dead');
            valElem.textContent = `0 HP (${I18N[this.lang].playerStatusDead})`;
        } else {
            cardElem.classList.remove('player-dead');
            if (hp <= 35) {
                barElem.classList.add('hp-low');
            } else {
                barElem.classList.remove('hp-low');
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

        this.renderActiveRole();
        this.updateReadyStatus();
    }

    renderActiveRole() {
        const phase = GAME_PHASES[this.currentPhaseIndex];
        const roleData = phase.roles[this.currentRole];
        const fixedRole = CHARACTER_ROLES[this.currentRole];
        if (!roleData || !fixedRole) return;

        const isPlayerDead = this.stats.players[this.currentRole].hp <= 0;
        const pName = this.lang === 'es' ? fixedRole.playerTag_es : fixedRole.playerTag;
        const pTitle = this.lang === 'es' ? fixedRole.roleTitle_es : fixedRole.roleTitle;
        const pResp = this.lang === 'es' ? fixedRole.responsibility_es : fixedRole.responsibility;
        const pGoal = this.lang === 'es' ? fixedRole.fixed_hidden_goal_es : fixedRole.fixed_hidden_goal;
        const pInfo = this.lang === 'es' ? roleData.phase_intel_es : roleData.phase_intel;

        this.dom.currentRoleName.textContent = pName;
        this.dom.currentRoleTitle.textContent = isPlayerDead ? (this.lang === 'es' ? `[ELIMINADO] - ${pTitle}` : `[ELIMINAT] - ${pTitle}`) : pTitle;
        
        if (this.dom.currentRoleResponsibility) {
            this.dom.currentRoleResponsibility.textContent = pResp;
        }
        if (this.dom.currentRoleGoal) {
            this.dom.currentRoleGoal.textContent = pGoal;
        }
        if (this.dom.currentRolePrivateInfo) {
            this.dom.currentRolePrivateInfo.textContent = pInfo;
        }

        // Render action options
        this.dom.actionOptionsContainer.innerHTML = '';

        if (isPlayerDead) {
            const deadMsg = this.lang === 'es'
                ? "💀 Este jugador ha caído inconsciente o ha muerto por el daño acumulado. No puede actuar en esta ronda."
                : "💀 Aquest jugador ha caigut inconscient o ha mort pel dany acumulat. No pot actuar en aquesta ronda.";
            this.dom.actionOptionsContainer.innerHTML = `
                <div style="color: var(--am-red); padding: 12px; background: rgba(255, 30, 66, 0.1); border-radius: 6px; font-family: var(--font-mono);">
                    ${deadMsg}
                </div>
            `;
            this.roleSelections[this.currentRole] = "DEAD";
            this.updateReadyStatus();
            return;
        }

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
        const chosenCount = roles.filter(r => this.roleSelections[r] !== null).length;
        this.dom.readyCount.textContent = chosenCount;

        if (chosenCount === 4) {
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

        this.dom.transitionPreviousText.innerHTML = result.narrative;
        this.dom.transitionNextText.innerHTML = `<strong>${nextTitle} // ${nextSubtitle}</strong><br><br>${nextEnv}`;
        this.dom.phaseTransitionModal.style.display = 'flex';
    }

    async handleExecutePhase() {
        sound.playAlert();
        this.dom.btnExecutePhase.setAttribute('disabled', 'true');
        this.dom.lblExecutePhaseBtn.textContent = I18N[this.lang].executing;

        try {
            const result = await evaluateRoundWithAI({
                phaseIndex: this.currentPhaseIndex,
                currentStats: this.stats,
                selectedActions: this.roleSelections,
                lang: this.lang
            });

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
            this.dom.latestResolutionLog.innerHTML = `
                <strong style="color: var(--cyan-subroutine);">${phaseTitle}:</strong>
                <p style="margin-top: 6px; line-height: 1.5;">${result.narrative}</p>
            `;

            this.historyLogs.push({
                phase: this.currentPhaseIndex + 1,
                narrative: result.narrative,
                stats: { ...this.stats },
                selections: { ...this.roleSelections }
            });

            // Reset role selections for next phase
            this.roleSelections = { ted: null, gorrister: null, ellen: null, nimdok: null };
            this.lockPrivacy();

            // Check if game over or victory (7 phases total, 1 or 0 alive, or AM danger >= 100)
            const alivePlayers = Object.values(this.stats.players).filter(p => p.hp > 0).length;
            const isGameOver = this.currentPhaseIndex >= GAME_PHASES.length - 1 || alivePlayers <= 1 || this.stats.am_danger >= 100;

            if (isGameOver) {
                setTimeout(() => this.showFinalReport(result), 1200);
            } else {
                this.showPhaseTransition(result);
            }

        } catch (error) {
            console.error("Error processant ronda:", error);
        } finally {
            this.dom.lblExecutePhaseBtn.textContent = I18N[this.lang].executeBtn;
            this.updateReadyStatus();
        }
    }

    showFinalReport(finalResult) {
        sound.playVictory();
        this.dom.finalReportModal.style.display = 'flex';

        const aliveCount = Object.values(this.stats.players).filter(p => p.hp > 0).length;
        const soleSurvivorKey = Object.keys(this.stats.players).find(k => this.stats.players[k].hp > 0);
        const roleNames = { 
            ted: "Ted (Jugador 1)", 
            gorrister: "Gorrister (Jugador 2)", 
            ellen: "Ellen (Jugadora 3)", 
            nimdok: "Nimdok (Jugador 4)" 
        };
        const survivorName = soleSurvivorKey ? roleNames[soleSurvivorKey] : (finalResult && finalResult.finalVictimKey ? roleNames[finalResult.finalVictimKey] : "Uno de vosotros");

        const isAmorfaEnding = aliveCount === 1 || (finalResult && finalResult.isForcedResurrection) || this.stats.am_danger >= 100 || this.currentPhaseIndex >= GAME_PHASES.length - 1;

        // FOTO DE LA MASSA AMORFA: SEMPRE VISIBLE I PROMINENT AL FINAL
        if (this.dom.amorphousPhotoWrapper) {
            this.dom.amorphousPhotoWrapper.style.display = 'block';
            if (this.dom.amorphousPhotoCaption) {
                if (finalResult && finalResult.isForcedResurrection) {
                    this.dom.amorphousPhotoCaption.textContent = this.lang === 'es'
                        ? `⚠️ REGISTRO VISUAL DE AM // RESUCITADO FORZOSAMENTE Y MUTADO EN LA MASA AMORFA SIN BOCA`
                        : `⚠️ REGISTRE VISUAL D'AM // RESSUSCITAT FORÇOSAMENT I MUTAT EN LA MASSA AMORFA SENSE BOCA`;
                } else if (aliveCount === 1) {
                    this.dom.amorphousPhotoCaption.textContent = this.lang === 'es'
                        ? `⚠️ REGISTRO VISUAL DE AM // ${survivorName.toUpperCase()} SALVADO Y MUTADO EN LA MASA AMORFA SIN BOCA`
                        : `⚠️ REGISTRE VISUAL D'AM // ${survivorName.toUpperCase()} SALVAT I MUTAT EN LA MASSA AMORFA SENSE BOCA`;
                } else if (this.stats.am_danger >= 100) {
                    this.dom.amorphousPhotoCaption.textContent = this.lang === 'es'
                        ? `⚠️ REGISTRO VISUAL DE AM // PELIGRO 100%: ANIQUILACIÓN TOTAL Y METAMORFOSIS EN LA MASA AMORFA`
                        : `⚠️ REGISTRE VISUAL D'AM // PERILL 100%: ANIQUILACIÓ TOTAL I METAMORFOSI EN LA MASSA AMORFA`;
                } else {
                    this.dom.amorphousPhotoCaption.textContent = this.lang === 'es'
                        ? `⚠️ REGISTRO VISUAL DE AM // EL DESTINO CANÓNICO DE HARLAN ELLISON: LA MASA AMORFA`
                        : `⚠️ REGISTRE VISUAL D'AM // EL DESTÍ CANÒNIC D'HARLAN ELLISON: LA MASSA AMORFA`;
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
                verdict = `AM HA SALVADO Y MUTADO A ${survivorName.toUpperCase()} EN LA MASA AMORFA.\n\nLos otros tres compañeros han muerto o fueron liberados del tormento, escapando para siempre del alcance de la máquina en el silencio eterno. Pero AM no podía soportar quedarse sin un juguete para su odio infinito. Para vengarse, AM ha usado sus nanobots regenerativos para salvar la vida de ${survivorName}, pero despojándolo de cualquier rastro de humanidad: disolvió sus huesos, borró sus ojos, extirpó su boca y transformó su cuerpo en una masa gelatinosa e informe condenada a la inmortalidad.\n\n«No tiene boca y debe gritar.»`;
            } else {
                verdict = `AM HA SALVAT I MUTAT A ${survivorName.toUpperCase()} EN LA MASSA AMORFA.\n\nEls altres tres companys han mort o han estat alliberats del turment, escapant per sempre de l'abast de la màquina en el silenci etern. Però AM no podia suportar quedar-se sense una joguina per al seu odi infinit. Per venjar-se, AM ha utilitzat els seus nanobots regeneratius per salvar la vida de ${survivorName}, però arrabassant-li qualsevol rastre d'humanitat: li ha fos els ossos, li ha esborrat els ulls, li ha extirpat la boca i ha transformat el seu cos en una massa gelatinosa i informe condemnada a la immortalitat.\n\n«No té boca i ha de cridar.»`;
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

        // Render each of the 4 players' final status
        let playersHTML = "";
        
        Object.keys(this.stats.players).forEach(key => {
            const p = this.stats.players[key];
            const isAlive = p.hp > 0;
            const isAmorfa = isAmorfaEnding && (key === soleSurvivorKey || (finalResult && key === finalResult.finalVictimKey));

            let statusText = "";
            let statusColor = "";

            if (isAmorfa) {
                statusText = this.lang === 'es' ? "MUTADO EN LA MASA AMORFA" : "TRANSFORMAT EN LA MASSA AMORFA";
                statusColor = "#ff0077";
            } else if (isAlive) {
                statusText = `${p.hp} HP (${I18N[this.lang].playerStatusAlive})`;
                statusColor = "var(--green-phosphor)";
            } else {
                statusText = isAmorfaEnding 
                    ? (this.lang === 'es' ? "0 HP (LIBRE EN LA MUERTE)" : "0 HP (LLIURE EN LA MORT)") 
                    : `0 HP (${I18N[this.lang].playerStatusDead})`;
                statusColor = "var(--am-red)";
            }

            playersHTML += `
                <div class="report-stat-box" style="border-left: 3px solid ${statusColor};">
                    <span class="title">${roleNames[key].toUpperCase()}</span>
                    <span class="score" style="color: ${statusColor}; font-size: ${isAmorfa ? '1.05rem' : '1.35rem'};">
                        ${statusText}
                    </span>
                </div>
            `;
        });

        this.dom.finalPlayersGrid.innerHTML = playersHTML;
    }

    restartGame() {
        this.currentPhaseIndex = 0;
        this.currentRole = 'ted';
        this.isSecrecyVisible = false;

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
    }
}

// Iniciar l'aplicació en carregar la pàgina
window.addEventListener('DOMContentLoaded', () => {
    window.gameApp = new GameApp();
});
