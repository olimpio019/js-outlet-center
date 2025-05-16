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
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gerenciar Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 transition"
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

      {/* Lista de Produtos */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div className="min-w-full divide-y divide-gray-200">
          {/* Cabeçalho */}
          <div className="bg-gray-50">
            <div className="grid grid-cols-12 gap-4 px-6 py-3">
              <div className="col-span-6 sm:col-span-4">
                <span className="text-xs font-medium text-gray-500 uppercase">Produto</span>
              </div>
              <div className="hidden sm:block col-span-2">
                <span className="text-xs font-medium text-gray-500 uppercase">Categoria</span>
              </div>
              <div className="col-span-3 sm:col-span-2">
                <span className="text-xs font-medium text-gray-500 uppercase">Preço</span>
              </div>
              <div className="col-span-3 sm:col-span-2">
                <span className="text-xs font-medium text-gray-500 uppercase">Estoque</span>
              </div>
              <div className="col-span-12 sm:col-span-2 text-right">
                <span className="text-xs font-medium text-gray-500 uppercase">Ações</span>
              </div>
            </div>
          </div>

          {/* Corpo da Tabela */}
          <div className="divide-y divide-gray-200">
            {filteredProdutos.map((produto) => (
              <div key={produto.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50">
                {/* Produto */}
                <div className="col-span-6 sm:col-span-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={produto.imagemUrl}
                        alt={produto.nome}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {produto.nome}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {produto.descricao}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Categoria */}
                <div className="hidden sm:block col-span-2">
                  <p className="text-sm text-gray-900">{produto.categoria.nome}</p>
                </div>

                {/* Preço */}
                <div className="col-span-3 sm:col-span-2">
                  <p className="text-sm text-gray-900">
                    R$ {produto.preco.toFixed(2)}
                  </p>
                </div>

                {/* Estoque */}
                <div className="col-span-3 sm:col-span-2">
                  <p className="text-sm text-gray-900">{produto.estoque}</p>
                </div>

                {/* Ações */}
                <div className="col-span-12 sm:col-span-2 flex justify-end space-x-2">
                  <Link
                    href={`/admin/produtos/${produto.id}/editar`}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => {
                      setProdutoToDelete(produto.id);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
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