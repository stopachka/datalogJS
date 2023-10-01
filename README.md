# datalogJS

A simple datalog query engine, implemented in 100 lines of Javascript. Accompaniment to the "Datalog in Javascript" [essay](https://www.instantdb.dev/essays/datalogjs)

```
npm i 
npm run test
```


### Pseudo Algorithm

```js
 Function matchPattern(pattern, triple, context):
    For each patternPart and triplePart in pattern and triple together:
        Update context using matchPart(patternPart, triplePart, context)
    Return context

Function matchPart(patternPart, triplePart, context):
    If context is null:
        Return null
    If isVariable(patternPart):
        Return matchVariable(patternPart, triplePart, context)
    If patternPart equals triplePart:
        Return context
    Return null

Function isVariable(x):
    If x is a string and starts with '?':
        Return true
    Return false

Function matchVariable(variable, triplePart, context):
    If variable exists in context:
        Get bound value from context
        Return matchPart(bound value, triplePart, context)
    Return updated context with variable bound to triplePart

Function querySingle(pattern, db, context):
    Get relevant triples for pattern from db
    For each triple:
        Match context using matchPattern(pattern, triple, context)
    Filter out null contexts
    Return matched contexts

Function queryWhere(patterns, db):
    Initialize contexts as a list with an empty object
    For each pattern in patterns:
        Update contexts using querySingle(pattern, db, context)
    Return contexts

Function query(queryObj, db):
    contexts = queryWhere(queryObj.where, db)
    Return map of contexts using actualize(context, queryObj.find)

Function actualize(context, find):
    For each findPart in find:
        If isVariable(findPart):
            Replace findPart with context value of findPart
        Else:
            Keep findPart as is
    Return updated find

Function relevantTriples(pattern, db):
    If id is not a variable:
        Return triples with matching id from db.entityIndex
    If attribute is not a variable:
        Return triples with matching attribute from db.attrIndex
    If value is not a variable:
        Return triples with matching value from db.valueIndex
    Return all triples from db

Function indexBy(triples, idx):
    Initialize index as an empty object
    For each triple in triples:
        Get key from triple at position idx
        Add triple to index under key
    Return index

Function createDB(triples):
    Return object with:
        triples
        entityIndex created using indexBy(triples, 0)
        attrIndex created using indexBy(triples, 1)
        valueIndex created using indexBy(triples, 2)
```
