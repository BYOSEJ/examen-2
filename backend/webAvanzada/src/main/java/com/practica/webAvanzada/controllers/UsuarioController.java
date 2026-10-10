package com.practica.webAvanzada.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



import com.practica.webAvanzada.models.Usuario;
import com.practica.webAvanzada.services.UsuarioService;

import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping ("/api/usuarios")
@RequiredArgsConstructor 

public class UsuarioController {
    
    private final UsuarioService usuarioService;

@PostMapping 
public ResponseEntity<Usuario> crear(@RequestBody Usuario usuario){
    Usuario nuevoUsuario = usuarioService.guardar(usuario);
    return ResponseEntity.ok(nuevoUsuario);
}



@GetMapping 
    public ResponseEntity<List<Usuario>> obtenerTodos(){
        return ResponseEntity.ok(usuarioService.obtenerTodos());

}

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id){
        return usuarioService.obtenerPorId(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id){
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }  

    @PutMapping ("/{id}")
    public ResponseEntity<Usuario> actualizar(
        @PathVariable Long id,
        @RequestBody  Usuario usuarioActualizado){

    Usuario usuario = usuarioService.actualizar(id, 
        usuarioActualizado); 

        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        } else{
            return ResponseEntity.notFound().build();
            }
        }

        @PostMapping ("/login")
        public ResponseEntity<?>login(@RequestBody java.util.Map<String, String> credenciales){
            String correo = credenciales.get("correo");
            String password = credenciales.get("password");

            Usuario usuarioAutentificado = usuarioService.login(correo, password);

            if (usuarioAutentificado != null) {
                return ResponseEntity.ok(usuarioAutentificado);

            } else{
                return ResponseEntity.status(401).body("Credenciales invalidas");
                }

        }
 }