class TestResenas:
    def test_crear_resena_ruta(self, api, usuario_test):
        resp = api.post("/api/resenas", json={
            "id_usuario": usuario_test["id"],
            "id_ruta": 1,
            "calificacion": 5,
            "comentario": "Excelente ruta de prueba"
        })
        assert resp.status_code == 200
        assert "guardada" in resp.json()["message"].lower()

        api.put(
            f"/api/perfil/{usuario_test['id']}/password",
            params={"password_actual": "123456", "password_nueva": "123456"}
        )

    def test_crear_resena_comercio(self, api, usuario_test):
        resp = api.post("/api/resenas", json={
            "id_usuario": usuario_test["id"],
            "id_comercio": 1,
            "calificacion": 4,
            "comentario": "Buen comercio de prueba"
        })
        assert resp.status_code == 200
        assert "guardada" in resp.json()["message"].lower()

    def test_resena_duplicada_ruta(self, api, usuario_test):
        api.post("/api/resenas", json={
            "id_usuario": usuario_test["id"],
            "id_ruta": 2,
            "calificacion": 4,
            "comentario": "Primera reseña"
        })
        resp = api.post("/api/resenas", json={
            "id_usuario": usuario_test["id"],
            "id_ruta": 2,
            "calificacion": 3,
            "comentario": "Segunda reseña"
        })
        assert resp.status_code == 400
        assert "ya calificaste" in resp.json()["detail"].lower()

    def test_resena_sin_ruta_ni_comercio(self, api, usuario_test):
        resp = api.post("/api/resenas", json={
            "id_usuario": usuario_test["id"],
            "calificacion": 5,
            "comentario": "Sin target"
        })
        assert resp.status_code in [400, 500]

    def test_resena_sin_usuario(self, api):
        resp = api.post("/api/resenas", json={
            "id_ruta": 1,
            "calificacion": 5,
            "comentario": "Sin usuario"
        })
        assert resp.status_code == 400

    def test_resena_sin_calificacion(self, api, usuario_test):
        resp = api.post("/api/resenas", json={
            "id_usuario": usuario_test["id"],
            "id_ruta": 1,
            "comentario": "Sin calificación"
        })
        assert resp.status_code == 400
