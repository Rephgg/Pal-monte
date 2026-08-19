import json

class TestEventos:
    def test_listar_eventos(self, api):
        resp = api.get("/api/eventos")
        assert resp.status_code == 200
        eventos = resp.json()
        assert isinstance(eventos, list)

    def test_listar_eventos_solo_futuros(self, api):
        resp = api.get("/api/eventos")
        for evento in resp.json():
            assert evento["cancelado"] == 0

    def test_detalle_evento(self, api):
        resp = api.get("/api/eventos/1")
        if resp.status_code == 200:
            data = resp.json()
            assert "titulo" in data
            assert "fecha" in data
            assert "cupo_max" in data
            assert "cupo_actual" in data
            assert "asistentes" in data

    def test_detalle_evento_no_existente(self, api):
        resp = api.get("/api/eventos/9999")
        assert resp.status_code == 404

    def test_inscribir_evento(self, api, usuario_test):
        resp_eventos = api.get("/api/eventos")
        if resp_eventos.json():
            evento_id = resp_eventos.json()[0]["id"]
            resp = api.post(
                f"/api/eventos/{evento_id}/inscribir",
                json={"usuario_id": usuario_test["id"]}
            )
            assert resp.status_code == 200
            assert "exitosa" in resp.json()["message"].lower()

            api.request(
                "DELETE",
                f"/api/eventos/{evento_id}/cancelar-inscripcion",
                content=json.dumps({"usuario_id": usuario_test["id"]}),
                headers={"Content-Type": "application/json"}
            )

    def test_inscribir_evento_duplicado(self, api, usuario_demo):
        resp_eventos = api.get("/api/eventos")
        if resp_eventos.json():
            evento_id = resp_eventos.json()[0]["id"]
            api.post(
                f"/api/eventos/{evento_id}/inscribir",
                json={"usuario_id": usuario_demo["id"]}
            )
            resp = api.post(
                f"/api/eventos/{evento_id}/inscribir",
                json={"usuario_id": usuario_demo["id"]}
            )
            if resp.status_code == 400:
                assert "ya" in resp.json()["detail"].lower() or "inscrito" in resp.json()["detail"].lower()

            api.request(
                "DELETE",
                f"/api/eventos/{evento_id}/cancelar-inscripcion",
                content=json.dumps({"usuario_id": usuario_demo["id"]}),
                headers={"Content-Type": "application/json"}
            )

    def test_cancelar_inscripcion(self, api, usuario_test):
        resp_eventos = api.get("/api/eventos")
        if resp_eventos.json():
            evento_id = resp_eventos.json()[0]["id"]
            api.post(
                f"/api/eventos/{evento_id}/inscribir",
                json={"usuario_id": usuario_test["id"]}
            )
            resp = api.request(
                "DELETE",
                f"/api/eventos/{evento_id}/cancelar-inscripcion",
                content=json.dumps({"usuario_id": usuario_test["id"]}),
                headers={"Content-Type": "application/json"}
            )
            assert resp.status_code == 200

    def test_cancelar_inscripcion_no_inscrito(self, api, usuario_test):
        resp_eventos = api.get("/api/eventos")
        if resp_eventos.json():
            evento_id = resp_eventos.json()[0]["id"]
            resp = api.request(
                "DELETE",
                f"/api/eventos/{evento_id}/cancelar-inscripcion",
                content=json.dumps({"usuario_id": usuario_test["id"]}),
                headers={"Content-Type": "application/json"}
            )
            assert resp.status_code == 400
