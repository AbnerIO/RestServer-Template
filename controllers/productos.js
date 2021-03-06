const {response} = require("express");
const { Categoria } = require("../models/index.js");
const producto = require("../models/producto.js");
const Producto = require("../models/producto.js");

const actualizarProducto =async(req,res)=>{
    
    const { id } = req.params;
    const {estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const producto = await Producto.findOneAndUpdate(id, data, {new:true});
    res.status(201).json({
        producto
    })
}

const borrarProducto = async (req, res) => {
    const usuario = req.usuario._id;
    const { id } = req.params;
    const productoDB = await Producto.findByIdAndUpdate(id, { estado: false, usuario }, {new:true})
    res.status(201).json(productoDB)
}

const obtenerProductos = async(req, res=response)=> {
    
    const { limite = 5, desde = 0 } = req.query;

    const [productos, total] = await Promise.all([
        Producto.find({ estado: true }).populate("usuario", "nombre").skip(Number(desde))
            .limit(Number(limite)), Producto.countDocuments({ estado: true })
    ])
    res.status(200).json({ total, productos });
}

const obtenerProducto= async(req, res)=>{
    const {id} = req.params;
    const productoDB = await Producto.findById(id).populate("usuario", "nombre");
    res.status(200).json({
        productoDB
    })
}
const crearProducto = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const category = req.body.categoria.toUpperCase();
    const productoDB = await Producto.findOne({ nombre });
    const categoria = await Categoria.findOne({nombre: category});
    if (!categoria) {
        return res.status(401).json({
            msg: `Esa categoría no existe: ${category}`
        })
    }
    if (productoDB) {
        return res.status(401).json({
            msg: `El Producto ${nombre} ya existe`
        })
    }

    //generar los datos
    const data = {
        nombre,
        usuario: req.usuario._id,
        categoria
    }
    const producto = new Producto(data);

    //guardar db
    await producto.save();

    res.status(201).json({
        producto
    })
}
module.exports={
    actualizarProducto,
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    borrarProducto
}
