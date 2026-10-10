package com.practica.webAvanzada.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.practica.webAvanzada.models.Usuario;
import java.util.Optional; 


@Repository 
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
Optional<Usuario> findByCorreo(String correo);
boolean existsByCorreo(String correo);

}
