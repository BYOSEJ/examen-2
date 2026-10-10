package com.practica.webAvanzada.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.practica.webAvanzada.models.Postulacion;

@Repository
public interface PostulacionRepository extends JpaRepository<Postulacion, Long> {

}