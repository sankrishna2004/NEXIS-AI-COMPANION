from fastapi import FastAPI
from db import Base, engine
from routes import auth, checkin, survey
import models   # import models so tables are registered
from fastapi.middleware.cors import CORSMiddleware
# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nexis Backend", version="1.0.0")

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Allow the origins listed above
    allow_credentials=True,      # Allow cookies
    allow_methods=["*"],         # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],         # Allow all headers
)

app.include_router(auth.router)
app.include_router(checkin.router)
app.include_router(survey.router)

@app.get("/")
def root():
    return {"message": "Welcome to Nexis Backend"}
