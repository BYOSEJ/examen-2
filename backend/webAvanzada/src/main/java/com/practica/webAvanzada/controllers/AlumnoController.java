package com.practica.webAvanzada.controllers;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.practica.webAvanzada.models.Alumno;
import com.practica.webAvanzada.models.dto.AlumnoRegistroRequest;
import com.practica.webAvanzada.services.AlumnoService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/alumnos")
@RequiredArgsConstructor
public class AlumnoController {
    private final AlumnoService alumnoService;
    @PostMapping public ResponseEntity<Alumno> crearAlumno(@RequestBody AlumnoRegistroRequest request) { return new ResponseEntity<>(alumnoService.crear(request), HttpStatus.CREATED); }
    @GetMapping public ResponseEntity<List<Alumno>> obtenerTodos() { return ResponseEntity.ok(alumnoService.obtenerTodos()); }
    @GetMapping("/{id}") public ResponseEntity<Alumno> obtenerPorId(@PathVariable String id) { return alumnoService.obtenerPorId(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build()); }
    @PutMapping("/{id}") public ResponseEntity<Alumno> actualizar(@PathVariable String id, @RequestBody AlumnoRegistroRequest request) { Alumno actualizado = alumnoService.actualizar(id, request); return actualizado == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(actualizado); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> eliminar(@PathVariable String id) { if (alumnoService.obtenerPorId(id).isEmpty()) return ResponseEntity.notFound().build(); alumnoService.eliminar(id); return ResponseEntity.noContent().build(); }
}
