import {Link} from 'react-router-dom'
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export function Navigation(){
    const [dropdownOpenInv, setDropdownOpenInv] = useState(false);
    const [dropdownOpenAcc, setDropdownOpenAcc] = useState(false);
    const [dropdownOpenProg, setDropdownOpenProg] = useState(false);
    const [dropdownOpenTkw, setDropdownOpenTkw] = useState(false);
    const [dropdownOpenWare, setDropdownOpenWare] = useState(false);
    const [dropdownOpenTool, setDropdownOpenTool] = useState(false);
    const [dropdownOpenProd, setDropdownOpenProd] = useState(false);
    const navigate = useNavigate()
    return(
        <div>
            <header className='header'>            
            <Link to= "/pxg">
            <h1 className='h1-with-image'>
                <img src="/logo2.png" alt="Logo" />
            </h1>

            </Link>
            <nav className="nav">
                <div 
                    className="dropdown" 
                    onMouseEnter={() => setDropdownOpenInv(true)} 
                    onMouseLeave={() => setDropdownOpenInv(false)}
                >
                <a>Inventory</a>
                    {dropdownOpenInv && (
                <div className="dropdown-content">
                    <a onClick={()=>{navigate("/validation")}}>Validation</a>
                    <a onClick={()=>{navigate("/exportdata")}}>Export</a>
                    <a onClick={()=>{navigate("/importdata")}}>Import</a>
                    <a onClick={()=>{navigate("/npdata")}}>Balance</a>
                </div>
                )}
                </div>
                <div 
                    className="dropdown" 
                    onMouseEnter={() => setDropdownOpenAcc(true)} 
                    onMouseLeave={() => setDropdownOpenAcc(false)}
                >
                <a>Accounting</a>
                    {dropdownOpenAcc && (
                <div className="dropdown-content">
                    <a onClick={()=>{navigate("/facturas")}}>Invoices</a>
                </div>
                )}
                </div>
                <div 
                    className="dropdown" 
                    onMouseEnter={() => setDropdownOpenProg(true)} 
                    onMouseLeave={() => setDropdownOpenProg(false)}
                >
                <a>Shipment</a>
                    {dropdownOpenProg && (
                <div className="dropdown-content">
                    <a onClick={()=>{navigate("/ferrule")}}>Ferrule</a>
                    <a onClick={()=>{navigate("/amazon")}}>Amazon</a>
                </div>
                )}
                </div>
                <div 
                    className="dropdown" 
                    onMouseEnter={() => setDropdownOpenWare(true)} 
                    onMouseLeave={() => setDropdownOpenWare(false)}
                >
                <a>Warehouse</a>
                    {dropdownOpenWare && (
                <div className="dropdown-content">
                    <a onClick={()=>{navigate("/receip")}}>Receip</a>
                    <a onClick={()=>{navigate("/locations")}}>Locations</a>
                </div>
                )}
                </div>
                <div 
                    className="dropdown" 
                    onMouseEnter={() => setDropdownOpenTool(true)} 
                    onMouseLeave={() => setDropdownOpenTool(false)}
                >
                <a>Tool Crib</a>
                    {dropdownOpenTool && (
                <div className="dropdown-content">
                    <a onClick={()=>{navigate("/toolcrib")}}>Tool Crib</a>
                </div>
                )}
                </div>
                <div 
                    className="dropdown" 
                    onMouseEnter={() => setDropdownOpenProd(true)} 
                    onMouseLeave={() => setDropdownOpenProd(false)}
                >
                <a>Production</a>
                    {dropdownOpenProd && (
                <div className="dropdown-content">
                    <a onClick={()=>{navigate("/production")}}>Production</a>
                    <a onClick={()=>{navigate("/scrap")}}>Scrap</a>
                </div>
                )}
                </div>
                <div 
                    className="dropdown" 
                    onMouseEnter={() => setDropdownOpenTkw(true)} 
                    onMouseLeave={() => setDropdownOpenTkw(false)}
                >
                <a>Tetakawi</a>
                    {dropdownOpenTkw && (
                <div className="dropdown-content">
                    <a onClick={()=>{navigate("/tetakawi")}}>Validation</a>
                </div>
                )}
                </div>
            </nav>
            </header>
        </div>
    )
}