const STORAGE_KEY='animal-harbor-audio-v1';
const DEFAULTS={muted:false,ambience:.35,effects:.7};
const COOLDOWN={catch:.09,place:.12,research:.14,discovery:.55,ornamental:.7,chain:.12,wave:.38};
const PRIORITY={catch:0,place:1,chain:1,wave:1,research:2,discovery:3,ornamental:4};
const MAX_VOICES=12;
const clamp=n=>Math.max(0,Math.min(1,n));

export function createNoiseBuffer(context,seconds=6){
 const buffer=context.createBuffer(1,Math.ceil(context.sampleRate*seconds),context.sampleRate),data=buffer.getChannelData(0),edge=Math.ceil(context.sampleRate*.008);
 for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.min(1,i/edge,(data.length-1-i)/edge);
 return buffer;
}

// Each cue is a small, disposable Web Audio graph. No audio downloads are needed.
export function synthesizeSound(context,destination,kind,{noise=null,at=context.currentTime+.005,level=1,pan=0,steps=1}={}){
 const output=context.createGain(),nodes=[output],sources=[];
 output.gain.value=level;
 if(context.createStereoPanner){const panner=context.createStereoPanner();panner.pan.value=Number.isFinite(pan)?Math.max(-.65,Math.min(.65,pan)):0;output.connect(panner);panner.connect(destination);nodes.push(panner);}else output.connect(destination);
 let duration=.25;
 const envelope=(gain,start,length,peak,attack=.006)=>{gain.setValueAtTime(0,start);gain.linearRampToValueAtTime(peak,start+attack);gain.exponentialRampToValueAtTime(.0001,start+length-.014);gain.linearRampToValueAtTime(0,start+length);};
 const tone=(frequency,offset,length,peak,type='sine',end=frequency)=>{
  const oscillator=context.createOscillator(),gain=context.createGain(),start=at+offset;
  oscillator.type=type;oscillator.frequency.setValueAtTime(frequency,start);if(end!==frequency)oscillator.frequency.exponentialRampToValueAtTime(end,start+length);
  envelope(gain.gain,start,length,peak);oscillator.connect(gain);gain.connect(output);oscillator.start(start);oscillator.stop(start+length+.01);nodes.push(oscillator,gain);sources.push(oscillator);duration=Math.max(duration,offset+length+.02);
 };
 const splash=(offset,length,peak,frequency=900,end=frequency,attack=.012)=>{
  const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain(),start=at+offset;
  source.buffer=noise||createNoiseBuffer(context,2);filter.type='bandpass';filter.frequency.setValueAtTime(frequency,start);filter.frequency.exponentialRampToValueAtTime(end,start+length);filter.Q.value=.55;
  envelope(gain.gain,start,length,peak,attack);source.connect(filter);filter.connect(gain);gain.connect(output);source.start(start,Math.random()*Math.max(0,source.buffer.duration-length-.05),length);nodes.push(source,filter,gain);sources.push(source);duration=Math.max(duration,offset+length+.02);
 };
 const bell=(frequency,offset,length,peak)=>{tone(frequency,offset,length,peak);tone(frequency*2.01,offset,length*.58,peak*.18);};
 switch(kind){
  case 'catch':{const pitch=.96+Math.random()*.08;tone(530*pitch,0,.19,.17,'sine',155*pitch);splash(.012,.12,.075,1450,650);break;}
  case 'place':tone(350,0,.23,.13,'sine',115);tone(610,.11,.18,.075,'sine',220);splash(0,.23,.09,1100,450);break;
  case 'research':[523.25,659.25,783.99].forEach((f,i)=>bell(f,i*.075,.32,.085));break;
  case 'discovery':[587.33,739.99,880,1174.66].forEach((f,i)=>bell(f,i*.09,.45,.078));splash(.2,.2,.02,4200,2600);break;
  case 'ornamental':[783.99,987.77,1174.66,1567.98].forEach((f,i)=>{bell(f,i*.105,.75,.076);tone(f*1.5,i*.105,.42,.014);});splash(.06,.45,.035,2600,4300,.04);break;
  case 'chain':[920,1230,1460].slice(0,Math.max(2,Math.min(3,steps+1))).forEach((f,i)=>tone(f,i*.045,.19,.095,'sine',f*1.08));break;
  case 'wave':splash(0,.72,.36,1500,260,.075);tone(110,.025,.5,.035,'sine',175);break;
  default:output.disconnect();return null;
 }
 let disposed=false;
 const dispose=()=>{if(disposed)return;disposed=true;for(const source of sources)try{source.stop();}catch{}for(const node of nodes)try{node.disconnect();}catch{}};
 return {duration,output,dispose,stop(){if(disposed)return;output.gain.cancelScheduledValues(context.currentTime);output.gain.setTargetAtTime(0,context.currentTime,.004);for(const source of sources)try{source.stop(context.currentTime+.025);}catch{}setTimeout(dispose,40);}};
}

export function createOceanAmbience(context,destination,noise=createNoiseBuffer(context)){
 const nodes=[],sources=[];
 for(const layer of [{low:65,high:1050,base:.25,depth:.21,period:8.7,offset:0,pan:-.28},{low:280,high:2600,base:.13,depth:.115,period:11.3,offset:2.9,pan:.32}]){
  const source=context.createBufferSource(),highpass=context.createBiquadFilter(),lowpass=context.createBiquadFilter(),swell=context.createGain(),lfo=context.createOscillator(),depth=context.createGain();
  source.buffer=noise;source.loop=true;highpass.type='highpass';highpass.frequency.value=layer.low;lowpass.type='lowpass';lowpass.frequency.value=layer.high;lowpass.Q.value=.35;
  swell.gain.value=layer.base;lfo.frequency.value=1/layer.period;depth.gain.value=layer.depth;lfo.connect(depth);depth.connect(swell.gain);source.connect(highpass);highpass.connect(lowpass);lowpass.connect(swell);
  if(context.createStereoPanner){const pan=context.createStereoPanner();pan.pan.value=layer.pan;swell.connect(pan);pan.connect(destination);nodes.push(pan);}else swell.connect(destination);
  source.start(context.currentTime,layer.offset);lfo.start();nodes.push(source,highpass,lowpass,swell,lfo,depth);sources.push(source,lfo);
 }
 return {stop(){for(const source of sources)try{source.stop();}catch{}for(const node of nodes)try{node.disconnect();}catch{}}};
}

export class HarborAudio{
 constructor({onChange=()=>{}}={}){
  this.onChange=onChange;this.preferences={...DEFAULTS};this.context=null;this.ready=false;this.unlocked=false;this.backgrounded=false;this.voices=new Set();this.lastPlayed=new Map();this.suspendTimer=null;this.cleanup=[];
  this.supported=!!(globalThis.AudioContext||globalThis.webkitAudioContext);
  try{const p=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');if(p){this.preferences.muted=p.muted===true;for(const key of ['ambience','effects'])if(Number.isFinite(p[key]))this.preferences[key]=clamp(p[key]);}}catch{}
 }
 install(){
  const gesture=event=>{if(event.isTrusted&&(event.type==='pointerdown'||!event.repeat))this.unlock();};
  const visibility=event=>{this.backgrounded=event.type==='pagehide'||event.type!=='pageshow'&&document.hidden;this.sync();};
  for(const type of ['pointerdown','keydown']){document.addEventListener(type,gesture,{capture:true,passive:true});this.cleanup.push(()=>document.removeEventListener(type,gesture,true));}
  for(const type of ['visibilitychange']){document.addEventListener(type,visibility);this.cleanup.push(()=>document.removeEventListener(type,visibility));}
  for(const type of ['pagehide','pageshow']){window.addEventListener(type,visibility);this.cleanup.push(()=>window.removeEventListener(type,visibility));}
  this.onChange();
 }
 unlock(){
  if(!this.supported||this.preferences.muted||document.hidden||this.backgrounded)return;
  try{
   if(!this.context){
    const AudioContext=globalThis.AudioContext||globalThis.webkitAudioContext;this.context=new AudioContext({latencyHint:'interactive'});
    const c=this.context;this.master=c.createGain();this.master.gain.value=0;this.effects=c.createGain();this.ambience=c.createGain();this.effects.gain.value=0;this.ambience.gain.value=0;
    const limiter=c.createDynamicsCompressor();limiter.threshold.value=-12;limiter.knee.value=15;limiter.ratio.value=6;limiter.attack.value=.004;limiter.release.value=.2;
    this.effects.connect(this.master);this.ambience.connect(this.master);this.master.connect(limiter);limiter.connect(c.destination);this.noise=createNoiseBuffer(c);this.ocean=createOceanAmbience(c,this.ambience,this.noise);
   }
   this.unlocked=true;this.sync();
  }catch{this.supported=false;this.onChange();}
 }
 setReady(ready){this.ready=!!ready;this.sync();}
 setMuted(muted){this.preferences.muted=!!muted;this.persist();if(!muted)this.unlock();this.sync();this.onChange();}
 setVolume(channel,value){if(!['ambience','effects'].includes(channel)||!Number.isFinite(value))return;this.preferences[channel]=clamp(value);this.persist();this.unlock();this.sync();this.onChange();}
 persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(this.preferences));}catch{}}
 stopVoices(){for(const item of this.voices){clearTimeout(item.timer);item.voice.stop();}this.voices.clear();this.lastPlayed.clear();}
 sync(){
  if(!this.context)return;clearTimeout(this.suspendTimer);
  const c=this.context,silent=this.preferences.muted||document.hidden||this.backgrounded,time=c.currentTime;
  for(const [param,value]of [[this.master.gain,silent?0:1],[this.ambience.gain,this.ready?this.preferences.ambience:0],[this.effects.gain,this.ready?this.preferences.effects:0]]){param.cancelScheduledValues(time);param.setTargetAtTime(value,time,.025);}
  if(silent){this.stopVoices();this.suspendTimer=setTimeout(()=>{if(this.preferences.muted||document.hidden||this.backgrounded)c.suspend().catch(()=>{});},70);}
  else if(c.state==='suspended'||c.state==='interrupted')c.resume().catch(()=>{});
 }
 play(kind,{level=1,pan=0,steps=1}={}){
  if(!this.context||!this.ready||!this.unlocked||this.preferences.muted||this.preferences.effects===0||document.hidden||this.backgrounded||!Object.hasOwn(COOLDOWN,kind))return false;
  const time=this.context.currentTime;if(time-(this.lastPlayed.get(kind)??-Infinity)<COOLDOWN[kind])return false;
  if(this.voices.size>=MAX_VOICES){const old=[...this.voices].find(item=>PRIORITY[item.kind]<PRIORITY[kind]);if(!old)return false;clearTimeout(old.timer);old.voice.stop();this.voices.delete(old);}
  try{const voice=synthesizeSound(this.context,this.effects,kind,{noise:this.noise,level,pan,steps});if(!voice)return false;const item={kind,voice,timer:null};item.timer=setTimeout(()=>{voice.dispose();this.voices.delete(item);},(voice.duration+.12)*1000);this.voices.add(item);this.lastPlayed.set(kind,time);return true;}catch{return false;}
 }
 handle(events){
  if(!this.ready||!this.unlocked)return;
  let caught=null,newSpecies=false,ornamental=false,research=false,chain=0,wave=null,placed=false;
  for(const event of events){
   if(event.type==='catch'){caught=event;newSpecies||=event.newSpecies===true;}
   else if(event.type==='ornamentalCatch')ornamental=true;
   else if(event.type==='research')research=true;
   else if(event.type==='chain')chain+=event.targets.length;
   else if(event.type==='pulse'&&!event.buff)wave=event;
   else if(event.type==='purchase'&&event.kind==='rod')placed=true;
  }
  if(ornamental)this.play('ornamental');else if(newSpecies)this.play('discovery');else if(caught)this.play('catch',{level:caught.source==='manual'?.9:.48,pan:(caught.x-.5)*.5});
  if(chain)this.play('chain',{steps:chain});if(wave)this.play('wave',{pan:(wave.x-.5)*.5});if(research)this.play('research');if(placed)this.play('place');
 }
 destroy(){this.stopVoices();clearTimeout(this.suspendTimer);this.ocean?.stop();for(const cleanup of this.cleanup)cleanup();this.context?.close().catch(()=>{});this.context=null;}
}
