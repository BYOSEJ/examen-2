package com.practica.webAvanzada.services;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.practica.webAvanzada.models.Alumno;
import com.practica.webAvanzada.models.Usuario;
import com.practica.webAvanzada.models.dto.AlumnoRegistroRequest;
import com.practica.webAvanzada.models.enums.RoleUsuario;
import com.practica.webAvanzada.repositories.AlumnoRepository;
import com.practica.webAvanzada.repositories.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AlumnoService {
    private final AlumnoRepository alumnoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom random = new SecureRandom();
    private static final Set<String> ESTADOS = Set.of("PENDIENTE", "EN_PROCESO", "FINALIZADA");

    @Transactional
    public Alumno crear(AlumnoRegistroRequest request) {
        validar(request, true);
        if (usuarioRepository.existsByCorreo(request.getCorreo().trim().toLowerCase())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una cuenta con ese correo.");
        }
        String numero = generarNumeroControl();
        Usuario usuario = new Usuario();
        usuario.setCorreo(request.getCorreo().trim().toLowerCase());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(RoleUsuario.ALUMNO);
        usuario.setActivo(true);
        usuario = usuarioRepository.save(usuario);
        Alumno alumno = new Alumno();
        alumno.setNumeroControl(numero);
        alumno.setUsuario(usuario);
        aplicar(alumno, request);
        return alumnoRepository.save(alumno);
    }

    public List<Alumno> obtenerTodos() { return alumnoRepository.findAll(); }
    public Optional<Alumno> obtenerPorId(String id) { return alumnoRepository.findById(id); }

    @Transactional
    public Alumno actualizar(String id, AlumnoRegistroRequest request) {
        Alumno alumno = alumnoRepository.findById(id).orElse(null);
        if (alumno == null) return null;
        validar(request, false);
        Usuario usuario = alumno.getUsuario();
        if (request.getCorreo() != null && !request.getCorreo().isBlank()) {
            String correo = request.getCorreo().trim().toLowerCase();
            usuarioRepository.findByCorreo(correo).ifPresent(otro -> {
                if (!otro.getIdUsuario().equals(usuario.getIdUsuario())) throw new ResponseStatusException(HttpStatus.CONFLICT, "Ese correo ya está registrado.");
            });
            usuario.setCorreo(correo);
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuarioRepository.save(usuario);
        aplicar(alumno, request);
        return alumnoRepository.save(alumno);
    }

    @Transactional
    public void eliminar(String id) {
        Alumno alumno = alumnoRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Alumno no encontrado."));
        Long usuarioId = alumno.getUsuario() == null ? null : alumno.getUsuario().getIdUsuario();
        alumnoRepository.delete(alumno);
        alumnoRepository.flush();
        if (usuarioId != null) {
            // La cuenta se elimina junto con el alumno; si otras entidades la referencian, la transacción informa del conflicto.
            usuarioRepository.deleteById(usuarioId);
        }
    }

    private void aplicar(Alumno a, AlumnoRegistroRequest r) {
        a.setNombreCompleto(r.getNombreCompleto().trim());
        a.setCarrera(r.getCarrera().trim());
        a.setEstadoResidencia(r.getEstadoResidencia().trim().toUpperCase());
        a.setHabilidadesTecnicas(r.getHabilidadesTecnicas() == null || r.getHabilidadesTecnicas().isBlank() ? null : r.getHabilidadesTecnicas().trim());
        a.setSemestre(r.getSemestre());
    }

    private void validar(AlumnoRegistroRequest r, boolean crear) {
        if (r == null || r.getNombreCompleto() == null || r.getNombreCompleto().isBlank() || r.getCarrera() == null || r.getCarrera().isBlank() || r.getEstadoResidencia() == null || !ESTADOS.contains(r.getEstadoResidencia().trim().toUpperCase()) || r.getSemestre() == null || r.getSemestre() < 1 || r.getSemestre() > 12) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nombre, carrera, estado de residencia válido y semestre (1 a 12) son obligatorios.");
        }
   if (crear && (r.getCorreo() == null || !r.getCorreo().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$") || r.getPassword() == null || r.getPassword().length() < 8)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Se requiere un correo válido y una contraseña de al menos 8 caracteres para crear la cuenta del alumno.");
        }
    }

    private String generarNumeroControl() {
        for (int i = 0; i < 1000; i++) {
            String n = String.format("%08d", 10_000_000 + random.nextInt(90_000_000));
            if (!alumnoRepository.existsByNumeroControl(n)) return n;
        }
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No fue posible generar un número de control único.");
    }
}
