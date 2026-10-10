package com.practica.webAvanzada.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.practica.webAvanzada.models.Alumno;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, String> {
    boolean existsByNumeroControl(String numeroControl);

}