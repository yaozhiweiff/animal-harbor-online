import {FLOATS} from './content.mjs';

export const FLOAT_ART_SIZE={width:70,height:85};

// One drawing supplies both the water sprite and the tackle-shop thumbnail.
export function drawFloat(canvas,type){
 const f=FLOATS[type],ctx=canvas.getContext('2d',{willReadFrequently:true}),i=type;
 ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.scale(canvas.width/70,canvas.height/85);ctx.translate(35,41);
 ctx.strokeStyle='#3c6e70';ctx.lineWidth=2;ctx.fillStyle='#fff5d9';ctx.beginPath();ctx.ellipse(0,10,17+(i===1?4:0),8,0,0,Math.PI*2);ctx.fill();ctx.stroke();
 ctx.fillStyle=f.color;ctx.beginPath();ctx.ellipse(0,-1,12,20,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#fff5d9';ctx.fillRect(-11,-5,22,6);
 ctx.strokeStyle='#4d7573';ctx.beginPath();ctx.moveTo(0,-33);ctx.lineTo(0,24);ctx.stroke();ctx.fillStyle=f.color;ctx.fillRect(1,-33,11,7);ctx.lineWidth=3;
 if(i===1){ctx.fillStyle='#b29267';ctx.fillRect(-21,8,9,12);ctx.fillRect(12,8,9,12);}
 if(i===2){ctx.fillStyle='#87d1e1';ctx.beginPath();ctx.moveTo(0,-22);ctx.lineTo(18,5);ctx.lineTo(0,19);ctx.lineTo(-18,5);ctx.closePath();ctx.fill();ctx.stroke();}
 if(i===3){ctx.beginPath();ctx.arc(0,-7,22,Math.PI,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(0,-7,28,Math.PI*1.15,Math.PI*1.85);ctx.stroke();}
 if(i===4){ctx.beginPath();ctx.moveTo(-26,15);ctx.quadraticCurveTo(-13,1,0,15);ctx.quadraticCurveTo(13,29,26,15);ctx.stroke();}
 if(i===5){ctx.fillStyle='#bad38f';for(const x of [-16,16]){ctx.beginPath();ctx.ellipse(x,0,7,12,x/22,0,Math.PI*2);ctx.fill();ctx.stroke();}}
 if(i===6){ctx.fillStyle='#536e7a';ctx.fillRect(-20,-8,12,23);ctx.fillRect(8,-8,12,23);ctx.fillStyle='#f5d67a';ctx.fillRect(-18,-5,8,5);ctx.fillRect(10,-5,8,5);}
 ctx.restore();
}

const thumbnails=new Map();
export function floatIconUrl(type){
 if(!thumbnails.has(type)){const canvas=document.createElement('canvas');canvas.width=FLOAT_ART_SIZE.width;canvas.height=FLOAT_ART_SIZE.height;drawFloat(canvas,type);thumbnails.set(type,canvas.toDataURL('image/png'));}
 return thumbnails.get(type);
}
