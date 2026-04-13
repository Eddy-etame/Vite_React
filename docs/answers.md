---
title: TP Bug Hunt Challenge — Réponses complètes
---

# TP Bug Hunt Challenge — Réponses complètes

**Références de code** : les fichiers corrigés exécutables se trouvent dans `src/bug-hunt/`. Les versions « énoncé » (buguées) sont archivées dans `assets/reference/` pour citer les lignes exactes. L’énoncé officiel PDF est dans `assets/TP-Bug-Hunt-Challenge.pdf`.

---

## Partie 1 — QCM (10 questions)

### Question 1 — Bonne façon d’ajouter un élément à un tableau ?

**Réponse : C** — `setItems([...items, newItem])`.

**Pourquoi** : En React, l’état doit être mis à jour avec une **nouvelle référence** quand on veut déclencher un re-render. `push` mute le tableau existant ; `setItems(items)` garde souvent la même référence, donc React peut ne pas détecter le changement.

**Comment** : L’opérateur spread construit un **nouveau** tableau contenant les anciens éléments plus `newItem`. L’alternative D (`concat`) est aussi valable car elle renvoie un nouveau tableau, mais C est l’idiome le plus courant en React moderne.

---

### Question 2 — Pourquoi ne pas utiliser l’index comme `key` ?

**Réponse : B** — Bugs lors du réordonnancement.

**Pourquoi** : La `key` aide React à associer l’élément de liste à son instance DOM et à son état local. Si l’ordre change, l’index ne correspond plus au même « objet métier », ce qui mélange état et animations.

**Comment** : Préférer un **id stable** (UUID, id serveur). Référence : `src/bug-hunt/TodoList.jsx` utilise `key={todo.id}` après correction.

---

### Question 3 — `setCount(count+1); console.log(count);`

**Réponse : B** — `0` (valeur d’avant mise à jour, dans le même handler synchrone).

**Pourquoi** : `setState` est **asynchrone** pour le prochain rendu ; dans le même bloc synchrone, `count` garde l’ancienne valeur.

**Comment** : Pour lire la valeur après mise à jour, utiliser la forme fonctionnelle `setCount(c => c + 1)` en chaîne, ou `useEffect` dépendant de `count`, ou un ref.

---

### Question 4 — Erreur dans `onClick={handleClick()}` ?

**Réponse : B** — La fonction est **appelée immédiatement** au rendu (et son retour devient le handler).

**Pourquoi** : Les parenthèses exécutent l’appel ; React attend une **référence** de fonction ou une fonction fléchée.

**Comment** : Écrire `onClick={handleClick}` ou `onClick={() => handleClick()}`. Voir `assets/reference/todoList-enonce.jsx` ligne 22 (`onClick={addTodo()}`) pour l’anti‑pattern.

---

### Question 5 — Corriger « Objects are not valid as a React child » ?

**Réponse : D** — A ou B.

**Pourquoi** : React ne rend pas d’objets JavaScript bruts comme nœuds texte ; il faut une primitive (string/number), des nœuds React, ou une structure sérialisable/affichable.

**Comment** : Afficher une propriété (`user.name`) ou une représentation contrôlée (`JSON.stringify` pour du debug, rare en prod).

---

### Question 6 — Calculer un total à partir d’un panier ?

**Réponse : B** — Calculer dans le rendu (ou dériver avec `useMemo`).

**Pourquoi** : Le total est **dérivé** du panier ; le dupliquer dans un `useState` + `useEffect` sans deps correctes crée des bugs (boucles, désynchronisation). Voir Niveau 3 ci‑dessous.

**Comment** : `const total = cart.reduce(...)` ou `useMemo(() => ..., [cart])`. Référence : `src/bug-hunt/ShoppingCart.jsx` lignes 9–12.

---

### Question 7 — Outil pour inspecter props / state ?

**Réponse : B** — React DevTools.

**Pourquoi** : Outil dédié à l’arbre de composants, props, hooks et profiler.

**Comment** : Extension navigateur + onglet Components.

---

### Question 8 — L’immutabilité signifie ?

**Réponse : B** — Créer de nouvelles copies lors des mises à jour d’état.

**Pourquoi** : React compare souvent les références pour savoir quand re-rendre ; muter l’objet d’état en place contourne la détection.

**Comment** : Spread, `map`, `filter`, etc. Voir corrections Niveau 3 et 4.

---

### Question 9 — Passer un paramètre dans `onClick` ?

**Réponse : D** — B ou C.

**Pourquoi** : Il faut une fonction qui **appelle** le handler avec l’argument au clic, pas un appel immédiat.

**Comment** : `onClick={() => handleClick(id)}` ou `onClick={handleClick.bind(null, id)}`.

---

### Question 10 — `const user = props.user; user.name = 'John';`

**Réponse : B** — Mutation d’une prop (et de l’objet potentiellement partagé).

**Pourquoi** : Les props doivent être traitées comme **en lecture seule** ; muter le même objet peut affecter le parent et casser le modèle de données.

**Comment** : Copier puis modifier une copie locale, ou lever l’état vers le parent avec un callback.

---

## Partie 2 — Bug Hunt

### Niveau 1 — TodoList (énoncé : `assets/reference/todoList-enonce.jsx`)

| # | Bug | Référence (énoncé) | Pourquoi / comment | Correction (`src/bug-hunt/TodoList.jsx`) |
|---|-----|---------------------|--------------------|---------------------------------------------|
| 1 | `todos.push` + `setTodos(todos)` | L15–17 | Mutation + même référence : React peut ignorer la mise à jour. | `setTodos((prev) => [...prev, { text, id }])` |
| 2 | `onClick={addTodo()}` | L22 | Appel immédiat ; de plus le handler ne correspond pas au clic. | `onClick={addTodo}` |
| 3 | `key={index}` | L24–26 | Instable si réordonnancement. | `key={todo.id}` avec id unique (`crypto.randomUUID`) |
| 4 | Pas de garde sur texte vide | L14–18 | Ajoute des tâches vides. | `if (!text) return` après `trim()` |

**Nombre de bugs relevés** : **4** (≥ 3 demandés).

---

### Niveau 2 — Compteur (`assets/reference/counter-enonce.jsx`)

| # | Bug | Référence | Pourquoi / comment | Correction (`src/bug-hunt/Counter.jsx`) |
|---|-----|-----------|--------------------|----------------------------------------|
| 1 | Trois `setCount(count + 1)` | L9–11 | Chaque appel lit la **même** valeur `count` ; seul +1 appliqué par batch. | `setCount((c) => c + 3)` |
| 2 | `console.log` juste après | L12 | Affiche l’**ancienne** valeur (même raison que QCM 3). | Retiré ou déplacé en `useEffect` si besoin |
| 3 | `count = 0` dans reset | L16–18 | `count` est une constante de render ; **erreur** / anti‑pattern. | `setCount(0)` |
| 4 | `style={color: 'red'}` | L24 | JSX invalide / objet attendu pour `style`. | `style={{ color: 'red' }}` |
| 5 | Libellé « +3 » vs comportement | L21 | Incohérence UX avec le bug de closure. | Comportement réel +3 après correction |

**Nombre de bugs relevés** : **5** (≥ 4 demandés).

---

### Niveau 3 — Panier (`assets/reference/shoppingCart-enonce.jsx`)

| # | Bug | Référence | Pourquoi / comment | Correction (`src/bug-hunt/ShoppingCart.jsx`) |
|---|-----|-----------|--------------------|-----------------------------------------------|
| 1 | `useEffect` sans tableau de deps | L10–14 | S’exécute à **chaque** rendu → `setTotal` → boucle infinie. | Supprimé : total **dérivé** avec `useMemo` |
| 2 | État `total` redondant | L8, L13 | Duplication de source de vérité. | `const total = useMemo(...)` |
| 3 | `existing.quantity++` + `setCart(cart)` | L19–22 | Mutation + même référence. | `setCart((prev) => prev.map(...))` |
| 4 | `updateQuantity` mute l’item | L27–30 | Idem immutabilité. | `setCart((prev) => prev.map(...))` |
| 5 | `items.map` sans `key` | L35–40 | Avertissement React, liste instable. | `key={item.id}` |
| 6 | `cart.map` avec `key={i}` | L43–52 | Mauvaise clé si quantités réordonnées. | `key={item.id}` |
| 7 | `e.target.value` typé string | L49 | Quantité numérique incohérente. | `Number(rawQty)` + garde `NaN` |
| 8 | `items` en prop absente dans la démo | — | L’énoncé suppose `items` du parent ; la démo utilise `DEMO_SHOP_ITEMS` (`src/bug-hunt/demoItems.js`) pour exécuter le composant isolément. | Fichier de données démo |

**Nombre de bugs relevés** : **8** (≥ 7 demandés).

---

### Niveau 4 — Formulaire (`assets/reference/original-ContactForm.jsx`)

| # | Bug | Lignes (fichier de référence) | Pourquoi | Correction (`src/bug-hunt/ContactForm.jsx`) |
|---|-----|------------------------------|----------|-----------------------------------------------|
| 1 | Erreur nom écrite dans `errors` au lieu de `newErrors` | 24–26 | Le nom requis n’entre jamais dans `newErrors` → `validateForm` peut retourner `true` à tort. | L22–24 : `newErrors.name` |
| 2 | Email assigné à `errors.email` | 28–30 | Même problème ; incohérence avec `setErrors(newErrors)`. | L25–30 : tout dans `newErrors` |
| 3 | Validation email faible / email vide | 28–29 | `''.includes('@')` → faux « invalide » sans message cohérent dans `newErrors` ; pas de trim. | L25–30 : champ requis + regex |
| 4 | Pas de `e.preventDefault()` | 40–42 | Soumission HTML native / rechargement. | L39 |
| 5 | `setIsSubmitting(true)` avant validation | 42, 60–61 | Si invalide, branche `else` vide → **spinner bloqué**. | Valider d’abord ; `return` sans mettre `true` si invalide (L41–44) |
| 6 | Mutation de `formData` puis `setFormData(formData)` | 52–55 | Même référence : pas de re-render fiable. | L50 : nouvel objet littéral |
| 7 | `handleChange` mute `formData` | 64–66 | Idem immutabilité. | L59 : `setFormData((prev) => ({...}))` |
| 8 | Suppression d’erreurs en mutant `errors` | 69–72 | Même référence passée à `setErrors`. | L60–65 : copie immuable |
| 9 | `style="..."` sur le span email | 110–111 | En React, `style` attend un **objet**. | L101 : `style={{ color: 'red', fontSize: 12 }}` |
| 10 | `rows="5"` (chaîne) | 122 | Attendu : nombre pour la prop React. | L114 : `rows={5}` |
| 11 | Pas d’annulation du `setTimeout` au démontage | 48–59 | Risque `setState` sur composant démonté. | L12–18, L46–47 : `useRef` + `clearTimeout` |
| 12 | Pas de reset explicite de `submitSuccess` avant nouvel envoi | — | UX : ancien succès peut rester affiché brièvement. | L40 : `setSubmitSuccess(false)` |

**Nombre de bugs relevés** : **12** (≥ 10 demandés).

---

### Niveau 5 — Race condition (bonus) (`assets/reference/userProfile-enonce.jsx`)

**Problème** : Quand `userId` change vite, une requête lente peut finir **après** une rapide et écraser `user` avec des données obsolètes (L8–16 : aucune annulation).

**Comment corriger** :

1. **`AbortController`** passé à `fetch` via `signal`, et **`abort()`** dans le cleanup de `useEffect` quand `userId` change ou au démontage.
2. Drapeau **`let active = true`** (ou vérification d’id courant) pour ne pas appeler `setUser` si la réponse est obsolète.

**Référence code corrigé** : `src/bug-hunt/UserProfile.jsx` — effet avec `fetch(..., { signal: ac.signal })`, cleanup `active = false` + `ac.abort()`, garde `if (active)` avant `setUser` / `setError`.

**Démo** : l’application utilise JSONPlaceholder (`https://jsonplaceholder.typicode.com/users/:id`) au lieu de `/api/users/` pour une démo fonctionnelle hors backend.

---

## Synthèse checklist (énoncé)

- QCM : 10 réponses ci‑dessus.
- Niveau 1 : **4** bugs (min 3).
- Niveau 2 : **5** bugs (min 4).
- Niveau 3 : **8** bugs (min 7).
- Niveau 4 : **12** bugs (min 10).
- Niveau 5 : correction **cleanup / abort** documentée + code.
- Code testé : `npm run build` dans `TP-Bug-Hunt-Submission`.

---

*Export PDF : `npm run pdf` (exécute `scripts/build_pdf.py` avec PyMuPDF — fichier `docs/TP_Bug_Hunt_Reponses.pdf`).*
