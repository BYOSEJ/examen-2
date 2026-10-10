import axios from "axios";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
export const ML_URL = process.env.NEXT_PUBLIC_ML_URL || "http://127.0.0.1:8000";
export const api = axios.create({ baseURL: API_URL, headers: { "Content-Type": "application/json" }, timeout: 12000 });
api.interceptors.request.use((config) => { if (typeof window !== "undefined") { const token = localStorage.getItem("siger_token"); if (token) config.headers.Authorization = `Bearer ${token}`; } return config; });
export type Role = "ALUMNO" | "EMPRESA" | "ASESOR" | "ASESOR_ACADEMICO" | "ADMIN";
export type User = { idUsuario?: number; correo: string; password?: string; rol: Role; activo?: boolean; nombreCompleto?: string };
export type Project = { idProyecto?: number; titulo: string; descripcion?: string; objetivo?: string; tecnologiasRequeridas?: string; cupoAlumnos?: number; estado?: string; fechaPublicacion?: string; empresa?: {idEmpresa?:number; razonSocial?:string} };
export function normalizeList<T>(data: unknown): T[] { if (Array.isArray(data)) return data as T[]; if (data && typeof data === "object" && "content" in data && Array.isArray((data as {content:unknown}).content)) return (data as {content:T[]}).content; return []; }
