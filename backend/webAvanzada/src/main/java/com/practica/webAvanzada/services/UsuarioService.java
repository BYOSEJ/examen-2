package com.practica.webAvanzada.services;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.practica.webAvanzada.models.Usuario;
import com.practica.webAvanzada.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import java.util.Optional; 

@Service 
@RequiredArgsConstructor 


public class UsuarioService {
 private final UsuarioRepository usuarioRepository;
 private final PasswordEncoder passwordEncoder;

 public Usuario guardar(Usuario usuario){
    usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
    return usuarioRepository.save(usuario);

    }

    public List<Usuario> obtenerTodos(){
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> obtenerPorId(Long id){
        return usuarioRepository.findById(id);
        }
    

    public void eliminar(long id){
        usuarioRepository.deleteById(id);
        }

    public Usuario actualizar(Long id, Usuario usuarioActualizado){
    Optional<Usuario> existenteOptional = usuarioRepository.findById(id);
    if (existenteOptional.isEmpty()) return null;
    Usuario existente = existenteOptional.get();
    existente.setCorreo(usuarioActualizado.getCorreo());
    existente.setRol(usuarioActualizado.getRol());
    existente.setActivo(usuarioActualizado.isActivo());
    if (usuarioActualizado.getPassword() != null && !usuarioActualizado.getPassword().isBlank()) {
        existente.setPassword(passwordEncoder.encode(usuarioActualizado.getPassword()));
    }
    return usuarioRepository.save(existente);
    }

     public Usuario login(String correo,String password){
        Optional<Usuario> usuarioOptional= usuarioRepository.findByCorreo(correo);

        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();

            if (passwordEncoder.matches(password,usuario.getPassword())) {
                return usuario;
            }
        }
        return null;
    }
}