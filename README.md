# Nodepop API
## Version Actual: 1.0
## Introduction
Este proyecto contiene el API de Nodepop, que será consumido por aplicaciones IOS y Android. Nodepop es una app de venta de artículos de segunda mano. 
Los servicios de Nodepop permitirán buscar artículos de segunda mano pudiendo aplicar filtros de busqueda, así como devolver los resultados paginados. 

### Despliegue del Servicio en Amazon AWS
Se ha adquirido un dominio llamado **luegodonde.com**, y se ha creado un subdominio específico (**services**) que apunta a la instancia de Amazon EC2 en la que está desplegado el Api de Nodepop **http://services.luegodonde.com**

Los recursos estáticos los devolverá directamente el NGINX, mientras que las peticiones al Api NGINX las delegará en node.

Ejemplos de llamadas a estaticos (En todas ellas, se devuelve la cabecera **X-Owner** con valor **esnerume**, que es el nombre de mi cuenta de GitHub. Se puede ver además que no pasa por node ya que en estas llemadas no se devuelve la cabecera **X-Powered-By:Express**, como ocurre en las llamadas al Api):

**http://services.luegodonde.com/stylesheets/style.css**

**http://services.luegodonde.com/images/anuncios/bici.jpg**

**http://services.luegodonde.com/images/anuncios/iphone.jpg**

**Nota:** La ip de la máquina en amazon es **34.192.211.34**, por lo que para acceder a la plantilla web de **startbootstrap.com** se puede acceder a traves de http://34.192.211.34

Adicionalmente he asociado otra plantilla a **http://www.luegodonde.com/**

### Operaciones disponibles del API:
- Registro (nombre, email, contraseña)
- Autenticación (email, contraseña)
- Lista de anuncios paginada. Con filtros por tag, tipo de anuncio (venta o búsqueda), rango de precio (precio min. y precio max.) y nombre de artículo (que empiece por el dato buscado)
- Lista de tags existentes


### Endpoints
Todas las llamadas POST que se envíen al API deben llevar el siguiente content-type: **x-www-form-urlencoded**.

Todos los endpoints devolverán el resultado con formato JSON, tanto en el caso de que la operación se ejecute correctamente, como si se ha producido un error. 
En caso de que la llamada se ejecute correctamente, el servidor devolverá la clave **success** a **true**, y en caso de error, la clave **success** valdrá **false** y 
vendrá acompañada de una clave **error** que contendrá una descripción del error. 


Para que los mensajes de error de la aplicación se devuelvan en un idioma predeterminado (Español o Inglés), todas las llamadas deben llevar la cabecera **api-language** pudiendo tener como posibles valores (**es** o **en**). 

**NOTA:** En caso de no proporcionar esta cabecera, los mensajes de error se devolverán en español.


##### POST /usuarios/authenticate 

Este endpoint permite autenticar al usuario (pasándole el usuario y el password) y en caso de existir en el sistema y coindicir la password, devolverá un token JWT, que deberá ser enviado
en las siguientes peticiones para poder acceder a los servicios del api

Parámetros POST:
- user
- pass

Ejemplo de respuesta ok:
```
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InJ1YmVuLm1lcmlub0BnbWFpbC5jb20iLCJpYXQiOjE0Nzc4NTc4ODksImV4cCI6MTQ3ODAzMDY4OX0.KljrC0oWHhL8VFViTj3Fv6UmOT4_yxoFu7Ma6W8QFpE"
}
```

Ejemplo de respuesta erronea:
```
{
  "success": false,
  "error": "Credenciales inválidas. Por favor comprueba que has escrito bien el usuario y el password."
}
```


##### POST /usuarios/register
Parámetros POST:
- name (Nombre del usuario)
- user (Email del usuario que será el identificador en el login de usuario)
- pass (password del usuario)

Ejemplo de respuesta ok:
```
{
  "success": true,
  "usuario": "probando@gmail.com"
}
```
Ejemplo de respuesta erronea:
```
{
  "success": false,
  "error": "El usuario que intentas registrar ya existe en el sistema."
}
```


Las siguientes llamadas al api deben contener el token JWT, que se puede proporcionar como cabecera http (**x-access-token**) o como un parametro en la query string llamado **token**.

Esto es así porque todas las llamadas al api deben realizarse con un usuario registrado.


##### GET /apiv1/tags

Este endpoint devuelve los tags disponibles en el sistema. Estos tags podrá ser utilizados en los anuncios dados de alta.

Ejemplo de respuesta ok:
```
{
  "success": true,
  "tags": [
    "work",
    "lifestyle",
    "motor",
    "mobile"
  ]
}
```

Ejemplo de llamada erronea:
```
{
  "success": false,
  "error": "No se ha proporcionado el token. Para acceder a la funcionalidad del API, debes disponer de un token válid."
}
```


##### GET /apiv1/anuncios

Este endpoint devuelve los anuncios dados de alta en el sistema pudiendole aplicar filtros de búsqueda.

Parametros de la query string:

- tag (Tag que esté contenido en el anuncio)
- venta (los valores de venta pueden ser true o false, para indicar si se está vendiendo o buscando el artículo)
- nombre (Nombre del artículo. La busqueda no será case sensitive y además se podrá buscar por el comienzo del nombre)
- precio (rango de precio (precio min. y precio max.), podemos usar una de estas  combinaciones :
         ○ 10-50 buscará anuncios con precio incluido entre estos valores
         ○ 10- buscará los que tengan precio mayor que 10
         ○ -50 buscará los que tengan precio menor de 50 
         ○ 50 buscará los que tengan precio igual a 50 
- start (El parametro start indicará el anuncio desde el el cual queremos empezar a listar. Este parametro sirve para la paginación)
- limit (Número de registros a mostrar. Este parámetro puede tener relación con el parámetro start, en caso de estar informado.)
- sort (campo por el que se podrá ordenar)
- includeTotal (En caso de estar informado este campo, se mostrará el número de documentos que cumplen el filtro de búsqueda, independientemente del start y limit que se haya puesto)


Ejemplo de respuesta ok:
```
{
  "success": true,
  "anuncios": [
    {
      "_id": "5815ad8fd24bff0a70473c6e",
      "nombre": "Bicicleta",
      "venta": true,
      "precio": 230.15,
      "foto": "bici.jpg",
      "tags": [
        "lifestyle",
        "motor"
      ]
    },
    {
      "_id": "5815ad8fd24bff0a70473c6f",
      "nombre": "iPhone 6S",
      "venta": false,
      "precio": 850,
      "foto": "iphone.jpg",
      "tags": [
        "lifestyle",
        "mobile"
      ]
    }
  ]
}
```

Ejemplo de llamada erronea:
```
{
  "success": false,
  "error": "No se ha proporcionado el token. Para acceder a la funcionalidad del API, debes disponer de un token válid."
}
```

Ejemplo de llamada al servicio:

**GET** 

http://localhost:3000/apiv1/anuncios?**tag**=mobile&**venta**=false&**nombre**=ip&**precio**=50-&**start**=0&**limit**=2&**sort**=precio&**includeTotal**=true

**Ejemplo en Amazon AWS**

http://services.luegodonde.com/apiv1/anuncios?**tag**=mobile&**venta**=false&**nombre**=ip&**precio**=50-&**start**=0&**limit**=2&**sort**=precio&**includeTotal**=true


### Utilidades

Se ha desarrollado un script que elimina la bd y carga unos anunucios y un usuario en la bd. Para ejecutar el script bastará con ejecutar el comando

```
npm run installDB
```


### Iniciar servidor

Para iniciar el servidor de express bastará con ejecutar el siguiente comando:

```
npm start
```
