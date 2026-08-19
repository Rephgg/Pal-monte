import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from main import app

client = TestClient(app)


@pytest.fixture(scope="session")
def api():
    return client


@pytest.fixture(scope="session")
def usuario_demo():
    """Usuario demo pre-cargado en la BD."""
    return {"id": 1, "email": "carlos@email.com", "password": "123456"}


@pytest.fixture(scope="session")
def usuario_demo_2():
    """Segundo usuario demo."""
    return {"id": 2, "email": "mariana@email.com", "password": "123456"}


@pytest.fixture
def usuario_test(api):
    """Crea un usuario temporal para la prueba y lo elimina al final."""
    import uuid
    email = f"test_{uuid.uuid4().hex[:8]}@test.com"
    payload = {
        "nombre": "Test User",
        "email": email,
        "password": "123456",
        "telefono": "3000000000"
    }
    resp = api.post("/api/registro", json=payload)
    user_id = resp.json().get("id")
    yield {"id": user_id, "email": email, "password": "123456", "resp": resp}
    if user_id:
        api.delete(f"/api/admin/usuarios/{user_id}")
