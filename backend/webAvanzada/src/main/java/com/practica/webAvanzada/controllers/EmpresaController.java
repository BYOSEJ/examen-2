package com.practica.webAvanzada.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.practica.webAvanzada.models.Empresa;
import com.practica.webAvanzada.services.EmpresaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/empresas")
@RequiredArgsConstructor
public class EmpresaController {

    private final EmpresaService service;

    @PostMapping
    public ResponseEntity<Empresa> crear(@RequestBody Empresa empresa) {
        return new ResponseEntity<>(service.guardar(empresa), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Empresa>> obtenerTodos() {
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empresa> obtenerPorId(@PathVariable Long id) {

        Optional<Empresa> empresa = service.obtenerPorId(id);

        return empresa.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Empresa> actualizar(
            @PathVariable Long id,
            @RequestBody Empresa empresa) {

        Empresa actualizada = service.actualizar(id, empresa);

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