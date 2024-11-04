import { useNavigate } from "react-router-dom";

export function TasksList(){

    const navigate = useNavigate()

    return (
        <div className="grid grid-cols-3 gap-5">
            <div 
            className="bg-zinc-200 p-3 hover:bg-zinc-300 hover_cursor-pointer"
                onClick={() =>{
                    navigate("/validacion")
                }}
>
                <h1 className='font-bold uppercase'>
                Validación de inventario
                </h1>
                <p className="text-slate-600">Revisa los errores de inventario entre dos fechas determinadas</p>
            </div>
            <div 
            className="bg-zinc-200 p-3 hover:bg-zinc-300 hover_cursor-pointer"
                onClick={() =>{
                    navigate("/exportdata")
                }}
>
                <h1 className='font-bold uppercase'>
                Facturas de exportación
                </h1>
                <p className="text-slate-600">Consulta información de facturas de exportación</p>
            </div>
            <div 
            className="bg-zinc-200 p-3 hover:bg-zinc-300 hover_cursor-pointer"
                onClick={() =>{
                    navigate("/importdata")
                }}
>
                <h1 className='font-bold uppercase'>
                Facturas de importación
                </h1>
                <p className="text-slate-600">Consulta información de facturas de importación</p>
            </div>
            <div 
            className="bg-zinc-200 p-3 hover:bg-zinc-300 hover_cursor-pointer"
                onClick={() =>{
                    navigate("/npdata")
                }}
>
                <h1 className='font-bold uppercase'>
                Consulta por número de parte
                </h1>
                <p className="text-slate-600">Consulta toda la informacion de un np en especifico</p>
            </div>
            <div 
            className="bg-zinc-200 p-3 hover:bg-zinc-300 hover_cursor-pointer"
                onClick={() =>{
                    navigate("/provision")
                }}
>
                <h1 className='font-bold uppercase'>
                Provisión de facturas
                </h1>
                <p className="text-slate-600">Provisiona facturas proximas a pagar</p>
            </div>
            <div 
            className="bg-zinc-200 p-3 hover:bg-zinc-300 hover_cursor-pointer"
                onClick={() =>{
                    navigate("/facturas")
                }}
>
                <h1 className='font-bold uppercase'>
                Consulta de facturas
                </h1>
                <p className="text-slate-600">Consulta facturas asi como su estado actual</p>
            </div>
            <div 
            className="bg-zinc-200 p-3 hover:bg-zinc-300 hover_cursor-pointer"
                onClick={() =>{
                    navigate("/ferrule")
                }}
>
                <h1 className='font-bold uppercase'>
                Ferrule program
                </h1>
                <p className="text-slate-600">Formatea Tequila Shipment Details</p>
            </div>
            <div 
            className="bg-zinc-200 p-3 hover:bg-zinc-300 hover_cursor-pointer"
                onClick={() =>{
                    navigate("/tetakawi")
                }}
>
                <h1 className='font-bold uppercase'>
                Conexion con Tetakawi
                </h1>
                <p className="text-slate-600">Valida en tiempo real el inventario de ACMA contra el de Tetakawi</p>
            </div>
        </div>
    )
}