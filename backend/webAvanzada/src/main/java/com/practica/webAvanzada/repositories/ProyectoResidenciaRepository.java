package com.practica.webAvanzada.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.practica.webAvanzada.models.ProyectoResidencia;

@Repository
public interface ProyectoResidenciaRepository extends JpaRepository<ProyectoResidencia, Long> {

}