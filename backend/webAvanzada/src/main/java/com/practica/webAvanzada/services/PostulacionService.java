package com.practica.webAvanzada.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.practica.webAvanzada.models.Alumno;
import com.practica.webAvanzada.models.Postulacion;
import com.practica.webAvanzada.models.ProyectoResidencia;
import com.practica.webAvanzada.repositories.AlumnoRepository;
import com.practica.webAvanzada.repositories.PostulacionRepository;
import com.practica.webAvanzada.repositories.ProyectoResidenciaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostulacionService {

    private final PostulacionRepository repository;
    private final AlumnoRepository alumnoRepository;
    private final ProyectoResidenciaRepository proyectoRepository;

    public Postulacion guardar(Postulacion postulacion) {

        // Buscar el alumno existente en la base de datos
        String numeroControl =
                postulacion.getAlumno().getNumeroControl();

        Alumno alumno = alumnoRepository
                .findById(numeroControl)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Alumno no encontrado: " + numeroControl));

        // Buscar el proyecto existente en la base de datos
        Long idProyecto =
                postulacion.getProyecto().getIdProyecto();

        ProyectoResidencia proyecto = proyectoRepository
                .findById(idProyecto)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Proyecto no encontrado: " + idProyecto));

        // Reemplazar los objetos enviados por los objetos
        // que realmente existen en la BD
        postulacion.setAlumno(alumno);
        postulacion.setProyecto(proyecto);

        return repository.save(postulacion);
    }

    public List<Postulacion> obtenerTodos() {
        return repository.findAll();
    }

    public Optional<Postulacion> obtenerPorId(Long id) {
        return repository.findById(id);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    public Postulacion actualizar(Long id, Postulacion postulacion) {

        if (!repository.existsById(id)) {
            return null;
        }

        String numeroControl =
                postulacion.getAlumno().getNumeroControl();

        Alumno alumno = alumnoRepository
                .findById(numeroControl)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Alumno no encontrado: " + numeroControl));

        Long idProyecto =
                postulacion.getProyecto().getIdProyecto();

        ProyectoResidencia proyecto = proyectoRepository
                .findById(idProyecto)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Proyecto no encontrado: " + idProyecto));

        postulacion.setIdPostulacion(id);
        postulacion.setAlumno(alumno);
        postulacion.setProyecto(proyecto);

        return repository.save(postulacion);
    }
}