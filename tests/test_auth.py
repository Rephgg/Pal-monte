class TestAuth:
    def test_registro_exitoso(self, api, usuario_test):
        assert usuario_test["resp"].status_code == 200
        data = usuario_test["resp"].json()
        assert "id" in data
        assert data["message"] == "Usuario registrado exitosamente"

    def test_registro_email_duplicado(self, api):
        payload = {
            "nombre": "Dup Test",
            "email": "carlos@email.com",
            "password": "123456",
            "telefono": "3000000000"
        }
        resp = api.post("/api/registro", json=payload)
        assert resp.status_code == 400
        assert "ya registrado" in resp.json()["detail"].lower()

    def test_registro_email_invalido(self, api):
        payload = {
            "nombre": "Test",
            "email": "no-es-email",
            "password": "123456"
        }
        resp = api.post("/api/registro", json=payload)
        assert resp.status_code in [400, 422]

    def test_registro_password_corta(self, api):
        payload = {
            "nombre": "Test",
            "email": "short@test.com",
            "password": "123"
        }
        resp = api.post("/api/registro", json=payload)
        assert resp.status_code in [400, 422]

    def test_login_exitoso(self, api, usuario_demo):
        payload = {"email": usuario_demo["email"], "password": usuario_demo["password"]}
        resp = api.post("/api/login", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert "id" in data
        assert "nombre" in data
        assert "email" in data
        assert "nivel" in data
        assert "rol" in data

    def test_login_contrasena_incorrecta(self, api):
        payload = {"email": "carlos@email.com", "password": "wrongpassword"}
        resp = api.post("/api/login", json=payload)
        assert resp.status_code == 401
        assert "credenciales incorrectas" in resp.json()["detail"].lower()

    def test_login_email_inexistente(self, api):
        payload = {"email": "noexiste@test.com", "password": "123456"}
        resp = api.post("/api/login", json=payload)
        assert resp.status_code == 401

    def test_login_campos_vacios(self, api):
        resp = api.post("/api/login", json={"email": "", "password": ""})
        assert resp.status_code in [400, 401, 422]
