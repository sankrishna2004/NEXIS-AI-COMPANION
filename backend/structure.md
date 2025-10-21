backend/
│── app.py               # Entry point
│── config.py            # Environment variables, settings
│── db.py                # Database connection (SQLAlchemy + Postgres)
│── models.py            # SQLAlchemy models
│── schemas.py           # Pydantic schemas (request/response validation)
│
├── routes/              # All API endpoints grouped
│   ├── auth.py          # User registration, login
│   ├── analyze.py       # Text, voice, face, multimodal endpoints
│   ├── dashboard.py     # Fetch mood history, stats
│   ├── alerts.py        # Caregiver alerts
│
├── services/            # Business logic (keeps routes clean)
│   ├── text_service.py
│   ├── voice_service.py
│   ├── face_service.py
│   ├── fusion_service.py
│   ├── recommendation_service.py
│
├── utils/               # Helper functions
│   ├── jwt.py           # JWT auth utils
│   ├── emailer.py       # Send alerts/notifications
│   ├── preprocessing.py # Common text/voice/face preprocessing
│
├── models_ai/           # AI model loading and inference
│   ├── text_model.py
│   ├── voice_model.py
│   ├── face_model.py
│   ├── fusion_model.py
│
└── migrations/          # Alembic migrations for DB
