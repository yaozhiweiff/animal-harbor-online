import {mkdirSync,cpSync,copyFileSync,writeFileSync,statSync,readdirSync} from 'node:fs';
import path from 'node:path';
const root=process.cwd(),source=path.resolve(root,'../fishing-cats'),target=path.join(root,'public/game');
mkdirSync(target,{recursive:true});for(const name of ['src','vendor'])cpSync(path.join(source,name),path.join(target,name),{recursive:true});
for(const name of ['index.html','style.css'])copyFileSync(path.join(source,name),path.join(target,name));
for(const name of ['data','fish/a2','boats/a2-aquarium','aquarium']){mkdirSync(path.dirname(path.join(target,'assets',name)),{recursive:true});cpSync(path.join(source,'assets',name),path.join(target,'assets',name),{recursive:true});}
writeFileSync(path.join(target,'runtime-config.js'),'window.HARBOR_ONLINE = true;\n');copyFileSync(path.join(source,'server/harbor-api.mjs'),path.join(root,'lib/harbor-api.mjs'));console.log('Prepared online game assets and shared API.');
