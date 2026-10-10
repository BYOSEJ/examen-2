package com.practica.webAvanzada.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.practica.webAvanzada.models.AsesorAcademico;
import com.practica.webAvanzada.repositories.AsesorAcademicoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AsesorAcademicoService {

    private final AsesorAcademicoRepository repository;

    public AsesorAcademico guardar(AsesorAcademico asesor){
        return repository.save(asesor);
    }

    public List<AsesorAcademico> obtenerTodos(){
        return repository.findAll();
    }

    public Optional<AsesorAcademico> obtenerPorId(Long id){
        return repository.findById(id);
    }

    public void eliminar(Long id){
        repository.deleteById(id);
    }

    public AsesorAcademico actualizar(Long id, AsesorAcademico asesor){
        if(repository.existsById(id)){
            asesor.setIdAsesor(id);
            return repository.save(asesor);
        }
        return null;
    }
}