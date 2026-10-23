# Personnalisations Bloomere — Pipeline

Ce dossier regroupe les dernières versions locales disponibles au 20 octobre 2026.
Chaque fichier conserve le même emplacement dans l’éditeur de code Shopify.
Ce dossier contient des personnalisations à intégrer au thème Pipeline existant ; ce n’est pas un thème complet.

## Fichiers par fonctionnalité

| Fonctionnalité | Fichiers à utiliser ensemble |
| --- | --- |
| Slideshow Bloomere : 1, 2 ou 3 colonnes | `sections/bloomere-slideshow.liquid`, `assets/bloomere-slideshow.css`, `assets/bloomere-slideshow.js` |
| Témoignages Bloomere | `sections/bloomere-testimonials.liquid`, `assets/bloomere-testimonials.css`, `assets/bloomere-testimonials.js` |
| Popup newsletter | `sections/bloomere-newsletter-popup.liquid`, `assets/bloomere-newsletter-popup.css`, `assets/bloomere-newsletter-popup.js` |
| Séparateur de sections | `sections/section-bloomere-divider.liquid` |
| Newsletter avec motif et encart | `sections/section-newsletter.liquid`, `snippets/bloomere-background.liquid` |
| Icônes avec cartes et motif | `sections/section-icons.liquid`, `snippets/bloomere-background.liquid` |
| Colonnes avec fonds personnalisables | `sections/section-columns.liquid`, `snippets/bloomere-background.liquid` |
| Polices personnalisées | `snippets/custom-fonts.liquid` |
| Curseur personnalisé | `snippets/bloomere-cursor.liquid`, réglages dans `config/settings_schema.json` |
| Intégration des polices et du curseur | `layout/theme.liquid` |

## Installation

1. Copier les fichiers de la fonctionnalité dans les dossiers correspondants du thème Shopify.
2. Pour le slideshow et la popup, copier les trois fichiers de chaque fonctionnalité.
3. Dans l’éditeur visuel, ajouter **Bloomere slideshow** ou **Bloomere newsletter popup** (groupe Overlay), puis configurer leurs contenus.
4. Choisir les images de motifs et de curseur dans les sélecteurs d’images du thème.

Le slideshow Bloomere est une section distincte : il ne remplace pas le slideshow original de Pipeline.
Les trois fichiers du slideshow partagent le nom `bloomere-slideshow`. Le composant HTML `bloomere-hero` conserve son nom interne.

`layout/theme.liquid` et `config/settings_schema.json` sont les copies locales fournies pendant ce projet. Si ces fichiers ont évolué sur Shopify, reporter uniquement les personnalisations nécessaires pour conserver les autres changements.

Les images de motifs sont sélectionnées dans Shopify. Les fichiers de polices sont référencés par leurs URL Shopify dans le snippet des polices.

## Remise de bienvenue

La mention « 10% » dans la popup est un texte promotionnel. La réduction et l’email de bienvenue doivent être configurés séparément dans Shopify ou dans l’outil d’emailing.

## Vérification

Les validations locales portent sur la syntaxe JavaScript et les schémas JSON des sections. Elles ne remplacent pas la vérification du rendu et des formulaires dans le thème Shopify.

## Témoignages Bloomere

Copier les trois fichiers de la section, puis ajouter **Bloomere testimonials** dans l’éditeur Shopify. Ajouter un bloc par témoignage et saisir le texte, le nom et la photo fournis par la cliente. La note est masquée par défaut ; renseigner uniquement une note réellement fournie. Le produit associé est facultatif, avec une image et un titre personnalisables.

Le réglage **Image position** de chaque témoignage place la photo à gauche ou à droite sur ordinateur. Sur mobile, la photo reste sous le texte. La palette de colonne de chaque témoignage, les palettes globales des flèches et de la vignette produit, la hauteur sur ordinateur et la durée du défilement sont réglables. Le texte des témoignages utilise la police de corps et la classe `body-size-4` du thème, comme les sections colonnes et newsletter. Les flèches sont superposées à la section et les points de navigation reprennent le badge du hero slideshow. Les polices sont héritées du thème. Les libellés d’accessibilité anglais sont intégrés au Liquid pour alléger les réglages de la section.

Le défilement se suspend au survol et s’arrête après une interaction au clavier ou une navigation manuelle ; le bouton lecture permet de le relancer. Il est initialement désactivé dans l’éditeur et lorsque la préférence de réduction des animations est active. La sélection d’un bloc affiche son témoignage. Sans JavaScript, tous les témoignages restent lisibles. Une section contenant un seul témoignage masque les commandes.

Après intégration au thème, vérifier les images et textes définitifs sur mobile et ordinateur, la navigation et la sélection des blocs dans l’éditeur. Aucun système de collecte, d’import ou de synchronisation d’avis n’est inclus.

## Bordure du hero

Dans **Bloomere slideshow → Custom divider**, activer la bordure en bas et choisir dans **Divider palette** la palette de fond de la section suivante. Les hauteurs ordinateur et mobile sont indépendantes. La bordure est superposée aux images et reste fixe pendant le défilement ; les commandes sont remontées pour rester dégagées. Elle est désactivée par défaut. Mettre à jour `sections/bloomere-slideshow.liquid` et `assets/bloomere-slideshow.css` ensemble ; le JavaScript reste identique.

## Boutons globaux

Charger `assets/bloomere-buttons.css` après `theme.css` dans `layout/theme.liquid` (chargement ajouté à la copie locale). Les boutons Pipeline pleins, doux et à contour adoptent une forme capsule, une bordure fine, des majuscules espacées et un survol discret. Leurs couleurs restent celles du thème ; utiliser le style **Soft button** pour un fond doux comme la référence. Les liens textuels, commandes de sliders et boutons de paiement de services externes conservent leur présentation.

Vérifier le rendu dans le thème complet, en particulier les boutons produit, panier et formulaires. Si le fichier Shopify `theme.liquid` a évolué, reporter uniquement la ligne de chargement du CSS après celle de `theme.css`.

Les témoignages utilisent **Section height**, avec les mêmes choix que le hero : proportions d’écran, 800/650/500 px ou **Image height**. Ce réglage concerne l’ordinateur ; sur mobile, la photo reste au ratio 4:5. La section peut grandir pour contenir les textes longs.

## Transitions des slides

Le hero custom et les témoignages utilisent `themeVendor.FlickityFade`, déjà chargé par `vendor.js` dans Pipeline, avec les mêmes options de fondu, hauteur adaptative et bouclage que le slideshow natif. Les commandes et la gestion de lecture/pause restent propres aux sections. Avec la préférence de réduction des animations, le changement est immédiat. Si la bibliothèque du thème est absente, les slides restent navigables sans fondu.

Pour cette mise à jour, remplacer les CSS et JS des deux sections ainsi que `sections/bloomere-testimonials.liquid` (ajout du conteneur de slides). Le Liquid du hero ne change pas. Les tests locaux couvrent la synchronisation des slides, le défilement automatique, la navigation, le mode sans bibliothèque et le nettoyage ; vérifier le rendu et les gestes de glissement dans Shopify avec la bibliothèque réelle.

## Renommage du slideshow dans Shopify

Les fichiers sont désormais `sections/bloomere-slideshow.liquid`, `assets/bloomere-slideshow.css` et `assets/bloomere-slideshow.js`.

Lors du déploiement sur un thème où la section existe déjà, créer les nouveaux fichiers puis remplacer le type de section `bloomere-section-slideshow` par `bloomere-slideshow` dans les modèles JSON et groupes de sections concernés. Conserver les identifiants, blocs, réglages et ordre existants pour préserver le contenu. Mettre aussi à jour tout appel Liquid statique à l’ancien nom. Ces fichiers de modèles ne sont pas présents dans cette copie locale. Supprimer l’ancienne section seulement après avoir mis à jour ses références et vérifié le rendu.

## Illustration du formulaire de contact

Mettre à jour `sections/section-contact.liquid` et ajouter `assets/bloomere-illustration.css` ainsi que `snippets/bloomere-illustration.liquid`. Dans **Contact form → Swan illustration**, sélectionner le cygne de la marque (image à fond transparent recommandée). Sans image sélectionnée, la disposition d’origine est conservée.

Le cygne est positionné dans une couche décorative au bord gauche ou droit de la section, sans modifier la largeur ni la position natives du formulaire. Sous 990 px, il reste au bord dans une taille réduite, derrière le formulaire et sans intercepter les clics. Les largeurs ordinateur et mobile sont réglables. **Enable gentle floating** active un mouvement de quelques pixels et une rotation de ±1°, sur 10 secondes par défaut. L’animation se suspend pendant l’utilisation du formulaire et reste désactivée si le visiteur préfère réduire les animations. Le snippet et l’animation sont réutilisables pour d’autres sections.

Le formulaire et ses blocs ont été conservés à l’identique du fichier fourni. Validation locale du schéma effectuée ; vérifier le rendu avec le cygne choisi et l’envoi du formulaire dans Shopify.

## Cadres et médaillons de la mosaïque

Mettre à jour `sections/section-mosaic.liquid` et ajouter `assets/bloomere-mosaic.css` ainsi que `snippets/bloomere-mosaic-frame.liquid`. Dans chaque bloc, **Decorative frame → Frame shape** propose **None**, **Scalloped rectangle** ou **Scalloped oval**. **Frame palette** choisit la couleur parmi les fonds du thème. Les festons et les petits points ajourés sont dessinés en SVG ; leur proportion suit celle de la case mosaïque.

**CTA badge → Show round CTA badge** active un médaillon à double contour et pointillés. Renseigner un texte court dans **Badge text**, choisir **Badge palette** et éventuellement **Custom badge link**. Sans lien personnalisé, la destination de l’image, du produit, de la collection ou de l’article est reprise. Le médaillon remplace le CTA texte ; le prix d’un produit reste affiché. Sans texte ou destination, il ne s’affiche pas. Les options sont désactivées par défaut pour préserver les blocs existants.

Schéma, conservation des réglages d’origine et syntaxe des chemins SVG vérifiés localement. Vérifier le rendu avec les images, les textes et les proportions définitives dans Shopify.

## Monogramme sur les sections image/texte

Mettre à jour `sections/section-double.liquid` et ajouter `assets/bloomere-brand-badge.css`. Dans **Brand badge**, choisir le monogramme ou badge de marque, idéalement à fond transparent, régler sa largeur et **Corner overlap**. Dans chaque bloc image ou vidéo, **Show brand badge** permet de l’activer ou de le masquer. Sans image de badge, le rendu initial est conservé.

Le premier bloc média d’une section à deux colonnes reçoit le badge en bas à gauche ; le second en bas à droite. Le badge ne modifie pas les dimensions des colonnes et ne bloque pas les commandes vidéo. En pleine largeur, le badge reste légèrement à l’intérieur du bord pour éviter un débordement horizontal. Sur mobile, il reste à l’intérieur du coin correspondant, avec une taille indépendante et une option pour le masquer.

Le fichier source fourni contenait une virgule finale dans le schéma JSON ; elle a été retirée lors de la validation. Réglages existants conservés. Vérifier le rendu avec le logo choisi dans Shopify.
