class TestRutasRealizadas:
    def test_registrar_ruta_realizada(self, api, usuario_test):
        resp = api.post(
            "/api/rutas-realizadas",
            params={
                "usuario_id": usuario_test["id"],
                "ruta_id": 1,
                "tiempo_real": 1.5,
                "observaciones": "Ruta completada en prueba"
            }
        )
        assert resp.status_code == 200
        assert "completada" in resp.json()["message"].lower()
        assert "km_agregados" in resp.json()

    def test_ruta_realizada_duplicada_mismo_dia(self, api, usuario_test):
        api.post(
            "/api/rutas-realizadas",
            params={
                "usuario_id": usuario_test["id"],
                "ruta_id": 3,
                "tiempo_real": 2.0
            }
        )
        resp = api.post(
            "/api/rutas-realizadas",
            params={
                "usuario_id": usuario_test["id"],
                "ruta_id": 3,
                "tiempo_real": 2.5
            }
        )
        assert resp.status_code == 400
        assert "ya registraste" in resp.json()["detail"].lower()

    def test_ruta_realizada_actualiza_km_perfil(self, api, usuario_test):
        resp_perfil = api.get(f"/api/perfil/{usuario_test['id']}")
        km_antes = float(resp_perfil.json()["km_recorridos"])

        api.post(
            "/api/rutas-realizadas",
            params={
                "usuario_id": usuario_test["id"],
                "ruta_id": 4,
                "tiempo_real": 1.0
            }
        )

        resp_perfil_2 = api.get(f"/api/perfil/{usuario_test['id']}")
        km_despues = float(resp_perfil_2.json()["km_recorridos"])
        assert km_despues > km_antes

    def test_ruta_realizada_aparece_en_historial(self, api, usuario_test):
        api.post(
            "/api/rutas-realizadas",
            params={
                "usuario_id": usuario_test["id"],
                "ruta_id": 5,
                "tiempo_real": 1.2,
                "observaciones": "Historial test"
            }
        )
        resp = api.get(f"/api/perfil/{usuario_test['id']}")
        historial = resp.json()["historial"]
        assert len(historial) > 0
