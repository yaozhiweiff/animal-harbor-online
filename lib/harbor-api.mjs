const SESSION_DAYS=30,ITERATIONS=100000,MAX_BODY=3_000_000;
const PUBLIC_FISH=new Set(['puffer','pearl','moon','dawn','ray','lionfish','seadragon','gold','flying','grouper','sword','oarfish']);
const THEMES=new Set(['sun','coral','moon']);
const encoder=new TextEncoder();
class ApiError extends Error{constructor(status,message,code='request_error',details={}){super(message);Object.assign(this,{status,code,details});}}
const fail=(status,message,code,details)=>{throw new ApiError(status,message,code,details);};
const now=()=>Math.floor(Date.now()/1000);
const hex=bytes=>Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
const random=length=>crypto.getRandomValues(new Uint8Array(length));
const base64=bytes=>{let text='';for(let i=0;i<bytes.length;i+=8192)text+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(text);};
const unbase64=text=>Uint8Array.from(atob(text),c=>c.charCodeAt(0));
const hash=async text=>hex(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(text))));
async function passwordHash(password,salt){const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);return hex(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:unbase64(salt),iterations:ITERATIONS,hash:'SHA-256'},key,256)));}
const sameHash=(a,b)=>{let result=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)result|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return result===0;};
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});
async function limitedBody(stream,max=MAX_BODY){if(!stream)return new Uint8Array();const reader=stream.getReader(),chunks=[];let size=0;while(true){const{done,value}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();fail(413,'航程数据过大，请先出售部分库存后重试。');}chunks.push(value);}const result=new Uint8Array(size);let offset=0;for(const chunk of chunks){result.set(chunk,offset);offset+=chunk.length;}return result;}
async function readJson(request){if(!request.headers.get('content-type')?.includes('application/json'))fail(415,'请求格式应为 JSON。');let stream=request.body;const encoding=request.headers.get('content-encoding');if(encoding==='gzip')stream=stream?.pipeThrough(new DecompressionStream('gzip'));else if(encoding&&encoding!=='identity')fail(415,'不支持此压缩格式。');try{const text=new TextDecoder('utf-8',{fatal:true}).decode(await limitedBody(stream));return JSON.parse(text);}catch(error){if(error instanceof ApiError)throw error;fail(400,'请求数据无法读取。');}}
async function compress(text){return base64(new Uint8Array(await new Response(new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer()));}
async function decompress(text){return JSON.parse(new TextDecoder().decode(await new Response(new Blob([unbase64(text)]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()));}
function credentials(input){if(typeof input?.name!=='string'||typeof input?.password!=='string')fail(400,'请输入船长名称和密码。');const name=input.name.normalize('NFKC').trim();if(!/^[\p{L}\p{N}_-]{2,16}$/u.test(name))fail(400,'名称需为2～16位中英文、数字、下划线或短横线。');if(input.password.length<8||input.password.length>128)fail(400,'密码长度需为8～128位。');return {name,key:name.toLowerCase(),password:input.password};}
function sessionCookie(request,token='',age=SESSION_DAYS*86400){return `harbor_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${new URL(request.url).protocol==='https:'?'; Secure':''}`;}
function tokenFrom(request){const bearer=request.headers.get('authorization')?.match(/^Bearer (\S+)$/i)?.[1],token=bearer||(request.headers.get('cookie')||'').split(';').map(v=>v.trim()).find(v=>v.startsWith('harbor_session='))?.slice(15)||'';return /^[A-Za-z0-9_-]{40,64}$/.test(token)?token:null;}
async function session(request,db){const token=tokenFrom(request);if(!token)return null;return db.prepare('SELECT a.id,a.name FROM sessions s JOIN accounts a ON a.id=s.account_id WHERE s.token_hash=? AND s.expires_at>?').bind(await hash(token),now()).first();}
async function requireUser(request,db){const user=await session(request,db);if(!user)fail(401,'请先登录船长账号。','unauthorized');return user;}
async function issueSession(request,db,user,includeToken=false){const token=base64(random(32)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');await db.batch([db.prepare('DELETE FROM sessions WHERE expires_at<?').bind(now()),db.prepare('INSERT INTO sessions(token_hash,account_id,created_at,expires_at) VALUES(?,?,?,?)').bind(await hash(token),user.id,now(),now()+SESSION_DAYS*86400)]);return json({user,...(includeToken?{sessionToken:token}:{})},200,{'Set-Cookie':sessionCookie(request,token)});}
async function rateLimit(request,db,name){const address=request.headers.get('cf-connecting-ip')||'local';for(const key of ['ip:'+address,'name:'+name]){const id=await hash(key),time=now(),row=await db.prepare('INSERT INTO auth_limits(key,count,window_start) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN window_start>? THEN count+1 ELSE 1 END,window_start=CASE WHEN window_start>? THEN window_start ELSE ? END RETURNING count').bind(id,time,time-600,time-600,time).first();if(row.count>20)fail(429,'尝试次数较多，请十分钟后再试。','rate_limited');}await db.prepare('DELETE FROM auth_limits WHERE window_start<?').bind(now()-86400).run();}
const finite=(value,max=1e18)=>typeof value==='number'&&Number.isFinite(value)&&value>=0&&value<=max;
function publicAquarium(input){const source=input&&typeof input==='object'?input:{},best={};for(const[id,item]of Object.entries(source.best||{})){if(PUBLIC_FISH.has(id)&&item&&finite(item.weight,1e12)&&item.weight>0&&[1,2,3].includes(item.medal))best[id]={weight:Math.round(item.weight),medal:item.medal};}const tank=[...new Set((Array.isArray(source.tank)?source.tank:[]).filter(id=>best[id]))];const selected=source.selected||{};return {best,tank,selected:Object.fromEntries(['crew','tank','port'].map(kind=>[kind,THEMES.has(selected[kind])?selected[kind]:null]))};}
const publicRow=(row,index)=>({id:row.account_id,name:row.name,peak:row.peak,rank:index+1,aquariumUnlocked:!!row.aquarium_unlocked,updatedAt:row.updated_at});
const topSql='SELECT p.account_id,a.name,p.peak,p.aquarium_unlocked,p.updated_at FROM player_progress p JOIN accounts a ON a.id=p.account_id WHERE p.peak>0 ORDER BY p.peak DESC,a.created_at ASC,a.id ASC LIMIT 10';

export async function handleHarborApi(request,env){
 const origin=request.headers.get('origin'),allowed=!!origin&&String(env.ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).includes(origin);
 if(request.method==='OPTIONS')return allowed?new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET, POST, PUT, OPTIONS','Access-Control-Allow-Headers':'Authorization, Content-Type, Content-Encoding','Access-Control-Max-Age':'86400','Vary':'Origin'}}):json({error:{code:'origin_mismatch',message:'请求来源不匹配。'}},403);
 const response=await handleRequest(request,env,allowed);
 if(allowed){const headers=new Headers(response.headers);headers.set('Access-Control-Allow-Origin',origin);headers.set('Vary','Origin');return new Response(response.body,{status:response.status,headers});}
 return response;
}
async function handleRequest(request,env,publicClient){
 try{
  const db=env.DB;if(!db)fail(503,'云端服务尚未准备完成，请稍后再试。','service_unavailable');
  const path=new URL(request.url).pathname.replace(/^\/api\/harbor/,'')||'/',method=request.method;
  if(['POST','PUT','DELETE'].includes(method)){const origin=request.headers.get('origin');if(!publicClient&&origin&&new URL(origin).host!==new URL(request.url).host&&new URL(origin).host!==request.headers.get('host'))fail(403,'请求来源不匹配。','origin_mismatch');if(!publicClient&&request.headers.get('sec-fetch-site')==='cross-site')fail(403,'请在游戏页面中操作。');}
  if(path==='/health'&&method==='GET')return json({ok:true,service:'animal-harbor',clientSimulation:true,saveIntervalSeconds:60});
  if(path==='/register'&&method==='POST'){
   const c=credentials(await readJson(request));await rateLimit(request,db,c.key);const id=crypto.randomUUID(),salt=base64(random(16)),digest=await passwordHash(c.password,salt);
   try{await db.batch([db.prepare('INSERT INTO accounts(id,name,name_key,password_salt,password_hash,created_at) VALUES(?,?,?,?,?,?)').bind(id,c.name,c.key,salt,digest,now()),db.prepare('INSERT INTO player_progress(account_id,revision,peak,aquarium_unlocked,updated_at) VALUES(?,0,0,0,?)').bind(id,now())]);}catch(error){if(/unique/i.test(error.message))fail(409,'这个船长名称已被使用，请换一个。','name_taken');throw error;}
   return issueSession(request,db,{id,name:c.name},publicClient);
  }
  if(path==='/login'&&method==='POST'){
   const c=credentials(await readJson(request));await rateLimit(request,db,c.key);const account=await db.prepare('SELECT id,name,password_salt,password_hash FROM accounts WHERE name_key=?').bind(c.key).first(),salt=account?.password_salt||'AAAAAAAAAAAAAAAAAAAAAA==',digest=await passwordHash(c.password,salt);if(!account||!sameHash(digest,account.password_hash))fail(401,'名称或密码不正确。','invalid_credentials');return issueSession(request,db,{id:account.id,name:account.name},publicClient);
  }
  if(path==='/logout'&&method==='POST'){const token=tokenFrom(request);if(token)await db.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await hash(token)).run();return json({ok:true},200,{'Set-Cookie':sessionCookie(request,'',0)});}
  const user=await requireUser(request,db);
  if(path==='/me'&&method==='GET')return json({user});
  if(path==='/progress'&&method==='GET'){
   const row=await db.prepare('SELECT save_data,revision,peak,updated_at FROM player_progress WHERE account_id=?').bind(user.id).first();return json({user,save:row.save_data?await decompress(row.save_data):null,revision:row.revision,peak:row.peak,updatedAt:row.updated_at});
  }
  if(path==='/progress'&&method==='PUT'){
   const data=await readJson(request),save=data?.save;if(!save||save.version!==2||!Array.isArray(save.rods)||!Array.isArray(save.boats)||!finite(save.coins)||!finite(data.peak)||!Number.isSafeInteger(data.expectedRevision)||data.expectedRevision<0||typeof data.uploadId!=='string'||data.uploadId.length>64)fail(400,'航程格式不正确。');
   const text=JSON.stringify(save);if(encoder.encode(text).length>MAX_BODY-1000)fail(413,'航程数据过大，请先出售部分库存后重试。');
   const aquarium=publicAquarium(data.aquarium),savedAt=now(),compressed=await compress(text),row=await db.prepare('UPDATE player_progress SET save_data=?,revision=revision+1,peak=MAX(peak,?),aquarium_unlocked=?,aquarium_json=?,updated_at=?,last_upload_id=? WHERE account_id=? AND revision=? RETURNING revision,peak,updated_at').bind(compressed,data.peak,data.aquariumUnlocked?1:0,JSON.stringify(aquarium),savedAt,data.uploadId,user.id,data.expectedRevision).first();
   if(!row){const current=await db.prepare('SELECT revision,peak,updated_at,last_upload_id FROM player_progress WHERE account_id=?').bind(user.id).first();if(current.last_upload_id===data.uploadId)return json({revision:current.revision,peak:current.peak,updatedAt:current.updated_at});fail(409,'另一台设备更新了航程，请选择要继续的进度。','save_conflict',{revision:current.revision,peak:current.peak,updatedAt:current.updated_at});}
   return json({revision:row.revision,peak:row.peak,updatedAt:row.updated_at});
  }
  if(path==='/leaderboard'&&method==='GET'){const rows=await db.prepare(topSql).all();return json({players:rows.results.map(publicRow),self:{id:user.id}});}
  if(path==='/aquariums'&&method==='GET'){
   const own=await db.prepare('SELECT aquarium_unlocked FROM player_progress WHERE account_id=?').bind(user.id).first();if(!own?.aquarium_unlocked)fail(403,'开放自己的港口水族馆后，即可拜访其他船长。','aquarium_locked');const rows=await db.prepare(topSql).all();return json({players:rows.results.map(publicRow).filter(p=>p.aquariumUnlocked&&p.id!==user.id)});
  }
  if(path.startsWith('/aquariums/')&&method==='GET'){
   const own=await db.prepare('SELECT aquarium_unlocked FROM player_progress WHERE account_id=?').bind(user.id).first();if(!own?.aquarium_unlocked)fail(403,'请先开放自己的水族馆。','aquarium_locked');let id=decodeURIComponent(path.slice('/aquariums/'.length));
   if(id==='random'){const choice=await db.prepare('SELECT account_id FROM player_progress WHERE aquarium_unlocked=1 AND account_id<>? ORDER BY RANDOM() LIMIT 1').bind(user.id).first();if(!choice)fail(404,'暂时没有其他已开放水族馆的船长，稍后再来。','no_aquariums');id=choice.account_id;}
   if(id.length>64)fail(404,'未找到这座水族馆。');const row=await db.prepare('SELECT a.id,a.name,p.peak,p.aquarium_json,p.updated_at FROM accounts a JOIN player_progress p ON p.account_id=a.id WHERE a.id=? AND p.aquarium_unlocked=1').bind(id).first();if(!row)fail(404,'这位船长尚未开放水族馆。','aquarium_unavailable');return json({owner:{id:row.id,name:row.name,peak:row.peak,updatedAt:row.updated_at},aquarium:publicAquarium(JSON.parse(row.aquarium_json||'{}'))});
  }
  fail(404,'接口不存在。','not_found');
 }catch(error){if(error instanceof ApiError)return json({error:{code:error.code,message:error.message,...error.details}},error.status);console.error('Harbor API:',error?.message||'unknown error');return json({error:{code:'server_error',message:'云端暂时无法完成请求，请稍后重试。'}},500);}
}
