package com.practica.webAvanzada.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.practica.webAvanzada.models.Postulacion;
import com.practica.webAvanzada.services.PostulacionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/postulaciones")
@RequiredArgsConstructor
public class PostulacionController {

    private final PostulacionService service;

    @PostMapping
    public ResponseEntity<Postulacion> crear(@RequestBody Postulacion postulacion) {
        return new ResponseEntity<>(service.guardar(postulacion), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Postulacion>> obtenerTodos() {
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Postulacion> obtenerPorId(@PathVariable Long id) {

        Optional<Postulacion> postulacion = service.obtenerPorId(id);

        return postulacion.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Postulacion> actualizar(
            @PathVariable Long id,
            @RequestBody Postulacion postulacion) {

        Postulacion actualizada = service.actualizar(id, postulacion);

        if (actualizada == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(actualizada);
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