class TestRutas:
    def test_listar_rutas(self, api):
        resp = api.get("/api/rutas")
        assert resp.status_code == 200
        rutas = resp.json()
        assert isinstance(rutas, list)
        assert len(rutas) >= 6

    def test_listar_rutas_campos(self, api):
        resp = api.get("/api/rutas")
        ruta = resp.json()[0]
        required = ["id", "nombre", "distancia_km", "dificultad"]
        for field in required:
            assert field in ruta

    def test_filtrar_rutas_dificultad_baja(self, api):
        resp = api.get("/api/rutas?dificultad=baja")
        assert resp.status_code == 200
        rutas = resp.json()
        for ruta in rutas:
            assert ruta["dificultad"] == "baja"

    def test_filtrar_rutas_dificultad_alta(self, api):
        resp = api.get("/api/rutas?dificultad=alta")
        assert resp.status_code == 200
        rutas = resp.json()
        for ruta in rutas:
            assert ruta["dificultad"] == "alta"

    def test_filtrar_rutas_todas(self, api):
        resp = api.get("/api/rutas?dificultad=todas")
        assert resp.status_code == 200
        assert len(resp.json()) >= 6

    def test_detalle_ruta(self, api):
        resp = api.get("/api/rutas/1")
        assert resp.status_code == 200
        data = resp.json()
        assert data["id"] == 1
        assert "nombre" in data
        assert "distancia_km" in data
        assert "reseñas" in data
        assert "promedio_calificacion" in data

    def test_detalle_ruta_no_existente(self, api):
        resp = api.get("/api/rutas/9999")
        assert resp.status_code == 404
