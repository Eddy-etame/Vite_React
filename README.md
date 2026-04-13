# TP Bug Hunt — rendu

## Lancer le projet

```bash
npm install
npm run dev
```

## Partie 1 — QCM (mes réponses)

**Question 1 — Ajouter un élément à un tableau**

J’ai choisi **C** (`setItems([...items, newItem])`). Avec A, `push` modifie le tableau déjà en mémoire et `setItems(items)` repasse souvent la même référence : React ne voit parfois aucun changement. B est encore pire : `push` renvoie un nombre (la nouvelle longueur), pas un tableau. D peut marcher avec `concat` sur un seul élément, mais ce n’est pas ce qu’on voit le plus en cours ; C reste la réponse la plus propre.

**Question 2 — Index comme `key`**

**B**. L’index change quand on trie ou supprime une ligne au milieu : React réutilise le mauvais nœud DOM pour une autre donnée, ce qui mélange champs contrôlés, focus, animations, etc. Ce n’est pas qu’« ESLint interdit » : c’est surtout un piège quand la liste bouge.

**Question 3 — `setCount(count + 1); console.log(count);`**

**B** (en supposant `count` à 0 au départ, comme dans l’exemple du TP). Le `console.log` s’exécute tout de suite après les `setState`, encore dans le même tour synchrone : la valeur affichée est celle **d’avant** le prochain rendu. Pour voir la valeur à jour, il faudrait un `useEffect` qui dépend de `count`, ou des mises à jour fonctionnelles enchaînées, ou un ref.

**Question 4 — `onClick={handleClick()}`**

**B**. Les parenthèses appellent la fonction **pendant le rendu**, pas au clic. En plus le retour de `handleClick()` (souvent `undefined`) devient ce que React enregistre comme handler, donc le clic ne fait plus ce qu’on croit. Il faut `onClick={handleClick}` ou `onClick={() => handleClick()}`.

**Question 5 — « Objects are not valid as a React child »**

**D**. Soit on affiche une propriété du type `user.name`, soit on transforme volontairement (par ex. `JSON.stringify` pour du debug). On ne peut pas rendre l’objet entier tel quel dans le JSX.

**Question 6 — Total du panier**

**B**. Le total se déduit du contenu du panier : le calculer au rendu (éventuellement avec `useMemo` si c’est lourd) évite de dupliquer l’info dans un second state et un `useEffect` mal dépendancé — ce que montre justement le Niveau 3 bugué.

**Question 7 — Inspecter props / state**

**B**, React DevTools. La console seule ne donne pas l’arbre des composants ni les hooks de la même façon.

**Question 8 — Immutabilité**

**B**. En pratique en React, ça veut dire : ne pas trafiquer l’objet/tableau déjà stocké dans le state ; recréer une copie (spread, `map`, etc.) pour que la mise à jour soit détectée et pour éviter les surprises quand le parent partage une référence.

**Question 9 — Passer un paramètre au `onClick`**

**D**. `onClick={() => handleClick(id)}` ou `bind` avec le même effet : au clic on appelle le handler avec la bonne valeur, sans l’exécuter au rendu.

**Question 10 — `user.name = 'John'` sur une prop**

**B**. On ne doit pas muter l’objet reçu en props ; ça peut modifier l’état du parent sans passer par un flux clair. Il vaut mieux copier ou remonter une action au parent.

---

## Partie 2 — Bug hunt (réponses détaillées)

### Niveau 1 — TodoList

Fichier de référence : `assets/reference/todoList-enonce.jsx`. Ma version corrigée : `src/bug-hunt/TodoList.jsx`.

1. **`todos.push` puis `setTodos(todos)` (l.15–17)**  
   On mute le tableau déjà présent dans le state et on repasse la même référence à `setTodos`. React peut ne pas re-rendre. Il faut construire un **nouveau** tableau, par ex. `setTodos((prev) => [...prev, { text, id }])`.

2. **`onClick={addTodo()}` (l.22)**  
   Même problème que le QCM 4 : `addTodo` tourne au rendu, pas au clic. Correction : `onClick={addTodo}` (sans parenthèses).

3. **`key={index}` (l.24–26)**  
   Mauvaise pratique dès que l’ordre change. J’utilise un `id` stable (`crypto.randomUUID()` pour la démo).

4. **Aucune vérif sur texte vide**  
   L’énoncé poussait quand même une ligne vide. J’ignore les chaînes vides après `trim()`.

---

### Niveau 2 — Compteur

Référence : `assets/reference/counter-enonce.jsx`. Corrigé : `src/bug-hunt/Counter.jsx`.

1. **Trois fois `setCount(count + 1)` (l.9–11)**  
   Les trois appels voient le **même** `count` ; React regroupe les mises à jour : au final +1 au lieu de +3. J’ai mis `setCount((c) => c + 3)`.

2. **`console.log` juste après (l.12)**  
   Même raison que le QCM 3 : ça affiche l’ancienne valeur. Je l’ai enlevé du composant corrigé.

3. **`count = 0` dans `reset` (l.16–18)**  
   `count` vient d’un `const` via `useState` : on ne peut pas le réassigner. Il faut `setCount(0)`.

4. **`style={color: 'red'}` (l.24)**  
   Ce n’est pas un objet : en JSX la prop `style` attend `{{ color: 'red' }}`.

5. **Boutons sans `type="button"`**  
   Par défaut un `<button>` est souvent traité comme `type="submit"`. Ici il n’y a pas de formulaire autour dans l’énoncé, mais en mettant `type="button"` dans ma correction j’évite tout comportement bizarre si le composant est un jour collé dans un `<form>`.

---

### Niveau 3 — Panier

Référence : `assets/reference/shoppingCart-enonce.jsx`. Corrigé : `src/bug-hunt/ShoppingCart.jsx` + données de démo `src/bug-hunt/demoItems.js` (comme je n’avais pas de parent qui passait `items`, j’ai mis un petit catalogue en dur pour pouvoir tester).

1. **`useEffect` sans tableau de dépendances (l.8–12)**  
   L’effet tourne après **chaque** rendu, appelle `setTotal`, ce qui relance un rendu → boucle infinie ou comportement instable. Le total doit se **déduire** du panier : j’utilise `useMemo` sur `cart`.

2. **State `total` séparé**  
   C’était la conséquence du point 1 : double source de vérité. Avec un seul calcul dérivé, plus de désync.

3. **`existing.quantity++` puis `setCart(cart)` (l.16–18)**  
   Mutation du même objet + même référence. Il faut recréer le tableau (souvent avec `setCart((prev) => prev.map(...))`).

4. **`updateQuantity` qui modifie `item` puis `setCart(cart)` (l.24–27)**  
   Même problème d’immutabilité.

5. **`items.map` sans `key` (l.33–37)**  
   Il manque une clé stable sur la liste du catalogue.

6. **`key={i}` sur le panier (l.40–48)**  
   Moins grave que l’index sur des données métier, mais l’id d’article est préférable.

7. **`e.target.value` en string pour un nombre (l.46)**  
   Il faut convertir (`Number`) et gérer les cas pourris (`NaN`).

8. **`setCart([...cart, …])` sans updater fonctionnel (l.20)**  
   Quand on ajoute un **nouvel** article, on lit `cart` tel qu’au dernier rendu. Si deux actions arrivent vite, la seconde peut écraser la première. D’où `setCart((prev) => [...prev, { ...item, quantity: 1 }])`.

---

### Niveau 4 — Formulaire

Référence (copie du fichier fourni) : `assets/reference/original-ContactForm.jsx`. Corrigé : `src/bug-hunt/ContactForm.jsx`.

Les erreurs viennent surtout de trois familles : mauvais objet pour les erreurs de validation (`errors` vs `newErrors`), soumission HTML non bloquée + état « en cours » mal géré, et mutations du state (`formData`, `errors`) sans nouvelle référence. Concrètement :

- Lignes **24–30** : le nom et l’email partent dans `errors` au lieu de `newErrors`, donc `setErrors(newErrors)` ne contient pas toujours ce qu’on croit et `validateForm` peut retourner `true` alors qu’il reste des problèmes.
- **`handleSubmit`** : pas de `preventDefault` → rechargement possible ; `setIsSubmitting(true)` avant la validation avec un `else` vide → bouton bloqué sur « envoi » si le formulaire est invalide.
- **Réinitialisation après succès** : mutation des champs de `formData` puis `setFormData(formData)` ne force pas toujours un nouveau rendu.
- **`handleChange`** : même problème + mutation de `errors` pour effacer une erreur.
- **Ligne email JSX** : `style` doit être un objet React, pas une chaîne CSS.
- **`rows="5"`** : en JSX on passe un nombre : `rows={5}`.
- **`setTimeout`** : j’annule au démontage avec un `ref` pour ne pas appeler `setState` sur un composant déjà parti.
- **Validation** : email avec trim + motif un peu plus sérieux qu’un simple `includes('@')`.

---

### Niveau 5 — Course entre requêtes (bonus)

Référence : `assets/reference/userProfile-enonce.jsx`. Corrigé : `src/bug-hunt/UserProfile.jsx`.

Sans annulation, si `userId` change vite, une réponse lente peut arriver **après** une réponse rapide et écraser l’écran avec le mauvais utilisateur. J’ai branché `fetch` avec `signal: AbortController` et je coupe tout dans le `return` du `useEffect`, plus un flag `active` pour ne pas mettre à jour si le nettoyage a déjà eu lieu. Pour la démo j’utilise JSONPlaceholder (`/users/:id`) parce qu’il n’y a pas de `/api` local.

---

## Fichiers utiles

| Fichier | Rôle |
|---------|------|
| `src/App.jsx` | Onglets pour afficher chaque niveau |
| `src/bug-hunt/*.jsx` | Code corrigé exécutable |
| `assets/reference/*` | Code bugué de l’énoncé (citations) |
| `docs/TP_Bug_Hunt_Reponses.pdf` | Export PDF de ce README |

---

## Checklist barème (rappel)

QCM fait ; Niveaux 1 à 5 couverts avec au moins le nombre de bugs demandé sur les parties code ; bonus race condition traité ; tout compile avec `npm run build`.
