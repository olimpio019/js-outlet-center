"use client";
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl: string;
  estoque: number;
  categoria: {
    nome: string;
  };
}

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [produtoToDelete, setProdutoToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const response = await fetch('/api/admin/produtos', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao carregar produtos');
      }

      const data = await response.json();
      setProdutos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar produtos');
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/produtos/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== id));
        setShowDeleteModal(false);
        setProdutoToDelete(null);
        toast.success('Produto deletado com sucesso!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao deletar produto');
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      toast.error('Erro ao deletar produto');
    }
  };

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchProdutos}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Adicionar Produto</span>
        </Link>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative">
        <input
          type="text"
          placeholder="Pesquisar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estoque
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProdutos.map((produto) => (
              <tr key={produto.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={produto.imagemUrl}
                        alt={produto.nome}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {produto.nome}
                      </div>
                      <div className="text-sm text-gray-500">
                        {produto.descricao}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{produto.categoria.nome}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    R$ {produto.preco.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{produto.estoque}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/produtos/${produto.id}/editar`}
                    className="text-red-600 hover:text-red-900 mr-4"
                  >
                    <Edit className="w-5 h-5 inline-block" />
                  </Link>
                  <button
                    onClick={() => {
                      setProdutoToDelete(produto.id);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5 inline-block" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
            <p className="mb-6">
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProdutoToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => produtoToDelete && handleDelete(produtoToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 