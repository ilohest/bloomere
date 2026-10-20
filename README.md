# Personnalisations Bloomere — Pipeline

Ce dossier regroupe les dernières versions locales disponibles au 20 octobre 2026.
Chaque fichier conserve le même emplacement dans l’éditeur de code Shopify.
Ce dossier contient des personnalisations à intégrer au thème Pipeline existant ; ce n’est pas un thème complet.

## Fichiers par fonctionnalité

| Fonctionnalité | Fichiers à utiliser ensemble |
| --- | --- |
| Slideshow Bloomere : 1, 2 ou 3 colonnes | `sections/bloomere-section-slideshow.liquid`, `assets/bloomere-columns-slideshow.css`, `assets/bloomere-hero.js` |
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
Le fichier JavaScript `bloomere-hero.js` est bien utilisé par le slideshow actuel ; son nom est conservé pour respecter les références.

`layout/theme.liquid` et `config/settings_schema.json` sont les copies locales fournies pendant ce projet. Si ces fichiers ont évolué sur Shopify, reporter uniquement les personnalisations nécessaires pour conserver les autres changements.

Les images de motifs sont sélectionnées dans Shopify. Les fichiers de polices sont référencés par leurs URL Shopify dans le snippet des polices.

## Remise de bienvenue

La mention « 10% » dans la popup est un texte promotionnel. La réduction et l’email de bienvenue doivent être configurés séparément dans Shopify ou dans l’outil d’emailing.

## Vérification

Les validations locales portent sur la syntaxe JavaScript et les schémas JSON des sections. Elles ne remplacent pas la vérification du rendu et des formulaires dans le thème Shopify.
