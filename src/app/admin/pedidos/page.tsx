"use client";
import { useState, useEffect } from 'react';
import { Search, Package, PackageCheck, PackageX } from 'lucide-react';
import Image from 'next/image';

interface Item {
  id: number;
  quantidade: number;
  preco: number;
  produto: {
    nome: string;
    preco: number;
    imagemUrl: string;
  };
}

interface Pedido {
  id: number;
  status: string;
  total: number;
  criadoEm: string;
  usuario: {
    nome: string;
    email: string;
  };
  itens: Item[];
}

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await fetch('/api/admin/pedidos');
      const data = await response.json();
      setPedidos(data);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/pedidos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setPedidos(pedidos.map(pedido => 
          pedido.id === id ? { ...pedido, status: newStatus } : pedido
        ));
      }
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
    }
  };

  const filteredPedidos = pedidos.filter(pedido =>
    pedido.usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.id.toString().includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAGO':
        return 'bg-blue-100 text-blue-800';
      case 'ENVIADO':
        return 'bg-green-100 text-green-800';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return <Package className="w-4 h-4" />;
      case 'PAGO':
        return <PackageCheck className="w-4 h-4" />;
      case 'ENVIADO':
        return <PackageCheck className="w-4 h-4" />;
      case 'CANCELADO':
        return <PackageX className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Pedidos</h1>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative">
        <input
          type="text"
          placeholder="Pesquisar pedidos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {filteredPedidos.map((pedido) => (
          <div key={pedido.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Pedido #{pedido.id}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(pedido.criadoEm).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pedido.status)}`}>
                  {getStatusIcon(pedido.status)}
                  {pedido.status}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Cliente</h4>
              <p className="text-sm text-gray-900">{pedido.usuario.nome}</p>
              <p className="text-sm text-gray-500">{pedido.usuario.email}</p>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Produtos</h4>
              <div className="space-y-2">
                {pedido.itens.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src={item.produto.imagemUrl}
                        alt={item.produto.nome}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.produto.nome}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.quantidade} x R$ {item.produto.preco.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      R$ {(item.quantidade * item.produto.preco).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t pt-4">
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStatus(pedido.id, 'PAGO')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    pedido.status === 'PAGO'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-blue-50'
                  }`}
                >
                  Marcar como Pago
                </button>
                <button
                  onClick={() => handleUpdateStatus(pedido.id, 'ENVIADO')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    pedido.status === 'ENVIADO'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-green-50'
                  }`}
                >
                  Marcar como Enviado
                </button>
                <button
                  onClick={() => handleUpdateStatus(pedido.id, 'CANCELADO')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    pedido.status === 'CANCELADO'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-red-50'
                  }`}
                >
                  Cancelar Pedido
                </button>
              </div>
              <p className="text-lg font-bold text-gray-900">
                Total: R$ {pedido.total.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 