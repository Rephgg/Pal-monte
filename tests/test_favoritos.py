class TestFavoritos:
    def test_agregar_favorito(self, api, usuario_test):
        resp = api.post(
            "/api/favoritos",
            params={"usuario_id": usuario_test["id"], "ruta_id": 1}
        )
        assert resp.status_code == 200
        assert "agregado" in resp.json()["message"].lower()

        api.delete(
            "/api/favoritos",
            params={"usuario_id": usuario_test["id"], "ruta_id": 1}
        )

    def test_agregar_favorito_duplicado(self, api, usuario_test):
        api.post(
            "/api/favoritos",
            params={"usuario_id": usuario_test["id"], "ruta_id": 1}
        )
        resp = api.post(
            "/api/favoritos",
            params={"usuario_id": usuario_test["id"], "ruta_id": 1}
        )
        assert resp.status_code == 400

        api.delete(
            "/api/favoritos",
            params={"usuario_id": usuario_test["id"], "ruta_id": 1}
        )

    def test_eliminar_favorito(self, api, usuario_test):
        api.post(
            "/api/favoritos",
            params={"usuario_id": usuario_test["id"], "ruta_id": 1}
        )
        resp = api.delete(
            "/api/favoritos",
            params={"usuario_id": usuario_test["id"], "ruta_id": 1}
        )
        assert resp.status_code == 200
        assert "eliminado" in resp.json()["message"].lower()

    def test_favorito_aparece_en_perfil(self, api, usuario_test):
        api.post(
            "/api/favoritos",
            params={"usuario_id": usuario_test["id"], "ruta_id": 1}
        )
        resp = api.get(f"/api/perfil/{usuario_test['id']}")
        favoritos = resp.json()["favoritos"]
        ids = [f["id"] for f in favoritos]
        assert 1 in ids

        api.delete(
            "/api/favoritos",
            params={"usuario_id": usuario_test["id"], "ruta_id": 1}
        )
