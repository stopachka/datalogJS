// 1. patternMatch

function isVariable(x) {
  return typeof x == "string" && x.startsWith("?");
}

function matchVariable(variable, triplePart, context) {
  if (context.hasOwnProperty(variable)) {
    const binded = context[variable];
    return matchPart(binded, triplePart, context);
  }
  return { ...context, [variable]: triplePart };
}

function matchPart(patternPart, triplePart, context) {
  if (!context) return null;
  if (isVariable(patternPart)) {
    return matchVariable(patternPart, triplePart, context);
  }
  return patternPart === triplePart ? context : null;
}

export function matchPattern(pattern, triple, context) {
  return pattern.reduce((context, patternPart, idx) => {
    const triplePart = triple[idx];
    return matchPart(patternPart, triplePart, context);
  }, context);
}

// 2. querySingle

export function querySingle(pattern, db, context) {
  return relevantTriples(pattern, db)
    .map((triple) => matchPattern(pattern, triple, context))
    .filter((x) => x);
}

// 3. queryWhere

export function queryWhere(patterns, db) {
  return patterns.reduce(
    (contexts, pattern) => {
      return contexts.flatMap((context) => querySingle(pattern, db, context));
    },
    [{}]
  );
}

// 4. query

function actualize(context, find) {
  return find.map((findPart) => {
    return isVariable(findPart) ? context[findPart] : findPart;
  });
}

export function query({ find, where }, db) {
  const contexts = queryWhere(where, db);
  return contexts.map((context) => actualize(context, find));
}

// --------
// 5. DB

function relevantTriples(pattern, db) {
  const [id, attribute, value] = pattern;
  if (!isVariable(id)) {
    return db.entityIndex[id];
  }
  if (!isVariable(attribute)) {
    return db.attrIndex[attribute];
  }
  if (!isVariable(value)) {
    return db.valueIndex[value];
  }
  return db.triples;
}

function indexBy(triples, idx) {
  return triples.reduce((index, triple) => {
    const k = triple[idx];
    index[k] = index[k] || [];
    index[k].push(triple);
    return index;
  }, {});
}

export function createDB(triples) {
  return {
    triples,
    entityIndex: indexBy(triples, 0),
    attrIndex: indexBy(triples, 1),
    valueIndex: indexBy(triples, 2),
  };
}
