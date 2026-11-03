import {THEMES} from './aquarium-data.mjs';
import {PORT,CREW,FLOATS,FISH_BY_ID,RARITIES,ANIMAL_SCENE_SCALE,HATS} from './content.mjs';
import {drawOcean,drawFishTexture} from './art.mjs';
import {drawFloat,FLOAT_ART_SIZE} from './float-art.mjs';
import {drawGift,GIFT_ART_SIZE} from './gift-art.mjs';
import {headwearLayout} from './headwear-layout.mjs';
const hex=c=>parseInt(c.slice(1),16);
export function createOceanGame(sim,bridge){
 const Phaser=window.Phaser,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 class OceanScene extends Phaser.Scene{
  constructor(){super('Ocean');this.buoys=new Map();this.boats=new Map();this.crates=new Map();this.fx=[];this.pulseEffects=[];this.clock=0;this.drawnZone=-1;this.pointer=null;}
  preload(){this.load.on('progress',progress=>bridge.onProgress?.(progress));CREW.forEach((c,i)=>this.load.image('crew-'+i,c.image));THEMES.forEach(t=>{this.load.image('skin-'+t.id,t.crewImage);this.load.image('port-'+t.id,t.portImage);});}
  create(){
   this.background=this.add.image(0,0,'__WHITE').setOrigin(0);this.effects=this.add.graphics().setDepth(4);this.foreground=this.add.graphics().setDepth(18);this.portDecoration=this.add.image(0,0,'__WHITE').setDepth(3).setVisible(false);
   FLOATS.forEach((f,i)=>{const tex=this.textures.createCanvas('float-'+i,FLOAT_ART_SIZE.width,FLOAT_ART_SIZE.height);drawFloat(tex.canvas,i);tex.refresh();});
   HATS.forEach(h=>{const tex=this.textures.createCanvas('gift-'+h.id,GIFT_ART_SIZE.width,GIFT_ART_SIZE.height);drawGift(tex.canvas,h.id);tex.refresh();});
   const fish=this.textures.createCanvas('fish-shadow',80,40);drawFishTexture(fish.canvas);fish.refresh();this.shadows=Array.from({length:9},()=>this.add.image(0,0,'fish-shadow').setAlpha(.1).setDepth(1));
   this.waterLabel=this.add.text(0,0,'鱼获码头',{fontFamily:'Microsoft YaHei',fontSize:'11px',color:'#f8ffeb'}).setOrigin(.5).setDepth(2);
   this.input.on('pointermove',p=>{this.pointer={x:p.x,y:p.y};if(!bridge.isPaused())this.collectAt(p.x,p.y,false);});
   this.input.on('pointerout',()=>{this.pointer=null;this.input.setDefaultCursor('default');});this.input.on('pointerdown',p=>{if(!bridge.isPaused())this.collectAt(p.x,p.y,true);});this.scale.on('resize',()=>this.resize());this.resize();bridge.onReady(this);
  }
  resize(){this.w=this.scale.width;this.h=this.scale.height;this.unit=Phaser.Math.Clamp(this.w/1000,.8,1.1);this.boatSize=103*ANIMAL_SCENE_SCALE*this.unit;
   this.syncFishingLayout();
   if(this.textures.exists('ocean-bg')){this.background.setTexture('__WHITE');this.textures.remove('ocean-bg');}const tex=this.textures.createCanvas('ocean-bg',Math.ceil(this.w),Math.ceil(this.h));drawOcean(tex.canvas,sim.state.zone);tex.refresh();this.background.setTexture('ocean-bg').setDisplaySize(this.w,this.h);this.drawnZone=sim.state.zone;this.waterLabel.setPosition(this.w*.145,this.h*.815).setFontSize(10*this.unit);
  }
  syncFishingLayout(){const obstacles=bridge.fishingObstacles?.(),signature=JSON.stringify([this.w,this.h,obstacles]);if(signature!==this.fishingLayoutSignature){this.fishingLayoutSignature=signature;sim.setFishingLayout(this.w,this.h,obstacles);}}
  anchor(q){const e=sim.qteEntity(q);return e?{x:e.x*this.w,y:e.y*this.h}:null;}
  decorationAnchor(boat,kind='hat'){const a=headwearLayout(boat.type,!!boat.hat)[kind],flipX=Math.cos(boat.heading)<0;return {x:boat.x*this.w+(a.x-.5)*this.boatSize*(flipX?-1:1),y:boat.y*this.h+Math.sin(this.clock*2+boat.id)+(a.y-.5)*this.boatSize,width:a.width*this.boatSize,originX:a.originX,originY:a.originY,flipX};}
  giftAnchor(boat){return this.decorationAnchor(boat);}
  partnerAt(x,y){let closest=null,nearest=Infinity;for(const b of [...sim.state.boats].reverse()){const d=Math.hypot(x-b.x*this.w,y-b.y*this.h),gift=this.giftAnchor(b),radius=Math.max(25,this.boatSize*.53);if((d<=radius||b.hat&&Math.hypot(x-gift.x,y-gift.y)<gift.width/2)&&d<nearest){closest=b;nearest=d;}}return closest;}
  collectAt(x,y,click){const active=sim.manualQTE(),partner=this.partnerAt(x,y);this.input.setDefaultCursor(partner?'pointer':'default');if(active){const e=sim.qteEntity(active);if(click&&e&&Math.hypot(x-e.x*this.w,y-e.y*this.h)<30){bridge.tap();return;}}
   if(partner){if(click)bridge.manageBoat?.(partner.id);return;}if(active)return;
   let closest=null,d=Infinity;const radius=Math.max(22,25*this.unit)+sim.stat('CURSOR','RADIUS')*this.unit;
   for(const r of sim.allRods()){if(r.state!=='ready')continue;const dist=Math.hypot(x-r.x*this.w,y-r.y*this.h);if(dist<radius&&dist<d&&(click||FISH_BY_ID[r.pending]?.rank<3)){closest=r;d=dist;}}
   if(closest)bridge.collect(closest.id);else if(click){const c=sim.state.crates.find(c=>c.zone===sim.state.zone&&Math.hypot(x-c.x*this.w,y-c.y*this.h)<20);if(c)bridge.notice('这箱'+RARITIES[c.lot.rank-1].name+'渔获等待第 '+(c.lot.rank>=3?c.lot.rank+1:1)+' 档及以上伙伴装船');}
  }
  text(x,y,text,color='#fff6d8'){if(this.fx.length>50)return;const t=this.add.text(x,y,text,{fontFamily:'Microsoft YaHei',fontSize:'11px',color,stroke:'#34707b',strokeThickness:3}).setOrigin(.5).setDepth(30);this.fx.push(t);this.tweens.add({targets:t,y:y-42,alpha:0,duration:1300,onComplete:()=>{t.destroy();this.fx=this.fx.filter(v=>v!==t);}});}
  event(e){const x=e.x*this.w,y=e.y*this.h;if(e.type==='catch'){this.text(x,y-22,`${e.definition.name}${e.fish.crit?' · 双倍':''}`,RARITIES[e.fish.rank-1].color);if(!reduced&&this.fx.length<40){for(let i=0;i<5;i++){const dot=this.add.circle(x,y,2,hex(RARITIES[e.fish.rank-1].color)).setDepth(20);this.tweens.add({targets:dot,x:x+Math.cos(i*1.26)*28,y:y+Math.sin(i*1.26)*20,alpha:0,duration:550,onComplete:()=>dot.destroy()});}}}
   if(e.type==='remoteStore')this.text(x,y+4,'↗ 远程入库','#ffe3a2');
   if(e.type==='sale')this.text(PORT.x*this.w,PORT.y*this.h-20,'+'+Math.round(e.value)+' 金币');
   if(e.type==='qteFail')this.text(x,y-16,'鱼逃脱了');
   if(e.type==='pulse'){if(this.pulseEffects.length>=48)this.pulseEffects.shift().g.destroy();this.pulseEffects.push({g:this.add.graphics().setDepth(22),x:e.x,y:e.y,radius:e.radius,buff:e.buff,ownerKind:e.ownerKind,ownerId:e.ownerId,toolType:e.toolType,elapsed:0,duration:reduced?.65:1.3});}
   if(e.type==='chain'){const g=this.add.graphics().setDepth(17);g.lineStyle(2,0xffe8a2,.9);for(const t of e.targets){g.beginPath();g.moveTo(x,y);g.lineTo((e.x+t.x)/2*this.w+8,(e.y+t.y)/2*this.h-12);g.lineTo(t.x*this.w,t.y*this.h);g.strokePath();}this.tweens.add({targets:g,alpha:0,duration:420,onComplete:()=>g.destroy()});}
  }
  renderPulses(dt){
   for(const p of this.pulseEffects){if(!bridge.isPaused())p.elapsed+=dt;const g=p.g;g.clear();if(p.elapsed>=p.duration){g.destroy();continue;}const source=p.ownerKind==='boat'?sim.boat(p.ownerId):null;g.setPosition((source?.x??p.x)*this.w,(source?.y??p.y)*this.h);const rx=Math.max(36*this.unit,p.radius*this.w),ry=Math.max(20*this.unit,p.radius*this.h),color=p.buff==='yield'?0xc6ed9e:p.buff==='speed'?0x9cdfff:0xc5f1ff;
    for(let i=0;i<(reduced?1:3);i++){const stage=(p.elapsed/p.duration-i*.18)/(1-i*.18);if(stage<0||stage>1)continue;const size=reduced?1:.16+.84*(1-Math.pow(1-stage,2)),alpha=(1-stage)*.95;g.lineStyle(3.5*this.unit,color,alpha);g.strokeEllipse(0,0,rx*2*size,ry*2*size);g.lineStyle(1.3*this.unit,0xffffff,alpha*.9);g.strokeEllipse(0,0,rx*2*size+3*this.unit,ry*2*size+2*this.unit);}
   }
   this.pulseEffects=this.pulseEffects.filter(p=>p.elapsed<p.duration);
  }
  update(_time,delta){const dt=Math.min(delta/1000,.05);if(!bridge.isPaused()){sim.update(dt);this.clock+=reduced?dt*.2:dt;}if(this.drawnZone!==sim.state.zone)this.resize();const s=sim.state,t=this.clock,g=this.effects,f=this.foreground;g.clear();f.clear();this.renderPulses(dt);const portTheme=THEMES.find(t=>t.id===s.cosmetics.selected.port);this.portDecoration.setVisible(!!portTheme);if(portTheme){const src=this.textures.get('port-'+portTheme.id).getSourceImage(),width=Math.min(175,this.w*.22);this.portDecoration.setTexture('port-'+portTheme.id).setPosition(Math.max(width*.5+8,this.w*.05),this.h*.69).setDisplaySize(width,width*src.height/src.width);}
   this.shadows.forEach((fish,i)=>fish.setPosition(((i*113+t*(i%2?4:3))%1000)/1000*this.w,(.3+(i*61%400)/1000)*this.h+Math.sin(t+i)*3).setScale(this.unit*.55).setFlipX(i%2===0));
   for(const r of sim.allRods()){let v=this.buoys.get(r.id);if(!v){v={image:this.add.image(0,0,'float-'+r.type).setDepth(8),label:this.add.text(0,0,'',{fontFamily:'Microsoft YaHei',fontSize:'10px',color:'#f7ffe8',stroke:'#3b7b83',strokeThickness:2}).setOrigin(.5).setDepth(9),mark:this.add.text(0,0,'!',{fontFamily:'Georgia',fontSize:'22px',color:'#fff3b8',stroke:'#477d7a',strokeThickness:2}).setOrigin(.5).setDepth(10)};this.buoys.set(r.id,v);}const x=r.x*this.w,y=r.y*this.h,ready=r.state==='ready',rank=FISH_BY_ID[r.pending]?.rank,col=hex(RARITIES[(rank||1)-1].color),hover=this.pointer&&Math.hypot(this.pointer.x-x,this.pointer.y-y)<28;
    v.image.setPosition(x,y+Math.sin(t*2+r.id)*1.5).setScale(this.unit*.52).setRotation(ready?Math.sin(t*10)*.04:0).setAlpha(r.state==='busy'?.55:1);v.mark.setVisible(ready).setPosition(x,y-29*this.unit).setColor(RARITIES[(rank||1)-1].color);v.label.setVisible((sim.allRods().length<10||hover)&&r.state!=='qte').setPosition(x,y+27*this.unit).setText(ready?(rank>=3?(r.reserved?'伙伴驶来':'点击搏鱼'):r.reserved?'伙伴驶来':'咬钩啦'):FLOATS[r.type].name);
    if(ready||r.state==='qte'){g.fillStyle(col,.12);g.fillEllipse(x,y+4,56*this.unit,28*this.unit);const p=(t*.8+r.id*.23)%1;g.lineStyle(2,col,(1-p)*.8);g.strokeEllipse(x,y+3,(42+p*30)*this.unit,(20+p*18)*this.unit);g.lineStyle(1,col,.8);g.strokeEllipse(x,y+3,39*this.unit,19*this.unit);}else{g.lineStyle(1,0xeaffdf,.25);g.strokeEllipse(x,y+6,34*this.unit,16*this.unit);}if(r.buffs.yield||r.buffs.speed){f.lineStyle(1,r.buffs.yield?0xcfeea6:0xa3dbff,.8);f.strokeCircle(x+17,y-11,4);}
   }
   for(const [id,v]of this.buoys)if(!sim.rod(id)){Object.values(v).forEach(o=>o.destroy());this.buoys.delete(id);}
   for(const b of s.boats){let v=this.boats.get(b.id);if(!v){v={image:this.add.image(0,0,'crew-'+b.type).setDepth(15),label:this.add.text(0,0,'',{fontFamily:'Microsoft YaHei',fontSize:'9px',color:'#fff8e9',stroke:'#3b7880',strokeThickness:2}).setOrigin(.5).setDepth(16),skin:this.add.image(0,0,'__WHITE').setDepth(16.5).setVisible(false),hat:this.add.image(0,0,'__WHITE').setDepth(17).setVisible(false)};this.boats.set(b.id,v);}const x=b.x*this.w,y=b.y*this.h,hover=this.pointer&&Math.hypot(this.pointer.x-x,this.pointer.y-y)<this.boatSize/2;v.image.setPosition(x,y+Math.sin(t*2+b.id)*1).setDisplaySize(this.boatSize,this.boatSize).setFlipX(Math.cos(b.heading)<0).setRotation(0);v.label.setPosition(x,y+this.boatSize*.43).setVisible(s.boats.length<12||hover||b.state==='qte').setText(`${b.name||CREW[b.type].name} ${sim.isRemoteBoat(b)?'远程·∞':`${b.cargo.length}/${sim.capacity(b)}`}${hover?' · 专属礼物':''}`);const costume=THEMES.find(t=>t.id===sim.state.cosmetics.selected.crew);v.skin.setVisible(!!costume);if(costume){const texture=this.textures.get('skin-'+costume.id).getSourceImage(),a=this.decorationAnchor(b,'crown');v.skin.setTexture('skin-'+costume.id).setPosition(a.x,a.y).setOrigin(a.originX,a.originY).setDisplaySize(a.width,a.width*texture.height/texture.width).setFlipX(a.flipX).setDepth(17.1);g.lineStyle(1.5,hex(costume.color),.5);g.strokeEllipse(x,y+this.boatSize*.2,this.boatSize*.85,this.boatSize*.22);}const gift=this.giftAnchor(b);v.hat.setVisible(!!b.hat);if(b.hat)v.hat.setTexture('gift-'+b.hat).setPosition(gift.x,gift.y).setOrigin(gift.originX,gift.originY).setDisplaySize(gift.width,gift.width*GIFT_ART_SIZE.height/GIFT_ART_SIZE.width).setFlipX(gift.flipX);if(['sail','return','patrol'].includes(b.state)){g.lineStyle(1,0xedfff3,.4);g.strokeEllipse(x-Math.cos(b.heading)*24,y-Math.sin(b.heading)*15,18,7);}if(b.job?.kind==='rod'&&b.state==='work'){const target=sim.rod(b.job.id);if(target){f.lineStyle(1,0xffedbd,.7);f.lineBetween(x,y,target.x*this.w,target.y*this.h);}}if(b.buffs.speed||b.buffs.yield){g.lineStyle(1,b.buffs.yield?0xcfeea6:0xa3dbff,.8);g.strokeEllipse(x,y+14,this.boatSize*.85,13);}
   }
   for(const [id,v]of this.boats)if(!sim.boat(id)){Object.values(v).forEach(o=>o.destroy());this.boats.delete(id);}
   for(const c of s.crates.filter(c=>c.zone===s.zone)){let v=this.crates.get(c.id);if(!v){v={box:this.add.rectangle(0,0,20,14,0xf3dfaa).setStrokeStyle(2,hex(RARITIES[c.lot.rank-1].color)).setDepth(7),label:this.add.text(0,0,'',{fontFamily:'Microsoft YaHei',fontSize:'9px',color:'#fff7df',stroke:'#43747b',strokeThickness:2}).setOrigin(.5).setDepth(7)};this.crates.set(c.id,v);}v.box.setPosition(c.x*this.w,c.y*this.h+Math.sin(t+c.id));v.label.setPosition(c.x*this.w,c.y*this.h+18).setText(c.reserved?'运输中':RARITIES[c.lot.rank-1].name+'鱼箱');}
   for(const [id,v]of this.crates)if(!s.crates.some(c=>c.id===id&&c.zone===s.zone)){Object.values(v).forEach(o=>o.destroy());this.crates.delete(id);}
   if(this.pointer&&sim.stat('CURSOR','RADIUS')>0&&!sim.manualQTE()){f.lineStyle(1,0xfcffe6,.35);f.strokeCircle(this.pointer.x,this.pointer.y,25*this.unit+sim.stat('CURSOR','RADIUS')*this.unit);}bridge.afterUpdate(this);
  }
 }
 return new Phaser.Game({type:Phaser.AUTO,parent:'game',backgroundColor:'#77bdc5',antialias:true,resolution:Math.min(devicePixelRatio||1,2),banner:false,scale:{mode:Phaser.Scale.RESIZE,width:'100%',height:'100%'},loader:{timeout:15000,maxParallelDownloads:6},scene:[OceanScene],audio:{noAudio:true},input:{activePointers:2},render:{roundPixels:false,powerPreference:'low-power'}});
}

