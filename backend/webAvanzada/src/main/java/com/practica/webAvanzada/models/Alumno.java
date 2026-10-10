package com.practica.webAvanzada.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "alumnos")
public class Alumno {

    @Id
    @Column(name = "numero_control")
    private String numeroControl;

    @OneToOne
    @JoinColumn(
        name = "id_usuario",
        referencedColumnName = "id_usuario",
        nullable = false,
        unique = true
    )
    private Usuario usuario;

    @Column(nullable = false)
    private String nombreCompleto;

    @Column(nullable = false)
    private String carrera;

    @Column(nullable = false)
    private int semestre;

    @Column(columnDefinition = "TEXT")
    private String habilidadesTecnicas;

    @Column(nullable = false)
    private String estadoResidencia;
}