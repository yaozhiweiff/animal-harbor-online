export const GIFT_ART_SIZE={width:72,height:64};

// Transparent wearable hats shared by the sea, portraits and gift cards.
export function drawGift(canvas,id){
 const c=canvas.getContext('2d',{willReadFrequently:true});c.clearRect(0,0,canvas.width,canvas.height);c.save();c.scale(canvas.width/72,canvas.height/64);
 c.lineJoin='round';c.lineCap='round';c.lineWidth=2;
 const shape=(points,fill,stroke='#48646c')=>{c.beginPath();for(const [i,p]of points.entries())i?c.lineTo(...p):c.moveTo(...p);c.closePath();c.fillStyle=fill;c.fill();c.strokeStyle=stroke;c.stroke();};
 if(id==='luck'){
  shape([[15,39],[22,18],[38,15],[50,21],[57,39]],'#7ca77d');
  shape([[12,39],[58,36],[62,43],[53,49],[20,49],[10,44]],'#a0bd8a');
  shape([[18,32],[54,31],[56,38],[16,40]],'#ebc47d');
  c.fillStyle='#3c7d67';for(const [x,y]of [[31,28],[36,23],[41,28],[36,32]]){c.beginPath();c.arc(x,y,4,0,Math.PI*2);c.fill();}c.strokeStyle='#3c7d67';c.beginPath();c.moveTo(37,31);c.lineTo(39,37);c.stroke();
 }else{
  c.beginPath();c.moveTo(14,31);c.bezierCurveTo(9,8,63,8,59,31);c.lineTo(54,39);c.lineTo(18,39);c.closePath();c.fillStyle=id==='yield'?'#f6dda0':'#f7f4dc';c.fill();c.strokeStyle='#48646c';c.stroke();
  shape([[17,33],[55,33],[53,42],[18,42]],id==='yield'?'#537b89':'#618fa0');
  c.beginPath();c.moveTo(18,40);c.quadraticCurveTo(37,38,55,41);c.quadraticCurveTo(49,52,27,48);c.closePath();c.fillStyle='#385869';c.fill();c.stroke();
  if(id==='yield'){
   shape([[29,22],[32,26],[36,19],[40,26],[44,22],[42,31],[30,31]],'#e4ad50','#9e7e44');
  }else{
   c.fillStyle='#f8e7a8';c.strokeStyle='#5b7884';c.beginPath();c.arc(36,25,7,0,Math.PI*2);c.fill();c.stroke();c.beginPath();c.moveTo(36,21);c.lineTo(36,25);c.lineTo(40,27);c.stroke();
  }
 }
 c.restore();
}

const icons=new Map();
export function giftIconUrl(id){
 if(!icons.has(id)){const canvas=document.createElement('canvas');canvas.width=GIFT_ART_SIZE.width;canvas.height=GIFT_ART_SIZE.height;drawGift(canvas,id);icons.set(id,canvas.toDataURL('image/png'));}
 return icons.get(id);
}
