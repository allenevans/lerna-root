demo monorepo
=============

```
npm run pack; (cd demo; npm i file:../lerna-root-1.0.0.tgz); (cd demo/packages/common-utils; npm i file:../../../lerna-root-1.0.0.tgz); (cd demo/packages/domain-logic; npm i file:../../../lerna-root-1.0.0.tgz); (cd demo/packages/www-server; npm i file:../../../lerna-root-1.0.0.tgz);
```
