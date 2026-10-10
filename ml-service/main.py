from typing import List, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.tree import DecisionTreeClassifier
from sklearn.pipeline import make_pipeline

app = FastAPI(title="SIGER Machine Learning API", version="1.0.0", description="Clasificador introductorio de compatibilidad alumno-proyecto")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Dataset didáctico de ejemplo: para un proyecto real debe sustituirse por datos anonimizados y etiquetados.
TRAIN_TEXTS = [
 "python pandas machine learning datos estadistica", "java spring boot api sql postgresql",
 "react typescript javascript css frontend", "arduino esp32 sensores iot mqtt",
 "python sql dashboards power bi datos", "java sql backend microservicios",
 "react nextjs typescript ux frontend", "python opencv vision computacional",
 "redes linux seguridad servidores", "sql postgres java spring api",
 "iot esp32 sensores automatizacion", "javascript react html css",
 "python ciencia datos scikit learn", "java testing junit backend",
 "linux redes cloud docker", "python api fastapi modelos predictivos"
]
TRAIN_LABELS = [1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1]
model = make_pipeline(TfidfVectorizer(ngram_range=(1,2)), DecisionTreeClassifier(max_depth=5, random_state=42))
model.fit(TRAIN_TEXTS, TRAIN_LABELS)

class ProjectInput(BaseModel):
    idProyecto: Optional[int] = None
    titulo: str = "Proyecto de residencia"
    tecnologiasRequeridas: Optional[str] = ""
    descripcion: Optional[str] = ""

class RecommendationRequest(BaseModel):
    skills: str = Field(min_length=1, description="Habilidades del alumno separadas por comas")
    technologies: List[ProjectInput] = []

@app.get("/")
def root(): return {"service":"SIGER ML API", "docs":"/docs", "health":"/health"}

@app.get("/health")
def health(): return {"status":"ok", "model":"DecisionTreeClassifier + TF-IDF", "training_samples":len(TRAIN_TEXTS)}

@app.post("/predict")
def predict(payload: RecommendationRequest):
    if not payload.technologies:
        return {"message":"No hay proyectos para evaluar", "recommendations":[]}
    ranked=[]
    for p in payload.technologies:
        text=f"{p.titulo} {p.tecnologiasRequeridas or ''} {p.descripcion or ''}"
        # Similaridad léxica sobre texto de habilidades y proyecto, transformada a una puntuación interpretable.
        vec=model.named_steps["tfidfvectorizer"]
        skill_vec=vec.transform([payload.skills])
        project_vec=vec.transform([text])
        cosine=(skill_vec @ project_vec.T).toarray()[0][0]
        predicted=int(model.predict([text])[0])
        score=round(min(99, max(5, cosine*75 + predicted*20)), 1)
        ranked.append({"idProyecto":p.idProyecto,"titulo":p.titulo,"compatibility_score":score,"predicted_relevant":bool(predicted),"matched_text_score":round(float(cosine),3)})
    ranked.sort(key=lambda x:x["compatibility_score"], reverse=True)
    return {"message":"Proyectos ordenados por compatibilidad estimada", "model":"DecisionTreeClassifier + TF-IDF (demo educativa)", "recommendations":ranked}

@app.post("/recommendations")
def recommendations(payload: RecommendationRequest):
    return predict(payload)
