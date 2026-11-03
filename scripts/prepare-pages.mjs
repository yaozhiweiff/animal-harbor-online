import {cpSync,mkdirSync,writeFileSync} from 'node:fs';
import path from 'node:path';
const origin=new URL(process.env.HARBOR_API_URL||'https://animal-harbor-api.royal-gems.workers.dev');
if(origin.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(origin.hostname))throw new Error('Backend must use HTTPS.');
const target=path.resolve('.pages-dist');mkdirSync(target,{recursive:true});cpSync('public/game',target,{recursive:true});
writeFileSync(path.join(target,'runtime-config.js'),`window.HARBOR_ONLINE = true;\nwindow.HARBOR_API_BASE = ${JSON.stringify(origin.origin+'/api/harbor')};\n`);
writeFileSync(path.join(target,'.nojekyll'),'');console.log('GitHub Pages assets prepared. API:',origin.origin);
