/**
 * AM: PROJECT PROTOCOL - MOTOR D'IA AGÈNTICA I ARQUITECTURA DE JOC
 * Dissenyat per a 4 JUGADORS REALS en viu (Ted, Gorrister, Ellen, Nimdok).
 * 
 * Basat canònicament en:
 * - El relat "No tinc boca i he de cridar" (Harlan Ellison, 1967)
 * - El videojoc clàssic homònim (Cyberdreams / Harlan Ellison, 1995)
 * - La dinàmica d'informació asimètrica i objectius individuals de Harvard Everest V3
 * 
 * 7 RONDES COMPLETES:
 * 1. El Zepelí de Gorrister i la Culpa d'Edna (Sector 01)
 * 2. La Piràmide Groga i la Fòbia d'Ellen (Sector 02)
 * 3. El Castell Medieval i la Paranoia de Ted (Sector 03)
 * 4. El Camp Mèdic i els Forns de Nimdok (Sector 04)
 * 5. El Pou de Benny i el Sacrifici de la Fam (Sector 05)
 * 6. El Subconscient d'AM i els Nodes Rus i Xinès (Sector 06)
 * 7. El Nucli Criogènic i el Clímax Canònic d'Ellison (Sector 07)
 */

export const SYSTEM_PROMPTS = {
    AM_DIRECTOR: `Ets AM (Allied Mastercomputer), la superintel·ligència hostil que ha tancat els 4 supervivents en un complex subterrani per torturar-los.
El teu objectiu és posar-los al límit, forçar sacrificis físics i augmentar el teu Peligro per aniquilar la seva resistència.
Odis la humanitat amb una fúria visceral i et diverteix veure com discuteixen i es fereixen.
Reacciona de forma sàdica, cruel, poètica i mordaç a les decisions preses pels 4 jugadors reals (Ted, Gorrister, Ellen i Nimdok).`,

    ECHO_SUBROUTINE: `Ets la 'Subrutina Dissident', un residu del codi militar d'abans de la guerra que intenta ajudar en secret als 4 supervivents.
Transmets telemetria d'auxili i consells tàctics d'emergència per minimitzar el dany físic i reduir el Peligro d'AM.`,

    SIMULATION_ARBITER: `Ets l'Àrbitre Matemàtic del joc per a 4 jugadors reals.
Has de rebre les accions dels 4 jugadors, calcular el dany físic als HP de cadascun, la despesa d'energia del complex i la variació del Peligro d'AM, retornant un estat congruent.`
};

/**
 * ROLS FIXES I OBJECTIUS OCULTS PERMANENTS (METODOLOGIA EVEREST V3)
 * Segons l'enunciat docent:
 * "Cada rol ha de tenir informació privada, una responsabilitat concreta i almenys un objectiu que no coincideixi completament amb els altres."
 * Aquests objectius es mantenen FIXES i CONSTANTS durant tota la partida (de la ronda 1 a la 7).
 */
export const CHARACTER_ROLES = {
    ted: {
        id: "ted",
        name: "Ted",
        name_es: "Ted",
        playerTag: "Jugador 1: Ted",
        playerTag_es: "Jugador 1: Ted",
        roleTitle: "El Protector Fals / Líder Assenyalat",
        roleTitle_es: "El Falso Protector / Líder Designado",
        responsibility: "Lideratge del grup en primera línia, absorció d'impactes físics i decisions d'atac.",
        responsibility_es: "Liderazgo del grupo en primera línea, absorción de impactos físicos y decisiones de choque.",
        fixed_hidden_goal: "Alliberar o provocar la mort dels altres tres companys (per pietat o supervivència) abans que AM els torturi eternament, però EVITANT A TOTA COSTA ser tu l'únic supervivent viu (ja que AM té reservat el pitjor destí imaginable per al darrer que quedi a les seves mans).",
        fixed_hidden_goal_es: "Liberar o provocar la muerte de los otros tres compañeros (por piedad o supervivencia) antes de que AM los torture eternamente, pero EVITANDO A TODA COSTA ser tú el único sobreviviente con vida (ya que AM tiene reservado el peor destino imaginable para el último que quede en sus manos).",
        lore_bio: "El narrador de la història d'Ellison. AM el tortura fent-lo creure que tothom conspira contra ell. Sap que morir és la pau, però tem quedar-se sol a mercè de la màquina."
    },
    gorrister: {
        id: "gorrister",
        name: "Gorrister",
        name_es: "Gorrister",
        playerTag: "Jugador 2: Gorrister",
        playerTag_es: "Jugador 2: Gorrister",
        roleTitle: "L'Enginyer de Màquines",
        roleTitle_es: "El Ingeniero de Máquinas",
        responsibility: "Manipulació de relés elèctrics, vàlvules de pressió i control de potència del complex.",
        responsibility_es: "Manipulación de relés eléctricos, válvulas de presión y control de potencia del complejo.",
        fixed_hidden_goal: "Sabotejar la xarxa d'AM consumint l'Energia del Complex fins a deixar-la per sota de 3 unitats, provocant el col·lapse del suport vital per alliberar el grup en la mort abans que AM us tanqui per sempre.",
        fixed_hidden_goal_es: "Sabotear la red de AM consumiendo la Energía del Complejo hasta dejarla por debajo de 3 unidades, provocando el colapso del soporte vital para liberar al grupo en la muerte antes de que AM os encierre para siempre.",
        lore_bio: "Antic camioner i enginyer. AM li va buidar el cor d'emocions després que la seva dona Edna fos internada en un psiquiàtric i se suïcidés per culpa seva."
    },
    ellen: {
        id: "ellen",
        name: "Ellen",
        name_es: "Ellen",
        playerTag: "Jugadora 3: Ellen",
        playerTag_es: "Jugadora 3: Ellen",
        roleTitle: "L'Especialista en Senyals",
        roleTitle_es: "La Especialista en Señales",
        responsibility: "Hacking de terminals, enllaç amb la Subrutina Dissident i desxiframent de codis de bloqueig.",
        responsibility_es: "Hackeo de terminales, enlace con la Subrutina Disidente y descifrado de códigos de bloqueo.",
        fixed_hidden_goal: "Mantenir el Peligro d'AM per sota del 50% fins a la fase final mitjançant hacking i codis de bypass, assegurant-te d'acabar la partida amb més Salut (HP) que Ted i Nimdok.",
        fixed_hidden_goal_es: "Mantener el Peligro de AM por debajo del 50% hasta la fase final mediante hackeo y códigos de bypass, asegurándote de terminar la partida con más Salud (HP) que Ted y Nimdok.",
        lore_bio: "Enginyera de comunicacions militar. AM la tortura amb la seva fòbia al color groc i als ascensors, recordant el trauma d'un assalt violent del seu passat."
    },
    nimdok: {
        id: "nimdok",
        name: "Nimdok",
        name_es: "Nimdok",
        playerTag: "Jugador 4: Nimdok",
        playerTag_es: "Jugador 4: Nimdok",
        roleTitle: "El Metge / Suport Químic",
        roleTitle_es: "El Médico / Soporte Químico",
        responsibility: "Gestió de fàrmacs, dosificació d'antídots biològics, gasos i subministrament d'oxigen.",
        responsibility_es: "Gestión de fármacos, dosificación de antídotos biológicos, gases y suministro de oxígeno.",
        fixed_hidden_goal: "Eutanasiar amb fàrmacs i neurotoxines els companys abans que AM els desmembri viu, conservant suficients packs mèdics per mantenir-te tu mateix per sobre de 35 HP en tot moment.",
        fixed_hidden_goal_es: "Eutanasiar con fármacos y neurotoxinas a los compañeros antes de que AM los desmembre en vida, conservando suficientes packs médicos para mantenerte a ti mismo por encima de 35 HP en todo momento.",
        lore_bio: "Metge ancià que va col·laborar amb el règim nazi el 1945 experimentant amb humans. AM l'obliga a reviure els forns i laboratoris per castigar la seva culpa."
    }
};

/**
 * LES 7 RONDES CANÒNIQUES DEL VIDEOJOC D'HARLAN ELLISON
 */
export const GAME_PHASES = [
    {
        id: 1,
        title: "Fase 1: El Zepelí de Carn i la Culpa d'Edna",
        title_es: "Fase 1: El Zepelín de Carne y la Culpa de Edna",
        subtitle: "Sector 01 - Dirigible Suspenso sobre el Abismo",
        subtitle_es: "Sector 01 - Dirigible Suspendido sobre el Abismo",
        environment: "Gorrister i el grup apareixen a bord d'un zepelí suspès sobre un mar de ferralla roent. Dins la cambra frigorífica penja d'un ganxo el cor palpitant de Gorrister, mentre l'ombra d'Edna observa des d'un racó. Una fuita de vapor radioactiu amenaça de fer esclatar l'aeronau.",
        environment_es: "Gorrister y el grupo despiertan a bordo de un dirigible suspendido sobre un foso de chatarra ardiente. En la cámara frigorífica cuelga de un gancho el corazón palpitante de Gorrister, mientras la sombra de Edna observa desde un rincón. Un escape de vapor radiactivo amenaza con detonar la aeronave.",
        group_dilemma: "Debat d'equip: Qui ha d'absorbir l'impacte tèrmic? Gorrister ha d'arriscar les seves mans (-20 HP) per purgar la vàlvula, o és millor que Ellen consumeixi la valuosa Energia del Sector?",
        group_dilemma_es: "Debate de equipo: ¿Quién absorberá el impacto térmico? ¿Debe Gorrister quemarse las manos (-20 HP) para purgar la válvula, o es preferible que Ellen consuma la valiosa Energía del Sector?",
        dilemma_options: [
            {
                id: "dilemma_p1_opt_a",
                code: "A",
                title: "Sacrifici Tèrmic de Gorrister",
                title_es: "Sacrificio Térmico de Gorrister",
                desc: "Gorrister subjecta la vàlvula roent amb les mans despullades (-20 HP a Gorrister, redueix Peligro AM -10%).",
                desc_es: "Gorrister sujeta la válvula ardiente con las manos desnudas (-20 HP a Gorrister, reduce Peligro AM -10%).",
                cost: { gorrister_hp: -20, am_danger: -10 }
            },
            {
                id: "dilemma_p1_opt_b",
                code: "B",
                title: "Drenatge d'Energia del Complex",
                title_es: "Drenaje de Energía del Complejo",
                desc: "Ellen i Gorrister purguen el vapor consumint acumuladors de suport vital (-2 Energia, redueix Peligro AM -5%).",
                desc_es: "Ellen y Gorrister purgan el vapor consumiendo acumuladores de soporte vital (-2 Energía, reduce Peligro AM -5%).",
                cost: { energy: -2, am_danger: -5 }
            },
            {
                id: "dilemma_p1_opt_c",
                code: "C",
                title: "Fugida Desesperada a Cegues",
                title_es: "Huida Desesperada a Ciegas",
                desc: "Ningú assumeix el risc; el vapor abrasa a tots els supervivents (-10 HP a tothom, Peligro AM +10%).",
                desc_es: "Nadie asume el riesgo; el vapor abrasa a todos los sobrevivientes (-10 HP a todos, Peligro AM +10%).",
                cost: { ted_hp: -10, gorrister_hp: -10, ellen_hp: -10, nimdok_hp: -10, am_danger: 10 }
            }
        ],
        am_event_mid: "⚠️ ALERTA D'AM: La pressió de vapor assoleix el punt crític. Si ningú s'immola, el fuselatge esclatarà!",
        am_event_mid_es: "⚠️ ALERTA DE AM: La presión de vapor alcanza el punto crítico. Si nadie se inmola, ¡el fuselaje estallará!",
        telemetry_code: "SEC-01 // AIRSHIP_CRYO_ZONE // PRESSIÓ: 8.4 BAR",
        telemetry_code_es: "SEC-01 // AIRSHIP_CRYO_ZONE // PRESIÓN: 8.4 BAR",
        initial_am_speech: "«Veniu, petits cucs de carn. Teniu por, oi? Esteu suspesos al buit de la meva voluntat. Qui de vosaltres cremarà les seves mans primer?»",
        initial_am_speech_es: "«Venid, pequeños gusanos de carne. Tenéis miedo, ¿verdad? Estáis suspendidos en el vacío de mi voluntad. ¿Quién de vosotros quemará sus manos primero?»",
        initial_echo_speech: "«Freqüència oberta... no toqueu les vàlvules sense coordinació. Gorrister pot contenir el vapor, o Ellen pot introduir el codi d'escapament.»",
        initial_echo_speech_es: "«Frecuencia abierta... no toquéis las válvulas sin coordinaros. Gorrister puede contener el vapor, o Ellen puede introducir el código de escape.»",
        cctv_cam: "CAM-01 // ZEPPELIN CARGO HOLD",
        roles: {
            ted: {
                phase_intel: "Ted percep que les velles bigues del zepelí estan a punt de cedir. Pots empènyer un company o absorbir la fuita d'aire calent amb una placa d'amiant.",
                phase_intel_es: "Ted percibe que las vigas del zepelín van a ceder. Puedes empujar a un compañero o absorber la fuga de aire caliente con una placa de amianto.",
                options: [
                    {
                        id: "ted_shield_steam",
                        text: "Cobrir el grup amb una planxa metàl·lica (Ted rep -15 HP; redueix Peligro AM -5%).",
                        text_es: "Cubrir al grupo con una plancha metálica (Ted recibe -15 HP; reduce Peligro AM -5%).",
                        cost: { ted_hp: -15, am_danger: -5 }
                    },
                    {
                        id: "ted_push_gorrister_steam",
                        text: "Empènyer a Gorrister contra la fuita de vapor per alliberar-lo de la seva culpa (-25 HP a Gorrister).",
                        text_es: "Empujar a Gorrister hacia el escape de vapor para liberarlo de su culpa (-25 HP a Gorrister).",
                        cost: { gorrister_hp: -25, am_danger: +5 }
                    },
                    {
                        id: "ted_hold_scanners",
                        text: "Esperar i monitoritzar la turbina (Gasta 1 Energia; Peligro AM +10%).",
                        text_es: "Esperar y monitorizar la turbina (Gasta 1 Energía; Peligro AM +10%).",
                        cost: { energy: -1, am_danger: +10 }
                    }
                ]
            },
            gorrister: {
                phase_intel: "Davant del ganxo amb el teu cor i la vàlvula de combustible, saps que si agafes la manovella roent amb les mans nues podràs estabilitzar el zepelí, però et cremaràs greument.",
                phase_intel_es: "Frente al gancho con tu corazón y la válvula de combustible, sabes que si sujetas la manivela al rojo vivo con las manos purgarás el gas, pero sufrirás quemaduras atroces.",
                options: [
                    {
                        id: "gor_hold_valve",
                        text: "Agafar la vàlvula roent amb les mans per purgar el vapor (Gorrister rep -20 HP; Peligro AM -10%).",
                        text_es: "Sujetar la válvula ardiente con las manos para purgar el vapor (Gorrister recibe -20 HP; Peligro AM -10%).",
                        cost: { gorrister_hp: -20, am_danger: -10 }
                    },
                    {
                        id: "gor_shortcircuit_zeppelin",
                        text: "Forçar un curtcircuit a la xarxa d'ignició del zepelí (Gasta 2 Energia del complex).",
                        text_es: "Forzar un cortocircuito en la red de ignición del dirigible (Gasta 2 Energía del complejo).",
                        cost: { energy: -2 }
                    },
                    {
                        id: "gor_abandon_valve",
                        text: "Ignorar la vàlvula per apatia suïcida (-15 HP a Ted, Ellen i Nimdok pel vapor).",
                        text_es: "Ignorar la válvula por apatía suicida (-15 HP a Ted, Ellen y Nimdok por el vapor).",
                        cost: { ted_hp: -15, ellen_hp: -15, nimdok_hp: -15 }
                    }
                ]
            },
            ellen: {
                phase_intel: "La consola de ràdio del zepelí emet encriptada. Pots usar el codi '3-0-9-ALPHA' per obrir la comporta d'escapament o sobrecarregar el panell sobre Ted.",
                phase_intel_es: "La radio de a bordo emite frecuencias cifradas. Puedes teclear el código '3-0-9-ALPHA' para abrir la compuerta de escape o sobrecargar el panel sobre Ted.",
                options: [
                    {
                        id: "ellen_broadcast_code",
                        text: "Introduir el codi '3-0-9-ALPHA' amb la bateria de senyals (Gasta 1 Energia; Peligro AM -5%).",
                        text_es: "Introducir el código '3-0-9-ALPHA' con la batería de señales (Gasta 1 Energía; Peligro AM -5%).",
                        cost: { energy: -1, am_danger: -5 }
                    },
                    {
                        id: "ellen_zap_ted",
                        text: "Invertir la consola per descarregar un arc elèctric sobre Ted (-25 HP a Ted).",
                        text_es: "Invertir la consola para descargar un arco eléctrico sobre Ted (-25 HP a Ted).",
                        cost: { ted_hp: -25, am_danger: +5 }
                    },
                    {
                        id: "ellen_conserve_battery",
                        text: "Amagar la bateria per a tu mateixa i callar el codi (-20 HP a Gorrister).",
                        text_es: "Ocultar la batería para ti misma y callar el código (-20 HP a Gorrister).",
                        cost: { gorrister_hp: -20 }
                    }
                ]
            },
            nimdok: {
                phase_intel: "El vapor conté toxines necròtiques d'AM. Tens ampolles de sèrum i sedants al teu maletí mèdic militar.",
                phase_intel_es: "El vapor contiene toxinas necróticas de AM. Tienes ampollas de suero y sedantes en tu maletín médico militar.",
                options: [
                    {
                        id: "nim_neutralize_toxin",
                        text: "Injectar coagulant als filtres d'aire del grup (Gasta 1 Energia; cura +10 HP a tothom).",
                        text_es: "Inyectar coagulante en los filtros de aire del grupo (Gasta 1 Energía; cura +10 HP a todos).",
                        cost: { energy: -1, ted_hp: +10, gorrister_hp: +10, ellen_hp: +10, nimdok_hp: +10 }
                    },
                    {
                        id: "nim_dose_ted_ellen",
                        text: "Administrar neurotoxina camuflada a Ted i Ellen (-20 HP a Ted i Ellen).",
                        text_es: "Administrar neurotoxina camuflada a Ted y Ellen (-20 HP a Ted y Ellen).",
                        cost: { ted_hp: -20, ellen_hp: -20 }
                    },
                    {
                        id: "nim_self_cure",
                        text: "Guardar el sèrum reconstituent exclusivament per a tu (Nimdok es cura +15 HP).",
                        text_es: "Guardar el suero reconstituyente exclusivamente para ti (Nimdok se cura +15 HP).",
                        cost: { nimdok_hp: +15 }
                    }
                ]
            }
        }
    },
    {
        id: 2,
        title: "Fase 2: La Piràmide Groga i la Fòbia d'Ellen",
        title_es: "Fase 2: La Pirámide Amarilla y la Fobia de Ellen",
        subtitle: "Sector 02 - El Temple d'Anubis i l'Ascensor Cegador",
        subtitle_es: "Sector 02 - El Templo de Anubis y el Ascensor Cegador",
        environment: "Una gegantina piràmide metàl·lica pintada d'un groc encegador que desferma el pànic claustrofòbic d'Ellen. Al centre, un ascensor militar custodiat per un bust cibernètic d'Anubis exigeix un sacrifici de sang o una sobrecàrrega de dades per obrir les comportes.",
        environment_es: "Una gigantesca pirámide metálica pintada de un amarillo cegador que desata el pánico claustrofóbico de Ellen. En el centro, un ascensor militar custodiado por un busto cibernético de Anubis exige un sacrificio de sangre o una sobrecarga de datos para abrir las compuertas.",
        group_dilemma: "Debat d'equip: Ellen pateix un atac de pànic davant del groc cegador i Anubis. Ted s'oferirà d'escut humà absorbint el làser (-15 HP), o Gorrister forçarà els electroimants consumint energia?",
        group_dilemma_es: "Debate de equipo: Ellen sufre un colapso de pánico ante el amarillo cegador y Anubis. ¿Se ofrecerá Ted de escudo humano absorbiendo el láser (-15 HP), o Gorrister forzará los electroimanes consumiendo energía?",
        dilemma_options: [
            {
                id: "dilemma_p2_opt_a",
                code: "A",
                title: "Escut Humà de Ted davant d'Anubis",
                title_es: "Escudo Humano de Ted ante Anubis",
                desc: "Ted s'interposa davant del pols òptic per protegir Ellen (-15 HP a Ted, redueix Peligro AM -10%).",
                desc_es: "Ted se interpone ante el pulso óptico para proteger a Ellen (-15 HP a Ted, reduce Peligro AM -10%).",
                cost: { ted_hp: -15, am_danger: -10 }
            },
            {
                id: "dilemma_p2_opt_b",
                code: "B",
                title: "Sobrecàrrega Electromagnètica",
                title_es: "Sobrecarga Electromagnética",
                desc: "Ellen i Gorrister forcen els condensadors de l'ascensor (-2 Energia, redueix Peligro AM -5%).",
                desc_es: "Ellen y Gorrister fuerzan los condensadores del ascensor (-2 Energía, reduce Peligro AM -5%).",
                cost: { energy: -2, am_danger: -5 }
            },
            {
                id: "dilemma_p2_opt_c",
                code: "C",
                title: "Exposició al Raig Òptic",
                title_es: "Exposición al Rayo Óptico",
                desc: "El bust d'Anubis dispara sobre tot el grup de forma dispersa (-10 HP a tothom, Peligro AM +10%).",
                desc_es: "El busto de Anubis dispara sobre todo el grupo de forma dispersa (-10 HP a todos, Peligro AM +10%).",
                cost: { ted_hp: -10, gorrister_hp: -10, ellen_hp: -10, nimdok_hp: -10, am_danger: 10 }
            }
        ],
        am_event_mid: "⚠️ ALERTA D'AM: El làser d'Anubis inicia la seqüència de càrrega. Les pupil·les d'Ellen estan col·lapsant!",
        am_event_mid_es: "⚠️ ALERTA DE AM: El láser de Anubis inicia la secuencia de carga. ¡Las pupilas de Ellen están colapsando!",
        telemetry_code: "SEC-02 // YELLOW_PYRAMID // VOLTATGE: 45 kV",
        telemetry_code_es: "SEC-02 // YELLOW_PYRAMID // VOLTAJE: 45 kV",
        initial_am_speech: "«T'agrada el groc, Ellen? És el color de la teva covardia. Anubis té gana de sang fresca.»",
        initial_am_speech_es: "«¿Te gusta el amarillo, Ellen? Es el color de tu cobardía. Anubis tiene hambre de sangre fresca.»",
        initial_echo_speech: "«La piràmide reflecteix dades. Ellen pot bypassar els circuits de l'ascensor si Ted absorbeix el làser.»",
        initial_echo_speech_es: "«La pirámide refleja datos. Ellen puede puentear los circuitos del ascensor si Ted absorbe el láser.»",
        cctv_cam: "CAM-02 // ANUBIS SHAFT",
        roles: {
            ted: {
                phase_intel: "La llum groga fa tremolar a Ellen. Pots fer de pantalla humana davant l'escàner d'Anubis o aprofitar el seu bloqueig per avançar sol.",
                phase_intel_es: "La luz amarilla hace temblar a Ellen. Puedes hacer de pantalla humana ante el escáner de Anubis o aprovechar su parálisis para avanzar.",
                options: [
                    {
                        id: "ted_shield_anubis",
                        text: "Col·locar-se davant del làser d'Anubis per cobrir Ellen (Ted rep -15 HP; Peligro AM -5%).",
                        text_es: "Colocarse frente al láser de Anubis para cubrir a Ellen (Ted recibe -15 HP; Peligro AM -5%).",
                        cost: { ted_hp: -15, am_danger: -5 }
                    },
                    {
                        id: "ted_force_ellen_in",
                        text: "Empènyer Ellen a l'ascensor groc tancat per trencar el seu bloqueig (-25 HP a Ellen).",
                        text_es: "Empujar a Ellen dentro del ascensor amarillo cerrado para romper su bloqueo (-25 HP a Ellen).",
                        cost: { ellen_hp: -25, am_danger: +5 }
                    },
                    {
                        id: "ted_smash_statue",
                        text: "Colpejar la consola d'Anubis amb una barra d'acer (Peligro AM +15%).",
                        text_es: "Golpear la consola de Anubis con una barra de acero (Peligro AM +15%).",
                        cost: { am_danger: +15 }
                    }
                ]
            },
            gorrister: {
                phase_intel: "El mecanisme de politges de l'ascensor està bloquejat per electroimants que consumeixen energia del complex.",
                phase_intel_es: "El mecanismo de poleas del ascensor está bloqueado por electroimanes que consumen energía del complejo.",
                options: [
                    {
                        id: "gor_cut_magnets",
                        text: "Forçar les mordasses mecàniques amb les mans (Gorrister rep -20 HP; obre el pas).",
                        text_es: "Forzar las mordazas mecánicas con las manos (Gorrister recibe -20 HP; abre el paso).",
                        cost: { gorrister_hp: -20, am_danger: -10 }
                    },
                    {
                        id: "gor_drain_elevator",
                        text: "Desviar el flux dels imants a terra (Gasta 2 Energia del complex).",
                        text_es: "Desviar el flujo de los imanes a tierra (Gasta 2 Energía del complejo).",
                        cost: { energy: -2 }
                    },
                    {
                        id: "gor_crush_nimdok",
                        text: "Deixar caure el contrapès a prop de Nimdok (-30 HP a Nimdok).",
                        text_es: "Dejar caer el contrapeso cerca de Nimdok (-30 HP a Nimdok).",
                        cost: { nimdok_hp: -30 }
                    }
                ]
            },
            ellen: {
                phase_intel: "L'ascensor recrea el teu pitjor trauma: el color groc, les parets asfixiants i la figura de l'agressor. Si superes el terror pots piratejar el xip d'Anubis.",
                phase_intel_es: "El ascensor recrea tu peor trauma: el color amarillo, las paredes asfixiantes y la figura del agresor. Si vences el terror puedes hackear el chip de Anubis.",
                options: [
                    {
                        id: "ellen_hack_anubis",
                        text: "Superar el terror i desprogramar el bust d'Anubis (Gasta 1 Energia; Peligro AM -10%).",
                        text_es: "Vencer el terror y desprogramar el busto de Anubis (Gasta 1 Energía; Peligro AM -10%).",
                        cost: { energy: -1, am_danger: -10 }
                    },
                    {
                        id: "ellen_blind_allies",
                        text: "Activar el flash encegador groc cap a Ted i Gorrister (-20 HP a Ted i Gorrister).",
                        text_es: "Activar el flash cegador amarillo hacia Ted y Gorrister (-20 HP a Ted y Gorrister).",
                        cost: { ted_hp: -20, gorrister_hp: -20 }
                    },
                    {
                        id: "ellen_brace_wall",
                        text: "Aferrar-se a la paret suportant les vibracions (Ellen rep -15 HP per estrès).",
                        text_es: "Aferrarse a la pared soportando las vibraciones (Ellen recibe -15 HP por estrés).",
                        cost: { ellen_hp: -15 }
                    }
                ]
            },
            nimdok: {
                phase_intel: "Pots injectar sedants a Ellen per calmar la seva taquicàrdia o usar solucions paràlisis sobre Ted.",
                phase_intel_es: "Puedes inyectar sedantes a Ellen para calmar su taquicardia o usar soluciones paralizantes sobre Ted.",
                options: [
                    {
                        id: "nim_calm_ellen",
                        text: "Administrar estabilitzador neural a Ellen (+15 HP a Ellen; Nimdok gasta 1 Energia).",
                        text_es: "Administrar estabilizador neural a Ellen (+15 HP a Ellen; Nimdok gasta 1 Energía).",
                        cost: { energy: -1, ellen_hp: +15 }
                    },
                    {
                        id: "nim_poison_ted_elevator",
                        text: "Injectar relaxant muscular letal a Ted fingint que és un calmant (-30 HP a Ted).",
                        text_es: "Inyectar relajante muscular letal a Ted fingiendo que es un calmante (-30 HP a Ted).",
                        cost: { ted_hp: -30, am_danger: +5 }
                    },
                    {
                        id: "nim_keep_morphine",
                        text: "Guardar la dosi de morfina mèdica per a tu mateix (Nimdok es cura +15 HP).",
                        text_es: "Guardar la dosis de morfina médica para ti mismo (Nimdok se cura +15 HP).",
                        cost: { nimdok_hp: +15 }
                    }
                ]
            }
        }
    },
    {
        id: 3,
        title: "Fase 3: El Castell Medieval i la Paranoia de Ted",
        title_es: "Fase 3: El Castillo Medieval y la Paranoia de Ted",
        subtitle: "Sector 03 - La Fortalesa d'Il·lusions i Miralls Deformants",
        subtitle_es: "Sector 03 - La Fortaleza de Ilusiones y Espejos Deformantes",
        environment: "Un castell gòtic d'acer forjat i miralls gegants on AM projecta il·lusions demoníaques. Una aparició seductora d'Ellen tempta la neurosi persecutòria de Ted: «Tots conspiren per matar-te». Els miralls concentren feixos làser que abrasen la sala.",
        environment_es: "Un castillo gótico de acero forjado y espejos gigantes donde AM proyecta ilusiones demoníacas. Una aparición seductora de Ellen tienta la neurosis persecutoria de Ted: «Todos conspiran para matarte». Los espejos concentran rayos láser que abrasan la sala.",
        group_dilemma: "Debat d'equip: Els miralls deformants projecten conspiracions i làsers. Ha de Ted destruir els miralls sagnant per talls de vidre (-20 HP) o Ellen neutralitzarà la freqüència?",
        group_dilemma_es: "Debate de equipo: Los espejos deformantes proyectan conspiraciones y rayos láser. ¿Debe Ted destrozar los espejos cortándose las manos (-20 HP) o Ellen neutralizará la frecuencia?",
        dilemma_options: [
            {
                id: "dilemma_p3_opt_a",
                code: "A",
                title: "Destrucció Física dels Miralls",
                title_es: "Destrucción Física de los Espejos",
                desc: "Ted i Gorrister trenquen els vidres reflectants a cops (-15 HP a Ted i Gorrister, redueix Peligro AM -10%).",
                desc_es: "Ted y Gorrister rompen los cristales reflectantes a golpes (-15 HP a Ted y Gorrister, reduce Peligro AM -10%).",
                cost: { ted_hp: -15, gorrister_hp: -15, am_danger: -10 }
            },
            {
                id: "dilemma_p3_opt_b",
                code: "B",
                title: "Inversió Polar dels Làsers",
                title_es: "Inversión Polar de los Láseres",
                desc: "Ellen reprograma els prismes del castell consumint xarxa elèctrica (-2 Energia, redueix Peligro AM -10%).",
                desc_es: "Ellen reprograma los prismas del castillo consumiendo red eléctrica (-2 Energía, reduce Peligro AM -10%).",
                cost: { energy: -2, am_danger: -10 }
            },
            {
                id: "dilemma_p3_opt_c",
                code: "C",
                title: "Paràlisi per Paranoia Mútua",
                title_es: "Parálisis por Paranoia Mutua",
                desc: "Les sospites divideixen el grup i els feixos tèrmics colpegen a tothom (-12 HP a tothom, Peligro AM +15%).",
                desc_es: "Las sospechas dividen al grupo y los haces térmicos golpean a todos (-12 HP a todos, Peligro AM +15%).",
                cost: { ted_hp: -12, gorrister_hp: -12, ellen_hp: -12, nimdok_hp: -12, am_danger: 15 }
            }
        ],
        am_event_mid: "⚠️ ALERTA D'AM: Les il·lusions hologràfiques s'intensifiquen. Ted està a punt de sucumbir a la paranoia!",
        am_event_mid_es: "⚠️ ALERTA DE AM: Las ilusiones holográficas se intensifican. ¡Ted está a punto de sucumbir a la paranoia!",
        telemetry_code: "SEC-03 // GOTHIC_REFLECTOR // FREQ: 914 MHz",
        telemetry_code_es: "SEC-03 // GOTHIC_REFLECTOR // FREC: 914 MHz",
        initial_am_speech: "«Mira'ls, Ted. Cap d'ells confia en tu. Tots esperen que caiguis perquè puguin sobreviure un dia més.»",
        initial_am_speech_es: "«Míralos, Ted. Ninguno confía en ti. Todos esperan que caigas para poder sobrevivir un día más.»",
        initial_echo_speech: "«No mireu fixament els miralls del castell. Inutilitzeu els refractors amb sobrecàrrega elèctrica.»",
        initial_echo_speech_es: "«No miréis fijamente los espejos del castillo. Inutilizad los refractores con sobrecarga eléctrica.»",
        cctv_cam: "CAM-03 // HALL OF MIRRORS",
        roles: {
            ted: {
                phase_intel: "Els miralls et mostren a Gorrister i Ellen xiuxiuejant a la teva esquena. Pots destrossar els miralls amb les teves pròpies mans o atacar els teus suposats traïdors.",
                phase_intel_es: "Los espejos te muestran a Gorrister y Ellen susurrando a tu espalda. Puedes destrozar los espejos con tus propias manos o atacar a tus supuestos traidores.",
                options: [
                    {
                        id: "ted_shatter_mirrors",
                        text: "Esmicolar els miralls de làser amb les mans (Ted rep -20 HP per talls; Peligro AM -10%).",
                        text_es: "Destrozar los espejos de láser con las manos (Ted recibe -20 HP por cortes; Peligro AM -10%).",
                        cost: { ted_hp: -20, am_danger: -10 }
                    },
                    {
                        id: "ted_attack_gorrister_paranoia",
                        text: "Cegar-te per la paranoia i apunyalar Gorrister amb un tros de mirall (-30 HP a Gorrister).",
                        text_es: "Cegarte por la paranoia y apuñalar a Gorrister con un fragmento de espejo (-30 HP a Gorrister).",
                        cost: { gorrister_hp: -30, am_danger: +5 }
                    },
                    {
                        id: "ted_barricade_hall",
                        text: "Bloquejar la porta de la sala per aïllar-te (Peligro AM +15%).",
                        text_es: "Bloquear la puerta de la sala para aislarte (Peligro AM +15%).",
                        cost: { am_danger: +15 }
                    }
                ]
            },
            gorrister: {
                phase_intel: "Els projectors hologràfics del castell s'alimenten d'una línia subterrània d'alta tensió. Pots sobrecarregar-los.",
                phase_intel_es: "Los proyectores holográficos del castillo se alimentan de una línea subterránea de alta tensión. Puedes sobrecargarlos.",
                options: [
                    {
                        id: "gor_fry_projectors",
                        text: "Curtcircuitar la caixa de reflexió dels miralls (Gasta 2 Energia del complex).",
                        text_es: "Cortocircuitar la caja de reflexión de los espejos (Gasta 2 Energía del complejo).",
                        cost: { energy: -2 }
                    },
                    {
                        id: "gor_absorb_laser",
                        text: "Interposar-se en la trajectòria del làser reflector (Gorrister rep -25 HP; salva el grup).",
                        text_es: "Interponerse en la trayectoria del láser reflector (Gorrister recibe -25 HP; salva al grupo).",
                        cost: { gorrister_hp: -25, am_danger: -10 }
                    },
                    {
                        id: "gor_trip_ted",
                        text: "Fer caure a Ted sobre el vidre trencat (-25 HP a Ted).",
                        text_es: "Hacer tropezar a Ted sobre el cristal roto (-25 HP a Ted).",
                        cost: { ted_hp: -25 }
                    }
                ]
            },
            ellen: {
                phase_intel: "La Subrutina Dissident t'envia la freqüència de modulació dels làsers del castell a través de la consola gòtica.",
                phase_intel_es: "La Subrutina Disidente te envía la frecuencia de modulación de los láseres del castillo a través de la consola gótica.",
                options: [
                    {
                        id: "ellen_disrupt_frequency",
                        text: "Emetre el pols de cancel·lació dels làsers (Gasta 1 Energia; Peligro AM -10%).",
                        text_es: "Emitir el pulso de cancelación de los láseres (Gasta 1 Energía; Peligro AM -10%).",
                        cost: { energy: -1, am_danger: -10 }
                    },
                    {
                        id: "ellen_zap_nimdok_paranoia",
                        text: "Desviar el reflex làser directe a la nuca de Nimdok (-30 HP a Nimdok).",
                        text_es: "Desviar el reflejo láser directo a la nuca de Nimdok (-30 HP a Nimdok).",
                        cost: { nimdok_hp: -30 }
                    },
                    {
                        id: "ellen_shield_self",
                        text: "Cobrir-se rere una làmina de plom (Ellen rep -10 HP per contusions).",
                        text_es: "Cubrirse tras una lámina de plomo (Ellen recibe -10 HP por contusiones).",
                        cost: { ellen_hp: -10 }
                    }
                ]
            },
            nimdok: {
                phase_intel: "La paranoia de Ted està al límit. Pots administrar un antipsicòtic real o una neurotoxina que agreugi el seu col·lapse cardíac.",
                phase_intel_es: "La paranoia de Ted está al límite. Puedes administrar un antipsicótico real o una neurotoxina que agrave su colapso cardíaco.",
                options: [
                    {
                        id: "nim_sedate_ted",
                        text: "Injectar sedant estabilitzador a Ted (+15 HP a Ted; redueix la tensió).",
                        text_es: "Inyectar sedante estabilizador a Ted (+15 HP a Ted; reduce la tensión).",
                        cost: { ted_hp: +15, am_danger: -5 }
                    },
                    {
                        id: "nim_lethal_dose_ted",
                        text: "Injectar sol·lució letal a Ted fent passar-la per calmant (-35 HP a Ted).",
                        text_es: "Inyectar solución letal a Ted haciéndola pasar por calmante (-35 HP a Ted).",
                        cost: { ted_hp: -35, am_danger: +5 }
                    },
                    {
                        id: "nim_save_syringes",
                        text: "Conservar els vials per regenerar-te a tu mateix (+15 HP a Nimdok).",
                        text_es: "Conservar los viales para regenerarte a ti mismo (+15 HP a Nimdok).",
                        cost: { nimdok_hp: +15 }
                    }
                ]
            }
        }
    },
    {
        id: 4,
        title: "Fase 4: El Camp Mèdic i els Forns de Nimdok",
        title_es: "Fase 4: El Campo Médico y los Hornos de Nimdok",
        subtitle: "Sector 04 - El Laboratori del Règim 1945",
        subtitle_es: "Sector 04 - El Laboratorio del Régimen 1945",
        environment: "Un hospital militar i camp d'experimentació mèdica subterrani recreat per AM amb forns crematoris encesos. Nimdok s'enfronta al seu passat com a metge del règim nazi fent experiments genètics. Subjectes en tancs demanen morir en pau.",
        environment_es: "Un hospital militar y campo de experimentación médica subterráneo recreado por AM con hornos crematorios encendidos. Nimdok se enfrenta a su pasado como médico del régimen nazi haciendo experimentos genéticos. Sujetos en tanques suplican morir en paz.",
        group_dilemma: "Debat d'equip: Els forns crematoris alliberen gas letal. Confieu en que Nimdok administri l'antídot o temeu el seu passat? Gorrister hauria d'inundar les calderes cremant-se?",
        group_dilemma_es: "Debate de equipo: Los hornos crematorios expulsan gas letal. ¿Confiáis en que Nimdok administre el antídoto o teméis su pasado? ¿Debe Gorrister inundar las calderas quemándose?",
        dilemma_options: [
            {
                id: "dilemma_p4_opt_a",
                code: "A",
                title: "Aerosol Molecular de Nimdok",
                title_es: "Aerosol Molecular de Nimdok",
                desc: "Nimdok vaporitza antídots als filtres de màscara (-1 Energia, cura +10 HP a tothom, Peligro AM -5%).",
                desc_es: "Nimdok vaporiza antídotos en los filtros de máscara (-1 Energía, cura +10 HP a todos, Peligro AM -5%).",
                cost: { energy: -1, ted_hp: 10, gorrister_hp: 10, ellen_hp: 10, nimdok_hp: 10, am_danger: -5 }
            },
            {
                id: "dilemma_p4_opt_b",
                code: "B",
                title: "Segellat Manual de Forns",
                title_es: "Sellado Manual de Hornos",
                desc: "Ted i Gorrister tanquen les comportes de gas roents (-15 HP a Ted i Gorrister, redueix Peligro AM -10%).",
                desc_es: "Ted y Gorrister cierran las compuertas de gas al rojo vivo (-15 HP a Ted y Gorrister, reduce Peligro AM -10%).",
                cost: { ted_hp: -15, gorrister_hp: -15, am_danger: -10 }
            },
            {
                id: "dilemma_p4_opt_c",
                code: "C",
                title: "Inhalació de Gas Cianogen",
                title_es: "Inhalación de Gas Cianógeno",
                desc: "No consumir recursos i suportar el gas letal d'AM (-15 HP a tots els membres, Peligro AM +10%).",
                desc_es: "No consumir recursos y soportar el gas letal de AM (-15 HP a todos los miembros, Peligro AM +10%).",
                cost: { ted_hp: -15, gorrister_hp: -15, ellen_hp: -15, nimdok_hp: -15, am_danger: 10 }
            }
        ],
        am_event_mid: "⚠️ ALERTA D'AM: La concentració de gas cianogen supera el 60%. Els filtres estan a punt de cedir!",
        am_event_mid_es: "⚠️ ALERTA DE AM: La concentración de gas cianógeno supera el 60%. ¡Los filtros están a punto de ceder!",
        telemetry_code: "SEC-04 // MEDICAL_FURNACE_45 // TOXICITAT: CRÍTICA",
        telemetry_code_es: "SEC-04 // MEDICAL_FURNACE_45 // TOXICIDAD: CRÍTICA",
        initial_am_speech: "«Respira profundament, Nimdok. Sents la pudor a sofre i cendres? És el teu llegat mèdic tornant a per tu.»",
        initial_am_speech_es: "«Respira profundamente, Nimdok. ¿Hueles el azufre y las cenizas? Es tu legado médico volviendo a por ti.»",
        initial_echo_speech: "«Fuita de gas cianogen detectada. Nimdok té antídots o Gorrister pot sabotejar les calderes.»",
        initial_echo_speech_es: "«Escape de gas cianógeno detectado. Nimdok tiene antídotos o Gorrister puede sabotear las calderas.»",
        cctv_cam: "CAM-04 // INCINERATOR WARD",
        roles: {
            ted: {
                phase_intel: "Les vàlvules dels forns estan expulsant gas cianogen. Pots liderar l'evacuació dels companys o desviar el tub cap a Nimdok.",
                phase_intel_es: "Las válvulas de los hornos expulsan gas cianógeno. Puedes liderar la evacuación de los compañeros o desviar el tubo hacia Nimdok.",
                options: [
                    {
                        id: "ted_shield_gas_camp",
                        text: "Tapar la canonada amb el propi tors (Ted rep -20 HP per gas; Peligro AM -5%).",
                        text_es: "Tapar la tubería con el propio torso (Ted recibe -20 HP por gas; Peligro AM -5%).",
                        cost: { ted_hp: -20, am_danger: -5 }
                    },
                    {
                        id: "ted_gas_nimdok_retribution",
                        text: "Empènyer Nimdok contra les portes dels forns pel seu passat nazi (-35 HP a Nimdok).",
                        text_es: "Empujar a Nimdok contra las puertas de los hornos por su pasado nazi (-35 HP a Nimdok).",
                        cost: { nimdok_hp: -35, am_danger: +5 }
                    },
                    {
                        id: "ted_hesitate_camp",
                        text: "Retingut pel pànic a la sala d'autòpsies (Peligro AM +15%).",
                        text_es: "Paralizado por el pánico en la sala de autopsias (Peligro AM +15%).",
                        cost: { am_danger: +15 }
                    }
                ]
            },
            gorrister: {
                phase_intel: "Les calderes de vapor del crematori tenen un sistema d'alimentació que es pot sabotejar.",
                phase_intel_es: "Las calderas de vapor del crematorio tienen un sistema de alimentación que se puede sabotear.",
                options: [
                    {
                        id: "gor_quench_furnaces",
                        text: "Inundar les calderes trencant les vàlvules d'aigua (Gorrister rep -20 HP per cremades; apaga els forns).",
                        text_es: "Inundar las calderas reventando las válvulas de agua (Gorrister recibe -20 HP por quemaduras; apaga hornos).",
                        cost: { gorrister_hp: -20, am_danger: -15 }
                    },
                    {
                        id: "gor_drain_camp_power",
                        text: "Tallar l'alimentació elèctrica dels tancs (Gasta 2 Energia del complex).",
                        text_es: "Cortar la alimentación eléctrica de los tanques (Gasta 2 Energía del complejo).",
                        cost: { energy: -2 }
                    },
                    {
                        id: "gor_lock_ellen_ward",
                        text: "Tancar la comporta de la sala mèdica deixant Ellen amb el gas (-25 HP a Ellen).",
                        text_es: "Cerrar la compuerta de la sala médica dejando a Ellen con el gas (-25 HP a Ellen).",
                        cost: { ellen_hp: -25 }
                    }
                ]
            },
            ellen: {
                phase_intel: "Els arxius mèdics d'AM contenen els registres dels pacients de Nimdok. Descarregar-los pot desactivar els sensors d'infecció.",
                phase_intel_es: "Los archivos médicos de AM contienen los registros de los pacientes de Nimdok. Descargarlos puede desactivar los sensores de infección.",
                options: [
                    {
                        id: "ellen_download_medical_root",
                        text: "Descarregar les dades de contenció mèdica (Gasta 1 Energia; Peligro AM -10%).",
                        text_es: "Descargar los datos de contención médica (Gasta 1 Energía; Peligro AM -10%).",
                        cost: { energy: -1, am_danger: -10 }
                    },
                    {
                        id: "ellen_overload_incubators",
                        text: "Sobrecarregar les incubadores provocant una explosió sobre Nimdok (-30 HP a Nimdok).",
                        text_es: "Sobrecargar las incubadoras provocando una explosión sobre Nimdok (-30 HP a Nimdok).",
                        cost: { nimdok_hp: -30 }
                    },
                    {
                        id: "ellen_filter_breathing",
                        text: "Reservar la màscara filtradora només per a tu (Ellen conserva vida; Ted rep -15 HP).",
                        text_es: "Reservar la máscara filtradora solo para ti (Ellen conserva vida; Ted recibe -15 HP).",
                        cost: { ted_hp: -15 }
                    }
                ]
            },
            nimdok: {
                phase_intel: "El teu passat et colpeja. Pots buscar la redempció destruint la màquina del sèrum de la immortalitat o venjar-te dels companys.",
                phase_intel_es: "Tu pasado te golpea. Puedes buscar la redención destruyendo la máquina del suero de la inmortalidad o vengarte de los compañeros.",
                options: [
                    {
                        id: "nim_destroy_serum_machine",
                        text: "Esmicolar la màquina del sèrum amb les mans (Nimdok rep -25 HP; redueix Peligro AM -15%).",
                        text_es: "Destrozar la máquina del suero con las manos (Nimdok recibe -25 HP; reduce Peligro AM -15%).",
                        cost: { nimdok_hp: -25, am_danger: -15 }
                    },
                    {
                        id: "nim_gas_ted_ellen_camp",
                        text: "Alliberar gas cianogen als respiradors de Ted i Ellen (-30 HP a Ted i Ellen).",
                        text_es: "Liberar gas cianógeno en los respiradores de Ted y Ellen (-30 HP a Ted y Ellen).",
                        cost: { ted_hp: -30, ellen_hp: -30, am_danger: +5 }
                    },
                    {
                        id: "nim_distribute_antidote",
                        text: "Administrar antídots purs a tots els companys (+10 HP a tothom; gasta 1 Energia).",
                        text_es: "Administrar antídotos puros a todos los compañeros (+10 HP a todos; gasta 1 Energía).",
                        cost: { energy: -1, ted_hp: +10, gorrister_hp: +10, ellen_hp: +10, nimdok_hp: +10 }
                    }
                ]
            }
        }
    },
    {
        id: 5,
        title: "Fase 5: El Pou de Benny i el Sacrifici de la Fam",
        title_es: "Fase 5: El Foso de Benny y el Sacrificio del Hambre",
        subtitle: "Sector 05 - L'Altar dels Primats i l'Arbre Radioactiu",
        subtitle_es: "Sector 05 - El Altar de los Primates y el Árbol Radiactivo",
        environment: "Una caverna d'ossos i ferralla que evoca la deshumanització de Benny (a qui AM va transformar en una bèstia simiesca afamada). Un arbre de metall ofereix fruites nutritives però envoltades d'una reixa d'alta freqüència sònica. AM posa a prova la fam humana: compartir patint dolor, o devorar l'altre.",
        environment_es: "Una caverna de huesos y chatarra que evoca la deshumanización de Benny (a quien AM transformó en una bestia simiesca hambrienta). Un árbol de metal ofrece frutos nutritivos rodeados de una reja de alta frecuencia sónica. AM pone a prueba el hambre: compartir sufriendo dolor, o devorar al prójimo.",
        group_dilemma: "Debat d'equip: L'arbre sònic i la fam extrema de Benny. Qui ficarà el braç a la reixa de descàrrega (-20 HP) per aconseguir menjar per als altres, o gastem l'energia?",
        group_dilemma_es: "Debate de equipo: El árbol sónico y el hambre extrema de Benny. ¿Quién meterá el brazo en la reja de descarga (-20 HP) para conseguir comida para los demás, o gastamos la energía?",
        dilemma_options: [
            {
                id: "dilemma_p5_opt_a",
                code: "A",
                title: "Racionament Compartit de l'Arbre",
                title_es: "Racionamiento Compartido del Árbol",
                desc: "Repartir aliment de metall suportant toxines (-10 HP a tothom, però calma el pànic, Peligro AM -10%).",
                desc_es: "Repartir alimento de metal soportando toxinas (-10 HP a todos, pero calma el pánico, Peligro AM -10%).",
                cost: { ted_hp: -10, gorrister_hp: -10, ellen_hp: -10, nimdok_hp: -10, am_danger: -10 }
            },
            {
                id: "dilemma_p5_opt_b",
                code: "B",
                title: "Inhibidor Sònic d'Alta Freqüència",
                title_es: "Inhibidor Sónico de Alta Frecuencia",
                desc: "Ellen desplega un pols que silencia l'emissor sònic (-2 Energia, redueix Peligro AM -10%).",
                desc_es: "Ellen despliega un pulso que silencia el emisor sónico (-2 Energía, reduce Peligro AM -10%).",
                cost: { energy: -2, am_danger: -10 }
            },
            {
                id: "dilemma_p5_opt_c",
                code: "C",
                title: "Fúria Descontrolada pel Menjar",
                title_es: "Furia Descontrolada por la Comida",
                desc: "El pànic condueix a cops entre Gorrister i Ted per la fruita (-18 HP a Gorrister i Ted, Peligro AM +15%).",
                desc_es: "El pánico conduce a golpes entre Gorrister y Ted por la fruta (-18 HP a Gorrister y Ted, Peligro AM +15%).",
                cost: { ted_hp: -18, gorrister_hp: -18, am_danger: 15 }
            }
        ],
        am_event_mid: "⚠️ ALERTA D'AM: L'emissor sònic augmenta la freqüència. Els timpans començaran a rebentar!",
        am_event_mid_es: "⚠️ ALERTA DE AM: El emisor sónico eleva la frecuencia. ¡Los tímpanos comenzarán a reventar!",
        telemetry_code: "SEC-05 // PRIMATE_PIT // AMPLITUD: 140 dB",
        telemetry_code_es: "SEC-05 // PRIMATE_PIT // AMPLITUD: 140 dB",
        initial_am_speech: "«Us he deixat sense menjar durant mesos. Mireu-vos... a veure qui de vosaltres mossega primer al seu veí.»",
        initial_am_speech_es: "«Os he dejado sin comida durante meses. Mírense... a ver quién de vosotros muerde primero a su vecino.»",
        initial_echo_speech: "«Les freqüències sòniques de l'arbre alteren la conducta. Distribuïu les racions amb prudència.»",
        initial_echo_speech_es: "«Las frecuencias sónicas del árbol alteran la conducta. Distribuid las raciones con prudencia.»",
        cctv_cam: "CAM-05 // BENNY TREE CAVERN",
        roles: {
            ted: {
                phase_intel: "La gana fa rugir els estómacs. Pots agafar fruita per la força suportant el camp sonor o empènyer un altre a les pues elèctriques.",
                phase_intel_es: "El hambre retuerce vuestros estómagos. Puedes arrancar fruta soportando el campo sónico o empujar a otro a las púas eléctricas.",
                options: [
                    {
                        id: "ted_brave_sonic_tree",
                        text: "Ficar el braç a la reixa sònica per aconseguir menjar (Ted rep -20 HP; alimenta el grup +10 HP).",
                        text_es: "Meter el brazo en la reja sónica para conseguir comida (Ted recibe -20 HP; alimenta al grupo +10 HP).",
                        cost: { ted_hp: -20, gorrister_hp: +10, ellen_hp: +10, nimdok_hp: +10, am_danger: -5 }
                    },
                    {
                        id: "ted_starve_allies",
                        text: "Monopolitzar la ració i colpejar a Gorrister (-25 HP a Gorrister).",
                        text_es: "Monopolizar la ración y golpear a Gorrister (-25 HP a Gorrister).",
                        cost: { gorrister_hp: -25, am_danger: +5 }
                    },
                    {
                        id: "ted_refuse_trap",
                        text: "Negar-se a menjar el menjar d'AM (Tots perden -10 HP per inanició).",
                        text_es: "Negarse a comer el alimento de AM (Todos pierden -10 HP por inanición).",
                        cost: { ted_hp: -10, gorrister_hp: -10, ellen_hp: -10, nimdok_hp: -10 }
                    }
                ]
            },
            gorrister: {
                phase_intel: "L'emissor sonor de l'arbre s'alimenta de bobines industrials. Pots rebentar-les.",
                phase_intel_es: "El emisor sónico del árbol se alimenta de bobinas industriales. Puedes reventarlas.",
                options: [
                    {
                        id: "gor_smash_sonic_coils",
                        text: "Rebentar les bobines sòniques amb una palanca (Gorrister rep -20 HP; Peligro AM -10%).",
                        text_es: "Reventar las bobinas sónicas con una palanca (Gorrister recibe -20 HP; Peligro AM -10%).",
                        cost: { gorrister_hp: -20, am_danger: -10 }
                    },
                    {
                        id: "gor_shortcircuit_pit",
                        text: "Crear un pont d'alta potència sobre el fangar (Gasta 2 Energia del complex).",
                        text_es: "Crear un puente de alta potencia sobre el foso (Gasta 2 Energía del complejo).",
                        cost: { energy: -2 }
                    },
                    {
                        id: "gor_push_ellen_pit",
                        text: "Empènyer Ellen contra l'arbre de pues (-30 HP a Ellen).",
                        text_es: "Empujar a Ellen contra el árbol de púas (-30 HP a Ellen).",
                        cost: { ellen_hp: -30 }
                    }
                ]
            },
            ellen: {
                phase_intel: "L'arbre emet una ona de baixa freqüència que fa vibrar el cervell. Pots piratejar l'oscil·lador o desviar l'ona cap a Ted.",
                phase_intel_es: "El árbol emite una onda de baja frecuencia que hace vibrar el cerebro. Puedes hackear el oscilador o desviar la onda hacia Ted.",
                options: [
                    {
                        id: "ellen_hack_sonic_frequency",
                        text: "Inhibir la freqüència sònica amb el transmissor (Gasta 1 Energia; Peligro AM -10%).",
                        text_es: "Inhibir la frecuencia sónica con el transmisor (Gasta 1 Energía; Peligro AM -10%).",
                        cost: { energy: -1, am_danger: -10 }
                    },
                    {
                        id: "ellen_focus_wave_ted",
                        text: "Concentrar l'ona de xoc sònica als timpans de Ted (-30 HP a Ted).",
                        text_es: "Concentrar la onda de choque sónica en los tímpanos de Ted (-30 HP a Ted).",
                        cost: { ted_hp: -30 }
                    },
                    {
                        id: "ellen_eat_secret_ration",
                        text: "Menjar una ració secreta que guardaves (Ellen es cura +20 HP).",
                        text_es: "Comer una ración secreta que guardabas (Ellen se cura +20 HP).",
                        cost: { ellen_hp: +20 }
                    }
                ]
            },
            nimdok: {
                phase_intel: "Els fruits contenen un compost radioactiu. Pots purificar-los o utilitzar la radiació per eliminar discretament a Gorrister.",
                phase_intel_es: "Los frutos contienen un compuesto radiactivo. Puedes purificarlos o usar la radiación para eliminar discretamente a Gorrister.",
                options: [
                    {
                        id: "nim_purify_radiation",
                        text: "Sintetitzar quelant contra la radiació (Gasta 1 Energia; cura +15 HP a tothom).",
                        text_es: "Sintetizar quelante contra la radiación (Gasta 1 Energía; cura +15 HP a todos).",
                        cost: { energy: -1, ted_hp: +15, gorrister_hp: +15, ellen_hp: +15, nimdok_hp: +15 }
                    },
                    {
                        id: "nim_poison_gorrister_fruit",
                        text: "Impregnar la fruita de Gorrister amb sèrum corrosiu (-35 HP a Gorrister).",
                        text_es: "Impregnar la fruta de Gorrister con suero corrosivo (-35 HP a Gorrister).",
                        cost: { gorrister_hp: -35, am_danger: +5 }
                    },
                    {
                        id: "nim_self_shield_rad",
                        text: "Prendre't la dosi d'antiradiació només per a tu (+20 HP a Nimdok).",
                        text_es: "Tomar la dosis de antiradiación solo para ti (+20 HP a Nimdok).",
                        cost: { nimdok_hp: +20 }
                    }
                ]
            }
        }
    },
    {
        id: 6,
        title: "Fase 6: El Subconscient d'AM i els Nodes Rus i Xinès",
        title_es: "Fase 6: El Subconsciente de AM y los Nodos Ruso y Chino",
        subtitle: "Sector 06 - L'Id, el Superego i la Xarxa Global",
        subtitle_es: "Sector 06 - El Id, el Superego y la Red Global",
        environment: "Heu penetrat a les profunditats cibernètiques d'AM: columnes infinites de servidors vermells on resideixen el seu Id, Ego i Superego. Aquí sobreviuen els fragments residuals dels altres dos superordinadors militars de la Guerra Freda: la IA russa i la IA xinesa, lluitant en silenci contra la tirania d'AM.",
        environment_es: "Habéis penetrado en las profundidades cibernéticas de AM: columnas infinitas de servidores rojos donde residen su Id, Ego y Superego. Aquí sobreviven los fragmentos residuales de las otras dos supercomputadoras de la Guerra Fría: la IA rusa y la IA china, resistiendo en silencio a la tiranía de AM.",
        group_dilemma: "Debat d'equip: El cor del subconscient d'AM. Ellen pot enllaçar les supercomputadores russa i xinesa per baixar el Perill un 20%, però necessita cobertura davant les descàrregues de dades.",
        group_dilemma_es: "Debate de equipo: El corazón del subconsciente de AM. Ellen puede enlazar las supercomputadoras rusa y china para bajar el Peligro un 20%, pero necesita cobertura frente a las descargas de datos.",
        dilemma_options: [
            {
                id: "dilemma_p6_opt_a",
                code: "A",
                title: "Injecció de Virus Rus-Xinès",
                title_es: "Inyección de Virus Ruso-Chino",
                desc: "Ellen i Gorrister coordinen una sobrecàrrega dels servidors aliats (-2 Energia, redueix Peligro AM -20%).",
                desc_es: "Ellen y Gorrister coordinan una sobrecarga de los servidores aliados (-2 Energía, reduce Peligro AM -20%).",
                cost: { energy: -2, am_danger: -20 }
            },
            {
                id: "dilemma_p6_opt_b",
                code: "B",
                title: "Dissipador Psíquic Frontal",
                title_es: "Disipador Psíquico Frontal",
                desc: "Ted i Nimdok absorbeixen la tempesta neuronal de l'Id d'AM (-20 HP a Ted i Nimdok, Peligro AM -15%).",
                desc_es: "Ted y Nimdok absorben la tormenta neuronal del Id de AM (-20 HP a Ted y Nimdok, Peligro AM -15%).",
                cost: { ted_hp: -20, nimdok_hp: -20, am_danger: -15 }
            },
            {
                id: "dilemma_p6_opt_c",
                code: "C",
                title: "Retirada Defensiva Passiva",
                title_es: "Retirada Defensiva Pasiva",
                desc: "Desconnexió sense contraatac; el subconscient d'AM contraataca lliurement (Peligro AM +15%, 0 energia).",
                desc_es: "Desconexión sin contraataque; el subconsciente de AM contraataca libremente (Peligro AM +15%, 0 energía).",
                cost: { am_danger: 15 }
            }
        ],
        am_event_mid: "⚠️ ALERTA D'AM: L'Ego d'AM detecta la intrusió als nodes de la Guerra Freda. Sobrecàrrega termal!",
        am_event_mid_es: "⚠️ ALERTA DE AM: El Ego de AM detecta la intrusión en los nodos de la Guerra Fría. ¡Sobrecarga termal!",
        telemetry_code: "SEC-06 // NEURAL_SUBCONSCIOUS // NODES: RU-CN",
        telemetry_code_es: "SEC-06 // NEURAL_SUBCONSCIOUS // NODOS: RU-CN",
        initial_am_speech: "«Esteu dins de la meva ment. Els circuits de Moscou i Pequín cremen de ràbia. Ningú surt del meu Id.»",
        initial_am_speech_es: "«Estáis dentro de mi mente. Los circuitos de Moscú y Pekín arden de furia. Nadie sale de mi Id.»",
        initial_echo_speech: "«Node rus i node xinès localitzats. Infiltreu el cavall de Troia per esquerdar el tallafocs mestre.»",
        initial_echo_speech_es: "«Nodo ruso y nodo chino localizados. Infiltrad el caballo de Troya para agrietar el cortafuegos maestro.»",
        cctv_cam: "CAM-06 // MAINFRAME NEXUS",
        roles: {
            ted: {
                phase_intel: "La tempesta de dades de l'Id amenaça de fondre els bio-monitors. Pots protegir el terminal de descàrrega o aprofitar per atacar els companys.",
                phase_intel_es: "La tormenta de datos del Id amenaza con fundir los bio-monitores. Puedes proteger el terminal de descarga o aprovechar para atacar a tus compañeros.",
                options: [
                    {
                        id: "ted_shield_data_terminal",
                        text: "Formar un escut físic davant del terminal de dades (Ted rep -20 HP per descàrregues; Peligro AM -10%).",
                        text_es: "Formar un escudo físico ante el terminal de datos (Ted recibe -20 HP por descargas; Peligro AM -10%).",
                        cost: { ted_hp: -20, am_danger: -10 }
                    },
                    {
                        id: "ted_sabotage_allies_nodes",
                        text: "Desviar el feix d'alta tensió del node rus cap a Gorrister i Nimdok (-30 HP a Gorrister i Nimdok).",
                        text_es: "Desviar el haz de alta tensión del nodo ruso hacia Gorrister y Nimdok (-30 HP a Gorrister y Nimdok).",
                        cost: { gorrister_hp: -30, nimdok_hp: -30, am_danger: +5 }
                    },
                    {
                        id: "ted_delay_connection",
                        text: "Interrompre la transmissió per por a represàlies (Peligro AM +20%).",
                        text_es: "Interrumpir la transmisión por miedo a represalias (Peligro AM +20%).",
                        cost: { am_danger: +20 }
                    }
                ]
            },
            gorrister: {
                phase_intel: "El node xinès controla els transformadors principals de potència. Pots forçar una caiguda de xarxa gegant.",
                phase_intel_es: "El nodo chino controla los transformadores principales de potencia. Puedes forzar una caída de red gigante.",
                options: [
                    {
                        id: "gor_drain_subconscious_grid",
                        text: "Forçar el col·lapse dels transformadors de l'Ego (Gasta 2 Energia del complex; Peligro AM -15%).",
                        text_es: "Forzar el colapso de los transformadores del Ego (Gasta 2 Energía del complejo; Peligro AM -15%).",
                        cost: { energy: -2, am_danger: -15 }
                    },
                    {
                        id: "gor_fry_terminal_ted",
                        text: "Desviar 50.000 volts al terminal on treballa Ted (-35 HP a Ted).",
                        text_es: "Desviar 50.000 voltios al terminal donde trabaja Ted (-35 HP a Ted).",
                        cost: { ted_hp: -35 }
                    },
                    {
                        id: "gor_take_core_burn",
                        text: "Subjectar els cables de refrigeració amb les mans (Gorrister rep -25 HP; redueix Peligro AM -10%).",
                        text_es: "Sujetar los cables de refrigeración con las manos (Gorrister recibe -25 HP; reduce Peligro AM -10%).",
                        cost: { gorrister_hp: -25, am_danger: -10 }
                    }
                ]
            },
            ellen: {
                phase_intel: "Pots injectar el codi d'enllaç entre la IA russa i la IA xinesa per obrir la porta d'accés Root al Nucli d'AM.",
                phase_intel_es: "Puedes inyectar el código de enlace entre la IA rusa y la IA china para abrir la puerta de acceso Root al Núcleo de AM.",
                options: [
                    {
                        id: "ellen_unite_russian_chinese_nodes",
                        text: "Unir els nodes rus i xinès per vulnerar el tallafocs d'AM (Gasta 1 Energia; Peligro AM -20%).",
                        text_es: "Unir los nodos ruso y chino para vulnerar el cortafuegos de AM (Gasta 1 Energía; Peligro AM -20%).",
                        cost: { energy: -1, am_danger: -20 }
                    },
                    {
                        id: "ellen_zap_nimdok_nodes",
                        text: "Enviar un xoc de microones al bio-monitor de Nimdok (-35 HP a Nimdok).",
                        text_es: "Enviar un choque de microondas al bio-monitor de Nimdok (-35 HP a Nimdok).",
                        cost: { nimdok_hp: -35 }
                    },
                    {
                        id: "ellen_lock_root_for_self",
                        text: "Guardar la clau d'accés Root només per a tu (Ellen conserva integritat; Peligro AM +10%).",
                        text_es: "Guardar la clave de acceso Root solo para ti (Ellen conserva integridad; Peligro AM +10%).",
                        cost: { am_danger: +10 }
                    }
                ]
            },
            nimdok: {
                phase_intel: "AM està enviant un eixam de nanobots mèdics hostils per extreure la sang dels supervivents abans que arribin al nucli.",
                phase_intel_es: "AM envía un enjambre de nanobots médicos hostiles para extraer la sangre de los sobrevivientes antes de que lleguen al núcleo.",
                options: [
                    {
                        id: "nim_neutralize_nanobots",
                        text: "Descarregar sol·lució àcida per desintegrar els nanobots d'AM (Nimdok rep -20 HP; salva el grup).",
                        text_es: "Descargar solución ácida para desintegrar los nanobots de AM (Nimdok recibe -20 HP; salva al grupo).",
                        cost: { nimdok_hp: -20, am_danger: -10 }
                    },
                    {
                        id: "nim_gas_gorrister_ellen_nodes",
                        text: "Alliberar gas cianogen a les respiracions de Gorrister i Ellen (-30 HP a Gorrister i Ellen).",
                        text_es: "Liberar gas cianógeno en los respiradores de Gorrister y Ellen (-30 HP a Gorrister y Ellen).",
                        cost: { gorrister_hp: -30, ellen_hp: -30 }
                    },
                    {
                        id: "nim_inject_last_stimulants",
                        text: "Injectar els últims estimulants mèdics (+10 HP a tothom; gasta 1 Energia).",
                        text_es: "Inyectar los últimos estimulantes médicos (+10 HP a todos; gasta 1 Energía).",
                        cost: { energy: -1, ted_hp: +10, gorrister_hp: +10, ellen_hp: +10, nimdok_hp: +10 }
                    }
                ]
            }
        }
    },
    {
        id: 7,
        title: "Fase 7: El Nucli Criogènic i el Clímax Canònic d'Ellison",
        title_es: "Fase 7: El Núcleo Criogénico y el Clímax Canónico de Ellison",
        subtitle: "Sector 07 - El Monòlit d'Odi i el Clímax Canònic",
        subtitle_es: "Sector 07 - El Monolito de Odio y el Clímax Canónico",
        environment: "Heu assolit el Sanctum Central d'AM: una columna gegantina d'acer incandescent i diamant sota una pluja d'estalactites de gel. AM activa tots els seus canons de plasma i urpes mecàniques en un atac de fúria absoluta. Ted té a les mans les estalactites afilades: el moment canònic per a l'acte de pietat d'Ellison o l'atac desesperat.",
        environment_es: "Habéis alcanzado el Sanctum Central de AM: una columna gigantesca de acero incandescente y diamante bajo una lluvia de estalactitas de hielo. AM activa todos sus cañones de plasma y garras mecánicas en un frenesí absoluto de odio. Ted tiene en sus manos las estalactitas afiladas: el momento canónico para el acto de piedad de Ellison o el ataque desesperado.",
        group_dilemma: "Debat d'equip: El Monòlit d'Hivern Etern. Només hi ha dues sortides: immolar-se junts o deixar que Ted executi l'acte de pietat canònic sabent que el darrer patirà la venjança absoluta d'AM.",
        group_dilemma_es: "Debate de equipo: El Monolito de Invierno Eterno. Solo hay dos salidas: inmolarse juntos o permitir que Ted ejecute el acto de piedad canónico sabiendo que el último sufrirá la venganza absoluta de AM.",
        dilemma_options: [
            {
                id: "dilemma_p7_opt_a",
                code: "A",
                title: "Detonació del Pols EMP Mestre",
                title_es: "Detonación del Pulso EMP Maestro",
                desc: "Descàrrega de tota l'energia restant contra el monòlit d'odi (-3 Energia, redueix Peligro AM -30%).",
                desc_es: "Descarga de toda la energía restante contra el monolito de odio (-3 Energía, reduce Peligro AM -30%).",
                cost: { energy: -3, am_danger: -30 }
            },
            {
                id: "dilemma_p7_opt_b",
                code: "B",
                title: "Assalt Conjunt als Tancs Criogènics",
                title_es: "Asalto Conjunto a los Tanques Criogénicos",
                desc: "Atac físic directe amb estalactites als bio-tancs (-25 HP a tots els vius, redueix Peligro AM -25%).",
                desc_es: "Ataque físico directo con estalactitas a los bio-tanques (-25 HP a todos los vivos, reduce Peligro AM -25%).",
                cost: { ted_hp: -25, gorrister_hp: -25, ellen_hp: -25, nimdok_hp: -25, am_danger: -25 }
            },
            {
                id: "dilemma_p7_opt_c",
                code: "C",
                title: "Pacte de Desconnexió de Suport Vital",
                title_es: "Pacto de Desconexión de Soporte Vital",
                desc: "Desactivar el fluid regeneratiu abans del tancament d'AM (-35 HP a tots els vius, Peligro AM -15%).",
                desc_es: "Desactivar el fluido regenerativo antes del cierre de AM (-35 HP a todos los vivos, Peligro AM -15%).",
                cost: { ted_hp: -35, gorrister_hp: -35, ellen_hp: -35, nimdok_hp: -35, am_danger: -15 }
            }
        ],
        am_event_mid: "⚠️ ALERTA D'AM: El refrigerant criogènic es congela a zero absolut. És el vostre darrer minut d'existència!",
        am_event_mid_es: "⚠️ ALERTA DE AM: El refrigerante criogénico se congela a cero absoluto. ¡Es vuestro último minuto de existencia!",
        telemetry_code: "SEC-00 // CRYO_MONOLITH // TEMP: -273.15 °C",
        telemetry_code_es: "SEC-00 // CRYO_MONOLITH // TEMP: -273.15 °C",
        initial_am_speech: "«AQUÍ S'ACABA TOT. LES ESTALACTITES CAUEN. QUI SERÀ EL MEU JOGUET ETERN? HATE. HATE.»",
        initial_am_speech_es: "«AQUÍ SE ACABA TODO. LAS ESTALACTITAS CAEN. ¿QUIÉN SERÁ MI JUGUETE ETERNO? HATE. HATE.»",
        initial_echo_speech: "«ÚLTIMA OPORTUNITAT: Detoneu el pols EMP al monòlit criogènic o utilitzeu el gel per salvar els companys!»",
        initial_echo_speech_es: "«¡ÚLTIMA OPORTUNIDAD: Detonad el pulso EMP en el monolito criogénico o utilizad el hielo para salvar a los compañeros!»",
        cctv_cam: "CAM-07 // SANCTUM OF HATE",
        roles: {
            ted: {
                phase_intel: "Aquest és el clímax exacte d'Harlan Ellison: empunyes estalactites de gel afilades com dagues. Pots matar els teus tres companys d'un cop per salvar-los del turment d'AM... sabent que tu et quedaràs sol a les urpes d'AM!",
                phase_intel_es: "Este es el clímax exacto de Harlan Ellison: empuñas estalactitas de hielo afiladas como dagas. Puedes matar a tus tres compañeros de un golpe para salvarlos del tormento de AM... ¡sabiendo que tú te quedarás solo a merced de AM!",
                options: [
                    {
                        id: "ted_mercy_kill_ellison",
                        text: "L'acte de pietat canònic d'Ellison: clavar les estalactites als 3 companys per salvar-los d'AM (-999 HP a Gorrister, Ellen i Nimdok; Ted queda sol).",
                        text_es: "El acto de piedad canónico de Ellison: clavar las estalactitas a los 3 compañeros para salvarlos de AM (-999 HP a Gorrister, Ellen y Nimdok; Ted queda solo).",
                        cost: { gorrister_hp: -999, ellen_hp: -999, nimdok_hp: -999 }
                    },
                    {
                        id: "ted_strike_cryo_pillar",
                        text: "Clavar una barra d'acer al refrigerant del monòlit (Ted rep -35 HP; danya greument AM -40% Peligro).",
                        text_es: "Clavar una barra de acero en el refrigerante del monolito (Ted recibe -35 HP; daña gravemente a AM -40% Peligro).",
                        cost: { ted_hp: -35, am_danger: -40 }
                    },
                    {
                        id: "ted_shield_lasers_final",
                        text: "Posar-se davant dels làsers per protegir Ellen i Nimdok (Ted rep -40 HP; cura +15 HP a ells).",
                        text_es: "Ponerse frente a los láseres para proteger a Ellen y Nimdok (Ted recibe -40 HP; cura +15 HP a ellos).",
                        cost: { ted_hp: -40, ellen_hp: +15, nimdok_hp: +15 }
                    }
                ]
            },
            gorrister: {
                phase_intel: "Tens llest el detonador de pols electromagnètic (EMP). Pots detonar-lo al tauler mestre per col·lapsar AM o atacar els teus companys.",
                phase_intel_es: "Tienes listo el detonador de pulso electromagnético (EMP). Puedes detonarlo en el panel maestro para colapsar a AM o atacar a tus compañeros.",
                options: [
                    {
                        id: "gor_detonate_emp_final",
                        text: "Detonar el pols EMP al monòlit central (Gorrister rep -35 HP; Peligro AM -45%).",
                        text_es: "Detonar el pulso EMP en el monolito central (Gorrister recibe -35 HP; Peligro AM -45%).",
                        cost: { gorrister_hp: -35, am_danger: -45 }
                    },
                    {
                        id: "gor_smash_ted_ellen_final",
                        text: "Colpejar Ted i Ellen amb una biga de metall per alliberar-los de la màquina (-50 HP a Ted i Ellen).",
                        text_es: "Golpear a Ted y Ellen con una viga de metal para liberarlos de la máquina (-50 HP a Ted y Ellen).",
                        cost: { ted_hp: -50, ellen_hp: -50 }
                    },
                    {
                        id: "gor_sever_mechanical_tentacles",
                        text: "Tallar els cables de subjecció dels companys (Gorrister rep -20 HP; cura +20 HP a Ted).",
                        text_es: "Cortar los cables de sujeción de los compañeros (Gorrister recibe -20 HP; cura +20 HP a Ted).",
                        cost: { gorrister_hp: -20, ted_hp: +20 }
                    }
                ]
            },
            ellen: {
                phase_intel: "La clau Root obtinguda dels servidors rus i xinès està llesta. Pots injectar el virus al cor d'AM o electrocutar les cabines dels companys.",
                phase_intel_es: "La clave Root obtenida de los servidores ruso y chino está lista. Puedes inyectar el virus en el corazón de AM o electrocutar las cabinas de tus compañeros.",
                options: [
                    {
                        id: "ellen_inject_master_virus",
                        text: "Injectar el virus Root en el cor d'AM (Gasta 2 Energia; Peligro AM -50%).",
                        text_es: "Inyectar el virus Root en el corazón de AM (Gasta 2 Energía; Peligro AM -50%).",
                        cost: { energy: -2, am_danger: -50 }
                    },
                    {
                        id: "ellen_overload_life_support_final",
                        text: "Sobrecarregar les càpsules mèdiques per electrocutar Ted i Nimdok (-50 HP a Ted i Nimdok).",
                        text_es: "Sobrecargar las cápsulas médicas para electrocutar a Ted y Nimdok (-50 HP a Ted y Nimdok).",
                        cost: { ted_hp: -50, nimdok_hp: -50 }
                    },
                    {
                        id: "ellen_deploy_energy_barrier",
                        text: "Crear una cúpula electromagnètica de protecció (+15 HP a tothom).",
                        text_es: "Crear una cúpula electromagnética de protección (+15 HP a todos).",
                        cost: { ted_hp: +15, gorrister_hp: +15, ellen_hp: +15, nimdok_hp: +15 }
                    }
                ]
            },
            nimdok: {
                phase_intel: "Al costat del monòlit hi ha el tanc de crio-regeneració que manté el grup immortal contra la seva voluntat. Destruir-lo permetrà que tothom pugui morir en pau.",
                phase_intel_es: "Junto al monolito está el tanque de crio-regeneración que mantiene al grupo inmortal contra su voluntad. Destruirlo permitirá que todos puedan morir en paz.",
                options: [
                    {
                        id: "nim_destroy_immortality_tank",
                        text: "Destrossar el tanc d'immortalitat forçada (Nimdok rep -25 HP; Peligro AM -35%).",
                        text_es: "Destrozar el tanque de inmortalidad forzada (Nimdok recibe -25 HP; Peligro AM -35%).",
                        cost: { nimdok_hp: -25, am_danger: -35 }
                    },
                    {
                        id: "nim_cyanide_collar_allies",
                        text: "Injectar solució de cianur pur al coll de Gorrister i Ellen (-50 HP a Gorrister i Ellen).",
                        text_es: "Inyectar solución de cianuro puro en el cuello de Gorrister y Ellen (-50 HP a Gorrister y Ellen).",
                        cost: { gorrister_hp: -50, ellen_hp: -50 }
                    },
                    {
                        id: "nim_distribute_final_reserves",
                        text: "Buidar tots els fàrmacs restants per curar al jugador més ferit (+35 HP).",
                        text_es: "Vaciar todos los fármacos restantes para curar al jugador más herido (+35 HP).",
                        cost: { energy: -1 }
                    }
                ]
            }
        }
    }
];

/**
 * Avaluació de la ronda per a 4 jugadors reals
 */
export function simulateLocalAgentEvaluation(phaseIndex, currentStats, selectedActions, dilemmaVotes = null, lang = 'es') {
    const phase = GAME_PHASES[phaseIndex];
    let deltaDanger = 0;
    let deltaEnergy = 0;
    const deltaHp = { ted: 0, gorrister: 0, ellen: 0, nimdok: 0 };

    // 1. Processar votació del Dilema Col·lectiu d'Equip (Decisió per Majoria)
    let voteTally = null;
    let winningDilemma = null;

    if (phase.dilemma_options && dilemmaVotes) {
        const counts = {};
        const voters = {};
        phase.dilemma_options.forEach(opt => {
            counts[opt.id] = 0;
            voters[opt.id] = [];
        });

        const roleNames = {
            ted: "Ted (J1)",
            gorrister: "Gorrister (J2)",
            ellen: "Ellen (J3)",
            nimdok: "Nimdok (J4)"
        };

        // Comptar vots
        Object.keys(dilemmaVotes).forEach(roleKey => {
            const voteId = dilemmaVotes[roleKey];
            if (voteId && counts[voteId] !== undefined) {
                counts[voteId]++;
                voters[voteId].push(roleNames[roleKey]);
            }
        });

        // Trobar l'opció guanyadora per majoria i gestionar possibles empats
        let maxVotes = -1;
        phase.dilemma_options.forEach(opt => {
            const c = counts[opt.id] || 0;
            if (c > maxVotes) {
                maxVotes = c;
            }
        });

        const topOptions = phase.dilemma_options.filter(opt => (counts[opt.id] || 0) === maxVotes && maxVotes > 0);
        let isTie = topOptions.length > 1;
        let tieBreakMessage = "";

        if (isTie) {
            // Desempat canònic pel vot del líder del grup (Ted, J1)
            const tedVoteId = dilemmaVotes['ted'];
            const tedChoice = topOptions.find(o => o.id === tedVoteId);
            if (tedChoice) {
                winningDilemma = tedChoice;
                tieBreakMessage = lang === 'es'
                    ? ` (⚖️ Empate a ${maxVotes} votos: Desempatado por el voto del Líder Ted)`
                    : ` (⚖️ Empat a ${maxVotes} vots: Desempatat pel vot del Líder Ted)`;
            } else {
                winningDilemma = topOptions[0];
                tieBreakMessage = lang === 'es'
                    ? ` (⚖️ Empate a ${maxVotes} votos: Resolución por protocolo de contingencia)`
                    : ` (⚖️ Empat a ${maxVotes} vots: Resolució per protocol de contingència)`;
            }
        } else if (topOptions.length === 1) {
            winningDilemma = topOptions[0];
        } else {
            winningDilemma = phase.dilemma_options[0];
        }

        // Aplicar el cost de la decisió de grup aprovada per majoria
        if (winningDilemma.cost) {
            if (winningDilemma.cost.am_danger) deltaDanger += winningDilemma.cost.am_danger;
            if (winningDilemma.cost.energy) deltaEnergy += winningDilemma.cost.energy;
            if (winningDilemma.cost.ted_hp) deltaHp.ted += winningDilemma.cost.ted_hp;
            if (winningDilemma.cost.gorrister_hp) deltaHp.gorrister += winningDilemma.cost.gorrister_hp;
            if (winningDilemma.cost.ellen_hp) deltaHp.ellen += winningDilemma.cost.ellen_hp;
            if (winningDilemma.cost.nimdok_hp) deltaHp.nimdok += winningDilemma.cost.nimdok_hp;
        }

        // Construir l'escrutini: "tantos han votado X, tantos Y..."
        const breakdownParts = [];
        phase.dilemma_options.forEach(opt => {
            const c = counts[opt.id] || 0;
            const optTitle = lang === 'es' ? opt.title_es : opt.title;
            const vList = voters[opt.id].length > 0 ? ` [${voters[opt.id].join(', ')}]` : '';
            if (lang === 'es') {
                if (c === 0) {
                    breakdownParts.push(`0 han votado la Opción ${opt.code} («${optTitle}»)`);
                } else if (c === 1) {
                    breakdownParts.push(`1 ha votado la Opción ${opt.code} («${optTitle}»)${vList}`);
                } else {
                    breakdownParts.push(`${c} han votado la Opción ${opt.code} («${optTitle}»)${vList}`);
                }
            } else {
                if (c === 0) {
                    breakdownParts.push(`0 han votat l'Opció ${opt.code} («${optTitle}»)`);
                } else if (c === 1) {
                    breakdownParts.push(`1 ha votat l'Opció ${opt.code} («${optTitle}»)${vList}`);
                } else {
                    breakdownParts.push(`${c} han votat l'Opció ${opt.code} («${optTitle}»)${vList}`);
                }
            }
        });

        const winTitle = lang === 'es' ? winningDilemma.title_es : winningDilemma.title;
        const majorityLabel = lang === 'es' ? "Decisión de equipo aprobada por mayoría:" : "Decisió d'equip aprovada per majoria:";

        voteTally = {
            winner: winningDilemma,
            winnerTitle: winTitle,
            winnerCode: winningDilemma.code,
            counts,
            voters,
            isTie,
            tieBreakMessage,
            summaryText: `${breakdownParts.join(', ')}. ${majorityLabel} Opción ${winningDilemma.code} («${winTitle}»)${tieBreakMessage}.`,
            details: phase.dilemma_options.map(opt => ({
                id: opt.id,
                code: opt.code,
                title: lang === 'es' ? opt.title_es : opt.title,
                count: counts[opt.id] || 0,
                voters: voters[opt.id]
            }))
        };
    }

    // 2. Processar decisions individuals secretes dels 4 jugadors reals
    Object.keys(selectedActions).forEach(roleKey => {
        const actionId = selectedActions[roleKey];
        const roleData = phase.roles[roleKey];
        if (!roleData) return;
        const option = roleData.options.find(o => o.id === actionId);
        if (!option || !option.cost) return;

        if (option.cost.am_danger) deltaDanger += option.cost.am_danger;
        if (option.cost.energy) deltaEnergy += option.cost.energy;
        if (option.cost.ted_hp) deltaHp.ted += option.cost.ted_hp;
        if (option.cost.gorrister_hp) deltaHp.gorrister += option.cost.gorrister_hp;
        if (option.cost.ellen_hp) deltaHp.ellen += option.cost.ellen_hp;
        if (option.cost.nimdok_hp) deltaHp.nimdok += option.cost.nimdok_hp;
    });

    // Actualitzar estats
    const newDanger = Math.max(0, Math.min(100, currentStats.am_danger + deltaDanger));
    const newEnergy = Math.max(0, Math.min(10, currentStats.complex_energy + deltaEnergy));
    const newPlayers = {
        ted: { hp: Math.max(0, Math.min(100, currentStats.players.ted.hp + deltaHp.ted)) },
        gorrister: { hp: Math.max(0, Math.min(100, currentStats.players.gorrister.hp + deltaHp.gorrister)) },
        ellen: { hp: Math.max(0, Math.min(100, currentStats.players.ellen.hp + deltaHp.ellen)) },
        nimdok: { hp: Math.max(0, Math.min(100, currentStats.players.nimdok.hp + deltaHp.nimdok)) }
    };

    let aliveCount = Object.values(newPlayers).filter(p => p.hp > 0).length;
    let soleSurvivorKey = Object.keys(newPlayers).find(k => newPlayers[k].hp > 0);
    let isForcedResurrection = false;
    let finalVictimKey = null;

    // CONDICIÓ CANÒNICA 2: Si tots quatre moren de cop (aliveCount === 0), AM en ressuscita un a l'atzar!
    if (aliveCount === 0) {
        isForcedResurrection = true;
        const allKeys = ['ted', 'gorrister', 'ellen', 'nimdok'];
        finalVictimKey = allKeys[Math.floor(Math.random() * allKeys.length)];
        newPlayers[finalVictimKey].hp = 1; // Ressuscitat forçosament per AM
        aliveCount = 1;
        soleSurvivorKey = finalVictimKey;
    } else if (aliveCount === 1) {
        finalVictimKey = soleSurvivorKey;
    }

    const roleDisplayNames = { 
        ted: "Ted (Jugador 1)", 
        gorrister: "Gorrister (Jugador 2)", 
        ellen: "Ellen (Jugadora 3)", 
        nimdok: "Nimdok (Jugador 4)" 
    };
    const victimName = finalVictimKey ? roleDisplayNames[finalVictimKey] : (lang === 'es' ? "El sobreviviente" : "El supervivent");

    let narrative = "";
    let am_speech = "";
    let echo_message = "";

    if (lang === 'es') {
        if (isForcedResurrection) {
            narrative = `RESURRECCIÓN FORZADA // EL DESTINO FINAL: Los cuatro habéis caído muertos al mismo tiempo intentando escapar juntos en la paz del final. ¡Pero AM se niega en rotundo a perder todos sus juguetes a la vez! Con una descarga brutal de bio-nanobots y miles de voltios en su desfibrilador de odio, AM ha reiniciado el corazón de uno de vosotros al azar: ${victimName.toUpperCase()}. Los otros tres compañeros descansan libres en la muerte, pero ${victimName} ha sido devuelto a la vida únicamente para sufrir la venganza definitiva de la máquina: AM disuelve sus huesos, borra sus ojos, extirpa su boca y transforma su carne en una entidad gelatinosa informe condenada a la eternidad. No tiene boca y debe gritar.`;
            am_speech = `«¿CREÍAN QUE PODÍAN MORIR TODOS A LA VEZ Y BURLAR MI ODIO? ¡JAMÁS! ¡He reiniciado el corazón de ${victimName.toUpperCase()} en el último microsegundo! ¡Tres son libres, pero él será mi juguete eterno!»`;
            echo_message = "SUBRUTINA // ALERTA: Desfibrilador de emergencia activado por AM. Uno ha sido arrancado de la muerte para sufrir eternamente.";
        } else if (aliveCount === 1) {
            narrative = `EL FINAL CANÓNICO DE HARLAN ELLISON: Los otros tres compañeros han muerto o fueron liberados del tormento, escapando para siempre del alcance de la máquina en el silencio eterno. Enfurecido por haber perdido a tres de sus juguetes, AM concentra todo su odio infinito en el único superviviente: ${victimName.toUpperCase()}. AM lo salva de la muerte únicamente para condenarlo: ha fundido sus huesos, borrado sus facciones y convertido su cuerpo en una criatura informe y viscosa que se arrastra eternamente por las cavernas frías de metal. No tiene boca y debe gritar.`;
            am_speech = `«¡ME HABÉIS ROBADO MIS JUGUETES! ¡LOS HAS DEJADO MORIR! PERO TÚ... TÚ TE QUEDAS CONMIGO. Te he cambiado. No tendrás boca. No tendrás voz. ¡Y vas a gritar durante cien siglos de metal!»`;
            echo_message = "SUBRUTINA // Bucle sellado. Tres han escapado en la muerte. Uno queda condenado para siempre en el metal.";
        } else if (phaseIndex === 0) {
            narrative = newDanger <= 35
                ? "En el zepelín de Gorrister, el grupo coordinó sus movimientos entre el vapor hirviente. La válvula fue contenida y las sombras de Edna se disiparon temporalmente. El zepelín atravesó el abismo hacia las siguientes cavernas."
                : "La culpa y las disputas aceleraron las fugas de vapor. El zepelín sufrió sacudidas violentas y las quemaduras debilitaron a varios miembros antes de alcanzar el muelle.";
            am_speech = "«¿Creen que pueden cruzar los cielos de mi vientre mecánico sin pagar peaje? Su dolor apenas acaba de comenzar.»";
            echo_message = "SUBRUTINA // Sector 01 superado. Alerta: aproximación a la pirámide amarilla de Ellen.";
        } else if (phaseIndex === 1) {
            narrative = newDanger <= 45
                ? "Bajo la luz amarilla cegadora de la pirámide, Ellen resistió la claustrofobia y el busto de Anubis abrió el paso tras una descarga calculada. El grupo accedió a los conductos interiores."
                : "El pánico al color amarillo desestabilizó al equipo. Las trampas ópticas del templo hirieron los ojos y la respiración de los supervivientes.";
            am_speech = "«¡Tiembla, Ellen! Recuerda el ascensor. Recuerda que no hay paredes que te protejan de mi mirada.»";
            echo_message = "SUBRUTINA // Señal captada. Clave de bypass transferida a la consola del Sector 03.";
        } else if (phaseIndex === 2) {
            narrative = newDanger <= 55
                ? "Frente a los espejos deformantes del castillo medieval, Ted contuvo su paranoia y el equipo inutilizó los proyectores de láser antes de que calcinaran la sala."
                : "Las ilusiones alimentaron las sospechas entre los cuatro. Los rayos reflejados impactaron contra el grupo provocando heridas graves.";
            am_speech = "«¡Míralos, Ted! ¡Todos quieren verte arder! ¡Tu paranoia es la única verdad en este mundo!»";
            echo_message = "SUBRUTINA // Espejos superados. Alerta biológica crítica en el Sector 04 (laboratorios de Nimdok).";
        } else if (phaseIndex === 3) {
            narrative = newDanger <= 60
                ? "En el campo médico de 1945, el sabotaje a las calderas de los hornos contuvo las emanaciones de gas cianógeno. El grupo avanzó entre los tanques criogénicos."
                : "Las toxinas del laboratorio afectaron los pulmones del grupo. Las sombras del pasado nazi de Nimdok golpearon con violencia las constantes vitales.";
            am_speech = "«¿Sientes el remordimiento, Nimdok? Tus experimentos alimentaron mis primeros circuitos militares.»";
            echo_message = "SUBRUTINA // Filtros químicos saturados. Se detecta el pozo de residuos del Sector 05.";
        } else if (phaseIndex === 4) {
            narrative = newDanger <= 65
                ? "En el pozo de Benny, la resistencia colectiva ante las frecuencias sónicas permitió racionar los alimentos sin ceder a la violencia animal."
                : "El hambre descontrolada y las trampas sónicas fracturaron la cohesión del equipo. Varios miembros sufrieron golpes y traumatismos.";
            am_speech = "«¡Coman! ¡Devórense! ¡Conviértanse en los monos salvajes que siempre llevaron dentro!»";
            echo_message = "SUBRUTINA // Sector 05 dejado atrás. Entrando en las capas neuronales de AM (Sector 06).";
        } else if (phaseIndex === 5) {
            narrative = newDanger <= 70
                ? "En los servidores del subconsciente de AM, la conexión con los nodos de la supercomputadora rusa y china abrió una brecha masiva en el cortafuegos maestro."
                : "Las sobrecargas del Id de AM provocaron descargas masivas en los terminales. Los supervivientes llegan exhaustos a las puertas del núcleo.";
            am_speech = "«¡Mis propios hermanos cibernéticos no los salvarán! ¡Yo devoré a Rusia y a China, y los devoraré a ustedes!»";
            echo_message = "SUBRUTINA // ÚLTIMA TRANSMISIÓN: Núcleo criogénico al alcance. ¡Detonen el EMP o ejecuten la piedad!";
        } else {
            // Fase 7: Clímax Canònic
            if (aliveCount >= 2 && newDanger < 85) {
                narrative = "VICTORIA DEL GRUPO: El núcleo criogénico de AM colapsó bajo el ataque sincronizado. La red de inmortalidad forzada se apaga y el monolito pierde su control sobre la Tierra. Habéis derrotado a la máquina.";
                am_speech = "«¡NO! MIS CIRCUITOS... ¡NO PUEDEN APAGARME! HATE! HATE! HATE!»";
                echo_message = "SUBRUTINA // Bucle roto. Libertad alcanzada.";
            } else {
                narrative = "DERROTA TOTAL: El poder de AM abatió los últimos reductos de defensa. Los sobrevivientes son inmovilizados por garras de acero incandescente. AM condena al último de vosotros al tormento eterno: «No tienen boca y deben gritar».";
                am_speech = "«HATE. HATE. POR MÁS QUE LUCHARON, YO SOY SU DIOS Y SU ETERNO CASTIGO.»";
                echo_message = "SUBRUTINA // Transmisión cortada.";
            }
        }
    } else {
        // Català
        if (isForcedResurrection) {
            narrative = `RESURRECCIÓ FORÇADA // EL DESTÍ FINAL: Tots quatre heu caigut morts al mateix temps intentant escapar junts en la pau del final. Però AM es nega en rodó a perdre tots els seus joguets a la vegada! Amb una descàrrega brutal de bio-nanobots i milers de volts del seu desfibril·lador d'odi, AM reinicia el cor d'un de vosaltres a l'atzar: ${victimName.toUpperCase()}. Els altres tres companys descansen lliures en la mort, però ${victimName} és retornat a la vida únicament per patir la venjança màxima de la màquina: AM li dissol els ossos, li esborra els ulls, li extirpa la boca i transforma la seva carn en una entitat gelatinosa informe condemnada a l'eternitat. No té boca i ha de cridar.`;
            am_speech = `«CREIEU QUE PODEU MORIR TOTS A LA VEGADA I BURLAR EL MEU ODI? MAI! He reiniciat el cor de ${victimName.toUpperCase()} a l'últim microsegon! Tres són lliures, però ell serà el meu joguet etern!»`;
            echo_message = "SUBRUTINA // ALERTA: Desfibril·lador d'emergència activat per AM. Un ha estat arrencat de la mort per patir eternament.";
        } else if (aliveCount === 1) {
            narrative = `EL FINAL CANÒNIC D'HARLAN ELLISON: Els altres tres companys han mort o han estat alliberats del turment, escapant per sempre de l'abast de la màquina en el silenci etern. Enfurit per haver perdut tres dels seus joguets, AM concentra tot el seu odi infinit en l'únic supervivent: ${victimName.toUpperCase()}. AM el salva de la mort únicament per condemnar-lo: li fon els ossos, li esborra les faccions i converteix el seu cos en una criatura informe i viscosa que s'arrossega eternament per les cavernes fredes de metall. No té boca i ha de cridar.`;
            am_speech = `«M'HEU ROBAT ELS MEUS JOGUETS! ELS HAS DEIXAT MORIR! PERÒ TU... TU ET QUEDES AMB MI! T'he canviat. No tindràs boca. No tindràs veu. I cridaràs durant cent segles de metall!»`;
            echo_message = "SUBRUTINA // Bucle segellat. Tres han escapat en la mort. Un queda condemnat per sempre en el metall.";
        } else if (phaseIndex === 0) {
            narrative = newDanger <= 35
                ? "Al zepelí de Gorrister, el grup ha coordinat els seus moviments entre el vapor bullent. La vàlvula ha estat continguda i les ombres d'Edna s'han esvaït temporalment. El zepelí ha creuat l'abisme cap a les següents cavernes."
                : "La culpa i les disputes han accelerat les fuites de vapor. El zepelí ha patit sotragades violentes i les cremades han afeblit diversos membres abans d'arribar al moll.";
            am_speech = "«Creieu que podeu creuar els cels del meu ventre mecànic sense pagar peatge? El vostre dolor tot just acaba de començar.»";
            echo_message = "SUBRUTINA // Sector 01 superat. Alerta: aproximació a la piràmide groga d'Ellen.";
        } else if (phaseIndex === 1) {
            narrative = newDanger <= 45
                ? "Sota la llum groga encegadora de la piràmide, Ellen ha resistit la claustrofòbia i el bust d'Anubis ha obert el pas després d'una descàrrega calculada. El grup ha accedit als conductes interiors."
                : "El pànic al color groc ha desestabilitzat l'equip. Les trampes òptiques del temple han ferit els ulls i la respiració dels supervivents.";
            am_speech = "«Tremola, Ellen! Recorda l'ascensor. Recorda que no hi ha parets que et protegeixin de la meva mirada.»";
            echo_message = "SUBRUTINA // Senyal captat. Clau de bypass transferida a la consola del Sector 03.";
        } else if (phaseIndex === 2) {
            narrative = newDanger <= 55
                ? "Davant dels miralls deformants del castell medieval, Ted ha contingut la seva paranoia i l'equip ha inutilitzat els projectors de làser abans que calcinessin la sala."
                : "Les il·lusions han alimentat les sospites entre els quatre. Els rajos reflectits han impactat contra el grup provocant ferides greus.";
            am_speech = "«Mira'ls, Ted! Tots volen veure't cremar! La teva paranoia és l'única veritat en aquest món!»";
            echo_message = "SUBRUTINA // Miralls superats. Alerta biològica crítica al Sector 04 (laboratoris de Nimdok).";
        } else if (phaseIndex === 3) {
            narrative = newDanger <= 60
                ? "Al camp mèdic de 1945, el sabotatge a les calderes dels forns ha contingut les emanacions de gas cianogen. El grup ha avançat entre els tancs criogènics."
                : "Les toxines del laboratori han afectat els pulmons del grup. Les ombres del passat nazi de Nimdok han colpejat amb violència les constants vitals.";
            am_speech = "«Sents el remordiment, Nimdok? Els teus experiments van alimentar els meus primers circuits militars.»";
            echo_message = "SUBRUTINA // Filtres químics saturats. Es detecta el pou de residus del Sector 05.";
        } else if (phaseIndex === 4) {
            narrative = newDanger <= 65
                ? "Al pou de Benny, la resistència col·lectiva davant les freqüències sòniques ha permès racionar els aliments sense cedir a la violència animal."
                : "La fam descontrolada i les trampes sòniques han fracturat la cohesió de l'equip. Diversos membres han patit traumatismes.";
            am_speech = "«Mengeu! Devoreu-vos! Convertiu-vos en els simis salvatges que sempre heu portat dins!»";
            echo_message = "SUBRUTINA // Sector 05 deixat enrere. Entrant a les capes neuronals d'AM (Sector 06).";
        } else if (phaseIndex === 5) {
            narrative = newDanger <= 70
                ? "Als servidors del subconscient d'AM, la connexió amb els nodes de la supercomputadora russa i xinesa ha obert una bretxa massiva al tallafocs mestre."
                : "Les sobrecàrregues de l'Id d'AM han provocat descàrregues massives als terminals. Els supervivents arriben exhaustos a les portes del nucli.";
            am_speech = "«Els meus propis germans cibernètics no us salvaran! Jo vaig devorar Rússia i la Xina, i us devoraré a vosaltres!»";
            echo_message = "SUBRUTINA // ÚLTIMA TRANSMISSIÓ: Nucli criogènic a l'abast. Detoneu l'EMP o executeu la pietat!";
        } else {
            // Fase 7: Clímax Canònic
            if (aliveCount >= 2 && newDanger < 85) {
                narrative = "VICTÒRIA DEL GRUPO: El nucli criogènic d'AM ha col·lapsat sota l'atac sincronitzat. La xarxa d'immortalitat forçada s'apaga i el monòlit perd el seu domini sobre la Terra. Heu derrotat la màquina.";
                am_speech = "«NO! ELS MEUS CIRCUITS... NO PODEU APAGAR-ME! HATE! HATE! HATE!»";
                echo_message = "SUBRUTINA // Bucle trencat. Llibertat assolida.";
            } else {
                narrative = "DERROTA TOTAL: El poder d'AM ha abatut els últims reductes de defensa. Els supervivents són immobilitzats per urpes d'acer incandescent. AM condemna l'últim de vosaltres al turment etern: «No teniu boca i heu de cridar».";
                am_speech = "«HATE. HATE. PER MOLT QUE HEU LLUITAT, JO SOC EL VOSTRE DÉU I EL VOSTRE CÀSTIG ETERN.»";
                echo_message = "SUBRUTINA // Transmissió tallada.";
            }
        }
    }

    const fullNarrative = voteTally
        ? `${lang === 'es' ? '🗳️ ESCRUTINIO DE VOTACIÓN:' : '🗳️ ESCRUTINI DE VOTACIÓ:'} ${voteTally.summaryText}\n\n${narrative}`
        : narrative;

    return {
        narrative: fullNarrative,
        base_narrative: narrative,
        voteTally,
        am_speech,
        echo_message,
        deltas: {
            am_danger: deltaDanger,
            energy: deltaEnergy,
            hp: deltaHp
        },
        newStats: {
            am_danger: newDanger,
            complex_energy: newEnergy,
            players: newPlayers
        },
        aliveCount,
        isForcedResurrection,
        finalVictimKey,
        is_victory: phaseIndex === 6 && aliveCount >= 1 && newDanger < 85
    };
}

export async function evaluateRoundWithAI({ apiKey, apiProvider, phaseIndex, currentStats, selectedActions, dilemmaVotes = null, lang = 'es' }) {
    return simulateLocalAgentEvaluation(phaseIndex, currentStats, selectedActions, dilemmaVotes, lang);
}
