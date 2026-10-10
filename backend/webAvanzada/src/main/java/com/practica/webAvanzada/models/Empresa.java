package com.practica.webAvanzada.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "empresas")
public class Empresa {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEmpresa;

    @OneToOne
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;

    @Column(nullable = false)
    private String razonSocial;

    private String sector;

    private String nombreContacto;

    private String telefono;

    @Column(columnDefinition = "TEXT")
    private String direccion;

    private Boolean estadoVerificacion = false;
}
