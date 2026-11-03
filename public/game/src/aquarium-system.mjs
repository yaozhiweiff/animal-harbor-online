import {CREW,FISH,FISH_BY_ID} from './content.mjs';
import {ORNAMENTAL_BASE_CHANCE,SEARCH_STAT,THEMES,COSMETIC_KINDS,WEIGHT_RANGES,weightBands,weightMedal,cosmeticKey,aquariumDefaults,cosmeticDefaults} from './aquarium-data.mjs';
const bounded=(n,a,b)=>Math.min(b,Math.max(a,n));
export const aquariumMethods={
 aquariumUnlocked(){return this.isUnlocked('AQUARIUM');},
 ornamentalChance(actor=null){const bonus=actor?.kind==='boat'?this.stat(CREW[actor.type].key,SEARCH_STAT):0;return bounded(ORNAMENTAL_BASE_CHANCE*(1+bonus+(actor?.hat==='luck'?.5:0)),0,1);},
 goldMedalChance(zone){const theme=THEMES.find(t=>t.id===this.state.cosmetics.selected.crew);return theme?.zone===zone ? .03 : .01;},
 tryOrnamental(lot,actor=null,anchor=null){
  if(!this.aquariumUnlocked()||lot.treasure||lot.rank<3||!WEIGHT_RANGES[lot.id]||lot.ornamentalChecked)return null;
  if(!actor&&anchor)actor=this.state.boats.reduce((best,b)=>!best||Math.hypot(b.x-anchor.x,b.y-anchor.y)<Math.hypot(best.x-anchor.x,best.y-anchor.y)?b:best,null);
  lot.ornamentalChecked=true;if(this.random()>=this.ornamentalChance(actor))return null;
  const gold=this.goldMedalChance(FISH_BY_ID[lot.id].zone),roll=this.random(),medal=roll<gold?3:roll<gold+.3?2:1,b=weightBands(lot.id);
  const min=medal===3?b.gold:medal===2?b.purple:b.min,max=medal===3?b.max:medal===2?b.gold-1:b.purple-1;
  const weight=min+Math.min(max-min,Math.floor(this.random()*(max-min+1)));
  return this.recordOrnamental(lot.id,weight);
 },
 recordOrnamental(id,weight){
  const f=FISH_BY_ID[id];if(!this.aquariumUnlocked()||!f||f.rank<3||!Number.isInteger(weight))return null;
  const bounds=weightBands(id);if(weight<bounds.min||weight>bounds.max)return null;
  const a=this.state.aquarium,old=a.best[id],medal=weightMedal(id,weight),previous=old?.medal||0;
  if(!old||weight>old.weight)a.best[id]={weight,medal,at:this.state.time};
  if(medal>previous){const rewards=this.updateCosmeticUnlocks(),notice={key:`medal-${this.id()}`,id,weight,medal,previous,rewards};a.notices.push(notice);this.emit('ornamentalMedal',{id,weight,medal});}
  else this.emit('notice',{text:!old||weight>old.weight?f.name+'观赏鱼刷新重量纪录':f.name+'观赏鱼已收录，水族馆保留最高重量'});
  return {id,weight,medal,record:a.best[id].weight===weight};
 },
 medalProgress(zone){const fish=FISH.filter(f=>f.zone===zone&&f.rank>=3);return {fish,total:fish.length,counts:[0,1,2,3].map(m=>m?fish.filter(f=>(this.state.aquarium.best[f.id]?.medal||0)>=m).length:0)};},
 updateCosmeticUnlocks(){const unlocked=[];for(const theme of THEMES){const p=this.medalProgress(theme.zone);for(const kind of COSMETIC_KINDS){const key=cosmeticKey(kind.id,theme.id);if(p.counts[kind.medal]===p.total&&p.total&&!this.state.cosmetics.unlocked[key]){this.state.cosmetics.unlocked[key]=true;unlocked.push(key);}}}return unlocked;},
 setCosmetic(kind,id=null){if(!COSMETIC_KINDS.some(k=>k.id===kind)||id!==null&&(!THEMES.some(t=>t.id===id)||!this.state.cosmetics.unlocked[cosmeticKey(kind,id)]))return false;this.state.cosmetics.selected[kind]=id;this.emit('cosmetic',{kind,id});return true;},
 placeOrnamental(id,placed=true){if(!this.aquariumUnlocked()||!this.state.aquarium.best[id])return false;this.state.aquarium.tank=this.state.aquarium.tank.filter(f=>f!==id);if(placed)this.state.aquarium.tank.push(id);return true;},
 acknowledgeMedal(key){this.state.aquarium.notices=this.state.aquarium.notices.filter(n=>n.key!==key);}
};
export function restoreAquarium(sim,raw){
 const a=sim.state.aquarium=aquariumDefaults(),c=sim.state.cosmetics=cosmeticDefaults(),src=raw.aquarium;
 for(const f of FISH.filter(f=>f.rank>=3)){const old=src?.best?.[f.id],b=weightBands(f.id);if(old&&Number.isFinite(old.weight)){const weight=bounded(Math.round(old.weight),b.min,b.max);a.best[f.id]={weight,medal:weightMedal(f.id,weight),at:Number.isFinite(old.at)?bounded(old.at,0,sim.state.time):sim.state.time};}}
 a.tank=[...new Set((Array.isArray(src?.tank)?src.tank:[]).filter(id=>a.best[id]))];
 a.notices=(Array.isArray(src?.notices)?src.notices:[]).slice(-48).filter(n=>n&&a.best[n.id]&&Number.isInteger(n.weight)&&n.weight>=weightBands(n.id).min&&n.weight<=a.best[n.id].weight&&typeof n.key==='string'&&n.key.length<64).map(n=>({...n,medal:weightMedal(n.id,n.weight),previous:bounded(Number(n.previous)||0,0,3),rewards:Array.isArray(n.rewards)?n.rewards.filter(k=>typeof k==='string'&&k.length<30):[]}));
 a.notices=[...new Map(a.notices.map(n=>[n.key,n])).values()];sim.updateCosmeticUnlocks();
 for(const kind of COSMETIC_KINDS){const selected=raw.cosmetics?.selected?.[kind.id];if(THEMES.some(t=>t.id===selected)&&c.unlocked[cosmeticKey(kind.id,selected)])c.selected[kind.id]=selected;}
}
