export const ICON_PATHS={
 rate:'<path d="M4 20h16M5 16l4-5 4 3 6-9M15 5h4v4"/>',
 coin:'<circle cx="12" cy="12" r="9"/><path d="M14.5 8h-4a2 2 0 0 0 0 4h3a2 2 0 0 1 0 4H9m3-10v12"/>',
 fish:'<path d="M4 12c4-9 12-8 15 0-3 8-11 9-15 0Zm0 0-3-4v8l3-4Z"/><circle cx="14.5" cy="10.5" r=".8"/><path d="m10 7 3-3 2 3m-5 10 3 3 2-3"/>',
 pause:'<path d="M8 5v14M16 5v14"/>', play:'<path d="m8 5 11 7-11 7Z"/>',
 rod:'<path d="m4 21 12-17M7 17l3 2M15 5c5-1 6 2 6 5v6a3 3 0 0 1-6 0v-2"/><circle cx="9" cy="15" r="2"/>',
 boat:'<path d="M2 14h20l-4 6H6l-4-6Zm5 0V9h9v5M11 9V3l7 4h-7M2 22q3-2 5 0 3-2 5 0 3-2 5 0 3-2 5 0"/>',
 book:'<path d="M12 5c-4-3-7-2-10-1v15c3-1 6-2 10 1 4-3 7-2 10-1V4c-3-1-6-2-10 1Zm0 0v15M5 8l4 1m-4 3 4 1m6-4 4-1m-4 5 4-1"/>',
 bait:'<path d="M12 3v10a5 5 0 1 1-8-4l3 3M14 4c4 0 5 3 3 5s-1 3 2 3M17 16l2 2m-5 2 1 2"/>',
 reel:'<circle cx="11" cy="13" r="7"/><circle cx="11" cy="13" r="3"/><path d="m15 8 5-5m-8 0 6 6m0 6h4v4m-12 1-2 2"/>',
 basket:'<path d="M3 10h18l-2 11H5L3 10ZM7 10l5-8 5 8m-9 4v4m4-4v4m4-4v4"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6 6-2Z"/>',
};
export const icon=(key)=>`<svg class="outline-icon" viewBox="0 0 24 24" aria-hidden="true">${ICON_PATHS[key]||ICON_PATHS.fish}</svg>`;
export function catIcon(coat='#e5ab6f') {return `<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M11 27V9l16 12h6L49 9v18a22 22 0 1 1-38 0" fill="${coat}"/><path d="m16 18 8 6-8 3m28-9-8 6 8 3" fill="#d48f7d" opacity=".6"/><circle cx="23" cy="35" r="2.2" fill="#3d5553"/><circle cx="38" cy="35" r="2.2" fill="#3d5553"/><path d="m28 41 3 2 3-2m-3 2q-3 5-6 1m6-1q3 5 6 1" fill="none" stroke="#6c6657" stroke-width="1.6" stroke-linecap="round"/><path d="m15 40-9-1m9 4-8 2m39-5 8-1m-8 4 8 2" stroke="#887d66" stroke-width="1.3" opacity=".6"/></svg>`;}
export function fishIcon(color='#8ecbc5',unknown=false){return `<svg viewBox="0 0 80 50" aria-hidden="true"><path d="m18 25-14-12v24l14-12" fill="${color}"/><path d="M15 25C25 3 59 4 72 25 59 46 25 47 15 25" fill="${color}"/><path d="m31 12 12-9 9 9m-22 25 12 8 8-9" fill="${color}"/><path d="M49 14q-8 11 0 23" fill="none" stroke="#ffffff" stroke-opacity=".4" stroke-width="3"/><circle cx="59" cy="22" r="3" fill="${unknown?'#d5ded1':'#2b5457'}"/><circle cx="60" cy="21" r=".9" fill="#fff9ea"/></svg>`;}

function ellipse(ctx,x,y,rx,ry,color,rotation=0){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,rotation,0,Math.PI*2);ctx.fill();}
function line(ctx,points,color,width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineJoin='round';ctx.lineCap='round';ctx.beginPath();ctx.moveTo(...points[0]);for(const p of points.slice(1))ctx.lineTo(...p);ctx.stroke();}
function path(ctx,points,color){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(...points[0]);for(const p of points.slice(1))ctx.lineTo(...p);ctx.closePath();ctx.fill();}
function palm(ctx,x,y,s,lean=0){ctx.save();ctx.translate(x,y);ctx.scale(s,s);line(ctx,[[0,14],[lean-4,-12],[lean,-55]],'#ae9270',9);line(ctx,[[2,13],[lean,-13],[lean+2,-54]],'#d2b28a',4);
 for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.save();ctx.translate(lean,-55);ctx.rotate(a);path(ctx,[[0,0],[17,-17],[42,-8],[51,7],[22,-4]],i%2?'#52896d':'#6ba27c');line(ctx,[[0,0],[30,-4],[48,6]],'#4c826c',1.4);ctx.restore();}ellipse(ctx,lean,-52,5,5,'#b29b68');ctx.restore();}
function island(ctx,x,y,s,variant=0){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ellipse(ctx,0,20,145,90,'#b8e0ca33');ellipse(ctx,0,13,124,77,'#cfebcb55');ellipse(ctx,0,6,108,66,'#e7dfb4');ellipse(ctx,-2,-2,101,60,'#f3e7bf');ellipse(ctx,-9,-8,77,41,'#b0c98b');ellipse(ctx,-18,-12,62,31,'#9ebd80');
 ellipse(ctx,67,18,15,9,'#b6be9d');ellipse(ctx,60,14,15,10,'#cbd0ac');ellipse(ctx,-73,20,10,6,'#d1c7a4');
 palm(ctx,-14,-5,.87,-12);palm(ctx,39,7,.63,13);if(variant)palm(ctx,-45,16,.62,-11);ctx.restore();}
function coral(ctx,x,y,s,color){ctx.save();ctx.translate(x,y);ctx.scale(s,s);line(ctx,[[0,14],[0,-15],[-12,-27]],color,6);line(ctx,[[0,-1],[13,-14],[12,-28]],color,5);line(ctx,[[-3,-7],[-18,-7],[-23,-17]],color,5);ctx.restore();}
export function drawOcean(canvas,zone){const w=canvas.width,h=canvas.height,ctx=canvas.getContext('2d');ctx.clearRect(0,0,w,h);ctx.save();ctx.scale(w/1200,h/800);
 const gradient=ctx.createLinearGradient(0,0,950,800);gradient.addColorStop(0,zone===0?'#a3d8cf':zone===1?'#8bd6c0':'#88b9ca');gradient.addColorStop(.45,zone===0?'#6ec1c6':zone===1?'#61bfc1':'#5999b5');gradient.addColorStop(1,zone===0?'#398fa7':zone===1?'#2e8c9d':'#346781');ctx.fillStyle=gradient;ctx.fillRect(0,0,1200,800);
 const shallow=ctx.createRadialGradient(140,600,10,140,600,390);shallow.addColorStop(0,'#cfedd26b');shallow.addColorStop(1,'#b4e6d000');ctx.fillStyle=shallow;ctx.fillRect(0,0,1200,800);
 // Long underwater sandbars and quiet caustics keep the sea readable.
 ctx.lineCap='round';for(let i=0;i<15;i++){ctx.beginPath();ctx.moveTo(-100,510+i*26);ctx.bezierCurveTo(130,440+i*24,110,600+i*24,350,650+i*22);ctx.strokeStyle=`rgba(220,245,212,${.045+i%3*.012})`;ctx.lineWidth=13;ctx.stroke();}
 for(let i=0;i<95;i++){const x=(i*173+91)%1190,y=(i*113+31)%800;line(ctx,[[x,y],[x+7,y-2],[x+16,y]],'#d9f7de24',1.2);}
 for(let i=0;i<45;i++){const x=(i*139+320)%1190,y=(i*181+40)%800;ellipse(ctx,x,y,2,1,'#e5ffe733');}
 island(ctx,1110,133,.92,1);island(ctx,1205,746,.78,0);
 // Home cove, boardwalk and the fish market sit together at the shore.
 ctx.save();ctx.translate(0,605);path(ctx,[[0,-99],[48,-91],[83,-63],[80,-28],[110,-2],[102,40],[120,78],[92,120],[0,147]],'#c9e7c27c');path(ctx,[[0,-85],[36,-81],[69,-56],[63,-23],[90,4],[82,41],[99,77],[72,114],[0,130]],'#f0e3b9');path(ctx,[[0,-71],[31,-64],[51,-39],[46,-14],[66,7],[56,40],[73,78],[47,98],[0,110]],'#a6c389');
 for(let i=0;i<9;i++){const py=-56+i*19;ellipse(ctx,20+(i%3)*7,py,3,2,'#7f9f6e');}ctx.restore();
 // Pier is positioned at the simulation's unloading point.
 const px=186,py=604;ctx.fillStyle='#2f6c6f44';ctx.fillRect(24,py+13,px-20,38);ctx.fillStyle='#947a59';ctx.fillRect(20,py-5,px-12,30);ctx.fillStyle='#c8a47b';ctx.fillRect(20,py-9,px-12,26);
 for(let x=24;x<px;x+=13){line(ctx,[[x,py-7],[x,py+16]],'#a98661',1.5);}for(const x of [50,110,178]){ellipse(ctx,x,py-8,4,4,'#e2c399');ctx.fillStyle='#8b7258';ctx.fillRect(x-3,py-8,6,10);ellipse(ctx,x,py-9,4,3,'#e4c497');}
 path(ctx,[[38,py-64],[89,py-64],[89,py-13],[38,py-13]],'#f6e7c5');path(ctx,[[31,py-67],[63,py-88],[98,py-67],[95,py-60],[34,py-60]],'#b97758');path(ctx,[[41,py-64],[63,py-79],[87,py-64]],'#d69166');ctx.fillStyle='#598b80';ctx.fillRect(49,py-46,27,19);line(ctx,[[49,py-35],[76,py-35]],'#d8e7c6',2);ctx.fillStyle='#caaf80';ctx.fillRect(90,py-27,15,13);ctx.fillRect(110,py-24,15,13);line(ctx,[[92,py-24],[103,py-24]],'#a38e6c',2);
 palm(ctx,24,py-78,.58,-7);
 if(zone===1){for(const p of [[920,585,.6],[1010,340,.5],[1000,710,.8],[300,730,.5]]){ellipse(ctx,p[0],p[1]+13,33*p[2],14*p[2],'#c6dab632');coral(ctx,...p,'#d9a7a055');}}
 if(zone===2){for(const p of [[1010,590],[1040,660],[930,685]]){ellipse(ctx,p[0],p[1],32,15,'#315c7444');line(ctx,[[p[0],p[1]],[p[0]-9,p[1]-40],[p[0]+4,p[1]-55]],'#85bec35c',4);}}
 ctx.restore();}
export function drawBoat(canvas,cat){const ctx=canvas.getContext('2d');ctx.clearRect(0,0,160,120);ctx.translate(80,60);
 ellipse(ctx,0,14,57,20,'#174f6340');path(ctx,[[-50,-20],[22,-25],[56,-2],[27,25],[-50,22],[-57,2]],'#385f63');
 path(ctx,[[-48,-22],[20,-26],[56,-5],[26,21],[-48,18],[-53,-2]],cat.boat);path(ctx,[[-42,-15],[17,-19],[43,-4],[21,14],[-42,11]],'#f9e8bd');
 path(ctx,[[28,-11],[46,-5],[29,7]],'#d2b991');line(ctx,[[-35,-13],[-35,10]],'#c1ac88',2);line(ctx,[[17,-18],[17,13]],'#d3bf97',2);
 // A seated cat captain, with life jacket, ears and a tiny steering wheel.
 ellipse(ctx,-5,1,14,15,'#598d9a');ellipse(ctx,-5,-10,16,14,cat.coat);path(ctx,[[-20,-15],[-19,-31],[-6,-20]],cat.coat);path(ctx,[[3,-21],[12,-31],[11,-13]],cat.coat);
 path(ctx,[[-17,-18],[-17,-25],[-10,-20]],'#d59180');path(ctx,[[6,-20],[10,-25],[9,-17]],'#d59180');
 ellipse(ctx,-11,-11,1.5,2,'#3c5353');ellipse(ctx,1,-11,1.5,2,'#3c5353');path(ctx,[[-7,-6],[-3,-6],[-5,-3]],'#9e7465');line(ctx,[[-5,-3],[-5,-1],[-8,0]],'#6e6d5a',1);
 line(ctx,[[-13,-22],[-11,-17]],'#bf8a5e',2);line(ctx,[[-5,-24],[-5,-18]],'#bf8a5e',2);ellipse(ctx,13,1,6,6,'#d6b680');ellipse(ctx,13,1,3,3,'#f4dfb3');
 ctx.fillStyle='#b3916e';ctx.fillRect(-43,-7,17,14);line(ctx,[[-41,-4],[-28,-4]],'#d7bc8b',2);line(ctx,[[-30,15],[-41,39]],'#826e56',3);ellipse(ctx,-43,42,5,11,'#c5a47d',.5);
 line(ctx,[[14,-16],[26,-42],[36,-47]],'#5f6c5f',2);line(ctx,[[36,-47],[42,-14]],'#f7f0d384',1);ctx.setTransform(1,0,0,1,0,0);}
export function drawBuoy(canvas){const ctx=canvas.getContext('2d');ctx.clearRect(0,0,90,110);ctx.translate(45,68);
 ellipse(ctx,0,11,27,12,'#1f6e7b29');ellipse(ctx,0,5,22,10,'#d8dfbc');ellipse(ctx,0,1,22,10,'#f6e6ad');ellipse(ctx,0,0,15,6,'#adbb98');ellipse(ctx,0,-6,10,10,'#e6a36c');ctx.fillStyle='#fff0d0';ctx.fillRect(-9,-10,18,5);ellipse(ctx,0,-13,7,6,'#edb17a');line(ctx,[[0,-17],[0,-47]],'#56757a',2.3);path(ctx,[[1,-47],[18,-41],[1,-34]],'#e6bd6c');line(ctx,[[-14,0],[-21,-20],[-17,-34]],'#426b6c',2);line(ctx,[[-17,-34],[-5,-42],[15,-27],[19,9]],'#fff9dcaa',1);ctx.setTransform(1,0,0,1,0,0);}
export function drawFishTexture(canvas){const ctx=canvas.getContext('2d');ctx.clearRect(0,0,80,40);ellipse(ctx,43,20,25,11,'#246c7b');path(ctx,[[22,20],[3,9],[3,31]],'#246c7b');path(ctx,[[34,11],[44,3],[53,12]],'#246c7b');}
