import mongoose, { Schema } from 'mongoose';

const tareaSchema = new Schema({
  nombre: { type: String, required: true },
  materia: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia', required: false },
  estado: { type: String, enum: ['pendiente', 'en proceso', 'realizado'], required: true },
}, { timestamps: true });

export default mongoose.model('Tarea', tareaSchema);
