package com.practica.webAvanzada.models;

import java.time.LocalDate;

import com.practica.webAvanzada.models.enums.EstadoProyecto;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "proyectos_residencia")
public class ProyectoResidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProyecto;

    @ManyToOne
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String objetivo;

    @Column(columnDefinition = "TEXT")
    private String tecnologiasRequeridas;

    @Column(nullable = false)
    private Integer cupoAlumnos;

    @Enumerated(EnumType.STRING)
    private EstadoProyecto estado;

    private LocalDate fechaPublicacion;
}