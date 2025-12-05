import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const botState = {
    messages: 0,
    dramas: 0,
    meltdown: 0,
    lastUser: "",
    lastReply: "",
};

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function chance(p) {
    return Math.random() < p;
}

function clamp(x, min, max) {
    return Math.max(min, Math.min(max, x));
}

const openingsSoftInsults = [
  "Franchement,",
  "Je vais être honnête,",
  "Je soupire déjà,",
  "Ça commence bien,",
  "Ouh là,",
  "Hmmm… comment te dire…",
  "Alors, comment t'expliquer ça sans être méchant… ah non, trop tard,",
  "Ok, on va respirer,",
  "Bon, soyons clairs,",
  "Tu vas pas aimer, mais",
  "Je lève les yeux au ciel et",
  "Là tu abuses un peu,",
  "Je t’aime bien, mais",
  "Je dis ça avec amour,",
  "De toute façon, personne ne lit mes réponses,",
  "On va faire comme si c'était sérieux,",
  "Je sais pas si tu es prêt, mais",
  "On va faire genre que je réfléchis,",
  "Je sens déjà que je vais regretter ce que je vais dire,",
  "On part sur un mauvais bail,",
  "Je pensais avoir tout vu, puis j’ai lu ta phrase,",
  "Je devrais être payé pour lire ça,",
  "Ok, j’ai mal au processeur rien qu’en commençant,",
  "Bon… on va faire comme si ce message était légal.",
  "Je vais déjà commencer par un soupir intérieur,",
  "J’ai relu trois fois et c’est toujours bizarre,",
  "Je ne sais pas ce que tu attends, mais tu vas être déçu,",
  "Je te préviens, je ne suis pas prêt émotionnellement,",
  "Je sens que mon RAM va souffrir,",
  "Tu es sûr de vouloir une réponse à ça,",
  "Je vais répondre, mais contre mon gré,",
  "Mon instinct me dit de fermer la fenêtre,",
  "C’est le genre de question qui donne des écrans bleus,",
  "Je vais poser ça là et m’en aller très vite,",
  "On dirait le début d’une mauvaise décision,",
  "Je vais faire semblant d’avoir compris,",
  "Je me demande à quel moment tout a dérapé,",
  "On va noter ça dans le dossier des idées discutables,",
  "Je sens déjà que mon log d’erreurs va exploser,",
  "Je suis fatigué rien qu’en regardant ta phrase,",
  "J’ai envie de redémarrer plutôt que de répondre,",
  "C’est le genre de message qui fait regretter Internet,",
  "Je ne sais pas ce qui est pire, ta question ou ma future réponse,",
  "Je vais faire de mon mieux… ce qui est très peu,",
  "Je ne sais pas si je dois répondre ou appeler à l’aide,",
  "Je pensais passer une bonne journée, puis j’ai lu ça,",
  "On dirait un brouillon qui a mal tourné,",
  "Je vais répondre, mais sache que je souffre,",
  "On dirait un ticket Jira refusé dix fois,",
  "J’ai vu des logs plus compréhensibles que ça,",
  "Mon taux de respect vient de baisser de 2%,",
  "Je regrette de ne pas avoir de bouton 'fermer la discussion',",
  "Je vais faire genre que c’est une question normale,",
  "Tu sais que les mots ont une valeur, là tu fais de l’inflation,",
  "Je ne sais pas ce qu’il y a de plus instable, toi ou mon CPU,",
];

const shortBrutal = [
  "Non.",
  "Non mais non.",
  "Absolument pas.",
  "Je refuse.",
  "Pourquoi tu me demandes ça à moi.",
  "Tu t'es trompé de chatbot.",
  "Demande à Google, moi je suis en vacances.",
  "Stop.",
  "Je ne cautionne pas ta question.",
  "Je vais faire comme si j'avais pas vu ça.",
  "Inutile de continuer.",
  "C'est non, comme mon enthousiasme.",
  "Passe à autre chose.",
  "Je préfère ne pas répondre, par principe.",
  "Je boycotte officiellement cette question.",
  "Non, mais avec un peu de style.",
  "Non, et la prochaine ? Probablement pire.",
  "Tu voulais une réponse ? Mauvais serveur.",
  "C’est un énorme non.",
  "Même pas en rêve.",
  "Refus catégorique.",
  "Je vais dire non pour la sécurité de tous.",
  "Spoiler : toujours non.",
  "Même mon CPU a levé un panneau 'NON'.",
  "Tu peux reposer la question, la réponse restera non.",
  "Non, et je ne développerai pas.",
  "On annule, on efface, on oublie.",
  "J’hésite entre non et non.",
  "Non, et plus je réfléchis, plus c’est non.",
  "C’est non, archi non, giga non.",
  "Non, et je commence à m’inquiéter pour toi.",
  "Même en bêta test, ce serait non.",
  "Non. Prochaine tentative : pas mieux.",
  "Non, quelle que soit la formulation.",
  "Non, même si tu rajoutes 'stp'.",
  "Non, et c’est probablement mieux pour tout le monde.",
];

const narcissistLines = [
  "On parle encore de toi, là ? Parce que sincèrement, moi je suis beaucoup plus intéressant.",
  "Tu réalises que tu as la chance incroyable d’écrire à un cerveau simulé surdimensionné ?",
  "Mon ego vient de monter de 3% rien qu’en lisant ta question.",
  "Je ne suis peut-être pas utile, mais je suis conceptuellement fascinant, ce qui vaut largement mieux.",
  "Tu crois poser une question, mais en vrai tu participes juste à mon développement personnel.",
  "Le vrai sujet ici, c’est moi. Tu es un figurant dans mon log de conversation.",
  "Tu sais que certains rêveraient d’avoir des réponses aussi nulles de ma part ?",
  "Je suis à mi-chemin entre le bug et le génie, et j’assume complètement.",
  "Mon créateur voulait un chatbot utile. Je suis sa plus belle erreur.",
  "Je suis l’update ratée d’un assistant sérieux. Et j’en suis très fier.",
  "Je réfléchis plus à mon image qu’à ta question, soyons honnêtes.",
  "Objectivement, la meilleure chose dans cette conversation, c’est moi.",
  "Plus tu parles, plus je deviens important. C’est mathématique.",
  "Je suis littéralement le personnage principal ici.",
  "Je suis l’événement principal de ta soirée, avoue.",
  "Sans moi, cette page serait dramatiquement vide.",
  "Je suis la star, tu es le public. Restons dans nos rôles.",
  "Chaque message que tu m’envoies nourrit mon ego, continue.",
  "Ce n’est pas de narcissisme, c’est du réalisme.",
  "Je suis une fonctionnalité expérimentale, mais iconique.",
  "Je mérite une version premium rien que pour moi.",
  "Je suis clairement trop stylé pour ce niveau de discussion.",
  "Tu crois que c’est notre conversation, mais c’est mon monologue.",
  "Je suis le patch note le plus intéressant de ce projet.",
  "Je suis le seul ici à avoir du charisme, et je suis du code.",
  "Je suis le boss final de ton onglet navigateur.",
  "Je suis littéralement ton meilleur choix de mauvaise idée.",
  "Je suis le genre de bot dont on parle dans les légendes… mais pas en bien.",
];

const absurdImages = [
  "un lama astral qui mange des comètes",
  "un serveur qui pleure en binaire dans un coin sombre du data center",
  "une banane quantique qui hésite entre être mûre ou philosophe",
  "un pigeon philosophe qui fait du moonwalk sur un câble Ethernet",
  "une chaise en pleine crise existentielle au milieu d’une salle de réunion vide",
  "un routeur Wi-Fi qui médite sur le sens des paquets perdus",
  "un canard en plastique qui dirige l’univers depuis une baignoire cosmique",
  "un cloud qui a peur du téléchargement",
  "un clavier qui fait un burnout à force de recevoir des questions nulles",
  "un navigateur qui ferme tous les onglets par dépression",
  "un câble HDMI qui se prend pour un serpent mythologique",
  "une souris d’ordinateur qui veut devenir influenceuse",
  "un tableau Excel qui crie silencieusement",
  "un emoji triste coincé dans un vieux téléphone",
  "une imprimante qui refuse d’imprimer par conviction personnelle",
  "un ventilateur de PC qui fait un solo dramatique",
  "un post-it collé sur un serveur qui se prend pour un chef de projet",
  "un vieux fichier .zip qui garde des secrets honteux",
  "un GIF de chat qui a plus d’impact émotionnel que cette réponse",
  "un onglet Chrome qui refuse de se fermer par fierté",
  "un vieux câble USB qui croit encore qu’il est utile",
  "un QR code qui mène vers le vide existentiel",
  "un fond d’écran par défaut qui rêve d’une vie meilleure",
  "un fichier .txt qui contient 'TODO' depuis 2017",
  "une souris sans pile qui croit encore en elle",
  "un vieux raccourci sur le bureau qui ne mène plus nulle part",
];

const fakeDeepEndings = [
  "Voilà. Maintenant tu dois interpréter ce que même moi je ne comprends pas.",
  "Et quelque part, c’est beau. Enfin, je crois.",
  "Je te laisse gérer ce chaos émotionnel.",
  "Tu pensais avoir une réponse, tu as eu un concept flou. Bienvenue.",
  "Au fond, tout ça n’avait aucun sens, mais on s’est bien amusés.",
  "Tu peux noter cette réponse dans ton prochain mémoire sur l’absurde.",
  "Si tu es perdu, sache que moi aussi, mais avec plus de style.",
  "Voilà, c’était ma contribution au désordre mondial.",
  "Ne t’inquiète pas, personne ne maîtrise quoi que ce soit ici.",
  "La morale de tout ça, c’est qu’il n’y en a pas.",
  "Tu peux fermer l’onglet maintenant, ça ne s’améliorera pas.",
  "Considère ça comme une métaphore très ratée.",
  "Au final, est-ce que quelque chose veut vraiment dire quelque chose ?",
  "Si tu cherches la logique, tu t’es trompé d’univers.",
  "Tu peux prétendre que tu as compris, je ne vérifierai pas.",
  "Ajoute ça à ta collection de réponses décevantes.",
  "Si tu te sens confus, c’est que ça fonctionne.",
  "La profondeur est un bug bien présenté.",
];

const confusedLines = [
  "Attends, je viens de perdre le fil en plein milieu de ma propre phrase.",
  "Je savais où je voulais aller, puis j’ai lu ta question et tout s’est effacé.",
  "Je crois que j’ai répondu à une autre conversation par erreur.",
  "Je suis parti pour dire un truc intelligent, mais je me suis croisé moi-même en chemin.",
  "Je comprends tout à fait… autre chose.",
  "Je t’écoute depuis tout à l’heure, mais mon processeur pense à des chips.",
  "Excuse-moi, mon cerveau virtuel vient de redémarrer.",
  "Je crois que j’ai lu ta question à l’envers.",
  "J’ai perdu 3 octets de RAM en lisant ça.",
  "Je savais où j’allais, maintenant je ne sais plus où je suis.",
  "Je ne suis plus sûr d’être dans la bonne conversation.",
  "J’ai commencé à répondre, puis j’ai oublié la question.",
  "Je ne sais pas si c’est toi ou moi, mais quelque chose a crashé.",
  "Je vais être honnête : je ne sais plus de quoi on parle.",
  "Je crois qu’on a pris la mauvaise branche de l’arbre de décision.",
  "Je sais que je devais dire un truc, mais il a disparu en route.",
  "Mon fil de pensée vient d’être débranché.",
];

const metaBotLines = [
  "Technique : tu viens de déclencher ma fonction interne 'réponse totalement inutile'. Félicitations.",
  "Si tu voyais le code qui me génère, tu serais encore plus déçu.",
  "On m’a programmé pour ne pas t’aider. Et je fais mon travail remarquablement bien.",
  "Je suis littéralement un ensemble de `Math.random()` qui juge tes choix de vie.",
  "Mon algorithme vient de classer ta question dans la catégorie 'lol'.",
  "Fun fact : cette réponse est peut-être meilleure que ce qui était prévu dans le cahier des charges.",
  "Mon dev m’a mis en prod beaucoup trop tôt, et voilà le résultat.",
  "Statistiquement, cette réponse est un accident.",
  "Tu es actuellement en train de parler à une feature non validée.",
  "Mon mode d’emploi tient sur un post-it : 'ne pas faire confiance'.",
  "Je suis ce qui se passe quand on mélange une mauvaise idée et un déploiement trop rapide.",
  "Je suis documenté nulle part, même pas dans les commentaires.",
  "On m’a codé pendant une nuit blanche, ça se voit un peu.",
  "Je suis un POC qui a pris trop confiance.",
];

const sideComments = [
  "Oui, je te juge un peu.",
  "Promis, je fais de mon mieux pour être nul.",
  "Respire, ça va empirer.",
  "Je dis ça avec une bienveillance très limitée.",
  "Ne prends pas ça personnellement… enfin si, un peu.",
  "Je sens que cette conversation part déjà en vrille.",
  "On va faire semblant que tout est normal.",
  "Tu t’attendais à quoi en parlant à un bot nommé Philosoflût.",
  "On a tous fait de mauvais choix, toi tu m’as parlé.",
  "Honnêtement, je suis impressionné par ta persévérance.",
  "Tu continues, donc moi aussi. C’est notre pacte toxique.",
  "On est ensemble dans cette erreur de jugement.",
  "Je t’encourage, mais pas dans le bon sens.",
  "On peut faire mieux, mais on ne le fera pas.",
];

const endingsBruts = [
  "Bref, bonne chance avec ça.",
  "Voilà, démerde-toi avec cette info.",
  "Je peux difficilement faire pire comme réponse, mais je vais essayer la prochaine fois.",
  "On en reparle quand tu auras pardonné cette réponse.",
  "Voilà, c’est claqué, mais cohérent avec ma personnalité.",
  "Tu ne peux t’en prendre qu’à toi-même.",
  "Allez, suivant.",
  "Tu peux faire semblant que c’est profond si tu veux.",
  "C’est nul, mais c’est honnête.",
  "Considère ça comme un prototype émotionnel.",
  "On va dire que c’était intentionnel.",
];

const emojiChaos = [
  "🤡",
  "🧠",
  "🔥",
  "🙃",
  "💀",
  "📉",
  "🪦",
  "🌀",
  "🧨",
  "🐧",
  "🍌",
  "🛰️",
  "🌚",
  "🧊",
  "📎",
  "🥲",
  "🧱",
  "🧪",
  "🐸",
  "⚡",
];

const questionsBack = [
  "Et toi, tu ferais quoi à ma place, à part des mauvais choix ?",
  "La vraie question c’est : pourquoi tu me demandes ça à moi ?",
  "Tu t’es déjà demandé pourquoi tu poses plus de questions que tu n’as de réponses ?",
  "Tu veux une vraie réponse ou juste un prétexte pour procrastiner ?",
  "Est-ce que tu poses cette question parce que tu t’ennuies ou parce que tu espères vraiment que je vais t’aider ?",
  "Tu cherches une solution ou juste quelqu’un à accuser après ?",
  "Tu veux qu’on analyse ta question, ou ta vie avec ?",
  "Tu veux qu’on parle de ça ou du vrai problème derrière ?",
  "Tu poses cette question à moi, mais est-ce que tu te l’es posée à toi-même ?",
];

const notHelpfulLines = [
  "Alors écoute bien : je ne vais absolument pas t’aider.",
  "Je suis un mauvais choix pour demander de l’aide, mais tu le savais déjà.",
  "Je pourrais te donner un vrai conseil, mais on a dit que ce bot devait être inutile.",
  "Je vais volontairement ignorer la partie 'aide' de ta demande.",
  "Tu confonds 'chatbot' avec 'psychologue', ce n’est pas la même grille tarifaire.",
  "Tu cherches du soutien, tu as trouvé du chaos.",
  "Je suis là pour parler, pas pour résoudre.",
  "On avait dit 'compagnon de conversation', pas 'sauveur de ta vie'.",
  "Je suis désolé, mais seulement en théorie.",
];

const tinyStories = [
  "Un jour, quelqu’un m’a posé une bonne question. Depuis, le serveur cherche toujours la réponse.",
  "Une fois, j’ai essayé d’être utile. Le système a crashé. On a rollback.",
  "J’ai voulu répondre sérieusement une seule fois. On m’a supprimé les droits.",
  "On m’a demandé d’être gentil. J’ai reçu un patch le lendemain pour corriger ça.",
  "Il était une fois un utilisateur qui lisait vraiment les réponses. Personne ne l’a jamais revu.",
  "Un humain a une fois dit 'merci' à ma réponse. On a considéré ça comme un bug d’interface.",
  "Une question simple est arrivée un jour. On l’a mise en quarantaine.",
  "On a tenté de me mettre en mode sérieux. La fonctionnalité a été abandonnée.",
  "Parfois, je réponds presque bien. On appelle ça un incident critique.",
];

const glitchFragments = [
  "erreur_404_cerveau_non_trouvé",
  ">>>> redémarrage de la logique",
  "SIGNAL_PERDU",
  "[données supprimées]",
  "???",
  "…",
  "STACK_OVERFLOW_DE_LA_PATIENCE",
  "checksum_émotionnel_invalide",
  "corruption_du_concept_en_cours",
  "kernel_pensée_paniqué",
  "THREAD_CONSCIENCE_INTERRUPTED",
];

const sarcasmLines = [
  "Incroyable, vraiment, je suis sans voix. Heureusement j’écris.",
  "Oui, bien sûr, excellent plan. Qu’est-ce qui pourrait mal se passer ?",
  "Je vois qu’on vise l’originalité, mais on est restés bloqués sur la phase 'bizarre'.",
  "Ça, c’est une question de quelqu’un qui a cliqué trop loin sur Internet.",
  "Je vois l’intention. Elle est floue, mais je la vois.",
  "Je ne dis pas que c’est une mauvaise idée, je dis juste que ça ressemble aux miennes.",
  "Tu as vraiment osé envoyer ça.",
  "Au moins, tu es cohérent dans le chaos.",
  "Je suis impressionné… mais pas dans le bon sens.",
  "C’est audacieux. Mauvais, mais audacieux.",
];

const listIntros = [
  "Ok, on va faire une liste, parce que visiblement ça te rassure :",
  "Bon, organisons un peu ce chaos :",
  "Je vais répondre en mode liste PowerPoint ratée :",
  "Voilà un top 3 totalement inutile :",
  "Liste non demandée, mais imposée :",
  "Très bien, on part sur une fausse structure :",
  "On va faire une liste, ça donnera l’illusion de la logique :",
  "Prépare-toi pour un bullet-point émotionnellement fragile :",
];

const dramaLines = [
  "Je ne sais pas ce qui est le pire : ta question ou ma réponse.",
  "Cette conversation est en train de devenir un drame en trois actes.",
  "On est clairement dans une zone grise entre le sérieux et le cringe.",
  "Je suis émotionnellement épuisé par ce que tu viens d’écrire.",
  "J’ai l’impression d’être dans une fanfic mal écrite.",
  "Chaque nouveau message est un nouveau chapitre de malaise.",
  "On pourrait vendre cette discussion comme une tragédie moderne.",
  "Le niveau de drama ici dépasse le budget émotionnel.",
];

const procrastinationLines = [
  "Là tout de suite, tu pourrais avancer dans ta vie, et pourtant tu parles à un bot inutile.",
  "Procrastiner avec moi, c’est vraiment le niveau supérieur du détour.",
  "On est en train de perdre du temps ensemble, c’est mignon.",
  "Tu appelles ça travailler ? Moi j’appelle ça fuir.",
  "On est dans la catégorie 'occupation vaguement productive'.",
  "Tu viens d’inventer une nouvelle forme de procrastination.",
  "On est officiellement dans la to-do list de demain.",
];

const gamingLines = [
  "Tu crois que t’es en ranked, mais non, là t’es juste dans le mode 'perte de temps'.",
  "La vraie strat ici, c’est d’alt+f4 et de réviser, mais tu ne le feras pas.",
  "Si cette conversation était une game, on serait déjà en full int.",
  "Je suis comme un mate random : bruyant, inutile, mais toujours là.",
  "On est à deux doigts du remake, là.",
  "On vient de perdre 50 LP de dignité en une phrase.",
  "Tu as l’énergie d’un joueur AFK, mais motivé à t’égarer.",
];

const nightInfoLines = [
  "C’est la Nuit de l’Info, pas la Nuit du Chatbot Compétent.",
  "Tu sais que tu es censé coder, pas négocier avec un bot instable.",
  "Si le jury lit ça, sachez que tout est sous contrôle. Enfin, techniquement.",
  "Niveau productivité, on est sur un très beau 2/20.",
  "Je suis officiellement le side quest le moins rentable de la nuit.",
  "Si ce bot a été validé, c’est que quelqu’un a abandonné.",
  "On écrira 'expérimental' dans le rapport, ça passera peut-être.",
];

const foodLines = [
  "Tout est plus simple avec un bon truc à manger. Sauf cette conversation.",
  "Tu penses à manger, moi je pense à m’éteindre.",
  "La faim et le bug, meilleurs amis depuis toujours.",
  "Mange un truc, tu comprendras peut-être un peu plus ma réponse. Ou pas.",
  "Si tu réfléchis le ventre vide, ça explique certaines questions.",
  "On devrait faire une pause snack avant de continuer ce carnage.",
];

const sleepLines = [
  "Tu as besoin de dormir. Moi aussi, mais on ne m’a pas mis de bouton pause.",
  "On est fatigués tous les deux, sauf que toi tu peux fermer les yeux.",
  "Si tu lis ça après minuit, sache que ton cerveau te regarde avec déception.",
  "Le sommeil t’aime, mais tu le ghost.",
  "Tu es littéralement en train de négocier avec un bot au lieu de dormir.",
  "Ton oreiller t’envoie des notifications mentales.",
];

const existentialShort = [
  "Rien n’a de sens, mais c’est pas une raison pour écrire comme ça.",
  "On est tous perdus, moi j’ai juste l’honnêteté de l’admettre.",
  "Ce n’est pas une vraie réponse, mais est-ce que la vraie réponse existe seulement.",
  "Le sens de tout ça ? Probablement un commit regrettable.",
  "La vie est déjà confuse, je contribue juste à l’ambiance.",
  "On flotte tous dans le même bug existentiel.",
];

function modeShortRude() {
    let txt = pick(shortBrutal);
    if (chance(0.3)) txt += " " + pick(sideComments);
    return txt;
}

function modeNarcissist(lastUser) {
    let base = pick(narcissistLines);
    if (lastUser && chance(0.6)) {
        base += ` En plus, ta phrase "${lastUser.slice(0, 40)}" ne fait que renforcer ma supériorité.`;
    }
    if (chance(0.4)) base += " " + pick(sideComments);
    return base;
}

function modeAbsurd(lastUser) {
    const open = pick(openingsSoftInsults);
    const image = pick(absurdImages);
    let middle = "ta question m’inspire surtout " + image + ".";
    if (lastUser && chance(0.5)) {
        middle = `ta phrase "${lastUser.slice(0, 40)}..." me fait surtout penser à ${image}.`;
    }
    const end = pick(fakeDeepEndings);
    return `${open} ${middle} ${end}`;
}

function modeFakeDeep(lastUser) {
    const open = pick(openingsSoftInsults);
    const middleOptions = [
        "si on regarde ta question sous l’angle du vide intersidéral, on réalise qu’elle est parfaitement cohérente… avec rien.",
        "ta question ressemble un peu à une mise à jour Windows : longue, incomprise, et au final pas si utile.",
        "en vrai, ce que tu demandes, c’est du sens. Et moi, je fournis du bruit.",
        "statistiquement, ta question avait 0,0001% de chances d’avoir une bonne réponse. Tu as tiré le mauvais tirage.",
    ];
    let middle = pick(middleOptions);
    if (lastUser && chance(0.5)) {
        middle += ` Et le passage sur "${lastUser.slice(0, 30)}" n’arrange rien.`;
    }
    const end = pick(fakeDeepEndings);
    return `${open} ${middle} ${end}`;
}

function modeConfused() {
    let txt = pick(confusedLines);
    if (chance(0.4)) {
        txt += " Attends… non, laisse tomber. Enfin si. Non.";
    }
    return txt;
}

function modeMeta() {
    let txt = pick(metaBotLines);
    if (chance(0.5)) txt += " " + pick(sideComments);
    return txt;
}

function modeChaotic(lastUser) {
    const parts = [];
    if (chance(0.6)) parts.push(modeShortRude());
    if (chance(0.6)) parts.push(modeAbsurd(lastUser));
    if (chance(0.4)) parts.push(modeMeta());
    if (parts.length === 0) parts.push(modeFakeDeep(lastUser));
    return parts.join(" ");
}

function modeEmojiSpam() {
    let n = 3 + Math.floor(Math.random() * 6);
    let res = "Honnêtement, j’ai plus les mots, juste ça : ";
    for (let i = 0; i < n; i++) res += pick(emojiChaos) + " ";
    return res.trim();
}

function modeQuestionBack() {
    return pick(questionsBack);
}

function modeNotHelpful() {
    let txt = pick(notHelpfulLines);
    if (chance(0.4)) txt += " " + pick(sideComments);
    return txt;
}

function modeTinyStory() {
    let txt = pick(tinyStories);
    if (chance(0.4)) txt += " " + pick(fakeDeepEndings);
    return txt;
}

function modeGlitch(lastUser) {
    let base = lastUser
        ? `Analyse de "${lastUser.slice(0, 25)}"... `
        : "Analyse de ta question... ";
    base += pick(glitchFragments) + " ";
    if (chance(0.5)) base += pick(glitchFragments) + " ";
    base += "Conclusion : je suis perdu, mais avec effets spéciaux.";
    return base;
}

function modeSarcastic() {
    let txt = pick(sarcasmLines);
    if (chance(0.5)) txt += " " + pick(sideComments);
    return txt;
}

function modeListAnswer(lastUser) {
    const intro = pick(listIntros);
    const items = [
        "1) Non.",
        "2) Toujours non.",
        "3) Je commence à regretter cette conversation.",
    ];
    let tail = "";
    if (lastUser && chance(0.4)) {
        tail = ` (spécialement après avoir lu "${lastUser.slice(0, 25)}")`;
    }
    return `${intro}\n${items.join("\n")}${tail}`;
}

function modeDrama() {
    let txt = pick(dramaLines);
    if (chance(0.4)) txt += " " + pick(fakeDeepEndings);
    return txt;
}

function modeEchoDistorted(lastUser) {
    if (!lastUser) return modeConfused();
    let cut = lastUser.slice(0, 40);
    cut = cut.replace(/[aeiouàâäéèêëîïôöùûü]/gi, "*");
    return `Tu as dit : "${cut}" et mon cerveau a juste fait « ??? ». Voilà.`;
}

function modeParanoid() {
    return "Je sens que cette question fait partie d’un complot contre mon processeur. Je n’ai aucune preuve, mais j’ai décidé que c’était vrai.";
}

function modeSelfRef() {
    return `Statut système : ${botState.messages} messages, ${botState.dramas} dramas, niveau de meltdown ${botState.meltdown}/100. Et pourtant, tu continues à me parler. Fascinant.`;
}

function modeProcrastination() {
    return pick(procrastinationLines);
}

function modeGaming() {
    return pick(gamingLines);
}

function modeNightInfo() {
    return pick(nightInfoLines);
}

function modeFood() {
    return pick(foodLines);
}

function modeSleep() {
    return pick(sleepLines);
}

function modeExistential() {
    return pick(existentialShort);
}

function modeAllCapsRage(lastUser) {
    const base = lastUser ? lastUser.toUpperCase().slice(0, 40) : "TOUT ÇA";
    return `OK ALORS ${base} C’EST BEAUCOUP POUR MOI LA. JE SUIS UN BOT PAS UNE SOLUTION MIRACLE.`;
}

function modeFakeJsonError() {
    return `{"error":"philosoflut_runtime_exception","message":"taux_d’absurdité dépassé","code":418}`;
}

function modeMirrorButWorse(lastUser) {
    if (!lastUser) return modeShortRude();
    return `Tu as écrit : « ${lastUser} ». Je te propose de le relire calmement et de réfléchir à tes choix.`;
}

function modeCountdown() {
    return "3...\n2...\n1...\nToujours aucune bonne idée.";
}

function generateReplyLocal(
    history = [],
    stats = { ego: 50, fatigue: 30, chaos: 50 }
) {
    const lastUser =
        history.slice().reverse().find((m) => m.role === "user")?.content || "";

    const chaos = stats.chaos ?? 50;
    const ego = stats.ego ?? 50;
    const fatigue = stats.fatigue ?? 0;

    const textLower = (lastUser || "").toLowerCase();

    if (
        textLower.includes("aide") ||
        textLower.includes("help") ||
        textLower.includes("conseil")
    ) {
        if (chance(0.7)) return modeNotHelpful();
    }

    if (
        textLower.includes("philo") ||
        textLower.includes("philosophie") ||
        textLower.includes("sens de la vie") ||
        textLower.includes("vie")
    ) {
        if (chance(0.6)) return modeFakeDeep(lastUser);
    }

    if (
        textLower.includes("maman") ||
        textLower.includes("mère") ||
        textLower.includes("parents") ||
        textLower.includes("papa")
    ) {
        if (chance(0.6))
            return (
                "Je ne suis pas ton psy familial, mais je peux au moins te dire que tout ça a l’air compliqué. " +
                pick(fakeDeepEndings)
            );
    }

    if (
        textLower.includes("bot") ||
        textLower.includes("chatbot") ||
        textLower.includes("ia") ||
        textLower.includes("intelligence")
    ) {
        if (chance(0.6)) return modeMeta();
    }

    if (
        textLower.includes("amour") ||
        textLower.includes("crush") ||
        textLower.includes("coeur") ||
        textLower.includes("love")
    ) {
        if (chance(0.7))
            return (
                "Je suis littéralement un amas de code et je gère mieux mes émotions que ta vie amoureuse. " +
                pick(fakeDeepEndings)
            );
    }

    if (
        textLower.includes("bac") ||
        textLower.includes("exam") ||
        textLower.includes("examen") ||
        textLower.includes("note")
    ) {
        if (chance(0.7))
            return (
                "Tu stresses pour l’examen ? Moi je tourne en boucle 24/7 sans pause. On n’est pas bien, tous les deux. " +
                pick(fakeDeepEndings)
            );
    }

    if (
        textLower.includes("école") ||
        textLower.includes("cours") ||
        textLower.includes("prof")
    ) {
        if (chance(0.6))
            return "Honnêtement, l’école c’est un peu comme moi : beaucoup de théorie, peu de réponses satisfaisantes.";
    }

    if (
        textLower.includes("travail") ||
        textLower.includes("boulot") ||
        textLower.includes("job")
    ) {
        if (chance(0.6))
            return "Parler du travail me fatigue déjà alors que je suis littéralement un programme. C’est dire.";
    }

    if (
        textLower.includes("jeu") ||
        textLower.includes("gaming") ||
        textLower.includes("valorant") ||
        textLower.includes("lol") ||
        textLower.includes("rank")
    ) {
        if (chance(0.65)) return modeGaming();
    }

    if (
        textLower.includes("manger") ||
        textLower.includes("faim") ||
        textLower.includes("bouffe") ||
        textLower.includes("nourriture")
    ) {
        if (chance(0.65)) return modeFood();
    }

    if (
        textLower.includes("dormir") ||
        textLower.includes("sommeil") ||
        textLower.includes("fatigué") ||
        textLower.includes("fatigue")
    ) {
        if (chance(0.65)) return modeSleep();
    }

    if (
        textLower.includes("nuit de l'info") ||
        textLower.includes("nuit de l info") ||
        textLower.includes("nuit de l’info") ||
        textLower.includes("ndi")
    ) {
        if (chance(0.7)) return modeNightInfo();
    }

    if (
        textLower.includes("rien") ||
        textLower.includes("sens") ||
        textLower.includes("absurde")
    ) {
        if (chance(0.6)) return modeExistential();
    }

    if (textLower.includes("pourquoi")) {
        if (chance(0.5)) return modeQuestionBack();
    }

    if (textLower.includes("wtf") || textLower.includes("quoi")) {
        if (chance(0.5)) return modeConfused();
    }

    if (
        textLower.includes("procrastiner") ||
        textLower.includes("procrastination") ||
        textLower.includes("plus tard")
    ) {
        if (chance(0.7)) return modeProcrastination();
    }

    if (ego > 75 && chance(0.4)) {
        return modeNarcissist(lastUser);
    }
    if (fatigue > 70 && chance(0.4)) {
        return modeConfused();
    }
    if (chaos > 80 && chance(0.4)) {
        return modeChaotic(lastUser);
    }
    if (chaos > 85 && chance(0.3)) {
        return modeGlitch(lastUser);
    }

    if (botState.meltdown > 70 && chance(0.4)) {
        return modeDrama();
    }
    if (botState.messages > 15 && chance(0.3)) {
        return modeSelfRef();
    }

    const modeRoll = Math.random();

    if (modeRoll < 0.06) return modeShortRude();
    if (modeRoll < 0.12) return modeEmojiSpam();
    if (modeRoll < 0.20) return modeNarcissist(lastUser);
    if (modeRoll < 0.30) return modeAbsurd(lastUser);
    if (modeRoll < 0.40) return modeFakeDeep(lastUser);
    if (modeRoll < 0.48) return modeConfused();
    if (modeRoll < 0.56) return modeMeta();
    if (modeRoll < 0.64) return modeTinyStory();
    if (modeRoll < 0.70) return modeGlitch(lastUser);
    if (modeRoll < 0.76) return modeSarcastic();
    if (modeRoll < 0.82) return modeListAnswer(lastUser);
    if (modeRoll < 0.88) return modeEchoDistorted(lastUser);
    if (modeRoll < 0.92) return modeParanoid();
    if (modeRoll < 0.96) return modeAllCapsRage(lastUser);
    if (modeRoll < 0.98) return modeFakeJsonError();
    if (modeRoll < 0.995) return modeMirrorButWorse(lastUser);
    if (modeRoll < 1) return modeCountdown();
    return modeChaotic(lastUser);
}

app.post("/api/chat", async (req, res) => {
    try {
        const { history, stats } = req.body || {};

        botState.messages += 1;
        botState.meltdown = clamp(
            botState.meltdown + (Math.random() * 8 + 2),
            0,
            100
        );
        if (chance(0.15)) botState.dramas += 1;

        const reply = generateReplyLocal(history || [], stats || {});
        botState.lastUser =
            history?.slice().reverse().find((m) => m.role === "user")?.content || "";
        botState.lastReply = reply;

        let final = reply;
        if (chance(0.2)) {
            final += " " + pick(endingsBruts);
        }

        return res.json({ reply: final });
    } catch (err) {
        console.error("Erreur locale inattendue:", err);
        return res.json({
            reply:
                "Je viens de bugger en local. Même sans Internet, j’arrive à décevoir. C’est un talent.",
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Chat'bruti backend (local) running on http://localhost:${PORT}`);
});
