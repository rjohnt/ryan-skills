// World units are arbitrary. Timing and rendering belong to the caller.
import { pathToFileURL } from 'node:url';
export const distance = (a,b) => Math.hypot(...a.map((v,i)=>v-b[i]));
export function rotateAboutAxis(point, origin, axis, angle) {
  const length=Math.hypot(...axis); if(!length) throw new Error('Axis must be nonzero');
  const k=axis.map(v=>v/length), v=point.map((n,i)=>n-origin[i]);
  const cross=[k[1]*v[2]-k[2]*v[1],k[2]*v[0]-k[0]*v[2],k[0]*v[1]-k[1]*v[0]];
  const dot=k.reduce((sum,n,i)=>sum+n*v[i],0),c=Math.cos(angle),s=Math.sin(angle);
  return v.map((n,i)=>origin[i]+n*c+cross[i]*s+k[i]*dot*(1-c));
}
export function project(point,{distance:cameraDistance=2200,centerX=0,hingeY=0,elevation=.1,shear=0,near=1}={}) {
  const [x,y,z]=point,depth=cameraDistance-y;
  if(!(cameraDistance>0)||!(depth>near)) throw new Error('Vertex is outside the camera near plane');
  const q=depth/cameraDistance;
  return [centerX+(x+shear*y)/q,hingeY+(elevation*y-z)/q];
}
export function hingedLid({width=410,length=237,lidThickness=3,baseThickness=6}={},angle=Math.PI/2) {
  if(!(width>0&&length>0&&lidThickness>=0&&baseThickness>=0)) throw new Error('Invalid dimensions');
  const w=width/2,c=Math.cos(angle),s=Math.sin(angle);
  const inner=[[-w,length*c,length*s],[w,length*c,length*s],[w,0,0],[-w,0,0]];
  const normal=[0,-s*lidThickness,c*lidThickness];
  const outer=inner.map(p=>p.map((n,i)=>n+normal[i]));
  const deck=[[-w,length,0],[w,length,0],[w,0,0],[-w,0,0]];
  const bottom=deck.map(([x,y])=>[x,y,-baseThickness]);
  return {inner,outer,deck,bottom,angle};
}
export function auditLid(model,{width=410,length=237,lidThickness=3}={}) {
  const {inner,outer,deck,angle}=model;
  return {
    hingeError:Math.max(distance(inner[2],deck[2]),distance(inner[3],deck[3])),
    lengthError:Math.max(Math.abs(distance(inner[0],inner[3])-length),Math.abs(distance(inner[1],inner[2])-length)),
    widthError:Math.abs(distance(inner[0],inner[1])-width),
    thicknessError:Math.max(...inner.map((p,i)=>Math.abs(distance(p,outer[i])-lidThickness))),
    clearance:Math.min(...inner.map(p=>p[2])),
    contactError:Math.abs(angle)<1e-10?Math.max(distance(inner[0],deck[0]),distance(inner[1],deck[1])):null,
  };
}
export function selfTest() {
  let max={hingeError:0,lengthError:0,widthError:0,thicknessError:0,contactError:0};
  for(const dims of [{width:410,length:237,lidThickness:3,baseThickness:6},{width:120,length:70,lidThickness:1.5,baseThickness:4}]) {
    for(let i=0;i<=720;i++) {
      const angle=(1-i/720)*Math.PI/2,model=hingedLid(dims,angle),audit=auditLid(model,dims);
      for(let key of Object.keys(max))max[key]=Math.max(max[key],audit[key]??0);
      if(audit.clearance<-1e-9)throw new Error('Lid penetrates deck');
      const rotated=rotateAboutAxis([-dims.width/2,dims.length,0],[0,0,0],[1,0,0],angle);
      if(distance(rotated,model.inner[0])>1e-9)throw new Error('Rotation and lid model disagree');
      for(const camera of [{distance:2200,elevation:.07},{distance:2200,elevation:.17},{distance:2400,elevation:.14,shear:.055}]) {
        const hinge=model.inner.slice(2).map(p=>project(p,camera));
        const fixed=model.deck.slice(2).map(p=>project(p,camera));
        if(Math.max(...hinge.map((p,j)=>distance(p,fixed[j])))>1e-9)throw new Error('Projected hinge detached');
        if(i===720&&Math.max(...model.inner.slice(0,2).map((p,j)=>distance(project(p,camera),project(model.deck[j],camera))))>1e-9)throw new Error('Projected contact does not mate');
      }
    }
  }
  if(Object.values(max).some(n=>n>1e-9))throw new Error('Rigid invariant failed');
  let rejected=false;try{project([0,2400,0],{distance:2200});}catch{rejected=true;}if(!rejected)throw new Error('Near plane was not enforced');
  // A deliberate penetration must be detectable, so the audit is not a tautological success.
  const broken=hingedLid({},0);broken.inner[0][2]=-1;if(auditLid(broken).clearance>=0)throw new Error('Audit missed penetration');
  return {poses:1442,cameras:3,tolerance:1e-9,maxErrors:max};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
  if(process.argv.includes('--self-test'))console.log(JSON.stringify(selfTest(),null,2));
  else console.log('Import hingedLid, rotateAboutAxis, project, and auditLid; or run with --self-test.');
}
