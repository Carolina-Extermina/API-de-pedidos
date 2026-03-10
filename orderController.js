const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sendResponse = (res, status, data, message) => {
  res.status(status).json({ success: true, message, data });
};

exports.createOrder = async (req, res) => {
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    if (!numeroPedido || !items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Dados inválidos. Verifique o JSON.' });
    }

    const order = await prisma.order.create({
      data: {
        orderId: numeroPedido, 
        value: valorTotal,     
        creationDate: new Date(dataCriacao),
        items: {
          create: items.map(item => ({
            productId: item.idItem,
            quantity: item.quantidadeItem,
            price: item.valorItem
          }))
        }
      },
      include: { items: true } 
    });

    sendResponse(res, 201, order, 'Pedido criado com sucesso');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao criar pedido no servidor.' });
  }
};

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
