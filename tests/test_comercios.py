class TestComercios:
    def test_listar_comercios(self, api):
        resp = api.get("/api/comercios")
        assert resp.status_code == 200
        comercios = resp.json()
        assert isinstance(comercios, list)
        assert len(comercios) >= 6

    def test_listar_comercios_campos(self, api):
        resp = api.get("/api/comercios")
        comercio = resp.json()[0]
        required = ["id", "nombre", "tipo", "calificacion"]
        for field in required:
            assert field in comercio

    def test_filtrar_comercios_tipo_taller(self, api):
        resp = api.get("/api/comercios?tipo=taller")
        assert resp.status_code == 200
        for c in resp.json():
            assert c["tipo"] == "taller"

    def test_filtrar_comercios_tipo_cafe(self, api):
        resp = api.get("/api/comercios?tipo=cafe")
        assert resp.status_code == 200
        for c in resp.json():
            assert c["tipo"] == "cafe"

    def test_filtrar_comercios_tipo_tienda(self, api):
        resp = api.get("/api/comercios?tipo=tienda")
        assert resp.status_code == 200
        for c in resp.json():
            assert c["tipo"] == "tienda"

    def test_filtrar_comercios_tipo_restaurante(self, api):
        resp = api.get("/api/comercios?tipo=restaurante")
        assert resp.status_code == 200
        for c in resp.json():
            assert c["tipo"] == "restaurante"

    def test_filtrar_comercios_todos(self, api):
        resp = api.get("/api/comercios?tipo=todos")
        assert resp.status_code == 200
        assert len(resp.json()) >= 6

    def test_detalle_comercio(self, api):
        resp = api.get("/api/comercios/1")
        assert resp.status_code == 200
        data = resp.json()
        assert data["id"] == 1
        assert "nombre" in data
        assert "tipo" in data
        assert "reseñas" in data
        assert "promedio_calificacion" in data

    def test_detalle_comercio_no_existente(self, api):
        resp = api.get("/api/comercios/9999")
        assert resp.status_code == 404
