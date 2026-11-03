export const ORNAMENTAL_BASE_CHANCE=.01;
export const SEARCH_STAT='ORNAMENTAL_SEARCH';
export const MEDALS=[{id:1,name:'蓝色',color:'#78beff'},{id:2,name:'紫色',color:'#c493ff'},{id:3,name:'金色',color:'#f4cf69'}];
// Integer grams keep weight records and medal thresholds exact.
export const WEIGHT_RANGES={puffer:[200,2800],pearl:[50,800],moon:[150,2200],dawn:[800,8000],ray:[1200,35000],lionfish:[200,2000],seadragon:[100,1200],gold:[1000,12000],flying:[100,1500],grouper:[2000,60000],sword:[10000,180000],oarfish:[12000,220000]};
export const THEMES=[
 {id:'sun',zone:0,name:'晴湾鎏金花园',crewName:'晴湾向阳花冠',tankName:'鎏金花园水族箱',portName:'晴湾太阳花港',color:'#f1ca6e'},
 {id:'coral',zone:1,name:'珊瑚珍珠宫',crewName:'珊瑚珍珠冠',tankName:'珊瑚珍珠宫水族箱',portName:'珊瑚珠光港',color:'#efa8bd'},
 {id:'moon',zone:2,name:'蓝月星穹殿',crewName:'蓝月星航冠',tankName:'蓝月星穹水族箱',portName:'蓝月星耀港',color:'#a8a5fa'}
].map(t=>({...t,crewImage:`assets/aquarium/skin-${t.id}.webp`,tankImage:`assets/aquarium/tank-${t.id}.webp`,portImage:`assets/aquarium/port-${t.id}.webp`}));
export const COSMETIC_KINDS=[{id:'crew',name:'伙伴外观',medal:1},{id:'tank',name:'水族馆布景',medal:2},{id:'port',name:'港口外观',medal:3}];
export const cosmeticKey=(kind,theme)=>`${kind}:${theme}`;
export function weightBands(id){const [min,max]=WEIGHT_RANGES[id]||[100,1000],span=max-min;return {min,max,purple:Math.ceil(min+span*.7),gold:Math.ceil(min+span*.95)};}
export function weightMedal(id,grams){const b=weightBands(id);return grams>=b.gold?3:grams>=b.purple?2:1;}
export function formatWeight(grams){return grams>=1000?(grams/1000).toFixed(3)+' kg':grams+' g';}
export const aquariumDefaults=()=>({best:{},tank:[],notices:[]});
export const cosmeticDefaults=()=>({unlocked:{},selected:{crew:null,tank:null,port:null}});
