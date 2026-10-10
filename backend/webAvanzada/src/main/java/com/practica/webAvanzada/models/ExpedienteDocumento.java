package com.practica.webAvanzada.models;

import java.time.LocalDate;

import com.practica.webAvanzada.models.enums.TipoDocumento;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "expedientes_documentos")
public class ExpedienteDocumento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDocumento;

    @ManyToOne
    @JoinColumn(name = "id_postulacion", nullable = false)
    private Postulacion postulacion;

    @Enumerated(EnumType.STRING)
    private TipoDocumento tipoDocumento;

    @Column(nullable = false)
    private String rutaArchivoUrl;

    private LocalDate fechaSubida;

    private Boolean estadoAprobacion;
}