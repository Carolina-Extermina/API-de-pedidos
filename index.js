const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Configurações
app.use(cors());
app.use(express.json()); // Para ler o JSON do body

// Rotas
app.use('/order', orderRoutes);

// Middleware de Erros Global
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});