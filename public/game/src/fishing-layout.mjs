const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));

// Coordinates stay normalized in saves; pixel distances keep spacing consistent on tall screens.
export function fishingLayout(width=1200,height=800,overlays=null){
 const unit=clamp(width/1000,.8,1.1),px=28*unit/width,py=40*unit/height;
 const ui=overlays??[{left:.02,top:.02,right:.29,bottom:.23},{left:.48,top:.9,right:.99,bottom:1}];
 return {width,height,unit,bounds:{left:px,right:1-px,top:Math.max(120,128*unit)/height,bottom:1-py},blocked:[
  {left:.815,top:0,right:1,bottom:.29}, // Palm island and its shoreline.
  {left:.91,top:.83,right:1,bottom:1},
  {left:0,top:.63,right:.205,bottom:1}, // Harbor, shore and unloading berth.
  ...ui.map(r=>({left:r.left-26*unit/width,right:r.right+26*unit/width,top:r.top-38*unit/height,bottom:r.bottom+30*unit/height}))
 ]};
}

export function canFishAt(layout,p){
 const b=layout.bounds;
 return Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=b.left&&p.x<=b.right&&p.y>=b.top&&p.y<=b.bottom&&!layout.blocked.some(r=>p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom);
}

export const fishingDistance=(layout,a,b)=>Math.hypot((a.x-b.x)*layout.width,(a.y-b.y)*layout.height);
export const canDriftTo=(layout,a,b)=>Array.from({length:9},(_,i)=>({x:a.x+(b.x-a.x)*i/8,y:a.y+(b.y-a.y)*i/8})).every(p=>canFishAt(layout,p));

export function pickFishingPosition(layout,random,neighbors=[],origin=null){
 const b=layout.bounds,shortSide=Math.min(layout.width,layout.height),gap=Math.min(120*layout.unit,shortSide*.2);
 let best=null,bestScore=-Infinity;
 const consider=(p,moving)=>{
  if(!canFishAt(layout,p)||moving&&!canDriftTo(layout,origin,p))return;
  let nearest=gap;for(const other of neighbors)nearest=Math.min(nearest,fishingDistance(layout,p,other));
  const score=nearest+random()*gap*.18;
  if(score>bestScore){best=p;bestScore=score;}
 };
 if(origin){
  // An obvious drift of 18–42% of the sea's shorter edge after each harvest.
  for(let i=0;i<64;i++){const angle=(i+random()*.8)/64*Math.PI*2,length=shortSide*(.18+random()*.24);consider({x:origin.x+Math.cos(angle)*length/layout.width,y:origin.y+Math.sin(angle)*length/layout.height},true);}
  if(best)return best;
 }
 // Stratified candidates fill the whole accessible sea without forming a rigid grid.
 for(let i=0;i<48;i++){const p={x:b.left+(i%8+.15+random()*.7)/8*(b.right-b.left),y:b.top+(Math.floor(i/8)+.15+random()*.7)/6*(b.bottom-b.top)};
  if(origin&&(fishingDistance(layout,p,origin)<shortSide*.16||!canDriftTo(layout,origin,p)))continue;
  consider(p,false);
 }
 return best??(origin&&canFishAt(layout,origin)?{x:origin.x,y:origin.y}:{x:.5,y:.5});
}
