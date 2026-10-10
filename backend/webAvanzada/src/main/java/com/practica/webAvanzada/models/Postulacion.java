package com.practica.webAvanzada.models;

import java.time.LocalDate;

import com.practica.webAvanzada.models.enums.EstadoPostulacion;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "postulaciones")
public class Postulacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPostulacion;

    @ManyToOne
    @JoinColumn(name = "numero_control", nullable = false)
    private Alumno alumno;

    @ManyToOne
    @JoinColumn(name = "id_proyecto", nullable = false)
    private ProyectoResidencia proyecto;

    private LocalDate fechaSolicitud;

    @Enumerated(EnumType.STRING)
    private EstadoPostulacion estado;

    @Column(columnDefinition = "TEXT")
    private String comentariosEmpresa;
}
