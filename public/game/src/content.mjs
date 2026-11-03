import {WEIGHT_RANGES,SEARCH_STAT} from './aquarium-data.mjs';
export const SAVE_KEY='animal-harbor-fishing-v2';
export const LEGACY_SAVE_KEY='cat-harbor-fishing-v1';
export const ANIMAL_SCENE_SCALE=.6;
export const PRODUCTION_WINDOW=30;
export const PORT={x:.155,y:.755};
export const RARITIES=[
 {id:1,name:'普通',color:'#d7e3df',weight:7000,bg:'#edf0e5'},
 {id:2,name:'优良',color:'#84d5a0',weight:2400,bg:'#e5efdc'},
 {id:3,name:'稀有',color:'#79bfff',weight:300,bg:'#e0edf6'},
 {id:4,name:'史诗',color:'#bf93fa',weight:200,bg:'#eee3f5'},
 {id:5,name:'传说',color:'#f6cf69',weight:100,bg:'#f7edce'},
];
export const FLOATS=[
 {key:'SPOON',name:'普通浮漂',desc:'木质钓组，便宜又可靠',color:'#e5b17b',icon:'rod',maxRank:2,initialYield:1,yieldPerLevel:1},
 {key:'SHOVEL',name:'重载浮漂',desc:'粗线大鱼箱，更高产出成长',color:'#a7bc8b',icon:'basket',maxRank:3,initialYield:2,yieldPerLevel:1},
 {key:'PICKAXE',name:'深潜浮漂',desc:'深水钓线，高产出与暴击成长',color:'#779bb4',icon:'compass',maxRank:4,initialYield:3,yieldPerLevel:2},
 {key:'TRIDENT',name:'声呐联动浮漂',desc:'概率随机触发一至两个可用钓组',color:'#d9b86e',icon:'compass',maxRank:3,initialYield:3,yieldPerLevel:2},
 {key:'SLEDGEHAMMER',name:'涌浪浮漂',desc:'收线后发出波纹，带动邻近钓组',color:'#9fa8c8',icon:'reel',maxRank:3,initialYield:4,yieldPerLevel:3},
 {key:'DRUID_STAFF',name:'丰收饵浮漂',desc:'为附近浮漂提供临时收益增益',color:'#9abd99',icon:'bait',maxRank:4,initialYield:5,yieldPerLevel:3},
 {key:'JACKHAMMER',name:'动力绞盘浮漂',desc:'动力收线，高阶产出与暴击成长',color:'#b69f95',icon:'reel',maxRank:5,initialYield:6,yieldPerLevel:4},
];
export const CREW=[
 {key:'MUSHROOM_GUY',name:'橘猫',ship:'木桨收鱼舟',role:'target',tier:1,cap:2,speed:.115,image:'assets/boats/a2-aquarium/t1-cat-boat.webp',color:'#e5ab6f',desc:'选一个浮漂，驶近操作收鱼'},
 {key:'FROG_GUY',name:'柯基',ship:'涌浪联动艇',role:'wave',tier:2,cap:2,speed:.13,image:'assets/boats/a2-aquarium/t2-corgi-boat.webp',color:'#85b8b6',desc:'巡航释放波纹，各稀有度联动渔获直接入库'},
 {key:'MOLE_GUY',name:'河狸',ship:'独立垂钓船',role:'independent',tier:3,cap:2,speed:.09,image:'assets/boats/a2-aquarium/t3-beaver-boat.webp',color:'#aeb385',desc:'船载钓组独立连续捕鱼'},
 {key:'GOLEM_GUY',name:'棕熊',ship:'重型连钓船',role:'heavy',tier:4,cap:3,speed:.075,image:'assets/boats/a2-aquarium/t4-bear-boat.webp',color:'#83aed0',desc:'重型连续作业，自动稀有 QTE'},
 {key:'DRUID_GUY',name:'水獭',ship:'潮汐补给船',role:'support',tier:5,cap:4,speed:.14,image:'assets/boats/a2-aquarium/t5-otter-boat.webp',color:'#b69dcf',desc:'范围加速支援，自动稀有与史诗 QTE'},
 {key:'GHOST_GUY',name:'赤狐',ship:'星航巡钓船',role:'contact',tier:6,cap:5,speed:.16,remoteStorage:true,recruitPriceMultiplier:10,image:'assets/boats/a2-aquarium/t6-fox-boat.webp',color:'#dbbd73',desc:'自动全部高稀有 QTE，无限载重，渔获远程入库'},
];
const fishRows=[
 ['sardine','银沙丁',0,1,7,'#8ecbc5'],['clown','小丑鱼',0,1,9,'#eea05e'],['mackerel_bay','蓝纹竹荚鱼',0,1,8,'#8ab4bd'],['sea_bream','海湾小鲷',0,1,10,'#d3b4aa'],
 ['goldline','金线鲷',0,2,15,'#dbba69'],['emerald','翡翠雀鲷',0,2,18,'#82bb95'],['puffer','圆滚河豚',0,3,30,'#bdc47f'],['pearl','珍珠蝴蝶鱼',0,3,34,'#dad3ad'],['moon','月光神仙鱼',0,4,60,'#b6a4db'],['dawn','晨曦锦鳞',0,5,120,'#edc579'],
 ['tang','蓝宝石吊',1,1,10,'#579ecb'],['coral_damsel','珊瑚雀鲷',1,1,12,'#b7a2cb'],['wrasse','橙尾隆头鱼',1,1,13,'#d29b7d'],['anemone_bass','海葵小鲈',1,1,14,'#d4afa7'],
 ['butterfly','珊瑚蝶鱼',1,2,20,'#e6bd66'],['parrot','玫瑰鹦嘴鱼',1,2,24,'#c786a0'],['ray','斑点鳐',1,3,40,'#85a8ac'],['lionfish','水晶狮子鱼',1,3,45,'#9cb9c5'],['seadragon','虹彩海龙',1,4,80,'#a5a1d7'],['gold','黄金锦鳞',1,5,160,'#e7b453'],
 ['tuna','蓝鳍金枪鱼',2,1,15,'#718dac'],['mackerel','银带鲭鱼',2,1,17,'#9abfc2'],['cod','深海鳕',2,1,20,'#9cab9c'],['herring','夜航鲱鱼',2,1,22,'#9299b7'],
 ['angler','星灯鮟鱇',2,2,45,'#c18bc4'],['mahi','蓝背鬼头刀',2,2,47,'#7fb4b2'],['flying','银翼飞鱼',2,3,80,'#b1c9d5'],['grouper','蓝月石斑',2,3,85,'#92a7c1'],['sword','远洋旗鱼',2,4,150,'#89b5c6'],['oarfish','绯红龙宫使',2,5,300,'#e59b96'],
];
export const FISH=fishRows.map(([id,name,zone,rank,value,color])=>({id,name,zone,rank,value,color,rarity:RARITIES[rank-1].name,image:`assets/fish/a2/${id}.webp`,weightRange:WEIGHT_RANGES[id]||null}));
export const FISH_BY_ID=Object.fromEntries(FISH.map(f=>[f.id,f]));
export const ZONES=[
 {name:'晴湾浅海',en:'SUNLIT BAY',price:0,catches:0,desc:'平静浅海，十种鱼与第一段航程。'},
 {name:'珊瑚花园',en:'CORAL GARDEN',price:1800,catches:30,desc:'珊瑚间的鱼群与黄金锦鳞。'},
 {name:'蓝月远海',en:'BLUE MOON SEA',price:18000,catches:100,desc:'更高价值的远洋鱼与绯红龙宫使。'},
];
export const SPELLS=[
 {key:'SPELL_ZAPS',name:'声呐共振',desc:'全体钓组连锁概率 +50 个百分点',icon:'compass',color:'#e6c56d'},
 {key:'SPELL_RAIN',name:'顺风潮',desc:'世界作业与航行加速；手动 QTE 保持现实时间',icon:'boat',color:'#83c6cd'},
 {key:'SPELL_GOLDRUSH',name:'丰收鱼汛',desc:'作业产出变为五倍',icon:'fish',color:'#dfba66'},
];
export const HATS=[
 {id:'idle',node:'HAT_IDLE_REDUCE',name:'勤勉船员帽',fish:'dawn',price:500,desc:'佩戴者作业休息归零'},
 {id:'luck',node:'HAT_LUCK',name:'寻宝船员帽',fish:'gold',price:4000,desc:'佩戴者搜寻观赏鱼概率加成 +50%（与技能相加）'},
 {id:'yield',node:'HAT_DIRT_MULTIPLY',name:'丰收船长帽',fish:'oarfish',price:20000,desc:'佩戴者相关作业产出 ×5'},
];
export const REWARDS={
 puffer:{kind:'crit',value:.10,text:'全局双倍产出概率 +10 个百分点'},ray:{kind:'crit',value:.10,text:'全局双倍产出概率 +10 个百分点'},grouper:{kind:'crit',value:.10,text:'全局双倍产出概率 +10 个百分点'},
 pearl:{kind:'yield',value:.05,text:'全局作业产出倍率 +0.05'},lionfish:{kind:'yield',value:.05,text:'全局作业产出倍率 +0.05'},flying:{kind:'yield',value:.05,text:'全局作业产出倍率 +0.05'},
 moon:{kind:'speed',value:.05,text:'全局动作速度倍率 +0.05'},seadragon:{kind:'rarity',value:.05,text:'额外收藏稀有度运气 +0.05'},sword:{kind:'sale',value:.10,text:'额外收藏物出售倍率 +0.10'},
 dawn:{kind:'hat',value:'idle',text:'解锁勤勉船员帽购买资格'},gold:{kind:'hat',value:'luck',text:'解锁寻宝船员帽购买资格'},oarfish:{kind:'hat',value:'yield',text:'解锁丰收船长帽购买资格'},
};
export const QTE_RULES={3:{total:12,hold:3,width:34},4:{total:16,hold:4.5,width:26},5:{total:20,hold:6,width:20}};
export const TREASURES=[{id:'bottle',name:'漂流瓶',rank:2,value:40},{id:'coin',name:'海底古币',rank:3,value:150},{id:'pearl_treasure',name:'海蓝珍珠',rank:4,value:700},{id:'star',name:'星纹罗盘',rank:5,value:2400}];
export const QUESTS=[
 {text:'亲手收获 3 次鱼获',field:'manualCaught',target:3,reward:20},
 {text:'增设第 2 个浮漂',field:'rods',target:2,reward:25},
 {text:'邀请第一位动物伙伴',field:'boats',target:1,reward:45},
 {text:'等待船只返港出售鱼获',field:'autoSales',target:1,reward:70},
 {text:'发现 5 种鱼类',field:'species',target:5,reward:120},
 {text:'解锁重载浮漂，开放蓝色稀有鱼',field:'floatRarity',target:3,reward:1200},
 {text:'交付一条蓝色稀有鱼',field:'rarityDelivered',rank:3,target:1,reward:2000},
 {text:'前往珊瑚花园',field:'maxZone',target:1,reward:2500},
 {text:'解锁动力绞盘浮漂，开放传说鱼',field:'floatRarity',target:5,reward:6000},
 {text:'前往蓝月远海',field:'maxZone',target:2,reward:10000},
];
export const REMOVED_RESEARCH_STATS=['LUCK_ITEM_DROP','LUCK_ITEM_RARITY','SELL_ITEMS_DIRT'];
export const NODE_DATA={},RESEARCH=[],REMOVED_RESEARCH=[],COLLECTION_BASE={};
export function configureResearch(data){
 Object.assign(NODE_DATA,structuredClone(data.nodes));
 // Each float defines its initial yield and the increment shared by all its yield research branches.
 for(const f of FLOATS){const rows=NODE_DATA[f.key].DIRT_GAIN;rows[0].VALUE_INIT=f.initialYield;for(const row of rows){row.VALUE_INC=f.yieldPerLevel;row.VALUE_FINAL=(row.VALUE_INIT||0)+f.yieldPerLevel*(row.LEVELS||0);}}
 REMOVED_RESEARCH.splice(0,REMOVED_RESEARCH.length,...data.research.filter(n=>REMOVED_RESEARCH_STATS.includes(n.stat)).map(n=>({...n,id:n.key})));
 // Fixed equipment and collection effects stay available, without research upgrades.
 for(const [owner,node]of Object.entries(NODE_DATA)){COLLECTION_BASE[owner]={chance:(node.LUCK_ITEM_DROP||[]).reduce((n,r)=>n+(r.VALUE_INIT||0),0),rarity:(node.LUCK_ITEM_RARITY||[]).reduce((n,r)=>n+(r.VALUE_INIT||0),0),sale:(node.SELL_ITEMS_DIRT||[]).reduce((n,r)=>n+(r.VALUE_INIT||0),0)};for(const stat of REMOVED_RESEARCH_STATS)delete node[stat];}
 const cargo=CREW.map((c,i)=>{const raw={STAT_ID:0,LEVELS:10,VALUE_INIT:0,VALUE_INC:1,DIRT_BASE:[500,2500,10000,50000,75000,100000][i],DIRT_GROWTH:1.55};NODE_DATA[c.key].CARGO_CAPACITY=[raw];return {id:c.key+'.CARGO_CAPACITY.0',key:c.key+'.CARGO_CAPACITY.0',node:c.key,stat:'CARGO_CAPACITY',effect:'同类动物船载重上限',dependency:null,raw,extension:true};});
 const retiredCargo=cargo.filter(n=>CREW.find(c=>c.key===n.node).remoteStorage);REMOVED_RESEARCH.push(...retiredCargo);for(const n of retiredCargo)delete NODE_DATA[n.node].CARGO_CAPACITY;
 const search=CREW.map(c=>{const raw={STAT_ID:0,LEVELS:10,VALUE_INIT:0,VALUE_INC:.1,DIRT_BASE:10000000,DIRT_GROWTH:1};NODE_DATA[c.key][SEARCH_STAT]=[raw];return {id:c.key+'.'+SEARCH_STAT+'.0',key:c.key+'.'+SEARCH_STAT+'.0',node:c.key,stat:SEARCH_STAT,effect:'同类伙伴搜索观赏鱼概率加成',dependency:null,raw,extension:true};});
 const aqRaw={STAT_ID:0,LEVELS:1,VALUE_INIT:0,VALUE_INC:1,DIRT_BASE:0,DIRT_GROWTH:1};NODE_DATA.AQUARIUM={SHOP_UNLOCK:[aqRaw]};const aquarium={id:'AQUARIUM.SHOP_UNLOCK.0',key:'AQUARIUM.SHOP_UNLOCK.0',node:'AQUARIUM',stat:'SHOP_UNLOCK',effect:'开放港口水族馆与观赏鱼',dependency:null,raw:aqRaw,extension:true,flatCost:0};
 RESEARCH.splice(0,RESEARCH.length,...data.research.filter(n=>!REMOVED_RESEARCH_STATS.includes(n.stat)).map(n=>({...n,id:n.key,raw:n.stat==='DIRT_GAIN'&&FLOATS.some(f=>f.key===n.node)?NODE_DATA[n.node].DIRT_GAIN[n.raw.STAT_ID]:n.raw})),...cargo.filter(n=>!retiredCargo.includes(n)),...search,aquarium);
}
export const OWNER_NAMES=Object.fromEntries([...FLOATS.map(x=>[x.key,x.name]),...CREW.map(x=>[x.key,x.name+'·'+x.ship]),...SPELLS.map(x=>[x.key,x.name]),['CURSOR','船长调度'],['PASSIVE','渔港通用研究'],['INVENTORY','收藏鱼舱'],['DESCENT','深海航线许可'],['AQUARIUM','港口水族馆'],['BUFF_DIRT_MULTIPLY','丰收饵增益'],['BUFF_SPEED','顺流增效']]);
export const STAT_NAMES={DIRT_GAIN:'单次产出',ANIMATION_SCALE:'动作与航速',DIRT_GAIN_CRIT_CHANCE:'双倍鱼获',IDLE_TIME:'作业休息',STOMP_RAD:'作用范围',SHOP_UNLOCK:'类别解锁',RADIUS:'手动调度范围',SELL_ITEMS_DIRT:'收藏出售倍率',ZAP_CHANCE:'声呐连锁',ZAP_CRIT_CHANCE:'双目标连锁',SPELL_STACKS:'技能储层',SPELL_DIGS:'充能效率',SPELL_DURATION:'每层持续时间',DIG_COUNT:'每轮连钓次数',BUFF_TIME:'增益时长',BUFF_VALUE:'增益强度',COUNT_ADD:'商店数量扩充',DIRT_MULTIPLY:'产出倍率'};
STAT_NAMES.CARGO_CAPACITY='船舱载重上限';STAT_NAMES[SEARCH_STAT]='搜寻观赏鱼';
export const RESEARCH_GROUPS=[{id:'floats',name:'浮漂钓组',owners:FLOATS.map(x=>x.key)},{id:'crew',name:'动物船队',owners:CREW.map(x=>x.key)},{id:'spells',name:'海洋技能',owners:SPELLS.map(x=>x.key)},{id:'buffs',name:'增益与调度',owners:['BUFF_DIRT_MULTIPLY','BUFF_SPEED','CURSOR']},{id:'port',name:'港口与收藏',owners:['PASSIVE','INVENTORY','DESCENT','AQUARIUM']}];

// Only category unlocks depend on other categories. Individual upgrades are independent.
export const RESEARCH_CATEGORY_REQUIREMENTS={
 SPOON:[],MUSHROOM_GUY:['SPOON'],INVENTORY:['MUSHROOM_GUY'],
 SHOVEL:['SPOON'],FROG_GUY:['MUSHROOM_GUY'],TRIDENT:['SHOVEL'],
 PICKAXE:['SHOVEL'],SLEDGEHAMMER:['SHOVEL'],MOLE_GUY:['TRIDENT','FROG_GUY'],
 GOLEM_GUY:['MOLE_GUY'],DRUID_STAFF:['PICKAXE'],DRUID_GUY:['GOLEM_GUY'],
 GHOST_GUY:['SPELL_ZAPS','DRUID_GUY'],JACKHAMMER:['DRUID_STAFF'],
 SPELL_ZAPS:['TRIDENT'],SPELL_RAIN:['DRUID_GUY'],SPELL_GOLDRUSH:['DRUID_STAFF'],
 CURSOR:['INVENTORY'],PASSIVE:['CURSOR'],DESCENT:['PASSIVE'],AQUARIUM:['PICKAXE'],
 BUFF_DIRT_MULTIPLY:['DRUID_STAFF'],BUFF_SPEED:['DRUID_GUY'],
};

