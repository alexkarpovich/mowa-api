const driver = require('../settings/neo4j');

console.log('SEED DB START');

const schemaUpdates = [
  //'CREATE CONSTRAINT ON (user:User) ASSERT exists(user.id)',
  //'CREATE CONSTRAINT ON (user:User) ASSERT exists(user.email)',
  'CREATE CONSTRAINT ON (user:User) ASSERT user.email IS UNIQUE',
  'CREATE CONSTRAINT ON (user:User) ASSERT user.id IS UNIQUE',

  //'CREATE CONSTRAINT ON (p:Profile) ASSERT exists(p.id)',
  //'CREATE CONSTRAINT ON (p:Profile) ASSERT exists(p.name)',
  'CREATE CONSTRAINT ON (p:Profile) ASSERT p.id IS UNIQUE',

  //'CREATE CONSTRAINT ON (s:Series) ASSERT exists(s.id)',
  //'CREATE CONSTRAINT ON (s:Series) ASSERT exists(s.name)',
  'CREATE CONSTRAINT ON (s:Series) ASSERT s.id IS UNIQUE',

  //'CREATE CONSTRAINT ON (t:Term) ASSERT exists(t.id)',
  'CREATE CONSTRAINT ON (t:Term) ASSERT t.id IS UNIQUE',

  //'CREATE CONSTRAINT ON (lang:Language) ASSERT exists(lang.code)',
  //'CREATE CONSTRAINT ON (lang:Language) ASSERT exists(lang.name)',
  'CREATE CONSTRAINT ON (lang:Language) ASSERT lang.code IS UNIQUE',
];

const dataUpdates = [
  `MERGE (:Active)`,
  `
    LOAD CSV WITH HEADERS FROM 'file:///seeds/languages.csv' AS row
    MERGE (l:Language {name: row.name, nativeName: row.nativeName, code: row.code})
  `,
  `
    LOAD CSV WITH HEADERS FROM 'file:///seeds/users.csv' AS row
    MERGE (u:User {id: row.id, email: row.email, hashedPassword: row.hashedPassword, salt: row.salt, createdAt: timestamp(), updatedAt: timestamp()})
  `,
  `
    LOAD CSV WITH HEADERS FROM 'file:///seeds/profiles.csv' AS row
    MATCH (l:Language),(tr:Language), (u:User), (a:Active) WHERE l.code=row.transLang AND tr.code=row.learnLang and u.email=row.owner
    MERGE (u)-[:OWNS]->(p:Profile{id: row.id, name: row.name})<-[:INCLUDES]-(a)
    MERGE (tr)<-[:HAS_TRANSLATION_LANG]-(p)-[:HAS_LEARNING_LANG]->(l)
  `,
  `
    LOAD CSV WITH HEADERS FROM 'file:///seeds/terms.csv' AS row
    MATCH (l:Language) WHERE l.code=row.lang
    MERGE (l)-[:INCLUDES]->(t:Term {id: row.id, value: row.value})
  `,
  `
    LOAD CSV WITH HEADERS FROM 'file:///seeds/translations.csv' AS row
    MATCH (ll:Language), (tl:Language), (ll)-[:INCLUDES]->(ft:Term), (tl)-[:INCLUDES]->(tt:Term)
      WHERE ll.code=row.llang and tl.code=row.tlang and ft.value=row.from and tt.value=row.to
    MERGE (ft)<-[:FROM]-(tr:Translation {id: row.id, transcription: row.transcription, details: row.details})-[:TO]->(tt)
  `,
  `
    LOAD CSV WITH HEADERS FROM 'file:///seeds/series.csv' AS row
    MATCH (p:Profile {id: row.profile})
    CREATE (s:Series {id: row.id, name: row.name})<-[:INCLUDES]-(p)
    WITH row, s
    UNWIND split(row.terms, ',') AS termID
    MATCH (t:Term) WHERE t.id=termID
    CREATE (s)-[:INCLUDES]->(t)
    WITH row, s
    UNWIND split(row.translations, ',') AS trID
    MATCH (tr:Translation) WHERE tr.id=trID
    CREATE (s)-[:INCLUDES]->(tr)
   `,
];
const schemaSession = driver.session();
const dataSession = driver.session();

schemaSession.readTransaction(txc => {
  //schemaUpdates.forEach(query => txc.run(query));
}).then(() => console.log('Schema updates successfully completed.'))
  .catch(e => console.log(e))
  .finally(() => schemaSession.close());

dataSession.readTransaction(txc => {
  dataUpdates.forEach(query => txc.run(query));
}).then(() => console.log('Data updates successfully completed'))
  .catch(e => console.log(e))
  .finally(() => dataSession.close());


