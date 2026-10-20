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

    def test_actualizar_usuario_admin(self, api, usuario_test):
        resp = api.put(
            f"/api/admin/usuarios/{usuario_test['id']}",
            json={
                "nombre": "Admin Editado",
                "telefono": "3000000111",
                "nivel": "avanzado",
                "rol": "ciclista"
            }
        )
        assert resp.status_code == 200
        assert "actualizado" in resp.json()["message"].lower()

    def test_actualizar_usuario_admin_no_existente(self, api):
        resp = api.put(
            "/api/admin/usuarios/9999",
            json={"nombre": "No existe"}
        )
        assert resp.status_code == 404


class TestAdminEventos:
    def test_listar_eventos_admin(self, api):
        resp = api.get("/api/admin/eventos")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_actualizar_evento(self, api):
        resp_create = api.post(
            "/api/eventos",
            params={"organizador_id": 1},
            json={
                "titulo": "Evento Update",
                "descripcion": "Para actualizar",
                "fecha": "2027-01-15",
                "hora_inicio": "07:00",
                "lugar": "Parque Principal",
                "cupo_max": 30
            }
        )
        evento_id = resp_create.json()["id"]

        resp = api.put(f"/api/admin/eventos/{evento_id}", json={
            "titulo": "Evento Actualizado",
            "descripcion": "Actualizado",
            "fecha": "2027-01-20",
            "hora_inicio": "08:00",
            "lugar": "Plaza Central",
            "cupo_max": 40
        })
        assert resp.status_code == 200
        assert "actualizado" in resp.json()["message"].lower()

        api.delete(f"/api/admin/eventos/{evento_id}")

    def test_eliminar_evento(self, api):
        resp_create = api.post(
            "/api/eventos",
            params={"organizador_id": 1},
            json={
                "titulo": "Evento Delete",
                "descripcion": "Para eliminar",
                "fecha": "2027-02-10",
                "hora_inicio": "09:00",
                "lugar": "Ciclovía",
                "cupo_max": 20
            }
        )
        evento_id = resp_create.json()["id"]

        resp = api.delete(f"/api/admin/eventos/{evento_id}")
        assert resp.status_code == 200
        assert "eliminado" in resp.json()["message"].lower()

        resp_get = api.get(f"/api/eventos/{evento_id}")
        assert resp_get.status_code == 404
