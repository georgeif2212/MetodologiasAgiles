import mongoose, { Schema } from 'mongoose';

const tareaSchema = new Schema({
  nombre: { type: String, required: true },
  materia: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia', required: false, default: null },
  estado: { type: String, default:'pendiente' ,enum: ['pendiente', 'en proceso', 'realizado']},
}, { timestamps: true });

export default mongoose.model('Tarea', tareaSchema);
