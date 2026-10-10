"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, normalizeList, type Project, type User } from "@/lib/api";
import { toast } from "sonner";
import StudentsManager from "@/components/StudentsManager";

const nav=[{id:"inicio",label:"Resumen",icon:"◫"},{id:"proyectos",label:"Proyectos",icon:"▤"},{id:"postulaciones",label:"Postulaciones",icon:"↗"},{id:"alumnos",label:"Alumnos",icon:"♙"},{id:"empresas",label:"Empresas",icon:"▦"},{id:"asesores",label:"Asesores",icon:"♧"},{id:"documentos",label:"Documentos",icon:"▣"},{id:"usuarios",label:"Usuarios",icon:"♙"}];

type Row=Record<string,unknown>;

export default function Dashboard(){const router=useRouter();

  const [user,setUser]=useState<User|null>(null);

  const [view,setView]=useState("inicio");

  const [projects,setProjects]=useState<Project[]>([]);

  const [postulations,setPostulations]=useState<Row[]>([]);

  const [rows,setRows]=useState<Row[]>([]);

  const [loading,setLoading]=useState(false);

  const [apiError,setApiError]=useState("");

  const [query,setQuery]=useState("");

  const [modal,setModal]=useState(false);

  const [saving,setSaving]=useState(false);

  const [editingProject,setEditingProject]=useState<Row|null>(null);

  const [entityModal,setEntityModal]=useState(false);

  const [entityEditing,setEntityEditing]=useState<Row|null>(null);

  const [entityForm,setEntityForm]=useState({correo:"",password:"",nombre:"",departamento:"",maximoAlumnos:"30",razonSocial:"",sector:"",nombreContacto:"",telefono:"",direccion:"",estadoVerificacion:false});

  const [statusTarget,setStatusTarget]=useState<{row:Row;status:"ACEPTADO"|"RECHAZADO"|"EN_REVICION"}|null>(null);

  const [statusComment,setStatusComment]=useState("");

  const [form,setForm]=useState({titulo:"",descripcion:"",objetivo:"",tecnologiasRequeridas:"",cupoAlumnos:"2",idEmpresa:"",numeroControl:"",idProyecto:"",comentariosEmpresa:""});

useEffect(()=>{const raw=localStorage.getItem("siger_user");if(!raw){router.replace("/login");return;}try{setUser(JSON.parse(raw) as User)}
  catch {router.replace("/login")}},[router]);

const role=String(user?.rol||"ALUMNO").toUpperCase();

  const isCompany=role==="EMPRESA";

  const isAdvisor=role.includes("ASESOR");

  const isAdmin=role==="ADMIN";

  const displayName=user?.nombreCompleto||user?.correo?.split("@")[0]||"Usuario";

const load=useCallback(async()=>{setLoading(true);setApiError("");
  try {const [p,po]=await Promise.all([api.get("/proyectos"),api.get("/postulaciones")]);setProjects(normalizeList<Project>(p.data));setPostulations(normalizeList<Row>(po.data));}catch(e:unknown){setApiError("No fue posible cargar todos los datos. Comprueba que Spring Boot y PostgreSQL estén funcionando y que las rutas API sean accesibles.");}
  finally {setLoading(false)}},[]);

useEffect(()=>{if(user)void load()},[user,load]);

const endpoint=useMemo(()=>({alumnos:"/alumnos",empresas:"/empresas",asesores:"/asesores",documentos:"/documentos",postulaciones:"/postulaciones",proyectos:"/proyectos"}[view]||"/proyectos"),[view]);

const loadRows=useCallback(async()=>{if(!["alumnos","empresas","asesores","documentos","postulaciones","proyectos"].includes(view))return;setLoading(true);
  try {const {data}=await api.get(endpoint);setRows(normalizeList<Row>(data));}
  catch {setRows([]);
      toast.error(`No se pudo consultar ${view}. Revisa el backend.`)}
  finally {setLoading(false)}},[endpoint,view]);

  useEffect(()=>{void loadRows()},[loadRows]);

function logout(){localStorage.removeItem("siger_user");localStorage.removeItem("siger_token");router.replace("/login")}

async function apply(project:Project){if(!user){toast.error("Inicia sesión primero");return;}const numeroControl=window.prompt("Escribe tu número de control para registrar la postulación:");if(!numeroControl)return;
  try {await api.post("/postulaciones",{alumno:{numeroControl},proyecto:{idProyecto:project.idProyecto},fechaSolicitud:new Date().toISOString().slice(0,10),estado:"EN_REVICION",comentariosEmpresa:""});
      toast.success("Postulación enviada");
      await load();}
  catch {toast.error("No se pudo enviar. Verifica que el número de control y el proyecto existan.")}}

async function create(){setSaving(true);
  try {if(view==="proyectos"){const payload={titulo:form.titulo,descripcion:form.descripcion,objetivo:form.objetivo,tecnologiasRequeridas:form.tecnologiasRequeridas,cupoAlumnos:Number(form.cupoAlumnos),estado:String(editingProject?.estado||"DISPONIBLE"),fechaPublicacion:String(editingProject?.fechaPublicacion||new Date().toISOString().slice(0,10)),empresa:{idEmpresa:Number(form.idEmpresa)}};if(editingProject)await api.put(`/proyectos/${editingProject.idProyecto}`,{...editingProject,...payload});else await api.post("/proyectos",payload)}else if(view==="postulaciones"){await api.post("/postulaciones",{alumno:{numeroControl:form.numeroControl},proyecto:{idProyecto:Number(form.idProyecto)},fechaSolicitud:new Date().toISOString().slice(0,10),estado:"EN_REVICION",comentariosEmpresa:form.comentariosEmpresa})}else{toast.info("Este formulario rápido está habilitado para proyectos y postulaciones. Usa los endpoints CRUD para las demás entidades.");return;}toast.success(editingProject?"Proyecto actualizado correctamente":"Registro creado correctamente");setModal(false);setEditingProject(null);setForm({titulo:"",descripcion:"",objetivo:"",tecnologiasRequeridas:"",cupoAlumnos:"2",idEmpresa:"",numeroControl:"",idProyecto:"",comentariosEmpresa:""});
      await load();
      await loadRows()}
  catch {toast.error("No se pudo guardar. Revisa los campos obligatorios y los identificadores relacionados.")}
  finally {setSaving(false)}}

async function deleteRow(row:Row){const id=(row.idProyecto??row.idPostulacion??row.idDocumento??row.idEmpresa??row.idAsesor??row.numeroControl??row.idUsuario) as string|number|undefined;if(id===undefined||!window.confirm("¿Seguro que deseas eliminar este registro?"))return;
  try {await api.delete(`${endpoint}/${id}`);
      toast.success("Registro eliminado");
      await loadRows();
      await load()}
  catch {toast.error("No se pudo eliminar. Puede existir una relación con otros registros.")}}

async function deleteProject(id:number){if(!window.confirm("¿Eliminar este proyecto?"))return;
  try {await api.delete(`/proyectos/${id}`);
      toast.success("Proyecto eliminado");
      await load();}
  catch {toast.error("No se pudo eliminar el proyecto; puede tener postulaciones relacionadas.")}}

function openEntityForm(row?:Row){

const editing=!!row; setEntityEditing(row||null);

setEntityForm({correo:"",password:"",nombre:String(row?.nombreCompleto||""),departamento:String(row?.departamento||""),maximoAlumnos:String(row?.maximoAlumnos||30),razonSocial:String(row?.razonSocial||""),sector:String(row?.sector||""),nombreContacto:String(row?.nombreContacto||""),telefono:String(row?.telefono||""),direccion:String(row?.direccion||""),estadoVerificacion:Boolean(row?.estadoVerificacion)});

setEntityModal(true);

}

async function saveEntity(e:React.FormEvent<HTMLFormElement>){

e.preventDefault(); setSaving(true);

try{

 if(view==="asesores") {

if(entityEditing){const id=Number(entityEditing.idAsesor); await api.put(`/asesores/${id}`,{...entityEditing,nombreCompleto:entityForm.nombre,departamento:entityForm.departamento,maximoAlumnos:Number(entityForm.maximoAlumnos)});}

else {if(!entityForm.correo.trim()||entityForm.password.length<8)throw new Error("Correo y contraseña de al menos 8 caracteres requeridos"); const u=await api.post("/usuarios",{correo:entityForm.correo,password:entityForm.password,rol:"ASESOR",activo:true}); const uid=u.data?.idUsuario; if(!uid)throw new Error("No se recibió idUsuario"); await api.post("/asesores",{usuario:{idUsuario:uid},nombreCompleto:entityForm.nombre,departamento:entityForm.departamento,maximoAlumnos:Number(entityForm.maximoAlumnos)});}

 } else {

if(entityEditing){const id=Number(entityEditing.idEmpresa); await api.put(`/empresas/${id}`,{...entityEditing,razonSocial:entityForm.razonSocial,sector:entityForm.sector,nombreContacto:entityForm.nombreContacto,telefono:entityForm.telefono,direccion:entityForm.direccion,estadoVerificacion:entityForm.estadoVerificacion});}

else {if(!entityForm.correo.trim()||entityForm.password.length<8)throw new Error("Correo y contraseña de al menos 8 caracteres requeridos"); const u=await api.post("/usuarios",{correo:entityForm.correo,password:entityForm.password,rol:"EMPRESA",activo:true}); const uid=u.data?.idUsuario; if(!uid)throw new Error("No se recibió idUsuario"); await api.post("/empresas",{usuario:{idUsuario:uid},razonSocial:entityForm.razonSocial,sector:entityForm.sector,nombreContacto:entityForm.nombreContacto,telefono:entityForm.telefono,direccion:entityForm.direccion,estadoVerificacion:entityForm.estadoVerificacion});}

 }

 toast.success(entityEditing?"Cambios guardados":"Registro y cuenta creados");setEntityModal(false);
      await loadRows();

}catch(err){toast.error(err instanceof Error?err.message:"No se pudo guardar. Verifica los campos y que el correo sea único.")}
  finally {setSaving(false)}

}

async function editManagedEntity(row:Row){

if(view==="asesores"||view==="empresas"){openEntityForm(row);return;}

if(view==="proyectos"){setEditingProject(row);setForm({titulo:String(row.titulo||""),descripcion:String(row.descripcion||""),objetivo:String(row.objetivo||""),tecnologiasRequeridas:String(row.tecnologiasRequeridas||""),cupoAlumnos:String(row.cupoAlumnos||2),idEmpresa:String((row.empresa as Row|undefined)?.idEmpresa||row.idEmpresa||""),numeroControl:"",idProyecto:"",comentariosEmpresa:""});setModal(true);}

}

function openStatusDialog(row:Row,status:"ACEPTADO"|"RECHAZADO"|"EN_REVICION"){setStatusTarget({row,status});setStatusComment(String(row.comentariosEmpresa||""));}

async function saveApplicationStatus(e:React.FormEvent<HTMLFormElement>){e.preventDefault();if(!statusTarget)return;

  const {row,status}=statusTarget;
  try {await api.put(`/postulaciones/${row.idPostulacion}`,{...row,estado:status,alumno:{numeroControl:(row.alumno as Row|undefined)?.numeroControl},proyecto:{idProyecto:(row.proyecto as Row|undefined)?.idProyecto},comentariosEmpresa:statusComment});
      toast.success("Postulación actualizada con comentario");setStatusTarget(null);
      await loadRows();
      await load();}
  catch {toast.error("No se pudo actualizar la postulación; revisa sus relaciones en el backend.")}}

if(!user)return <div style={{padding:40}}>Cargando sesión…</div>;

const title=({inicio:"Resumen general",proyectos:"Proyectos de residencia",postulaciones:"Gestión de postulaciones",alumnos:"Alumnos registrados",empresas:"Empresas vinculadas",asesores:"Asesores académicos",documentos:"Expedientes y documentos",ia:"Asistente inteligente"} as Record<string,string>)[view]||"SIGER";

const visibleNav=nav.filter(n=>n.id==="usuarios"?isAdmin:(isAdmin||n.id==="inicio"||n.id==="proyectos"||n.id==="postulaciones"||(isAdvisor&&["alumnos","asesores","documentos"].includes(n.id))||(isCompany&&["documentos"].includes(n.id))));

const shownProjects=projects.filter(p=>`${p.titulo} ${p.descripcion||""} ${p.tecnologiasRequeridas||""}`.toLowerCase().includes(query.toLowerCase()));

return <div className="app-shell">
<aside className="sidebar">
<div className="brand">
<span className="brand-mark">S</span>
<span>SIGER <small style={{display:"block",fontWeight:400,color:"#9eabc5",fontSize:10,marginTop:3}}>RESIDENCIAS PROFESIONALES</small>
</span>
</div>
<div>
<div className="nav-label">ESPACIO DE TRABAJO</div>{visibleNav.map(n=>
<button key={n.id} className={`nav-button ${view===n.id?"active":""}`} onClick={()=>{setView(n.id);setQuery("")}}>
<span style={{width:20,fontSize:17,textAlign:"center"}}>{n.icon}</span>{n.label}</button>)}</div>
<div className="sidebar-bottom">
<div style={{fontWeight:700,color:"white",marginBottom:5}}>Plataforma SIGER</div>Gestión conectada de residencias profesionales.<div style={{marginTop:10,color:"#8ea0c3"}}>API transaccional · Machine Learning</div>
</div>
</aside>
<main className="main">
<header className="topbar">
<div>
<div className="eyebrow">Panel de control / {isAdmin?"Administrador":isAdvisor?"Asesor académico":isCompany?"Empresa":"Alumno"}</div>
<h1 className="page-title">{title}</h1>
</div>
<div style={{display:"flex",alignItems:"center",gap:12}}>
<div className="hide-mobile" style={{textAlign:"right"}}>
<div style={{fontSize:12,fontWeight:700}}>{displayName}</div>
<div style={{fontSize:10,color:"#7b879a",marginTop:4}}>{role.replace("_"," ")}</div>
</div>
<button className="light-btn" onClick={logout}>Cerrar sesión</button>
</div>
</header>
<div className="content">{apiError&&<div className="error" style={{marginBottom:18}}>{apiError} <button onClick={()=>void load()} style={{marginLeft:10,textDecoration:"underline"}}>Reintentar</button>
</div>}

{view==="inicio"&&<>
<section className="welcome">
<div style={{position:"relative",zIndex:1}}>
<div className="eyebrow" style={{color:"#d4ddff",marginBottom:12}}>TU CENTRO DE GESTIÓN</div>
<h2>Hola, {displayName} </h2>
<p>Organiza tus proyectos.<br/>Consulta proyectos, gestiona postulaciones y da seguimiento a cada avance.</p>
<div style={{display:"flex",gap:9,marginTop:20,flexWrap:"wrap"}}>
<button className="light-btn" onClick={()=>setView("proyectos")}>Explorar proyectos ↗</button>
</div>
</div>
<div className="hide-mobile" style={{position:"relative",zIndex:1,fontSize:58,opacity:.9}}>✧</div>
</section>
<div className="stat-grid">{[{label:"Proyectos disponibles",value:projects.length,icon:"▤",foot:"Vacantes registradas"},{label:"Postulaciones",value:postulations.length,icon:"↗",foot:"Solicitudes en el sistema"},{label:"Pendientes de revisión",value:postulations.filter(p=>String(p.estado||"").includes("EN_REVICION")).length,icon:"◷",foot:"Requieren seguimiento"},{label:"Estado del sistema",value:apiError?"Revisar":"Activo",icon:"◎",foot:"Conexión transaccional",color:apiError?"#b42318":"#15966a"}].map((s,i)=>
<div className="stat-card" key={s.label}>
<div className="stat-top">
<span>{s.label}</span>
<span style={{fontSize:19,color:["#4264dc","#15966a","#d18b19","#15966a"][i]}}>{s.icon}</span>
</div>
<div className="stat-number" style={{fontSize:typeof s.value==="string"?22:30,color:s.color||"#17243b"}}>{loading?"…":s.value}</div>
<div className="stat-foot">{s.foot}</div>
</div>)}</div>
<div className="two-col">
<section className="panel">
<div className="section-head" style={{marginTop:0}}>
<div>
<h3>Proyectos recientes</h3>
<p>Oportunidades para tu desarrollo profesional</p>
</div>
<button className="light-btn" onClick={()=>setView("proyectos")}>Ver todos</button>
</div>{loading?<div className="empty">Cargando proyectos…</div>:projects.slice(0,3).map(p=>
<ProjectCard key={p.idProyecto} project={p} apply={()=>void apply(p)}/>)}{!projects.length&&!loading&&<div className="empty">Aún no hay proyectos registrados en el backend.</div>}</section>
<section className="panel">
<div className="section-head" style={{marginTop:0}}>
<div>
<h3>Actividad reciente</h3>
<p>Seguimiento de solicitudes</p>
</div>
<span className="chip">En vivo</span>
</div>{postulations.slice(0,5).map((p,i)=>
<div key={String(p.idPostulacion??i)} style={{display:"flex",gap:12,padding:"13px 0",borderBottom:"1px solid #eef1f5"}}>
<div style={{width:34,height:34,background:"#eef2ff",color:"#4561ce",borderRadius:10,display:"grid",placeItems:"center"}}>↗</div>
<div style={{flex:1}}>
<div style={{fontSize:12,fontWeight:700}}>Postulación #{String(p.idPostulacion??i+1)}</div>
<div className="muted">Estado: {String(p.estado||"Sin estado")}</div>
</div>
<span className={`chip ${String(p.estado)==="ACEPTADO"?"green":"amber"}`}>{String(p.estado||"PENDIENTE")}</span>
</div>)}{!postulations.length&&<div className="empty">No hay actividad registrada todavía.</div>}</section>
</div>
</>}

{view==="proyectos"&&<>
<div className="section-head" style={{marginTop:0}}>
<div>
<h3>Oportunidades de residencia</h3>
<p>Consulta proyectos publicados por empresas vinculadas.</p>
</div>{(isCompany||isAdmin)&&<button className="primary-btn" onClick={()=>{setEditingProject(null);setForm({titulo:"",descripcion:"",objetivo:"",tecnologiasRequeridas:"",cupoAlumnos:"2",idEmpresa:"",numeroControl:"",idProyecto:"",comentariosEmpresa:""});setModal(true)}}>＋ Publicar proyecto</button>}</div>
<input className="field" style={{maxWidth:420,marginBottom:8}} placeholder="Buscar por título, descripción o tecnología…" value={query} onChange={e=>setQuery(e.target.value)}/>{loading?<div className="empty">Cargando información…</div>:shownProjects.map(p=>
<ProjectCard key={p.idProyecto} project={p} apply={isCompany?undefined:()=>void apply(p)} manage={(isCompany||isAdmin)?{edit:()=>void editManagedEntity(p as unknown as Row),remove:()=>void deleteProject(p.idProyecto)}:undefined}/>)}{!shownProjects.length&&!loading&&<div className="panel empty">No hay resultados para esta búsqueda.</div>}</>}

{view==="alumnos"&&(isAdmin||isAdvisor)&&<StudentsManager/>}{["postulaciones","empresas","asesores","documentos"].includes(view)&&<>
<div className="section-head" style={{marginTop:0}}>
<div>
<h3>Registros del sistema</h3>
<p></p>
</div>
<div style={{display:"flex",gap:8}}>{((view==="empresas"&&isAdmin)|| (view==="asesores"&&(isAdmin||isAdvisor)))&&<button className="primary-btn" onClick={()=>openEntityForm()}>＋ Crear {view==="empresas"?"empresa":"asesor"}</button>}<button className="light-btn" onClick={()=>void loadRows()}>↻ Actualizar</button>
</div>
</div>
<input className="field" style={{maxWidth:400,marginBottom:14}} placeholder="Filtrar registros visibles…" value={query} onChange={e=>setQuery(e.target.value)}/>
<div className="table-wrap">{loading?<div className="empty">Cargando datos…</div>:rows.length===0?<div className="empty">No hay registros o el endpoint no devolvió datos.</div>:<table>
<thead>
<tr>{Object.keys(rows[0]).filter(k=>typeof rows[0][k]!=="object"||rows[0][k]===null).slice(0,6).map(k=>
<th key={k}>{k}</th>)}<th>Acciones</th>
</tr>
</thead>
<tbody>{rows.filter(r=>JSON.stringify(r).toLowerCase().includes(query.toLowerCase())).map((r,i)=>
<tr key={String(r.idProyecto??r.idPostulacion??r.idDocumento??r.idEmpresa??r.idAsesor??r.numeroControl??r.idUsuario??i)}>{Object.keys(r).filter(k=>typeof r[k]!=="object"||r[k]===null).slice(0,6).map(k=>
<td key={k}>{String(r[k]??"—").slice(0,90)}</td>)}<td>
<div style={{display:"flex",gap:6,flexWrap:"wrap" }}>{((view==="asesores"&&(isAdmin||isAdvisor))||(view==="empresas"&&isAdmin)||(view==="proyectos"&&(isAdmin||isCompany)))&&<button className="light-btn" onClick={()=>void editManagedEntity(r)}>Modificar</button>}{view==="postulaciones"&&isCompany&&<>
<button className="light-btn" onClick={()=>openStatusDialog(r,"ACEPTADO")}>Aceptar</button>
<button className="light-btn" onClick={()=>openStatusDialog(r,"RECHAZADO")}>Rechazar</button>
<button className="light-btn" onClick={()=>openStatusDialog(r,"EN_REVICION")}>En revisión</button>
</>}{((view==="asesores"&&(isAdmin||isAdvisor))||(view==="empresas"&&isAdmin)||(view==="proyectos"&&(isAdmin||isCompany)))&&<button className="light-btn" onClick={()=>void deleteRow(r)}>Eliminar</button>}</div>
</td>
</tr>)}</tbody>
</table>}</div>
<p className="muted" style={{marginTop:12}}></p>
</>}

{view==="usuarios"&&isAdmin&&<UsersAdmin/>}



{modal&&<div style={{position:"fixed",inset:0,background:"#0c173a88",zIndex:20,display:"grid",placeItems:"center",padding:16}}>
<form className="panel" style={{width:"min(650px,100%)",maxHeight:"90vh",overflowY:"auto"}} onSubmit={e=>{e.preventDefault();void create()}}>
<div className="section-head" style={{marginTop:0}}>
<div>
<h3>{view==="proyectos"?(editingProject?"Editar proyecto":"Publicar proyecto"):"Nueva postulación"}</h3>
<p>Los datos se enviarán al backend de Spring Boot.</p>
</div>
<button type="button" className="light-btn" onClick={()=>setModal(false)}>Cerrar ✕</button>
</div>{view==="proyectos"?<div className="form-grid">
<div style={{gridColumn:"1/-1"}}>
<label className="form-label">Título *</label>
<input className="field" required value={form.titulo} onChange={e=>setForm({...form,titulo:e.target.value})}/>
</div>
<div style={{gridColumn:"1/-1"}}>
<label className="form-label">Descripción</label>
<textarea className="field" rows={3} value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})}/>
</div>
<div style={{gridColumn:"1/-1"}}>
<label className="form-label">Objetivo</label>
<textarea className="field" rows={2} value={form.objetivo} onChange={e=>setForm({...form,objetivo:e.target.value})}/>
</div>
<div>
<label className="form-label">Tecnologías requeridas</label>
<input className="field" value={form.tecnologiasRequeridas} onChange={e=>setForm({...form,tecnologiasRequeridas:e.target.value})} placeholder="Java, SQL, React"/>
</div>
<div>
<label className="form-label">Cupo de alumnos *</label>
<input className="field" type="number" min="1" required value={form.cupoAlumnos} onChange={e=>setForm({...form,cupoAlumnos:e.target.value})}/>
</div>
<div>
<label className="form-label">ID de empresa *</label>
<input className="field" type="number" min="1" required value={form.idEmpresa} onChange={e=>setForm({...form,idEmpresa:e.target.value})}/>
</div>
</div>:<div className="form-grid">
<div>
<label className="form-label">Número de control *</label>
<input className="field" required value={form.numeroControl} onChange={e=>setForm({...form,numeroControl:e.target.value})}/>
</div>
<div>
<label className="form-label">ID del proyecto *</label>
<input className="field" type="number" required value={form.idProyecto} onChange={e=>setForm({...form,idProyecto:e.target.value})}/>
</div>
</div>}<div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:22}}>
<button type="button" className="light-btn" onClick={()=>setModal(false)}>Cancelar</button>
<button className="primary-btn" disabled={saving}>{saving?"Guardando…":"Guardar registro"}</button>
</div>
</form>
</div>}

{entityModal&&<div className="siger-overlay">
<form className="siger-modal" onSubmit={saveEntity}>
<div className="siger-modal-head">
<div>
<span className="siger-kicker">GESTIÓN DEL SISTEMA</span>
<h2>{entityEditing?"Editar":"Crear"} {view==="asesores"?"asesor académico":"empresa"}</h2>
<p>Completa los campos y guarda los cambios en el backend.</p>
</div>
<button type="button" className="light-btn" onClick={()=>setEntityModal(false)}>Cerrar ✕</button>
</div>
<div className="siger-form-grid">{!entityEditing&&<>
<label>Correo de acceso *<input type="email" required className="field" value={entityForm.correo} onChange={e=>setEntityForm({...entityForm,correo:e.target.value})} placeholder="correo@ejemplo.com"/>
</label>
<label>Contraseña inicial *<input type="password" minLength={8} required className="field" value={entityForm.password} onChange={e=>setEntityForm({...entityForm,password:e.target.value})} placeholder="Mínimo 8 caracteres"/>
</label>
</>}{view==="asesores"?<>
<label className="wide">Nombre completo *<input required className="field" value={entityForm.nombre} onChange={e=>setEntityForm({...entityForm,nombre:e.target.value})}/>
</label>
<label>Departamento<input className="field" value={entityForm.departamento} onChange={e=>setEntityForm({...entityForm,departamento:e.target.value})} placeholder="Ingeniería"/>
</label>
<label>Máximo de alumnos *<input type="number" min="1" required className="field" value={entityForm.maximoAlumnos} onChange={e=>setEntityForm({...entityForm,maximoAlumnos:e.target.value})}/>
</label>
</>:<>
<label className="wide">Razón social *<input required className="field" value={entityForm.razonSocial} onChange={e=>setEntityForm({...entityForm,razonSocial:e.target.value})}/>
</label>
<label>Sector<input className="field" value={entityForm.sector} onChange={e=>setEntityForm({...entityForm,sector:e.target.value})} placeholder="Tecnología"/>
</label>
<label>Nombre del contacto<input className="field" value={entityForm.nombreContacto} onChange={e=>setEntityForm({...entityForm,nombreContacto:e.target.value})}/>
</label>
<label>Teléfono<input className="field" value={entityForm.telefono} onChange={e=>setEntityForm({...entityForm,telefono:e.target.value})}/>
</label>
<label>Dirección<input className="field" value={entityForm.direccion} onChange={e=>setEntityForm({...entityForm,direccion:e.target.value})}/>
</label>
<label className="wide siger-check">
<input type="checkbox" checked={entityForm.estadoVerificacion} onChange={e=>setEntityForm({...entityForm,estadoVerificacion:e.target.checked})}/> Empresa verificada</label>
</>}</div>
<div className="siger-modal-actions">
<button type="button" className="light-btn" onClick={()=>setEntityModal(false)}>Cancelar</button>
<button className="primary-btn" disabled={saving}>{saving?"Guardando…":"Guardar cambios"}</button>
</div>
</form>
</div>}{statusTarget&&<div className="siger-overlay">
<form className="siger-modal siger-small" onSubmit={saveApplicationStatus}>
<div className="siger-modal-head">
<div>
<span className="siger-kicker">POSTULACIÓN #{String(statusTarget.row.idPostulacion||"")}</span>
<h2>{statusTarget.status==="ACEPTADO"?"Aceptar postulación":statusTarget.status==="RECHAZADO"?"Rechazar postulación":"Dejar en revisión"}</h2>
<p>El comentario quedará asociado a la decisión de la empresa.</p>
</div>
</div>
<label>Comentario para el alumno {statusTarget.status==="RECHAZADO"?"*":"(opcional)"}<textarea className="field" rows={4} required={statusTarget.status==="RECHAZADO"} value={statusComment} onChange={e=>setStatusComment(e.target.value)} placeholder={statusTarget.status==="RECHAZADO"?"Explica brevemente el motivo del rechazo…":"Escribe un comentario para el alumno…"}/>
</label>
<div className="siger-modal-actions">
<button type="button" className="light-btn" onClick={()=>setStatusTarget(null)}>Cancelar</button>
<button className="primary-btn">Confirmar decisión</button>
</div>
</form>
</div>}</div>
</main>
</div>}

function UsersAdmin(){

 type AdminUser={idUsuario:number;correo:string;rol:string;activo:boolean};

 const [users,setUsers]=useState<AdminUser[]>([]);

 const [busy,setBusy]=useState(false);

 const [query,setQuery]=useState("");

 const [editing,setEditing]=useState<AdminUser|null>(null);

 const [modal,setModal]=useState(false);

 const [form,setForm]=useState({correo:"",password:"",rol:"ALUMNO",activo:true});

 const refresh=useCallback(async()=>{setBusy(true);
  try {const {data}=await api.get("/usuarios");setUsers(normalizeList<AdminUser>(data));}
  catch {toast.error("No se pudieron cargar los usuarios");}
  finally {setBusy(false)}},[]);

 useEffect(()=>{void refresh()},[refresh]);

 function openCreate(){setEditing(null);setForm({correo:"",password:"",rol:"ALUMNO",activo:true});setModal(true)}

function openEdit(u:AdminUser){setEditing(u);setForm({correo:u.correo,password:"",rol:u.rol,activo:u.activo});setModal(true)}

async function save(e:React.FormEvent<HTMLFormElement>){e.preventDefault();if(!editing&&!form.password.trim()){toast.error("La contraseña es obligatoria para crear usuarios");return}setBusy(true);
  try {const payload:{correo:string;password?:string;rol:string;activo:boolean}={correo:form.correo.trim(),rol:form.rol,activo:form.activo};if(form.password.trim())payload.password=form.password;if(editing)await api.put(`/usuarios/${editing.idUsuario}`,payload);else await api.post("/usuarios",payload);
      toast.success(editing?"Usuario actualizado":"Usuario creado");setModal(false);
      await refresh()}catch(err){toast.error("No se pudo guardar el usuario. Comprueba que el correo no esté registrado y que el backend esté activo.")}
  finally {setBusy(false)}}

async function remove(u:AdminUser){if(!window.confirm(`¿Eliminar al usuario ${u.correo}?`))return;setBusy(true);
  try {await api.delete(`/usuarios/${u.idUsuario}`);
      toast.success("Usuario eliminado");
      await refresh()}
  catch {toast.error("No se pudo eliminar. Puede tener registros relacionados.")}
  finally {setBusy(false)}}

 const visible=users.filter(u=>`${u.correo} ${u.rol}`.toLowerCase().includes(query.toLowerCase()));

 return <section className="panel" style={{maxWidth:1100}}>
<div className="section-head" style={{marginTop:0}}>
<div>
<span className="chip green">ADMINISTRACIÓN</span>
<h3 style={{marginTop:10}}>Gestión de usuarios</h3>
<p>Crea cuentas, cambia roles, actualiza contraseñas y elimina usuarios.</p>
</div>
<button className="primary-btn" onClick={openCreate}>＋ Crear usuario</button>
</div>
<input className="field" style={{maxWidth:420,marginBottom:14}} placeholder="Buscar por correo o rol…" value={query} onChange={e=>setQuery(e.target.value)}/>
<div className="table-wrap">{busy?<div className="empty">Procesando…</div>:visible.length===0?<div className="empty">No hay usuarios para mostrar.</div>:<table>
<thead>
<tr>
<th>ID</th>
<th>Correo</th>
<th>Tipo de usuario</th>
<th>Estado</th>
<th>Acciones</th>
</tr>
</thead>
<tbody>{visible.map(u=>
<tr key={u.idUsuario}>
<td>{u.idUsuario}</td>
<td>{u.correo}</td>
<td>
<span className="chip">{u.rol}</span>
</td>
<td>
<span className={`chip ${u.activo?"green":"amber"}`}>{u.activo?"Activo":"Inactivo"}</span>
</td>
<td>
<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
<button className="light-btn" onClick={()=>openEdit(u)}>Modificar</button>
<button className="light-btn" onClick={()=>void remove(u)}>Eliminar</button>
</div>
</td>
</tr>)}</tbody>
</table>}</div>{modal&&<div style={{position:"fixed",inset:0,background:"#0c173a88",zIndex:50,display:"grid",placeItems:"center",padding:16}}>
<form className="panel" style={{width:"min(520px,100%)",maxHeight:"90vh",overflowY:"auto"}} onSubmit={save}>
<div className="section-head" style={{marginTop:0}}>
<div>
<h3>{editing?"Modificar usuario":"Crear usuario"}</h3>
<p>La contraseña se guarda cifrada en el backend.</p>
</div>
<button type="button" className="light-btn" onClick={()=>setModal(false)}>Cerrar ✕</button>
</div>
<label className="form-label">Correo electrónico *</label>
<input className="field" type="email" required value={form.correo} onChange={e=>setForm({...form,correo:e.target.value})} placeholder="usuario@ejemplo.com"/>
<label className="form-label" style={{display:"block",marginTop:14}}>Contraseña {editing?"(dejar vacía para conservarla)":"*"}</label>
<input className="field" type="password" minLength={8} required={!editing} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder={editing?"Nueva contraseña opcional":"Mínimo 8 caracteres"}/>
<label className="form-label" style={{display:"block",marginTop:14}}>Tipo de usuario *</label>
<select className="field" value={form.rol} onChange={e=>setForm({...form,rol:e.target.value})}>
<option value="ADMIN">Administrador</option>
<option value="ALUMNO">Alumno</option>
<option value="EMPRESA">Empresa</option>
<option value="ASESOR">Asesor académico</option>
</select>
<label style={{display:"flex",alignItems:"center",gap:8,marginTop:14,fontSize:13}}>
<input type="checkbox" checked={form.activo} onChange={e=>setForm({...form,activo:e.target.checked})}/> Usuario activo</label>
<div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:22}}>
<button type="button" className="light-btn" onClick={()=>setModal(false)}>Cancelar</button>
<button className="primary-btn" disabled={busy}>{busy?"Guardando…":"Guardar usuario"}</button>
</div>
</form>
</div>}</section>

}

function ProjectCard({project,apply,manage}:{project:Project;apply?:()=>void;manage?:{edit:()=>void;remove:()=>void}}){return <article className="project-card">
<div className="project-top">
<div>
<h4>{project.titulo||"Proyecto sin título"}</h4>
<div className="muted">{project.empresa?.razonSocial||"Empresa vinculada"}</div>
</div>
<span className={`chip ${String(project.estado||"").includes("PUBLIC")?"green":"gray"}`}>{project.estado||"Registrado"}</span>
</div>
<p className="muted" style={{margin:"12px 0 0"}}>{project.descripcion||"Consulta los detalles de esta oportunidad de residencia profesional."}</p>
<div className="project-meta">
<span>♧ {project.cupoAlumnos??"—"} plazas</span>
<span>⌁ {project.tecnologiasRequeridas||"Tecnologías por definir"}</span>
<span>▦ {project.fechaPublicacion||"Fecha no disponible"}</span>
</div>{apply&&<button className="primary-btn" onClick={apply}>Postularme →</button>}{manage&&<div style={{display:"flex",gap:8,marginTop:12}}>
<button className="light-btn" onClick={manage.edit}>Modificar proyecto</button>
<button className="light-btn" onClick={manage.remove}>Eliminar proyecto</button>
</div>}</article>}
