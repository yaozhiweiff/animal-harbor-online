// Normalized head positions in the six square A2 boat textures.
const HEADS=[
 {x:.505,y:.278,width:.42}, // Orange cat: between the ears.
 {x:.525,y:.282,width:.42}, // Corgi.
 {x:.535,y:.264,width:.40}, // Beaver.
 {x:.515,y:.273,width:.42}, // Bear.
 {x:.510,y:.262,width:.40}, // Otter.
 {x:.530,y:.278,width:.42}, // Fox.
];

export function headwearLayout(type,hasHat=false){
 const h=HEADS[type]||HEADS[0];
 return {
  hat:{x:h.x,y:h.y,width:h.width,originX:.5,originY:.76},
  crown:{x:h.x,y:h.y+(hasHat?-.066:.006),width:hasHat?.265:h.width*.85,originX:.5,originY:.84},
 };
}

export function headwearCss(type,hasHat=false){
 const {hat,crown}=headwearLayout(type,hasHat),percent=n=>(n*100).toFixed(2)+'%';
 return `--head-x:${percent(hat.x)};--hat-y:${percent(hat.y)};--hat-width:${percent(hat.width)};--crown-y:${percent(crown.y)};--crown-width:${percent(crown.width)}`;
}
