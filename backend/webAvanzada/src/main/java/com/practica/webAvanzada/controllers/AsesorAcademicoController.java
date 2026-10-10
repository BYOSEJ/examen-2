package com.practica.webAvanzada.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.practica.webAvanzada.models.AsesorAcademico;
import com.practica.webAvanzada.services.AsesorAcademicoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/asesores")
@RequiredArgsConstructor
public class AsesorAcademicoController {

    private final AsesorAcademicoService service;

    @PostMapping
    public ResponseEntity<AsesorAcademico> crear(@RequestBody AsesorAcademico asesor) {
        return new ResponseEntity<>(service.guardar(asesor), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AsesorAcademico>> obtenerTodos() {
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AsesorAcademico> obtenerPorId(@PathVariable Long id) {

        Optional<AsesorAcademico> asesor = service.obtenerPorId(id);

        return asesor.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<AsesorAcademico> actualizar(
            @PathVariable Long id,
            @RequestBody AsesorAcademico asesor) {

        AsesorAcademico actualizado = service.actualizar(id, asesor);

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