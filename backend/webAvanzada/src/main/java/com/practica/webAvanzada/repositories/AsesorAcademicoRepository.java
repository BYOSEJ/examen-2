package com.practica.webAvanzada.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.practica.webAvanzada.models.AsesorAcademico;

@Repository
public interface AsesorAcademicoRepository extends JpaRepository<AsesorAcademico, Long> {

}
