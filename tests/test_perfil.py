class TestPerfil:
    def test_obtener_perfil(self, api, usuario_demo):
        resp = api.get(f"/api/perfil/{usuario_demo['id']}")
        assert resp.status_code == 200
        data = resp.json()
        assert "nombre" in data
        assert "email" in data
        assert "km_recorridos" in data
        assert "nivel_ciclista" in data
        assert "rol" in data
        assert "favoritos" in data
        assert "historial" in data

    def test_perfil_no_existente(self, api):
        resp = api.get("/api/perfil/9999")
        assert resp.status_code == 404

    def test_actualizar_perfil(self, api, usuario_test):
        resp = api.put(
            f"/api/perfil/{usuario_test['id']}",
            params={"nombre": "Nombre Actualizado", "telefono": "3216549870"}
        )
        assert resp.status_code == 200
        assert "actualizado" in resp.json()["message"].lower()

        resp_perfil = api.get(f"/api/perfil/{usuario_test['id']}")
        assert resp_perfil.json()["nombre"] == "Nombre Actualizado"

    def test_cambiar_password(self, api, usuario_test):
        resp = api.put(
            f"/api/perfil/{usuario_test['id']}/password",
            params={"password_actual": "123456", "password_nueva": "654321"}
        )
        assert resp.status_code == 200
        assert "actualizada" in resp.json()["message"].lower()

        api.put(
            f"/api/perfil/{usuario_test['id']}/password",
            params={"password_actual": "654321", "password_nueva": "123456"}
        )

    def test_cambiar_password_incorrecta(self, api, usuario_demo):
        resp = api.put(
            f"/api/perfil/{usuario_demo['id']}/password",
            params={"password_actual": "wrongpass", "password_nueva": "123456"}
        )
        assert resp.status_code == 401

    def test_perfil_contiene_favoritos(self, api, usuario_demo):
        resp = api.get(f"/api/perfil/{usuario_demo['id']}")
        assert isinstance(resp.json()["favoritos"], list)

    def test_perfil_contiene_historial(self, api, usuario_demo):
        resp = api.get(f"/api/perfil/{usuario_demo['id']}")
        assert isinstance(resp.json()["historial"], list)
