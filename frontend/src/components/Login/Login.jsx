import React from "react";
import "./Login.module.css";

export default function Login() {
  return (
    <main>
      <h1>Iniciar Sesión</h1>
      <form action="#">
        <label htmlFor="email">Correo</label>
        <input type="email" name="email" id="email" />
        <label htmlFor="password">Contraseña</label>
        <input type="password" name="password" id="password" />
        <button>Entrar</button>
      </form>
      <p>Crear cuenta</p>
    </main>
  );
}
