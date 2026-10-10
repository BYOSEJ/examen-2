package com.practica.webAvanzada.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.practica.webAvanzada.models.ProyectoResidencia;
import com.practica.webAvanzada.services.ProyectoResidenciaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/proyectos")
@RequiredArgsConstructor
public class ProyectoResidenciaController {

    private final ProyectoResidenciaService service;

    @PostMapping
    public ResponseEntity<ProyectoResidencia> crear(
            @RequestBody ProyectoResidencia proyecto) {

        return new ResponseEntity<>(service.guardar(proyecto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProyectoResidencia>> obtenerTodos() {
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProyectoResidencia> obtenerPorId(@PathVariable Long id) {

        Optional<ProyectoResidencia> proyecto = service.obtenerPorId(id);

        return proyecto.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProyectoResidencia> actualizar(
            @PathVariable Long id,
            @RequestBody ProyectoResidencia proyecto) {

        ProyectoResidencia actualizado = service.actualizar(id, proyecto);

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