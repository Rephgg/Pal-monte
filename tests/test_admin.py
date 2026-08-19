class TestAdminRutas:
    def test_crear_ruta(self, api):
        resp = api.post("/api/admin/rutas", json={
            "nombre": "Ruta Test Admin",
            "descripcion": "Ruta creada para pruebas",
            "distancia_km": 15.5,
            "dificultad": "media",
            "tipo_bici": "montaña",
            "tiempo_estimado": 1.5,
            "coordenadas": "4.4419,-75.2313",
            "zona": "Centro",
            "elevacion": 500,
            "superficie": "pavimento"
        })
        assert resp.status_code == 200
        ruta_id = resp.json()["id"]

        api.delete(f"/api/admin/rutas/{ruta_id}")

    def test_actualizar_ruta(self, api):
        resp_create = api.post("/api/admin/rutas", json={
            "nombre": "Ruta Update Test",
            "descripcion": "Para actualizar",
            "distancia_km": 10.0,
            "dificultad": "baja",
            "tipo_bici": "ruta",
            "tiempo_estimado": 1.0,
            "coordenadas": "4.4419,-75.2313",
            "zona": "Norte",
            "elevacion": 200,
            "superficie": "pavimento"
        })
        ruta_id = resp_create.json()["id"]

        resp = api.put(f"/api/admin/rutas/{ruta_id}", json={
            "nombre": "Ruta Actualizada",
            "descripcion": "Actualizada",
            "distancia_km": 20.0,
            "dificultad": "alta",
            "tipo_bici": "montaña",
            "tiempo_estimado": 2.0,
            "coordenadas": "4.4420,-75.2314",
            "zona": "Sur",
            "elevacion": 800,
            "superficie": "tierra"
        })
        assert resp.status_code == 200
        assert "actualizada" in resp.json()["message"].lower()

        api.delete(f"/api/admin/rutas/{ruta_id}")

    def test_eliminar_ruta(self, api):
        resp_create = api.post("/api/admin/rutas", json={
            "nombre": "Ruta Delete Test",
            "descripcion": "Para eliminar",
            "distancia_km": 5.0,
            "dificultad": "baja",
            "tipo_bici": "urbana",
            "tiempo_estimado": 0.5,
            "coordenadas": "4.4419,-75.2313",
            "zona": "Centro",
            "elevacion": 100,
            "superficie": "pavimento"
        })
        ruta_id = resp_create.json()["id"]

        resp = api.delete(f"/api/admin/rutas/{ruta_id}")
        assert resp.status_code == 200
        assert "eliminada" in resp.json()["message"].lower()

        resp_get = api.get(f"/api/rutas/{ruta_id}")
        assert resp_get.status_code == 404


class TestAdminComercios:
    def test_crear_comercio(self, api):
        resp = api.post("/api/admin/comercios", json={
            "nombre": "Comercio Test",
            "tipo": "cafe",
            "direccion": "Calle 1 #2-3",
            "coordenadas": "4.4419,-75.2313",
            "telefono": "3001234567",
            "horario": "8am-6pm"
        })
        assert resp.status_code == 200
        comercio_id = resp.json()["id"]

        api.delete(f"/api/admin/comercios/{comercio_id}")

    def test_actualizar_comercio(self, api):
        resp_create = api.post("/api/admin/comercios", json={
            "nombre": "Comercio Update",
            "tipo": "tienda",
            "direccion": "Calle 4 #5-6",
            "coordenadas": "4.4419,-75.2313",
            "telefono": "3009876543",
            "horario": "9am-7pm"
        })
        comercio_id = resp_create.json()["id"]

        resp = api.put(f"/api/admin/comercios/{comercio_id}", json={
            "nombre": "Comercio Actualizado",
            "tipo": "taller",
            "direccion": "Calle 7 #8-9",
            "coordenadas": "4.4420,-75.2314",
            "telefono": "3001112233",
            "horario": "10am-8pm"
        })
        assert resp.status_code == 200
        assert "actualizado" in resp.json()["message"].lower()

        api.delete(f"/api/admin/comercios/{comercio_id}")

    def test_eliminar_comercio(self, api):
        resp_create = api.post("/api/admin/comercios", json={
            "nombre": "Comercio Delete",
            "tipo": "restaurante",
            "direccion": "Calle 0 #1-2",
            "coordenadas": "4.4419,-75.2313",
            "telefono": "3005556677",
            "horario": "11am-9pm"
        })
        comercio_id = resp_create.json()["id"]

        resp = api.delete(f"/api/admin/comercios/{comercio_id}")
        assert resp.status_code == 200
        assert "eliminado" in resp.json()["message"].lower()


class TestAdminUsuarios:
    def test_listar_usuarios(self, api):
        resp = api.get("/api/admin/usuarios")
        assert resp.status_code == 200
        usuarios = resp.json()
        assert isinstance(usuarios, list)
        assert len(usuarios) >= 5

    def test_cambiar_rol(self, api, usuario_test):
        resp = api.put(
            f"/api/admin/usuarios/{usuario_test['id']}/rol",
            params={"rol": "organizador"}
        )
        assert resp.status_code == 200
        assert "actualizado" in resp.json()["message"].lower()

        api.put(
            f"/api/admin/usuarios/{usuario_test['id']}/rol",
            params={"rol": "ciclista"}
        )

    test_desactivar_usuario_no_aplica = True
