package com.practica.webAvanzada.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.practica.webAvanzada.models.ExpedienteDocumento;

@Repository
public interface ExpedienteDocumentoRepository extends JpaRepository<ExpedienteDocumento, Long> {

}