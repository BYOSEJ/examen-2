package com.practica.webAvanzada.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.practica.webAvanzada.models.ProyectoResidencia;
import com.practica.webAvanzada.repositories.ProyectoResidenciaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProyectoResidenciaService {

    private final ProyectoResidenciaRepository repository;

    public ProyectoResidencia guardar(ProyectoResidencia proyecto){
        return repository.save(proyecto);
    }

    public List<ProyectoResidencia> obtenerTodos(){
        return repository.findAll();
    }

    public Optional<ProyectoResidencia> obtenerPorId(Long id){
        return repository.findById(id);
    }

    public void eliminar(Long id){
        repository.deleteById(id);
    }

    public ProyectoResidencia actualizar(Long id, ProyectoResidencia proyecto){
        if(repository.existsById(id)){
            proyecto.setIdProyecto(id);
            return repository.save(proyecto);
        }
        return null;
    }
}