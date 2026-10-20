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

    def test_actualizar_resena(self, api, usuario_test):
        api.post("/api/resenas", json={
            "id_usuario": usuario_test["id"],
            "id_ruta": 1,
            "calificacion": 4,
            "comentario": "Reseña a editar"
        })
        detalle = api.get("/api/rutas/1").json()
        resena_id = detalle["reseñas"][0]["id"]

        resp = api.put(f"/api/resenas/{resena_id}", json={
            "calificacion": 5,
            "comentario": "Reseña editada"
        })
        assert resp.status_code == 200
        assert "actualizada" in resp.json()["message"].lower()

        api.delete(f"/api/resenas/{resena_id}")

    def test_actualizar_resena_no_existente(self, api):
        resp = api.put("/api/resenas/9999", json={
            "calificacion": 5,
            "comentario": "No existe"
        })
        assert resp.status_code == 404

    def test_eliminar_resena(self, api, usuario_test):
        api.post("/api/resenas", json={
            "id_usuario": usuario_test["id"],
            "id_ruta": 3,
            "calificacion": 3,
            "comentario": "Reseña a eliminar"
        })
        detalle = api.get("/api/rutas/3").json()
        resena_id = detalle["reseñas"][0]["id"]

        resp = api.delete(f"/api/resenas/{resena_id}")
        assert resp.status_code == 200
        assert "eliminada" in resp.json()["message"].lower()
