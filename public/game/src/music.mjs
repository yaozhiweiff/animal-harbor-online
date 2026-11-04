// Original 16-bar harbor theme: warm plucked chords, wooden melody, bass and soft percussion.
export const MUSIC_BPM=112;
export const MUSIC_BARS=16;
export const MUSIC_DURATION=MUSIC_BARS*4*60/MUSIC_BPM;
const CHORDS=[
 [48,[60,64,67,71]],[45,[57,60,64,67]],[41,[57,60,62,65]],[43,[55,59,62,65]],
 [48,[60,64,67,71]],[40,[55,59,62,64]],[38,[57,60,62,65]],[43,[55,59,62,65]],
 [41,[57,60,62,65]],[40,[55,60,64,67]],[38,[57,60,62,65]],[43,[55,59,62,65]],
 [45,[57,60,64,67]],[41,[57,60,62,65]],[43,[55,59,62,65]],[43,[55,59,62,65]],
];
const MELODY=[
 [[0,76,.5],[.75,79,.5],[1.5,81,.5],[2.5,79,.5],[3.25,76,.5]],
 [[0,72,.75],[1,76,.5],[1.75,79,.5],[2.5,76,.5],[3.25,72,.5]],
 [[0,69,.5],[.75,72,.5],[1.5,74,.75],[2.5,76,.5],[3.25,74,.5]],
 [[0,71,.5],[.75,74,.5],[1.5,79,1],[3,74,.5],[3.5,71,.5]],
 [[0,72,.5],[.5,76,.5],[1.25,79,.5],[2,81,.5],[2.75,79,.5],[3.5,76,.5]],
 [[0,71,.75],[1,74,.5],[1.75,76,.5],[2.5,79,.75],[3.5,76,.5]],
 [[0,69,.5],[.75,72,.5],[1.5,77,.75],[2.5,76,.5],[3.25,74,.5]],
 [[0,71,.5],[.75,74,.5],[1.5,79,.75],[2.5,77,.5],[3.25,74,.5]],
 [[0,81,1],[1.25,79,.5],[2,77,.5],[2.75,76,.5],[3.5,74,.5]],
 [[0,76,.75],[1,79,.5],[1.75,84,.75],[2.75,79,.5],[3.5,76,.5]],
 [[0,77,.75],[1,76,.5],[1.75,74,.5],[2.5,72,.5],[3.25,69,.5]],
 [[0,71,.5],[.75,74,.5],[1.5,79,1],[3,77,.5],[3.5,74,.5]],
 [[0,76,.5],[.75,79,.5],[1.5,81,.75],[2.5,79,.5],[3.25,76,.5]],
 [[0,77,.5],[.75,76,.5],[1.5,74,.5],[2.25,72,.75],[3.25,69,.5]],
 [[0,71,.5],[.75,74,.5],[1.5,79,.75],[2.5,77,.5],[3.25,74,.5]],
 [[0,71,1],[1.5,74,.75],[2.75,71,.5],[3.5,71,.5]],
];

export function createHarborMusicBuffer(context){
 const rate=24000,length=Math.round(MUSIC_DURATION*rate),buffer=context.createBuffer(2,length,rate),left=buffer.getChannelData(0),right=buffer.getChannelData(1),beat=60/MUSIC_BPM,cache=new Map();
 let seed=81357;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 function note(kind,midi,gate){
  const key=kind+':'+midi+':'+gate.toFixed(4);if(cache.has(key))return cache.get(key);
  const frequency=440*2**((midi-69)/12),tail=kind==='wood'?.18:kind==='pluck'?.12:.08,duration=gate+tail,data=new Float32Array(Math.ceil(duration*rate));
  for(let i=0;i<data.length;i++){
   const t=i/rate,p=2*Math.PI*frequency*t,release=Math.min(1,(duration-t)/.06),attack=Math.min(1,t/(kind==='bass'?.009:.004));let sample;
   if(kind==='wood')sample=(Math.sin(p)*.85+Math.sin(p*4)*.2*Math.exp(-t*18)+Math.sin(p*10)*.035*Math.exp(-t*40))*Math.exp(-t*4.5);
   else if(kind==='pluck')sample=(Math.sin(p)*.65+Math.sin(p*2)*.24*Math.exp(-t*10)+Math.sin(p*3)*.1*Math.exp(-t*15)+Math.sin(p*4)*.04*Math.exp(-t*20))*Math.exp(-t*8);
   else sample=(Math.sin(p)*.82+Math.sin(p*2)*.16+Math.sin(p*3)*.04)*Math.exp(-t*5);
   data[i]=sample*attack*release;
  }
  cache.set(key,data);return data;
 }
 function mix(data,when,volume,pan){
  const start=Math.round(when/64*length)%length,angle=(pan+1)*Math.PI/4,l=Math.cos(angle)*volume,r=Math.sin(angle)*volume;
  for(let i=0;i<data.length;i++){const j=(start+i)%length;left[j]+=data[i]*l;right[j]+=data[i]*r;}
 }
 const shaker=new Float32Array(Math.ceil(rate*.065)),tap=new Float32Array(Math.ceil(rate*.09)),kick=new Float32Array(Math.ceil(rate*.16));let previous=0;
 for(let i=0;i<shaker.length;i++){const t=i/rate,n=random()*2-1;shaker[i]=(n-previous)*.45*Math.exp(-t*65)*Math.min(1,t/.002);previous=n;}
 for(let i=0;i<tap.length;i++){const t=i/rate;tap[i]=(Math.sin(2*Math.PI*1750*t)*.6+(random()*2-1)*.12)*Math.exp(-t*60)*Math.min(1,t/.0015);}
 for(let i=0;i<kick.length;i++){const t=i/rate;kick[i]=Math.sin(2*Math.PI*(50*t+.8*(1-Math.exp(-t*28))))*Math.exp(-t*28)*Math.min(1,t/.005);}
 for(let bar=0;bar<MUSIC_BARS;bar++){
  const [root,chord]=CHORDS[bar],start=bar*4;
  for(const [position,midi,duration]of MELODY[bar])mix(note('wood',midi,duration*beat),start+position,.112,.1);
  for(const [position,accent]of [[0,.78],[1.5,.62],[2.5,.72],[3.5,.54]])chord.forEach((midi,string)=>mix(note('pluck',midi,.34),start+position+string*.018,.039*accent,-.34+string*.07));
  for(const [position,midi,duration]of [[0,root,1.05],[2,root+7,.7],[3.5,root+12,.35]])mix(note('bass',midi,duration*beat),start+position,.09,0);
  for(let step=0;step<8;step++)mix(shaker,start+step*.5+(step%2?.035:0),step%2?.013:.009,step%2?.35:-.35);
  for(const position of [1,3])mix(tap,start+position,.021,-.12);
  for(const position of [0,2])mix(kick,start+position,.026,0);
 }
 // Circular early reflections include note tails across the loop boundary.
 const dryLeft=left.slice(),dryRight=right.slice(),a=Math.round(rate*.095),b=Math.round(rate*.157);
 let energy=0,peak=0;
 for(let i=0;i<length;i++){
  left[i]+=dryRight[(i-a+length)%length]*.1+dryLeft[(i-b+length)%length]*.055;
  right[i]+=dryLeft[(i-a+length)%length]*.1+dryRight[(i-b+length)%length]*.055;
  energy+=left[i]**2+right[i]**2;peak=Math.max(peak,Math.abs(left[i]),Math.abs(right[i]));
 }
 const gain=Math.min(.06/Math.max(.00001,Math.sqrt(energy/(length*2))),.48/Math.max(.00001,peak));
 for(let i=0;i<length;i++){left[i]*=gain;right[i]*=gain;}
 return buffer;
}

export function createHarborMusic(context,destination){
 const source=context.createBufferSource(),fade=context.createGain();source.buffer=createHarborMusicBuffer(context);source.loop=true;fade.gain.value=0;source.connect(fade);fade.connect(destination);const start=context.currentTime+.02;fade.gain.setValueAtTime(0,start);fade.gain.linearRampToValueAtTime(1,start+.12);source.start(start);
 return {source,stop(){try{source.stop();}catch{}source.disconnect();fade.disconnect();}};
}
