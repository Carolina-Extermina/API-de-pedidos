const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper para formatar resposta
const sendResponse = (res, status, data, message) => {
  res.status(status).json({ success: true, message, data });
};

// 1. Criar Pedido (Mapeamento: Input -> DB)
exports.createOrder = async (req, res) => {
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    // Validação básica
    if (!numeroPedido || !items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Dados inválidos. Verifique o JSON.' });
    }

    // Transação: Cria o Pedido e os Itens juntos
    const order = await prisma.order.create({
      data: {
        orderId: numeroPedido, // Mapeia 'numeroPedido' para 'orderId'
        value: valorTotal,     // Mapeia 'valorTotal' para 'value'
        creationDate: new Date(dataCriacao), // Mapeia 'dataCriacao'
        items: {
          create: items.map(item => ({
            productId: item.idItem,
            quantity: item.quantidadeItem,
            price: item.valorItem
          }))
        }
      },
      include: { items: true } // Retorna os itens criados
    });

    sendResponse(res, 201, order, 'Pedido criado com sucesso');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao criar pedido no servidor.' });
  }
};

// 2. Obter Pedido por ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { orderId: id },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
    }

    sendResponse(res, 200, order, 'Pedido encontrado');
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar pedido.' });
  }
};

// 3. Listar Todos
exports.listOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true }
    });
    sendResponse(res, 200, orders, 'Lista de pedidos');
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao listar pedidos.' });
  }
};

// 4. Atualizar Pedido
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { valorTotal, dataCriacao } = req.body;

    const order = await prisma.order.update({
      where: { orderId: id },
      data: {
        value: valorTotal,
        creationDate: dataCriacao ? new Date(dataCriacao) : undefined
      },
      include: { items: true }
    });

    sendResponse(res, 200, order, 'Pedido atualizado');
  } catch (error) {
    res.status(404).json({ success: false, message: 'Pedido não encontrado para atualização.' });
  }
};

// 5. Deletar Pedido
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({
      where: { orderId: id }
    });

    res.status(200).json({ success: true, message: 'Pedido deletado com sucesso.' });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Pedido não encontrado para exclusão.' });
  }
};