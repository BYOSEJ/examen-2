package com.practica.webAvanzada.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.practica.webAvanzada.models.ExpedienteDocumento;
import com.practica.webAvanzada.services.ExpedienteDocumentoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/documentos")
@RequiredArgsConstructor
public class ExpedienteDocumentoController {

    private final ExpedienteDocumentoService service;

    @PostMapping
    public ResponseEntity<ExpedienteDocumento> crear(
            @RequestBody ExpedienteDocumento documento) {

        return new ResponseEntity<>(service.guardar(documento), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ExpedienteDocumento>> obtenerTodos() {
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpedienteDocumento> obtenerPorId(@PathVariable Long id) {

        Optional<ExpedienteDocumento> documento = service.obtenerPorId(id);

        return documento.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpedienteDocumento> actualizar(
            @PathVariable Long id,
            @RequestBody ExpedienteDocumento documento) {

        ExpedienteDocumento actualizado = service.actualizar(id, documento);

        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {

        if (service.obtenerPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        service.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}