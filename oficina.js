function getNombre(id) {
    let nombre='';
    const objeto = [
        {
            id : 42,
            nombre : 'AMAZONAS'
        },
        {
            id : 43,
            nombre : 'ANCASH'
        },
        {
            id : 44,
            nombre : 'APURIMAC'
        },
        {
            id : 45,
            nombre : 'AREQUIPA'
        },
        {
            id : 46,
            nombre : 'AYACUCHO'
        },
        {
            id : 47,
            nombre : 'CAJAMARCA'
        },
        {
            id : 48,
            nombre : 'CUSCO'
        },
        {
            id : 49,
            nombre : 'HUANCAVELICA'
        },
        {
            id : 50,
            nombre : 'HUANUCO'
        },
        {
            id : 51,
            nombre : 'ICA'
        },
        {
            id : 52,
            nombre : 'JUNIN'
        },  
        {
            id : 41,
            nombre : 'LAMBAYEQUE'
        },
        {
            id : 53,
            nombre : 'LA LIBERTAD'
        },
        {
            id : 54,
            nombre : 'LORETO'
        },
        {
            id : 55,
            nombre : 'MADRE DE DIOS'
        },
        {
            id : 56,
            nombre : 'MOQUEGUA'
        },
        {
            id : 57,
            nombre : 'PASCO'
        },
        {
            id : 58,
            nombre : 'PIURA'
        },
        {
            id : 59,
            nombre : 'PUNO'
        },
        {
            id : 60,
            nombre : 'SAN MARTIN'
        },
        {
            id : 61,
            nombre : 'TACNA'
        },
        {
            id : 62,
            nombre : 'TUMBRE'
        },
        {
            id : 63,
            nombre : 'UCAYALI'
        },
        {
            id : 70,
            nombre : 'LIMA NORTE'
        },
        {
            id : 71,
            nombre : 'LIMA SUR'
        },
    ];

    objeto.forEach(registro=>{
        if(registro.id == id){
            nombre = registro.nombre;
        }
    });
    return nombre;
}
