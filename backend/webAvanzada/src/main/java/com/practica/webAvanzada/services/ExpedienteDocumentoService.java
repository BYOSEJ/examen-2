package com.practica.webAvanzada.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.practica.webAvanzada.models.ExpedienteDocumento;
import com.practica.webAvanzada.repositories.ExpedienteDocumentoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpedienteDocumentoService {

    private final ExpedienteDocumentoRepository repository;

    public ExpedienteDocumento guardar(ExpedienteDocumento documento){
        return repository.save(documento);
    }

    public List<ExpedienteDocumento> obtenerTodos(){
        return repository.findAll();
    }

    public Optional<ExpedienteDocumento> obtenerPorId(Long id){
        return repository.findById(id);
    }

    public void eliminar(Long id){
        repository.deleteById(id);
    }

    public ExpedienteDocumento actualizar(Long id, ExpedienteDocumento documento){
        if(repository.existsById(id)){
            documento.setIdDocumento(id);
            return repository.save(documento);
        }
        return null;
    }
}