# Servicio de Usuarios

Microservicio para gestionar usuarios y autenticación del sistema de ferias gastronómicas.

## Instalación

```bash
npm install
```

## Configuración

Crear archivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=users_db

JWT_SECRET=tu-secret-key-aqui
JWT_EXPIRES_IN=24h

PORT=3001
RPC_PORT=3002
```

## Base de datos

```bash
docker-compose up -d
```

## Ejecutar

```bash
npm run start:dev
```

## Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/validate` - Validar token

### Usuarios
- `POST /users/register` - Registrar usuario
- `GET /users` - Listar usuarios (solo organizador)
- `GET /users/:id` - Ver perfil
- `PATCH /users/:id` - Actualizar perfil
- `DELETE /users/:id` - Desactivar usuario (solo organizador)

## Comunicación RPC

Otros servicios pueden llamar a:
- `validate_token` - Validar token JWT
- `validate_user` - Validar usuario por ID
- `get_user_role` - Obtener rol de usuario
- `validate_role` - Validar si usuario tiene un rol

## Roles

- `cliente` - Cliente de la feria
- `emprendedor` - Emprendedor gastronómico
- `organizador` - Organizador de la feria
