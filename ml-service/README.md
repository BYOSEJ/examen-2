# SIGER ML Service
Microservicio REST con FastAPI y scikit-learn. Incluye un clasificador DecisionTreeClassifier entrenado con un pequeño conjunto didáctico y una puntuación de coincidencia de texto para ordenar proyectos. No es un modelo de selección real ni debe utilizarse para decisiones de alto impacto.

## Ejecutar
```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
Documentación interactiva: http://127.0.0.1:8000/docs

## Ejemplo de solicitud
```json
{
  "skills": "python, java, sql, react",
  "technologies": [
    {"idProyecto": 1, "titulo": "Dashboard web", "tecnologiasRequeridas": "React, SQL, TypeScript", "descripcion": "Panel de datos"}
  ]
}
```
`POST /recommendations` o `POST /predict` devuelven proyectos ordenados. Dataset pequeño y sintético: sustituirlo por datos autorizados y evaluados para investigación más seria.
