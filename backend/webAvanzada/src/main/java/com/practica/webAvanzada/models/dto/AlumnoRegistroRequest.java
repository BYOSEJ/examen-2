package com.practica.webAvanzada.models.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AlumnoRegistroRequest {
    private String nombreCompleto;
    private String carrera;
    private String estadoResidencia;
    private String habilidadesTecnicas;
    private Integer semestre;
    private String correo;
    private String password;
}
