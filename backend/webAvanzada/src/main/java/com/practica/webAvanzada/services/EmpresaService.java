package com.practica.webAvanzada.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.practica.webAvanzada.models.Empresa;
import com.practica.webAvanzada.repositories.EmpresaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmpresaService {

    private final EmpresaRepository repository;

    public Empresa guardar(Empresa empresa){
        return repository.save(empresa);
    }

    public List<Empresa> obtenerTodos(){
        return repository.findAll();
    }

    public Optional<Empresa> obtenerPorId(Long id){
        return repository.findById(id);
    }

    public void eliminar(Long id){
        repository.deleteById(id);
    }

    public Empresa actualizar(Long id, Empresa empresa){
        if(repository.existsById(id)){
            empresa.setIdEmpresa(id);
            return repository.save(empresa);
        }
        return null;
    }
}